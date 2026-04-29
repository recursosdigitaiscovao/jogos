let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "facil";
let configuracaoNivel = {};
let itemIntruso = "";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO E TUTORIAL ===
window.startLogic = function() {
    if (!categoriaAtual) categoriaAtual = "facil";
    configuracaoNivel = JOGO_CATEGORIAS[categoriaAtual];
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Encontra o desenho que não pertence ao grupo! Presta muita atenção.";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    configuracaoNivel = JOGO_CATEGORIAS[key];
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;

    container.innerHTML = `
        <div class="tut-intruso">
            <div class="tut-grid-demo">
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}frutas/maca.png"></div>
                <div class="tut-item tut-target"><img src="${JOGO_CONFIG.caminhoImg}animaisselvagens/abelha.png"></div>
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}frutas/banana.png"></div>
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}frutas/laranja.png"></div>
            </div>
            <div id="tut-hand" class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-intruso { position: relative; padding: 15px; background: white; border-radius: 20px; border: 2px solid #eee; }
            .tut-grid-demo { display: grid; grid-template-columns: repeat(2, 45px); gap: 10px; }
            .tut-item { width: 45px; height: 45px; border: 1px solid #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #fff; }
            .tut-item img { width: 80%; }
            .tut-target { border-color: var(--primary-blue); background: #f0f7ff; }
            .tut-hand { position: absolute; font-size: 40px; z-index: 10; animation: tutHandMove 3s infinite; }
            @keyframes tutHandMove {
                0%, 100% { transform: translate(70px, 70px); }
                50% { transform: translate(45px, 0px) scale(0.8); }
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

    const gruposDisponiveis = Object.keys(BANCO_DE_DADOS);
    const shuffleGrupos = gruposDisponiveis.sort(() => Math.random() - 0.5);
    
    const catBase = shuffleGrupos[0];
    const catIntruso = shuffleGrupos[1];

    const n = configuracaoNivel.totalItens;
    
    // Sortear itens do grupo base
    let itensBase = [...BANCO_DE_DADOS[catBase]].sort(() => Math.random() - 0.5).slice(0, n - 1);
    // Sortear 1 item intruso
    itemIntruso = [...BANCO_DE_DADOS[catIntruso]].sort(() => Math.random() - 0.5)[0];

    let opcoes = [...itensBase, itemIntruso].sort(() => Math.random() - 0.5);

    mostrarPergunta(opcoes);
}

function mostrarPergunta(opcoes) {
    const container = document.getElementById('game-main-content');
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .game-wrapper { 
                display: flex; flex-direction: column; width: 100%; height: 100%; 
                align-items: center; justify-content: center; padding: 10px; box-sizing: border-box; overflow: hidden; 
            }
            .intruso-grid { 
                display: grid; 
                grid-template-columns: repeat(${configuracaoNivel.colunas}, 1fr); 
                gap: 12px; width: 100%; max-width: 900px; height: 95%; min-height: 0;
            }
            .card-item { 
                background: white; border: 3px solid #eee; border-radius: 20px; 
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 6px 0 #ddd;
                padding: 10px; box-sizing: border-box; height: 100%; width: 100%;
                min-height: 0;
            }
            .card-item img { max-height: 85%; max-width: 85%; object-fit: contain; }
            .card-item:hover { border-color: var(--primary-blue); }
            .card-item:active { transform: translateY(3px); box-shadow: none; }

            .correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 6px 0 #5ea31a !important; }
            .wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 6px 0 #d13d3d !important; }

            /* AJUSTE LANDSCAPE PORTÁTEIS */
            @media (orientation: landscape) and (max-height: 550px) {
                .intruso-grid { 
                    grid-template-columns: repeat(${configuracaoNivel.totalItens}, 1fr); 
                    grid-template-rows: 1fr; 
                    height: 80%;
                }
                .card-item { border-radius: 12px; padding: 5px; }
            }
            
            /* AJUSTE MOBILE VERTICAL PARA NÍVEL DIFICIL */
            @media (max-width: 500px) {
                .intruso-grid { 
                    grid-template-columns: repeat(2, 1fr); 
                    gap: 8px;
                }
            }
        </style>
        <div class="game-wrapper">
            <div class="intruso-grid">
                ${opcoes.map(img => `
                    <div class="card-item" onclick="verificar(this, '${img}')">
                        <img src="${JOGO_CONFIG.caminhoImg}${img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function verificar(el, img) {
    const cards = document.querySelectorAll('.card-item');
    cards.forEach(c => c.style.pointerEvents = 'none');

    if (img === itemIntruso) {
        acertos++; somAcerto.play();
        el.classList.add('correct');
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play();
        el.classList.add('wrong');
        document.getElementById('miss-val').innerText = erros;
        
        // Mostrar onde estava o intruso
        cards.forEach(c => {
            if (c.innerHTML.includes(itemIntruso)) c.style.borderColor = "var(--primary-blue)";
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
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; box-sizing:border-box; padding:10px;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:22%; min-height:80px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-container">
                <div class="res-stat-card"><span class="res-stat-val">${acertos} / 10</span><span class="res-stat-lab">Acertos</span></div>
                <div class="res-stat-card"><span class="res-stat-val">${tempo}</span><span class="res-stat-lab">Tempo</span></div>
            </div>
            <div class="res-btn-group-final">
                <button class="res-btn res-btn-p" onclick="location.reload()">Jogar de Novo</button>
                <button class="res-btn res-btn-o" onclick="openRDMenu()">Outro Tema / Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="res-btn res-btn-m">Escolher outro jogo</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
