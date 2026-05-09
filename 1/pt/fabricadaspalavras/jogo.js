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
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.4rem; margin:0;">COMO JOGAR</h2>
            <div style="display:flex; gap:10px; background:white; padding:20px; border-radius:20px; border:4px solid #0891b2; box-shadow:0 10px 20px rgba(0,0,0,0.1);">
                <div style="background:#f0f9ff; padding:10px 15px; border-radius:10px; font-weight:900; color:#164e63; font-size:1.5rem;">PA</div>
                <div style="background:#f0f9ff; padding:10px 15px; border-radius:10px; font-weight:900; color:#164e63; font-size:1.5rem;">TO</div>
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
    document.getElementById('round-val').innerText = `0 / ${config.target}`;

    container.innerHTML = `
        <style>
            .factory-wrapper { 
                display: flex; flex-direction: column; 
                width: 100%; height: 100%; 
                align-items: center; justify-content: space-between; /* Distribui os grupos pelo ecrã */
                padding: 15px; box-sizing: border-box; 
                position: relative; overflow: hidden;
            }
            
            .header-group { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 10; }
            
            .category-badge { background: var(--primary-blue); color: white; padding: 5px 20px; border-radius: 20px; font-weight: 900; font-size: 0.8rem; text-transform: uppercase; }

            .work-station { 
                flex: 0 1 auto; width: 100%; max-width: 500px; 
                background: #f8fafc; border: 4px dashed #0891b2; 
                border-radius: 25px; min-height: clamp(80px, 15vh, 120px); 
                display: flex; align-items: center; justify-content: center; 
                margin: 10px 0; z-index: 10; box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
            }
            .assembled-text { font-size: clamp(2rem, 8vw, 3rem); font-weight: 950; color: #0891b2; letter-spacing: 2px; }

            .factory-buttons { display: flex; gap: 15px; z-index: 10; margin-bottom: 5px; }
            .btn-f { padding: 12px 25px; border-radius: 15px; font-weight: 800; border: none; cursor: pointer; transition: 0.1s; font-size: 1rem; }
            .btn-mount { background: #0ea5e9; color: white; box-shadow: 0 5px 0 #0369a1; }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 5px 0 #64748b; }
            .btn-f:active { transform: translateY(3px); box-shadow: none; }

            .syllable-bank { 
                display: flex; flex-wrap: wrap; justify-content: center; 
                gap: clamp(8px, 2vw, 12px); width: 100%; max-width: 600px; 
                z-index: 10; padding: 10px 0;
            }
            .syl-pill { 
                background: white; border: 3px solid #0891b2; color: #164e63; 
                border-radius: 18px; padding: clamp(10px, 2vh, 18px) clamp(15px, 3vw, 25px); 
                font-size: clamp(1.1rem, 4vw, 1.5rem); font-weight: 900; 
                cursor: pointer; box-shadow: 0 5px 0 #0e7490; transition: 0.1s;
            }
            .syl-pill:active { transform: translateY(3px); box-shadow: 0 1px 0 #0e7490; }

            .warehouse { 
                width: 100%; max-width: 600px; background: rgba(255,255,255,0.7); 
                border-radius: 20px; padding: 12px; border: 2px solid #e2e8f0; 
                z-index: 10; min-height: 80px; display: flex; flex-direction: column; gap: 8px;
            }
            .word-tag { background: #0891b2; color: white; padding: 6px 15px; border-radius: 10px; font-weight: 800; font-size: 0.9rem; animation: popIn 0.4s; }
            
            .prog-bg { width: 100%; height: 10px; background: #e2e8f0; border-radius: 10px; overflow: hidden; border: 1px solid #cbd5e1; }
            .prog-fill { height: 100%; background: #06b6d4; width: 0%; transition: width 0.5s; }

            @keyframes popIn { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }

            @media (max-width: 480px) {
                .factory-wrapper { padding: 10px 5px; }
                .syllable-bank { gap: 6px; }
                .syl-pill { padding: 12px 18px; }
                .work-station { min-height: 80px; }
            }
        </style>

        <div class="factory-wrapper">
            <!-- GRUPO TOPO -->
            <div class="header-group">
                <div class="category-badge">${config.nome}</div>
                <div style="width:100%; max-width:300px;">
                    <div class="prog-bg"><div id="fab-bar" class="prog-fill"></div></div>
                </div>
            </div>

            <!-- GRUPO MEIO (AÇÃO) -->
            <div class="work-station" id="working-area">
                <span style="color:#cbd5e1; font-weight:bold;">Toca nas peças...</span>
            </div>

            <div class="factory-buttons">
                <button class="btn-f btn-mount" onclick="checkFactoryWord()">MONTAR</button>
                <button class="btn-f btn-clear" onclick="clearFactoryWord()">LIMPAR</button>
            </div>

            <!-- GRUPO TECLADO -->
            <div class="syllable-bank">
                ${config.bank.map(s => `<button class="syl-pill" onclick="addSyl('${s}')">${s}</button>`).join('')}
            </div>

            <!-- GRUPO FUNDO -->
            <div class="warehouse">
                <div style="font-size:0.65rem; font-weight:900; color:#94a3b8; text-transform:uppercase;">Armazém de Palavras:</div>
                <div id="warehouse-list" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
            </div>
        </div>
    `;
}

window.addSyl = function(syl) {
    if(selectedSyllables.length >= 5) return; 
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
        area.innerHTML = `<span style="color:#cbd5e1; font-weight:bold;">Toca nas peças...</span>`;
        return;
    }
    area.innerHTML = `<span class="assembled-text">${selectedSyllables.join('')}</span>`;
}

window.checkFactoryWord = function() {
    if (selectedSyllables.length === 0) return;
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
        
        flashArea("#10b981", "CERTO!");

        if (discoveredWords.size >= config.target) {
            setTimeout(finalizar, 1000);
        }
    } else {
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        flashArea("#ef4444", "ERRADO!");
    }
    selectedSyllables = [];
};

function flashArea(color, text) {
    const area = document.getElementById('working-area');
    area.innerHTML = `<span style="color:${color}; font-weight:950; font-size:1.8rem; animation: popIn 0.3s;">${text}</span>`;
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
            <h2 style="color:#0891b2; font-weight:900; font-size:1.8rem; text-align:center;">Fábrica Concluída!</h2>
            <div class="res-stats" style="display:flex; gap:15px; width:100%; max-width:320px; margin:20px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:#0891b2;">${discoveredWords.size}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Palavras</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:#0891b2;">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:18px; border-radius:22px; font-weight:900; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:15px; border-radius:22px; font-weight:900; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:18px; border-radius:22px; font-weight:900; background:#dce4ee; color:#5d7082; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
