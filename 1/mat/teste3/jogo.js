let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "facil";
let numerosDaRonda = [];
let numerosOrdenados = [];
let colocadosNaRonda = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "facil";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Ordena os foguetões do menor para o maior para eles levantarem voo!";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div class="tut-space">
            <div class="tut-pad">1º</div>
            <div class="tut-rocket-demo">
                <div class="tut-nose"></div>
                <div class="tut-body">1</div>
            </div>
            <div class="tut-hand-space">☝️</div>
        </div>
        <style>
            .tut-space { position: relative; width: 160px; height: 140px; background: #0f172a; border-radius: 25px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; border: 2px solid #334155; }
            .tut-pad { width: 50px; height: 60px; border: 2px dashed #475569; border-radius: 10px; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: 900; }
            .tut-rocket-demo { position: relative; width: 30px; }
            .tut-nose { width: 30px; height: 15px; background: #ef4444; border-radius: 50% 50% 0 0; }
            .tut-body { width: 30px; height: 35px; background: #cbd5e1; color: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; border-radius: 0 0 5px 5px; }
            .tut-hand-space { position: absolute; font-size: 40px; animation: moveHandRocket 3s infinite; }
            @keyframes moveHandRocket { 0%, 100% { transform: translate(0, 50px); } 50% { transform: translate(0, -30px) scale(0.8); } }
        </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    proximaMissao();
};

function iniciarCronometro() {
    tempoInicio = Date.now();
    clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const min = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const seg = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${min}:${seg}`;
    }, 1000);
}

function proximaMissao() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    const config = JOGO_CATEGORIAS[categoriaAtual];
    numerosDaRonda = [];
    while(numerosDaRonda.length < 4) {
        let n = Math.floor(Math.random() * (config.range[1] - config.range[0] + 1)) + config.range[0];
        if(!numerosDaRonda.includes(n)) numerosDaRonda.push(n);
    }
    numerosOrdenados = [...numerosDaRonda].sort((a,b) => a - b);
    colocadosNaRonda = 0;
    mostrarPergunta();
}

function getRocketHTML(num, isPlaced = false) {
    return `
        <div class="rocket ${isPlaced ? 'placed' : ''}" id="r-${num}" data-val="${num}" 
             onclick="cliqueFoguetao(${num}, this)"
             ${!isPlaced ? 'draggable="true" ondragstart="dragRocket(event)" ontouchstart="touchStart(event)" ontouchmove="touchMove(event)" ontouchend="touchEnd(event)"' : ''}>
            <div class="rocket-nose"></div>
            <div class="rocket-body">
                <div class="rocket-window"></div>
                <div class="rocket-number">${num}</div>
            </div>
            <div class="fin fin-l"></div>
            <div class="fin fin-r"></div>
            <div class="engine-part"></div>
            <div class="fire-glow"></div>
        </div>
    `;
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .space-viewport { 
                display: flex; flex-direction: column; width: 100%; height: 100%; 
                background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
                align-items: center; justify-content: space-around; padding: 10px; box-sizing: border-box; 
                position: relative; overflow: hidden; border-radius: 25px;
            }
            .star { position: absolute; background: white; border-radius: 50%; opacity: 0.5; animation: twinkle 2s infinite; }
            @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

            .pads-row { display: flex; gap: 12px; z-index: 5; height: 35%; align-items: center; width: 100%; justify-content: center; }
            .pad {
                flex: 1; max-width: 90px; height: 120px; border: 2px dashed rgba(255,255,255,0.2); 
                border-radius: 20px; background: rgba(255,255,255,0.03);
                display: flex; align-items: center; justify-content: center; position: relative; transition: 0.3s;
            }
            .pad.active-target { border-color: var(--primary-blue); background: rgba(91, 164, 229, 0.1); }
            .pad-label { position: absolute; bottom: -22px; color: #64748b; font-size: 8px; font-weight: 800; text-transform: uppercase; text-align: center; width: 100%; }

            .rocket-pool { display: flex; gap: 15px; z-index: 10; height: 130px; align-items: center; width: 100%; justify-content: center; }
            
            /* DESIGN DO FOGUETÃO */
            .rocket { width: 60px; height: 110px; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.4)); touch-action: none; transition: transform 0.2s; }
            .rocket-nose { width: 34px; height: 25px; background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); border-radius: 50% 50% 0 0; z-index: 3; border-bottom: 2px solid rgba(0,0,0,0.1); }
            .rocket-body { width: 38px; height: 60px; background: linear-gradient(to right, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%); border-radius: 5px 5px 12px 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; z-index: 2; border: 1px solid rgba(0,0,0,0.1); margin-top: -5px; }
            .rocket-window { width: 18px; height: 18px; background: #38bdf8; border: 2px solid #475569; border-radius: 50%; position: relative; overflow: hidden; box-shadow: inset 1px 1px 3px rgba(0,0,0,0.4); }
            .rocket-window::after { content: ''; position: absolute; top: 2px; left: 2px; width: 6px; height: 3px; background: white; border-radius: 50%; opacity: 0.6; transform: rotate(-30deg); }
            .rocket-number { color: #1e293b; font-weight: 900; font-size: 16px; margin-top: 3px; font-family: 'Fredoka', sans-serif; }
            .fin { position: absolute; bottom: 20px; width: 18px; height: 35px; background: linear-gradient(to bottom, #ef4444, #991b1b); z-index: 1; }
            .fin-l { left: -3px; transform: skewY(-15deg); border-radius: 100% 0 0 20%; }
            .fin-r { right: -3px; transform: skewY(15deg); border-radius: 0 100% 20% 0; }
            .engine-part { width: 22px; height: 6px; background: #334155; border-radius: 0 0 4px 4px; margin-top: -2px; }
            
            /* CHAMA */
            .fire-glow { 
                position: absolute; top: 90px; width: 20px; height: 50px; 
                background: linear-gradient(to bottom, #fbbf24, #f59e0b, transparent); 
                border-radius: 50% 50% 20% 20%; display: none; 
                animation: flicker 0.1s infinite alternate; filter: blur(2px); z-index: 1;
            }

            /* ANIMAÇÕES DE VOO */
            @keyframes flicker { 0% { height: 30px; opacity: 0.7; } 100% { height: 50px; opacity: 1; } }
            
            .rocket.shake-launch { animation: ignite 0.1s infinite; }
            @keyframes ignite { 0% { transform: translate(1px, 1px) rotate(0deg); } 50% { transform: translate(-1px, -1px) rotate(0.5deg); } 100% { transform: translate(1px, -1px) rotate(-0.5deg); } }

            .rocket.fly-away { 
                animation: liftOff 2s forwards cubic-bezier(0.4, 0, 0.2, 1); 
            }
            @keyframes liftOff { 
                0% { transform: translateY(0); }
                100% { transform: translateY(-120vh); } 
            }

            .rocket.error-shake { animation: shake 0.4s; }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }

            @media (min-width: 800px) {
                .pad { max-width: 110px; height: 150px; }
                .rocket { width: 80px; height: 130px; }
                .rocket-body { width: 45px; height: 75px; }
                .rocket-nose { width: 40px; height: 30px; }
                .rocket-number { font-size: 20px; }
                .fire-glow { top: 105px; width: 25px; }
            }
        </style>

        <div class="space-viewport">
            <div id="stars-container"></div>
            <div class="pads-row">
                ${[0,1,2,3].map(i => `
                    <div class="pad ${i === colocadosNaRonda ? 'active-target' : ''}" data-idx="${i}" id="pad-${i}" ondragover="event.preventDefault()" ondrop="dropRocket(event)">
                        <span class="pad-label">${i+1}º Lugar</span>
                    </div>
                `).join('')}
            </div>
            <div class="rocket-pool" id="pool">
                ${numerosDaRonda.sort(() => Math.random() - 0.5).map(n => getRocketHTML(n)).join('')}
            </div>
        </div>
    `;
    generateStars();
}

function generateStars() {
    const sc = document.getElementById('stars-container');
    for(let i=0; i<40; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        s.style.left = Math.random()*100+'%'; s.style.top = Math.random()*100+'%';
        s.style.width = s.style.height = Math.random()*3+'px';
        s.style.animationDelay = Math.random()*2+'s';
        sc.appendChild(s);
    }
}

// === 3. MECÂNICAS DE JOGO ===

window.cliqueFoguetao = function(val, el) {
    if (el.classList.contains('placed')) return;
    validar(val, el);
};

let draggedVal = null;
window.dragRocket = function(e) {
    draggedVal = e.target.closest('.rocket').dataset.val;
};

window.dropRocket = function(e) {
    e.preventDefault();
    const val = parseInt(draggedVal);
    validar(val, document.getElementById(`r-${val}`));
};

// Touch Support
let activeTouch = null;
window.touchStart = function(e) { activeTouch = e.currentTarget; activeTouch.style.zIndex = "1000"; };
window.touchMove = function(e) {
    e.preventDefault(); const t = e.touches[0];
    activeTouch.style.position = 'fixed';
    activeTouch.style.left = (t.clientX - 30) + 'px'; activeTouch.style.top = (t.clientY - 55) + 'px';
};
window.touchEnd = function(e) {
    const t = e.changedTouches[0];
    activeTouch.style.position = 'relative'; activeTouch.style.left = '0'; activeTouch.style.top = '0';
    const target = document.elementFromPoint(t.clientX, t.clientY);
    const pad = target?.closest('.pad');
    if(pad) validar(parseInt(activeTouch.dataset.val), activeTouch);
    activeTouch = null;
};

// === 4. VALIDAÇÃO E LANÇAMENTO (O VOO ESTÁ AQUI) ===

function validar(val, el) {
    if (val === numerosOrdenados[colocadosNaRonda]) {
        somAcerto.play();
        const targetPad = document.getElementById(`pad-${colocadosNaRonda}`);
        targetPad.innerHTML = getRocketHTML(val, true);
        targetPad.classList.remove('active-target');
        el.style.visibility = 'hidden';
        colocadosNaRonda++;
        if(colocadosNaRonda === 4) iniciarLancamento();
        else document.getElementById(`pad-${colocadosNaRonda}`).classList.add('active-target');
    } else {
        somErro.play();
        el.classList.add('error-shake');
        setTimeout(() => el.classList.remove('error-shake'), 400);
        erros++; document.getElementById('miss-val').innerText = erros;
    }
}

function iniciarLancamento() {
    acertos++; document.getElementById('hits-val').innerText = acertos;
    
    // Pequena pausa para a criança ver todos no lugar
    setTimeout(() => {
        const rockets = document.querySelectorAll('.placed');
        
        // FASE 1: Ignição (Ligar motores e tremer)
        rockets.forEach((r, i) => {
            setTimeout(() => {
                r.querySelector('.fire-glow').style.display = 'block';
                r.classList.add('shake-launch');
            }, i * 250);
        });

        // FASE 2: Decolagem (Voar para cima)
        setTimeout(() => {
            rockets.forEach((r, i) => {
                setTimeout(() => {
                    r.classList.remove('shake-launch');
                    r.classList.add('fly-away');
                }, i * 150);
            });

            // FASE 3: Próxima Ronda
            setTimeout(() => {
                indicePergunta++;
                proximaMissao();
            }, 2500);
            
        }, 1500);
    }, 500);
}

// === 5. FINALIZAÇÃO ===
function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:25%; min-height:90px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color: var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-c">
                <div class="res-card-final"><span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span><span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Missões</span></div>
                <div class="res-card-final"><span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span><span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span></div>
            </div>
            <div class="res-btn-g">
                <button class="btn-f btn-f-p" onclick="location.reload()">Jogar de Novo</button>
                <button class="btn-f btn-f-o" onclick="openRDMenu()">Outro Tema / Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-f btn-f-m">Sair do Jogo</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
