let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let rondaAtual = 1;
let jogoAtivo = false;
let ajudaDisponivel = true;
let categoriaAtiva = "saudavel";
let alvosRestantesNaRonda = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. FUNÇÃO DE VOZ ===
function falarInstrucao() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const texto = JOGO_CATEGORIAS[categoriaAtiva].descricao;
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-PT';
        msg.rate = 0.85; 
        window.speechSynthesis.speak(msg);
    }
}

// === 2. INICIALIZAÇÃO ===
window.startLogic = function() {
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = config.descricao;

    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
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
    const itemTutorial = categoriaAtiva === "saudavel" ? "alface.png" : "bolo.png";

    container.innerHTML = `
        <style>
            .tut-stage { position: relative; width: 340px; height: 180px; background: white; border: 3px dashed var(--primary-blue); border-radius: 25px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .tut-monster { width: 90px; height: 90px; background: #66d1ed; border-radius: 50%; position: relative; margin-left: -80px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .tut-eye { width: 30px; height: 30px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; }
            .tut-pupil { width: 14px; height: 14px; background: #222; border-radius: 50%; }
            .tut-mouth { width: 35px; height: 12px; border-bottom: 3px solid #222; border-radius: 50%; }
            .tut-food { position: absolute; width: 45px; z-index: 15; left: 220px; top: 60px; }
            .tut-hand { position: absolute; font-size: 40px; z-index: 20; left: 240px; top: 90px; }
            @keyframes handS { 0% { left: 240px; top: 105px; } 15% { left: 240px; top: 85px; transform: scale(0.9); } 45%, 65% { left: 50px; top: 90px; transform: scale(0.9); } 75% { left: 240px; top: 105px; transform: scale(1); } 100% { left: 240px; top: 105px; } }
            @keyframes foodS { 0%, 15% { left: 220px; top: 60px; opacity: 1; transform: scale(1); } 45% { left: 30px; top: 70px; opacity: 1; transform: scale(0.5); } 50%, 100% { left: 30px; top: 70px; opacity: 0; } }
            @keyframes mouthS { 0%, 40% { height: 12px; } 45%, 65% { height: 30px; background: #222; border-radius: 10px 10px 30px 30px; } 70%, 100% { height: 12px; background: transparent; } }
            .tut-hand { animation: handS 5s infinite ease-in-out; }
            .tut-food { animation: foodS 5s infinite ease-in-out; }
            .tut-mouth { animation: mouthS 5s infinite ease-in-out; }
        </style>
        <div class="tut-stage">
            <div class="tut-monster">
                <div class="tut-eye"><div class="tut-pupil"></div></div>
                <div class="tut-mouth"></div>
            </div>
            <img src="${JOGO_CONFIG.caminhoImg}comida/${itemTutorial}" class="tut-food">
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
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    document.getElementById('round-val').innerText = `${rondaAtual} / 10`;
    renderizarEcraAlimentacao();
    if(rondaAtual === 1) setTimeout(falarInstrucao, 500);
}

function renderizarEcraAlimentacao() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    
    const numAlvos = Math.floor(Math.random() * 2) + 1; 
    alvosRestantesNaRonda = numAlvos;

    const alvosSorteados = [...config.alvos].sort(() => 0.5 - Math.random()).slice(0, numAlvos);
    const distracoesSorteados = [...config.distracoes].sort(() => 0.5 - Math.random()).slice(0, 6 - numAlvos);

    const opcoesRonda = [
        ...alvosSorteados.map(img => ({ img, status: 'correto' })),
        ...distracoesSorteados.map(img => ({ img, status: 'errado' }))
    ].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .monster-wrap { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 10px; box-sizing: border-box; }
            .instr-box { background: white; padding: 10px 25px; border-radius: 50px; font-weight: 900; color: #5d7082; border: 3px solid var(--primary-blue); display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .btn-som { background: #ff9800; border: none; width: 45px; height: 45px; border-radius: 50% !important; color: white; cursor: pointer; box-shadow: 0 4px 0 #e65100; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            
            .game-stage { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap; }
            
            /* MONSTRO AZUL REATIVO */
            .monster { width: clamp(190px, 35vh, 280px); height: clamp(190px, 35vh, 280px); background: #66d1ed; border-radius: 50%; position: relative; box-shadow: inset -10px -10px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: background 0.3s, transform 0.3s; pointer-events: none; }
            .monster::after { content: '▼'; position: absolute; top: -12px; font-size: 25px; color: inherit; text-shadow: 35px 8px currentColor, -35px 8px currentColor; }
            .monster-eye { width: 70px; height: 70px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: -20px; box-shadow: 0 5px 10px rgba(0,0,0,0.1); }
            .monster-pupil { width: 30px; height: 30px; background: #222; border-radius: 50%; position: relative; }
            .monster-pupil::after { content: ''; position: absolute; top: 4px; left: 4px; width: 8px; height: 8px; background: white; border-radius: 50%; }
            .monster-cheeks { display: flex; justify-content: space-between; width: 130px; position: absolute; top: 50%; }
            .cheek { width: 22px; height: 14px; background: #ff8da1; border-radius: 50%; opacity: 0.5; }
            .monster-mouth { width: 100px; height: 10px; background: transparent; border-bottom: 5px solid #222; border-radius: 50%; transition: all 0.3s ease; position: relative; margin-top: 15px; }

            .monster.open .monster-mouth { height: 70px; background: #222; border-radius: 15px 15px 50px 50px; border: none; }
            .monster.happy { background: #4caf50 !important; } /* VERDE */
            .monster.sad { background: #f44336 !important; animation: shake 0.4s; } /* VERMELHO */

            .food-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
            .food-card { width: clamp(90px, 18vh, 140px); height: clamp(90px, 18vh, 140px); background: white; border: 3px solid #f0f4f8; border-radius: 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 0 #d0d8de; position: relative; }
            .food-img { width: 90%; height: 90%; object-fit: contain; cursor: grab; transition: transform 0.2s; touch-action: none; user-select: none; }
            
            .dragged-item { position: fixed !important; z-index: 1000; width: 80px !important; height: 80px !important; object-fit: contain; pointer-events: none; transform: translate(-50%, -50%) !important; }
            .flying { position: fixed !important; z-index: 999; pointer-events: none; transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); width: 80px !important; transform: rotate(360deg); }
            
            @media (max-width: 650px) { .food-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } .monster { width: 160px; height: 160px; } .monster-eye { width: 50px; height: 50px; } .monster-pupil { width: 20px; height: 20px; } .food-card { width: 90px; height: 90px; } }
            @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }
        </style>

        <div class="monster-wrap">
            <div class="instr-box"><button class="btn-som" onclick="falarInstrucao()"><i class="fas fa-volume-up"></i></button><span>${config.descricao}</span></div>
            <div class="game-stage">
                <div class="monster" id="monster-main">
                    <div class="monster-eye"><div class="monster-pupil"></div></div>
                    <div class="monster-cheeks"><div class="cheek"></div><div class="cheek"></div></div>
                    <div class="monster-mouth"></div>
                </div>
                <div class="food-grid">
                    ${opcoesRonda.map((opt, i) => `
                        <div class="food-card">
                            <img src="${JOGO_CONFIG.caminhoImg}comida/${opt.img}" 
                                 class="food-img"
                                 id="food-${i}" data-status="${opt.status}" 
                                 onclick="voarAteBoca(this)"
                                 onmousedown="iniciarArrasto(event, this)"
                                 ontouchstart="iniciarArrasto(event, this)"
                                 draggable="false">
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// === INTERAÇÃO ===

function voarAteBoca(el) {
    if (!jogoAtivo || el.classList.contains('dragged-item')) return;
    const monster = document.getElementById('monster-main');
    const rect = el.getBoundingClientRect();
    const mRect = monster.getBoundingClientRect();

    el.style.position = 'fixed';
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    el.classList.add('flying');
    
    setTimeout(() => {
        el.style.left = (mRect.left + mRect.width / 2 - 40) + "px";
        el.style.top = (mRect.top + mRect.height / 2 - 40) + "px";
        processarAlimentacao(el);
    }, 10);
}

function iniciarArrasto(e, el) {
    if (!jogoAtivo) return;
    e.preventDefault();
    let isT = e.type === 'touchstart';
    function mover(e) {
        let cX = isT ? e.touches[0].clientX : e.clientX;
        let cY = isT ? e.touches[0].clientY : e.clientY;
        el.classList.add('dragged-item');
        el.style.left = cX + "px";
        el.style.top = cY + "px";
        document.getElementById('monster-main').classList.add('open');
    }
    function soltar() {
        document.removeEventListener(isT ? 'touchmove' : 'mousemove', mover);
        document.removeEventListener(isT ? 'touchend' : 'mouseup', soltar);
        if (el.classList.contains('dragged-item')) verificarColisao(el);
    }
    document.addEventListener(isT ? 'touchmove' : 'mousemove', mover, { passive: false });
    document.addEventListener(isT ? 'touchend' : 'mouseup', soltar);
}

function verificarColisao(el) {
    const m = document.getElementById('monster-main');
    const mR = m.getBoundingClientRect();
    const eR = el.getBoundingClientRect();
    const centerX = eR.left + eR.width / 2;
    const centerY = eR.top + eR.height / 2;
    if (centerX > mR.left && centerX < mR.right && centerY > mR.top && centerY < mR.bottom) {
        processarAlimentacao(el, true);
    } else {
        m.classList.remove('open');
        el.classList.remove('dragged-item');
        el.style.position = 'static';
    }
}

function processarAlimentacao(el, imediato = false) {
    const status = el.getAttribute('data-status');
    const monster = document.getElementById('monster-main');
    monster.classList.add('open');
    jogoAtivo = false;

    setTimeout(() => {
        monster.classList.remove('open');
        if (status === 'correto') {
            acertos++; somAcerto.play();
            monster.classList.add('happy');
            el.remove();
            alvosRestantesNaRonda--;
        } else {
            erros++; somErro.play();
            monster.classList.add('sad');
            el.classList.remove('dragged-item', 'flying');
            el.style.position = "static"; // Volta para o cartão
        }
        
        setTimeout(() => {
            monster.classList.remove('happy', 'sad');
            jogoAtivo = true;
            if (alvosRestantesNaRonda <= 0) {
                rondaAtual++;
                proximaRonda();
            }
        }, 1000);
    }, imediato ? 100 : 600);
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const foodImgs = document.querySelectorAll('.food-img');
    foodImgs.forEach(img => {
        if (img.getAttribute('data-status') === 'correto') {
            img.style.filter = "drop-shadow(0 0 20px #ff9800)";
            img.style.transform = "scale(1.1)";
            setTimeout(() => { img.style.filter = "none"; img.style.transform = "scale(1)"; ajudaDisponivel = true; }, 1500);
        }
    });
};

// === 4. ECRÃ DE RESULTADOS FINAL ===
function finalizarJogo() {
    jogoAtivo = false; somVitoria.play();
    const perc = Math.round((acertos / (acertos + erros || 1)) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    // Garantir que os ecrãs mudam corretamente
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px; display: flex !important;">
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; max-width:450px; margin:auto;">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center; line-height:1;">${rank.titulo}</h1>
                <div style="display:flex; gap:15px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05);"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:25px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:25px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button class="btn-redo-final" style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button class="btn-other-final" style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 12px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
