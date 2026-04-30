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
            @keyframes moveHandTrain { 0%, 100% { transform: translate(30px, 40px); } 50% { transform: translate(5px, 0px) scale(0.8); } }
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
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-around; padding: 10px; box-sizing: border-box; overflow: hidden; }
            
            /* ÁREA DO COMBOIO OCUPA 60% DA ALTURA */
            .train-stage { flex: 0 1 60%; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0; }
            .train-wrapper { display: flex; align-items: flex-end; gap: 1vw; transition: transform 0.8s ease-in-out; transform: translateX(-120vw); max-width: 95%; }
            .train-wrapper.entering { transform: translateX(0); }
            .train-wrapper.leaving { transform: translateX(120vw); }

            .locomotive { width: 10vw; max-width: 100px; height: 12vw; max-height: 120px; background: #ef4444; border-radius: 12px 35% 5px 5px; position: relative; border-bottom: 6px solid #b91c1c; display: flex; align-items: center; justify-content: center; color: white; order: 2; flex-shrink: 0; }
            .locomotive::after { content: ''; position: absolute; top: -15px; left: 20%; width: 15%; height: 20%; background: #475569; border-radius: 2px; }
            
            .carriages { display: flex; gap: 1vw; order: 1; }
            .carriage { width: 9vw; max-width: 80px; height: 10vw; max-height: 100px; background: #3b82f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: clamp(1rem, 4vw, 2.5rem); position: relative; border-bottom: 5px solid #1d4ed8; flex-shrink: 0; }
            .carriage.missing { background: #f8fafc; border-bottom: 5px solid #cbd5e1; color: #3b82f6; border-style: dashed; border-width: 3px; }
            
            .wheel { position: absolute; bottom: -8%; width: 22%; aspect-ratio: 1/1; background: #334155; border-radius: 50%; border: 2px solid #94a3b8; }
            .wheel-l { left: 10%; } .wheel-r { right: 10%; }

            /* OPÇÕES OCUPAM O RESTANTE */
            .options-row { display: flex; justify-content: center; gap: 15px; width: 100%; max-width: 600px; flex-shrink: 0; padding: 10px 0; }
            .opt-btn { background: white; border: 3px solid #cbd5e1; border-radius: 20px; flex: 1; aspect-ratio: 1/1; max-width: 90px; display: flex; align-items: center; justify-content: center; font-size: clamp(1.2rem, 5vw, 2.2rem); font-weight: 900; cursor: pointer; transition: 0.2s; box-shadow: 0 5px 0 #ddd; color: #334155; }
            .opt-btn:active { transform: translateY(2px); box-shadow: none; }
            .correct-btn { background: #e8f9e8 !important; border-color: #7ed321 !important; color: #2e7d32 !important; }
            .wrong-btn { background: #fff1f1 !important; border-color: #ff5e5e !important; color: #b91c1c !important; }

            @media (orientation: landscape) and (max-height: 500px) {
                .train-stage { flex: 0 1 50%; }
                .locomotive { width: 80px; height: 90px; }
                .carriage { width: 65px; height: 75px; }
                .opt-btn { max-width: 60px; border-radius: 12px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="train-stage">
                <div id="train" class="train-wrapper">
                    <div class="locomotive"><i class="fas fa-smile" style="font-size: 3vw;"></i></div>
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
                ${choices.map(val => `<button class="opt-btn" onclick="verificar(this, ${val})">${val}</button>`).join('')}
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
        const target = document.getElementById('target-c');
        target.innerText = correctAnswer;
        target.classList.remove('missing');
        target.style.background = "#10b981";
        target.innerHTML += '<div class="wheel wheel-l"></div><div class="wheel wheel-r"></div>';
        setTimeout(() => {
            train.classList.remove('entering'); train.classList.add('leaving');
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
        }, 1000);
    } else {
        erros++; somErro.play();
        btn.classList.add('wrong-btn');
        document.getElementById('miss-val').innerText = erros;
        document.querySelectorAll('.opt-btn').forEach(b => { if(parseInt(b.innerText) === correctAnswer) b.classList.add('correct-btn'); });
        setTimeout(() => {
            train.style.transform = "translateX(-10px)";
            setTimeout(() => { train.style.transform = "translateX(0)"; indicePergunta++; proximaRonda(); }, 200);
        }, 1500);
    }
}

// === 3. FINALIZAÇÃO E RESULTADOS ===
function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const totalP = 10;
    const perc = (acertos / totalP) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <style>
            .res-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; }
            .res-stats { display: flex; gap: 12px; width: 100%; max-width: 320px; margin: 15px 0; }
            .res-card { background: white; border-radius: 18px; padding: 12px; flex: 1; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; }
            .res-val { display: block; font-size: 24px; font-weight: 900; color: var(--primary-blue); line-height: 1.1; }
            .res-lab { font-size: 10px; font-weight: 800; color: #88a; text-transform: uppercase; letter-spacing: 0.5px; }
            .res-btns { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px; }
            .btn-f { padding: 16px; border-radius: 20px; font-weight: 900; font-size: 16px; cursor: pointer; border: none; text-align: center; text-decoration: none; text-transform: uppercase; transition: 0.2s; }
            .btn-f-primary { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-f-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); box-shadow: 0 6px 0 var(--primary-blue); padding: 13px; }
            .btn-f-muted { background: #dce4ee; color: #5d7082; box-shadow: 0 6px 0 #b8c5d4; }
            .btn-f:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }
        </style>
        <div class="res-container">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:25%; min-height:90px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color: var(--primary-blue); font-weight:900; font-size:1.8rem; margin-bottom:5px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats">
                <div class="res-card"><span class="res-val">${acertos} / ${totalP}</span><span class="res-lab">Acertos</span></div>
                <div class="res-card"><span class="res-val">${tempoFinal}</span><span class="res-lab">Tempo</span></div>
            </div>
            <div class="res-btns">
                <button class="btn-f btn-f-primary" onclick="location.reload()">Jogar de Novo</button>
                <button class="btn-f btn-f-outline" onclick="openRDMenu()">Outro Tema / Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-f btn-f-muted">Sair do Jogo</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
