let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let selecaoAtual = []; 
let isDragging = false;
let hasMoved = false; // Deteta se o utilizador está a arrastar ou apenas a clicar

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
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px; z-index:2;">
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-align:center;">CLICA OU LIGA AS LETRAS POR ORDEM!</p>
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
            <div id="word-display" style="display:flex; gap:8px; margin-top:10px; min-height:60px; align-items:center;">
                ${letrasOriginais.map((_, i) => `<div class="char-box" id="char-${i}" style="width:35px; height:50px; border-bottom:5px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:900; color:var(--primary-blue);"></div>`).join('')}
            </div>

            <div id="wheel-container" style="position:relative; width:${isMobile?'270px':'340px'}; height:${isMobile?'270px':'340px'}; display:flex; align-items:center; justify-content:center;">
                <div style="width:${isMobile?'100px':'135px'}; height:${isMobile?'100px':'135px'}; background:white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 25px rgba(0,0,0,0.1); z-index:5;">
                    <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width:80%; max-height:80%; object-fit:contain;">
                </div>
                <svg id="conn-svg" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:3;"></svg>
                ${letrasWheel.map((letra, i) => {
                    const angle = (i * (360 / letrasWheel.length)) * (Math.PI / 180);
                    const radius = isMobile ? 105 : 130;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return `<div class="wheel-letter" data-letra="${letra}" data-id="${i}" style="position:absolute; transform:translate(${x}px, ${y}px); width:55px; height:55px; background:white; border:3px solid var(--primary-blue); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:900; color:var(--primary-blue); cursor:pointer; box-shadow:0 5px 0 var(--primary-dark); z-index:10;">${letra}</div>`;
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
        // Início do toque/clique
        const startAction = (e) => {
            e.preventDefault();
            isDragging = true;
            hasMoved = false;
            addLetter(el);
        };
        el.onmousedown = startAction;
        el.ontouchstart = startAction;

        // Ao passar por cima (para arrastar)
        el.onmouseenter = () => { if(isDragging) { hasMoved = true; addLetter(el); } };
    });

    // Detetar movimento no touch (para mobile arrastar)
    container.ontouchmove = (e) => {
        if(!isDragging) return;
        hasMoved = true;
        const t = e.touches[0];
        const target = document.elementFromPoint(t.clientX, t.clientY);
        if(target && target.classList.contains('wheel-letter')) addLetter(target);
    };

    // Finalizar
    const endAction = () => {
        if(!isDragging) return;
        const correta = itensAtuais[indiceAtual].nome;
        
        // Se arrastou, valida ao soltar. 
        // Se apenas clicou, valida apenas se a palavra estiver completa.
        if (hasMoved || selecaoAtual.length === correta.length) {
            validarFinal();
        }
        isDragging = false;
    };

    window.onmouseup = endAction;
    window.ontouchend = endAction;
}

function addLetter(el) {
    const letra = el.getAttribute('data-letra');
    const id = el.getAttribute('data-id');

    // Se clicar numa letra que JÁ está selecionada, limpa a sequência (Reset para modo clicar)
    const indexExistente = selecaoAtual.findIndex(s => s.id === id);
    if (indexExistente !== -1 && !isDragging) {
        resetRodada();
        return;
    }

    if (selecaoAtual.find(s => s.id === id)) return;

    selecaoAtual.push({ 
        letra, id, 
        x: el.offsetLeft + el.offsetWidth/2, 
        y: el.offsetTop + el.offsetHeight/2 
    });
    
    el.style.background = "var(--primary-blue)";
    el.style.color = "white";
    atualizarUI();

    // No modo "clicar", se atingir o tamanho total, valida automaticamente
    const correta = itensAtuais[indiceAtual].nome;
    if (!hasMoved && selecaoAtual.length === correta.length) {
        validarFinal();
    }
}

function atualizarUI() {
    document.querySelectorAll('.char-box').forEach((box, i) => {
        box.innerText = selecaoAtual[i] ? selecaoAtual[i].letra : "";
    });

    const svg = document.getElementById('conn-svg');
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

function validarFinal() {
    if (selecaoAtual.length === 0) return;
    const formada = selecaoAtual.map(s => s.letra).join('');
    const correta = itensAtuais[indiceAtual].nome;

    if (formada === correta) {
        feedback(true);
    } else {
        // Se a palavra estiver do mesmo tamanho mas errada, ou se soltar o arrasto
        if (formada.length >= correta.length || hasMoved) feedback(false);
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
        if (acerto) { indiceAtual++; proximaRodada(); } 
        else { resetRodada(); }
    }, 1000);
}

function resetRodada() {
    selecaoAtual = [];
    isDragging = false;
    document.querySelectorAll('.char-box').forEach(b => { b.innerText = ""; b.style.color = "var(--primary-blue)"; b.style.borderColor = "#cbd9e6"; });
    document.querySelectorAll('.wheel-letter').forEach(l => { l.style.background = "white"; l.style.color = "var(--primary-blue)"; });
    document.getElementById('conn-svg').innerHTML = "";
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
