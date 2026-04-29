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
        <div style="position:relative; padding:15px; background:white; border-radius:20px; border:2px solid #eee; display:flex; flex-direction:column; align-items:center;">
            <div style="display:grid; grid-template-columns:repeat(2, 45px); gap:10px;">
                <div style="width:45px; height:45px; border:1px solid #eee; border-radius:8px; display:flex; align-items:center; justify-content:center;"><img src="${JOGO_CONFIG.caminhoImg}frutas/maca.png" style="width:80%;"></div>
                <div style="width:45px; height:45px; border:2px solid var(--primary-blue); background:#f0f7ff; border-radius:8px; display:flex; align-items:center; justify-content:center;"><img src="${JOGO_CONFIG.caminhoImg}animaisselvagens/abelha.png" style="width:80%;"></div>
                <div style="width:45px; height:45px; border:1px solid #eee; border-radius:8px; display:flex; align-items:center; justify-content:center;"><img src="${JOGO_CONFIG.caminhoImg}frutas/banana.png" style="width:80%;"></div>
                <div style="width:45px; height:45px; border:1px solid #eee; border-radius:8px; display:flex; align-items:center; justify-content:center;"><img src="${JOGO_CONFIG.caminhoImg}frutas/laranja.png" style="width:80%;"></div>
            </div>
            <div style="position:absolute; font-size:40px; bottom:-25px; right:-5px; animation: tutHand 3s infinite;">☝️</div>
        </div>
        <style>@keyframes tutHand { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-25px, -65px) scale(0.8); } }</style>
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
    const grupos = Object.keys(BANCO_DE_DADOS).sort(() => Math.random() - 0.5);
    const catBase = grupos[0], catIntruso = grupos[1];
    const n = configuracaoNivel.totalItens;
    let itensBase = [...BANCO_DE_DADOS[catBase]].sort(() => Math.random() - 0.5).slice(0, n - 1);
    itemIntruso = [...BANCO_DE_DADOS[catIntruso]].sort(() => Math.random() - 0.5)[0];
    let opcoes = [...itensBase, itemIntruso].sort(() => Math.random() - 0.5);
    mostrarPergunta(opcoes);
}

function mostrarPergunta(opcoes) {
    const container = document.getElementById('game-main-content');
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: center; padding: 10px; box-sizing: border-box; overflow: hidden; }
            .intruso-grid { display: grid; grid-template-columns: repeat(${configuracaoNivel.colunas}, 1fr); gap: 12px; width: 100%; max-width: 850px; height: 95%; min-height: 0; }
            .card-item { background: white; border: 3px solid #eee; border-radius: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 6px 0 #ddd; padding: 8px; box-sizing: border-box; height: 100%; width: 100%; min-height: 0; }
            .card-item img { max-height: 85%; max-width: 85%; object-fit: contain; }
            .card-item:active { transform: translateY(2px); box-shadow: none; }
            .correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 5px 0 #5ea31a !important; }
            .wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 5px 0 #d13d3d !important; }
            @media (max-width: 500px) { .intruso-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (orientation: landscape) and (max-height: 500px) { .intruso-grid { grid-template-columns: repeat(${configuracaoNivel.totalItens}, 1fr); grid-template-rows: 1fr; height: 80%; } }
        </style>
        <div class="game-wrapper"><div class="intruso-grid">
            ${opcoes.map(img => `<div class="card-item" onclick="verificar(this, '${img}')"><img src="${JOGO_CONFIG.caminhoImg}${img}"></div>`).join('')}
        </div></div>
    `;
}

function verificar(el, img) {
    document.querySelectorAll('.card-item').forEach(c => c.style.pointerEvents = 'none');
    if (img === itemIntruso) {
        acertos++; somAcerto.play(); el.classList.add('correct');
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play(); el.classList.add('wrong');
        document.getElementById('miss-val').innerText = erros;
    }
    setTimeout(() => { indicePergunta++; proximaRonda(); }, 1200);
}

// === 3. FINALIZAÇÃO E RESULTADOS (AJUSTADO CONFORME IMAGEM) ===
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
            
            .res-btns { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 300px; }
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
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-f btn-f-muted">Escolher outro jogo</a>
            </div>
        </div>
    `;

    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
