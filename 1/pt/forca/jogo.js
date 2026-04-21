let currentCategory = 'animais';
let gameItems = [];
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;

let targetWord = "";
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

document.addEventListener('DOMContentLoaded', () => {
    if (window.initUI) window.initUI();
    const rd1 = document.getElementById('rd-intro-btn');
    const rd2 = document.getElementById('rd-game-btn');
    if(rd1) rd1.src = JOGO_CONFIG.caminhoImg + "rd.png";
    if(rd2) rd2.src = JOGO_CONFIG.caminhoImg + "rd.png";
    window.selectCategory(Object.keys(JOGO_CONFIG.categorias)[0]);
});

window.selectCategory = function(key) {
    currentCategory = key;
    const cat = JOGO_CONFIG.categorias[key];
    if(!cat) return;
    let all = [...cat.itens].sort(() => Math.random() - 0.5);
    gameItems = all.slice(0, 10);

    renderTutorial();

    if(document.getElementById('scr-result').classList.contains('active')) {
        document.getElementById('scr-result').classList.remove('active');
        document.getElementById('scr-intro').classList.add('active');
        document.body.classList.add('with-footer');
        document.body.classList.remove('no-footer');
        document.getElementById('status-bar').style.display = 'none';
        document.getElementById('main-game-title').style.display = 'block';
    }
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
};

function renderTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `
        <div style="text-align:center; padding: 10px;">
            <svg width="120" height="150" viewBox="0 0 100 120">
                <circle cx="50" cy="30" r="12" fill="#ff5e5e">
                    <animate attributeName="cy" values="30;25;30" dur="3s" repeatCount="indefinite" />
                </circle>
                <line x1="50" y1="42" x2="50" y2="70" stroke="#aaa" stroke-width="1" />
                <g id="tuto-char">
                    <circle cx="50" cy="80" r="8" fill="#3d7db8" />
                    <line x1="50" y1="88" x2="50" y2="105" stroke="#3d7db8" stroke-width="2" />
                    <animateTransform attributeName="transform" type="translate" values="0,0; 0,5; 0,0" dur="3s" repeatCount="indefinite" />
                </g>
            </svg>
            <p style="font-weight:800; color:var(--text-grey); margin-top:10px;">Clica nas letras para salvar o boneco!</p>
        </div>
    `;
}

window.initGame = function() {
    currentIndex = 0; roundInLevel = 0; currentLevel = 1; score = 0; timerSeconds = 0;
    document.getElementById('score-val').innerText = score;
    setupDots();
    startTimer();
    renderRound();
};

function setupDots() {
    const dc = document.getElementById('dots-container');
    if(dc) {
        dc.innerHTML = '';
        for(let i=0; i<5; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dc.appendChild(dot);
        }
    }
}

function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds++;
        const min = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const sec = (timerSeconds % 60).toString().padStart(2, '0');
        const t = document.getElementById('timer');
        if(t) t.innerText = `⏳ ${min}:${sec}`;
    }, 1000);
}

