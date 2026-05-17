let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let indicePergunta = 0; // Conta as rondas (máximo 10)
let jogoAtivo = false;
let ajudaDisponivel = true;
let categoriaAtual = "maiusculas";
let letrasNoEcra = [];
let spawnInterval;
let gameLoopInterval;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual) categoriaAtual = "maiusculas";
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = JOGO_CATEGORIAS[categoriaAtual].descricao;

    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
    }
    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    if(document.getElementById('intro-instr')) 
        document.getElementById('intro-instr').innerText = JOGO_CATEGORIAS[key].descricao;
    renderTutorialAnimation();
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const isUpper = JOGO_CATEGORIAS[categoriaAtual].tipo === "upper";
    container.innerHTML = `
        <style>
            .tut-box { position:relative; width:180px; height:140px; background:#f0f7ff; border:3px solid var(--primary-blue); border-radius:25px; overflow:hidden; }
            .tut-letter { position:absolute; left:50%; transform:translateX(-50%); font-size:50px; font-weight:900; color:var(--primary-blue); animation: fallTut 4s infinite linear; }
            .tut-hand { position:absolute; font-size:40px; bottom:10px; left:55%; animation: tapTut 4s infinite; }
            @keyframes fallTut { 0% { top:-60px; opacity:1; } 60% { top:45px; opacity:1; } 70%, 100% { top:45px; opacity:0; } }
            @keyframes tapTut { 0%, 55% { transform:scale(1); opacity:0; } 60% { transform:scale(0.8); opacity:1; } 100% { opacity:0; } }
        </style>
        <div class="tut-box"><div class="tut-letter">${isUpper ? 'A' : 'a'}</div><div class="tut-hand">☝️</div></div>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0; indicePergunta = 0;
    letrasNoEcra = [];
    jogoAtivo = true;
    
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('round-val').innerText = "1 / 10";

    renderEstruturaJogo();
    
    // Início imediato da primeira letra
    spawnLetra(); 
    spawnInterval = setInterval(spawnLetra, 4500); 
    gameLoopInterval = setInterval(atualizarLetras, 50);

    window.addEventListener('keydown', lidarTeclado);
};

function renderEstruturaJogo() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <style>
            .rain-outer { width: 100%; height: 100%; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; }
            .sky-area { flex: 1; position: relative; width: 100%; background: #f8fafc; border-radius: 20px; border: 2px solid #e2e8f0; margin-bottom: 8px; overflow: hidden; }
            .falling-letter { position: absolute; font-size: 42px; font-weight: 900; color: var(--primary-blue); cursor: pointer; background: white; width: 75px; height: 75px; display: flex; align-items: center; justify-content: center; border-radius: 18px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); transition: transform 0.2s, opacity 0.2s; }
            .keyboard-area { width: 100%; display: flex; flex-direction: column; gap: 5px; padding: 8px; background: #fff; border-radius: 15px; border: 1px solid #eee; }
            .kb-row { display: flex; justify-content: center; gap: 4px; flex: 1; }
            .key-btn { flex: 1; height: 50px; background: white; border: 2.5px solid #f0f0f0; border-radius: 10px; font-weight: 900; font-size: 20px; color: #5d7082; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 3px 0 #ddd; }
            .key-btn:active { transform: translateY(2px); box-shadow: none; }
            .ajuda-key { animation: pulseAjuda 0.5s infinite alternate; border-color: #ff9f43 !important; background: #fff5e6 !important; color: #ff9f43 !important; }
            @keyframes pulseAjuda { from { transform: scale(1); } to { transform: scale(1.1); } }
            @media (max-width: 600px) and (orientation: portrait) { .keyboard-area { gap: 4px; } .key-btn { height: 42px; font-size: 16px; } .falling-letter { width: 60px; height: 60px; font-size: 32px; } }
        </style>
        <div class="rain-outer">
            <div class="sky-area" id="sky"></div>
            <div class="keyboard-area" id="kb-container"></div>
        </div>
    `;
    gerarTecladoDinamico();
}

function gerarTecladoDinamico() {
    const kbContainer = document.getElementById('kb-container');
    if(!kbContainer) return;
    const letras = JOGO_CATEGORIAS[categoriaAtual].letras;
    const isPortrait = window.innerHeight > window.innerWidth;
    const numRows = isPortrait ? 4 : 3;
    const itemsPerRow = Math.ceil(letras.length / numRows);
    kbContainer.innerHTML = '';
    for (let i = 0; i < numRows; i++) {
        const row = document.createElement('div');
        row.className = 'kb-row';
        const slice = letras.slice(i * itemsPerRow, (i + 1) * itemsPerRow);
        row.innerHTML = slice.map(l => `<div class="key-btn" data-letra="${l}" onclick="verificarLetra('${l}')">${l}</div>`).join('');
        kbContainer.appendChild(row);
    }
}

