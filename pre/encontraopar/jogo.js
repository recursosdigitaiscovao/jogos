let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let categoriaAtual = "animais";
let jogoAtivo = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    const primeiraCat = Object.keys(JOGO_CATEGORIAS)[0];
    if (!categoriaAtual) categoriaAtual = primeiraCat;
    
    // Configurar botão da Lâmpada (Tamanho igual ao RD, sem número)
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer; display:block;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
    }

    selecionarCategoria(categoriaAtual);
    criarAnimacaoTutorial();
};

window.gerarIntroJogo = function() {
    return "Olha para o desenho em destaque no topo e encontra o seu par igual nas opções em baixo!";
};

function selecionarCategoria(key) {
    categoriaAtual = key;
    const cat = JOGO_CATEGORIAS[key];
    perguntas = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
}

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itemTut = JOGO_CATEGORIAS[categoriaAtual].itens[0];
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:10px;">
            <div style="height:80px; width:80px; background:white; border:3px solid var(--primary-blue); border-radius:15px; display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="max-height:80%; max-width:80%; object-fit:contain;">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;">
                ${[1,2,3,4,5,6,7,8].map(i => `<div style="width:35px; height:35px; background:white; border:2px solid ${i===6 ? 'var(--primary-blue)' : '#eee'}; border-radius:8px; display:flex; align-items:center; justify-content:center; position:relative;">
                    ${i === 6 ? `<img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="width:75%;">` : ''}
                    ${i === 6 ? `<div style="position:absolute; font-size:30px; bottom:-25px; right:-15px; animation: tapP 2s infinite; z-index:10;">☝️</div>` : ''}
                </div>`).join('')}
            </div>
        </div>
        <style>@keyframes tapP { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-5px,-8px) scale(1.1); } }</style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0; ajudasUtilizadas = 0; jogoAtivo = true;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    mostrarPergunta();
};

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const alvo = perguntas[indicePergunta];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    let erradas = JOGO_CATEGORIAS[categoriaAtual].itens.filter(i => i.img !== alvo.img).sort(() => Math.random() - 0.5).slice(0, 7);
    let opcoes = [alvo, ...erradas].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: center; align-items: center; padding: 10px; box-sizing: border-box; }
            .target-zone { height: 25%; width: 100%; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; flex-shrink: 0; }
            .target-card { height: 100%; aspect-ratio: 1/1; background: white; border: 4px solid var(--primary-blue); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .target-card img { max-height: 80%; max-width: 80%; object-fit: contain; }
            .options-grid { flex: 1; width: 100%; max-width: 800px; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr); gap: 10px; }
            .card-item { background: white; border: 2.5px solid #f0f4f8; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 0 #d0d8de; padding: 8px; }
            .card-item img { max-height: 85%; max-width: 85%; object-fit: contain; }
            .is-correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 4px 0 #5ea31a !important; }
            .is-wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 4px 0 #d13d3d !important; }
            .ajuda-foco { animation: brilharAjuda 0.5s 3; }
            @keyframes brilharAjuda { 0%, 100% { border-color: #f0f4f8; } 50% { border-color: #ff9f43; background: #fff5e6; transform: scale(1.05); } }
            @media (max-width: 600px) { .options-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(4, 1fr); gap: 8px; } .target-zone { height: 20%; } }
        </style>
        <div class="game-wrapper">
            <div class="target-zone"><div class="target-card"><img src="${JOGO_CONFIG.caminhoImg}${alvo.img}"></div></div>
            <div class="options-grid">
                ${opcoes.map(opt => `<div class="card-item" data-img="${opt.img}" onclick="verificar(this, ${opt.img === alvo.img})"><img src="${JOGO_CONFIG.caminhoImg}${opt.img}"></div>`).join('')}
            </div>
        </div>
    `;
}

function usarAjuda() {
    if (!jogoAtivo) return;
    const alvo = perguntas[indicePergunta];
    const cards = document.querySelectorAll('.card-item');
    cards.forEach(card => {
        if (card.getAttribute('data-img') === alvo.img) {
            if (!card.classList.contains('ajuda-foco')) {
                card.classList.add('ajuda-foco');
                ajudasUtilizadas++;
                setTimeout(() => card.classList.remove('ajuda-foco'), 1500);
            }
        }
    });
}

function verificar(el, acerto) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.card-item').forEach(c => c.style.pointerEvents = 'none');
    if (acerto) {
        acertos++; somAcerto.play(); el.classList.add('is-correct');
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play(); el.classList.add('is-wrong');
        document.getElementById('miss-val').innerText = erros;
    }
    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < 10) mostrarPergunta();
        else finalizarJogo();
    }, 1200);
}

// === 3. FINALIZAÇÃO E RESULTADOS (CONFORME IMAGEM) ===
function finalizarJogo() {
    jogoAtivo = false;
    somVitoria.play();
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <style>
            .res-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 20px; }
            .res-trophy { height: 130px; margin-bottom: 10px; object-fit: contain; }
            .res-msg { color: var(--primary-blue); font-weight: 900; font-size: 2.2rem; margin-bottom: 25px; text-align: center; }
            
            .res-stats-row { display: flex; gap: 15px; margin-bottom: 30px; width: 100%; max-width: 420px; justify-content: center; }
            .stat-box { background: white; border-radius: 25px; width: 110px; height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .stat-val { font-size: 1.8rem; font-weight: 900; margin-bottom: 2px; }
            .stat-lab { font-size: 0.65rem; font-weight: 900; color: #88a; text-transform: uppercase; letter-spacing: 0.5px; }
            
            .res-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 340px; }
            .btn-res { height: 60px; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; font-weight: 900; font-size: 1.1rem; text-decoration: none; cursor: pointer; transition: 0.2s; border: none; }
            
            /* Botão Sólido */
            .btn-redo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-redo:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }
            
            /* Botão Outline */
            .btn-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); }
            .btn-outline:active { background: #f0f7ff; }
            
            /* Botão Subtil */
            .btn-exit { background: #e2e8f0; color: #64748b; }
            .btn-exit:active { background: #cbd5e1; }

            @media (max-width: 500px) {
                .res-msg { font-size: 1.8rem; }
                .stat-box { width: 90px; height: 90px; }
                .btn-res { height: 50px; font-size: 1rem; }
            }
        </style>
        <div class="res-container">
            <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" class="res-trophy">
            <h1 class="res-msg">${rel.titulo}</h1>
            
            <div class="res-stats-row">
                <div class="stat-box">
                    <span class="stat-val" style="color: #7ed321;">${acertos}</span>
                    <span class="stat-lab">Certos</span>
                </div>
                <div class="stat-box">
                    <span class="stat-val" style="color: #ff5e5e;">${erros}</span>
                    <span class="stat-lab">Errados</span>
                </div>
                <div class="stat-box">
                    <span class="stat-val" style="color: #ff9f43;">${ajudasUtilizadas}</span>
                    <span class="stat-lab">Ajudas</span>
                </div>
            </div>

            <div class="res-actions">
                <button class="btn-res btn-redo" onclick="location.reload()">
                    <i class="fas fa-redo"></i> JOGAR DE NOVO
                </button>
                <button class="btn-res btn-outline" onclick="openRDMenu()">
                    <i class="fas fa-chart-line"></i> OUTRO NÍVEL
                </button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-exit">
                    <i class="fas fa-sign-out-alt"></i> SAIR
                </a>
            </div>
        </div>
    `;

    document.getElementById('status-bar').style.display = 'none';
}
