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

// CSS DO MONSTRO (Corpo Único, Braços atrás, Reativo)
const CSS_MONSTRO = `
    .monster-container { 
        position: relative; width: 100%; height: 100%; 
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        --monster-c: #66d1ed;
    }
    .monster-body { 
        width: 90%; height: 80%; background: var(--monster-c); border-radius: 50%; 
        position: relative; z-index: 5; display: flex; flex-direction: column; 
        align-items: center; justify-content: center; transition: background 0.2s;
        box-shadow: inset -8px -8px 15px rgba(0,0,0,0.1);
    }
    .monster-body::before, .monster-body::after { 
        content: ''; position: absolute; top: 40%; width: 25%; height: 45%; 
        background: var(--monster-c); border-radius: 20px; z-index: -1; transition: background 0.2s;
    }
    .monster-body::before { left: -12%; transform: rotate(25deg); }
    .monster-body::after { right: -12%; transform: rotate(-25deg); }
    .spikes { position: absolute; top: -15px; font-size: 24px; color: var(--monster-c); letter-spacing: 3px; z-index: 4; transition: color 0.2s; }
    .monster-eye { width: 35%; height: 35%; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: -15%; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .monster-pupil { width: 50%; height: 50%; background: #222; border-radius: 50%; position: relative; }
    .monster-pupil::after { content: ''; position: absolute; top: 15%; left: 15%; width: 30%; height: 30%; background: white; border-radius: 50%; }
    .monster-cheeks { display: flex; justify-content: space-between; width: 65%; position: absolute; top: 55%; pointer-events: none; }
    .cheek { width: 22px; height: 14px; background: #ff8da1; border-radius: 50%; opacity: 0.4; }
    .monster-mouth { width: 55%; height: 10px; background: transparent; border-bottom: 4px solid #222; border-radius: 50%; transition: 0.2s; margin-top: 10px; }
    .monster-container.open .monster-mouth { height: 35%; background: #222; border: none; border-radius: 10px 10px 40px 40px; }
    .monster-legs { display: flex; justify-content: space-around; width: 65%; height: 20%; margin-top: -12px; z-index: 4; }
    .monster-leg { width: 35%; height: 100%; background: var(--monster-c); border-radius: 0 0 20px 20px; transition: background 0.2s; }
    .monster-container.happy { --monster-c: #4caf50 !important; }
    .monster-container.sad { --monster-c: #f44336 !important; animation: shake 0.4s; }
`;

function falarInstrucao() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(JOGO_CATEGORIAS[categoriaAtiva].descricao);
        msg.lang = 'pt-PT'; msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}

window.startLogic = function() {
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent"; timerBadge.style.padding = "0";
    }
    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtiva = key;
    if(document.getElementById('intro-instr')) document.getElementById('intro-instr').innerText = JOGO_CATEGORIAS[key].descricao;
    renderTutorialAnimation();
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const itemTut = categoriaAtiva === "saudavel" ? "alface.png" : "bolo.png";
    container.innerHTML = `
        <style>
            ${CSS_MONSTRO}
            .tut-stage { position: relative; width: 340px; height: 190px; background: white; border: 3px dashed var(--primary-blue); border-radius: 25px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .tut-m-box { width: 100px; height: 120px; margin-left: -100px; transform: scale(0.8); }
            .tut-f { position: absolute; width: 45px; z-index: 15; left: 220px; top: 70px; animation: fS 5s infinite; }
            .tut-h { position: absolute; font-size: 40px; z-index: 20; left: 230px; top: 100px; animation: hS 5s infinite; }
            @keyframes hS { 0%, 15% { left: 230px; top: 100px; } 45%, 65% { left: 60px; top: 90px; } 80%, 100% { left: 230px; top: 100px; } }
            @keyframes fS { 0%, 15% { left: 220px; top: 70px; opacity: 1; } 45% { left: 40px; top: 75px; opacity: 1; transform: scale(0.6); } 50%, 100% { left: 40px; top: 75px; opacity: 0; } }
        </style>
        <div class="tut-stage">
            <div class="tut-m-box" id="tut-monster-parent">
                <div class="monster-container">
                    <div class="monster-body"><div class="monster-eye"><div class="monster-pupil"></div></div><div class="monster-mouth"></div></div>
                    <div class="monster-legs"><div class="monster-leg"></div><div class="monster-leg"></div></div>
                </div>
            </div>
            <img src="${JOGO_CONFIG.caminhoImg}comida/${itemTut}" class="tut-f">
            <div class="tut-h">☝️</div>
        </div>
    `;
}

