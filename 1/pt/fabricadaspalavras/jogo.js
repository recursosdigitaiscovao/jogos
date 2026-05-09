let selectedSyllables = [];
let discoveredWords = new Set();
let roundAtual = 1;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    return `Bem-vindo à Fábrica! Tens 10 tentativas para montar palavras de ${config.slots} sílabas.`;
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; position:relative;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:1.2rem; text-transform:uppercase;">COMO JOGAR</div>
            <div style="display:flex; gap:10px; background:white; padding:20px; border-radius:20px; border:4px solid #0891b2; box-shadow:0 10px 20px rgba(0,0,0,0.1);">
                <div style="width:50px; height:50px; background:#f0f9ff; border:2px solid #0891b2; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#164e63;">BA</div>
                <div style="width:50px; height:50px; border:3px dashed #cbd5e1; border-radius:10px;"></div>
            </div>
            <div id="tut-hand" style="font-size:45px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px) scale(0.9); } } </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    discoveredWords.clear();
    selectedSyllables = [];
    roundAtual = 1;
    acertos = 0;
    erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('round-val').innerText = `1 / 10`;
    
    iniciarCronometro();
    montarFabrica();
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

function montarFabrica() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];

    container.innerHTML = `
        <style>
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-between; padding: 15px; box-sizing: border-box; }
            
            .station { 
                display: flex; gap: 12px; justify-content: center; align-items: center; 
                background: #f0f9ff; border: 4px dashed #0891b2; padding: 15px; border-radius: 25px;
                min-height: 100px; width: 100%; max-width: 500px; margin: 10px 0;
            }
            .mold {
                width: clamp(60px, 15vw, 90px); height: clamp(60px, 15vw, 90px);
                background: white; border: 3px dashed #cbd5e1; border-radius: 15px;
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.5rem, 5vw, 2.2rem); font-weight: 950; color: #0891b2;
            }
            .mold.filled { border: 3px solid #0891b2; border-bottom-width: 6px; animation: popIn 0.3s; }

            .btn-row { display: flex; gap: 15px; margin-bottom: 5px; }
            .btn-f { padding: 12px 25px; border-radius: 15px; font-weight: 800; border: none; cursor: pointer; font-size: 1rem; transition: 0.1s; }
            .btn-mount { background: #0ea5e9; color: white; box-shadow: 0 5px 0 #0369a1; }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 5px 0 #64748b; }
            .btn-f:active { transform: translateY(3px); box-shadow: none; }

            .bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 600px; padding: 10px 0; }
            .pill { 
                background: white; border: 3px solid #0891b2; color: #164e63; border-radius: 18px; 
                padding: clamp(10px, 2vh, 15px) clamp(15px, 3vw, 25px); 
                font-size: clamp(1.2rem, 4vw, 1.5rem); font-weight: 900; 
                cursor: pointer; box-shadow: 0 4px 0 #0e7490; transition: 0.1s;
            }
            .pill:active { transform: translateY(3px); box-shadow: 0 1px 0 #0e7490; }

            .warehouse { width: 100%; max-width: 600px; background: rgba(255,255,255,0.7); border-radius: 20px; padding: 10px; border: 2px solid #e2e8f0; min-height: 80px; }
            .tag { background: #0891b2; color: white; padding: 5px 12px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; animation: popIn 0.4s; }
            @keyframes popIn { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }

            @media (max-width: 480px) {
                .bank { gap: 8px; }
                .pill { padding: 12px; font-size: 1.1rem; }
                .mold { width: 65px; height: 65px; font-size: 1.5rem; }
            }
        </style>

        <div class="factory-wrapper">
            <div style="font-size:0.75rem; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${config.nome}</div>

            <div class="station" id="station"></div>

            <div class="btn-row">
                <button class="btn-f btn-mount" onclick="validateProduction()">MONTAR</button>
                <button class="btn-f btn-clear" onclick="clearProduction()">LIMPAR</button>
            </div>

            <div class="bank">
                ${config.bank.map(s => `<button class="pill" onclick="selectSyl('${s}')">${s}</button>`).join('')}
            </div>

            <div class="warehouse">
                <div style="font-size:0.65rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Armazém de Palavras:</div>
                <div id="warehouse-list" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
            </div>
        </div>
    `;
    drawMolds();
}

function drawMolds() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const area = document.getElementById('station');
    area.innerHTML = "";
    for (let i = 0; i < config.slots; i++) {
        const m = document.createElement('div');
        m.className = "mold " + (selectedSyllables[i] ? "filled" : "");
        m.innerText = selectedSyllables[i] || "";
        area.appendChild(m);
    }
}

window.selectSyl = function(s) {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    if (selectedSyllables.length < config.slots) {
        selectedSyllables.push(s);
        drawMolds();
    }
};

window.clearProduction = function() {
    selectedSyllables = [];
    drawMolds();
};

window.validateProduction = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    if (selectedSyllables.length < config.slots) return;

    const word = selectedSyllables.join('');

    if (discoveredWords.has(word)) {
        showFeedback("#f59e0b", "REPETIDA!");
        processRoundEnd(false); // Gasta uma ronda mesmo se for repetida
        return;
    }

    if (config.valid.includes(word)) {
        somAcerto.play();
        discoveredWords.add(word);
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        
        const list = document.getElementById('warehouse-list');
        const tag = document.createElement('div');
        tag.className = "tag"; tag.innerText = word;
        list.appendChild(tag);
        
        showFeedback("#10b981", "CERTO!");
        processRoundEnd(true);
    } else {
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        showFeedback("#ef4444", "ERRADO!");
        processRoundEnd(false);
    }
};

function processRoundEnd(isCorrect) {
    selectedSyllables = [];
    if (roundAtual >= 10) {
        setTimeout(finalizar, 1200);
    } else {
        roundAtual++;
        document.getElementById('round-val').innerText = `${roundAtual} / 10`;
        setTimeout(drawMolds, 1200);
    }
}

function showFeedback(color, text) {
    const area = document.getElementById('station');
    area.innerHTML = `<span style="color:${color}; font-weight:950; font-size:2rem; animation: popIn 0.3s;">${text}</span>`;
}

function finalizar() {
    clearInterval(intervaloTempo);
    somVitoria.play();
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px;">
            <img src="${JOGO_CONFIG.caminhoIcons}taca_1.png" style="height:100px; margin-bottom:15px;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; text-align:center;">Produção Encerrada!</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${discoveredWords.size}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Palavras</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:18px; border-radius:22px; font-weight:900; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:15px; border-radius:22px; font-weight:900; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outra Máquina</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:18px; border-radius:22px; font-weight:900; background:#dce4ee; color:#5d7082; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