function renderRound() {
    const item = gameItems[currentIndex];
    if(!item) { finishGame(); return; }
    
    targetWord = item.letras.toUpperCase();
    guessedLetters = [];
    mistakes = 0;

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:5px;">
            
            <!-- CATEGORIA -->
            <div style="font-size:16px; font-weight:900; color:white; background:var(--primary-blue); padding:5px 20px; border-radius:30px; margin-bottom:10px; box-shadow: 0 4px 0 var(--primary-dark);">
                TEMA: ${JOGO_CONFIG.categorias[currentCategory].nome.toUpperCase()}
            </div>

            <!-- ÁREA VISUAL DOS BALÕES -->
            <div style="height:170px; width:220px; position:relative; background: rgba(255,255,255,0.3); border-radius: 20px; margin-bottom: 10px;">
                <svg width="220" height="170" viewBox="0 0 200 160" id="balloon-svg">
                    <defs>
                        <radialGradient id="grad" cx="40%" cy="40%" r="50%">
                            <stop offset="0%" style="stop-color:white;stop-opacity:0.3" />
                            <stop offset="100%" style="stop-color:black;stop-opacity:0" />
                        </radialGradient>
                    </defs>
                    <g id="strings" stroke="#999" stroke-width="1.5">
                        <line x1="100" y1="130" x2="40" y2="60" class="s-0" />
                        <line x1="100" y1="130" x2="70" y2="40" class="s-1" />
                        <line x1="100" y1="130" x2="100" y2="30" class="s-2" />
                        <line x1="100" y1="130" x2="130" y2="40" class="s-3" />
                        <line x1="100" y1="130" x2="160" y2="60" class="s-4" />
                        <line x1="100" y1="130" x2="100" y2="60" class="s-5" />
                    </g>
                    <circle cx="40" cy="60" r="16" fill="#ff5e5e" class="b-0" />
                    <circle cx="70" cy="40" r="16" fill="#ffce54" class="b-1" />
                    <circle cx="100" cy="30" r="16" fill="#4fc1e9" class="b-2" />
                    <circle cx="130" cy="40" r="16" fill="#a0d468" class="b-3" />
                    <circle cx="160" cy="60" r="16" fill="#ed5565" class="b-4" />
                    <circle cx="100" cy="60" r="16" fill="#ac92ec" class="b-5" />
                    
                    <g id="character">
                        <circle cx="100" cy="140" r="10" fill="#3d7db8" />
                        <line x1="100" y1="150" x2="100" y2="165" stroke="#3d7db8" stroke-width="3" />
                        <line x1="100" y1="155" x2="85" y2="150" stroke="#3d7db8" stroke-width="2" />
                        <line x1="100" y1="155" x2="115" y2="150" stroke="#3d7db8" stroke-width="2" />
                    </g>
                </svg>
            </div>

            <!-- PALAVRA -->
            <div id="word-container" style="display:flex; gap:10px; margin-bottom: 15px;">
                ${updateWordDisplay()}
            </div>

            <!-- TECLADO COM MAIS PADDING -->
            <div id="keyboard" style="display:flex; flex-direction:column; gap:12px; align-items:center; width:100%;">
                <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;">
                    ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => createKey(l)).join('')}
                </div>
                <!-- LINHA DE ACENTOS -->
                <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; background: rgba(0,0,0,0.03); padding: 8px; border-radius: 15px;">
                    ${"ÁÉÍÓÚÂÊÔÃÕÇ".split('').map(l => createKey(l)).join('')}
                </div>
            </div>
        </div>
    `;
}

function createKey(l) {
    return `<button class="key-btn" onclick="handleGuess(this, '${l}')" 
        style="width:42px; height:42px; border:none; background:white; color:var(--text-grey); border-radius:12px; font-weight:900; font-size:18px; cursor:pointer; box-shadow:0 4px 0 #cbd9e6; transition:0.1s;">
        ${l}
    </button>`;
}

function updateWordDisplay() {
    return targetWord.split('').map(letter => {
        const isRevealed = guessedLetters.includes(letter) || letter === " " || letter === "-";
        return `<div style="width:35px; border-bottom:4px solid var(--primary-blue); text-align:center; font-size:28px; font-weight:900; color:var(--primary-dark); min-height:40px;">
                    ${isRevealed ? letter : ""}
                </div>`;
    }).join('');
}

window.handleGuess = function(btn, letter) {
    if (guessedLetters.includes(letter) || mistakes >= maxMistakes) return;

    btn.disabled = true;
    guessedLetters.push(letter);

    if (targetWord.includes(letter)) {
        btn.style.background = "var(--highlight-green)";
        btn.style.color = "white";
        btn.style.boxShadow = "0 4px 0 #66a318";
        document.getElementById('word-container').innerHTML = updateWordDisplay();
        
        if (targetWord.split('').every(l => guessedLetters.includes(l) || l === " " || l === "-")) {
            handleRoundSuccess();
        }
    } else {
        mistakes++;
        btn.style.background = "#ddd";
        btn.style.color = "#aaa";
        btn.style.boxShadow = "none";
        btn.style.transform = "translateY(4px)";
        
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erroLetra);
        document.getElementById('score-val').innerText = score;
        
        updateBalloonsVisual();
        
        if (mistakes >= maxMistakes) handleRoundFailure();
        else sndErro.play();
    }
};

function updateBalloonsVisual() {
    const idx = mistakes - 1;
    const balloon = document.querySelector(`.b-${idx}`);
    const string = document.querySelector(`.s-0`); // Simplificado: remove cordas
    if (balloon) {
        balloon.style.transition = "0.2s";
        balloon.style.transform = "scale(1.5)";
        balloon.style.opacity = "0";
        setTimeout(() => balloon.style.display = "none", 200);
    }
    
    if (mistakes === maxMistakes) {
        const char = document.getElementById('character');
        char.style.transition = "transform 1s cubic-bezier(0.45, 0.05, 0.55, 0.95)";
        char.style.transform = "translateY(150px)";
        char.style.opacity = "0";
        document.querySelectorAll('line').forEach(l => l.style.display = "none");
    }
}

function handleRoundSuccess() {
    sndAcerto.play();
    score += (currentLevel === 2) ? JOGO_CONFIG.pontuacao.acertoNivel2 : JOGO_CONFIG.pontuacao.acertoNivel1;
    document.getElementById('score-val').innerText = score;
    document.querySelectorAll('.key-btn').forEach(b => b.disabled = true);
    setTimeout(nextRound, 1200);
}

function handleRoundFailure() {
    sndErro.play();
    guessedLetters = targetWord.split('');
    document.getElementById('word-container').innerHTML = updateWordDisplay();
    document.getElementById('word-container').style.opacity = "0.5";
    document.querySelectorAll('.key-btn').forEach(b => b.disabled = true);
    setTimeout(nextRound, 2000);
}

function nextRound() {
    currentIndex++; roundInLevel++;
    if (roundInLevel < 5) renderRound();
    else if (currentLevel === 1) {
        currentLevel = 2; roundInLevel = 0;
        setupDots(); renderRound();
    } else finishGame();
}

function finishGame() {
    if(timerInterval) clearInterval(timerInterval);
    sndVitoria.play();
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText.replace('⏳ ', '');
    let rel = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
    if(window.goToResult) window.goToResult();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
