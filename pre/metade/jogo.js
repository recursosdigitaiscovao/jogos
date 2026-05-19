let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let rondaAtual = 1;
let jogoAtivo = false;
let ajudaDisponivel = true;
let categoriaAtiva = "nivel1";
let itemCorreto = "";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. FUNÇÃO DE VOZ (TEXT-TO-SPEECH) ===
function falarInstrucao() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const texto = JOGO_CATEGORIAS[categoriaAtiva].descricao;
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-PT';
        msg.rate = 0.85; // Velocidade calma para crianças
        window.speechSynthesis.speak(msg);
    }
}

// === 2. INICIALIZAÇÃO ===
window.startLogic = function() {
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = config.descricao;

    // Configurar Lâmpada de Ajuda
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent"; timerBadge.style.padding = "0";
    }
    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtiva = key;
    if(document.getElementById('intro-instr')) 
        document.getElementById('intro-instr').innerText = JOGO_CATEGORIAS[key].descricao;
    renderTutorialAnimation();
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    const imgEx = JOGO_CONFIG.caminhoImg + config.pasta + config.itens[0];

    container.innerHTML = `
        <style>
            .tut-stage { position: relative; width: 320px; height: 160px; background: white; border: 3px dashed var(--primary-blue); border-radius: 25px; display: flex; align-items: center; justify-content: center; gap: 5px; }
            .crop-box { width: 60px; height: 90px; overflow: hidden; border: 2px solid #ddd; background: #fff; position: relative; border-radius: 8px; }
            .crop-box img { position: absolute; height: 100%; width: 200%; object-fit: contain; top: 0; }
            .side-l img { left: 0; filter: brightness(0); opacity: 0.7; }
            .side-r img { right: 0; }
            .tut-hand { position: absolute; font-size: 35px; z-index: 20; animation: handM 4s infinite ease-in-out; }
            @keyframes handM { 0%, 20% { left: 200px; top: 100px; } 50%, 70% { left: 165px; top: 80px; } 100% { left: 200px; top: 100px; } }
            @keyframes partM { 0%, 20% { transform: translateX(60px); opacity: 0; } 50%, 70% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(60px); opacity: 0; } }
        </style>
        <div class="tut-stage">
            <div class="crop-box side-l"><img src="${imgEx}"></div>
            <div class="crop-box side-r" style="animation: partM 4s infinite ease-in-out;"><img src="${imgEx}"></div>
            <div class="tut-hand">☝️</div>
        </div>
    `;
}

// === 3. MOTOR DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0; rondaAtual = 1;
    jogoAtivo = true;
    proximaRonda();
};

