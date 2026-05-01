let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "facil";
let currentSequence = [];
let missingIndex = 0;
let correctAnswer = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "facil";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Qual é o número que falta? Escolhe a carruagem certa!";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;

    container.innerHTML = `
        <div class="tut-wrapper">
            <div class="tut-train">
                <div class="tut-carr">1 <div class="tut-w"></div><div class="tut-w tut-wr"></div></div>
                <div class="tut-conn"></div>
                <div class="tut-carr tut-empty">? <div class="tut-w"></div><div class="tut-w tut-wr"></div></div>
                <div class="tut-conn"></div>
                <div class="tut-loco">
                    <div class="tut-win"></div>
                    <div class="tut-chim"></div>
                    <div class="tut-w"></div><div class="tut-w tut-wr"></div>
                </div>
            </div>
            <div class="tut-rail"></div>
            
            <div class="tut-options">
                <div class="tut-btn">0</div>
                <div class="tut-btn tut-target">2</div>
                <div class="tut-btn">5</div>
            </div>

            <div class="tut-hand">☝️</div>
        </div>

        <style>
            .tut-wrapper { 
                position: relative; width: 100%; max-width: 280px; 
                display: flex; flex-direction: column; align-items: center; 
                padding: 10px; box-sizing: border-box;
            }
            .tut-train { display: flex; align-items: flex-end; margin-bottom: -2px; z-index: 2; }
            .tut-carr { 
                width: 40px; height: 40px; background: #3b82f6; border-radius: 4px; 
                color: white; font-weight: 900; font-size: 14px; 
                display: flex; align-items: center; justify-content: center; position: relative;
            }
            .tut-empty { background: #fff; border: 2px dashed #3b82f6; color: #3b82f6; }
            .tut-loco { 
                width: 50px; height: 50px; background: #ef4444; border-radius: 4px 15px 2px 2px; 
                position: relative; 
            }
            .tut-win { position: absolute; top: 8px; right: 6px; width: 15px; height: 15px; background: #bae6fd; border: 2px solid #334155; border-radius: 2px; }
            .tut-chim { position: absolute; top: -10px; right: 10px; width: 8px; height: 12px; background: #334155; }
            .tut-conn { width: 8px; height: 4px; background: #475569; margin-bottom: 10px; }
            .tut-w { position: absolute; bottom: -6px; left: 4px; width: 10px; height: 10px; background: #334155; border-radius: 50%; border: 1px solid #fff; }
            .tut-wr { left: auto; right: 4px; }
            
            .tut-rail { width: 100%; height: 3px; background: #94a3b8; border-radius: 2px; margin-bottom: 15px; }

            .tut-options { display: flex; gap: 8px; }
            .tut-btn { width: 35px; height: 35px; background: white; border: 2px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; }
            
            .tut-hand { 
                position: absolute; font-size: 35px; z-index: 10;
                animation: tutClick 3s infinite ease-in-out;
            }

            @keyframes tutClick {
                0% { transform: translate(20px, 80px); opacity: 0; }
                20% { transform: translate(20px, 60px); opacity: 1; } /* Sobe para a opção */
                40% { transform: translate(20px, 60px) scale(0.8); } /* Clica */
                60% { transform: translate(-30px, 20px); } /* Move para a lacuna */
                80% { transform: translate(-30px, 20px) scale(0.8); opacity: 1; } /* Clica na lacuna */
                100% { transform: translate(-30px, 10px); opacity: 0; }
            }

            /* Ajuste para ecrãs muito pequenos */
            @media (max-width: 350px) {
                .tut-wrapper { transform: scale(0.85); }
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
    proximaRonda();
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

function proximaRonda() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    const config = JOGO_CATEGORIAS[categoriaAtual];
    let start = Math.floor(Math.random() * (config.maxNum - (config.carruagens * config.passo))) + 1;
    currentSequence = Array.from({length: config.carruagens}, (_, i) => start + (i * config.passo));
    missingIndex = Math.floor(Math.random() * config.carruagens);
    correctAnswer = currentSequence[missingIndex];
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    let choices = [correctAnswer];
    while(choices.length < 4) {
        let w = correctAnswer + (Math.floor(Math.random() * 10) - 5);
        if(w >= 0 && !choices.includes(w)) choices.push(w);
    }
    choices.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-around; overflow:hidden; }
            .train-stage { flex:1; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; }
            .track-container { position: absolute; width: 100%; height: 20px; top: 60%; display: flex; align-items: center; justify-content: center; }
            .rail-line { width: 100%; height: 6px; background: #475569; position: relative; box-shadow: 0 4px 0 rgba(0,0,0,0.1); }
            .rail-line::before { content: ''; position: absolute; width: 100%; height: 10px; top: 6px; background-image: linear-gradient(90deg, #78350f 20%, transparent 20%); background-size: 40px 100%; }

            .train-unit { 
                display:flex; align-items:flex-end; position: relative; z-index: 10;
                transition: transform 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95);
                transform: translateX(-150%); margin-bottom: -4px; 
            }
            .train-unit.entering { transform: translateX(0); animation: trainShake 0.4s infinite; }
            .train-unit.leaving { transform: translateX(150%); animation: trainShake 0.2s infinite; }

            @keyframes trainShake { 0%, 100% { margin-top: 0; } 50% { margin-top: -3px; } }

            .loco-main { 
                width: 95px; height: 100px; background: #ef4444; border-radius: 5px 40px 5px 5px; 
                position: relative; border-bottom: 6px solid #b91c1c; flex-shrink: 0;
            }
            .loco-cab { position: absolute; top: 15px; left: 12px; width: 38px; height: 35px; background: #bae6fd; border: 3px solid #334155; border-radius: 4px; }
            .loco-chimney { position: absolute; top: -20px; right: 18px; width: 20px; height: 25px; background: #334155; border-radius: 3px; }
            
            .smoke { position: absolute; top: -35px; right: 22px; width: 15px; height: 15px; background: rgba(200, 200, 200, 0.8); border-radius: 50%; opacity: 0; animation: smokeMove 1.2s infinite; }
            @keyframes smokeMove { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-50px) translateX(-20px) scale(2.5); opacity: 0; } }

            .carr-item { 
                width: 80px; height: 80px; background: #3b82f6; border-radius: 8px; 
                display:flex; align-items:center; justify-content:center; color:white; 
                font-weight:900; font-size: 1.8rem; position:relative; border-bottom: 6px solid #1d4ed8; flex-shrink: 0;
            }
            .carr-item.missing { background: #ffffff; border: 3px dashed #3b82f6; color: #3b82f6; border-bottom: 6px dashed #3b82f6; }
            .connector { width: 12px; height: 8px; background: #334155; margin-bottom: 18px; flex-shrink: 0; }
            .wheel { position: absolute; bottom: -12px; width: 22px; height: 22px; background: #1e293b; border-radius: 50%; border: 3px solid #94a3b8; }
            .wheel-l { left: 10px; } .wheel-r { right: 10px; }

            .options-row { display: flex; justify-content: center; gap: 15px; width: 100%; padding: 30px 10px; }
            .opt-btn { 
                width: 80px; height: 80px; background: white; border: 3px solid #cbd5e1; border-radius: 20px; 
                font-size: 2rem; font-weight: 900; cursor: pointer; box-shadow: 0 6px 0 #cbd5e1; color: #334155; 
            }
            .opt-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 #cbd5e1; }

            @media (max-width: 600px) {
                .loco-main { width: 70px; height: 75px; }
                .carr-item { width: 55px; height: 55px; font-size: 1.4rem; }
                .opt-btn { width: 65px; height: 65px; font-size: 1.5rem; }
            }
        </style>

        <div class="game-wrapper">
            <div class="train-stage">
                <div class="track-container"><div class="rail-line"></div></div>
                <div id="train-unit" class="train-unit">
                    ${currentSequence.map((num, i) => `
                        <div class="carr-item ${i === missingIndex ? 'missing' : ''}" id="${i === missingIndex ? 'target-c' : ''}">
                            ${i === missingIndex ? '?' : num}
                            <div class="wheel wheel-l"></div><div class="wheel wheel-r"></div>
                        </div>
                        <div class="connector"></div>
                    `).join('')}
                    <div class="loco-main">
                        <div class="smoke"></div><div class="smoke" style="animation-delay: 0.4s"></div>
                        <div class="loco-chimney"></div><div class="loco-cab"></div>
                        <div class="wheel wheel-l"></div><div class="wheel wheel-r"></div>
                    </div>
                </div>
            </div>
            <div class="options-row">
                ${choices.map(val => `<button class="opt-btn" onclick="verificar(this, ${val})">${val}</button>`).join('')}
            </div>
        </div>
    `;
    setTimeout(() => document.getElementById('train-unit').classList.add('entering'), 100);
}

