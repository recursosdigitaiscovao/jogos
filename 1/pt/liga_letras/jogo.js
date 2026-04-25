let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let selecaoAtual = []; 
let isDragging = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
            <div style="position:relative; width:160px; height:160px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:100%; height:100%; border:4px dashed var(--primary-blue); border-radius:50%; animation: spin 15s linear infinite;"></div>
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px; z-index:2; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1));">
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-align:center;">LIGA AS LETRAS POR ORDEM!</p>
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
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(itensAtuais[indiceAtual]);
}

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 600;
    const letrasOriginais = item.nome.split('');
    const letrasWheel = [...letrasOriginais].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; user-select:none; touch-action:none;">
            
            <div id="word-display" style="display:flex; gap:10px; margin-top:10px; min-height:60px; align-items:center;">
                ${letrasOriginais.map((_, i) => `<div class="char-box" id="char-${i}" style="width:35px; height:50px; border-bottom:5px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:900; color:var(--primary-blue); transition: 0.2s;"></div>`).join('')}
            </div>

            <div id="wheel-container" style="position:relative; width:${isMobile?'270px':'340px'}; height:${isMobile?'270px':'340px'}; display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.3); border-radius: 50%;">
                
                <div style="width:${isMobile?'100px':'140px'}; height:${isMobile?'100px':'140px'}; background:white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 25px rgba(0,0,0,0.1); z-index:5;">
                    <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width:80%; max-height:80%; object-fit:contain;">
                </div>

                <svg id="conn-svg" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:3;"></svg>

                ${letrasWheel.map((letra, i) => {
                    const angle = (i * (360 / letrasWheel.length)) * (Math.PI / 180);
                    const radius = isMobile ? 105 : 130;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return `
                        <div class="wheel-letter" 
                             data-letra="${letra}"
                             data-id="${i}"
                             style="position:absolute; transform:translate(${x}px, ${y}px); width:55px; height:55px; background:white; border:3px solid var(--primary-blue); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:900; color:var(--primary-blue); cursor:pointer; box-shadow:0 5px 0 var(--primary-dark); z-index:10; transition:0.2s;">
                            ${letra}
                        </div>
                    `;
                }).join('')}
            </div>
            <div style="height:10px;"></div>
        </div>`;

    setupInteractions();
}

function setupInteractions() {
    const letters = document.querySelectorAll('.wheel-letter');
    const container = document.getElementById('wheel-container');

    letters.forEach(el => {
        el.onmousedown = (e) => { e.preventDefault(); startSelection(el); };
        el.onmouseenter = () => { if(isDragging) addLetter(el); };
        el.ontouchstart = (e) => { e.preventDefault(); startSelection(el); };
    });

    window.onmousemove = (e) => { if(isDragging) handleTouchMove(e.clientX, e.clientY); };
    window.onmouseup = () => endSelection();

    container.ontouchmove = (e) => {
        if(!isDragging) return;
        const t = e.touches[0];
        handleTouchMove(t.clientX, t.clientY);
    };
    window.ontouchend = () => endSelection();
}

function handleTouchMove(x, y) {
    const target = document.elementFromPoint(x, y);
    if(target && target.classList.contains('wheel-letter')) {
        addLetter(target);
    }
}

function startSelection(el) {
    isDragging = true;
    selecaoAtual = [];
    addLetter(el);
}

function addLetter(el) {
    const letra = el.getAttribute('data-letra');
    const id = el.getAttribute('data-id');

    if (selecaoAtual.find(s => s.id === id)) return;

    selecaoAtual.push({ 
        letra, 
        id, 
        x: el.offsetLeft + el.offsetWidth/2, 
        y: el.offsetTop + el.offsetHeight/2 
    });
    
    el.style.background = "var(--primary-blue)";
    el.style.color = "white";
    el.style.transform = el.style.transform + " scale(1.1)";
    
    atualizarUI();
    
    // Validação automática se clicar letra a letra e atingir o tamanho
    if (!isDragging && selecaoAtual.length === itensAtuais[indiceAtual].nome.length) {
        endSelection();
    }
}

function atualizarUI() {
    const boxes = document.querySelectorAll('.char-box');
    boxes.forEach((box, i) => {
        box.innerText = selecaoAtual[i] ? selecaoAtual[i].letra : "";
    });

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

function endSelection() {
    if (!isDragging || selecaoAtual.length === 0) return;
    isDragging = false;

    const formada = selecaoAtual.map(s => s.letra).join('');
    const correta = itensAtuais[indiceAtual].nome;

    if (formada === correta) {
        feedback(true);
    } else if (formada.length >= correta.length) {
        feedback(false);
    } else {
        // Se soltar e a palavra estiver incompleta, limpamos tudo para tentar de novo
        resetRodada();
    }
}

function feedback(acerto) {
    document.getElementById('game-main-content').style.pointerEvents = 'none';
    const cor = acerto ? '#7ed321' : '#ff5e5e';
    
    document.querySelectorAll('.char-box').forEach(b => { if(b.innerText !== "") { b.style.color = cor; b.style.borderColor = cor; } });
    document.querySelectorAll('line').forEach(l => l.setAttribute("stroke", cor));
    selecaoAtual.forEach(s => {
        const el = document.querySelector(`[data-id="${s.id}"]`);
        if(el) { el.style.background = cor; el.style.borderColor = cor; }
    });

    if (acerto) { acertos++; somAcerto.play(); } 
    else { erros++; somErro.play(); }

    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;

    setTimeout(() => {
        document.getElementById('game-main-content').style.pointerEvents = 'all';
        if (acerto) {
            indiceAtual++;
            proximaRodada();
        } else {
            resetRodada();
        }
    }, 1200);
}

function resetRodada() {
    selecaoAtual = [];
    document.querySelectorAll('.char-box').forEach(b => {
        b.innerText = "";
        b.style.color = "var(--primary-blue)";
        b.style.borderColor = "#cbd9e6";
    });
    document.querySelectorAll('.wheel-letter').forEach(l => {
        l.style.background = "white";
        l.style.color = "var(--primary-blue)";
        l.style.borderColor = "var(--primary-blue)";
        // Mantém a posição original mas remove a escala
        const currentTransform = l.style.transform;
        l.style.transform = currentTransform.replace(" scale(1.1)", "");
    });
    const svg = document.getElementById('conn-svg');
    if(svg) svg.innerHTML = "";
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
