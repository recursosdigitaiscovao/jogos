let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 
let numEsquerda = 0;
let numDireita = 0;
let frutaEsq = "";
let frutaDir = "";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Compara as quantidades e escolhe o sinal correto: Maior, Menor ou Igual!";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div class="tut-wrapper">
            <h2 class="tut-title">COMO JOGAR</h2>
            <div class="tut-row">
               <div class="tut-item">🍎🍎</div>
               <div class="tut-sign">></div>
               <div class="tut-item">🍎</div>
            </div>
            <div class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-wrapper { display: flex; flex-direction: column; align-items: center; gap: 15px; position: relative; }
            .tut-title { color: #2BA886; font-weight: 900; font-size: 1.2rem; margin: 0; }
            .tut-row { display: flex; align-items: center; gap: 10px; background: white; padding: 15px; border-radius: 15px; border: 3px solid #45cfa8; }
            .tut-item { font-size: 1.5rem; }
            .tut-sign { font-size: 2rem; font-weight: 900; color: #ef4444; }
            .tut-hand { position: absolute; font-size: 35px; animation: tapH 2s infinite; bottom: -20px; }
            @keyframes tapH { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
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
    
    numEsquerda = Math.floor(Math.random() * config.maxNum) + 1;
    numDireita = Math.floor(Math.random() * config.maxNum) + 1;

    frutaEsq = config.itens[Math.floor(Math.random() * config.itens.length)];
    frutaDir = config.itens[Math.floor(Math.random() * config.itens.length)];

    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;
    const path = JOGO_CONFIG.caminhoImg + config.pasta;

    container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-between; padding: 10px 5px; box-sizing: border-box; }
            
            .category-label {
                background: #ffffff; color: #0369a1; padding: 8px 25px; border-radius: 20px; 
                font-weight: 900; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px;
                border: 4px solid #0369a1; margin-top: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }

            /* CONTAINER DE COMPARAÇÃO LADO A LADO */
            .comparison-container {
                flex: 1; width: 100%; max-width: 800px;
                display: grid;
                grid-template-columns: 1fr 60px 1fr; /* 3 colunas fixas: Esq, Sinal, Dir */
                align-items: center;
                gap: 5px;
                padding: 10px 0;
            }

            .fruit-zone {
                height: 100%;
                background: rgba(255,255,255,0.4);
                border-radius: 15px;
                border: 2px dashed #45cfa8;
                display: flex;
                flex-wrap: wrap;
                align-content: center;
                justify-content: center;
                gap: 4px;
                padding: 8px;
            }

            .fruit-img {
                /* Tamanho adaptável para caber até 20 */
                width: calc(33% - 6px); 
                max-width: 40px; 
                height: auto;
                aspect-ratio: 1/1;
                object-fit: contain;
                animation: popFruit 0.3s forwards;
            }

            @keyframes popFruit { from { transform: scale(0); } to { transform: scale(1); } }

            .sign-spot {
                font-size: clamp(2rem, 8vw, 3.5rem);
                font-weight: 950;
                color: #0369a1;
                text-align: center;
                background: white;
                height: 60px;
                width: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                border: 3px solid #e2e8f0;
            }

            .options-row { 
                display: flex; justify-content: center; gap: 12px; width: 100%; 
                max-width: 450px; padding-bottom: 20px; 
            }
            
            .opt-btn { 
                flex: 1; background: white; border: 4px solid #cbd5e1; border-radius: 18px; 
                height: 70px; font-size: 2.2rem; font-weight: 900; cursor: pointer; 
                box-shadow: 0 5px 0 #cbd5e1; color: #1e293b; transition: 0.1s;
                display: flex; align-items: center; justify-content: center;
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #cbd5e1; }
            .opt-btn.correct { background: #dcfce7; border-color: #22c55e; color: #166534; box-shadow: 0 4px 0 #166534; }
            .opt-btn.wrong { background: #fee2e2; border-color: #ef4444; color: #991b1b; box-shadow: 0 4px 0 #991b1b; }

            @media (max-width: 400px) {
                .sign-spot { width: 45px; height: 45px; font-size: 1.8rem; }
                .comparison-container { grid-template-columns: 1fr 45px 1fr; }
                .fruit-img { width: calc(50% - 4px); } /* 2 por linha em ecrãs minúsculos */
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="comparison-container">
                <!-- LADO ESQUERDO -->
                <div class="fruit-zone">
                    ${Array(numEsquerda).fill(0).map((_, i) => `<img src="${path}${frutaEsq}" class="fruit-img" style="animation-delay:${i*0.02}s">`).join('')}
                </div>

                <!-- CENTRO (SINAL) -->
                <div class="sign-spot" id="display-sign">?</div>

                <!-- LADO DIREITO -->
                <div class="fruit-zone">
                    ${Array(numDireita).fill(0).map((_, i) => `<img src="${path}${frutaDir}" class="fruit-img" style="animation-delay:${i*0.02}s">`).join('')}
                </div>
            </div>
            
            <div class="options-row">
                <button class="opt-btn" onclick="validar(this, '<')"><</button>
                <button class="opt-btn" onclick="validar(this, '=')">=</button>
                <button class="opt-btn" onclick="validar(this, '>')">></button>
            </div>
        </div>
    `;
}

function validar(btn, escolha) {
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.style.pointerEvents = 'none');

    let correto = "=";
    if (numEsquerda > numDireita) correto = ">";
    if (numEsquerda < numDireita) correto = "<";

    const displaySign = document.getElementById('display-sign');

    if (escolha === correto) {
        somAcerto.play();
        btn.classList.add('correct');
        displaySign.innerText = correto;
        displaySign.style.color = "#22c55e";
        displaySign.style.borderColor = "#22c55e";
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1200);
    } else {
        somErro.play();
        btn.classList.add('wrong');
        erros++;
        document.getElementById('miss-val').innerText = erros;
        
        // Mostrar o correto no círculo central
        displaySign.innerText = correto;
        displaySign.style.color = "#ef4444";

        btns.forEach(b => { if (b.innerText === correto) b.classList.add('correct'); });
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1600);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:15px;">
            <h2 style="color:#2BA886; font-weight:900; font-size:1.8rem; margin-bottom:15px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4;">
                    <span style="display:block; font-size:26px; font-weight:900; color:#2BA886;">${acertos}/10</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase; font-weight:800;">Acertos</span>
                </div>
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4;">
                    <span style="display:block; font-size:26px; font-weight:900; color:#2BA886;">${tempo}</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase; font-weight:800;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:18px; border-radius:22px; font-weight:900; background:#45cfa8; color:white; border:none; cursor:pointer; box-shadow:0 6px 0 #2BA886; text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:15px; border-radius:22px; font-weight:900; background:white; color:#45cfa8; border:3px solid #45cfa8; cursor:pointer; box-shadow:0 6px 0 #45cfa8; text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:18px; border-radius:22px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
