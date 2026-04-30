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
    return "Qual é o número que falta na carruagem? Escolhe a resposta certa para o comboio seguir viagem!";
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
                <div class="tut-carr">3</div>
            </div>
            <div class="tut-opts">
                <div class="tut-opt">4</div>
                <div class="tut-opt tut-active">2</div>
                <div class="tut-opt">0</div>
            </div>
            <div id="tut-hand" class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-train-box { display: flex; flex-direction: column; align-items: center; gap: 15px; background: white; padding: 15px; border-radius: 20px; border: 2px solid #eee; position: relative; }
            .tut-train-row { display: flex; gap: 5px; align-items: flex-end; }
            .tut-loco { font-size: 35px; }
            .tut-carr { width: 30px; height: 35px; background: #3b82f6; border-radius: 5px; color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; }
            .tut-empty { background: #f8fafc; border: 2px dashed #cbd5e1; color: #3b82f6; }
            .tut-opts { display: flex; gap: 8px; }
            .tut-opt { width: 35px; height: 35px; border: 2px solid #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; color: #555; }
            .tut-active { border-color: var(--primary-blue); color: var(--primary-blue); }
            .tut-hand { position: absolute; font-size: 40px; animation: moveHandTrain 3s infinite; z-index: 10; }
            @keyframes moveHandTrain {
                0%, 100% { transform: translate(30px, 40px); }
                50% { transform: translate(5px, 0px) scale(0.8); }
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

    // Gerar opções de resposta (1 correta + 3 erradas próximas)
    let choices = [correctAnswer];
    while(choices.length < 4) {
        let w = correctAnswer + (Math.floor(Math.random() * 5) - 2);
        if(w >= 0 && !choices.includes(w)) choices.push(w);
    }
    choices.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-around; padding: 10px; box-sizing: border-box; overflow: hidden; }
            
            /* ÁREA DO COMBOIO */
            .train-stage { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0; }
            .train-wrapper { display: flex; align-items: flex-end; gap: 8px; transition: transform 0.8s cubic-bezier(0.45, 0, 0.55, 1); transform: translateX(-120vw); }
            .train-wrapper.entering { transform: translateX(0); }
            .train-wrapper.leaving { transform: translateX(120vw); }

            .locomotive { width: 80px; height: 100px; background: #ef4444; border-radius: 12px 30px 5px 5px; position: relative; border-bottom: 6px solid #b91c1c; display: flex; align-items: center; justify-content: center; color: white; order: 2; flex-shrink: 0; }
            .locomotive::after { content: ''; position: absolute; top: -15px; left: 20px; width: 12px; height: 20px; background: #475569; border-radius: 2px; }
            
            .carriages { display: flex; gap: 8px; order: 1; }
            .carriage { width: 70px; height: 80px; background: #3b82f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 1.8rem; position: relative; border-bottom: 5px solid #1d4ed8; flex-shrink: 0; }
            .carriage.missing { background: #f8fafc; border-bottom: 5px solid #cbd5e1; color: #3b82f6; border-style: dashed; border-width: 3px; }
            
            .wheel { position: absolute; bottom: -10px; width: 18px; height: 18px; background: #334155; border-radius: 50%; border: 2px solid #94a3b8; }
            .wheel-l { left: 6px; } .wheel-r { right: 6px; }

            /* OPÇÕES */
            .options-row { display: flex; justify-content: center; gap: 15px; width: 100%; max-width: 600px; padding: 15px 0; flex-shrink: 0; }
            .opt-btn { background: white; border: 3px solid #cbd5e1; border-radius: 20px; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; cursor: pointer; transition: 0.2s; box-shadow: 0 5px 0 #ddd; color: #334155; }
            .opt-btn:active { transform: translateY(2px); box-shadow: none; }
            .correct-btn { background: #e8f9e8 !important; border-color: #7ed321 !important; color: #2e7d32 !important; }
            .wrong-btn { background: #fff1f1 !important; border-color: #ff5e5e !important; color: #b91c1c !important; }

            @media (max-width: 600px) {
                .train-wrapper { transform: scale(0.8) translateX(-150vw); }
                .opt-btn { width: 65px; height: 65px; font-size: 1.5rem; }
            }
        </style>

        <div class="game-wrapper">
            <div class="train-stage">
                <div id="train" class="train-wrapper">
                    <div class="locomotive"><i class="fas fa-smile" style="font-size: 30px;"></i></div>
                    <div class="carriages">
                        ${currentSequence.map((num, i) => `
                            <div class="carriage ${i === missingIndex ? 'missing' : ''}" id="${i === missingIndex ? 'target-c' : ''}">
                                ${i === missingIndex ? '?' : num}
                                <div class="wheel wheel-l"></div><div class="wheel wheel-r"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="options-row">
                ${choices.map(val => `
                    <button class="opt-btn" onclick="verificar(this, ${val})">${val}</button>
                `).join('')}
            </div>
        </div>
    `;

    setTimeout(() => document.getElementById('train').classList.add('entering'), 50);
}

function verificar(btn, val) {
    document.querySelectorAll('.opt-btn').forEach(b => b.style.pointerEvents = 'none');
    const train = document.getElementById('train');

    if (val === correctAnswer) {
        acertos++; somAcerto.play();
        btn.classList.add('correct-btn');
        document.getElementById('hits-val').innerText = acertos;
        
        // Revelar número na carruagem
        const target = document.getElementById('target-c');
        target.innerText = correctAnswer;
        target.classList.remove('missing');
        target.style.background = "#10b981";
        target.innerHTML += '<div class="wheel wheel-l"></div><div class="wheel wheel-r"></div>';

        setTimeout(() => {
            train.classList.remove('entering');
            train.classList.add('leaving');
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
        }, 1000);
    } else {
        erros++; somErro.play();
        btn.classList.add('wrong-btn');
        document.getElementById('miss-val').innerText = erros;
        
        // Mostrar a correta
        document.querySelectorAll('.opt-btn').forEach(b => {
            if(parseInt(b.innerText) === correctAnswer) b.classList.add('correct-btn');
        });

        setTimeout(() => {
            train.style.transform = "translateX(-10px)";
            setTimeout(() => {
                train.style.transform = "translateX(0)";
                indicePergunta++; proximaRonda();
            }, 200);
        }, 1500);
    }
}

// === 3. FINALIZAÇÃO E RESULTADOS ===
function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:10px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:22%; min-height:80px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            
            <div class="res-stats" style="display:flex; gap:10px; width:100%; max-width:320px; margin-bottom:20px;">
                <div style="background:white; border-radius:15px; padding:12px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:15px; padding:12px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;">
                <button class="res-btn res-btn-p" style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button class="res-btn res-btn-o" style="padding:13px; border-radius:20px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="res-btn res-btn-m" style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Escolher outro jogo</a>
            </div>
        </div>
    `;

    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
