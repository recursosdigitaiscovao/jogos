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
        <div class="tut-container">
            <div class="tut-main">
                <img src="${JOGO_CONFIG.caminhoImg}${JOGO_CATEGORIAS.animais.itens[0].img}" class="tut-shadow-img">
            </div>
            <div class="tut-options">
                <div class="tut-card"></div>
                <div class="tut-card tut-correct">
                    <img src="${JOGO_CONFIG.caminhoImg}${JOGO_CATEGORIAS.animais.itens[0].img}">
                    <div class="tut-hand">☝️</div>
                </div>
                <div class="tut-card"></div>
            </div>
        </div>
        <style>
            .tut-container { display: flex; flex-direction: column; align-items: center; gap: 20px; }
            .tut-main { width: 100px; height: 100px; background: #f0f0f0; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
            .tut-shadow-img { width: 70%; filter: brightness(0); opacity: 0.3; }
            .tut-options { display: flex; gap: 10px; }
            .tut-card { width: 50px; height: 50px; background: white; border: 2px solid #ddd; border-radius: 10px; position: relative; }
            .tut-correct { border-color: var(--primary-blue); display: flex; align-items: center; justify-content: center; }
            .tut-correct img { width: 80%; }
            .tut-hand { 
                position: absolute; font-size: 35px; bottom: -30px; right: -15px;
                animation: tapMove 2s infinite; 
            }
            @keyframes tapMove {
                0%, 100% { transform: translate(0, 0); }
                50% { transform: translate(-10px, -20px) scale(1.1); }
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
            .game-wrapper {
                display: flex; flex-direction: column;
                width: 100%; height: 100%;
                justify-content: space-between; align-items: center;
                box-sizing: border-box; padding: 10px;
            }
            .shadow-zone {
                flex: 1; display: flex; align-items: center; justify-content: center;
                width: 100%; min-height: 0; 
                background: rgba(255,255,255,0.3); border-radius: 30px;
                margin-bottom: 15px;
            }
            .shadow-img {
                max-height: 85%; max-width: 85%; object-fit: contain;
                filter: brightness(0); opacity: 0.8; transition: 0.5s;
            }
            .options-container {
                display: grid; 
                grid-template-columns: repeat(3, 1fr); /* 3 colunas */
                gap: 12px; width: 100%; max-width: 600px;
                justify-items: center; align-items: center;
            }
            .card-option {
                background: white; border: 4px solid #eee; border-radius: 20px;
                width: 100%; 
                aspect-ratio: 1 / 1; /* FORÇA O QUADRADO */
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: 0.2s; box-shadow: 0 6px 0 #ddd;
                padding: 10px; box-sizing: border-box;
            }
            .card-option img { max-height: 90%; max-width: 90%; object-fit: contain; }
            .card-option:hover { border-color: var(--primary-blue); }
            .card-option:active { transform: translateY(3px); box-shadow: none; }

            .is-correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 6px 0 #5ea31a !important; }
            .is-wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 6px 0 #d13d3d !important; }

            /* AJUSTE PARA LANDSCAPE (Ecrãs deitados e curtos) */
            @media (orientation: landscape) and (max-height: 500px) {
                .game-wrapper { flex-direction: row; padding: 5px; gap: 15px; }
                .shadow-zone { margin-bottom: 0; height: 100%; }
                .options-container { 
                    grid-template-columns: 1fr; /* Muda para coluna */
                    width: auto; height: 100%; gap: 8px;
                }
                .card-option { height: 30%; width: auto; aspect-ratio: 1 / 1; }
            }
        </style>
        
        <div class="game-wrapper">
            <div class="shadow-zone">
                <img src="${JOGO_CONFIG.caminhoImg}${pergunta.img}" class="shadow-img" id="target-obj">
            </div>
            <div class="options-container">
                ${opcoes.map(opt => `
                    <div class="card-option" onclick="validarClique(this, ${opt.img === pergunta.img})">
                        <img src="${JOGO_CONFIG.caminhoImg}${opt.img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function validarClique(el, acerto) {
    const cards = document.querySelectorAll('.card-option');
    cards.forEach(c => c.style.pointerEvents = 'none');

    const obj = document.getElementById('target-obj');

    if (acerto) {
        acertos++;
        somAcerto.play();
        el.classList.add('is-correct');
        obj.style.filter = "none";
        obj.style.opacity = "1";
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++;
        somErro.play();
        el.classList.add('is-wrong');
        document.getElementById('miss-val').innerText = erros;
    }

    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < perguntas.length) {
            mostrarPergunta();
        } else {
            vitoria();
        }
    }, 1500);
}

function vitoria() {
    clearInterval(intervaloTempo);
    somVitoria.play();
    const p = (acertos / perguntas.length) * 100;
    const r = JOGO_CONFIG.relatorios.find(res => p >= res.min && p <= res.max);

    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('scr-result').classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    document.getElementById('res-tit').innerText = r.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoImg + r.img;
    document.getElementById('res-pts').innerText = acertos;
    document.getElementById('res-tim').innerText = document.getElementById('timer-val').innerText;
}
