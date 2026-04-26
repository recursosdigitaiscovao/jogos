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

window.startLogic = function() { 
    // Inicia a animação inicial conforme a categoria do CONFIG_MESTRE
    selecionarCategoria(CONFIG_MESTRE.area); 
};

window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%;">
            <div style="perspective: 1000px; display:flex; gap:15px;">
                <div id="demo-flip" style="width:70px; height:90px; position:relative; transform-style: preserve-3d; transition: transform 1s; animation: autoFlip 3s infinite;">
                    <div style="position:absolute; width:100%; height:100%; backface-visibility: hidden; background: linear-gradient(135deg, var(--primary-blue), #8dc4ff); border-radius:12px; border:3px solid white; display:flex; align-items:center; justify-content:center; color:white; font-size:30px;"><i class="fas fa-lightbulb"></i></div>
                    <div style="position:absolute; width:100%; height:100%; backface-visibility: hidden; transform: rotateY(180deg); background: white; border-radius:12px; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; color:var(--primary-blue); font-size:12px; font-weight:900; text-align:center; padding:5px;">${cat.exemplo}</div>
                </div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-transform:uppercase;">ENCONTRA OS PARES!</p>
        </div>
        <style> @keyframes autoFlip { 0%, 20% { transform: rotateY(0deg); } 50%, 80% { transform: rotateY(180deg); } 100% { transform: rotateY(0deg); } } </style>`;
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    
    // Fixar o número de pares pelo nível escolhido
    const nivelData = JOGO_CONFIG.niveis.find(n => n.id === CONFIG_MESTRE.nivel);
    totalParesNecessarios = nivelData.pares;

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
    
    const categoria = JOGO_CONFIG.categorias[CONFIG_MESTRE.area];
    const itensSorteados = [...categoria.itens].sort(() => Math.random() - 0.5).slice(0, totalParesNecessarios);
    
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
    const lvl = CONFIG_MESTRE.nivel;
    
    let cols = 3;
    if (!isLandscape) { // VERTICAL (PORTRAIT)
        if (lvl === "nivel1") cols = 3; // 3x2 (6 cartas)
        if (lvl === "nivel2") cols = 3; // 3+3+2 (8 cartas)
        if (lvl === "nivel3") cols = 3; // 3x4 (12 cartas)
    } else { // HORIZONTAL (LANDSCAPE)
        if (lvl === "nivel1") cols = 3; // 3x2
        if (lvl === "nivel2") cols = 4; // 4x2
        if (lvl === "nivel3") cols = 4; // 4x3
    }

    container.innerHTML = `
        <div id="memory-board" style="
            display: grid; grid-template-columns: repeat(${cols}, 1fr); 
            gap: 10px; width: 100%; height: 100%; max-width: 600px;
            padding: 10px; align-content: center; justify-items: center; margin: auto;
        ">
            ${cartasNoGrid.map((carta, i) => `
                <div class="card-box" id="card-${i}" onclick="virarCarta(this, ${i})" style="
                    width: 100%; max-width: 100px; aspect-ratio: 3 / 4; position: relative;
                    transform-style: preserve-3d; transition: transform 0.5s; cursor: pointer; user-select: none;
                ">
                    <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: linear-gradient(135deg, var(--primary-blue), #8dc4ff); border-radius: 12px; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 25px; box-shadow: 0 4px 8px rgba(0,0,0,0.15);"><i class="fas fa-lightbulb"></i></div>
                    <div id="front-${i}" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; transform: rotateY(180deg); background: white; border-radius: 12px; border: 3px solid var(--primary-blue); display: flex; align-items: center; justify-content: center; overflow: hidden;"></div>
                </div>
            `).join('')}
        </div>
    `;
}

window.virarCarta = function(el, idx) {
    if (bloqueado || el.classList.contains('flipped') || el.style.visibility === "hidden") return;
    const info = cartasNoGrid[idx];
    const front = document.getElementById(`front-${idx}`);

    if (info.tipo === 'img') {
        front.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${info.conteudo}" style="width:85%; height:85%; object-fit:contain; transform: rotateY(180deg);">`;
    } else {
        const fs = info.conteudo.length > 8 ? '9px' : '13px';
        front.innerHTML = `<span style="font-size: ${fs}; color: var(--primary-blue); font-weight:900; text-transform:uppercase; text-align:center; transform: rotateY(180deg); padding:5px;">${info.conteudo}</span>`;
    }

    el.classList.add('flipped');
    el.style.transform = "rotateY(180deg)";

    if (!primeiraCarta) { primeiraCarta = { el, idx, id: info.id }; } 
    else { segundaCarta = { el, idx, id: info.id }; bloqueado = true; setTimeout(verificarPar, 500); }
};

function verificarPar() {
    if (primeiraCarta.id === segundaCarta.id && primeiraCarta.idx !== segundaCarta.idx) {
        somAcerto.play(); acertos++; paresEncontradosNestaRonda++;
        document.getElementById('hits-val').innerText = acertos;
        
        primeiraCarta.el.querySelector('div:nth-child(2)').style.borderColor = "#7ed321";
        segundaCarta.el.querySelector('div:nth-child(2)').style.borderColor = "#7ed321";

        setTimeout(() => {
            primeiraCarta.el.style.opacity = "0"; primeiraCarta.el.style.visibility = "hidden";
            segundaCarta.el.style.opacity = "0"; segundaCarta.el.style.visibility = "hidden";
            primeiraCarta = null; segundaCarta = null; bloqueado = false;
            if (paresEncontradosNestaRonda === totalParesNecessarios) { indiceAtual++; setTimeout(proximaRodada, 600); }
        }, 600);
    } else {
        erros++; somErro.play(); document.getElementById('miss-val').innerText = erros;
        setTimeout(() => {
            primeiraCarta.el.style.transform = "rotateY(0deg)"; primeiraCarta.el.classList.remove('flipped');
            segundaCarta.el.style.transform = "rotateY(0deg)"; segundaCarta.el.classList.remove('flipped');
            primeiraCarta = null; segundaCarta = null; bloqueado = false;
        }, 1000);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
