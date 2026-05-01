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
                <div class="tut-img-box"><img src="${imgCarr}"><span class="tut-n">10</span></div>
                <div class="tut-img-box tut-empty"><img src="${imgCarr}"><span class="tut-n">?</span></div>
                <div class="tut-img-box"><img src="${imgC}"></div>
            </div>
            <div class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; padding: 20px; }
            .tut-train { display: flex; align-items: center; gap: 2px; }
            .tut-img-box { position: relative; width: 45px; }
            .tut-img-box img { width: 100%; height: auto; display: block; }
            .tut-n { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%); font-weight: 900; color: white; font-size: 14px; text-shadow: 1px 1px 2px #000; }
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
        let w = correctAnswer + (Math.floor(Math.random() * 12) - 6);
        if(w >= 0 && !choices.includes(w)) choices.push(w);
    }
    choices.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-between; overflow:hidden; padding: 15px 5px; box-sizing: border-box; }
            
            .category-label {
                background: #ffffff; 
                color: #0369a1; 
                padding: 8px 20px; 
                border-radius: 15px; 
                font-weight: 900; 
                font-size: 0.85rem; 
                text-transform: uppercase; 
                letter-spacing: 1.2px;
                border: 3px solid #0369a1;
                margin-top: 5px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }

            .train-stage { flex:1; width:100%; display:flex; align-items:center; justify-content:center; }

            .train-unit { 
                display:flex; align-items:center; justify-content:center;
                width: 100%; max-width: 600px; 
                transition: transform 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95);
                transform: translateX(-150%); 
            }
            .train-unit.entering { transform: translateX(0); }
            .train-unit.leaving { transform: translateX(150%); }

            .train-part { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; min-width: 0; }
            
            .img-comboio, .img-carruagem { width: 100%; height: auto; display: block; max-height: 140px; object-fit: contain; }

            /* NÚMERO DIRETO NA CARRUAGEM SEM CÍRCULO */
            .carr-num { 
                position: absolute; top: 46%; left: 50%; transform: translate(-50%, -50%);
                color: white; 
                font-weight: 900; 
                /* Font-size responsivo para caber 3 dígitos */
                font-size: clamp(1.2rem, 5vw, 2.4rem); 
                /* Sombra para garantir leitura em qualquer fundo */
                text-shadow: 2px 2px 0px #0369a1, -1px -1px 0px #0369a1, 1px -1px 0px #0369a1, -1px 1px 0px #0369a1, 0px 4px 8px rgba(0,0,0,0.4);
                z-index: 5;
                white-space: nowrap;
            }

            .train-part.missing .carr-num { color: #facc15; text-shadow: 2px 2px 0px #000; }
            .train-part.missing img { filter: brightness(0.7); }

            .connector { width: 3px; height: 4px; background: #475569; flex-shrink: 0; }

            .options-row { display: flex; justify-content: center; gap: 10px; width: 100%; padding: 10px 0 20px; }
            .opt-btn { 
                background: white; border: 4px solid #cbd5e1; border-radius: 18px; 
                width: 80px; height: 80px;
                display: flex; align-items: center; justify-content: center; 
                font-size: 2rem; font-weight: 900; cursor: pointer; 
                box-shadow: 0 6px 0 #cbd5e1; color: #1e293b; 
                flex: 1; max-width: 85px; aspect-ratio: 1/1;
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #cbd5e1; }

            /* AJUSTES MOBILE EXTREMO */
            @media (max-width: 480px) {
                .train-unit { max-width: 100%; }
                .carr-num { font-size: 1.4rem; top: 44%; }
                .opt-btn { height: 65px; font-size: 1.6rem; border-radius: 12px; }
                .category-label { font-size: 0.75rem; padding: 6px 15px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="train-stage">
                <div id="train-unit" class="train-unit">
                    <!-- CARRUAGENS PRIMEIRO -->
                    ${currentSequence.map((num, i) => `
                        <div class="train-part ${i === missingIndex ? 'missing' : ''}" id="${i === missingIndex ? 'target-c' : ''}">
                            <img src="${imgCarruagem}" class="img-carruagem">
                            <div class="carr-num">${i === missingIndex ? '?' : num}</div>
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
        
        const numDiv = target.querySelector('.carr-num');
        numDiv.innerText = correctAnswer;
        target.classList.remove('missing');
        target.querySelector('img').style.filter = "none";
        numDiv.style.color = "white";
        numDiv.style.textShadow = "2px 2px 0px #10b981, 0px 4px 8px rgba(0,0,0,0.4)";

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
