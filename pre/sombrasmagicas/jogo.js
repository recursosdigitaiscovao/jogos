// Variáveis de Estado do Jogo
let categoriaAtual = "animais"; 
let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

// Sons
const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

/**
 * Inicia o motor do jogo (chamado pelo initUI do index)
 */
window.startLogic = function() {
    selecionarCategoria(Object.keys(JOGO_CATEGORIAS)[0]);
};

/**
 * Texto da instrução na intro
 */
window.gerarIntroJogo = function() {
    return "Consegues descobrir a quem pertence esta sombra? Observa com atenção e escolhe a imagem correta!";
};

/**
 * Seleciona e prepara os dados da categoria
 */
function selecionarCategoria(key) {
    categoriaAtual = key;
    const cat = JOGO_CATEGORIAS[key];
    
    // Embaralhar itens e selecionar 10 para a ronda
    let todosItens = [...cat.itens];
    perguntas = todosItens.sort(() => Math.random() - 0.5).slice(0, 10);
}

/**
 * Inicia a partida (chamado pelo botão JOGAR)
 */
window.initGame = function() {
    indicePergunta = 0;
    acertos = 0;
    erros = 0;
    
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    
    iniciarCronometro();
    mostrarPergunta();
};

/**
 * Cronómetro
 */
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

/**
 * Monta o cenário da pergunta atual
 */
function mostrarPergunta() {
    const gameBox = document.getElementById('game-main-content');
    const perguntaAtual = perguntas[indicePergunta];
    
    // Atualizar status bar
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / ${perguntas.length}`;

    // Criar opções (1 correta + 2 aleatórias da mesma categoria)
    let outrasOpcoes = JOGO_CATEGORIAS[categoriaAtual].itens
        .filter(i => i.id !== perguntaAtual.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    
    let opcoes = [perguntaAtual, ...outrasOpcoes].sort(() => Math.random() - 0.5);

    // Renderizar HTML Dinâmico para ocupar o espaço
    gameBox.innerHTML = `
        <style>
            .game-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                width: 100%;
                height: 100%;
                gap: 15px;
            }
            .shadow-container {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                max-height: 50%;
            }
            .shadow-img {
                height: 100%;
                max-width: 80%;
                object-fit: contain;
                filter: brightness(0); /* Transforma a imagem em sombra */
                opacity: 0.8;
                drop-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .options-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                width: 100%;
                padding: 10px;
                flex-shrink: 0;
            }
            .opt-card {
                background: white;
                border: 4px solid #eee;
                border-radius: 20px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                aspect-ratio: 1/1;
                box-shadow: 0 6px 0 #ddd;
            }
            .opt-card:hover { transform: translateY(-3px); box-shadow: 0 9px 0 #ddd; border-color: var(--primary-blue); }
            .opt-card:active { transform: translateY(3px); box-shadow: 0 3px 0 #ddd; }
            .opt-card img { width: 100%; height: 100%; object-fit: contain; }
            
            .feedback-correct { border-color: #7ed321 !important; background: #f0fff0 !important; box-shadow: 0 6px 0 #5ea31a !important; }
            .feedback-wrong { border-color: #ff5e5e !important; background: #fff5f5 !important; box-shadow: 0 6px 0 #d13d3d !important; }

            @media (max-width: 500px) {
                .options-container { gap: 8px; }
                .opt-card { padding: 8px; border-width: 3px; }
            }
        </style>
        
        <div class="game-wrapper">
            <div class="shadow-container">
                <img src="${JOGO_CONFIG.caminhoImg}${perguntaAtual.img}" class="shadow-img" id="main-shadow">
            </div>
            <div class="options-container">
                ${opcoes.map(opt => `
                    <div class="opt-card" onclick="verificarResposta(this, ${opt.id === perguntaAtual.id})">
                        <img src="${JOGO_CONFIG.caminhoImg}${opt.img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Verifica se o clique foi correto
 */
function verificarResposta(elemento, isCorrect) {
    // Bloquear múltiplos cliques
    const allCards = document.querySelectorAll('.opt-card');
    allCards.forEach(c => c.style.pointerEvents = 'none');

    if (isCorrect) {
        acertos++;
        somAcerto.play();
        elemento.classList.add('feedback-correct');
        document.getElementById('hits-val').innerText = acertos;
        // Remover a sombra para mostrar a imagem real
        document.getElementById('main-shadow').style.filter = 'none';
    } else {
        erros++;
        somErro.play();
        elemento.classList.add('feedback-wrong');
        document.getElementById('miss-val').innerText = erros;
        // Destacar a correta
        allCards.forEach((c, idx) => {
            // Lógica simples para achar a correta no DOM se necessário
        });
    }

    setTimeout(() => {
        proximaPergunta();
    }, 1500);
}

/**
 * Avança ou termina o jogo
 */
function proximaPergunta() {
    indicePergunta++;
    if (indicePergunta < perguntas.length) {
        mostrarPergunta();
    } else {
        finalizarJogo();
    }
}

/**
 * Ecrã Final
 */
function finalizarJogo() {
    clearInterval(intervaloTempo);
    somVitoria.play();
    
    const total = perguntas.length;
    const perc = (acertos / total) * 100;
    
    // Escolher relatório
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('scr-result').classList.add('active');
    document.getElementById('status-bar').style.display = 'none';
    
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoImg + rel.img;
    document.getElementById('res-pts').innerText = acertos;
    document.getElementById('res-tim').innerText = document.getElementById('timer-val').innerText;
}
