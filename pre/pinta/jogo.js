let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let corSelecionada = 1; // Começa com Vermelho
let grelhaUtilizador = [];

const CORES = {
    0: "#ffffff",
    1: "#ff4d5e", // Vermelho
    2: "#2ecc71", // Verde
    3: "#2196f3", // Azul
    4: "#ff9800"  // Laranja
};

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === INICIALIZAÇÃO ===
window.startLogic = function() {
    perguntas = JOGO_CATEGORIAS.niveis.itens;
    criarAnimacaoTutorial();
};

window.gerarIntroJogo = function() {
    return "Olha para o modelo e pinta a grelha com as mesmas cores!";
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:20px;">
            <div style="width:80px; height:80px; background:#f0f0f0; border:2px solid #ccc; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                <i class="fas fa-th" style="font-size:40px; color:#ccc;"></i>
            </div>
            <div style="font-size:24px; color:var(--primary-blue); animation: pulse 1s infinite;">➡️</div>
            <div style="width:80px; height:80px; background:white; border:3px solid var(--primary-blue); border-radius:10px; position:relative; display:flex; align-items:center; justify-content:center;">
                <div style="width:30px; height:30px; background:#ff4d5e; border-radius:5px;"></div>
                <div style="position:absolute; font-size:40px; bottom:-25px; right:-15px; animation: tapH 2s infinite;">☝️</div>
            </div>
        </div>
        <style>
            @keyframes tapH { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-10px,-10px); } }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        </style>
    `;
}

// === LÓGICA DO JOGO ===
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
    document.getElementById('round-val').innerText = `Nível ${nivel.nivel}`;

    grelhaUtilizador = new Array(nivel.padrao.length).fill(0);

    container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-between; padding: 10px; box-sizing: border-box; }
            .grids-row { display: flex; width: 100%; flex: 1; align-items: center; justify-content: center; gap: 20px; min-height: 0; }
            
            .model-img { height: 85%; aspect-ratio: 1/1; object-fit: contain; border: 4px solid #eee; border-radius: 15px; background: white; }
            
            .grid-paint { 
                display: grid; 
                grid-template-columns: repeat(${nivel.tamanho}, 1fr); 
                gap: 2px; background: #ccc; border: 4px solid #ccc; 
                height: 85%; aspect-ratio: 1/1; 
            }
            .cell { background: white; width: 100%; height: 100%; cursor: pointer; transition: 0.1s; }
            .cell:active { filter: brightness(0.9); }

            .palette { display: flex; gap: 12px; align-items: center; justify-content: center; padding: 15px; width: 100%; flex-shrink: 0; }
            .tool { width: 55px; height: 55px; border-radius: 50%; cursor: pointer; border: 4px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); transition: 0.2s; display: flex; align-items: center; justify-content: center; }
            .tool.active { transform: scale(1.15); border-color: #555; }
            
            .btn-v { width: 65px; height: 65px; border-radius: 50%; background: #2ecc71; color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 28px; cursor: pointer; box-shadow: 0 5px 0 #27ae60; }
            .btn-v:active { transform: translateY(3px); box-shadow: none; }

            @media (max-width: 600px) {
                .grids-row { gap: 10px; }
                .tool { width: 45px; height: 45px; }
                .btn-v { width: 55px; height: 55px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="grids-row">
                <!-- IMAGEM PNG DO NÍVEL -->
                <img src="${JOGO_CONFIG.caminhoImg}${nivel.imgModelo}" class="model-img">
                
                <!-- GRELHA INTERATIVA -->
                <div class="grid-paint" id="user-grid">
                    ${grelhaUtilizador.map((c, i) => `<div class="cell" id="cell-${i}" onclick="pintar(${i})" style="background:white"></div>`).join('')}
                </div>
            </div>

            <div class="palette">
                ${[1, 2, 3, 4].map(num => `
                    <div class="tool ${corSelecionada === num ? 'active' : ''}" 
                         style="background:${CORES[num]}" onclick="setCor(this, ${num})"></div>
                `).join('')}
                
                <div class="tool ${corSelecionada === 0 ? 'active' : ''}" 
                     style="background:white;" onclick="setCor(this, 0)">
                     <img src="${JOGO_CONFIG.caminhoImg}borracha.png" style="width:70%;">
                </div>

                <div class="btn-v" onclick="checar()">V</div>
            </div>
        </div>
    `;
}

function setCor(el, num) {
    corSelecionada = num;
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function pintar(idx) {
    grelhaUtilizador[idx] = corSelecionada;
    document.getElementById(`cell-${idx}`).style.background = CORES[corSelecionada];
}

function checar() {
    const nivel = perguntas[indicePergunta];
    const userStr = grelhaUtilizador.join(',');
    const targetStr = nivel.padrao.join(',');

    if (userStr === targetStr) {
        acertos++;
        somAcerto.play();
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('user-grid').style.borderColor = "#2ecc71";
        
        setTimeout(() => {
            indicePergunta++;
            if (indicePergunta < perguntas.length) mostrarPergunta();
            else finalizarJogo();
        }, 1500);
    } else {
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        document.getElementById('user-grid').style.borderColor = "#ff4d5e";
        setTimeout(() => { document.getElementById('user-grid').style.borderColor = "#ccc"; }, 1000);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const totalP = perguntas.length;
    const perc = (acertos / totalP) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:15px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:120px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color: var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:15px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-container" style="display:flex; gap:10px; width:100%; max-width:300px; margin-bottom:20px;">
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Níveis</span>
                </div>
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempoFinal}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;">
                <button class="res-btn res-btn-p" onclick="location.reload()" style="background:var(--primary-blue); color:white; border:none; padding:15px; border-radius:15px; font-weight:900; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);">Jogar de Novo</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="res-btn res-btn-m" style="background:#dce4ee; color:#5d7082; border:none; padding:15px; border-radius:15px; font-weight:900; text-align:center; text-decoration:none; box-shadow:0 5px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;

    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
