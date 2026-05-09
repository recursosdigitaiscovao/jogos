let selectedSyllables = [];
let discoveredWords = new Set();
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
    return "Bem-vindo à Fábrica! Escolhe as sílabas e clica em 'Montar' para produzir palavras.";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; position:relative;">
            <div style="display:flex; gap:8px;">
                <div style="background:white; border:2px solid #0891b2; border-radius:10px; padding:10px; font-weight:900; color:#164e63; font-size:1.2rem;">PA</div>
                <div style="background:white; border:2px solid #0891b2; border-radius:10px; padding:10px; font-weight:900; color:#164e63; font-size:1.2rem;">TO</div>
            </div>
            <div id="tut-hand" style="font-size:40px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px) scale(0.9); } } </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    discoveredWords.clear();
    selectedSyllables = [];
    acertos = 0;
    erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    
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
    // Contador no formato 0 / 5 como solicitado
    document.getElementById('round-val').innerText = `0 / ${config.target}`;

    container.innerHTML = `
        <style>
            .factory-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; padding:10px; box-sizing:border-box; position:relative; overflow:hidden; }
            
            .gear { animation: spin 5s linear infinite; color: #0891b2; position: absolute; opacity: 0.1; z-index: 0; pointer-events:none; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

            .work-station { 
                width: 100%; max-width: 450px; background: #f0f9ff; border: 3px dashed #0891b2; 
                border-radius: 20px; min-height: 80px; display: flex; align-items: center; 
                justify-content: center; margin: 10px 0; position: relative; z-index: 10;
            }
            .assembled-text { font-size: 2.2rem; font-weight: 900; color: #0891b2; letter-spacing: 2px; }

            .factory-buttons { display: flex; gap: 10px; margin-bottom: 15px; z-index: 10; }
            .btn-mount { background: #0ea5e9; color: white; padding: 10px 20px; border-radius: 12px; font-weight: 800; box-shadow: 0 4px 0 #0369a1; cursor:pointer; border:none; font-size: 0.9rem; }
            .btn-clear { background: #94a3b8; color: white; padding: 10px 20px; border-radius: 12px; font-weight: 800; box-shadow: 0 4px 0 #64748b; cursor:pointer; border:none; font-size: 0.9rem; }
            .btn-mount:active, .btn-clear:active { transform: translateY(2px); box-shadow: none; }

            /* BANCO DE SÍLABAS REDUZIDO PARA MOBILE */
            .syllable-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; max-width: 100%; z-index: 10; padding: 0 5px; }
            .syl-pill { 
                background: white; border: 2px solid #0891b2; color: #164e63; border-radius: 15px; 
                padding: 10px 15px; font-size: 1.1rem; font-weight: 900; cursor: pointer; 
                box-shadow: 0 4px 0 #0e7490; transition: 0.1s; min-width: 55px; text-align:center;
            }
            .syl-pill:active { transform: translateY(2px); box-shadow: 0 1px 0 #0e7490; }

            .warehouse { 
                width: 100%; background: rgba(255,255,255,0.6); border-radius: 15px; padding: 10px; margin-top: auto;
                border: 1px solid #e2e8f0; z-index: 10; min-height: 60px;
            }
            .word-tag { background: #0891b2; color: white; padding: 4px 10px; border-radius: 8px; font-weight: bold; font-size: 0.8rem; animation: popIn 0.3s forwards; }
            @keyframes popIn { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }
            
            .prog-bg { width: 100%; height: 8px; background: #e2e8f0; border-radius: 10px; margin-bottom: 5px; overflow: hidden; }
            .prog-fill { height: 100%; background: #06b6d4; width: 0%; transition: width 0.4s; }
        </style>

        <div class="factory-wrapper">
            <i class="fas fa-cog gear" style="top:2%; left:5%; font-size:60px;"></i>
            <i class="fas fa-cog gear" style="top:15%; right:5%; font-size:40px;"></i>

            <div style="width:100%; max-width:300px; z-index:10;">
                <div class="prog-bg"><div id="fab-bar" class="prog-fill"></div></div>
            </div>

            <div class="work-station" id="working-area">
                <span style="color:#cbd5e1; font-size:0.9rem; font-weight:bold;">Toca nas peças...</span>
            </div>

            <div class="factory-buttons">
                <button class="btn-mount" onclick="checkFactoryWord()">MONTAR</button>
                <button class="btn-clear" onclick="clearFactoryWord()">LIMPAR</button>
            </div>

            <div class="syllable-bank">
                ${config.bank.map(s => `<button class="syl-pill" onclick="addSyl('${s}')">${s}</button>`).join('')}
            </div>

            <div class="warehouse">
                <div style="font-size:0.6rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Armazém:</div>
                <div id="warehouse-list" style="display:flex; flex-wrap:wrap; gap:5px;"></div>
            </div>
        </div>
    `;
}

window.addSyl = function(syl) {
    if(selectedSyllables.length >= 4) return; // Limite de segurança
    selectedSyllables.push(syl);
    updateWorkDisplay();
};

window.clearFactoryWord = function() {
    selectedSyllables = [];
    updateWorkDisplay();
};

function updateWorkDisplay() {
    const area = document.getElementById('working-area');
    if (selectedSyllables.length === 0) {
        area.innerHTML = `<span style="color:#cbd5e1; font-size:0.9rem; font-weight:bold;">Toca nas peças...</span>`;
        return;
    }
    area.innerHTML = `<span class="assembled-text">${selectedSyllables.join('')}</span>`;
}

window.checkFactoryWord = function() {
    const word = selectedSyllables.join('');
    const config = JOGO_CATEGORIAS[categoriaAtual];

    if (discoveredWords.has(word)) {
        flashArea("#f59e0b", "REPETIDA!");
        return;
    }

    if (config.valid.includes(word)) {
        somAcerto.play();
        discoveredWords.add(word);
        acertos++;
        
        const list = document.getElementById('warehouse-list');
        const tag = document.createElement('div');
        tag.className = "word-tag";
        tag.innerText = word;
        list.appendChild(tag);

        const perc = (discoveredWords.size / config.target) * 100;
        document.getElementById('fab-bar').style.width = `${perc}%`;
        document.getElementById('round-val').innerText = `${discoveredWords.size} / ${config.target}`;
        
        flashArea("#10b981", "MONTADA!");

        if (discoveredWords.size >= config.target) {
            setTimeout(finalizar, 1000);
        }
    } else {
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        flashArea("#ef4444", "DEFEITUOSA!");
    }
    selectedSyllables = [];
};

function flashArea(color, text) {
    const area = document.getElementById('working-area');
    area.innerHTML = `<span style="color:${color}; font-weight:900; font-size:1.4rem;">${text}</span>`;
    setTimeout(() => { if (selectedSyllables.length === 0) updateWorkDisplay(); }, 1000);
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
            <h2 style="color:#0891b2; font-weight:900; font-size:1.8rem; text-align:center;">Fábrica a 100%!</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:#0891b2;">${discoveredWords.size}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Palavras</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:#0891b2;">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;">
                <button style="padding:16px; border-radius:20px; font-weight:900; background:#0ea5e9; color:white; border:none; box-shadow:0 6px 0 #0891b2; text-transform:uppercase;" onclick="location.reload()">Reiniciar Máquina</button>
                <button style="padding:14px; border-radius:20px; font-weight:900; background:white; color:#0891b2; border:3px solid #0891b2; box-shadow:0 6px 0 #0891b2; text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:20px; font-weight:900; background:#dce4ee; color:#5d7082; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
