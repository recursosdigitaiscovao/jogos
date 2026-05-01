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

// === 1. INICIALIZAÇÃO E TUTORIAL ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "facil";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Qual é o número que falta na carruagem? Escolhe a resposta certa!";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;

    container.innerHTML = `
        <div class="tut-train-box">
            <div class="tut-train-row">
                <div class="tut-loco">🚂</div>
                <div class="tut-carr">1</div>
                <div class="tut-carr tut-empty">?</div>
            </div>
            <div id="tut-hand" class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-train-box { display: flex; flex-direction: column; align-items: center; gap: 15px; background: white; padding: 20px; border-radius: 20px; position: relative; }
            .tut-train-row { display: flex; gap: 5px; align-items: flex-end; }
            .tut-loco { font-size: 40px; transform: scaleX(-1); }
            .tut-carr { width: 35px; height: 40px; background: #3b82f6; border-radius: 5px; color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; }
            .tut-empty { background: #f8fafc; border: 2px dashed #cbd5e1; color: #3b82f6; }
            .tut-hand { position: absolute; font-size: 40px; animation: moveHandTrain 3s infinite; z-index: 10; }
            @keyframes moveHandTrain { 0%, 100% { transform: translate(40px, 20px); } 50% { transform: translate(10px, -10px); } }
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
        let w = correctAnswer + (Math.floor(Math.random() * 5) - 2);
        if(w >= 0 && !choices.includes(w)) choices.push(w);
    }
    choices.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { 
                display: flex; flex-direction: column; 
                width: 100%; height: 100%; 
                align-items: center; justify-content: space-around; 
                padding: 10px; box-sizing: border-box; overflow: hidden; 
            }
            
            .train-stage { 
                flex: 1; width: 100%; 
                display: flex; align-items: center; justify-content: center; 
                padding: 20px 0;
            }

            /* Contentor único para todo o comboio */
            .train-full {
                display: flex; align-items: flex-end;
                transition: transform 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95);
                transform: translateX(-150%);
            }
            .train-full.entering { transform: translateX(0); }
            .train-full.leaving { transform: translateX(150%); }

            /* Estilo da Locomotiva */
            .locomotive {
                width: 100px; height: 110px;
                background: #ef4444;
                border-radius: 10px 40px 5px 5px;
                position: relative;
                border-bottom: 6px solid #b91c1c;
                display: flex; align-items: center; justify-content: center;
                z-index: 2;
            }
            .locomotive::before { /* Chaminé */
                content: ''; position: absolute; top: -15px; left: 60px;
                width: 20px; height: 25px; background: #334155; border-radius: 4px;
            }
            .locomotive-window {
                position: absolute; top: 15px; left: 15px;
                width: 40px; height: 35px; background: #bae6fd;
                border: 3px solid #334155; border-radius: 5px;
            }

            /* Engate entre a locomotiva e as carruagens */
            .coupler {
                width: 15px; height: 8px;
                background: #475569;
                margin-bottom: 20px;
                flex-shrink: 0;
            }

            /* Lista de Carruagens */
            .carriages-list { display: flex; align-items: flex-end; }

            .carriage {
                width: 80px; height: 85px;
                background: #3b82f6; border-radius: 8px;
                display: flex; align-items: center; justify-content: center;
                color: white; font-weight: 900; font-size: 1.8rem;
                position: relative; border-bottom: 6px solid #1d4ed8;
                flex-shrink: 0;
            }
            .carriage.missing { 
                background: #ffffff; border: 3px dashed #3b82f6; 
                color: #3b82f6; border-bottom: 6px dashed #3b82f6; 
            }

            .wheel { position: absolute; bottom: -10px; width: 20px; height: 20px; background: #334155; border-radius: 50%; border: 3px solid #94a3b8; }
            .wheel-l { left: 10px; } .wheel-r { right: 10px; }

            /* Opções de Resposta */
            .options-row { 
                display: flex; justify-content: center; gap: 15px; 
                width: 100%; padding: 20px;
            }
            .opt-btn { 
                background: white; border: 3px solid #cbd5e1; border-radius: 20px; 
                width: 80px; height: 80px;
                display: flex; align-items: center; justify-content: center; 
                font-size: 2rem; font-weight: 900; cursor: pointer; 
                box-shadow: 0 6px 0 #cbd5e1; color: #334155; transition: 0.2s;
            }
            .opt-btn:active { transform: translateY(3px); box-shadow: 0 3px 0 #cbd5e1; }
        </style>

        <div class="game-wrapper">
            <div class="train-stage">
                <div id="train-obj" class="train-full">
                    <!-- LOCOMOTIVA À FRENTE -->
                    <div class="locomotive">
                        <div class="locomotive-window"></div>
                        <div class="wheel wheel-l"></div>
                        <div class="wheel wheel-r"></div>
                    </div>
                    
                    <!-- ENCOSTE / CONEXÃO -->
                    <div class="coupler"></div>

                    <!-- CARRUAGENS -->
                    <div class="carriages-list">
                        ${currentSequence.map((num, i) => `
                            <div class="carriage ${i === missingIndex ? 'missing' : ''}" id="${i === missingIndex ? 'target-c' : ''}">
                                ${i === missingIndex ? '?' : num}
                                <div class="wheel wheel-l"></div>
                                <div class="wheel wheel-r"></div>
                            </div>
                            ${i < currentSequence.length - 1 ? '<div class="coupler"></div>' : ''}
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="options-row">
                ${choices.map(val => `<button class="opt-btn" onclick="verificar(this, ${val})">${val}</button>`).join('')}
            </div>
        </div>
    `;
    // Dispara a entrada do comboio unido
    setTimeout(() => document.getElementById('train-obj').classList.add('entering'), 100);
}

function verificar(btn, val) {
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.style.pointerEvents = 'none');
    
    const train = document.getElementById('train-obj');
    const target = document.getElementById('target-c');

    if (val === correctAnswer) {
        acertos++; somAcerto.play();
        btn.style.background = "#dcfce7"; btn.style.borderColor = "#22c55e"; btn.style.color = "#166534";
        document.getElementById('hits-val').innerText = acertos;
        
        target.innerText = correctAnswer;
        target.classList.remove('missing');
        target.style.background = "#10b981";
        target.style.borderColor = "#047857";

        setTimeout(() => {
            train.classList.remove('entering');
            train.classList.add('leaving');
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
        }, 1200);
    } else {
        erros++; somErro.play();
        btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444"; btn.style.color = "#991b1b";
        document.getElementById('miss-val').innerText = erros;
        
        // Breve pausa para ver o erro e passa
        setTimeout(() => { 
            train.classList.add('leaving');
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
        }, 1000);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:20px; text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:120px; margin-bottom:20px;">
            <h2 style="color:var(--primary-blue); font-size:2rem; font-weight:900;">${rel.titulo}</h2>
            <div style="display:flex; gap:15px; margin:20px 0;">
                <div style="background:white; padding:15px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                    <div style="font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos}/10</div>
                    <div style="font-size:12px; color:#88a;">Acertos</div>
                </div>
                <div style="background:white; padding:15px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                    <div style="font-size:24px; font-weight:900; color:var(--primary-blue);">${tempoFinal}</div>
                    <div style="font-size:12px; color:#88a;">Tempo</div>
                </div>
            </div>
            <button onclick="location.reload()" style="background:var(--primary-blue); color:white; border:none; padding:15px 40px; border-radius:50px; font-weight:900; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);">JOGAR DE NOVO</button>
            <a href="${JOGO_CONFIG.linkVoltar}" style="margin-top:20px; color:#88a; text-decoration:none; font-weight:700;">Sair</a>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
