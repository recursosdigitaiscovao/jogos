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

    // --- MARCA D'ÁGUA (DOODLES) ---
    const tema = BIBLIOTECA_TEMAS[CONFIG_MESTRE.area];
    const corDoodle = tema.corPrimaria.replace('#', '%23');
    
    let doodleBg = document.getElementById('marca-agua-doodles');
    if(!doodleBg) {
        doodleBg = document.createElement('div');
        doodleBg.id = 'marca-agua-doodles';
        document.body.appendChild(doodleBg);
    }
    
    doodleBg.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        pointer-events: none; z-index: 0; opacity: 0.08;
        background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='20' y='40' font-family='Arial' font-size='22' fill='${corDoodle}' font-weight='900'%3EÇ%3C/text%3E%3Ctext x='150' y='30' font-family='Arial' font-size='18' fill='${corDoodle}'%3EÃ%3C/text%3E%3Ctext x='100' y='100' font-family='Arial' font-size='30' fill='${corDoodle}'%3E↕%3C/text%3E%3Ctext x='170' y='160' font-family='Arial' font-size='20' fill='${corDoodle}'%3EÕ%3C/text%3E%3Ctext x='30' y='160' font-family='Arial' font-size='25' fill='${corDoodle}' font-weight='bold'%3E?%3C/text%3E%3Cpath d='M80 150h30v-15h-30z' fill='none' stroke='${corDoodle}' stroke-width='1.5'/%3E%3Cpath d='M20 100l10 10m-10 0l10-10' stroke='${corDoodle}' stroke-width='2'/%3E%3C/svg%3E");
        background-repeat: repeat;
    `;
    
    document.querySelector('.game-container').style.background = "transparent";

    // --- BOTÃO AJUDA ---
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.id = "btn-ajuda";
        timerBadge.style.cssText = "cursor:pointer; background:transparent; box-shadow:none; padding:0; display:flex; align-items:center; z-index:10;";
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:35px; width:auto;">`;
        timerBadge.onclick = darAjuda;
    }

    // --- ANIMAÇÃO EXPLICATIVA ---
    const introContainer = document.getElementById('intro-animation-container');
    introContainer.innerHTML = `
        <style>
            .tutorial-box { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px; }
            .words-anim { display: flex; align-items: center; gap: 20px; font-weight: 900; font-size: 1.6rem; color: var(--primary-dark); }
            .word-card { background: white; padding: 12px 25px; border-radius: 15px; border: 4px solid var(--primary-blue); box-shadow: 0 6px 0 var(--primary-blue); animation: pulseWord 2.5s infinite ease-in-out; }
            .arrow-anim { font-size: 2.5rem; color: var(--primary-blue); animation: flipArrow 2.5s infinite; }
            @keyframes pulseWord { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); color: var(--primary-blue); } }
            @keyframes flipArrow { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(180deg); } }
        </style>
        <div class="tutorial-box">
            <div class="words-anim">
                <div class="word-card">ALTO</div>
                <div class="arrow-anim">↔️</div>
                <div class="word-card">BAIXO</div>
            </div>
            <p style="font-weight: 900; color: var(--text-grey); text-align: center; font-size: 1.1rem; line-height: 1.4;">
                Antónimos são palavras<br>com significados <span style="color:var(--primary-blue)">OPOSTOS</span>!
            </p>
        </div>
    `;
};

window.gerarIntroJogo = function() {
    return categoriaAtual === "Nível 1" ? "Escolhe o antónimo correto!" : "Estes pares são antónimos?";
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
        // NÍVEL 2: AGORA COM A MESMA CLASSE .btn-pill DO NÍVEL 1
        htmlBotoes = `
            <button class="btn-pill btn-vf-certo" onclick="validarVF(this, true)">CERTO</button>
            <button class="btn-pill btn-vf-errado" onclick="validarVF(this, false)">ERRADO</button>
        `;
    }

    container.innerHTML = `
        <style>
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-evenly; padding: 10px; box-sizing: border-box; }
            .row-question { height: 40%; display: flex; align-items: center; justify-content: center; width: 100%; }
            .row-options { height: 50%; display: flex; align-items: center; justify-content: center; width: 100%; }
            
            .question-box { background: rgba(255, 255, 255, 0.9); border: 3px dashed var(--primary-blue); border-radius: 25px; padding: 20px; width: 90%; max-width: 400px; text-align: center; }
            .main-text { font-size: 2.2rem; font-weight: 950; color: var(--primary-dark); text-transform: uppercase; }
            
            .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; max-width: 420px; }
            
            /* ESTILO ÚNICO PARA TODOS OS BOTÕES */
            .btn-pill { 
                background: white; border: 3px solid #eee; border-radius: 20px; padding: 15px 5px; 
                font-size: 1.1rem; font-weight: 900; color: var(--text-grey); cursor: pointer; 
                transition: 0.2s; box-shadow: 0 5px 0 #ddd; text-transform: uppercase; 
            }
            .btn-pill:active { transform: translateY(3px); box-shadow: none; }

            /* MOBILE VERTICAL: EMPILHAR */
            @media (max-width: 600px) and (orientation: portrait) {
                .options-grid { grid-template-columns: 1fr; gap: 10px; width: 90%; }
                .btn-pill { padding: 12px 5px; font-size: 1.2rem; }
            }

            .hint-blink { animation: blinkHelp 0.6s infinite alternate; border-color: #f59e0b !important; background: #fef3c7 !important; }
            @keyframes blinkHelp { from { transform: scale(1); } to { transform: scale(1.05); } }
        </style>
        <div class="factory-wrapper">
            <div style="font-size:0.7rem; font-weight:900; color:var(--primary-blue); text-transform:uppercase; letter-spacing:1px;">${config.nome}</div>
            
            <div class="row-question">
                <div class="question-box">
                    ${config.tipo === 'multipla' ? 
                        `<div style="font-size:0.65rem; font-weight:800; color:#88a; margin-bottom:5px;">QUAL É O ANTÓNIMO DE:</div><div class="main-text">${desafio.pergunta}</div>` :
                        `<div class="main-text" style="font-size:1.8rem;">${desafio.par[0]}</div><div style="color:var(--primary-blue); font-size:1.5rem; margin:5px;">↔️</div><div class="main-text" style="font-size:1.8rem;">${desafio.par[1]}</div>`
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
    btn.style.background = "#dcfce7"; btn.style.borderColor = "#22c55e"; btn.style.color = "#166534"; btn.style.boxShadow = "0 5px 0 #15803d";
}
function falha(btn) { 
    somErro.play(); erros++; document.getElementById('miss-val').innerText = erros; 
    btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444"; btn.style.color = "#991b1b"; btn.style.boxShadow = "0 5px 0 #b91c1c";
}

window.darAjuda = function() {
    if (!jogoAtivo) return;
    contadorAjudas++;
    const desafio = desafiosEmbaralhados[roundAtual - 1];
    const config = JOGO_CONFIG.categorias[categoriaAtual];
    if (config.tipo === "multipla") {
        document.querySelectorAll('.btn-pill').forEach(b => { if (b.innerText.trim() === desafio.resposta) { b.classList.add('hint-blink'); setTimeout(() => b.classList.remove('hint-blink'), 2500); } });
    } else {
        // Ajuda no V/F: Brilha o botão correspondente à resposta lógica
        const targetClass = desafio.resposta ? ".btn-vf-certo" : ".btn-vf-errado";
        const b = document.querySelector(targetClass);
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
