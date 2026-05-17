let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let categoriaAtual = "animais";
let jogoAtivo = false;
let itemSolitario = null;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    const primeiraCat = Object.keys(JOGO_CATEGORIAS)[0];
    if (!categoriaAtual) categoriaAtual = primeiraCat;
    
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = "Observa com atenção e encontra o desenho que não tem um par igual!";

    // Configurar botão da Lâmpada (Tamanho do RD)
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer; display:block;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
    }

    selecionarCategoria(categoriaAtual);
    criarAnimacaoTutorial();
};

function selecionarCategoria(key) {
    categoriaAtual = key;
}

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itens = JOGO_CATEGORIAS[categoriaAtual].itens;
    
    container.innerHTML = `
        <style>
            .tut-box { display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:15px; }
            .tut-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; }
            .tut-item { width:45px; height:45px; background:white; border:2px solid #eee; border-radius:10px; display:flex; align-items:center; justify-content:center; position:relative; }
            .tut-item img { height:30px; object-fit:contain; }
            @keyframes tapP { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-5px,-8px) scale(1.1); } }
        </style>
        <div class="tut-box">
            <div class="tut-grid">
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}${itens[0].img}"></div>
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}${itens[1].img}"></div>
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}${itens[0].img}"></div>
                <div class="tut-item" style="border-color:var(--primary-blue)">
                    <img src="${JOGO_CONFIG.caminhoImg}${itens[2].img}">
                    <div style="position:absolute; font-size:35px; bottom:-20px; right:-15px; animation: tapP 2s infinite; z-index:10;">☝️</div>
                </div>
                <div class="tut-item"><img src="${JOGO_CONFIG.caminhoImg}${itens[1].img}"></div>
            </div>
        </div>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0; ajudasUtilizadas = 0; jogoAtivo = true;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    proximaRonda();
};

function proximaRonda() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    const cat = JOGO_CATEGORIAS[categoriaAtual];
    let sorteio = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 5);
    itemSolitario = sorteio[0];
    let pares = sorteio.slice(1, 5);
    let listaRonda = [itemSolitario];
    pares.forEach(p => { listaRonda.push(p); listaRonda.push(p); });
    perguntas = listaRonda.sort(() => Math.random() - 0.5);
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .game-wrapper { 
                display: flex; flex-direction: column; width: 100%; height: 100%; 
                justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; overflow: hidden;
            }
            .options-grid { 
                display: grid; grid-template-columns: repeat(3, 1fr); 
                gap: 10px; width: 100%; max-width: 450px; 
                max-height: 80vh; /* Impede que a grelha saia do monitor */
            }
            .card-item { 
                background: white; border: 3px solid #f0f4f8; border-radius: 20px; 
                aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; 
                cursor: pointer; transition: 0.2s; box-shadow: 0 4px 0 #d0d8de; 
                padding: 10px; min-height: 0;
            }
            .card-item img { height: 75%; width: auto; object-fit: contain; }
            
            .is-correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 4px 0 #5ea31a !important; }
            .is-wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 4px 0 #d13d3d !important; }
            .ajuda-foco { animation: brilharAjuda 0.5s 3; }
            @keyframes brilharAjuda { 0%, 100% { border-color: #f0f4f8; } 50% { border-color: #ff9f43; background: #fff5e6; transform: scale(1.05); } }

            @media (max-width: 600px) { 
                .game-wrapper { padding: 10px; }
                .options-grid { gap: 8px; max-width: 320px; }
                .card-item { border-radius: 15px; border-width: 2px; }
            }
            @media (max-height: 500px) {
                .options-grid { max-width: 400px; gap: 5px; }
                .card-item { padding: 5px; }
            }
        </style>
        <div class="game-wrapper">
            <div class="options-grid">
                ${perguntas.map((opt, i) => `
                    <div class="card-item" data-id="${opt.nome}" onclick="verificar(this, '${opt.nome}')">
                        <img src="${JOGO_CONFIG.caminhoImg}${opt.img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function usarAjuda() {
    if (!jogoAtivo) return;
    const cards = document.querySelectorAll('.card-item');
    cards.forEach(card => {
        if (card.getAttribute('data-id') === itemSolitario.nome) {
            if (!card.classList.contains('ajuda-foco')) {
                card.classList.add('ajuda-foco');
                ajudasUtilizadas++;
                setTimeout(() => card.classList.remove('ajuda-foco'), 1500);
            }
        }
    });
}

function verificar(el, nomeItem) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.card-item').forEach(c => c.style.pointerEvents = 'none');
    
    if (nomeItem === itemSolitario.nome) {
        acertos++; somAcerto.play(); el.classList.add('is-correct');
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play(); el.classList.add('is-wrong');
        document.getElementById('miss-val').innerText = erros;
        document.querySelectorAll('.card-item').forEach(c => {
            if(c.getAttribute('data-id') === itemSolitario.nome) c.classList.add('is-correct');
        });
    }

    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < 10) proximaRonda();
        else finalizarJogo();
    }, 1500);
}

// === 3. FINALIZAÇÃO E RESULTADOS (CONFORME PEDIDO) ===
function finalizarJogo() {
    jogoAtivo = false;
    somVitoria.play();
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <style>
                .res-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 450px; }
                .res-trophy { height: 120px; margin-bottom: 10px; object-fit: contain; }
                .res-msg { color: var(--primary-blue); font-weight: 900; font-size: 2.2rem; margin-bottom: 25px; text-align: center; line-height: 1; }
                .res-stats-row { display: flex; gap: 12px; margin-bottom: 30px; width: 100%; justify-content: center; }
                .stat-box { background: white; border-radius: 25px; width: 105px; height: 105px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .stat-val { font-size: 1.8rem; font-weight: 900; margin-bottom: 2px; }
                .stat-lab { font-size: 0.65rem; font-weight: 900; color: #88a; text-transform: uppercase; letter-spacing: 0.5px; }
                .res-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 320px; }
                .btn-res { height: 60px; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; font-weight: 900; font-size: 1.1rem; text-decoration: none; cursor: pointer; transition: 0.2s; border: none; }
                .btn-redo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
                .btn-redo:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }
                .btn-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); }
                .btn-exit { background: #e2e8f0; color: #64748b; }
                @media (max-width: 500px) { .res-msg { font-size: 1.8rem; } .stat-box { width: 90px; height: 90px; } .btn-res { height: 50px; font-size: 1rem; } }
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
        </div>
    `;
}
