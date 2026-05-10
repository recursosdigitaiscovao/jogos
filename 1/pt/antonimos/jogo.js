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

window.gerarIntroJogo = () => "Puzzle de Sílabas: Quantas palavras consegues formar?";

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
            <div style="font-weight:950; color:var(--primary-blue); font-size:1.5rem; text-transform:uppercase;">Como Jogar</div>
            <div style="display:flex; gap:15px; background:white; padding:30px; border-radius:25px; border:4px solid var(--primary-blue);">
                <div style="width:70px; height:70px; background:#f0f9ff; border:3px solid var(--primary-blue); border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:1.8rem;">MA</div>
                <div style="width:70px; height:70px; border:3px dashed #cbd5e1; border-radius:15px;"></div>
            </div>
            <div style="font-size:50px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-20px); } } </style>
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
        const btn = document.getElementById('help-btn'); btn.style.transform = "scale(1.2) rotate(15deg)";
        setTimeout(() => btn.style.transform = "scale(1)", 300);
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
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-around; padding: 20px; box-sizing: border-box; }
            .station { display: flex; gap: 15px; justify-content: center; align-items: center; background: #f8fcff; border: 3px dashed var(--primary-blue); padding: 25px; border-radius: 30px; width: 100%; max-width: 500px; }
            .mold { 
                width: 85px; height: 85px; background: white; border: 3px dashed #cbd5e1; border-radius: 20px; 
                display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 950; color: var(--primary-blue); 
                transition: 0.3s;
            }
            .mold.filled { border: 4px solid var(--primary-blue); animation: popIn 0.3s; }
            /* FEEDBACK CORES */
            .mold.correct { background: var(--cor-acerto) !important; border-color: #5ba421 !important; color: white !important; }
            .mold.incorrect { background: var(--cor-erro) !important; border-color: #d03a3a !important; color: white !important; }
            
            .btn-row { display: flex; gap: 15px; }
            .btn-f { padding: 15px 35px; border-radius: 20px; font-weight: 900; border: none; cursor: pointer; font-size: 1.1rem; text-transform: uppercase; }
            .btn-mount { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 6px 0 #64748b; }
            
            .bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; padding: 20px 0; width: 100%; flex-grow: 1; align-content: center; }
            .pill { background: white; border: 4px solid var(--primary-blue); color: var(--text-grey); border-radius: 22px; padding: 15px; min-width: 95px; font-size: 1.6rem; font-weight: 900; cursor: pointer; box-shadow: 0 6px 0 var(--primary-blue); }
            .pill:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--primary-blue); }
            
            .warehouse { width: 100%; max-width: 600px; background: #f8fcff; border-radius: 25px; padding: 15px; border: 2px solid #eef2f6; min-height: 80px; }
            .tag { color: var(--text-grey); font-weight: 900; font-size: 1rem; text-transform: uppercase; border-bottom: 3px solid var(--primary-blue); padding: 2px 6px; margin: 4px; }
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
                <div style="font-size:0.7rem; font-weight:900; color:#b0bac5; text-transform:uppercase; margin-bottom:8px; letter-spacing:1px;">Palavras Criadas:</div>
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
        m.id = "mold-" + i;
        m.innerText = selectedSyllables[i] || ""; area.appendChild(m);
    }
}

window.clicarSilaba = (s) => { 
    if (selectedSyllables.length < JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual-1].slots) { 
        selectedSyllables.push(s); 
        atualizarMoldes(); 
    }
};

window.limparProducao = () => { selectedSyllables = []; atualizarMoldes(); };

window.validarProducao = function() {
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) return;
    const palavra = selectedSyllables.join('');
    
    const molds = document.querySelectorAll('.mold');
    
    if (discoveredWords.includes(palavra)) {
        somErro.play();
        molds.forEach(m => m.classList.add('incorrect'));
    } else if (DICIONARIO_MESTRE.includes(palavra)) {
        somAcerto.play();
        acertos++; 
        document.getElementById('hits-val').innerText = acertos;
        discoveredWords.push(palavra);
        molds.forEach(m => m.classList.add('correct'));
    } else {
        somErro.play();
        erros++; 
        document.getElementById('miss-val').innerText = erros;
        molds.forEach(m => m.classList.add('incorrect'));
    }
    
    // Pequena pausa antes da próxima ronda para ver a cor
    setTimeout(proximaRondaFabrica, 1000);
};

function finalizarFabrica() {
    somVitoria.play(); const resScreen = document.getElementById('scr-result');
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:space-around; height:100%; padding:30px;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:120px;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:2rem;">${rel.titulo}</h2>
            <div style="display:flex; gap:15px; width:100%; max-width:500px;">
                <div style="background:white; flex:1; border-radius:25px; padding:15px; text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                    <span style="display:block; font-size:2.5rem; font-weight:900; color:var(--primary-blue);">${acertos}</span>
                    <span style="font-size:0.7rem; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; flex:1; border-radius:25px; padding:15px; text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                    <span style="display:block; font-size:2.5rem; font-weight:900; color:#ff5e5e;">${erros}</span>
                    <span style="font-size:0.7rem; font-weight:800; color:#88a; text-transform:uppercase;">Erros</span>
                </div>
                <div style="background:white; flex:1; border-radius:25px; padding:15px; text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                    <span style="display:block; font-size:2.5rem; font-weight:900; color:#f59e0b;">${ajudasUsadas}</span>
                    <span style="font-size:0.7rem; font-weight:800; color:#88a; text-transform:uppercase;">Ajudas</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:350px;">
                <button class="btn-res btn-res-play" style="padding:18px; border-radius:22px; font-weight:900; font-size:1.2rem; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark);" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:15px; border-radius:22px; font-weight:900; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer;" onclick="openRDMenu()">Outro Nível</button>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