function proximaRonda() {
    if (rondaAtual > 10) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${rondaAtual} / 10`;
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    renderizarEcraJogo();
    if(rondaAtual === 1) setTimeout(falarInstrucao, 500);
}

function renderizarEcraJogo() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    const embaralhado = [...config.itens].sort(() => 0.5 - Math.random());
    itemCorreto = embaralhado[0];
    const opcoes = [itemCorreto, ...embaralhado.slice(1, 5)].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .game-path { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 5px; box-sizing: border-box; }
            
            /* Instrução com som */
            .instr-box { background: white; padding: 10px 25px; border-radius: 50px; font-weight: 900; color: #5d7082; border: 3px solid var(--primary-blue); display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .btn-som { background: #ff9800; border: none; width: 42px; height: 42px; border-radius: 50% !important; color: white; cursor: pointer; box-shadow: 0 4px 0 #e65100; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            .btn-som:active { transform: translateY(2px); box-shadow: none; }

            .target-zone { display: flex; align-items: center; justify-content: center; gap: 5px; height: 35%; width: 100%; }
            .box-l { width: clamp(90px, 20vh, 140px); height: clamp(110px, 25vh, 170px); background: white; border: 4px solid var(--primary-blue); border-radius: 20px 0 0 20px; overflow: hidden; position: relative; }
            .box-l img { position: absolute; width: 200%; height: 100%; left: 0; top: 0; object-fit: contain; filter: brightness(0); opacity: 0.8; transition: all 0.5s; }
            .box-r-slot { width: clamp(90px, 20vh, 140px); height: clamp(110px, 25vh, 170px); border: 4px dashed #ccc; border-radius: 0 20px 20px 0; background: rgba(0,0,0,0.02); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }

            .options-area { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; width: 100%; max-width: 600px; }
            .option-card { width: clamp(65px, 14vh, 95px); height: clamp(85px, 17vh, 125px); background: white; border: 3px solid #eee; border-radius: 12px; overflow: hidden; cursor: pointer; box-shadow: 0 4px 0 #ddd; position: relative; }
            .option-card img { position: absolute; width: 200%; height: 100%; right: 0; top: 0; object-fit: contain; }
            
            .correct-anim { border-color: #7ed321 !important; background-color: #e8f9e8 !important; }
            .wrong-anim { border-color: #ff5e5e !important; background-color: #fff1f1 !important; }

            @media (max-width: 600px) and (orientation: portrait) {
                .target-zone { transform: scale(0.9); }
                .option-card { width: calc(31% - 6px); height: 95px; }
                .instr-box { font-size: 0.85rem; width: 95%; padding: 6px 15px; }
                .btn-som { width: 36px; height: 36px; }
            }
        </style>

        <div class="game-path">
            <div class="instr-box">
                <button class="btn-som" onclick="falarInstrucao()"><i class="fas fa-volume-up"></i></button>
                <span>${config.descricao}</span>
            </div>

            <div class="target-zone">
                <div class="box-l"><img id="main-left" src="${JOGO_CONFIG.caminhoImg}${config.pasta}${itemCorreto}"></div>
                <div class="box-r-slot" id="main-right"></div>
            </div>

            <div class="options-area">
                ${opcoes.map(img => `
                    <div class="option-card" data-img="${img}" onclick="validarEscolha(this, '${img}')">
                        <img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function validarEscolha(el, imgNome) {
    if (!jogoAtivo) return;
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    jogoAtivo = false;
    document.querySelectorAll('.option-card').forEach(c => c.style.pointerEvents = 'none');

    if (imgNome === itemCorreto) {
        acertos++; somAcerto.play();
        el.classList.add('correct-anim');
        document.getElementById('main-left').style.filter = "none";
        document.getElementById('main-left').style.opacity = "1";
        const rightSide = document.getElementById('main-right');
        rightSide.style.border = "4px solid #7ed321"; rightSide.style.background = "white";
        rightSide.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${imgNome}" style="position:absolute; width:200%; height:100%; right:0; top:0; object-fit:contain;">`;
    } else {
        erros++; somErro.play();
        el.classList.add('wrong-anim');
        document.querySelectorAll('.option-card').forEach(c => {
            if(c.getAttribute('data-img') === itemCorreto) c.classList.add('correct-anim');
        });
    }
    setTimeout(() => { rondaAtual++; jogoAtivo = true; proximaRonda(); }, 2000);
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const cards = document.querySelectorAll('.option-card');
    cards.forEach(c => {
        if (c.getAttribute('data-img') === itemCorreto) {
            c.style.borderColor = "#ff9800"; c.style.boxShadow = "0 0 15px #ff9800";
            setTimeout(() => { c.style.boxShadow = "0 4px 0 #ddd"; ajudaDisponivel = true; }, 1500);
        }
    });
};

// === 4. ECRÃ DE RESULTADOS FINAL ===
function finalizarJogo() {
    jogoAtivo = false; somVitoria.play();
    const perc = Math.round((acertos / 10) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px; display: flex !important;">
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; max-width:450px; margin:auto;">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px; display:block; margin: 0 auto 10px;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center; line-height:1;">${rank.titulo}</h1>
                <div style="display:flex; gap:12px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.6rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.6rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.6rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.6rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.6rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.6rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 12px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
