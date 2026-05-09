let selectedSyllables = [];
let historicoPalavras = []; // NOVA: Guarda as palavras produzidas
let roundAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;
let bancoDaRonda = [];

let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return `Bem-vindo! Tens 10 rondas para produzir palavras. As peças mudam sempre!`;
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; position:relative;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:1.2rem;">COMO JOGAR</div>
            <div style="display:flex; gap:10px; background:white; padding:20px; border-radius:20px; border:4px solid #0891b2;">
                <div style="width:50px; height:50px; background:#f0f9ff; border:2px solid #0891b2; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#164e63;">BA</div>
                <div style="width:50px; height:50px; border:3px dashed #cbd5e1; border-radius:10px;"></div>
            </div>
            <div id="tut-hand" style="font-size:45px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px) scale(0.9); } } </style>
    `;
}

window.initGame = function() {
    historicoPalavras = []; // Limpa no início do jogo
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
    gerarBancoDeSilabas();
    renderizarEcraFabrica();
}

function gerarBancoDeSilabas() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const semente = config.pool[Math.floor(Math.random() * config.pool.length)];
    let silabasSemente = [];
    if (config.slots === 2) {
        silabasSemente = [semente.substring(0, semente.length/2), semente.substring(semente.length/2)];
    } else {
        silabasSemente = [semente.substring(0, 2), semente.substring(2, 4), semente.substring(4, 6)];
    }
    let banco = [...silabasSemente];
    while(banco.length < 10) {
        let extra = config.extras[Math.floor(Math.random() * config.extras.length)];
        if(!banco.includes(extra)) banco.push(extra);
    }
    bancoDaRonda = banco.sort(() => Math.random() - 0.5);
}

function renderizarEcraFabrica() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];

    container.innerHTML = `
        <style>
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-between; padding: 10px; box-sizing: border-box; }
            .station { 
                display: flex; gap: 10px; justify-content: center; align-items: center; 
                background: #f0f9ff; border: 4px dashed #0891b2; padding: 12px; border-radius: 25px;
                min-height: clamp(75px, 14vh, 100px); width: 100%; max-width: 450px; margin: 5px 0;
            }
            .mold {
                width: clamp(50px, 14vw, 75px); height: clamp(50px, 14vw, 75px);
                background: white; border: 3px dashed #cbd5e1; border-radius: 15px;
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.2rem, 5vw, 1.8rem); font-weight: 950; color: #0891b2;
            }
            .mold.filled { border: 3px solid #0891b2; border-bottom-width: 6px; animation: popIn 0.3s; }
            .btn-row { display: flex; gap: 15px; margin-bottom: 5px; }
            .btn-f { padding: 10px 25px; border-radius: 12px; font-weight: 800; border: none; cursor: pointer; font-size: 0.9rem; transition: 0.1s; }
            .btn-mount { background: #0ea5e9; color: white; box-shadow: 0 4px 0 #0369a1; }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 4px 0 #64748b; }
            .btn-f:active { transform: translateY(2px); box-shadow: none; }
            .bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; width: 100%; max-width: 600px; padding: 5px 0; }
            .pill { 
                background: white; border: 3px solid #0891b2; color: #164e63; border-radius: 15px; 
                padding: clamp(8px, 1.5vh, 12px); min-width: clamp(50px, 14vw, 65px);
                font-size: clamp(0.95rem, 4vw, 1.3rem); font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #0e7490;
            }
            .pill:active { transform: translateY(2px); box-shadow: 0 1px 0 #0e7490; }
            
            /* ARMAZÉM COM ALTURA FIXA E WRAP PARA NÃO TER SCROLL */
            .warehouse { width: 100%; max-width: 600px; background: rgba(255,255,255,0.7); border-radius: 20px; padding: 10px; border: 2px solid #e2e8f0; height: 85px; }
            .tag { background: #0891b2; color: white; padding: 4px 10px; border-radius: 8px; font-weight: 800; font-size: 0.75rem; animation: popIn 0.3s; }
            @keyframes popIn { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }
            @media (max-width: 480px) { .station { min-height: 70px; } .warehouse { height: 75px; } }
        </style>
        <div class="factory-wrapper">
            <div style="font-size:0.65rem; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${config.nome}</div>
            <div class="station" id="molds-area"></div>
            <div class="btn-row">
                <button class="btn-f btn-mount" onclick="validarProducao()">MONTAR</button>
                <button class="btn-f btn-clear" onclick="limparProducao()">LIMPAR</button>
            </div>
            <div class="bank">
                ${bancoDaRonda.map(s => `<button class="pill" onclick="clicarSilaba('${s}')">${s}</button>`).join('')}
            </div>
            <div class="warehouse">
                <div style="font-size:0.55rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Armazém de Palavras:</div>
                <div id="history-list" style="display:flex; flex-wrap:wrap; gap:5px;">
                    <!-- AQUI AS PALAVRAS PERSISTEM -->
                    ${historicoPalavras.map(p => `<div class="tag">${p}</div>`).join('')}
                </div>
            </div>
        </div>
    `;
    atualizarMoldes();
}

function atualizarMoldes() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const area = document.getElementById('molds-area');
    area.innerHTML = "";
    for (let i = 0; i < config.slots; i++) {
        const m = document.createElement('div');
        m.className = "mold " + (selectedSyllables[i] ? "filled" : "");
        m.innerText = selectedSyllables[i] || "";
        area.appendChild(m);
    }
}

window.clicarSilaba = function(s) {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    if (selectedSyllables.length < config.slots) {
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
    if (selectedSyllables.length < config.slots) return;
    const palavra = selectedSyllables.join('');
    const dicionario = config.slots === 2 ? DICIONARIO_GLOBAL.dissilabos : DICIONARIO_GLOBAL.trissilabos;

    if (dicionario.includes(palavra)) {
        somAcerto.play();
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        
        // ADICIONA AO HISTÓRICO PERSISTENTE
        if(!historicoPalavras.includes(palavra)) historicoPalavras.push(palavra);
        
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
    area.innerHTML = `<span style="color:${color}; font-weight:950; font-size:1.8rem; animation: popIn 0.3s;">${txt}</span>`;
    document.querySelectorAll('.pill').forEach(b => b.style.pointerEvents = 'none');
}

function finalizarFabrica() {
    clearInterval(intervaloTempo); somVitoria.play();
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px;">
            <img src="${JOGO_CONFIG.caminhoIcons}taca_1.png" style="height:100px; margin-bottom:15px;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; text-align:center;">Produção Finalizada!</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <button class="btn-f btn-mount" style="width:280px; padding:15px; margin-bottom:10px;" onclick="location.reload()">Jogar de Novo</button>
            <a href="${JOGO_CONFIG.linkVoltar}" style="color:#88a; text-decoration:none; font-weight:bold; font-size:0.9rem;">Sair do Jogo</a>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
