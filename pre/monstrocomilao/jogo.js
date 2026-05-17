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
            .tut-stage { position: relative; width: 340px; height: 200px; background: white; border: 3px dashed var(--primary-blue); border-radius: 25px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .tut-monster { width: 100px; height: 100px; background: #9c27b0; border-radius: 50% 50% 40% 40%; position: relative; box-shadow: 0 8px 0 #4a148c; margin-left: -100px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .tut-eyes { display: flex; gap: 15px; margin-bottom: 5px; }
            .tut-eye { width: 15px; height: 15px; background: white; border-radius: 50%; position: relative; }
            .tut-pupil { width: 7px; height: 7px; background: black; border-radius: 50%; position: absolute; top: 3px; left: 3px; }
            .tut-mouth { width: 40px; height: 15px; background: #210329; border-radius: 5px 5px 20px 20px; border: 2.5px solid #ffeb3b; }
            .tut-food { position: absolute; width: 55px; z-index: 15; left: 220px; top: 65px; }
            .tut-hand { position: absolute; font-size: 45px; z-index: 20; left: 240px; top: 100px; }
            @keyframes handS { 0% { left: 240px; top: 105px; } 15% { left: 240px; top: 85px; transform: scale(0.9); } 45%, 65% { left: 50px; top: 95px; transform: scale(0.9); } 75% { left: 240px; top: 105px; transform: scale(1); } 100% { left: 240px; top: 105px; } }
            @keyframes foodS { 0%, 15% { left: 220px; top: 65px; opacity: 1; transform: scale(1); } 45% { left: 30px; top: 75px; opacity: 1; transform: scale(0.8); } 50%, 100% { left: 30px; top: 75px; opacity: 0; transform: scale(0.4); } }
            @keyframes mouthS { 0%, 40% { height: 15px; } 45%, 65% { height: 35px; } 70%, 100% { height: 15px; } }
            .tut-hand { animation: handS 5s infinite ease-in-out; }
            .tut-food { animation: foodS 5s infinite ease-in-out; }
            .tut-mouth { animation: mouthS 5s infinite ease-in-out; }
        </style>
        <div class="tut-stage">
            <div class="tut-monster">
                <div class="tut-eyes"><div class="tut-eye"><div class="tut-pupil"></div></div><div class="tut-eye"><div class="tut-pupil"></div></div></div>
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
    
    // Determina quantos alimentos corretos haverá nesta ronda (entre 1 a 3)
    const numAlvos = Math.floor(Math.random() * 3) + 1;
    alvosRestantesNaRonda = numAlvos;

    // Sorteia os alvos e as distrações para totalizar 6 imagens
    const alvosSorteados = [...config.alvos].sort(() => 0.5 - Math.random()).slice(0, numAlvos);
    const distracoesSorteados = [...config.distracoes].sort(() => 0.5 - Math.random()).slice(0, 6 - numAlvos);

    const opcoesRonda = [
        ...alvosSorteados.map(img => ({ img, status: 'correto' })),
        ...distracoesSorteados.map(img => ({ img, status: 'errado' }))
    ].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .monster-wrap { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 10px; box-sizing: border-box; }
            .instr-box { background: white; padding: 12px 25px; border-radius: 50px; font-weight: 900; color: #5d7082; border: 3px solid var(--primary-blue); display: flex; align-items: center; gap: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .btn-som { background: #ff9800; border: none; width: 48px; height: 48px; border-radius: 50% !important; color: white; cursor: pointer; box-shadow: 0 4px 0 #e65100; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
            
            .game-stage { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; gap: 30px; flex-wrap: wrap; }
            
            .monster { width: clamp(170px, 30vh, 260px); height: clamp(170px, 30vh, 260px); background: #9c27b0; border-radius: 50% 50% 40% 40%; position: relative; box-shadow: 0 14px 0 #4a148c, inset 0 -10px 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: 0.3s; pointer-events: none; }
            .eye-row { display: flex; gap: 25px; margin-bottom: 5px; }
            .eye { width: 35px; height: 35px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; }
            .pupil { width: 16px; height: 16px; background: black; border-radius: 50%; }
            .mouth { width: 45%; height: 20%; background: #210329; border: 5px solid #ffeb3b; border-radius: 10px 10px 60px 60px; transition: 0.2s; margin-top: 15px; box-shadow: inset 0 5px 10px rgba(0,0,0,0.5); }
            
            .monster.open .mouth { height: 45%; }
            .monster.happy { background: #4caf50; box-shadow: 0 14px 0 #1b5e20; }
            .monster.sad { background: #f44336; box-shadow: 0 14px 0 #b71c1c; }

            /* Grelha de 6 itens (3x2 ou 2x3 dependendo do ecrã) */
            .food-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            .food-card { 
                width: clamp(90px, 16vh, 130px); height: clamp(90px, 16vh, 130px); 
                background: white; border: 3px solid #f0f4f8; border-radius: 25px; 
                display: flex; align-items: center; justify-content: center; 
                box-shadow: 0 6px 0 #d0d8de; position: relative;
            }
            /* ALIMENTOS MAIORES */
            .food-img { width: 92%; height: 92%; object-fit: contain; cursor: grab; transition: transform 0.1s; touch-action: none; user-select: none; }
            
            .flying { position: fixed !important; z-index: 999; pointer-events: none; transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); transform: scale(0.2) rotate(360deg); opacity: 0; }
            @media (max-width: 650px) { 
                .food-grid { grid-template-columns: repeat(2, 1fr); }
                .monster { width: 150px; height: 150px; } 
                .food-card { width: 90px; height: 90px; } 
            }
        </style>

        <div class="monster-wrap">
            <div class="instr-box"><button class="btn-som" onclick="falarInstrucao()"><i class="fas fa-volume-up"></i></button><span>${config.descricao}</span></div>
            
            <div class="game-stage">
                <div class="monster" id="monster-main">
                    <div class="eye-row"><div class="eye"><div class="pupil"></div></div><div class="eye"><div class="pupil"></div></div></div>
                    <div class="mouth"></div>
                </div>
                <div class="food-grid">
                    ${opcoesRonda.map((opt, i) => `
                        <div class="food-card">
                            <img src="${JOGO_CONFIG.caminhoImg}comida/${opt.img}" 
                                 class="food-img"
                                 id="food-${i}" data-status="${opt.status}" 
                                 onclick="cliqueItem(this)"
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

// === LÓGICA DE INTERAÇÃO HÍBRIDA ===

function cliqueItem(el) {
    if (!jogoAtivo || el.classList.contains('dragged')) return;
    voarAteBoca(el);
}

function voarAteBoca(el) {
    const monster = document.getElementById('monster-main');
    const rect = el.getBoundingClientRect();
    const mRect = monster.getBoundingClientRect();

    el.style.position = 'fixed';
    el.style.width = rect.width + 'px';
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    el.classList.add('flying');
    
    setTimeout(() => {
        el.style.left = (mRect.left + mRect.width / 2 - 25) + "px";
        el.style.top = (mRect.top + mRect.height / 2) + "px";
        processarAlimentacao(el);
    }, 10);
}

function iniciarArrasto(e, el) {
    if (!jogoAtivo) return;
    e.preventDefault();
    
    let isT = e.type === 'touchstart';
    let sX = isT ? e.touches[0].clientX : e.clientX;
    let sY = isT ? e.touches[0].clientY : e.clientY;
    let moved = false;
    const rect = el.getBoundingClientRect();
    let oX = sX - rect.left;
    let oY = sY - rect.top;

    function mover(e) {
        let cX = isT ? e.touches[0].clientX : e.clientX;
        let cY = isT ? e.touches[0].clientY : e.clientY;
        if (Math.abs(cX - sX) > 10 || Math.abs(cY - sY) > 10) {
            moved = true;
            el.classList.add('dragged');
            el.style.position = 'fixed';
            el.style.width = rect.width + 'px';
            el.style.zIndex = '1000';
            el.style.left = (cX - oX) + "px";
            el.style.top = (cY - oY) + "px";
            el.style.transform = "scale(1.1)";
            document.getElementById('monster-main').classList.add('open');
        }
    }

    function soltar() {
        document.removeEventListener(isT ? 'touchmove' : 'mousemove', mover);
        document.removeEventListener(isT ? 'touchend' : 'mouseup', soltar);
        if (moved) {
            el.style.transform = "scale(1)";
            verificarColisao(el);
        }
        setTimeout(() => el.classList.remove('dragged'), 100);
    }

    document.addEventListener(isT ? 'touchmove' : 'mousemove', mover, { passive: false });
    document.addEventListener(isT ? 'touchend' : 'mouseup', soltar);
}

function verificarColisao(el) {
    const m = document.getElementById('monster-main');
    const mR = m.getBoundingClientRect();
    const eR = el.getBoundingClientRect();
    if (eR.left < mR.right && eR.right > mR.left && eR.top < mR.bottom && eR.bottom > mR.top) {
        processarAlimentacao(el, true);
    } else {
        m.classList.remove('open');
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
            el.style.position = "static";
        }
        
        setTimeout(() => {
            monster.classList.remove('happy', 'sad');
            jogoAtivo = true;
            // Só avança se não houver mais alvos no ecrã
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
            img.style.transform = "scale(1.2)";
            setTimeout(() => { img.style.filter = "none"; img.style.transform = "scale(1)"; ajudaDisponivel = true; }, 1500);
        }
    });
};

function finalizarJogo() {
    jogoAtivo = false; somVitoria.play();
    const perc = Math.round((acertos / (acertos + erros || 1)) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <style>
                .res-card { display:flex; flex-direction:column; align-items:center; width:100%; max-width:450px; margin:auto; }
                .res-title { color:var(--primary-blue); font-size:2.2rem; font-weight:900; margin: 15px 0 25px; text-align:center; line-height:1; }
                .res-stats { display:flex; gap:15px; margin-bottom:30px; }
                .res-box { background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .res-num { font-size:1.8rem; font-weight:900; }
                .res-lab { font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase; margin-top:2px; }
                .res-btns { display:flex; flex-direction:column; gap:12px; width:100%; max-width:320px; }
                .btn-final { height:60px; border-radius:30px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.1rem; text-decoration:none; cursor:pointer; border:none; gap:15px; transition: 0.2s; }
                .btn-solid { background:var(--primary-blue); color:white; box-shadow: 0 6px 0 var(--primary-dark); }
                .btn-solid:active { transform:translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }
                .btn-outline { background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); }
                .btn-subtle { background:#e2e8f0; color:#64748b; }
            </style>
            <div class="res-card">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px;">
                <h1 class="res-title">${rank.titulo}</h1>
                <div class="res-stats">
                    <div class="res-box"><span class="res-num" style="color:#7ed321;">${acertos}</span><span class="res-lab">Certos</span></div>
                    <div class="res-box"><span class="res-num" style="color:#ff5e5e;">${erros}</span><span class="res-lab">Errados</span></div>
                    <div class="stat-box res-box"><span class="res-num" style="color:#ff9f43;">${ajudasUtilizadas}</span><span class="res-lab">Ajudas</span></div>
                </div>
                <div class="res-btns">
                    <button class="btn-final btn-solid" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                    <button class="btn-final btn-outline" onclick="openRDMenu(event)"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                    <a href="${JOGO_CONFIG.linkVoltar}" class="btn-final btn-subtle"><i class="fas fa-sign-out-alt"></i> SAIR</a>
                </div>
            </div>
        </div>
    `;
}
