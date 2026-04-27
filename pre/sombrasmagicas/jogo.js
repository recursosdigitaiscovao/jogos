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
    selecionarCategoria(Object.keys(JOGO_CATEGORIAS)[0]);
    criarAnimacaoTutorial();
};

window.gerarIntroJogo = function() {
    return "Observa a sombra e escolhe o desenho correto!";
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;

    container.innerHTML = `
        <div class="tut-box">
            <div class="tut-item">
                <img src="${JOGO_CONFIG.caminhoImg}${JOGO_CATEGORIAS.animais.itens[0].img}" class="tut-shadow">
                <div class="tut-hand">☝️</div>
            </div>
            <div class="tut-options">
                <div class="tut-opt"></div>
                <div class="tut-opt tut-active">
                     <img src="${JOGO_CONFIG.caminhoImg}${JOGO_CATEGORIAS.animais.itens[0].img}">
                </div>
                <div class="tut-opt"></div>
            </div>
        </div>
        <style>
            .tut-box { display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: 0.8; }
            .tut-item { position: relative; width: 80px; height: 80px; background: #eee; border-radius: 15px; display: flex; align-items: center; justify-content: center; }
            .tut-shadow { width: 70%; filter: brightness(0); opacity: 0.5; }
            .tut-options { display: flex; gap: 5px; }
            .tut-opt { width: 40px; height: 40px; border: 2px solid #ddd; border-radius: 8px; background: white; }
            .tut-active { border-color: var(--primary-blue); position: relative; }
            .tut-active img { width: 80%; margin: 10%; }
            .tut-hand { 
                position: absolute; font-size: 30px; bottom: -40px; right: -10px;
                animation: tapTap 2s infinite; pointer-events: none;
            }
            @keyframes tapTap {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-30px) scale(1.2); }
            }
        </style>
    `;
}

// === 2. LÓGICA DO JOGO ===

function selecionarCategoria(key) {
    categoriaAtual = key;
    const cat = JOGO_CATEGORIAS[key];
    perguntas = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
}

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

    // Gerar 3 opções (1 certa + 2 erradas)
    let erradas = JOGO_CATEGORIAS[categoriaAtual].itens
        .filter(i => i.img !== pergunta.img)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    
    let opcoes = [pergunta, ...erradas].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-screen {
                display: flex; flex-direction: column;
                width: 100%; height: 100%;
                justify-content: space-between; align-items: center;
                padding: 1vh; box-sizing: border-box;
            }
            /* Contentor da Sombra - Ocupa o topo */
            .main-shadow-container {
                flex: 1; display: flex; align-items: center; justify-content: center;
                width: 100%; min-height: 0; background: rgba(255,255,255,0.4);
                border-radius: 25px; margin-bottom: 15px;
            }
            .img-target {
                max-height: 85%; max-width: 85%; object-fit: contain;
                filter: brightness(0); opacity: 0.8; transition: 0.4s;
            }
            /* Grelha das 3 Opções */
            .options-row {
                display: grid; grid-template-columns: repeat(3, 1fr);
                gap: 15px; width: 100%; max-width: 700px;
                height: 25vh; /* Altura baseada no ecrã */
                max-height: 180px; min-height: 100px;
            }
            .card-choice {
                background: white; border: 4px solid #eee; border-radius: 20px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 5px 0 #ddd;
                padding: 10px; position: relative; overflow: hidden;
            }
            .card-choice img { max-height: 85%; max-width: 85%; object-fit: contain; }
            .card-choice:hover { border-color: var(--primary-blue); transform: translateY(-2px); }
            .card-choice:active { transform: translateY(3px); box-shadow: none; }

            .correct-card { background: #eaffea !important; border-color: #7ed321 !important; box-shadow: 0 5px 0 #5ea31a !important; }
            .wrong-card { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 5px 0 #d13d3d !important; }

            /* AJUSTE LANDSCAPE EXTREMO (Ex: telemóvel deitado) */
            @media (orientation: landscape) and (max-height: 500px) {
                .game-screen { flex-direction: row; gap: 15px; }
                .main-shadow-container { height: 100%; margin-bottom: 0; }
                .options-row { 
                    grid-template-columns: 1fr; grid-template-rows: repeat(3, 1fr);
                    width: 150px; height: 100%; max-height: none;
                }
                .card-choice { border-width: 2px; padding: 5px; }
            }
        </style>
        
        <div class="game-screen">
            <div class="main-shadow-container">
                <img src="${JOGO_CONFIG.caminhoImg}${pergunta.img}" class="img-target" id="shadow-obj">
            </div>
            <div class="options-row">
                ${opcoes.map(opt => `
                    <div class="card-choice" onclick="verificarClique(this, ${opt.img === pergunta.img})">
                        <img src="${JOGO_CONFIG.caminhoImg}${opt.img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function verificarClique(elemento, isCorrect) {
    const todos = document.querySelectorAll('.card-choice');
    todos.forEach(c => c.style.pointerEvents = 'none');

    const sombra = document.getElementById('shadow-obj');

    if (isCorrect) {
        acertos++;
        somAcerto.play();
        elemento.classList.add('correct-card');
        sombra.style.filter = "none";
        sombra.style.opacity = "1";
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++;
        somErro.play();
        elemento.classList.add('wrong-card');
        document.getElementById('miss-val').innerText = erros;
    }

    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < perguntas.length) {
            mostrarPergunta();
        } else {
            finalizarJogo();
        }
    }, 1500);
}

function finalizarJogo() {
    clearInterval(intervaloTempo);
    somVitoria.play();
    const perc = (acertos / perguntas.length) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);

    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('scr-result').classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoImg + rel.img;
    document.getElementById('res-pts').innerText = acertos;
    document.getElementById('res-tim').innerText = document.getElementById('timer-val').innerText;
}
