let selectedSyllables = [];
let discoveredWords = []; 
let roundAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;
let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Puzzle de Sílabas: Quantas palavras consegues formar com estas peças?";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; position:relative;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:1.2rem; text-transform:uppercase;">COMO JOGAR</div>
            <div style="display:flex; gap:10px; background:white; padding:20px; border-radius:20px; border:4px solid #0891b2; box-shadow:0 10px 20px rgba(0,0,0,0.1);">
                <div style="width:50px; height:50px; background:#f0f9ff; border:2px solid #0891b2; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#164e63;">MA</div>
                <div style="width:50px; height:50px; border:3px dashed #cbd5e1; border-radius:10px;"></div>
            </div>
            <div id="tut-hand" style="font-size:45px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px) scale(0.9); } } </style>
    `;
}

window.initGame = function() {
    discoveredWords = [];
    roundAtual = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    proximaRondaFabrica();
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

function proximaRondaFabrica() {
    roundAtual++;
    if (roundAtual > 10) { finalizarFabrica(); return; }
    document.getElementById('round-val').innerText = `${roundAtual} / 10`;
    selectedSyllables = [];
    renderizarEcraFabrica();
}

function renderizarEcraFabrica() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];

    container.innerHTML = `
        <style>
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-between; padding: 10px; box-sizing: border-box; }
            .station { 
                display: flex; gap: 10px; justify-content: center; align-items: center; 
                background: #f0f9ff; border: 3px dashed #0891b2; padding: 12px; border-radius: 25px;
                min-height: clamp(70px, 16vh, 110px); width: 100%; max-width: 450px; margin: 5px 0;
            }
            .mold {
                width: clamp(50px, 14vw, 85px); height: clamp(50px, 14vw, 85px);
                background: white; border: 3px dashed #cbd5e1; border-radius: 15px;
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.1rem, 5vw, 2rem); font-weight: 950; color: #0891b2;
            }
            .mold.filled { border: 3px solid #0891b2; border-bottom-width: 6px; animation: popIn 0.3s; }
            .btn-row { display: flex; gap: 12px; margin-bottom: 5px; }
            .btn-f { padding: 10px 22px; border-radius: 14px; font-weight: 800; border: none; cursor: pointer; font-size: 0.9rem; transition: 0.1s; }
            .btn-mount { background: #0ea5e9; color: white; box-shadow: 0 5px 0 #0369a1; }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 5px 0 #64748b; }
            .bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; width: 100%; max-width: 600px; padding: 10px 0; }
            .pill { 
                background: white; border: 3px solid #0891b2; color: #164e63; border-radius: 18px; 
                padding: clamp(8px, 1.8vh, 16px); min-width: clamp(60px, 18vw, 90px);
                font-size: clamp(1rem, 4.5vw, 1.5rem); font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #0e7490;
            }
            .warehouse { width: 100%; max-width: 600px; background: rgba(255,255,255,0.7); border-radius: 20px; padding: 10px; border: 2px solid #e2e8f0; height: 85px; overflow: hidden; }
            .tag { background: #0891b2; color: white; padding: 4px 12px; border-radius: 8px; font-weight: 800; font-size: 0.8rem; animation: popIn 0.3s; }

            /* MEDIA QUERY PARA MODO LANDSCAPE COM PERMISSÃO DE SCROLL */
            @media screen and (max-height: 500px) {
                .factory-wrapper { height: auto !important; min-height: 100%; flex-direction: row; flex-wrap: wrap; justify-content: center; align-content: flex-start; gap: 15px; padding: 10px 5px; }
                .station { width: 45%; min-height: 80px; margin: 0; }
                .bank { width: 50%; padding: 0; }
                .btn-row { width: 100%; order: 3; justify-content: center; margin: 5px 0; }
                .warehouse { width: 100%; order: 4; height: auto; min-height: 60px; padding: 8px; }
            }
            @keyframes popIn { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }
        </style>
        <div class="factory-wrapper">
            <div class="station" id="molds-area"></div>
            <div class="bank">
                ${desafio.bank.map(s => `<button class="pill" onclick="clicarSilaba('${s}')">${s}</button>`).join('')}
            </div>
            <div class="btn-row">
                <button class="btn-f btn-mount" onclick="validarProducao()">MONTAR</button>
                <button class="btn-f btn-clear" onclick="limparProducao()">LIMPAR</button>
            </div>
            <div class="warehouse">
                <div style="font-size:0.55rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Armazém:</div>
                <div id="history-list" style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${discoveredWords.map(p => `<div class="tag">${p}</div>`).join('')}
                </div>
            </div>
        </div>
    `;
    atualizarMoldes();
}

function atualizarMoldes() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];
    const area = document.getElementById('molds-area');
    area.innerHTML = "";
    for (let i = 0; i < desafio.slots; i++) {
        const m = document.createElement('div');
        m.className = "mold " + (selectedSyllables[i] ? "filled" : "");
        m.innerText = selectedSyllables[i] || "";
        area.appendChild(m);
    }
}

window.clicarSilaba = function(s) {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) {
        selectedSyllables.push(s);
        atualizarMoldes();
    }
};

window.limparProducao = function() {
    selectedSyllables = [];
    atualizarMoldes();
};

window.validarProducao = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) return;
    const palavra = selectedSyllables.join('');

    if (discoveredWords.includes(palavra)) {
        somErro.play();
        feedbackEstacao("#f59e0b", "REPETIDA!");
    } else if (DICIONARIO_MESTRE.includes(palavra)) {
        somAcerto.play();
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        discoveredWords.push(palavra);
        feedbackEstacao("#10b981", "CERTO!");
    } else {
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        feedbackEstacao("#ef4444", "ERRO!");
    }
    setTimeout(proximaRondaFabrica, 1200);
};

function feedbackEstacao(color, txt) {
    const area = document.getElementById('molds-area');
    area.innerHTML = `<span style="color:${color}; font-weight:950; font-size:1.5rem; animation: popIn 0.3s;">${txt}</span>`;
    document.querySelectorAll('.pill').forEach(b => b.style.pointerEvents = 'none');
}

function finalizarFabrica() {
    clearInterval(intervaloTempo);
    somVitoria.play();
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; padding:20px;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:80px; margin-bottom:10px;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.5rem; margin-bottom:10px;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:10px 0;">
                <div style="background:white; border-radius:18px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:20px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:10px; font-weight:800; color:#88a;">Acertos</span>
                </div>
                <div style="background:white; border-radius:18px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:20px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;">
                <button style="padding:12px; border-radius:18px; font-weight:900; background:var(--primary-blue); color:white; border:none; box-shadow:0 5px 0 var(--primary-dark);" onclick="location.reload()">Jogar de Novo</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:12px; border-radius:18px; font-weight:900; background:#dce4ee; color:#5d7082; text-align:center; text-decoration:none; box-shadow:0 5px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
}
