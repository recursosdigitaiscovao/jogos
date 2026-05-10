let selectedSyllables = [];
let discoveredWords = []; 
let roundAtual = 0;
let acertos = 0;
let erros = 0;
let contadorAjudas = 0; // Novo contador de ajudas
let palavraSugestao = ""; 

let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.id = "btn-ajuda";
        timerBadge.style.cursor = "pointer";
        timerBadge.style.background = "transparent";
        timerBadge.style.boxShadow = "none";
        timerBadge.style.padding = "0";
        timerBadge.style.display = "flex";
        timerBadge.style.alignItems = "center";
        timerBadge.style.justifyContent = "center";
        
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:35px; width:auto; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">`;
        timerBadge.onclick = darAjuda;
    }

    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Puzzle de Sílabas: Quantas palavras consegues formar com estas peças?";
};

window.selecionarCategoria = function(key) { 
    categoriaAtual = key; 
};

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
    discoveredWords = [];
    roundAtual = 0; acertos = 0; erros = 0; contadorAjudas = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    proximaRondaFabrica();
};

function definirSugestaoRonda() {
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    const bank = desafio.bank;
    
    palavraSugestao = DICIONARIO_MESTRE.find(p => {
        let tempP = p;
        for(let i=0; i < desafio.slots; i++) {
            let encontrou = false;
            bank.forEach(sil => {
                if(tempP.startsWith(sil)) {
                    tempP = tempP.substring(sil.length);
                    encontrou = true;
                }
            });
            if(!encontrou) return false;
        }
        return tempP === "";
    }) || bank.slice(0, desafio.slots).join(''); 
}