function spawnLetra() {
    if (!jogoAtivo || indicePergunta >= 10) return;
    const sky = document.getElementById('sky');
    const letrasPossiveis = JOGO_CATEGORIAS[categoriaAtual].letras;
    const char = letrasPossiveis[Math.floor(Math.random() * letrasPossiveis.length)];
    const div = document.createElement('div');
    div.className = 'falling-letter';
    div.innerText = char;
    div.style.left = (10 + Math.random() * 75) + "%";
    div.style.top = "-90px";
    const letraObj = { char, element: div, top: -90 };
    div.onclick = () => verificarLetra(char);
    sky.appendChild(div);
    letrasNoEcra.push(letraObj);
}

function atualizarLetras() {
    if (!jogoAtivo) return;
    const skyHeight = document.getElementById('sky').clientHeight;
    for (let i = letrasNoEcra.length - 1; i >= 0; i--) {
        let letra = letrasNoEcra[i];
        letra.top += 0.8; 
        letra.element.style.top = letra.top + "px";
        if (letra.top > skyHeight) {
            somErro.play();
            erros++;
            indicePergunta++;
            atualizarPlacar();
            letra.element.remove();
            letrasNoEcra.splice(i, 1);
            if (indicePergunta >= 10) setTimeout(finalizarJogo, 500);
        }
    }
}

function lidarTeclado(e) {
    if (!jogoAtivo) return;
    const tecla = e.key;
    if (/^[a-zA-Z]$/.test(tecla)) {
        verificarLetra(JOGO_CATEGORIAS[categoriaAtual].tipo === "upper" ? tecla.toUpperCase() : tecla.toLowerCase());
    }
}

function verificarLetra(charDigitado) {
    if (!jogoAtivo || indicePergunta >= 10) return;
    const index = letrasNoEcra.findIndex(l => l.char === charDigitado);
    if (index !== -1) {
        const letra = letrasNoEcra[index];
        somAcerto.play();
        acertos++;
        letra.element.style.transform = "scale(0)";
        setTimeout(() => letra.element.remove(), 250);
        letrasNoEcra.splice(index, 1);
    } else {
        somErro.play();
        erros++;
        const sky = document.getElementById('sky');
        sky.style.background = "#fff1f1";
        setTimeout(() => sky.style.background = "#f8fafc", 200);
    }
    indicePergunta++;
    atualizarPlacar();
    if (indicePergunta >= 10) setTimeout(finalizarJogo, 600);
}

function atualizarPlacar() {
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    document.getElementById('round-val').innerText = `${Math.min(indicePergunta + 1, 10)} / 10`;
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel || letrasNoEcra.length === 0) return;
    ajudaDisponivel = false;
    ajudasUtilizadas++;
    const maisBaixa = letrasNoEcra.reduce((prev, curr) => (prev.top > curr.top) ? prev : curr);
    const tecla = document.querySelector(`.key-btn[data-letra="${maisBaixa.char}"]`);
    if (tecla) {
        tecla.classList.add('ajuda-key');
        setTimeout(() => { tecla.classList.remove('ajuda-key'); ajudaDisponivel = true; }, 2500);
    }
};

function finalizarJogo() {
    jogoAtivo = false;
    clearInterval(spawnInterval);
    clearInterval(gameLoopInterval);
    window.removeEventListener('keydown', lidarTeclado);
    somVitoria.play();
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';
    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <style>
                .res-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 450px; }
                .res-trophy { height: 110px; margin-bottom: 10px; object-fit: contain; }
                .stat-box { background: white; border-radius: 25px; width: 105px; height: 105px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .btn-res { height: 60px; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; font-weight: 900; font-size: 1.1rem; text-decoration: none; cursor: pointer; border: none; width:100%; margin-bottom:10px;}
                .btn-redo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
                .btn-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); }
                .btn-exit { background: #e2e8f0; color: #64748b; }
            </style>
            <div class="res-container">
                <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" class="res-trophy">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin-bottom:25px; text-align:center;">${rel.titulo}</h1>
                <div style="display:flex; gap:12px; margin-bottom:30px;">
                    <div class="stat-box"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div class="stat-box"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div class="stat-box"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button class="btn-res btn-redo" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button class="btn-res btn-outline" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-exit"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
