let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "geral";
let itemIntruso = null;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO E TUTORIAL ===
window.startLogic = function() {
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Encontra e clica no desenho que não pertence ao grupo!";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;

    container.innerHTML = `
        <div class="tut-intruso">
            <div class="tut-grid-2x2">
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}frutas/maca.png"></div>
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}frutas/banana.png"></div>
                <div class="tut-item tut-target"><img src="${JOGO_CONFIG.caminhoImg}objetos/bola.png"></div>
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}frutas/laranja.png"></div>
            </div>
            <div id="tut-hand-intruso" class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-intruso { position: relative; padding: 15px; background: white; border-radius: 20px; border: 2px solid #eee; }
            .tut-grid-2x2 { display: grid; grid-template-columns: repeat(2, 45px); gap: 8px; }
            .tut-item { width: 45px; height: 45px; border: 1px solid #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
            .tut-item img { width: 80%; }
            .tut-target { border-color: var(--primary-blue); background: #f0f7ff; }
            .tut-hand { position: absolute; font-size: 40px; z-index: 10; animation: animHandIntruso 3s infinite; }
            @keyframes animHandIntruso {
                0%, 100% { transform: translate(60px, 60px); }
                50% { transform: translate(35px, 20px) scale(0.8); }
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

    const chaves = JOGO_CATEGORIAS[categoriaAtual].grupos;
    
    // 1. Escolher Categoria Base (as 3 iguais) e Categoria Intruso (a 1 diferente)
    let baralho = [...chaves].sort(() => Math.random() - 0.5);
    let catBase = baralho[0];
    let catIntruso = baralho[1];

    // 2. Escolher itens
    let itensBase = [...DADOS_GRUPOS[catBase]].sort(() => Math.random() - 0.5).slice(0, 3);
    itemIntruso = [...DADOS_GRUPOS[catIntruso]].sort(() => Math.random() - 0.5)[0];

    // 3. Juntar e baralhar as 4 opções
    let opcoes = [...itensBase, itemIntruso].sort(() => Math.random() - 0.5);

    mostrarPergunta(opcoes);
}

function mostrarPergunta(opcoes) {
    const container = document.getElementById('game-main-content');
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: center; padding: 10px; box-sizing: border-box; overflow: hidden; }
            .intruso-grid { 
                display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr);
                height: 90%; aspect-ratio: 1/1; gap: 20px; padding: 10px;
            }
            .card-intruso { 
                background: white; border: 4px solid #eee; border-radius: 30px; 
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 8px 0 #ddd;
                padding: 20px; box-sizing: border-box;
            }
            .card-intruso img { height: 90%; width: auto; max-width: 90%; object-fit: contain; }
            .card-intruso:hover { border-color: var(--primary-blue); transform: translateY(-3px); }
            .card-intruso:active { transform: translateY(5px); box-shadow: none; }

            .is-correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 8px 0 #5ea31a !important; }
            .is-wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 8px 0 #d13d3d !important; }

            @media (orientation: landscape) and (max-height: 550px) {
                .intruso-grid { grid-template-columns: repeat(4, 1fr); grid-template-rows: 1fr; width: 95%; height: 75%; aspect-ratio: auto; }
            }
        </style>
        <div class="game-wrapper">
            <div class="intruso-grid">
                ${opcoes.map(item => `
                    <div class="card-intruso" onclick="verificar(this, ${item === itemIntruso})">
                        <img src="${JOGO_CONFIG.caminhoImg}${item.img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function verificar(el, acerto) {
    // Bloquear cliques
    document.querySelectorAll('.card-intruso').forEach(c => c.style.pointerEvents = 'none');

    if (acerto) {
        acertos++; somAcerto.play();
        el.classList.add('is-correct');
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play();
        el.classList.add('is-wrong');
        document.getElementById('miss-val').innerText = erros;
        
        // Destacar o correto para a criança aprender
        document.querySelectorAll('.card-intruso').forEach(c => {
            // Se tivéssemos guardado a ref do elemento correto, destacaríamos aqui
        });
    }

    setTimeout(() => {
        indicePergunta++;
        proximaRonda();
    }, 1500);
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
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-container">
                <div class="res-stat-card"><span class="res-stat-val">${acertos} / 10</span><span class="res-stat-lab">Acertos</span></div>
                <div class="res-stat-card"><span class="res-stat-val">${tempo}</span><span class="res-stat-lab">Tempo</span></div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:260px;">
                <button class="res-btn res-btn-p" style="padding:14px; border-radius:15px; font-weight:900; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);" onclick="location.reload()">Jogar de Novo</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:14px; border-radius:15px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 5px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
