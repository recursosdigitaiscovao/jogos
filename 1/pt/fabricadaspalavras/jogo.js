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
    const config = JOGO_CATEGORIAS[categoriaAtual];
    return `Bem-vindo! Escolhe exatamente ${config.slots} peças para montar cada palavra.`;
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; position:relative;">
            <div style="display:flex; gap:10px;">
                <div style="width:50px; height:50px; border:3px solid #0891b2; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#0891b2; background:white;">PA</div>
                <div style="width:50px; height:50px; border:3px dashed #cbd5e1; border-radius:10px;"></div>
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
    document.getElementById('round-val').innerText = `0 / ${config.target}`;

    container.innerHTML = `
        <style>
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-between; padding: 15px; box-sizing: border-box; }
            
            .work-station { 
                display: flex; gap: 12px; justify-content: center; align-items: center; 
                background: #f0f9ff; border: 4px dashed #0891b2; padding: 20px; border-radius: 25px;
                min-height: 100px; width: 100%; max-width: 500px; margin: 10px 0;
            }
            .slot-mold {
                width: clamp(60px, 15vw, 90px); height: clamp(60px, 15vw, 90px);
                background: white; border: 3px dashed #cbd5e1; border-radius: 15px;
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.5rem, 5vw, 2.2rem); font-weight: 950; color: #0891b2;
                transition: all 0.3s;
            }
            .slot-mold.filled { border: 3px solid #0891b2; border-bottom-width: 6px; animation: popSlot 0.3s; }
            @keyframes popSlot { 0% { transform: scale(0.8); } 100% { transform: scale(1); } }

            .factory-buttons { display: flex; gap: 15px; margin-bottom: 5px; }
            .btn-f { padding: 12px 25px; border-radius: 15px; font-weight: 800; border: none; cursor: pointer; font-size: 1rem; }
            .btn-mount { background: #0ea5e9; color: white; box-shadow: 0 5px 0 #0369a1; }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 5px 0 #64748b; }
            .btn-f:active { transform: translateY(3px); box-shadow: none; }

            .syllable-bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 600px; padding: 10px 0; }
            .syl-pill { 
                background: white; border: 3px solid #0891b2; color: #164e63; border-radius: 18px; 
                padding: 10px 18px; font-size: 1.2rem; font-weight: 900; cursor: pointer; 
                box-shadow: 0 4px 0 #0e7490; transition: 0.1s;
            }
            .syl-pill:active { transform: translateY(3px); box-shadow: 0 1px 0 #0e7490; }

            .warehouse { width: 100%; max-width: 600px; background: rgba(255,255,255,0.7); border-radius: 20px; padding: 12px; border: 2px solid #e2e8f0; min-height: 80px; }
            .word-tag { background: #0891b2; color: white; padding: 5px 12px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; animation: popIn 0.4s; }
            
            .prog-bg { width: 100%; height: 10px; background: #e2e8f0; border-radius: 10px; overflow: hidden; border: 1px solid #cbd5e1; }
            .prog-fill { height: 100%; background: #06b6d4; width: 0%; transition: width 0.5s; }
        </style>

        <div class="factory-wrapper">
            <div style="width:100%; max-width:300px;">
                <div class="prog-bg"><div id="fab-bar" class="prog-fill"></div></div>
            </div>

            <div class="work-station" id="station">
                <!-- Os slots serão gerados aqui dinamicamente -->
            </div>

            <div class="factory-buttons">
                <button class="btn-f btn-mount" onclick="checkFactoryWord()">MONTAR</button>
                <button class="btn-f btn-clear" onclick="clearFactoryWord()">LIMPAR</button>
            </div>

            <div class="syllable-bank">
                ${config.bank.map(s => `<button class="syl-pill" onclick="addSyl('${s}')">${s}</button>`).join('')}
            </div>

            <div class="warehouse">
                <div style="font-size:0.65rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Armazém de Palavras:</div>
                <div id="warehouse-list" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
            </div>
        </div>
    `;
    renderMolds();
}

function renderMolds() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const station = document.getElementById('station');
    station.innerHTML = "";
    for (let i = 0; i < config.slots; i++) {
        const slot = document.createElement('div');
        slot.className = "slot-mold";
        slot.id = `mold-${i}`;
        // Se já houver uma sílaba selecionada para esta posição, mostra-a
        if (selectedSyllables[i]) {
            slot.innerText = selectedSyllables[i];
            slot.classList.add('filled');
        } else {
            slot.innerText = "";
        }
        station.appendChild(slot);
    }
}

window.addSyl = function(syl) {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    if (selectedSyllables.length < config.slots) {
        selectedSyllables.push(syl);
        renderMolds();
    }
};

window.clearFactoryWord = function() {
    selectedSyllables = [];
    renderMolds();
};

window.checkFactoryWord = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    if (selectedSyllables.length < config.slots) return; // Só valida se estiver cheio

    const word = selectedSyllables.join('');

    if (discoveredWords.has(word)) {
        showFeedback("#f59e0b", "REPETIDA!");
        return;
    }

    if (config.valid.includes(word)) {
        somAcerto.play();
        discoveredWords.add(word);
        acertos++;
        
        // Adiciona ao armazém
        const list = document.getElementById('warehouse-list');
        const tag = document.createElement('div');
        tag.className = "word-tag";
        tag.innerText = word;
        list.appendChild(tag);

        // Atualiza barra
        const perc = (discoveredWords.size / config.target) * 100;
        document.getElementById('fab-bar').style.width = `${perc}%`;
        document.getElementById('round-val').innerText = `${discoveredWords.size} / ${config.target}`;
        
        showFeedback("#10b981", "CERTO!");

        if (discoveredWords.size >= config.target) {
            setTimeout(finalizar, 1000);
        }
    } else {
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        showFeedback("#ef4444", "ERRO!");
    }
    selectedSyllables = [];
};

function showFeedback(color, text) {
    const station = document.getElementById('station');
    const oldContent = station.innerHTML;
    station.innerHTML = `<span style="color:${color}; font-weight:950; font-size:2rem;">${text}</span>`;
    setTimeout(() => { if (selectedSyllables.length === 0) renderMolds(); }, 1000);
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
