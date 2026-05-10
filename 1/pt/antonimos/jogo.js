let selectedSyllables = [];
let discoveredWords = []; 
let roundAtual = 0;
let acertos = 0;
let erros = 0;
let ajudasUsadas = 0;
let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = () => "Puzzle de Sílabas: Quantas palavras consegues formar com estas peças?";

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px;">
            <div style="font-weight:950; color:var(--primary-blue); font-size:1.4rem; text-transform:uppercase;">Como Jogar</div>
            <div style="display:flex; gap:12px; background:white; padding:25px; border-radius:25px; border:4px solid var(--primary-blue); box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <div style="width:60px; height:60px; background:#f0f9ff; border:3px solid var(--primary-blue); border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:1.5rem;">MA</div>
                <div style="width:60px; height:60px; border:3px dashed #cbd5e1; border-radius:15px;"></div>
            </div>
            <div style="font-size:45px; animation: tapH 2s infinite;">☝️</div>
        </div>
    `;
}

window.initGame = function() {
    discoveredWords = []; roundAtual = 0; acertos = 0; erros = 0; ajudasUsadas = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    proximaRondaFabrica();
};

window.darAjuda = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];
    const palavrasPossiveis = DICIONARIO_MESTRE.filter(palavra => {
        let sPalavra = []; for(let i=0; i<palavra.length; i+=2) sPalavra.push(palavra.substr(i,2));
        return sPalavra.every(s => desafio.bank.includes(s)) && sPalavra.length === desafio.slots && !discoveredWords.includes(palavra);
    });
    if (palavrasPossiveis.length > 0) {
        ajudasUsadas++;
        selectedSyllables = [palavrasPossiveis[0].substr(0, 2)];
        atualizarMoldes();
        const btn = document.getElementById('help-btn'); btn.style.transform = "scale(1.3) rotate(20deg)";
        setTimeout(() => btn.style.transform = "scale(1) rotate(0deg)", 300);
    }
};

function proximaRondaFabrica() {
    roundAtual++;
    if (roundAtual > 10) { finalizarFabrica(); return; }
    document.getElementById('round-val').innerText = `${roundAtual} / 10`;
    selectedSyllables = [];
    renderizarEcraFabrica();
}

function renderizarEcraFabrica() {
    const container = document.getElementById('game-main-content');
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    container.innerHTML = `
        <style>
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-around; padding: 15px; box-sizing: border-box; }
            .station { flex-shrink: 0; display: flex; gap: 12px; justify-content: center; align-items: center; background: #f8fcff; border: 3px dashed var(--primary-blue); padding: 20px; border-radius: 25px; width: 100%; max-width: 480px; }
            .mold { width: 80px; height: 80px; background: white; border: 3px dashed #cbd5e1; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 950; color: var(--primary-blue); transition: 0.3s; }
            .mold.filled { border: 4px solid var(--primary-blue); animation: popIn 0.3s; }
            .mold.correct { background: var(--cor-acerto) !important; border: 4px solid #5ba421 !important; color: white !important; }
            .mold.incorrect { background: var(--cor-erro) !important; border: 4px solid #d03a3a !important; color: white !important; }
            
            .btn-row { display: flex; gap: 15px; margin: 5px 0; }
            .btn-f { padding: 14px 30px; border-radius: 18px; font-weight: 900; border: none; cursor: pointer; font-size: 1rem; text-transform: uppercase; }
            .btn-mount { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 6px 0 #64748b; }
            
            .bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; padding: 15px 0; width: 100%; flex-grow: 1; align-content: center; }
            .pill { background: white; border: 3.5px solid var(--primary-blue); color: var(--text-grey); border-radius: 22px; padding: 14px; min-width: 90px; font-size: 1.4rem; font-weight: 900; cursor: pointer; box-shadow: 0 6px 0 var(--primary-blue); transition: 0.1s; }
            .pill:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--primary-blue); }
            
            .warehouse { width: 100%; max-width: 600px; background: rgba(255,255,255,0.8); border-radius: 22px; padding: 12px; border: 1px solid #eef2f6; min-height: 70px; }
            .tag { color: var(--text-grey); font-weight: 900; font-size: 0.9rem; text-transform: uppercase; border-bottom: 3px solid var(--primary-blue); padding: 2px 6px; margin: 3px; }
            @keyframes popIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        </style>
        <div class="factory-wrapper">
            <div class="station" id="molds-area"></div>
            <div class="btn-row">
                <button class="btn-f btn-mount" onclick="validarProducao()">Montar</button>
                <button class="btn-f btn-clear" onclick="limparProducao()">Limpar</button>
            </div>
            <div class="bank">${desafio.bank.map(s => `<button class="pill" onclick="clicarSilaba('${s}')">${s}</button>`).join('')}</div>
            <div class="warehouse">
                <div style="font-size:0.6rem; font-weight:900; color:#b0bac5; text-transform:uppercase; margin-bottom:6px;">Palavras Criadas:</div>
                <div id="history-list" style="display:flex; flex-wrap:wrap; gap:10px;">${discoveredWords.map(p => `<span class="tag">${p}</span>`).join('')}</div>
            </div>
        </div>
    `;
    atualizarMoldes();
}

function atualizarMoldes() {
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    const area = document.getElementById('molds-area'); area.innerHTML = "";
    for (let i = 0; i < desafio.slots; i++) {
        const m = document.createElement('div'); m.className = "mold " + (selectedSyllables[i] ? "filled" : "");
        m.innerText = selectedSyllables[i] || ""; area.appendChild(m);
    }
}

window.clicarSilaba = (s) => { 
    if (selectedSyllables.length < JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual-1].slots) { 
        selectedSyllables.push(s); atualizarMoldes(); 
    }
};
window.limparProducao = () => { selectedSyllables = []; atualizarMoldes(); };

window.validarProducao = function() {
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) return;
    const palavra = selectedSyllables.join('');
    const molds = document.querySelectorAll('.mold');
    
    if (discoveredWords.includes(palavra)) {
        somErro.play(); molds.forEach(m => m.classList.add('incorrect'));
    } else if (DICIONARIO_MESTRE.includes(palavra)) {
        somAcerto.play(); acertos++; document.getElementById('hits-val').innerText = acertos;
        discoveredWords.push(palavra); molds.forEach(m => m.classList.add('correct'));
    } else {
        somErro.play(); erros++; document.getElementById('miss-val').innerText = erros;
        molds.forEach(m => m.classList.add('incorrect'));
    }
    setTimeout(proximaRondaFabrica, 1000);
};

function finalizarFabrica() {
    somVitoria.play(); const resScreen = document.getElementById('scr-result');
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:space-around; height:100%; padding:25px; text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:120px; filter:drop-shadow(0 5px 15px rgba(0,0,0,0.1))">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem;">${rel.titulo}</h2>
            <div style="display:flex; gap:12px; width:100%; max-width:500px;">
                <div style="background:white; flex:1; border-radius:22px; padding:15px 5px; text-align:center; box-shadow:0 8px 25px rgba(0,0,0,0.06); border:1px solid rgba(0,0,0,0.03);">
                    <span style="display:block; font-size:2rem; font-weight:900; color:var(--primary-blue);">${acertos}</span>
                    <span style="font-size:0.65rem; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                    <i class="fas fa-check-double" style="color:var(--primary-blue); margin-top:8px; opacity:0.4;"></i>
                </div>
                <div style="background:white; flex:1; border-radius:22px; padding:15px 5px; text-align:center; box-shadow:0 8px 25px rgba(0,0,0,0.06); border:1px solid rgba(0,0,0,0.03);">
                    <span style="display:block; font-size:2rem; font-weight:900; color:var(--cor-erro);">${erros}</span>
                    <span style="font-size:0.65rem; font-weight:800; color:#88a; text-transform:uppercase;">Erros</span>
                    <i class="fas fa-times-circle" style="color:var(--cor-erro); margin-top:8px; opacity:0.4;"></i>
                </div>
                <div style="background:white; flex:1; border-radius:22px; padding:15px 5px; text-align:center; box-shadow:0 8px 25px rgba(0,0,0,0.06); border:1px solid rgba(0,0,0,0.03);">
                    <span style="display:block; font-size:2rem; font-weight:900; color:#f59e0b;">${ajudasUsadas}</span>
                    <span style="font-size:0.65rem; font-weight:800; color:#88a; text-transform:uppercase;">Ajudas</span>
                    <i class="fas fa-lightbulb" style="color:#f59e0b; margin-top:8px; opacity:0.4;"></i>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:350px;">
                <button class="btn-res btn-res-play" style="display:flex; align-items:center; justify-content:center; gap:15px; padding:16px; border-radius:22px; font-weight:900; font-size:1.1rem; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">
                    <i class="fas fa-sync-alt"></i> Jogar de Novo
                </button>
                <button style="display:flex; align-items:center; justify-content:center; gap:15px; padding:14px; border-radius:22px; font-weight:900; font-size:1.05rem; background:white; color:var(--primary-blue); border:3.5px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">
                    <i class="fas fa-chart-line"></i> Outro Nível
                </button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="display:flex; align-items:center; justify-content:center; gap:15px; padding:16px; border-radius:22px; font-weight:900; font-size:1.1rem; background:#dce4ee; color:#5d7082; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">
                    <i class="fas fa-door-open"></i> Sair
                </a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
