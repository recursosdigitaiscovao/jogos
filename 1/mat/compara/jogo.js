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
    return "Compara as quantidades de frutas e escolhe o sinal correto!";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div class="tut-big-wrapper">
            <h2 class="tut-header">COMO JOGAR</h2>
            <div style="display:flex; align-items:center; gap:15px; background:white; padding:20px; border-radius:20px; border:3px solid #45cfa8;">
               <span>🍎</span> <b>></b> <span>🍐</span>
            </div>
            <div class="tut-hand-icon" style="position:relative; top:10px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style>
            .tut-big-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
            .tut-header { color: #2BA886; font-weight: 900; font-size: 1.4rem; background: #e8f9f4; padding: 8px 25px; border-radius: 50px; border: 3px solid #45cfa8; }
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
    
    // Gerar números aleatórios
    numEsquerda = Math.floor(Math.random() * config.maxNum) + 1;
    numDireita = Math.floor(Math.random() * config.maxNum) + 1;

    // Sorteia frutas
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
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: flex-start; padding: 10px; box-sizing: border-box; }
            
            .category-label {
                background: white; color: #2BA886; padding: 8px 25px; border-radius: 40px; 
                font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1.2px;
                border: 4px solid #2BA886; box-shadow: 0 4px 10px rgba(43,168,134,0.15); margin-bottom: 15px;
            }

            .comparison-area {
                flex: 1; width: 100%; display: grid; grid-template-columns: 1fr 80px 1fr; 
                gap: 10px; align-items: center; align-content: center;
            }

            .fruit-box {
                background: rgba(255,255,255,0.6); border-radius: 20px; border: 2px dashed #45cfa8;
                height: 100%; min-height: 150px; display: flex; flex-wrap: wrap; 
                justify-content: center; align-items: center; align-content: center; gap: 8px; padding: 10px;
            }

            .fruit-img {
                width: calc(20% - 8px); max-width: 45px; height: auto; aspect-ratio: 1/1; object-fit: contain;
                animation: popFruit 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }

            @keyframes popFruit { from { transform: scale(0); opacity:0; } to { transform: scale(1); opacity:1; } }

            .vs-box { font-size: 3rem; font-weight: 950; color: #2BA886; text-align: center; }

            .options-row { 
                display: flex; justify-content: center; gap: 15px; width: 100%; 
                max-width: 500px; padding: 20px 0; 
            }
            
            .opt-btn { 
                flex: 1; background: white; border: 4px solid #cbd5e1; border-radius: 20px; 
                height: 80px; font-size: 2.5rem; font-weight: 900; cursor: pointer; 
                box-shadow: 0 6px 0 #cbd5e1; color: #1e293b; transition: 0.1s;
                display: flex; align-items: center; justify-content: center;
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #cbd5e1; }
            .opt-btn.correct { background: #dcfce7; border-color: #22c55e; color: #166534; box-shadow: 0 4px 0 #166534; }
            .opt-btn.wrong { background: #fee2e2; border-color: #ef4444; color: #991b1b; box-shadow: 0 4px 0 #991b1b; }

            @media (max-width: 600px) {
                .comparison-area { grid-template-columns: 1fr; grid-template-rows: 1fr 50px 1fr; }
                .vs-box { font-size: 2rem; transform: rotate(90deg); }
                .fruit-img { width: calc(20% - 5px); max-width: 35px; }
                .fruit-box { min-height: 100px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="comparison-area">
                <div class="fruit-box">
                    ${Array(numEsquerda).fill(0).map((_, i) => `<img src="${path}${frutaEsq}" class="fruit-img" style="animation-delay:${i*0.03}s">`).join('')}
                </div>

                <div class="vs-box" id="result-symbol">?</div>

                <div class="fruit-box">
                    ${Array(numDireita).fill(0).map((_, i) => `<img src="${path}${frutaDir}" class="fruit-img" style="animation-delay:${i*0.03}s">`).join('')}
                </div>
            </div>
            
            <div class="options-row">
                <button class="opt-btn" onclick="verificarComparacao(this, '<')"><</button>
                <button class="opt-btn" onclick="verificarComparacao(this, '=')">=</button>
                <button class="opt-btn" onclick="verificarComparacao(this, '>')">></button>
            </div>
        </div>
    `;
}

function verificarComparacao(btn, escolha) {
    const botoes = document.querySelectorAll('.opt-btn');
    botoes.forEach(b => b.style.pointerEvents = 'none');

    let respostaCorreta = "=";
    if (numEsquerda > numDireita) respostaCorreta = ">";
    if (numEsquerda < numDireita) respostaCorreta = "<";

    const displaySimbolo = document.getElementById('result-symbol');

    if (escolha === respostaCorreta) {
        somAcerto.play();
        btn.classList.add('correct');
        displaySimbolo.innerText = respostaCorreta;
        displaySimbolo.style.color = "#22c55e";
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1200);
    } else {
        somErro.play();
        btn.classList.add('wrong');
        erros++;
        document.getElementById('miss-val').innerText = erros;
        
        // Mostra qual era o botão certo
        botoes.forEach(b => {
            if (b.innerText === respostaCorreta) b.classList.add('correct');
        });

        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1500);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:15px; filter: drop-shadow(0 8px 15px rgba(43,168,134,0.3));">
            <h2 style="color:#2BA886; font-weight:900; font-size:1.8rem; margin-bottom:15px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4;">
                    <span style="display:block; font-size:26px; font-weight:900; color:#2BA886;">${acertos}/10</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase; font-weight:800;">Acertos</span>
                </div>
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4;">
                    <span style="display:block; font-size:26px; font-weight:900; color:#2BA886;">${tempoFinal}</span>
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
