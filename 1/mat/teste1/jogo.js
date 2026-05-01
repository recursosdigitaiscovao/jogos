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
    const imgC = JOGO_CONFIG.caminhoImg + "comboio_seq.png";
    const imgCarr = JOGO_CONFIG.caminhoImg + "carruagem_seq.png";

    container.innerHTML = `
        <div class="tut-wrapper">
            <div class="tut-train">
                <div class="tut-img-box"><img src="${imgCarr}"><span>1</span></div>
                <div class="tut-img-box tut-empty"><img src="${imgCarr}"><span>?</span></div>
                <div class="tut-img-box"><img src="${imgC}"></div>
            </div>
            <div class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; padding: 20px; }
            .tut-train { display: flex; align-items: center; gap: 4px; }
            .tut-img-box { position: relative; width: 40px; }
            .tut-img-box img { width: 100%; height: auto; display: block; }
            .tut-img-box span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 900; color: #0369a1; font-size: 14px; background: white; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
            .tut-hand { position: absolute; font-size: 30px; animation: tutClick 3s infinite ease-in-out; bottom: -10px; }
            @keyframes tutClick { 0%, 100% { transform: translate(20px, 20px); opacity: 0; } 20% { opacity: 1; transform: translate(20px, 0px); } 50% { transform: translate(-20px, -30px); } }
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
    const numCarr = 4; 
    let start = Math.floor(Math.random() * (config.maxNum - (numCarr * config.passo))) + 1;
    currentSequence = Array.from({length: numCarr}, (_, i) => start + (i * config.passo));
    missingIndex = Math.floor(Math.random() * numCarr);
    correctAnswer = currentSequence[missingIndex];
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    const imgComboio = JOGO_CONFIG.caminhoImg + "comboio_seq.png";
    const imgCarruagem = JOGO_CONFIG.caminhoImg + "carruagem_seq.png";

    let choices = [correctAnswer];
    while(choices.length < 4) {
        let w = correctAnswer + (Math.floor(Math.random() * 10) - 5);
        if(w >= 0 && !choices.includes(w)) choices.push(w);
    }
    choices.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-between; overflow:hidden; padding: 20px 5px; box-sizing: border-box; }
            
            .category-label {
                background: #ffffff; 
                color: #0369a1; 
                padding: 10px 25px; 
                border-radius: 20px; 
                font-weight: 900; 
                font-size: 0.9rem; 
                text-transform: uppercase; 
                letter-spacing: 1.5px;
                border: 4px solid #0369a1; /* Borda cor diferente */
                margin-top: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .train-stage { flex:1; width:100%; display:flex; align-items:center; justify-content:center; }

            .train-unit { 
                display:flex; align-items:center; justify-content:center;
                width: 100%; max-width: 500px; /* Limita largura para não cortar em ecrãs verticais */
                transition: transform 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95);
                transform: translateX(-150%); 
            }
            .train-unit.entering { transform: translateX(0); }
            .train-unit.leaving { transform: translateX(150%); }

            .train-part { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; min-width: 0; }
            
            .img-comboio, .img-carruagem { width: 100%; height: auto; display: block; max-height: 120px; object-fit: contain; }

            /* NÚMERO DESTACADO COM FUNDO */
            .carr-num-badge { 
                position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%);
                background: white; 
                color: #0369a1; 
                width: 45px; height: 45px; 
                display: flex; align-items: center; justify-content: center; 
                border-radius: 50%; 
                font-weight: 900; font-size: 1.8rem;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                border: 3px solid #3b82f6;
                z-index: 5;
            }

            .train-part.missing .carr-num-badge { background: #f1f5f9; color: #3b82f6; border-style: dashed; }

            .connector { width: 4px; height: 4px; background: #475569; flex-shrink: 0; }

            .options-row { display: flex; justify-content: center; gap: 10px; width: 100%; padding-bottom: 20px; }
            .opt-btn { 
                width: 75px; height: 75px; background: white; border: 4px solid #cbd5e1; border-radius: 20px; 
                font-size: 2rem; font-weight: 900; cursor: pointer; box-shadow: 0 6px 0 #cbd5e1; color: #1e293b; 
                flex-shrink: 1; max-width: 20%; aspect-ratio: 1/1;
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #cbd5e1; }

            @media (max-width: 450px) {
                .category-label { font-size: 0.75rem; padding: 6px 15px; }
                .carr-num-badge { width: 32px; height: 32px; font-size: 1.3rem; border-width: 2px; }
                .opt-btn { font-size: 1.5rem; height: 60px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="train-stage">
                <div id="train-unit" class="train-unit">
                    <!-- CARRUAGENS ATRÁS -->
                    ${currentSequence.map((num, i) => `
                        <div class="train-part ${i === missingIndex ? 'missing' : ''}" id="${i === missingIndex ? 'target-c' : ''}">
                            <img src="${imgCarruagem}" class="img-carruagem">
                            <div class="carr-num-badge">${i === missingIndex ? '?' : num}</div>
                        </div>
                        <div class="connector"></div>
                    `).join('')}

                    <!-- LOCOMOTIVA À FRENTE -->
                    <div class="train-part">
                        <img src="${imgComboio}" class="img-comboio">
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
        
        const badge = target.querySelector('.carr-num-badge');
        badge.innerText = correctAnswer;
        badge.style.background = "#10b981";
        badge.style.color = "white";
        badge.style.borderColor = "#065f46";

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
