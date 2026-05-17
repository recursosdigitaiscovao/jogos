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
        msg.rate = 0.9; 
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
            .tut-stage { position: relative; width: 320px; height: 180px; background: white; border: 3px dashed var(--primary-blue); border-radius: 25px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .tut-monster { width: 80px; height: 80px; background: #66d1ed; border-radius: 50%; position: relative; margin-left: -80px; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: background 0.3; }
            .tut-eye { width: 30px; height: 30px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            .tut-pupil { width: 14px; height: 14px; background: #222; border-radius: 50%; }
            .tut-mouth { width: 35px; height: 8px; border-bottom: 3px solid #222; border-radius: 50%; }
            .tut-item { position: absolute; width: 40px; z-index: 15; opacity: 1; }
            .tut-hand { position: absolute; font-size: 35px; z-index: 20; }

            @keyframes handLoop {
                0% { left: 240px; top: 120px; }
                10% { left: 240px; top: 110px; }
                25% { left: 60px; top: 110px; }
                35% { left: 240px; top: 120px; }
                50% { left: 240px; top: 50px; }
                65% { left: 60px; top: 90px; }
                80%, 100% { left: 240px; top: 120px; }
            }
            @keyframes monsterCol { 0%, 20% { background: #66d1ed; } 25%, 40% { background: #f44336; } 45%, 60% { background: #66d1ed; } 65%, 85% { background: #4caf50; } 90%, 100% { background: #66d1ed; } }
            @keyframes f1 { 0%, 10% { left: 220px; top: 100px; opacity:1; } 25%, 35% { left: 40px; top: 100px; opacity:0; } 40%, 100% { opacity:0; } }
            @keyframes f2 { 0%, 50% { left: 220px; top: 40px; opacity:1; } 65%, 75% { left: 40px; top: 80px; opacity:0; } 80%, 100% { opacity:0; } }

            .tut-monster { animation: monsterCol 6s infinite; }
            .tut-hand { animation: handLoop 6s infinite ease-in-out; }
            .f-e { animation: f1 6s infinite; }
            .f-c { animation: f2 6s infinite; }
        </style>
        <div class="tut-stage">
            <div class="tut-monster"><div class="tut-eye"><div class="tut-pupil"></div></div><div class="tut-mouth"></div></div>
            <img src="${JOGO_CONFIG.caminhoImg}comida/doce.png" class="tut-item f-e">
            <img src="${JOGO_CONFIG.caminhoImg}comida/alface.png" class="tut-item f-c">
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
    const opcoesRonda = [...alvosSorteados.map(img => ({ img, status: 'correto' })), ...distracoesSorteados.map(img => ({ img, status: 'errado' }))].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .monster-wrap { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 5px; box-sizing: border-box; }
            .instr-box { background: white; padding: 10px 25px; border-radius: 50px; font-weight: 900; color: #5d7082; border: 3px solid var(--primary-blue); display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .btn-som { background: #ff9800; border: none; width: 45px; height: 45px; border-radius: 50% !important; color: white; cursor: pointer; box-shadow: 0 4px 0 #e65100; display: flex; align-items: center; justify-content: center; }
            
            .game-stage { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap; }
            
            /* MONSTRO INTEGRADO (BRAÇOS E PERNAS) */
            .monster-container { 
                position: relative; width: clamp(180px, 30vh, 260px); height: clamp(200px, 35vh, 300px); 
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                --monster-c: #66d1ed;
            }
            .monster-body { 
                width: 100%; height: 75%; background: var(--monster-c); border-radius: 50%; position: relative; z-index: 5;
                display: flex; flex-direction: column; align-items: center; justify-content: center; transition: background 0.3s;
                box-shadow: inset -8px -8px 15px rgba(0,0,0,0.1);
            }
            /* Braços */
            .monster-body::before, .monster-body::after { 
                content: ''; position: absolute; top: 40%; width: 25%; height: 45%; 
                background: var(--monster-c); border-radius: 20px; z-index: -1; transition: background 0.3s;
            }
            .monster-body::before { left: -15%; transform: rotate(20deg); }
            .monster-body::after { right: -15%; transform: rotate(-20deg); }
            
            /* Pernas */
            .monster-legs { display: flex; justify-content: space-around; width: 60%; height: 20%; margin-top: -10px; }
            .monster-leg { width: 35%; height: 100%; background: var(--monster-c); border-radius: 0 0 15px 15px; transition: background 0.3s; }

            .monster-eye { width: 35%; height: 35%; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: -15%; position: relative; }
            .monster-pupil { width: 50%; height: 50%; background: #222; border-radius: 50%; position: relative; }
            .monster-pupil::after { content: ''; position: absolute; top: 15%; left: 15%; width: 30%; height: 30%; background: white; border-radius: 50%; }
            .monster-mouth { width: 55%; height: 10px; background: transparent; border-bottom: 4px solid #222; border-radius: 50%; transition: 0.3s; margin-top: 10px; }
            
            .open .monster-mouth { height: 35%; background: #222; border: none; border-radius: 10px 10px 40px 40px; }
            .happy { --monster-c: #4caf50 !important; }
            .sad { --monster-c: #f44336 !important; animation: shake 0.4s; }

            .food-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            .food-card { width: clamp(85px, 16vh, 130px); height: clamp(85px, 16vh, 130px); background: white; border: 3px solid #f0f4f8; border-radius: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 0 #d0d8de; position: relative; }
            .food-img { width: 90%; height: 90%; object-fit: contain; cursor: grab; transition: transform 0.2s; touch-action: none; }
            
            .dragged-item { position: fixed !important; z-index: 1000; width: 80px !important; height: 80px !important; pointer-events: none; transform: translate(-50%, -50%) !important; }
            .flying { position: fixed !important; z-index: 1000; width: 80px !important; height: 80px !important; pointer-events: none; transition: all 0.5s ease-in; }
            
            @media (max-width: 650px) { .food-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } .monster-container { width: 140px; height: 160px; } .food-card { width: 80px; height: 80px; } }
            @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }
        </style>

        <div class="monster-wrap">
            <div class="instr-box"><button class="btn-som" onclick="falarInstrucao()"><i class="fas fa-volume-up"></i></button><span>${config.descricao}</span></div>
            <div class="game-stage">
                <div class="monster-container" id="monster-container">
                    <div class="monster-body" id="monster-main">
                        <div class="monster-eye"><div class="monster-pupil"></div></div>
                        <div class="monster-mouth"></div>
                    </div>
                    <div class="monster-legs"><div class="monster-leg"></div><div class="monster-leg"></div></div>
                </div>
                <div class="food-grid">
                    ${opcoesRonda.map((opt, i) => `
                        <div class="food-card">
                            <img src="${JOGO_CONFIG.caminhoImg}comida/${opt.img}" 
                                 class="food-img" id="food-${i}" data-status="${opt.status}" 
                                 onclick="voarAteBoca(this)" onmousedown="iniciarArrasto(event, this)" ontouchstart="iniciarArrasto(event, this)" draggable="false">
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
    el.style.position = 'fixed'; el.style.left = rect.left + "px"; el.style.top = rect.top + "px";
    el.classList.add('flying');
    setTimeout(() => {
        el.style.left = (mRect.left + mRect.width / 2) + "px";
        el.style.top = (mRect.top + mRect.height / 2) + "px";
        el.style.transform = "translate(-50%, -50%) scale(0.3)";
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
        el.style.left = cX + "px"; el.style.top = cY + "px";
        document.getElementById('monster-container').classList.add('open');
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
    const cX = eR.left + eR.width / 2;
    const cY = eR.top + eR.height / 2;
    if (cX > mR.left && cX < mR.right && cY > mR.top && cY < mR.bottom) processarAlimentacao(el, true);
    else { document.getElementById('monster-container').classList.remove('open'); el.style.position = 'static'; el.classList.remove('dragged-item'); }
}

function processarAlimentacao(el, imediato = false) {
    const status = el.getAttribute('data-status');
    const container = document.getElementById('monster-container');
    container.classList.add('open');
    jogoAtivo = false;

    setTimeout(() => {
        container.classList.remove('open');
        if (status === 'correto') {
            acertos++; somAcerto.play();
            container.classList.add('happy');
            el.remove();
            alvosRestantesNaRonda--;
        } else {
            erros++; somErro.play();
            container.classList.add('sad');
            el.style.position = "static";
            el.classList.remove('flying', 'dragged-item');
            el.style.transform = "scale(1)";
        }
        
        setTimeout(() => {
            container.classList.remove('happy', 'sad');
            jogoAtivo = true;
            if (alvosRestantesNaRonda <= 0) { rondaAtual++; proximaRonda(); }
        }, 1000);
    }, imediato ? 100 : 500);
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const foodImgs = document.querySelectorAll('.food-img');
    foodImgs.forEach(img => {
        if (img.getAttribute('data-status') === 'correto') {
            img.style.filter = "drop-shadow(0 0 15px #ff9800)";
            img.style.transform = "scale(1.1)";
            setTimeout(() => { img.style.filter = "none"; img.style.transform = "scale(1)"; ajudaDisponivel = true; }, 1500);
        }
    });
};

// === 4. ECRÃ DE RESULTADOS (OTIMIZADO PARA LANDSCAPE) ===
function finalizarJogo() {
    jogoAtivo = false; somVitoria.play();
    const perc = Math.round((acertos / (acertos + erros || 1)) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 15px; display: flex !important; overflow-y: auto;">
            <style>
                .res-card { display:flex; flex-direction:column; align-items:center; width:100%; max-width:500px; margin:auto; }
                .res-trophy { width: clamp(80px, 15vh, 120px); margin-bottom: 5px; }
                .res-title { color:var(--primary-blue); font-size: clamp(1.5rem, 4vh, 2.2rem); font-weight:900; margin: 10px 0; text-align:center; line-height:1; }
                .res-stats { display:flex; gap:10px; margin-bottom:20px; }
                .res-box { background:white; border-radius:20px; width: clamp(80px, 18vh, 100px); height: clamp(80px, 18vh, 100px); display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
                .res-num { font-size: 1.5rem; font-weight: 900; }
                .res-lab { font-size: 0.6rem; font-weight: 900; color:#88a; text-transform:uppercase; }
                .res-btns { display:flex; flex-direction:column; gap:10px; width:100%; max-width:300px; }
                .btn-final { height: 50px; border-radius:30px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1rem; text-decoration:none; cursor:pointer; border:none; gap:10px; }
                .btn-solid { background:var(--primary-blue); color:white; box-shadow: 0 5px 0 var(--primary-dark); }
                .btn-outline { background:white; color:var(--primary-blue); border:2px solid var(--primary-blue); }
                .btn-subtle { background:#e2e8f0; color:#64748b; }
                @media (orientation: landscape) and (max-height: 500px) { .res-card { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 20px; } .res-btns { max-width: 200px; } .res-stats { margin-bottom: 0; } }
            </style>
            <div class="res-card">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" class="res-trophy">
                <div style="width: 100%; display: contents;">
                    <h1 class="res-title">${rank.titulo}</h1>
                    <div class="res-stats">
                        <div class="res-box"><span class="res-num" style="color:#7ed321;">${acertos}</span><span class="res-lab">Certos</span></div>
                        <div class="res-box"><span class="res-num" style="color:#ff5e5e;">${erros}</span><span class="res-lab">Errados</span></div>
                        <div class="res-box"><span class="res-num" style="color:#ff9f43;">${ajudasUtilizadas}</span><span class="res-lab">Ajudas</span></div>
                    </div>
                    <div class="res-btns">
                        <button class="btn-final btn-solid" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                        <button class="btn-final btn-outline" onclick="openRDMenu(event)"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                        <a href="${JOGO_CONFIG.linkVoltar}" class="btn-final btn-subtle"><i class="fas fa-sign-out-alt"></i> SAIR</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}
