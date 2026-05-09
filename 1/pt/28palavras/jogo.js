let selectedSyllables = [];
let historicoPalavras = []; // Guarda as palavras para persistir entre rondas
let roundAtual = 0;
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
    return "Bem-vindo à Fábrica! Monta palavras reais para encher o armazém.";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; position:relative;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:1.2rem; text-transform:uppercase;">COMO JOGAR</div>
            <div style="display:flex; gap:10px; background:white; padding:20px; border-radius:20px; border:4px solid #0891b2; box-shadow:0 10px 20px rgba(0,0,0,0.1);">
                <div style="width:50px; height:50px; background:#f0f9ff; border:2px solid #0891b2; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#164e63;">ME</div>
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
    roundAtual = 0;
    acertos = 0;
    erros = 0;
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
            .factory-wrapper { 
                display: flex; flex-direction: column; 
                width: 100%; height: 100%; 
                align-items: center; justify-content: space-between; 
                padding: 10px; box-sizing: border-box; 
            }
            
            .station { 
                display: flex; gap: 10px; justify-content: center; align-items: center; 
                background: #f0f9ff; border: 4px dashed #0891b2; padding: 12px; 
                border-radius: 25px; width: 100%; max-width: 480px;
                min-height: clamp(80px, 15vh, 110px); margin: 5px 0;
            }
            .mold {
                width: clamp(55px, 15vw, 85px); height: clamp(55px, 15vw, 85px);
                background: white; border: 3px dashed #cbd5e1; border-radius: 15px;
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.3rem, 5vw, 2.2rem); font-weight: 950; color: #0891b2;
            }
            .mold.filled { border: 3px solid #0891b2; border-bottom-width: 6px; animation: popIn 0.3s; }

            .btn-row { display: flex; gap: 15px; margin-bottom: 5px; }
            .btn-f { padding: 12px 25px; border-radius: 15px; font-weight: 800; border: none; cursor: pointer; font-size: 0.95rem; transition: 0.1s; }
            .btn-mount { background: #0ea5e9; color: white; box-shadow: 0 5px 0 #0369a1; }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 5px 0 #64748b; }
            .btn-f:active { transform: translateY(3px); box-shadow: none; }

            .bank { 
                display: flex; flex-wrap: wrap; justify-content: center; 
                gap: 8px; width: 100%; max-width: 550px; padding: 10px 0;
            }
            .pill { 
                background: white; border: 3px solid #0891b2; color: #164e63; border-radius: 15px; 
                padding: clamp(8px, 1.8vh, 15px); min-width: clamp(60px, 18vw, 85px);
                font-size: clamp(1.1rem, 4vw, 1.5rem); font-weight: 900; 
                cursor: pointer; box-shadow: 0 4px 0 #0e7490; transition: 0.1s;
            }
            .pill:active { transform: translateY(3px); box-shadow: 0 1px 0 #0e7490; }

            .warehouse { 
                width: 100%; max-width: 600px; background: rgba(255,255,255,0.7); 
                border-radius: 20px; padding: 10px; border: 2px solid #e2e8f0; 
                height: 90px; overflow: hidden; /* Mantém as palavras visíveis sem scroll */
            }
            .tag { background: #0891b2; color: white; padding: 4px 12px; border-radius: 8px; font-weight: 800; font-size: 0.8rem; animation: popIn 0.3s; }
            
            @keyframes popIn { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }

            @media (max-width: 480px) {
                .bank { gap: 6px; }
                .pill { padding: 10px; min-width: 55px; }
                .station { min-height: 80px; padding: 8px; }
            }
        </style>

        <div class="factory-wrapper">
            <div style="font-size:0.7rem; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${config.nome}</div>

            <!-- Estação com Moldes/Slots -->
            <div class="station" id="station"></div>

            <div class="btn-row">
                <button class="btn-f btn-mount" onclick="validarFabrica()">MONTAR</button>
                <button class="btn-f btn-clear" onclick="limparFabrica()">LIMPAR</button>
            </div>

            <!-- Peças da Ronda -->
            <div class="bank">
                ${desafio.bank.map(s => `<button class="pill" onclick="clicarPeca('${s}')">${s}</button>`).join('')}
            </div>

            <!-- Armazém Persistente -->
            <div class="warehouse">
                <div style="font-size:0.6rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Armazém:</div>
                <div id="warehouse-list" style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${historicoPalavras.map(p => `<div class="tag">${p}</div>`).join('')}
                </div>
            </div>
        </div>
    `;
    atualizarMoldes();
}

function atualizarMoldes() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];
    const area = document.getElementById('station');
    area.innerHTML = "";
    for (let i = 0; i < desafio.slots; i++) {
        const m = document.createElement('div');
        m.className = "mold " + (selectedSyllables[i] ? "filled" : "");
        m.innerText = selectedSyllables[i] || "";
        area.appendChild(m);
    }
}

window.clicarPeca = function(s) {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) {
        selectedSyllables.push(s);
        atualizarMoldes();
    }
};

window.limparFabrica = function() {
    selectedSyllables = [];
    atualizarMoldes();
};

window.validarFabrica = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) return;

    const palavra = selectedSyllables.join('');

    if (historicoPalavras.includes(palavra)) {
        somErro.play();
        feedbackVisual("#f59e0b", "REPETIDA!");
    } else if (DICIONARIO_MESTRE.includes(palavra)) {
        somAcerto.play();
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        historicoPalavras.push(palavra);
        feedbackVisual("#10b981", "CERTO!");
    } else {
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        feedbackVisual("#ef4444", "ERRO!");
    }

    // Avança para a próxima ronda (novas sílabas) após o feedback
    setTimeout(proximaRondaFabrica, 1200);
};

function feedbackVisual(color, txt) {
    const area = document.getElementById('station');
    area.innerHTML = `<span style="color:${color}; font-weight:950; font-size:1.8rem; animation: popIn 0.3s;">${txt}</span>`;
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
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
            
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:15px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos}</span>
                    <span style="font-size:11px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:11px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" 
                    onclick="location.reload()">Jogar de Novo</button>
                
                <button style="padding:14px; border-radius:22px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" 
                    onclick="openRDMenu()">Outro Nível</button>
                
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
