let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 
let numEsquerda = 0;
let numDireita = 0;
let animalSorteado = "";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() { return "Qual lado tem mais animais? Escolhe o sinal correto!"; };
window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const pathTut = JOGO_CONFIG.caminhoImg + "animaisdomesticos/cao.png";
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
            <h2 style="color:#15803d; font-weight:900; margin:0;">COMO JOGAR</h2>
            <div style="display:flex; align-items:center; gap:15px; background:white; padding:20px; border-radius:20px; border:4px solid #22c55e;">
               <img src="${pathTut}" style="width:40px;">
               <b style="font-size:2rem; color:#ef4444; margin:0 10px;">></b> 
               <img src="${pathTut}" style="width:25px; opacity:0.5;">
            </div>
            <div style="font-size:40px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px); } } </style>
    `;
}

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
    animalSorteado = config.itens[Math.floor(Math.random() * config.itens.length)];
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;
    
    const pathAnimais = JOGO_CONFIG.caminhoImg + config.pasta;
    const pathNuvem = JOGO_CONFIG.caminhoImg + "nuvem.png";

    // LÓGICA DE DIMENSIONAMENTO PARA NÃO SAIR DO QUADRADO
    const isPortrait = window.innerHeight > window.innerWidth;
    const cols = isPortrait ? 2 : 5;
    
    // Calculamos o número de linhas necessárias para o grupo maior
    const rowsNeeded = Math.ceil(Math.max(numEsquerda, numDireita) / cols);

    container.innerHTML = `
        <style>
            .game-wrapper { 
                display: flex; flex-direction: column; width: 100%; height: 100%; 
                align-items: center; justify-content: space-between; 
                padding: 10px; box-sizing: border-box;
                background: linear-gradient(to bottom, #87CEEB 0%, #E0F2F1 100%);
                position: relative; overflow: hidden; border-radius: 20px;
            }
            .cloud-anim { position: absolute; opacity: 0.6; pointer-events: none; z-index: 1; animation: moveClouds 40s linear infinite; width: 120px; }
            @keyframes moveClouds { from { left: -150px; } to { left: 110%; } }
            .farm-grass { position: absolute; bottom: 0; left: 0; width: 100%; height: 50px; background: #4ade80; border-radius: 50% 50% 0 0 / 15px 15px 0 0; z-index: 2; }

            .comparison-container {
                flex: 1; width: 100%; max-width: 1200px;
                display: flex; align-items: stretch; justify-content: center;
                gap: 10px; z-index: 5; margin-bottom: 5px; min-height: 0;
            }

            .animal-box {
                flex: 1; height: 100%; background: rgba(255, 255, 255, 0.5);
                border: 3px solid white; border-radius: 20px;
                display: grid;
                /* Grelha Dinâmica */
                grid-template-columns: repeat(${cols}, 1fr);
                grid-template-rows: repeat(${rowsNeeded}, 1fr);
                gap: 4px; padding: 10px;
                backdrop-filter: blur(4px); box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
                min-width: 0; overflow: hidden;
            }

            .animal-img {
                width: 100%; height: 100%; object-fit: contain;
                animation: popIn 0.4s forwards;
            }
            @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }

            .sign-slot {
                width: clamp(45px, 8vw, 80px); height: clamp(45px, 8vw, 80px);
                background: white; border: 3px dashed #15803d; border-radius: 15px;
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.8rem, 6vw, 3.5rem); font-weight: 950; color: #15803d;
                box-shadow: 0 8px 20px rgba(0,0,0,0.15); flex-shrink: 0; align-self: center; z-index: 10;
            }

            .buttons-row { 
                display: flex; justify-content: center; gap: 15px; 
                width: 100%; max-width: 500px; padding: 5px 0 10px; 
                z-index: 20; flex-shrink: 0;
            }
            .btn-symbol { 
                flex: 1; background: white; border: 4px solid #e2e8f0; border-radius: 18px; 
                height: 65px; font-size: 2.2rem; font-weight: 900; cursor: pointer; 
                box-shadow: 0 5px 0 #cbd5e1; color: #15803d; display: flex; align-items: center; justify-content: center;
            }
            .btn-symbol:active { transform: translateY(3px); box-shadow: none; }
            .btn-symbol.correct { background: #dcfce7; border-color: #22c55e; color: #166534; box-shadow: 0 4px 0 #166534; }
            .btn-symbol.wrong { background: #fee2e2; border-color: #ef4444; color: #991b1b; box-shadow: 0 4px 0 #991b1b; }

            @media (max-width: 600px) {
                .animal-box { padding: 6px; gap: 2px; }
                .sign-slot { width: 45px; height: 45px; font-size: 1.8rem; }
                .btn-symbol { height: 60px; font-size: 2rem; }
            }
        </style>

        <div class="game-wrapper">
            <img src="${pathNuvem}" class="cloud-anim" style="top:5%; animation-delay: 0s;">
            <img src="${pathNuvem}" class="cloud-anim" style="top:15%; animation-delay: -15s; width:80px;">
            <div class="farm-grass"></div>

            <div class="comparison-container">
                <div class="animal-box">
                    ${Array(numEsquerda).fill(0).map(() => `<img src="${pathAnimais}${animalSorteado}" class="animal-img">`).join('')}
                </div>
                <div class="sign-slot" id="main-slot">?</div>
                <div class="animal-box">
                    ${Array(numDireita).fill(0).map(() => `<img src="${pathAnimais}${animalSorteado}" class="animal-img">`).join('')}
                </div>
            </div>
            
            <div class="buttons-row">
                <button class="btn-symbol" onclick="verificarComparacao(this, '<')"><</button>
                <button class="btn-symbol" onclick="verificarComparacao(this, '=')">=</button>
                <button class="btn-symbol" onclick="verificarComparacao(this, '>')">></button>
            </div>
        </div>
    `;
}

function verificarComparacao(btn, escolha) {
    const btns = document.querySelectorAll('.btn-symbol');
    btns.forEach(b => b.style.pointerEvents = 'none');
    let correto = "=";
    if (numEsquerda > numDireita) correto = ">";
    if (numEsquerda < numDireita) correto = "<";
    const slot = document.getElementById('main-slot');

    if (escolha === correto) {
        somAcerto.play();
        btn.classList.add('correct');
        slot.innerText = correto; slot.style.color = "white"; slot.style.background = "#22c55e"; slot.style.borderStyle = "solid";
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1400);
    } else {
        somErro.play();
        btn.classList.add('wrong');
        erros++;
        document.getElementById('miss-val').innerText = erros;
        slot.innerText = correto; slot.style.color = "#ef4444"; slot.style.background = "#fee2e2";
        btns.forEach(b => { if (b.innerText === correto) b.classList.add('correct'); });
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1800);
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
            <h2 style="color:#15803d; font-weight:900; font-size:1.8rem; margin-bottom:15px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4;">
                    <span style="display:block; font-size:26px; font-weight:900; color:#15803d;">${acertos}/10</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase; font-weight:800;">Acertos</span>
                </div>
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4;">
                    <span style="display:block; font-size:26px; font-weight:900; color:#15803d;">${tempo}</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase; font-weight:800;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:18px; border-radius:22px; font-weight:900; background:#22c55e; color:white; border:none; cursor:pointer; box-shadow:0 6px 0 #15803d; text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:15px; border-radius:22px; font-weight:900; background:white; color:#22c55e; border:3px solid #22c55e; cursor:pointer; box-shadow:0 6px 0 #22c55e; text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:18px; border-radius:22px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
