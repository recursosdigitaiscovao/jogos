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
    const primeiraCat = Object.keys(JOGO_CATEGORIAS)[0];
    if (!categoriaAtual) categoriaAtual = primeiraCat;
    selecionarCategoria(categoriaAtual);
    criarAnimacaoTutorial();
};

window.gerarIntroJogo = function() {
    return "Olha para o desenho em destaque no topo e encontra o seu par igual nas opções em baixo!";
};

function selecionarCategoria(key) {
    categoriaAtual = key;
    const cat = JOGO_CATEGORIAS[key];
    // Baralha e seleciona 10 itens para o jogo
    perguntas = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
}

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itemTut = JOGO_CATEGORIAS[categoriaAtual].itens[0];
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:15px;">
            <div style="height:100px; width:100px; background:white; border:3px solid var(--primary-blue); border-radius:20px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 15px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="height:70%; width:auto; object-fit:contain;">
            </div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px;">
                ${[1,2,3,4,5,6,7,8].map(i => `
                    <div style="width:40px; height:40px; background:white; border:2px solid ${i===6 ? 'var(--primary-blue)' : '#eee'}; border-radius:10px; display:flex; align-items:center; justify-content:center; position:relative;">
                        ${i === 6 ? `<img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="width:75%;">` : ''}
                        ${i === 6 ? `<div style="position:absolute; font-size:40px; bottom:-30px; right:-20px; animation: tapP 2s infinite; z-index:10;">☝️</div>` : ''}
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

    let erradas = JOGO_CATEGORIAS[categoriaAtual].itens.filter(i => i.img !== alvo.img).sort(() => Math.random() - 0.5).slice(0, 7);
    let opcoes = [alvo, ...erradas].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-between; align-items: center; padding: 10px; box-sizing: border-box; overflow: hidden; }
            .target-zone { height: 25%; width: 100%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-bottom: 5px; }
            .target-card { height: 100%; aspect-ratio: 1/1; background: white; border: 4px solid var(--primary-blue); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .target-card img { max-height: 80%; max-width: 80%; object-fit: contain; }
            .options-grid { flex: 1; width: 100%; max-width: 850px; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr); gap: 10px; min-height: 0; padding: 5px; }
            .card-item { background: white; border: 2.5px solid #eee; border-radius: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 0 #ddd; padding: 8px; box-sizing: border-box; height: 100%; width: 100%; min-height: 0; }
            .card-item img { max-height: 85%; max-width: 85%; object-fit: contain; }
            .card-item:active { transform: translateY(2px); box-shadow: none; }
            .is-correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 4px 0 #5ea31a !important; }
            .is-wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 4px 0 #d13d3d !important; }
            
            /* RESPONSIVIDADE PC */
            @media (min-width: 800px) { .target-zone { height: 28%; } .card-item { border-width: 3.5px; } }
            /* RESPONSIVIDADE MOBILE */
            @media (max-width: 500px) { .options-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(4, 1fr); gap: 8px; } .target-zone { height: 20%; } }
        </style>
        <div class="game-wrapper">
            <div class="target-zone"><div class="target-card"><img src="${JOGO_CONFIG.caminhoImg}${alvo.img}"></div></div>
            <div class="options-grid">
                ${opcoes.map(opt => `<div class="card-item" onclick="verificar(this, ${opt.img === alvo.img})"><img src="${JOGO_CONFIG.caminhoImg}${opt.img}"></div>`).join('')}
            </div>
        </div>
    `;
}

function verificar(el, acerto) {
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
            .res-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; box-sizing: border-box; padding: 10px; }
            .res-stats-c { display: flex; gap: 10px; width: 100%; max-width: 320px; margin: 15px 0; }
            .res-btn-g { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px; }
            .btn-r { padding: 14px; border-radius: 18px; font-weight: 900; font-size: 15px; cursor: pointer; border: none; text-align: center; text-decoration: none; text-transform: uppercase; }
            .btn-r-p { background: var(--primary-blue); color: white; box-shadow: 0 5px 0 var(--primary-dark); }
            .btn-r-o { background: white; color: var(--primary-blue); border: 3.5px solid var(--primary-blue); box-shadow: 0 5px 0 var(--primary-blue); padding: 10.5px; }
            .btn-r-m { background: #dce4ee; color: #5d7082; box-shadow: 0 5px 0 #b8c5d4; }
        </style>
        <div class="res-inner">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:25%; min-height:80px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color: var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center; line-height:1;">${rel.titulo}</h2>
            
            <div class="res-stats-c">
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos} / ${totalP}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempoFinal}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>

            <div class="res-btn-g">
                <button class="btn-r btn-r-p" onclick="location.reload()">Jogar de Novo</button>
                <button class="btn-r btn-r-o" onclick="openRDMenu()">Outro Tema / Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-r btn-r-m">Escolher outro jogo</a>
            </div>
        </div>
    `;

    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
