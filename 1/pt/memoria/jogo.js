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

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    CONFIG_MESTRE.area = key;

    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%;">
            <div style="display:flex; gap:10px;">
                <div class="demo-card" style="width:50px; height:65px; background:var(--primary-blue); border-radius:10px; border:3px solid white; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; font-weight:900; animation: flipDemo 3s infinite;">?</div>
                <div class="demo-card" style="width:50px; height:65px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--primary-blue); font-size:10px; font-weight:900; animation: flipDemo 3s infinite reverse;">${cat.exemplo}</div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-align:center; font-size:14px;">MEMÓRIA: IMAGEM + PALAVRA</p>
        </div>
        <style>
            @keyframes flipDemo { 0%, 40% { transform: rotateY(0deg); background: var(--primary-blue); color:white; } 50%, 100% { transform: rotateY(180deg); background: white; color:var(--primary-blue); } }
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
        document.getElementById('timer-val').innerText = `${Math.floor(decorrido/60).toString().padStart(2,'0')}:${(decorrido%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;
    paresEncontradosNestaRonda = 0;
    
    // NÍVEIS PEDAGÓGICOS
    if (indiceAtual < 3) totalParesNecessarios = 3;      // Rondas 1,2,3 -> 6 cartas
    else if (indiceAtual < 6) totalParesNecessarios = 4; // Rondas 4,5,6 -> 8 cartas
    else totalParesNecessarios = 6;                      // Rondas 7,8,9,10 -> 12 cartas

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
    const isMobile = window.innerWidth < 650;
    const isLandscape = window.innerHeight < 500;
    
    // Ajuste de colunas inteligente
    let cols = 3;
    if (totalParesNecessarios === 4) cols = (isMobile && !isLandscape) ? 2 : 4;
    if (totalParesNecessarios === 6) cols = (isMobile && !isLandscape) ? 3 : 4;
    
    // Tamanho das cartas baseado no ecrã (vmin ajuda a não transbordar na vertical)
    const cardSize = isLandscape ? "18vh" : "22vmin";

    container.innerHTML = `
        <div id="memory-board" style="
            display: grid; 
            grid-template-columns: repeat(${cols}, 1fr); 
            gap: 10px; 
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
                    max-width: 130px;
                    aspect-ratio: 3 / 3.8;
                    background: var(--primary-blue);
                    border-radius: 15px;
                    border: 3px solid white;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 900; color: white; font-size: min(10vw, 40px);
                    transition: 0.4s; box-shadow: 0 5px 0 rgba(0,0,0,0.1);
                    transform-style: preserve-3d;
                    user-select: none;
                ">?</div>
            `).join('')}
        </div>
    `;
}

window.virarCarta = function(el, idx) {
    if (bloqueado || el.classList.contains('flipped') || el.style.visibility === "hidden") return;

    const info = cartasNoGrid[idx];
    el.classList.add('flipped');
    el.style.transform = "rotateY(180deg)";
    el.style.background = "white";
    el.style.boxShadow = "none";
    
    if (info.tipo === 'img') {
        el.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${info.conteudo}" style="width:85%; max-height:85%; transform: rotateY(180deg); object-fit:contain; pointer-events:none;">`;
    } else {
        // Cálculo de fonte para palavras longas
        const textLen = info.conteudo.length;
        let fs = textLen > 8 ? 'min(3vw, 10px)' : 'min(4vw, 14px)';
        if (window.innerWidth < 400) fs = textLen > 8 ? '9px' : '11px';

        el.innerHTML = `<span style="font-size: ${fs}; color: var(--primary-blue); transform: rotateY(180deg); text-transform:uppercase; text-align:center; padding:5px; word-break: break-word; line-height:1.1;">${info.conteudo}</span>`;
    }

    if (!primeiraCarta) {
        primeiraCarta = { el, idx, id: info.id };
    } else {
        segundaCarta = { el, idx, id: info.id };
        bloqueado = true;
        verificarPar();
    }
};

function verificarPar() {
    if (primeiraCarta.id === segundaCarta.id && primeiraCarta.idx !== segundaCarta.idx) {
        // ACERTO
        somAcerto.play();
        acertos++;
        paresEncontradosNestaRonda++;
        document.getElementById('hits-val').innerText = acertos;

        setTimeout(() => {
            // CARTAS DESAPARECEM
            primeiraCarta.el.style.opacity = "0";
            primeiraCarta.el.style.visibility = "hidden";
            segundaCarta.el.style.opacity = "0";
            segundaCarta.el.style.visibility = "hidden";
            
            resetVariaveisTurno();

            if (paresEncontradosNestaRonda === totalParesNecessarios) {
                indiceAtual++;
                setTimeout(proximaRodada, 600);
            }
        }, 800);
    } else {
        // ERRO
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        
        setTimeout(() => {
            [primeiraCarta.el, segundaCarta.el].forEach(card => {
                card.style.transform = "rotateY(0deg)";
                card.style.background = "var(--primary-blue)";
                card.style.boxShadow = "0 5px 0 rgba(0,0,0,0.1)";
                card.innerHTML = "?";
                card.classList.remove('flipped');
            });
            resetVariaveisTurno();
        }, 1200);
    }
}

function resetVariaveisTurno() {
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
