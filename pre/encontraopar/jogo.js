let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;
let categoriaAtual = "animais";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO E TUTORIAL ===
window.startLogic = function() {
    selecionarCategoria(categoriaAtual);
    criarAnimacaoTutorial();
};

window.gerarIntroJogo = function() {
    return "Olha para o desenho em destaque e encontra o seu par igual nas opções em baixo!";
};

function selecionarCategoria(key) {
    categoriaAtual = key;
    const cat = JOGO_CATEGORIAS[key];
    // Baralha e escolhe 10 para a ronda
    perguntas = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
}

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itemTut = JOGO_CATEGORIAS.animais.itens[1]; // Águia ou similar
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:15px;">
            <div style="height:90px; width:90px; background:white; border:3px solid var(--primary-blue); border-radius:20px; display:flex; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="height:65px; width:auto; object-fit:contain;">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;">
                ${[1,2,3,4,5,6,7,8].map(i => `
                    <div style="width:35px; height:35px; background:white; border:1px solid ${i===6 ? 'var(--primary-blue)' : '#eee'}; border-radius:8px; display:flex; align-items:center; justify-content:center; position:relative;">
                        ${i === 6 ? `<img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="width:70%;">` : ''}
                        ${i === 6 ? `<div style="position:absolute; font-size:35px; bottom:-25px; right:-15px; animation: tapP 2s infinite; z-index:10;">☝️</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        <style>@keyframes tapP { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-8px,-12px) scale(1.1); } }</style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    mostrarPergunta();
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

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const alvo = perguntas[indicePergunta];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / ${perguntas.length}`;

    // Gerar 8 opções: 1 alvo + 7 distratores da mesma categoria
    let outras = JOGO_CATEGORIAS[categoriaAtual].itens
        .filter(i => i.img !== alvo.img)
        .sort(() => Math.random() - 0.5)
        .slice(0, 7);
    
    let opcoes = [alvo, ...outras].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { 
                display: flex; flex-direction: column; 
                width: 100%; height: 100%; 
                align-items: center; 
                padding: 20px 10px;
                box-sizing: border-box; overflow: hidden;
            }
            /* ÁREA DO ALVO (DESTAQUE) */
            .target-area { 
                height: 35%; width: 100%;
                display: flex; align-items: center; justify-content: center; 
                margin-bottom: 20px;
            }
            .target-card {
                height: 100%; aspect-ratio: 1/1;
                background: white; border: 5px solid var(--primary-blue);
                border-radius: 30px; display: flex; align-items: center; justify-content: center;
                box-shadow: 0 15px 30px rgba(0,0,0,0.05);
            }
            .target-card img { height: 75%; width: auto; object-fit: contain; }

            /* GRELHA DE 8 OPÇÕES */
            .options-grid { 
                display: grid; 
                grid-template-columns: repeat(4, 1fr); /* 4 colunas no PC */
                gap: 12px; width: 100%; max-width: 800px;
                flex: 1; min-height: 0;
            }
            .item-card { 
                background: white; border: 3px solid #eee; border-radius: 15px; 
                display: flex; align-items: center; justify-content: center; 
                cursor: pointer; transition: 0.2s; box-shadow: 0 5px 0 #ddd; 
                padding: 10px; box-sizing: border-box;
            }
            .item-card img { height: 85%; width: auto; max-width: 95%; object-fit: contain; }
            .item-card:hover { border-color: var(--primary-blue); transform: translateY(-2px); }
            
            .correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 5px 0 #5ea31a !important; }
            .wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 5px 0 #d13d3d !important; }
            
            /* AJUSTE MOBILE VERTICAL (2 Colunas x 4 Linhas para caber melhor) */
            @media (max-width: 500px) {
                .options-grid { grid-template-columns: repeat(3, 1fr); } /* 3 colunas em mobile */
                .target-area { height: 30%; }
                .item-card { padding: 8px; }
            }

            @media (orientation: landscape) and (max-height: 500px) {
                .game-wrapper { flex-direction: row; padding: 15px; gap: 20px; }
                .target-area { height: 100%; width: 40%; margin-bottom: 0; }
                .options-grid { grid-template-columns: repeat(4, 1fr); height: 100%; width: 60%; }
            }
        </style>
        <div class="game-wrapper">
            <div class="target-area">
                <div class="target-card">
                    <img src="${JOGO_CONFIG.caminhoImg}${alvo.img}">
                </div>
            </div>
            <div class="options-grid">
                ${opcoes.map(opt => `
                    <div class="item-card" onclick="verificarClique(this, ${opt.img === alvo.img})">
                        <img src="${JOGO_CONFIG.caminhoImg}${opt.img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function verificarClique(el, acerto) {
    document.querySelectorAll('.item-card').forEach(c => c.style.pointerEvents = 'none');
    if (acerto) {
        acertos++; somAcerto.play(); el.classList.add('correct');
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play(); el.classList.add('wrong');
        document.getElementById('miss-val').innerText = erros;
    }
    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < perguntas.length) mostrarPergunta();
        else finalizarJogo();
    }, 1200);
}

// === 3. FINALIZAÇÃO E RESULTADOS ===
function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const totalP = perguntas.length;
    const perc = (acertos / totalP) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 

    resScreen.innerHTML = `
        <style>
            .res-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; box-sizing: border-box; }
            .res-btn-group-final { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px; }
            .res-stats-final { display: flex; gap: 12px; width: 100%; max-width: 280px; margin: 15px 0 20px; }
            .res-btn { padding: 15px; border-radius: 18px; font-weight: 900; font-size: 15px; cursor: pointer; border: none; text-align: center; text-decoration: none; text-transform: uppercase; }
            .res-btn-p { background: var(--primary-blue); color: white; box-shadow: 0 5px 0 var(--primary-dark); }
            .res-btn-o { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); box-shadow: 0 5px 0 var(--primary-blue); padding: 12px; }
            .res-btn-m { background: #dce4ee; color: #5d7082; box-shadow: 0 5px 0 #b8c5d4; }
            .res-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }
        </style>
        <div class="res-inner">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:120px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color: var(--primary-blue); font-weight:900; font-size:1.7rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            
            <div class="res-stats-final">
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos} / ${totalP}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempoFinal}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
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
