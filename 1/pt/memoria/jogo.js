let itensAtuais = Array(10).fill({}); 
let indiceAtual = 0; 
let acertos = 0; 
let erros = 0;
let tempoInicio;
let intervaloTimer;

let cartasNoGrid = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let paresEncontradosNestaRonda = 0;
let totalParesNecessarios = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// 1. ANIMAÇÃO DE INTRODUÇÃO (Igual ao Jogo)
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    CONFIG_MESTRE.area = key;

    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%;">
            <div style="perspective: 1000px; display:flex; gap:15px;">
                <div id="demo-flip" style="width:70px; height:90px; position:relative; transform-style: preserve-3d; transition: transform 1s; animation: autoFlip 3s infinite;">
                    <!-- Verso -->
                    <div style="position:absolute; width:100%; height:100%; backface-visibility: hidden; background: linear-gradient(135deg, var(--primary-blue), #8dc4ff); border-radius:12px; border:3px solid white; display:flex; align-items:center; justify-content:center; color:white; font-size:30px;">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <!-- Frente -->
                    <div style="position:absolute; width:100%; height:100%; backface-visibility: hidden; transform: rotateY(180deg); background: white; border-radius:12px; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; color:var(--primary-blue); font-size:12px; font-weight:900; text-align:center; padding:5px;">
                        ${cat.exemplo}
                    </div>
                </div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-transform:uppercase;">Encontra os pares!</p>
        </div>
        <style>
            @keyframes autoFlip { 0%, 20% { transform: rotateY(0deg); } 50%, 80% { transform: rotateY(180deg); } 100% { transform: rotateY(0deg); } }
        </style>`;
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarTimer(); 
    proximaRodada(); 
};

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoInicio = Date.now();
    intervaloTimer = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const m = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const s = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;
    paresEncontradosNestaRonda = 0;
    
    // NÍVEIS
    if (indiceAtual < 3) totalParesNecessarios = 3;      // 6 cartas
    else if (indiceAtual < 6) totalParesNecessarios = 4; // 8 cartas
    else totalParesNecessarios = 6;                      // 12 cartas

    gerarTabuleiro(totalParesNecessarios);
}

function gerarTabuleiro(numPares) {
    const categoria = JOGO_CONFIG.categorias[CONFIG_MESTRE.area];
    const itensSorteados = [...categoria.itens].sort(() => Math.random() - 0.5).slice(0, numPares);
    
    cartasNoGrid = [];
    itensSorteados.forEach(item => {
        cartasNoGrid.push({ id: item.nome, tipo: 'img', conteudo: item.img });
        cartasNoGrid.push({ id: item.nome, tipo: 'txt', conteudo: item.nome });
    });

    cartasNoGrid.sort(() => Math.random() - 0.5);
    montarGrid();
}

function montarGrid() {
    const container = document.getElementById('game-main-content');
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // REGRAS DE GRELHA ESPECÍFICAS
    let cols = 3;
    if (isLandscape) {
        if (totalParesNecessarios === 3) cols = 3; // 3x2
        if (totalParesNecessarios === 4) cols = 4; // 4x2
        if (totalParesNecessarios === 6) cols = 4; // 4x3
    } else {
        if (totalParesNecessarios === 3) cols = 3; // 3x2
        if (totalParesNecessarios === 4) cols = 3; // 3+3+2
        if (totalParesNecessarios === 6) cols = 3; // 3x4
    }

    container.innerHTML = `
        <div id="memory-board" style="
            display: grid; 
            grid-template-columns: repeat(${cols}, 1fr); 
            gap: clamp(5px, 2vh, 15px); 
            width: 100%; height: 100%; 
            max-width: 800px;
            padding: 10px; 
            align-content: center;
            justify-items: center;
            margin: auto;
        ">
            ${cartasNoGrid.map((carta, i) => `
                <div class="card-box" id="card-${i}" onclick="virarCarta(this, ${i})" style="
                    width: 100%;
                    max-width: 120px;
                    aspect-ratio: 3 / 4;
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    user-select: none;
                ">
                    <!-- VERSO (Lâmpada atrativa) -->
                    <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: linear-gradient(135deg, var(--primary-blue), #8dc4ff); border-radius: 12px; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: min(8vw, 35px); box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <!-- FRENTE (Conteúdo) -->
                    <div id="front-${i}" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; transform: rotateY(180deg); background: white; border-radius: 12px; border: 3px solid var(--primary-blue); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <!-- Conteúdo injetado via JS -->
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

window.virarCarta = function(el, idx) {
    if (bloqueado || el.classList.contains('flipped') || el.style.visibility === "hidden") return;

    const info = cartasNoGrid[idx];
    const front = document.getElementById(`front-${idx}`);

    // Injetar conteúdo na frente
    if (info.tipo === 'img') {
        front.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${info.conteudo}" style="width:85%; height:85%; object-fit:contain; pointer-events:none;">`;
    } else {
        const fs = info.conteudo.length > 8 ? 'min(3vw, 10px)' : 'min(4.5vw, 14px)';
        front.innerHTML = `<span style="font-size: ${fs}; color: var(--primary-blue); font-weight:900; text-transform:uppercase; text-align:center; padding:5px; line-height:1.1;">${info.conteudo}</span>`;
    }

    el.classList.add('flipped');
    el.style.transform = "rotateY(180deg)";

    if (!primeiraCarta) {
        primeiraCarta = { el, idx, id: info.id };
    } else {
        segundaCarta = { el, idx, id: info.id };
        bloqueado = true;
        setTimeout(verificarPar, 500);
    }
};

function verificarPar() {
    if (primeiraCarta.id === segundaCarta.id && primeiraCarta.idx !== segundaCarta.idx) {
        // ACERTO
        somAcerto.play();
        acertos++;
        paresEncontradosNestaRonda++;
        document.getElementById('hits-val').innerText = acertos;

        // Visual de acerto antes de sumir
        primeiraCarta.el.querySelector('div:nth-child(2)').style.borderColor = "#7ed321";
        segundaCarta.el.querySelector('div:nth-child(2)').style.borderColor = "#7ed321";

        setTimeout(() => {
            primeiraCarta.el.style.opacity = "0";
            primeiraCarta.el.style.visibility = "hidden";
            segundaCarta.el.style.opacity = "0";
            segundaCarta.el.style.visibility = "hidden";
            
            resetTurno();

            if (paresEncontradosNestaRonda === totalParesNecessarios) {
                indiceAtual++;
                setTimeout(proximaRodada, 600);
            }
        }, 600);
    } else {
        // ERRO
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        
        setTimeout(() => {
            primeiraCarta.el.style.transform = "rotateY(0deg)";
            primeiraCarta.el.classList.remove('flipped');
            segundaCarta.el.style.transform = "rotateY(0deg)";
            segundaCarta.el.classList.remove('flipped');
            resetTurno();
        }, 1000);
    }
}

function resetTurno() {
    primeiraCarta = null;
    segundaCarta = null;
    bloqueado = false;
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    const tempo = document.getElementById('timer-val').innerText;
    window.mostrarResultados(acertos, tempo);
}