function proximaRondaFabrica() {
    roundAtual++;
    if (roundAtual > 10) { finalizarFabrica(); return; }
    
    document.getElementById('round-val').innerText = `${roundAtual} / 10`;
    selectedSyllables = [];
    definirSugestaoRonda();
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
                background: #f0f9ff; border: 4px dashed #0891b2; padding: 12px; border-radius: 25px;
                min-height: clamp(75px, 15vh, 110px); width: 100%; max-width: 450px; margin: 5px 0;
            }
            .mold {
                width: clamp(55px, 15vw, 85px); height: clamp(55px, 15vw, 85px);
                background: white; border: 3px dashed #cbd5e1; border-radius: 15px;
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.2rem, 6vw, 2rem); font-weight: 950; color: #0891b2;
                transition: all 0.3s;
            }
            .mold.filled { border: 3px solid #0891b2; border-bottom-width: 6px; animation: popIn 0.3s; }
            .btn-row { display: flex; gap: 15px; margin-bottom: 5px; }
            .btn-f { padding: 12px 25px; border-radius: 15px; font-weight: 800; border: none; cursor: pointer; font-size: 0.95rem; transition: 0.1s; }
            .btn-mount { background: #0ea5e9; color: white; box-shadow: 0 5px 0 #0369a1; }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 5px 0 #64748b; }
            .btn-f:active { transform: translateY(3px); box-shadow: none; }
            .bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; width: 100%; max-width: 600px; padding: 10px 0; }
            .pill { 
                background: white; border: 3px solid #0891b2; color: #164e63; border-radius: 18px; 
                padding: clamp(10px, 2vh, 18px); min-width: clamp(65px, 20vw, 90px);
                font-size: clamp(1.1rem, 5vw, 1.6rem); font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #0e7490;
                transition: 0.2s;
            }
            .pill:active { transform: translateY(2px); box-shadow: 0 1px 0 #0e7490; }
            
            .pill-hint { animation: blinkHelp 0.6s infinite alternate; border-color: #f59e0b !important; background: #fef3c7 !important; }
            @keyframes blinkHelp { from { transform: scale(1); box-shadow: 0 5px 0 #0e7490; } to { transform: scale(1.1); box-shadow: 0 0 15px #f59e0b; } }

            .warehouse { width: 100%; max-width: 600px; background: rgba(255,255,255,0.7); border-radius: 20px; padding: 10px; border: 2px solid #e2e8f0; height: 90px; overflow: hidden; }
            .tag { background: transparent; color: #5d7082; padding: 2px 4px; font-weight: 800; font-size: 0.7rem; border-bottom: 2px solid var(--primary-blue); animation: popIn 0.3s; text-transform: uppercase; }

            @keyframes popIn { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }
            @media (max-width: 480px) { .station { min-height: 80px; } .warehouse { height: 80px; } .pill { min-width: 60px; font-size: 1rem; } }
        </style>
        <div class="factory-wrapper">
            <div style="font-size:0.65rem; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${config.nome}</div>
            <div class="station" id="molds-area"></div>
            <div class="btn-row">
                <button class="btn-f btn-mount" onclick="validarProducao()">MONTAR</button>
                <button class="btn-f btn-clear" onclick="limparProducao()">LIMPAR</button>
            </div>
            <div class="bank">
                ${desafio.bank.map(s => `<button class="pill" onclick="clicarSilaba('${s}')">${s}</button>`).join('')}
            </div>
            <div class="warehouse">
                <div style="font-size:0.55rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Armazém de Palavras:</div>
                <div id="history-list" style="display:flex; flex-wrap:wrap; gap:10px;">
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
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('pill-hint'));
    }
};

window.limparProducao = function() {
    selectedSyllables = [];
    atualizarMoldes();
};

window.darAjuda = function() {
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    const idx = selectedSyllables.length;
    if (idx >= desafio.slots) return;

    contadorAjudas++; // Incrementa o uso de ajudas

    let silabasDaSugestao = [];
    let tempP = palavraSugestao;
    while(tempP.length > 0) {
        let encontrada = desafio.bank.find(s => tempP.startsWith(s));
        if(encontrada) {
            silabasDaSugestao.push(encontrada);
            tempP = tempP.substring(encontrada.length);
        } else break;
    }

    const silabaAlvo = silabasDaSugestao[idx];
    const pills = document.querySelectorAll('.pill');
    pills.forEach(p => {
        p.classList.remove('pill-hint');
        if(p.innerText === silabaAlvo) {
            p.classList.add('pill-hint');
            setTimeout(() => p.classList.remove('pill-hint'), 2500);
        }
    });
};

window.validarProducao = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) return;
    
    const palavra = selectedSyllables.join('');
    const molds = document.querySelectorAll('.mold');

    if (discoveredWords.includes(palavra)) {
        somErro.play();
        molds.forEach(m => m.style.background = "#fef3c7"); 
    } else if (DICIONARIO_MESTRE.includes(palavra)) {
        somAcerto.play();
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        discoveredWords.push(palavra);
        molds.forEach(m => {
            m.style.background = "#dcfce7"; 
            m.style.borderColor = "#22c55e";
            m.style.color = "#166534";
        });
    } else {
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        molds.forEach(m => {
            m.style.background = "#fee2e2";
            m.style.borderColor = "#ef4444";
            m.style.color = "#991b1b";
        });
    }

    document.querySelectorAll('.pill').forEach(b => b.style.pointerEvents = 'none');
    setTimeout(proximaRondaFabrica, 1200);
};

function finalizarFabrica() {
    somVitoria.play();
    const resScreen = document.getElementById('scr-result');
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <style>
            .res-inner { display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box; }
            .res-stats { display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; width:100%; max-width:400px; margin:15px 0; }
            .stat-box { background:white; border-radius:18px; padding:12px 5px; text-align:center; border:1px solid #f0f0f0; box-shadow:0 4px 12px rgba(0,0,0,0.06); }
            .stat-val { display:block; font-size:20px; font-weight:900; color:var(--primary-blue); }
            .stat-label { font-size:9px; font-weight:800; color:#88a; text-transform:uppercase; }
            
            .btn-res-container { display:flex; flex-direction:column; gap:15px; width:100%; max-width:320px; }
            .btn-res { 
                display: flex; align-items: center; justify-content: flex-start;
                padding: 14px 25px; border-radius: 50px; font-weight: 900; font-size: 17px; 
                text-transform: uppercase; cursor: pointer; border: none; text-decoration: none; 
                width: 100%; transition: 0.1s; position: relative; gap: 20px;
            }
            .btn-res i { font-size: 24px; width: 30px; }
            .btn-res span { flex: 1; text-align: center; margin-right: 30px; } /* Ajuste para centralizar o texto ignorando o ícone */

            .btn-novo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-outro { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); box-shadow: 0 6px 0 var(--primary-blue); }
            .btn-sair { background: #dce4ee; color: #5d7082; box-shadow: 0 6px 0 #b8c5d4; }
            
            .btn-res:active { transform: translateY(3px); box-shadow: none; }
        </style>

        <div class="res-inner">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; margin-bottom:5px; text-align:center;">${rel.titulo}</h2>
            
            <div class="res-stats">
                <div class="stat-box">
                    <span class="stat-val" style="color:#7ed321;">${acertos}</span>
                    <span class="stat-label">Certos</span>
                </div>
                <div class="stat-box">
                    <span class="stat-val" style="color:#ff5e5e;">${erros}</span>
                    <span class="stat-label">Errados</span>
                </div>
                <div class="stat-box">
                    <span class="stat-val" style="color:#f59e0b;">${contadorAjudas}</span>
                    <span class="stat-label">Ajudas</span>
                </div>
            </div>

            <div class="btn-res-container">
                <button class="btn-res btn-novo" onclick="location.reload()">
                    <i class="fas fa-rotate-right"></i> <span>Jogar de Novo</span>
                </button>
                
                <button class="btn-res btn-outro" onclick="openRDMenu()">
                    <i class="fas fa-chart-line"></i> <span>Outro Nível</span>
                </button>
                
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-sair">
                    <i class="fas fa-right-from-bracket"></i> <span>Sair</span>
                </a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
