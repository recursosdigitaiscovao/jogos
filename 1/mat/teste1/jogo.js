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
            .tut-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; padding: 20px; max-width: 100%; }
            .tut-train { display: flex; align-items: flex-end; gap: 4px; }
            .tut-img-box { position: relative; width: 45px; }
            .tut-img-box img { width: 100%; height: auto; display: block; }
            .tut-img-box span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 900; color: white; font-size: 12px; }
            .tut-empty img { filter: grayscale(1); opacity: 0.5; }
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
    const numCarr = 4; // SEMPRE 4 CARRUAGENS
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
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-between; overflow:hidden; padding: 30px 0; }
            
            .category-label {
                background: #ffffff; color: #1e293b; padding: 12px 35px; border-radius: 40px; 
                font-weight: 900; font-size: 1rem; text-transform: uppercase; letter-spacing: 2px;
                border: 4px solid #3b82f6; box-shadow: 0 8px 20px rgba(0,0,0,0.08); margin-bottom: 25px;
            }

            .train-stage { flex:1; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; }
            
            .track-container { position: absolute; width: 100%; height: 20px; top: 62%; display: flex; align-items: center; justify-content: center; }
            .rail-line { width: 100%; height: 8px; background: #475569; position: relative; border-radius: 4px; }
            .rail-line::before { 
                content: ''; position: absolute; width: 100%; height: 12px; top: 8px; 
                background-image: linear-gradient(90deg, #78350f 15%, transparent 15%); background-size: 50px 100%; 
            }

            .train-unit { 
                display:flex; align-items:flex-end; position: relative; z-index: 10;
                transition: transform 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95);
                transform: translateX(-150%); 
                margin-bottom: -10px; /* AJUSTE PARA AS RODAS TOCAREM NO CARRIL */
            }
            .train-unit.entering { transform: translateX(0); animation: trainShake 0.5s infinite; }
            .train-unit.leaving { transform: translateX(150%); }

            @keyframes trainShake { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

            .train-part { position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
            
            .img-comboio { width: 120px; height: auto; display: block; }
            .img-carruagem { width: 100px; height: auto; display: block; }

            /* POSICIONAMENTO DO NÚMERO EXATAMENTE NO CENTRO */
            .carr-num { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                font-weight: 900; font-size: 2.2rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                pointer-events: none; z-index: 5; line-height: 1;
            }

            .train-part.missing img { filter: grayscale(1) brightness(0.8); opacity: 0.6; }
            .train-part.missing .carr-num { color: #ffffff; text-shadow: 2px 2px 0px #3b82f6; }

            .connector { width: 8px; height: 6px; background: #334155; margin-bottom: 25px; flex-shrink: 0; }

            .options-row { display: flex; justify-content: center; gap: 15px; width: 100%; padding: 20px 10px; }
            .opt-btn { 
                width: 85px; height: 85px; background: white; border: 4px solid #cbd5e1; border-radius: 22px; 
                font-size: 2.2rem; font-weight: 900; cursor: pointer; box-shadow: 0 8px 0 #cbd5e1; color: #1e293b; 
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 4px 0 #cbd5e1; }

            @media (max-width: 600px) {
                .img-comboio { width: 85px; }
                .img-carruagem { width: 70px; }
                .carr-num { font-size: 1.6rem; }
                .opt-btn { width: 65px; height: 65px; font-size: 1.6rem; }
                .train-unit { margin-bottom: -6px; }
                .category-label { font-size: 0.8rem; padding: 8px 20px; margin-bottom: 10px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="train-stage">
                <div class="track-container"><div class="rail-line"></div></div>
                <div id="train-unit" class="train-unit">
                    <!-- CARRUAGENS PRIMEIRO -->
                    ${currentSequence.map((num, i) => `
                        <div class="train-part ${i === missingIndex ? 'missing' : ''}" id="${i === missingIndex ? 'target-c' : ''}">
                            <img src="${imgCarruagem}" class="img-carruagem">
                            <span class="carr-num">${i === missingIndex ? '?' : num}</span>
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
        
        const numSpan = target.querySelector('.carr-num');
        numSpan.innerText = correctAnswer;
        target.classList.remove('missing');
        target.querySelector('img').style.filter = "none";
        target.querySelector('img').style.opacity = "1";
        numSpan.style.color = "white";
        numSpan.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";

        setTimeout(() => {
            train.classList.remove('entering'); train.classList.add('leaving');
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
        }, 1200);
    } else {
        erros++; somErro.play();
        btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444";
        document.getElementById('hits-val').innerText = acertos; // Apenas mantém
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