function verificar(btn, val) {
    document.querySelectorAll('.opt-btn').forEach(b => b.style.pointerEvents = 'none');
    const train = document.getElementById('train-unit');
    const target = document.getElementById('target-c');

    if (val === correctAnswer) {
        acertos++; somAcerto.play();
        btn.style.background = "#dcfce7"; btn.style.borderColor = "#22c55e";
        document.getElementById('hits-val').innerText = acertos;
        target.innerText = correctAnswer; target.classList.remove('missing');
        target.style.background = "#10b981"; target.style.color = "white";
        setTimeout(() => {
            train.classList.remove('entering'); train.classList.add('leaving');
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
        }, 1200);
    } else {
        erros++; somErro.play();
        btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444";
        document.getElementById('miss-val').innerText = erros;
        setTimeout(() => { train.classList.add('leaving'); setTimeout(() => { indicePergunta++; proximaRonda(); }, 800); }, 1000);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:20px; text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:20px;">
            <h2 style="color:var(--primary-blue); font-size:1.8rem; font-weight:900;">${rel.titulo}</h2>
            <div style="background:white; padding:15px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.1); margin: 20px 0;">
                <div style="font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos}/10</div>
                <div style="font-size:12px; color:#88a;">Acertos</div>
            </div>
            <button onclick="location.reload()" style="background:var(--primary-blue); color:white; border:none; padding:15px 40px; border-radius:50px; font-weight:900; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);">JOGAR DE NOVO</button>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