window.initGame = function() { acertos = 0; erros = 0; ajudasUtilizadas = 0; rondaAtual = 1; jogoAtivo = true; proximaRonda(); };

function proximaRonda() {
    if (rondaAtual > 10) { finalizarJogo(); return; }
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    document.getElementById('round-val').innerText = `${rondaAtual} / 10`;
    renderizarEcraAlimentacao();
}

function renderizarEcraAlimentacao() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    const numAlvos = Math.floor(Math.random() * 2) + 1; 
    alvosRestantesNaRonda = numAlvos;
    const alvosSorteados = [...config.alvos].sort(() => 0.5 - Math.random()).slice(0, numAlvos);
    const distracoesSorteados = [...config.distracoes].sort(() => 0.5 - Math.random()).slice(0, 6 - numAlvos);
    const opcoesRonda = [...alvosSorteados.map(img => ({ img, status: 'correto' })), ...distracoesSorteados.map(img => ({ img, status: 'errado' }))].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            ${CSS_MONSTRO}
            .monster-wrap { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 5px; box-sizing: border-box; }
            .instr-box { background: white; padding: 10px 25px; border-radius: 50px; font-weight: 900; color: #5d7082; border: 3px solid var(--primary-blue); display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); z-index:10; }
            .btn-som { background: #ff9800; border: none; width: 45px; height: 45px; border-radius: 50% !important; color: white; cursor: pointer; box-shadow: 0 4px 0 #e65100; display: flex; align-items: center; justify-content: center; }
            
            /* GAME STAGE RESPONSIVO */
            .game-stage { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; gap: 40px; }
            
            /* LANDSCAPE (Default) */
            .game-stage { flex-direction: row; }
            .m-size { width: clamp(200px, 35vh, 280px); height: clamp(220px, 38vh, 320px); }
            .food-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
            .food-card { width: clamp(90px, 17vh, 140px); height: clamp(90px, 17vh, 140px); background: white; border: 3px solid #f0f4f8; border-radius: 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 0 #d0d8de; position: relative; }
            
            .food-img { width: 92%; height: 92%; object-fit: contain; cursor: pointer; touch-action: none; }
            .dragged { position: fixed !important; z-index: 1000; width: 80px !important; height: 80px !important; pointer-events: none; transform: translate(-50%, -50%) scale(0.7) !important; }
            .flying { position: fixed !important; z-index: 1000; width: 80px !important; height: 80px !important; pointer-events: none; transition: all 0.5s ease-in; transform: translate(-50%, -50%) scale(0.5); }

            /* PORTRAIT (Vertical Mobile) */
            @media (max-width: 600px) and (orientation: portrait) {
                .game-stage { flex-direction: column; gap: 15px; }
                .m-size { width: 160px; height: 180px; }
                .food-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
                .food-card { width: 85px; height: 85px; }
                .instr-box { width: 95%; font-size: 0.9rem; }
            }
            
            @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }
        </style>
        <div class="monster-wrap">
            <div class="instr-box"><button class="btn-som" onclick="falarInstrucao()"><i class="fas fa-volume-up"></i></button><span>${config.descricao}</span></div>
            <div class="game-stage">
                <div class="monster-container m-size" id="monster-parent">
                    <div class="spikes">▼▼▼</div>
                    <div class="monster-body" id="monster-main">
                        <div class="monster-eye"><div class="monster-pupil"></div></div>
                        <div class="monster-mouth"></div>
                    </div>
                    <div class="monster-legs"><div class="monster-leg"></div><div class="monster-leg"></div></div>
                </div>
                <div class="food-grid">${opcoesRonda.map((opt, i) => `<div class="food-card"><img src="${JOGO_CONFIG.caminhoImg}comida/${opt.img}" class="food-img" id="food-${i}" data-status="${opt.status}" onmousedown="startInteract(event, this)" ontouchstart="startInteract(event, this)" draggable="false"></div>`).join('')}</div>
            </div>
        </div>
    `;
}

// === INTERAÇÃO ===
function startInteract(e, el) {
    if (!jogoAtivo) return;
    const isT = e.type === 'touchstart';
    const startX = isT ? e.touches[0].clientX : e.clientX;
    const startY = isT ? e.touches[0].clientY : e.clientY;
    let moved = false;

    function move(e) {
        const x = isT ? e.touches[0].clientX : e.clientX;
        const y = isT ? e.touches[0].clientY : e.clientY;
        if (Math.abs(x - startX) > 10 || Math.abs(y - startY) > 10) {
            moved = true; el.classList.add('dragged');
            el.style.left = x + "px"; el.style.top = y + "px";
            document.getElementById('monster-parent').classList.add('open');
        }
    }
    function end() {
        document.removeEventListener(isT ? 'touchmove' : 'mousemove', move);
        document.removeEventListener(isT ? 'touchend' : 'mouseup', end);
        if (moved) verificarColisao(el);
        else voarAteBoca(el);
    }
    document.addEventListener(isT ? 'touchmove' : 'mousemove', move, { passive: false });
    document.addEventListener(isT ? 'touchend' : 'mouseup', end);
}

function voarAteBoca(el) {
    const m = document.getElementById('monster-main');
    const r = el.getBoundingClientRect(); const mR = m.getBoundingClientRect();
    el.classList.add('flying');
    el.style.left = r.left + r.width/2 + "px"; el.style.top = r.top + r.height/2 + "px";
    setTimeout(() => {
        el.style.left = mR.left + mR.width/2 + "px"; el.style.top = mR.top + mR.height/2 + "px";
        processarAlimentacao(el);
    }, 10);
}

function verificarColisao(el) {
    const m = document.getElementById('monster-main');
    const mR = m.getBoundingClientRect(); const eR = el.getBoundingClientRect();
    if (eR.left < mR.right && eR.right > mR.left && eR.top < mR.bottom && eR.bottom > mR.top) processarAlimentacao(el, true);
    else { document.getElementById('monster-parent').classList.remove('open'); el.classList.remove('dragged'); el.style.position = 'static'; }
}

function processarAlimentacao(el, imediato = false) {
    const status = el.getAttribute('data-status');
    const parent = document.getElementById('monster-parent');
    parent.classList.add('open'); jogoAtivo = false;
    if (status === 'correto') { acertos++; somAcerto.play(); parent.classList.add('happy'); el.remove(); alvosRestantesNaRonda--; }
    else { erros++; somErro.play(); parent.classList.add('sad'); el.style.position = "static"; el.classList.remove('flying', 'dragged'); }
    setTimeout(() => {
        parent.classList.remove('happy', 'sad', 'open'); jogoAtivo = true;
        if (alvosRestantesNaRonda <= 0) { rondaAtual++; proximaRonda(); }
    }, 1000);
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const imgs = document.querySelectorAll('.food-img');
    imgs.forEach(img => { if (img.getAttribute('data-status') === 'correto') { img.style.filter = "drop-shadow(0 0 15px #ff9800)"; img.style.transform = "scale(1.1)"; setTimeout(() => { img.style.filter = "none"; img.style.transform = "scale(1)"; ajudaDisponivel = true; }, 1500); } });
};

function finalizarJogo() {
    jogoAtivo = false; somVitoria.play();
    const perc = Math.round((acertos / (acertos + erros || 1)) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    document.getElementById('scr-game').classList.remove('active');
    const res = document.getElementById('scr-result');
    res.classList.add('active');
    res.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px; display: flex !important;">
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; max-width:450px; margin:auto;">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px; display:block; margin: 0 auto 10px;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center; line-height:1;">${rank.titulo}</h1>
                <div style="display:flex; gap:12px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:20px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05);"><span style="font-size:1.6rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.6rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05);"><span style="font-size:1.6rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.6rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05);"><span style="font-size:1.6rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.6rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 12px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
