let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let tamanhoGrelha = 3; 
let padraoCorreto = [];
let grelhaUtilizador = [];
let corSelecionada = 1; 

// Paleta base (o jogo escolherá cores daqui para o desenho)
const CORES_PALETA = ["#ff4d5e", "#2ecc71", "#2196f3", "#ff9800", "#9c27b0", "#e91e63", "#3f51b5"];
let coresDaRonda = [];

// Biblioteca de Formas (0 = vazio, 1 = pintado)
const BIBLIOTECA_FORMAS = {
    3: [
        [0,1,0, 1,1,1, 0,1,0], // Cruz
        [1,1,1, 1,0,0, 1,1,1], // Letra S / Cobra
        [1,0,1, 1,1,1, 1,0,1], // Letra H
        [1,1,1, 0,1,0, 0,1,0]  // Letra T
    ],
    4: [
        [0,1,1,0, 1,1,1,1, 1,1,1,1, 0,0,0,0], // Chapéu (como na imagem)
        [0,0,1,0, 0,1,1,0, 0,0,1,0, 0,0,1,0], // Número 1 (como na imagem)
        [1,0,0,1, 1,1,1,1, 1,1,1,1, 1,0,0,1], // Carro simples
        [0,1,1,0, 1,0,0,1, 1,0,0,1, 0,1,1,0]  // Círculo/O
    ],
    5: [
        [0,1,0,1,0, 1,1,1,1,1, 1,1,1,1,1, 0,1,1,1,0, 0,0,1,0,0], // Coração
        [0,0,1,0,0, 0,1,1,1,0, 1,1,1,1,1, 0,0,1,0,0, 0,0,1,0,0], // Árvore/Seta
        [0,0,1,0,0, 0,1,1,1,0, 1,1,1,1,1, 1,1,1,1,1, 1,0,0,0,1], // Casa
        [1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1]  // Moldura
    ]
};

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    if (!JOGO_CATEGORIAS[categoriaAtual]) selecionarCategoria("facil");
    criarAnimacaoTutorial();
};

window.gerarIntroJogo = function() {
    return "Pinta a grelha da direita exatamente igual ao modelo da esquerda!";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    tamanhoGrelha = JOGO_CATEGORIAS[key].tamanho;
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:20px; justify-content:center;">
            <div style="width:80px; height:80px; background:#eee; display:grid; grid-template-columns:repeat(2,1fr); gap:2px;">
                <div style="background:#2196f3"></div><div style="background:white"></div>
                <div style="background:white"></div><div style="background:#2196f3"></div>
            </div>
            <div style="font-size:30px; color:var(--primary-blue); animation: bounce 1s infinite;">➡️</div>
            <div style="width:80px; height:80px; background:white; border:2px solid var(--primary-blue); position:relative; display:grid; grid-template-columns:repeat(2,1fr); gap:2px;">
                <div style="background:#2196f3"></div><div style="background:white"></div>
                <div style="background:white"></div><div style="background:white"></div>
                <div style="position:absolute; font-size:40px; bottom:-25px; right:-20px; animation: tapH 2s infinite;">☝️</div>
            </div>
        </div>
        <style>
            @keyframes tapH { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-10px,-15px) scale(1.1); } }
            @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
        </style>
    `;
}

window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    proximaRonda();
};

function iniciarCronometro() {
    tempoInicio = Date.now();
    clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const min = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const seg = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${min}:${seg}`;
    }, 1000);
}

