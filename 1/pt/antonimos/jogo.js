let roundAtual = 0;
let acertos = 0;
let erros = 0;
let contadorAjudas = 0;
let desafiosEmbaralhados = [];
let jogoAtivo = false;
let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// === 1. INICIALIZAÇÃO E ANIMAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CONFIG.categorias[categoriaAtual]) {
        categoriaAtual = Object.keys(JOGO_CONFIG.categorias)[0];
    }

    // --- MARCA DE ÁGUA ---
    const tema = BIBLIOTECA_TEMAS[CONFIG_MESTRE.area];
    const corDoodle = tema.corPrimaria.replace('#', '%23');
    const antigo = document.getElementById('marca-agua-doodles');
    if(antigo) antigo.remove();
    const doodleBg = document.createElement('div');
    doodleBg.id = 'marca-agua-doodles';
    doodleBg.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:-1; opacity:0.06; background-image: url("data:image/svg+xml,%3Csvg width='250' height='250' viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='30' font-family='Arial' font-size='26' fill='${corDoodle}' font-weight='bold'%3EÇ%3C/text%3E%3Ctext x='180' y='40' font-family='Arial' font-size='22' fill='${corDoodle}'%3EÃ%3C/text%3E%3Ctext x='110' y='120' font-family='Arial' font-size='35' fill='${corDoodle}'%3E↕%3C/text%3E%3Ctext x='210' y='210' font-family='Arial' font-size='28' fill='${corDoodle}'%3E?%3C/text%3E%3Cpath d='M150 180h30v-20h-30z' fill='none' stroke='${corDoodle}' stroke-width='1.5'/%3E%3C/svg%3E"); background-repeat:repeat;`;
    document.body.appendChild(doodleBg);

    // --- BOTÃO AJUDA ---
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.id = "btn-ajuda";
        timerBadge.style.cssText = "cursor:pointer; background:transparent; box-shadow:none; padding:0; display:flex; align-items:center;";
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:35px; width:auto;">`;
        timerBadge.onclick = darAjuda;
    }

    // --- ANIMAÇÃO EXPLICATIVA ---
    const introContainer = document.getElementById('intro-animation-container');
    introContainer.innerHTML = `
        <style>
            .tutorial-box { display: flex; flex-direction: column; align-items: center; gap: 20px; }
            .words-anim { display: flex; align-items: center; gap: 15px; font-weight: 900; font-size: 1.5rem; color: var(--primary-dark); }
            .word-card { background: white; padding: 10px 20px; border-radius: 12px; border: 3px solid var(--primary-blue); box-shadow: 0 4px 0 var(--primary-blue); animation: pulseWord 2s infinite; }
            .arrow-anim { font-size: 2rem; color: var(--primary-blue); animation: flipArrow 2s infinite; }
            @keyframes pulseWord { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); color: var(--primary-blue); } }
            @keyframes flipArrow { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(180deg); } }
        </style>
        <div class="tutorial-box">
            <div class="words-anim">
                <div class="word-card">DIA</div>
                <div class="arrow-anim">↔️</div>
                <div class="word-card">NOITE</div>
            </div>
            <p style="font-weight: 800; color: var(--text-grey); text-align: center;">Antónimos são palavras<br>com significados opostos!</p>
        </div>
    `;
};

window.gerarIntroJogo = function() {
    return categoriaAtual === "Nível 1" ? "Clica no oposto correto!" : "Estes antónimos estão certos?";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; contadorAjudas = 0; roundAtual = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    const config = JOGO_CONFIG.categorias[categoriaAtual];
    desafiosEmbaralhados = shuffleArray([...config.desafios]); 
    proximaRonda();
};

