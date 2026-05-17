let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let categoriaAtual = "facil"; 
let tamanhoGrelha = 3; 
let padraoCorreto = [];
let grelhaUtilizador = [];
let corSelecionada = ""; 
let jogoAtivo = false;
let ajudaDisponivel = true;

const PALETA_MESTRE = ["#ff4d5e", "#2ecc71", "#2196f3", "#ff9800", "#9c27b0", "#e91e63", "#3f51b5"];

const DESENHOS = {
    3: [[0,1,0, 1,2,1, 0,1,0], [1,1,1, 0,2,0, 0,2,0], [1,0,1, 0,2,0, 1,0,1]],
    4: [[0,1,1,0, 1,1,1,1, 2,2,2,2, 0,0,0,0], [0,0,1,0, 0,1,1,0, 0,0,1,0, 0,2,2,2]],
    5: [[0,1,1,1,0, 1,1,1,1,1, 1,1,1,1,1, 0,2,2,2,0, 0,0,2,0,0], [0,0,1,0,0, 0,1,1,1,0, 2,2,2,2,2, 0,0,3,0,0, 0,0,3,0,0]]
};

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual) categoriaAtual = "facil";
    tamanhoGrelha = JOGO_CATEGORIAS[categoriaAtual].tamanho;
    
    // Configurar botão da Lâmpada (Substituindo o Timer)
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer; display:block;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
    }

    renderTutorialAnimation();
};

window.gerarIntroJogo = function() {
    return JOGO_CATEGORIAS[categoriaAtual].descricao || "Pinta a grelha da direita igual ao modelo!";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    tamanhoGrelha = JOGO_CATEGORIAS[key].tamanho;
    if(document.getElementById('intro-instr')) document.getElementById('intro-instr').innerText = window.gerarIntroJogo();
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `
        <style>
            .tut-box { display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:10px; filter: grayscale(100%); opacity: 0.7; }
            .tut-grid { display: grid; grid-template-columns: repeat(2, 1fr); width: 60px; height: 60px; gap: 2px; background: #ddd; }
            .tut-cell { background: white; width: 100%; height: 100%; }
            @keyframes tapP { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-5px,-8px) scale(1.1); } }
            @keyframes paintTut { 0%, 40% { background: white; } 45%, 100% { background: #ff4d5e; } }
        </style>
        <div class="tut-box">
            <div style="display:flex; gap:15px;">
                <div class="tut-grid"><div style="background:#ff4d5e"></div><div></div><div></div><div></div></div>
                <div class="tut-grid">
                    <div class="tut-cell" style="animation: paintTut 4s infinite;"></div>
                    <div class="tut-cell"></div><div class="tut-cell"></div><div class="tut-cell"></div>
                </div>
            </div>
            <div style="position:relative; width:40px; height:40px; border-radius:50%; background:#ff4d5e; border:2px solid #ccc;">
                <div style="position:absolute; font-size:30px; bottom:-20px; right:-15px; animation: tapP 4s infinite;">☝️</div>
            </div>
        </div>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0; ajudasUtilizadas = 0; jogoAtivo = true;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    proximaRonda();
};

function proximaRonda() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    const lista = DESENHOS[tamanhoGrelha] || DESENHOS[3];
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
            .game-outer { width: 100%; height: 100%; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; }
            .stage { display: flex; width: 100%; flex: 1; align-items: center; justify-content: center; gap: 20px; min-height: 0; }
            .grid-box { height: 90%; aspect-ratio: 1/1; display: grid; grid-template-columns: repeat(${tamanhoGrelha}, 1fr); gap: 2px; background: #ddd; border: 4px solid #ddd; border-radius: 12px; overflow: hidden; position: relative; }
            .cell { background: white; width: 100%; height: 100%; }
            .cell-paint { cursor: pointer; transition: background 0.1s; }
            .controls { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; height: 70px; flex-shrink: 0; padding-top: 10px; }
            .color-btn { width: 45px; height: 45px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); cursor: pointer; transition: 0.2s; }
            .color-btn.active { transform: scale(1.15); border-color: #555; }
            .btn-action { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; box-shadow: 0 4px 0 rgba(0,0,0,0.1); }
            .btn-verify { background: #7ed321; color: white; font-weight: 900; font-size: 22px; box-shadow: 0 4px 0 #5ea31a; }
            
            #flash-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: grid; grid-template-columns: repeat(${tamanhoGrelha}, 1fr); gap: 2px; pointer-events: none; opacity: 0; transition: opacity 0.2s; z-index: 10; }
            
            @media (max-width: 600px) { 
                .stage { flex-direction: column; gap: 10px; } 
                .grid-box { height: 40%; } 
                .color-btn, .btn-action { width: 38px; height: 38px; }
                .game-outer { padding: 10px; }
            }
        </style>
        <div class="game-outer">
            <div class="stage">
                <div class="grid-box">${padraoCorreto.map(cor => `<div class="cell" style="background:${cor}"></div>`).join('')}</div>
                <div class="grid-box" id="user-grid">
                    ${grelhaUtilizador.map((cor, i) => `<div class="cell cell-paint" id="c-${i}" onclick="pintar(${i})" style="background:${cor}"></div>`).join('')}
                    <div id="flash-layer">${padraoCorreto.map(cor => `<div class="cell" style="background:${cor}"></div>`).join('')}</div>
                </div>
            </div>
            <div class="controls">
                ${coresAtivasNaRonda.map(cor => `<div class="color-btn ${corSelecionada === cor ? 'active' : ''}" style="background:${cor}" onclick="selecionarCor(this, '${cor}')"></div>`).join('')}
                <div style="width: 2px; height: 30px; background: #eee; margin: 0 5px;"></div>
                <button class="btn-action" style="background:#eee;" onclick="limparTudo()"><img src="${JOGO_CONFIG.caminhoImg}borracha.png" style="width:60%;"></button>
                <button class="btn-action btn-verify" onclick="validar()">V</button>
            </div>
        </div>
    `;
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const layer = document.getElementById('flash-layer');
    if (layer) {
        layer.style.opacity = "1";
        setTimeout(() => { 
            layer.style.opacity = "0"; 
            setTimeout(() => ajudaDisponivel = true, 3000); // Cooldown
        }, 1200);
    }
};