function proximaRonda() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    
    // 1. Escolher cor aleatória para esta ronda
    let corRonda = CORES_PALETA[Math.floor(Math.random() * CORES_PALETA.length)];
    coresDaRonda = ["#ffffff", corRonda]; // 0: branco, 1: cor do desenho
    
    // 2. Escolher forma aleatória da biblioteca
    const formasDisponiveis = BIBLIOTECA_FORMAS[tamanhoGrelha];
    padraoCorreto = formasDisponiveis[Math.floor(Math.random() * formasDisponiveis.length)];
    
    grelhaUtilizador = new Array(tamanhoGrelha * tamanhoGrelha).fill(0);
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .game-inner { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-between; padding: 5px; box-sizing: border-box; }
            .stage { display: flex; width: 100%; flex: 1; align-items: center; justify-content: center; gap: 30px; padding: 10px; min-height: 0; }
            
            .grid-box { height: 95%; aspect-ratio: 1/1; display: grid; grid-template-columns: repeat(${tamanhoGrelha}, 1fr); gap: 2px; background: #ddd; border: 4px solid #ddd; border-radius: 10px; }
            .cell { background: white; width: 100%; height: 100%; transition: background 0.2s; }
            .cell-paint { cursor: pointer; }

            .controls { display: flex; align-items: center; justify-content: center; gap: 20px; width: 100%; height: 90px; flex-shrink: 0; padding-bottom: 10px; }
            .color-sel { width: 60px; height: 60px; border-radius: 50%; background: ${coresDaRonda[1]}; border: 4px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.1); cursor: pointer; }
            .btn-action { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; box-shadow: 0 5px 0 rgba(0,0,0,0.1); transition: 0.1s; }
            .btn-clear { background: #eee; }
            .btn-verify { background: #2ecc71; color: white; font-weight: 900; font-size: 28px; box-shadow: 0 5px 0 #27ae60; }
            .btn-action:active { transform: translateY(3px); box-shadow: none; }

            @media (max-width: 600px) {
                .stage { flex-direction: column; gap: 10px; }
                .grid-box { height: 45%; }
                .color-sel, .btn-action { width: 50px; height: 50px; }
            }
        </style>
        <div class="game-inner">
            <div class="stage">
                <!-- MODELO -->
                <div class="grid-box">
                    ${padraoCorreto.map(c => `<div class="cell" style="background:${coresDaRonda[c]}"></div>`).join('')}
                </div>
                <!-- TELA DO JOGADOR -->
                <div class="grid-box" id="user-grid">
                    ${grelhaUtilizador.map((c, i) => `<div class="cell cell-paint" id="c-${i}" onclick="pintar(${i})" style="background:white"></div>`).join('')}
                </div>
            </div>
            <div class="controls">
                <!-- Mostra a cor atual -->
                <div class="color-sel" title="Cor Ativa"></div>
                
                <!-- Borracha Limpa Tudo -->
                <button class="btn-action btn-clear" onclick="limparTudo()" title="Limpar Tudo">
                    <img src="${JOGO_CONFIG.caminhoImg}borracha.png" style="width:60%;">
                </button>
                
                <!-- Verificar -->
                <button class="btn-action btn-verify" onclick="validar()">V</button>
            </div>
        </div>
    `;
}

window.pintar = function(i) {
    grelhaUtilizador[i] = 1; // Pinta com a cor da ronda
    document.getElementById(`c-${i}`).style.background = coresDaRonda[1];
};

window.limparTudo = function() {
    grelhaUtilizador = new Array(tamanhoGrelha * tamanhoGrelha).fill(0);
    const cells = document.querySelectorAll('.cell-paint');
    cells.forEach(cell => cell.style.background = "white");
};

window.validar = function() {
    const correto = grelhaUtilizador.every((v, i) => v === padraoCorreto[i]);

    if (correto) {
        acertos++; somAcerto.play();
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('user-grid').style.borderColor = "#2ecc71";
        setTimeout(() => {
            indicePergunta++;
            proximaRonda();
        }, 1200);
    } else {
        erros++; somErro.play();
        document.getElementById('miss-val').innerText = erros;
        document.getElementById('user-grid').style.borderColor = "#ff4d5e";
        setTimeout(() => { 
            if(document.getElementById('user-grid')) document.getElementById('user-grid').style.borderColor = "#ddd"; 
        }, 800);
    }
};

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:15px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:110px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-container" style="display:flex; gap:10px; width:100%; max-width:300px; margin-bottom:20px;">
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:260px;">
                <button class="res-btn res-btn-p" onclick="location.reload()" style="background:var(--primary-blue); color:white; border:none; padding:15px; border-radius:15px; font-weight:900; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);">Jogar de Novo</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="background:#dce4ee; color:#5d7082; border:none; padding:15px; border-radius:15px; font-weight:900; text-align:center; text-decoration:none; box-shadow:0 5px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
