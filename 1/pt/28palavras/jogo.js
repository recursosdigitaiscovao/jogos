let selectedSyllables = [];
let historicoPalavras = []; 
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

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    return `Fábrica de Palavras: Tens 10 rondas para produzir palavras de ${config.slots} sílabas sem repetir!`;
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

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    historicoPalavras = [];
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
    // Escolhe uma palavra aleatória do pool do nível para garantir que as sílabas certas aparecem
    const semente = config.pool[Math.floor(Math.random() * config.pool.length)];
    
    let silabasSemente = [];
    if (config.slots === 2) {
        // Divide a palavra de 4 letras em 2 sílabas (Ex: CA-SA)
        const meio = Math.floor(semente.length / 2);
        silabasSemente = [semente.substring(0, meio), semente.substring(meio)];
    } else {
        // Divide a palavra de 6 letras em 3 sílabas (Ex: MA-CA-CO)
        silabasSemente = [semente.substring(0, 2), semente.substring(2, 4), semente.substring(4, 6)];
    }

    let banco = [...silabasSemente];
    // Preenche com sílabas extras até completar 10 peças no banco
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
            .factory-wrapper { 
                display: flex; flex-direction: column; 
                width: 100%; height: 100%; 
                align-items: center; padding: 10px; box-sizing: border-box; 
            }
            
            /* Estação de Montagem Central */
            .station { 
                display: flex; gap: 10px; justify-content: center; align-items: center; 
                background: #f0f9ff; border: 4px dashed #0891b2; padding: 12px; 
                border-radius: 25px; width: 100%; max-width: 450px;
                min-height: clamp(75px, 14vh, 100px); margin: 5px 0; flex-shrink: 0;
            }
            .mold {
                width: clamp(50px, 14vw, 75px); height: clamp(50px, 14vw, 75px);
                background: white; border: 3px dashed #cbd5e1; border-radius: 15px;
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.2rem, 5vw, 1.8rem); font-weight: 950; color: #0891b2;
            }
            .mold.filled { border: 3px solid #0891b2; border-bottom-width: 6px; animation: popIn 0.3s; }

            .btn-row { display: flex; gap: 15px; margin-bottom: 5px; flex-shrink: 0; }
            .btn-f { padding: 10px 25px; border-radius: 12px; font-weight: 800; border: none; cursor: pointer; font-size: 0.9rem; transition: 0.1s; }
            .btn-mount { background: #0ea5e9; color: white; box-shadow: 0 4px 0 #0369a1; }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 4px 0 #64748b; }
            .btn-f:active { transform: translateY(2px); box-shadow: none; }

            /* Banco de Sílabas (Peças) */
            .bank { 
                display: flex; flex-wrap: wrap; justify-content: center; 
                gap: 6px; width: 100%; max-width: 600px; padding: 5px 0; flex-shrink: 0;
            }
            .pill { 
                background: white; border: 3px solid #0891b2; color: #164e63; border-radius: 15px; 
                padding: clamp(8px, 1.5vh, 12px); min-width: clamp(50px, 14vw, 65px);
                font-size: clamp(0.95rem, 4vw, 1.3rem); font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #0e7490;
            }
            .pill:active { transform: translateY(2px); box-shadow: 0 1px 0 #0e7490; }
            
            /* ARMAZÉM FLEXÍVEL: Cresce quando o jogo é maximizado */
            .warehouse { 
                flex: 1; width: 100%; max-width: 600px; 
                background: rgba(255,255,255,0.7); border-radius: 20px; 
                padding: 10px; border: 2px solid #e2e8f0; margin-top: 10px;
                display: flex; flex-direction: column; overflow: hidden;
            }
            #history-list { 
                display: flex; flex-wrap: wrap; gap: 5px; 
                overflow-y: auto; align-content: flex-start;
            }
            .tag { background: #0891b2; color: white; padding: 4px 10px; border-radius: 8px; font-weight: 800; font-size: 0.75rem; animation: popIn 0.3s; }
            
            @keyframes popIn { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }
            @media (max-width: 480px) { .station { min-height: 70px; } .bank { gap: 4px; } }
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
                <div id="history-list">
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

    // 1. VERIFICA SE JÁ FOI PRODUZIDA
    if (historicoPalavras.includes(palavra)) {
        somErro.play();
        feedbackEstacao("#f59e0b", "REPETIDA!");
        setTimeout(proximaRondaFabrica, 1200);
        return;
    }

    // 2. VERIFICA NO DICIONÁRIO MESTRE PT-PT
    if (DICIONARIO_MESTRE.includes(palavra)) {
        somAcerto.play();
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        historicoPalavras.push(palavra);
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
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:15px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:11px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:11px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:14px; border-radius:22px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outra Máquina</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
