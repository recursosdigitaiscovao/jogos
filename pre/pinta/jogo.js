let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;
let categoriaAtual = "pintura";
let corSelecionada = 1; // Padrão: Vermelho
let grelhaUtilizador = [];

// Cores exatas da paleta
const CORES = {
    0: "#ffffff", // Branco (Borracha)
    1: "#ff4d5e", // Vermelho
    2: "#2ecc71", // Verde
    3: "#2196f3", // Azul
    4: "#ff9800"  // Laranja
};

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    selecionarCategoria("pintura");
    criarAnimacaoTutorial();
};

window.gerarIntroJogo = function() {
    return "Olha para o modelo e pinta a grelha com as cores iguais! No fim, clica no V para verificar.";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    perguntas = JOGO_CATEGORIAS[key].itens;
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:20px; height:100%; justify-content:center;">
            <div style="width:100px; height:100px; background:white; border:2px solid #ccc; display:grid; grid-template-columns:repeat(2,1fr);">
                <div style="background:${CORES[1]}"></div><div style="background:${CORES[3]}"></div>
                <div style="background:${CORES[2]}"></div><div style="background:${CORES[4]}"></div>
            </div>
            <div style="font-size:30px; color:var(--primary-blue); animation: pulse 1s infinite;">➡️</div>
            <div style="width:100px; height:100px; background:white; border:3px solid var(--primary-blue); position:relative; display:grid; grid-template-columns:repeat(2,1fr);">
                <div style="background:white"></div><div style="background:white"></div>
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

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    mostrarPergunta();
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

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const nivel = perguntas[indicePergunta];
    
    // Atualiza a Ronda corretamente
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / ${perguntas.length}`;

    grelhaUtilizador = new Array(nivel.padrao.length).fill(0);

    container.innerHTML = `
        <style>
            .game-inner { 
                display: flex; flex-direction: column; width: 100%; height: 100%; 
                align-items: center; justify-content: space-between; box-sizing: border-box; padding: 5px;
            }
            .stage-row { 
                display: flex; width: 100%; flex: 1; min-height: 0; 
                align-items: center; justify-content: center; gap: 20px; padding: 10px;
            }
            .img-model { 
                height: 90%; max-width: 45%; aspect-ratio: 1/1; 
                object-fit: contain; border: 3px solid #eee; border-radius: 15px; background: white; 
            }
            .grid-user { 
                display: grid; grid-template-columns: repeat(${nivel.tamanho}, 1fr); 
                height: 90%; aspect-ratio: 1/1; gap: 2px; 
                background: #ddd; border: 4px solid #ddd; border-radius: 5px;
            }
            .cell { background: white; width: 100%; height: 100%; cursor: pointer; transition: 0.1s; }
            .cell:active { filter: brightness(0.9); }

            .palette-bar { 
                display: flex; align-items: center; justify-content: center; gap: 12px; 
                width: 100%; height: 80px; flex-shrink: 0; padding-bottom: 5px;
            }
            .color-btn { 
                width: 55px; height: 55px; border-radius: 50%; cursor: pointer; 
                border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: 0.2s;
            }
            .color-btn.active { transform: scale(1.15); border-color: #555; }
            .btn-verify { 
                width: 60px; height: 60px; border-radius: 50%; background: #2ecc71; 
                color: white; display: flex; align-items: center; justify-content: center; 
                font-weight: 900; font-size: 26px; cursor: pointer; box-shadow: 0 5px 0 #27ae60; 
            }
            .btn-verify:active { transform: translateY(3px); box-shadow: none; }

            /* AJUSTE MOBILE VERTICAL */
            @media (max-width: 600px) {
                .stage-row { flex-direction: column; gap: 10px; }
                .img-model, .grid-user { height: 45%; max-width: 90%; }
                .color-btn { width: 42px; height: 42px; }
                .btn-verify { width: 50px; height: 50px; }
            }
        </style>
        <div class="game-inner">
            <div class="stage-row">
                <img src="${JOGO_CONFIG.caminhoImg}${nivel.imgModelo}" class="img-model">
                <div class="grid-user" id="user-grid">
                    ${grelhaUtilizador.map((c, i) => `<div class="cell" id="c-${i}" onclick="pintar(${i})"></div>`).join('')}
                </div>
            </div>
            <div class="palette-bar">
                ${[1,2,3,4].map(n => `<div class="color-btn ${corSelecionada===n?'active':''}" style="background:${CORES[n]}" onclick="setCor(this, ${n})"></div>`).join('')}
                <div class="color-btn ${corSelecionada===0?'active':''}" style="background:white; display:flex; align-items:center; justify-content:center;" onclick="setCor(this, 0)">
                    <img src="${JOGO_CONFIG.caminhoImg}borracha.png" style="width:65%;">
                </div>
                <div class="btn-verify" onclick="validar()">V</div>
            </div>
        </div>
    `;
}

window.setCor = function(el, n) {
    corSelecionada = n;
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
};

window.pintar = function(i) {
    grelhaUtilizador[i] = corSelecionada;
    document.getElementById(`c-${i}`).style.background = CORES[corSelecionada];
};

window.validar = function() {
    const nivel = perguntas[indicePergunta];
    const correto = grelhaUtilizador.every((v, i) => v === nivel.padrao[i]);

    if (correto) {
        acertos++; somAcerto.play();
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('user-grid').style.borderColor = "#2ecc71";
        setTimeout(() => {
            indicePergunta++;
            if (indicePergunta < perguntas.length) mostrarPergunta();
            else finalizarJogo();
        }, 1200);
    } else {
        erros++; somErro.play();
        document.getElementById('miss-val').innerText = erros;
        document.getElementById('user-grid').style.borderColor = "#ff4d5e";
        setTimeout(() => { document.getElementById('user-grid').style.borderColor = "#ddd"; }, 800);
    }
};

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const total = perguntas.length;
    const perc = (acertos / total) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:15px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:110px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-container" style="display:flex; gap:10px; width:100%; max-width:300px; margin-bottom:20px;">
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Rondas</span>
                </div>
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;">
                <button class="res-btn res-btn-p" onclick="location.reload()" style="background:var(--primary-blue); color:white; border:none; padding:15px; border-radius:15px; font-weight:900; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);">Jogar de Novo</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="background:#dce4ee; color:#5d7082; border:none; padding:15px; border-radius:15px; font-weight:900; text-align:center; text-decoration:none; box-shadow:0 5px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
