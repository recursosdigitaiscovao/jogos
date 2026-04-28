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
    return "Observa a sombra e escolhe o desenho correto!";
};

function selecionarCategoria(key) {
    categoriaAtual = key;
    const cat = JOGO_CATEGORIAS[key];
    perguntas = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
}

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itemTut = JOGO_CATEGORIAS.animais.itens[0];
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:15px;">
            <div style="height:45%; aspect-ratio:1/1; background:#f5f5f5; border-radius:20px; display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="height:75%; width:auto; filter:brightness(0); opacity:0.3; object-fit:contain;">
            </div>
            <div style="display:flex; gap:10px; height:20%; width:100%; justify-content:center;">
                <div style="height:100%; aspect-ratio:1/1; background:white; border:2px solid #eee; border-radius:10px;"></div>
                <div style="height:100%; aspect-ratio:1/1; background:white; border:2px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; position:relative;">
                    <img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="height:70%; width:auto; object-fit:contain;">
                    <div style="position:absolute; font-size:35px; bottom:-20px; right:-15px; animation: tapH 2s infinite;">☝️</div>
                </div>
                <div style="height:100%; aspect-ratio:1/1; background:white; border:2px solid #eee; border-radius:10px;"></div>
            </div>
        </div>
        <style>@keyframes tapH { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-5px,-10px) scale(1.1); } }</style>
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
    const pergunta = perguntas[indicePergunta];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / ${perguntas.length}`;

    let erradas = JOGO_CATEGORIAS[categoriaAtual].itens.filter(i => i.img !== pergunta.img).sort(() => Math.random() - 0.5).slice(0, 2);
    let opcoes = [pergunta, ...erradas].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { 
                display: flex; flex-direction: column; 
                width: 100%; height: 100%; 
                justify-content: space-between; align-items: center; 
                box-sizing: border-box; overflow: hidden;
            }
            .shadow-zone { 
                flex: 1; display: flex; align-items: center; justify-content: center; 
                width: 100%; min-height: 0; background: rgba(255,255,255,0.3); 
                border-radius: 25px; margin-bottom: 10px;
            }
            .shadow-img { 
                max-height: 85%; max-width: 85%; 
                object-fit: contain; 
                filter: brightness(0); opacity: 0.8; transition: 0.5s; 
            }
            .options-grid { 
                display: flex; 
                justify-content: center;
                gap: 10px; width: 100%; 
                height: 25%; /* FORÇA AS OPÇÕES A OCUPAREM APENAS 25% DA ALTURA */
                flex-shrink: 0;
            }
            .card-opt { 
                background: white; border: 3px solid #eee; border-radius: 15px; 
                height: 100%; aspect-ratio: 1/1; 
                display: flex; align-items: center; justify-content: center; 
                cursor: pointer; transition: 0.2s; box-shadow: 0 4px 0 #ddd; 
                padding: 8px; box-sizing: border-box;
            }
            .card-opt img { 
                height: 80%; width: auto; max-width: 90%;
                object-fit: contain; 
            }
            .is-correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 4px 0 #5ea31a !important; }
            .is-wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 4px 0 #d13d3d !important; }
            
            @media (orientation: landscape) and (max-height: 500px) {
                .game-wrapper { flex-direction: row; gap: 15px; } 
                .shadow-zone { margin-bottom: 0; height: 100%; }
                .options-grid { flex-direction: column; width: auto; height: 100%; }
                .card-opt { height: 30%; width: auto; }
            }
        </style>
        <div class="game-wrapper">
            <div class="shadow-zone"><img src="${JOGO_CONFIG.caminhoImg}${pergunta.img}" class="shadow-img" id="target-obj"></div>
            <div class="options-grid">
                ${opcoes.map(opt => `<div class="card-opt" onclick="validar(this, ${opt.img === pergunta.img})"><img src="${JOGO_CONFIG.caminhoImg}${opt.img}"></div>`).join('')}
            </div>
        </div>
    `;
}

function validar(el, acerto) {
    document.querySelectorAll('.card-opt').forEach(c => c.style.pointerEvents = 'none');
    const obj = document.getElementById('target-obj');
    if (acerto) {
        acertos++; somAcerto.play(); el.classList.add('is-correct');
        obj.style.filter = "none"; obj.style.opacity = "1";
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play(); el.classList.add('is-wrong');
        document.getElementById('miss-val').innerText = erros;
    }
    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < perguntas.length) mostrarPergunta();
        else finalizarJogo();
    }, 1500);
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
        <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:22%; width:auto; margin-bottom:10px; object-fit:contain;">
        <h2 style="color: var(--primary-blue); font-weight:900; font-size:1.4rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
        
        <div class="res-stats-container">
            <div class="res-stat-card"><span class="res-stat-val">${acertos} / ${totalP}</span><span class="res-stat-lab">Acertos</span></div>
            <div class="res-stat-card"><span class="res-stat-val">${tempoFinal}</span><span class="res-stat-lab">Tempo</span></div>
        </div>

        <div class="res-btn-group">
            <button class="btn-res btn-res-primary" onclick="location.reload()">Jogar de Novo</button>
            <button class="btn-res btn-res-outline" onclick="openRDMenu()">Outro Tema / Nível</button>
            <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-res-muted">Escolher outro jogo</a>
        </div>
    `;

    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