window.selecionarCor = function(el, cor) {
    corSelecionada = cor;
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
};

window.pintar = function(i) {
    if(!jogoAtivo) return;
    grelhaUtilizador[i] = corSelecionada;
    document.getElementById(`c-${i}`).style.background = corSelecionada;
};

window.limparTudo = function() {
    grelhaUtilizador = new Array(tamanhoGrelha * tamanhoGrelha).fill("#ffffff");
    document.querySelectorAll('.cell-paint').forEach(cell => cell.style.background = "white");
};

window.validar = function() {
    if(!jogoAtivo) return;
    const correto = grelhaUtilizador.every((v, i) => v.toLowerCase() === padraoCorreto[i].toLowerCase());
    if (correto) {
        acertos++; somAcerto.play();
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('user-grid').style.borderColor = "#7ed321";
        jogoAtivo = false;
        setTimeout(() => { indicePergunta++; proximaRonda(); jogoAtivo = true; }, 1200);
    } else {
        erros++; somErro.play();
        document.getElementById('miss-val').innerText = erros;
        document.getElementById('user-grid').style.borderColor = "#ff5e5e";
        setTimeout(() => { if(document.getElementById('user-grid')) document.getElementById('user-grid').style.borderColor = "#ddd"; }, 800);
    }
};

// === 3. FINALIZAÇÃO E RESULTADOS (PADRÃO IMAGEM) ===
function finalizarJogo() {
    somVitoria.play();
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <style>
            .res-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 20px; box-sizing: border-box; }
            .res-trophy { height: 120px; margin-bottom: 10px; object-fit: contain; }
            .res-msg { color: var(--primary-blue); font-weight: 900; font-size: 2.2rem; margin-bottom: 25px; text-align: center; }
            .res-stats-row { display: flex; gap: 15px; margin-bottom: 30px; width: 100%; max-width: 420px; justify-content: center; }
            .stat-box { background: white; border-radius: 25px; width: 110px; height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .stat-val { font-size: 1.8rem; font-weight: 900; margin-bottom: 2px; }
            .stat-lab { font-size: 0.65rem; font-weight: 900; color: #88a; text-transform: uppercase; letter-spacing: 0.5px; }
            .res-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 340px; }
            .btn-res { height: 60px; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; font-weight: 900; font-size: 1.1rem; text-decoration: none; cursor: pointer; transition: 0.2s; border: none; }
            .btn-redo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-redo:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }
            .btn-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); }
            .btn-exit { background: #e2e8f0; color: #64748b; }
        </style>
        <div class="res-container">
            <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" class="res-trophy">
            <h1 class="res-msg">${rel.titulo}</h1>
            <div class="res-stats-row">
                <div class="stat-box"><span class="stat-val" style="color: #7ed321;">${acertos}</span><span class="stat-lab">Certos</span></div>
                <div class="stat-box"><span class="stat-val" style="color: #ff5e5e;">${erros}</span><span class="stat-lab">Errados</span></div>
                <div class="stat-box"><span class="stat-val" style="color: #ff9f43;">${ajudasUtilizadas}</span><span class="stat-lab">Ajudas</span></div>
            </div>
            <div class="res-actions">
                <button class="btn-res btn-redo" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button class="btn-res btn-outline" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-exit"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
