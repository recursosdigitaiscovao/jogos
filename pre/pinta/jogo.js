let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let tamanhoGrelha = 3; 
let padraoCorreto = [];
let grelhaUtilizador = [];
let corSelecionada = ""; 

// Cores vivas para o jogo sortear
const PALETA_MESTRE = ["#ff4d5e", "#2ecc71", "#2196f3", "#ff9800", "#9c27b0", "#e91e63", "#3f51b5", "#00bcd4", "#8bc34a"];
let coresAtivasNaRonda = [];

// Biblioteca de Formas (1, 2, 3 representam partes diferentes do desenho para cores diferentes)
const DESENHOS = {
    3: [
        [0,1,0, 1,2,1, 0,1,0], // Flor/Cruz
        [1,1,1, 0,2,0, 0,2,0], // Cogumelo
        [1,0,1, 1,2,1, 1,0,1], // Robô
        [0,1,0, 2,2,2, 0,1,0]  // Avião
    ],
    4: [
        [0,1,1,0, 1,1,1,1, 2,2,2,2, 0,0,0,0], // Chapéu (conforme a tua imagem)
        [0,0,1,0, 0,1,1,0, 0,0,1,0, 0,2,2,2], // Número 1 (conforme a tua imagem)
        [1,1,1,1, 1,0,0,1, 1,0,0,1, 2,2,2,2], // Cadeira / Janela
        [0,1,1,0, 1,2,2,1, 1,2,2,1, 0,1,1,0]  // Moldura O
    ],
    5: [
        [0,1,1,1,0, 1,1,1,1,1, 1,1,1,1,1, 0,2,2,2,0, 0,0,2,0,0], // Coração
        [0,0,1,0,0, 0,1,1,1,0, 2,2,2,2,2, 0,0,3,0,0, 0,0,3,0,0], // Árvore
        [0,0,1,0,0, 0,1,2,1,0, 1,2,2,2,1, 3,3,3,3,3, 0,3,3,3,0], // Casa
        [1,1,0,1,1, 1,1,0,1,1, 0,0,2,0,0, 3,3,3,3,3, 0,3,3,3,0]  // Gato
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
        <div style="display:flex; align-items:center; gap:20px; justify-content:center; height:100%;">
            <div style="width:90px; height:90px; display:grid; grid-template-columns:repeat(2,1fr); gap:2px; border:2px solid #ccc;">
                <div style="background:#ff4d5e"></div><div style="background:#2196f3"></div>
                <div style="background:#2196f3"></div><div style="background:#ff4d5e"></div>
            </div>
            <div style="font-size:30px; color:var(--primary-blue); animation: pulse 1s infinite;">➡️</div>
            <div style="width:90px; height:90px; background:white; border:3px solid var(--primary-blue); position:relative; display:grid; grid-template-columns:repeat(2,1fr); gap:2px;">
                <div style="background:#ff4d5e"></div><div style="background:white"></div>
                <div style="background:white"></div><div style="background:white"></div>
                <div style="position:absolute; font-size:45px; bottom:-30px; right:-20px; animation: tapH 2s infinite; z-index:10;">☝️</div>
            </div>
        </div>
        <style>
            @keyframes tapH { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-10px,-15px) scale(1.1); } }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
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

    const lista = DESENHOS[tamanhoGrelha];
    const desenhoBase = lista[Math.floor(Math.random() * lista.length)];
    const numPartes = Math.max(...desenhoBase);
    
    let coresSorteadas = [...PALETA_MESTRE].sort(() => 0.5 - Math.random()).slice(0, numPartes);
    coresAtivasNaRonda = coresSorteadas; 
    padraoCorreto = desenhoBase.map(v => v === 0 ? "#ffffff" : coresSorteadas[v-1]);
    
    grelhaUtilizador = new Array(tamanhoGrelha * tamanhoGrelha).fill("#ffffff");
    corSelecionada = coresAtivasNaRonda[0]; 

    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .game-inner { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-between; padding: 5px; box-sizing: border-box; overflow: hidden; }
            .stage { display: flex; width: 100%; flex: 1; align-items: center; justify-content: center; gap: 30px; padding: 10px; min-height: 0; }
            
            .grid-box { height: 95%; aspect-ratio: 1/1; display: grid; grid-template-columns: repeat(${tamanhoGrelha}, 1fr); gap: 2px; background: #ddd; border: 4px solid #ddd; border-radius: 10px; overflow: hidden; }
            .cell { background: white; width: 100%; height: 100%; transition: background 0.1s; }
            .cell-paint { cursor: pointer; }

            .controls { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; min-height: 80px; flex-wrap: wrap; padding: 5px 0 10px; }
            .color-btn { width: 50px; height: 50px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); cursor: pointer; transition: 0.2s; }
            .color-btn.active { transform: scale(1.2); border-color: #555; }
            
            .btn-action { width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; box-shadow: 0 4px 0 rgba(0,0,0,0.1); transition: 0.1s; }
            .btn-clear { background: #eee; }
            .btn-verify { background: #2ecc71; color: white; font-weight: 900; font-size: 24px; box-shadow: 0 4px 0 #27ae60; }
            .btn-action:active { transform: translateY(2px); box-shadow: none; }

            @media (max-width: 600px) {
                .stage { flex-direction: column; gap: 10px; }
                .grid-box { height: 46%; }
                .color-btn, .btn-action { width: 42px; height: 42px; }
            }
        </style>
        <div class="game-inner">
            <div class="stage">
                <div class="grid-box">${padraoCorreto.map(cor => `<div class="cell" style="background:${cor}"></div>`).join('')}</div>
                <div class="grid-box" id="user-grid">${grelhaUtilizador.map((cor, i) => `<div class="cell cell-paint" id="c-${i}" onclick="pintar(${i})" style="background:${cor}"></div>`).join('')}</div>
            </div>
            <div class="controls">
                ${coresAtivasNaRonda.map(cor => `<div class="color-btn ${corSelecionada === cor ? 'active' : ''}" style="background:${cor}" onclick="selecionarCor(this, '${cor}')"></div>`).join('')}
                <div style="width: 2px; height: 40px; background: #eee; margin: 0 5px;"></div>
                <button class="btn-action btn-clear" onclick="limparTudo()" title="Limpar Tudo"><img src="${JOGO_CONFIG.caminhoImg}borracha.png" style="width:60%;"></button>
                <button class="btn-action btn-verify" onclick="validar()">V</button>
            </div>
        </div>
    `;
}

window.selecionarCor = function(el, cor) {
    corSelecionada = cor;
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
};

window.pintar = function(i) {
    grelhaUtilizador[i] = corSelecionada;
    document.getElementById(`c-${i}`).style.background = corSelecionada;
};

window.limparTudo = function() {
    grelhaUtilizador = new Array(tamanhoGrelha * tamanhoGrelha).fill("#ffffff");
    document.querySelectorAll('.cell-paint').forEach(cell => cell.style.background = "white");
};

window.validar = function() {
    const correto = grelhaUtilizador.every((v, i) => v.toLowerCase() === padraoCorreto[i].toLowerCase());
    if (correto) {
        acertos++; somAcerto.play();
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('user-grid').style.borderColor = "#2ecc71";
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1200);
    } else {
        erros++; somErro.play();
        document.getElementById('miss-val').innerText = erros;
        document.getElementById('user-grid').style.borderColor = "#ff4d5e";
        setTimeout(() => { if(document.getElementById('user-grid')) document.getElementById('user-grid').style.borderColor = "#ddd"; }, 800);
    }
};

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const totalP = 10;
    const perc = (acertos / totalP) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; box-sizing:border-box; padding:10px;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:25%; min-height:80px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color: var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-container" style="display:flex; gap:10px; width:100%; max-width:300px; margin-bottom:15px;">
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos} / ${totalP}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempoFinal}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:260px;">
                <button class="res-btn res-btn-p" style="padding:14px; border-radius:15px; font-weight:900; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);" onclick="location.reload()">Jogar de Novo</button>
                <button class="res-btn res-btn-o" style="padding:11px; border-radius:15px; font-weight:900; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 5px 0 var(--primary-blue);" onclick="openRDMenu()">Outro Tema</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:14px; border-radius:15px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 5px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
