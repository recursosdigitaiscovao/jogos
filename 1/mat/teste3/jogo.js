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

// === 1. INICIALIZAÇÃO E TUTORIAL ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "facil";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Ajuda os foguetões a descolar! Coloca-os por ordem, do número mais baixo para o mais alto.";
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
            <div class="tut-rocket-demo">5</div>
            <div class="tut-hand-space">☝️</div>
        </div>
        <style>
            .tut-space { position: relative; width: 150px; height: 120px; background: #0f172a; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; border: 2px solid #334155; }
            .tut-pad { width: 50px; height: 50px; border: 2px dashed #475569; border-radius: 10px; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: 900; }
            .tut-rocket-demo { width: 30px; height: 50px; background: #ef4444; border-radius: 50% 50% 5px 5px; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; }
            .tut-hand-space { position: absolute; font-size: 40px; animation: moveHandRocket 3s infinite; }
            @keyframes moveHandRocket {
                0%, 100% { transform: translate(0, 40px); }
                50% { transform: translate(0, -30px) scale(0.8); }
            }
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

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .space-bg { 
                display: flex; flex-direction: column; width: 100%; height: 100%; 
                background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
                align-items: center; justify-content: space-around; padding: 10px; box-sizing: border-box; 
                position: relative; overflow: hidden; border-radius: 25px;
            }
            .stars { position: absolute; inset: 0; pointer-events: none; }
            .star { position: absolute; background: white; border-radius: 50%; opacity: 0.5; animation: twinkle 2s infinite; }
            @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

            /* ZONA DE LANÇAMENTO */
            .pads-container { display: flex; gap: 15px; z-index: 5; height: 35%; align-items: center; }
            .pad {
                width: 75px; height: 100px; border: 2px dashed rgba(255,255,255,0.2); 
                border-radius: 15px; background: rgba(255,255,255,0.03);
                display: flex; align-items: center; justify-content: center; position: relative;
            }
            .pad-label { position: absolute; bottom: -20px; color: #64748b; font-size: 9px; font-weight: 800; text-transform: uppercase; white-space: nowrap; }

            /* FOGUETÕES */
            .pool { display: flex; gap: 20px; z-index: 10; height: 120px; align-items: center; }
            .rocket {
                width: 50px; height: 90px; position: relative; cursor: grab; transition: transform 0.2s;
                touch-action: none; display: flex; flex-direction: column; align-items: center;
            }
            .rocket-body {
                width: 34px; height: 65px; background: linear-gradient(to right, #ef4444, #dc2626);
                border-radius: 50% 50% 10% 10%; display: flex; align-items: center; justify-content: center;
                border: 1px solid rgba(0,0,0,0.2); z-index: 2;
            }
            .rocket-number { color: white; font-weight: 900; font-size: 16px; font-family: 'Fredoka'; z-index: 3; }
            .rocket-nose { width: 34px; height: 15px; background: #1e293b; border-radius: 50% 50% 0 0; margin-bottom: -10px; z-index: 1; }
            .fin { position: absolute; bottom: 20px; width: 15px; height: 30px; background: #1e293b; z-index: 1; }
            .fin-l { left: 0; border-radius: 100% 0 0 0; } .fin-r { right: 0; border-radius: 0 100% 0 0; }
            .fire { 
                position: absolute; top: 80%; width: 15px; height: 30px; 
                background: linear-gradient(to bottom, #fbbf24, transparent); 
                border-radius: 50%; display: none; animation: flicker 0.1s infinite alternate; 
            }
            @keyframes flicker { 0% { height: 20px; } 100% { height: 30px; } }

            .rocket.launching { animation: liftOff 1.5s forwards ease-in; }
            @keyframes liftOff { 100% { transform: translateY(-100vh); opacity: 0; } }
            .rocket.shake { animation: shake 0.4s; }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

            @media (min-width: 800px) {
                .pad { width: 100px; height: 130px; }
                .rocket { width: 70px; height: 110px; }
                .rocket-body { width: 45px; height: 80px; }
                .rocket-number { font-size: 22px; }
            }
        </style>

        <div class="space-bg">
            <div class="stars" id="stars-container"></div>
            
            <div class="pads-container">
                <div class="pad" data-idx="0" ondragover="event.preventDefault()" ondrop="dropRocket(event)"><span class="pad-label">1º Menor</span></div>
                <div class="pad" data-idx="1" ondragover="event.preventDefault()" ondrop="dropRocket(event)"><span class="pad-label">2º</span></div>
                <div class="pad" data-idx="2" ondragover="event.preventDefault()" ondrop="dropRocket(event)"><span class="pad-label">3º</span></div>
                <div class="pad" data-idx="3" ondragover="event.preventDefault()" ondrop="dropRocket(event)"><span class="pad-label">4º Maior</span></div>
            </div>

            <div class="pool" id="rocket-pool">
                ${numerosDaRonda.sort(() => Math.random() - 0.5).map(n => `
                    <div class="rocket" draggable="true" id="r-${n}" data-val="${n}" 
                         ondragstart="dragRocket(event)" 
                         ontouchstart="touchStart(event)" 
                         ontouchmove="touchMove(event)" 
                         ontouchend="touchEnd(event)">
                        <div class="rocket-nose"></div>
                        <div class="rocket-body"><div class="rocket-number">${n}</div></div>
                        <div class="fin fin-l"></div><div class="fin fin-r"></div>
                        <div class="fire"></div>
                    </div>
                `).join('')}
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
        s.style.left = Math.random()*100+'%';
        s.style.top = Math.random()*100+'%';
        s.style.width = s.style.height = Math.random()*3+'px';
        s.style.animationDelay = Math.random()*2+'s';
        sc.appendChild(s);
    }
}

// DRAG & DROP LOGIC
let draggedVal = null;

window.dragRocket = function(e) {
    draggedVal = e.target.closest('.rocket').dataset.val;
    e.dataTransfer.setData("text", draggedVal);
};

window.dropRocket = function(e) {
    e.preventDefault();
    const val = parseInt(draggedVal);
    const padIdx = parseInt(e.currentTarget.dataset.idx);
    validarPosicao(val, padIdx, e.currentTarget);
};

// TOUCH LOGIC
let activeTouchRocket = null;
window.touchStart = function(e) {
    activeTouchRocket = e.currentTarget;
    e.currentTarget.style.zIndex = "1000";
};

window.touchMove = function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    activeTouchRocket.style.position = 'fixed';
    activeTouchRocket.style.left = (touch.clientX - 25) + 'px';
    activeTouchRocket.style.top = (touch.clientY - 45) + 'px';
};

window.touchEnd = function(e) {
    const touch = e.changedTouches[0];
    activeTouchRocket.style.position = 'relative';
    activeTouchRocket.style.left = '0';
    activeTouchRocket.style.top = '0';
    
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const pad = target?.closest('.pad');
    
    if(pad) {
        validarPosicao(parseInt(activeTouchRocket.dataset.val), parseInt(pad.dataset.idx), pad);
    }
    activeTouchRocket = null;
};

function validarPosicao(val, padIdx, padEl) {
    if (val === numerosOrdenados[padIdx]) {
        somAcerto.play();
        padEl.innerHTML = `
            <div class="rocket placed" style="height:80%; pointer-events:none;">
                <div class="rocket-nose"></div>
                <div class="rocket-body" style="background:linear-gradient(to right, #10b981, #059669);"><div class="rocket-number">${val}</div></div>
                <div class="fin fin-l"></div><div class="fin fin-r"></div>
                <div class="fire"></div>
            </div>
        `;
        document.getElementById(`r-${val}`).style.visibility = 'hidden';
        colocadosNaRonda++;
        if(colocadosNaRonda === 4) descolar();
    } else {
        somErro.play();
        const r = document.getElementById(`r-${val}`);
        r.classList.add('shake');
        setTimeout(() => r.classList.remove('shake'), 400);
        erros++;
        document.getElementById('miss-val').innerText = erros;
    }
}

function descolar() {
    acertos++;
    document.getElementById('hits-val').innerText = acertos;
    
    setTimeout(() => {
        const placed = document.querySelectorAll('.placed');
        placed.forEach((r, i) => {
            setTimeout(() => {
                r.querySelector('.fire').style.display = 'block';
                r.classList.add('launching');
            }, i * 200);
        });
        
        setTimeout(() => {
            indicePergunta++;
            proximaMissao();
        }, 2000);
    }, 500);
}

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:10px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-container" style="display:flex; gap:10px; width:100%; max-width:300px; margin-bottom:15px;">
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Missões</span>
                </div>
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:260px;">
                <button class="res-btn res-btn-p" style="padding:14px; border-radius:15px; font-weight:900; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);" onclick="location.reload()">Repetir Missão</button>
                <button class="res-btn res-btn-o" style="padding:11px; border-radius:15px; font-weight:900; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 5px 0 var(--primary-blue);" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:14px; border-radius:15px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 5px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
