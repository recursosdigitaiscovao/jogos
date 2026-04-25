let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let selecaoAtual = []; // Guarda as letras selecionadas na sequência
let isDragging = false;
let ultimaLetraSelecionada = null;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DA INTRO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
            <div style="position:relative; width:150px; height:150px; display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:60px; z-index:2;">
                <div class="demo-ring" style="position:absolute; width:120px; height:120px; border:4px dashed var(--primary-blue); border-radius:50%; animation: spin 10s linear infinite;"></div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue);">LIGA AS LETRAS POR ORDEM!</p>
        </div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>`;
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    iniciarTimer(); 
    proximaRodada(); 
};

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoInicio = Date.now();
    intervaloTimer = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        document.getElementById('timer-val').innerText = `${Math.floor(decorrido/60).toString().padStart(2,'0')}:${(decorrido%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= itensAtuais.length) { finalizarJogo(); return; }
    selecaoAtual = [];
    ultimaLetraSelecionada = null;
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(itensAtuais[indiceAtual]);
}

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 600;
    const letras = item.nome.split('');
    const letrasEmbaralhadas = [...letras].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; user-select:none;">
            
            <!-- Palavra sendo formada -->
            <div id="word-display" style="display:flex; gap:8px; margin-top:10px; min-height:50px;">
                ${letras.map((_, i) => `
                    <div class="char-box" id="char-${i}" style="width:35px; height:45px; border-bottom:4px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; color:var(--primary-blue);"></div>
                `).join('')}
            </div>

            <!-- Roda de Letras -->
            <div id="letter-wheel" style="position:relative; width:${isMobile?'260px':'320px'}; height:${isMobile?'260px':'320px'}; display:flex; align-items:center; justify-content:center;">
                
                <!-- Imagem no Centro -->
                <div style="width:${isMobile?'100px':'130px'}; height:${isMobile?'100px':'130px'}; background:white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,0,0,0.1); z-index:5;">
                    <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width:80%; max-height:80%; object-fit:contain;">
                </div>

                <!-- SVG para as linhas de ligação -->
                <svg id="conn-svg" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:3;"></svg>

                <!-- Letras ao Redor -->
                ${letrasEmbaralhadas.map((letra, i) => {
                    const angle = (i * (360 / letrasEmbaralhadas.length)) * (Math.PI / 180);
                    const radius = isMobile ? 100 : 125;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return `
                        <div class="wheel-letter" 
                             data-letra="${letra}"
                             data-id="${i}"
                             style="position:absolute; transform:translate(${x}px, ${y}px); width:50px; height:50px; background:white; border:3px solid var(--primary-blue); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:900; color:var(--primary-blue); cursor:pointer; box-shadow:0 4px 0 var(--primary-dark); z-index:10; transition:0.2s;">
                            ${letra}
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="height:20px;"></div>
        </div>`;

    // Eventos de interação
    const wheel = document.getElementById('letter-wheel');
    const lettersElements = document.querySelectorAll('.wheel-letter');

    lettersElements.forEach(el => {
        // Mouse
        el.onmousedown = (e) => startSelection(el);
        el.onmouseenter = (e) => { if(isDragging) continueSelection(el); };
        
        // Touch
        el.ontouchstart = (e) => { e.preventDefault(); startSelection(el); };
    });

    window.onmouseup = () => endSelection();
    window.ontouchend = () => endSelection();
    
    // Para Touchmove (precisa de verificação por ponto)
    wheel.ontouchmove = (e) => {
        if(!isDragging) return;
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if(target && target.classList.contains('wheel-letter')) {
            continueSelection(target);
        }
    };
}

function startSelection(el) {
    isDragging = true;
    selecaoAtual = [];
    document.querySelectorAll('.wheel-letter').forEach(l => {
        l.style.background = "white";
        l.style.color = "var(--primary-blue)";
    });
    clearLines();
    continueSelection(el);
}

function continueSelection(el) {
    const letra = el.getAttribute('data-letra');
    const id = el.getAttribute('data-id');

    // Se já selecionou esta letra nesta sequência, ignora (exceto se for a última para permitir voltar)
    if (selecaoAtual.find(s => s.id === id)) return;

    selecaoAtual.push({ letra, id, x: el.offsetLeft + 25, y: el.offsetTop + 25 });
    
    // Feedback Visual
    el.style.background = "var(--primary-blue)";
    el.style.color = "white";
    
    atualizarPalavraTopo();
    desenharLinhas();
    ultimaLetraSelecionada = el;
}

function atualizarPalavraTopo() {
    const boxes = document.querySelectorAll('.char-box');
    boxes.forEach((box, i) => {
        box.innerText = selecaoAtual[i] ? selecaoAtual[i].letra : "";
    });
}

function desenharLinhas() {
    const svg = document.getElementById('conn-svg');
    if(!svg) return;
    svg.innerHTML = "";
    for (let i = 0; i < selecaoAtual.length - 1; i++) {
        const p1 = selecaoAtual[i];
        const p2 = selecaoAtual[i+1];
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", p1.x); line.setAttribute("y1", p1.y);
        line.setAttribute("x2", p2.x); line.setAttribute("y2", p2.y);
        line.setAttribute("stroke", "var(--primary-blue)");
        line.setAttribute("stroke-width", "6");
        line.setAttribute("stroke-linecap", "round");
        svg.appendChild(line);
    }
}

function clearLines() {
    const svg = document.getElementById('conn-svg');
    if(svg) svg.innerHTML = "";
}

function endSelection() {
    if (!isDragging) return;
    isDragging = false;

    const palavraFormada = selecaoAtual.map(s => s.letra).join('');
    const palavraCorreta = itensAtuais[indiceAtual].nome;

    if (palavraFormada.length === palavraCorreta.length) {
        verificarResposta(palavraFormada, palavraCorreta);
    } else {
        // Se soltou e não acabou a palavra, reseta com erro visual se houver algo
        if(palavraFormada.length > 0) resetRodadaErro();
    }
}

function verificarResposta(formada, correta) {
    document.getElementById('game-main-content').style.pointerEvents = 'none';
    const boxes = document.querySelectorAll('.char-box');
    const letters = document.querySelectorAll('.wheel-letter');
    const acerto = formada === correta;

    const cor = acerto ? '#7ed321' : '#ff5e5e';
    
    // Pinta tudo (letras e caixas)
    boxes.forEach(b => { if(b.innerText !== "") b.style.color = cor; b.style.borderColor = cor; });
    document.querySelectorAll('line').forEach(l => l.setAttribute("stroke", cor));
    selecaoAtual.forEach(s => {
        const el = document.querySelector(`[data-id="${s.id}"]`);
        if(el) { el.style.background = cor; el.style.borderColor = cor; }
    });

    if (acerto) {
        acertos++; somAcerto.play();
    } else {
        erros++; somErro.play();
    }

    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;

    setTimeout(() => {
        document.getElementById('game-main-content').style.pointerEvents = 'all';
        indiceAtual++;
        proximaRodada();
    }, 1200);
}

function resetRodadaErro() {
    // Pequena animação de erro e limpa
    document.querySelectorAll('.char-box').forEach(b => b.innerText = "");
    document.querySelectorAll('.wheel-letter').forEach(l => {
        l.style.background = "white";
        l.style.color = "var(--primary-blue)";
    });
    clearLines();
    selecaoAtual = [];
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