function proximaRonda() {
    roundAtual++;
    if (roundAtual > 10 || roundAtual > desafiosEmbaralhados.length) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${roundAtual} / 10`;
    jogoAtivo = true;
    renderizarEcra();
}

function renderizarEcra() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CONFIG.categorias[categoriaAtual];
    const desafio = desafiosEmbaralhados[roundAtual - 1];

    let htmlBotoes = "";

    if (config.tipo === "multipla") {
        const opcoes = shuffleArray([...desafio.opcoes]);
        htmlBotoes = opcoes.map(opt => `<button class="btn-pill" onclick="validarEscolha(this, '${opt}')">${opt}</button>`).join('');
    } else {
        htmlBotoes = `
            <button class="btn-pill btn-certo" onclick="validarVF(this, true)">CERTO</button>
            <button class="btn-pill btn-errado" onclick="validarVF(this, false)">ERRADO</button>
        `;
    }

    container.innerHTML = `
        <style>
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-evenly; padding: 10px; box-sizing: border-box; }
            .row-question { height: 40%; display: flex; align-items: center; justify-content: center; width: 100%; }
            .row-options { height: 50%; display: flex; align-items: center; justify-content: center; width: 100%; }
            
            .question-box { background: rgba(240, 249, 255, 0.9); border: 3px dashed var(--primary-blue); border-radius: 25px; padding: 20px; width: 90%; max-width: 400px; text-align: center; }
            .main-text { font-size: 2.2rem; font-weight: 950; color: var(--primary-dark); text-transform: uppercase; }
            
            .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; max-width: 400px; }
            
            .btn-pill { 
                background: white; border: 3px solid #eee; border-radius: 20px; padding: 15px 5px; 
                font-size: 1.1rem; font-weight: 900; color: var(--text-grey); cursor: pointer; 
                transition: 0.2s; box-shadow: 0 5px 0 #ddd; text-transform: uppercase; 
            }
            .btn-pill:active { transform: translateY(3px); box-shadow: none; }
            
            .btn-certo { color: #7ed321 !important; border-color: #7ed321 !important; }
            .btn-errado { color: #ff5e5e !important; border-color: #ff5e5e !important; }

            /* MOBILE VERTICAL: EMPILHAR TUDO */
            @media (max-width: 600px) and (orientation: portrait) {
                .options-grid { grid-template-columns: 1fr; gap: 10px; }
                .btn-pill { padding: 12px 5px; }
            }

            .hint-blink { animation: blinkHelp 0.6s infinite alternate; border-color: #f59e0b !important; background: #fef3c7 !important; }
            @keyframes blinkHelp { from { transform: scale(1); } to { transform: scale(1.05); } }
        </style>
        <div class="factory-wrapper">
            <div style="font-size:0.7rem; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${config.nome}</div>
            
            <div class="row-question">
                <div class="question-box">
                    ${config.tipo === 'multipla' ? 
                        `<div style="font-size:0.6rem; font-weight:800; color:#88a;">OPOSTO DE:</div><div class="main-text">${desafio.pergunta}</div>` :
                        `<div class="main-text" style="font-size:1.8rem;">${desafio.par[0]}</div><div style="color:var(--primary-blue); margin:5px;">↔️</div><div class="main-text" style="font-size:1.8rem;">${desafio.par[1]}</div>`
                    }
                </div>
            </div>

            <div class="row-options">
                <div class="options-grid">
                    ${htmlBotoes}
                </div>
            </div>
            <div style="height:5px;"></div>
        </div>
    `;
}

window.validarEscolha = function(btn, escolha) {
    if (!jogoAtivo) return;
    jogoAtivo = false;
    const desafio = desafiosEmbaralhados[roundAtual - 1];
    if (escolha === desafio.resposta) { sucesso(btn); } 
    else { falha(btn); document.querySelectorAll('.btn-pill').forEach(b => { if(b.innerText.trim() === desafio.resposta) b.style.borderColor = "#7ed321"; }); }
    setTimeout(proximaRonda, 1500);
};

window.validarVF = function(btn, escolhaUtilizador) {
    if (!jogoAtivo) return;
    jogoAtivo = false;
    const desafio = desafiosEmbaralhados[roundAtual - 1];
    if (escolhaUtilizador === desafio.resposta) { sucesso(btn); } else { falha(btn); }
    setTimeout(proximaRonda, 1500);
};

function sucesso(btn) { 
    somAcerto.play(); acertos++; document.getElementById('hits-val').innerText = acertos; 
    btn.style.background = "#dcfce7"; btn.style.borderColor = "#22c55e"; btn.style.color = "#166534"; 
}
function falha(btn) { 
    somErro.play(); erros++; document.getElementById('miss-val').innerText = erros; 
    btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444"; btn.style.color = "#991b1b"; 
}

window.darAjuda = function() {
    if (!jogoAtivo) return;
    contadorAjudas++;
    const desafio = desafiosEmbaralhados[roundAtual - 1];
    const config = JOGO_CONFIG.categorias[categoriaAtual];
    if (config.tipo === "multipla") {
        document.querySelectorAll('.btn-pill').forEach(b => { if (b.innerText.trim() === desafio.resposta) { b.classList.add('hint-blink'); setTimeout(() => b.classList.remove('hint-blink'), 2500); } });
    } else {
        const target = desafio.resposta ? ".btn-certo" : ".btn-errado";
        const b = document.querySelector(target);
        if(b) { b.classList.add('hint-blink'); setTimeout(() => b.classList.remove('hint-blink'), 2500); }
    }
};

function finalizarJogo() {
    somVitoria.play();
    const resScreen = document.getElementById('scr-result');
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    document.getElementById('scr-game').classList.remove('active');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px;">
            <style>
                .res-stats { display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; width:100%; max-width:400px; margin:15px 0; }
                .stat-box { background:white; border-radius:20px; padding:15px 5px; text-align:center; border:1px solid #f0f0f0; box-shadow:0 6px 15px rgba(0,0,0,0.05); }
                .stat-val { display:block; font-size:24px; font-weight:900; color:var(--primary-blue); }
                .stat-label { font-size:10px; font-weight:800; color:#88a; text-transform:uppercase; }
                .btn-res { display: flex; align-items: center; padding: 14px 25px; border-radius: 50px; font-weight: 900; font-size: 17px; text-transform: uppercase; cursor: pointer; border: none; text-decoration: none; transition: 0.1s; gap: 20px; width: 100%; max-width: 320px; margin-bottom: 12px; }
                .btn-res i { font-size: 22px; }
                .btn-res span { flex: 1; text-align: center; margin-right: 30px; }
                .btn-novo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
                .btn-outro { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); box-shadow: 0 6px 0 var(--primary-blue); }
                .btn-sair { background: #dce4ee; color: #5d7082; box-shadow: 0 6px 0 #b8c5d4; }
                .btn-res:active { transform: translateY(3px); box-shadow: none; }
            </style>
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:110px; margin-bottom:15px;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:2rem; margin-bottom:10px;">${rel.titulo}</h2>
            <div class="res-stats">
                <div class="stat-box"><span class="stat-val" style="color:#7ed321;">${acertos}</span><span class="stat-label">Certos</span></div>
                <div class="stat-box"><span class="stat-val" style="color:#ff5e5e;">${erros}</span><span class="stat-label">Errados</span></div>
                <div class="stat-box"><span class="stat-val" style="color:#f59e0b;">${contadorAjudas}</span><span class="stat-label">Ajudas</span></div>
            </div>
            <button class="btn-res btn-novo" onclick="location.reload()"><i class="fas fa-rotate-right"></i><span>Jogar de Novo</span></button>
            <button class="btn-res btn-outro" onclick="openRDMenu()"><i class="fas fa-chart-line"></i><span>Outro Nível</span></button>
            <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-sair"><i class="fas fa-right-from-bracket"></i><span>Sair</span></a>
        </div>
    `;
    document.getElementById('status-bar').style.display = 'none';
}
