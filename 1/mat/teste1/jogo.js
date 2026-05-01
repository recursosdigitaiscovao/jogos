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
    return "Qual é o número que falta na carruagem? Escolhe a resposta certa!";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div style="display:flex; align-items:flex-end; gap:2px; position:relative;">
                <div style="width:30px; height:35px; background:#3b82f6; border-radius:4px;"></div>
                <div style="width:10px; height:4px; background:#475569; margin-bottom:10px;"></div>
                <div style="width:40px; height:45px; background:#ef4444; border-radius:5px 15px 2px 2px;"></div>
                <div style="position:absolute; font-size:30px; bottom:-15px; right:-10px; animation: tapH 2s infinite;">☝️</div>
            </div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-10px); } } </style>
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
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-around; overflow:hidden; position:relative; }
            
            /* CENÁRIO / TRILHOS */
            .train-track { 
                width: 90%; height: 10px; background: #64748b; position: absolute; top: 65%; 
                border-radius: 10px; box-shadow: 0 4px 0 #475569;
            }

            .train-stage { flex:1; width:100%; display:flex; align-items:center; justify-content:center; z-index: 10; }

            /* COMBOIO UNIFICADO */
            .train-unit { 
                display:flex; align-items:flex-end; 
                transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                transform: translateX(-150%); 
            }
            .train-unit.entering { transform: translateX(0); }
            .train-unit.leaving { transform: translateX(150%); }

            /* LOCOMOTIVA - CABINE E CORPO */
            .loco-main { 
                width: 90px; height: 95px; background: #ef4444; border-radius: 5px 35px 5px 5px; 
                position: relative; border-bottom: 6px solid #b91c1c; flex-shrink: 0;
            }
            .loco-cab { position: absolute; top: 15px; left: 10px; width: 35px; height: 35px; background: #bae6fd; border: 3px solid #334155; border-radius: 4px; }
            .loco-chimney { position: absolute; top: -20px; right: 15px; width: 18px; height: 25px; background: #334155; border-radius: 3px; }
            .smoke { 
                position: absolute; top: -30px; right: 18px; width: 12px; height: 12px; 
                background: #cbd5e1; border-radius: 50%; opacity: 0; animation: smoke 1.5s infinite; 
            }
            @keyframes smoke { 0% { transform: translateY(0) scale(0.5); opacity:0.8; } 100% { transform: translateY(-40px) scale(2); opacity:0; } }

            /* CARRUAGENS */
            .carr-item { 
                width: 75px; height: 75px; background: #3b82f6; border-radius: 6px; 
                display:flex; align-items:center; justify-content:center; color:white; 
                font-weight:900; font-size: clamp(1.2rem, 3vw, 1.8rem); 
                position:relative; border-bottom: 6px solid #1d4ed8; flex-shrink: 1;
            }
            .carr-item.missing { background: #ffffff; border: 3px dashed #3b82f6; color: #3b82f6; border-bottom: 6px dashed #3b82f6; }

            /* ENGATES / JUNÇÕES */
            .connector { width: 10px; height: 6px; background: #475569; margin-bottom: 15px; flex-shrink: 0; }

            /* RODAS */
            .wheel { position: absolute; bottom: -10px; width: 18px; height: 18px; background: #334155; border-radius: 50%; border: 3px solid #94a3b8; }
            .wheel-l { left: 8px; } .wheel-r { right: 8px; }

            /* OPÇÕES */
            .options-row { display: flex; justify-content: center; gap: 12px; width: 100%; padding: 20px; z-index: 20; }
            .opt-btn { 
                width: 75px; height: 75px; background: white; border: 3px solid #cbd5e1; border-radius: 18px; 
                font-size: 1.8rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #cbd5e1; color: #334155; 
            }
            .opt-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 #cbd5e1; }

            @media (max-width: 500px) {
                .loco-main { width: 70px; height: 75px; }
                .carr-item { width: 55px; height: 55px; }
                .opt-btn { width: 60px; height: 60px; font-size: 1.4rem; }
            }
        </style>

        <div class="game-wrapper">
            <div class="train-track"></div>
            <div class="train-stage">
                <div id="train-unit" class="train-unit">
                    <!-- LISTA DE CARRUAGENS ATRÁS -->
                    ${currentSequence.map((num, i) => `
                        <div class="carr-item ${i === missingIndex ? 'missing' : ''}" id="${i === missingIndex ? 'target-c' : ''}">
                            ${i === missingIndex ? '?' : num}
                            <div class="wheel wheel-l"></div><div class="wheel wheel-r"></div>
                        </div>
                        <div class="connector"></div>
                    `).join('')}

                    <!-- LOCOMOTIVA À FRENTE (DIREITA) -->
                    <div class="loco-main">
                        <div class="smoke"></div>
                        <div class="smoke" style="animation-delay: 0.5s"></div>
                        <div class="loco-chimney"></div>
                        <div class="loco-cab"></div>
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
        
        target.innerText = correctAnswer;
        target.classList.remove('missing');
        target.style.background = "#10b981"; target.style.color = "white";

        setTimeout(() => {
            train.classList.remove('entering'); train.classList.add('leaving');
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
        }, 1200);
    } else {
        erros++; somErro.play();
        btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444";
        document.getElementById('miss-val').innerText = erros;
        setTimeout(() => { 
            train.classList.add('leaving');
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
        }, 1000);
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
            <div style="display:flex; gap:15px; margin:20px 0;">
                <div style="background:white; padding:15px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                    <div style="font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos}/10</div>
                    <div style="font-size:12px; color:#88a;">Acertos</div>
                </div>
            </div>
            <button onclick="location.reload()" style="background:var(--primary-blue); color:white; border:none; padding:15px 40px; border-radius:50px; font-weight:900; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);">JOGAR DE NOVO</button>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
