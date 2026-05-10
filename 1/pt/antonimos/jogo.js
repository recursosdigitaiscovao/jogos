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
            <div style="font-weight:950; color:var(--primary-blue); font-size:1.4rem; text-transform:uppercase; letter-spacing:1px;">Como Jogar</div>
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
            .station { flex-shrink: 0; display: flex; gap: 12px; justify-content: center; align-items: center; background: #f8fcff; border: 3px dashed var(--primary-blue); padding: 20px; border-radius: 25px; width: 100%; max-width: 450px; }
            .mold { width: 75px; height: 75px; background: white; border: 3px dashed #cbd5e1; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 950; color: var(--primary-blue); box-shadow: inset 0 2px 5px rgba(0,0,0,0.02); }
            .mold.filled { border: 4px solid var(--primary-blue); border-bottom-width: 7px; animation: popIn 0.3s; }
            
            .btn-row { display: flex; gap: 15px; margin: 5px 0; }
            .btn-f { padding: 14px 30px; border-radius: 18px; font-weight: 900; border: none; cursor: pointer; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
            .btn-mount { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 6px 0 #64748b; }
            
            .bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; padding: 15px 0; width: 100%; max-width: 550px; flex-grow: 1; align-content: center; }
            .pill { background: white; border: 3px solid var(--primary-blue); color: var(--text-grey); border-radius: 20px; padding: 14px; min-width: 85px; font-size: 1.4rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 var(--primary-blue); transition: 0.1s; }
            .pill:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--primary-blue); }
            
            .warehouse { width: 100%; max-width: 550px; background: rgba(255,255,255,0.8); border-radius: 22px; padding: 12px; border: 1px solid #eef2f6; min-height: 70px; margin-top: 5px; }
            .tag { color: var(--text-grey); font-weight: 900; font-size: 0.85rem; text-transform: uppercase; border-bottom: 3px solid var(--primary-blue); padding: 2px 6px; margin: 2px; }

            @media screen and (max-height: 550px) {
                .factory-wrapper { flex-direction: row; flex-wrap: wrap; justify-content: center; align-content: center; gap: 15px; }
                .station { width: 45%; padding: 12px; }
                .bank { width: 50%; padding: 0; }
                .btn-row { width: 100%; order: 3; justify-content: center; margin: 5px 0; }
                .warehouse { width: 100%; order: 4; min-height: 50px; padding: 8px; }
                .mold { width: 60px; height: 60px; font-size: 1.3rem; }
                .pill { padding: 10px; min-width: 70px; font-size: 1.1rem; }
            }
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
                <div style="font-size:0.6rem; font-weight:900; color:#b0bac5; text-transform:uppercase; margin-bottom:6px; letter-spacing:1px;">Palavras Criadas:</div>
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

window.clicarSilaba = (s) => { if (selectedSyllables.length < JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual-1].slots) { selectedSyllables.push(s); atualizarMoldes(); }};
window.limparProducao = () => { selectedSyllables = []; atualizarMoldes(); };

window.validarProducao = function() {
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) return;
    const palavra = selectedSyllables.join('');
    if (discoveredWords.includes(palavra)) { somErro.play(); feedbackEstacao("#f59e0b", "Repetida!"); }
    else if (DICIONARIO_MESTRE.includes(palavra)) { somAcerto.play(); acertos++; document.getElementById('hits-val').innerText = acertos; discoveredWords.push(palavra); feedbackEstacao("#10b981", "Certo!"); }
    else { somErro.play(); erros++; document.getElementById('miss-val').innerText = erros; feedbackEstacao("#ef4444", "Erro!"); }
    setTimeout(proximaRondaFabrica, 1200);
};

function feedbackEstacao(color, txt) {
    const area = document.getElementById('molds-area'); area.innerHTML = `<span style="color:${color}; font-weight:950; font-size:1.8rem; animation: popIn 0.3s; text-transform:uppercase;">${txt}</span>`;
    document.querySelectorAll('.pill').forEach(b => b.style.pointerEvents = 'none');
}

function finalizarFabrica() {
    somVitoria.play(); const resScreen = document.getElementById('scr-result');
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" class="res-trophy">
            <h2 class="res-title">${rel.titulo}</h2>
            <div class="res-grid">
                <div class="res-card">
                    <span class="num" style="color: var(--primary-blue);">${acertos}</span>
                    <span class="label">Acertos</span>
                    <i class="fas fa-check-double" style="color: var(--primary-blue);"></i>
                </div>
                <div class="res-card">
                    <span class="num" style="color: #ff5e5e;">${erros}</span>
                    <span class="label">Erros</span>
                    <i class="fas fa-times-circle" style="color: #ff5e5e;"></i>
                </div>
                <div class="res-card">
                    <span class="num" style="color: #f59e0b;">${ajudasUsadas}</span>
                    <span class="label">Ajudas</span>
                    <i class="fas fa-lightbulb" style="color: #f59e0b;"></i>
                </div>
            </div>
            <div class="res-actions">
                <button class="btn-res btn-res-play" onclick="location.reload()"><i class="fas fa-sync-alt"></i> Jogar de Novo</button>
                <button class="btn-res btn-res-levels" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-res-exit"><i class="fas fa-door-open"></i> Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
