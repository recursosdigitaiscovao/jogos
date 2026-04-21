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
        <div style="text-align:center; padding: 20px;">
             <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="30" r="15" fill="#ff5e5e" />
                <line x1="50" y1="45" x2="50" y2="70" stroke="#5d7082" stroke-width="2" />
                <circle cx="50" cy="80" r="8" fill="#3d7db8" />
             </svg>
            <p style="font-weight:800; color:var(--text-grey); font-size:1.1rem; margin-top:10px;">Não deixes os balões rebentarem!</p>
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

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:10px;">
            
            <div style="display:flex; flex-direction:column; align-items:center; position:relative; height:180px; width:200px;">
                <!-- Balões -->
                <svg width="200" height="180" viewBox="0 0 200 180" id="balloon-svg">
                    <!-- Cordas -->
                    <g id="strings" stroke="#aaa" stroke-width="1">
                        <line x1="100" y1="140" x2="50" y2="60" class="s-0" />
                        <line x1="100" y1="140" x2="70" y2="40" class="s-1" />
                        <line x1="100" y1="140" x2="100" y2="30" class="s-2" />
                        <line x1="100" y1="140" x2="130" y2="40" class="s-3" />
                        <line x1="100" y1="140" x2="150" y2="60" class="s-4" />
                        <line x1="100" y1="140" x2="100" y2="60" class="s-5" />
                    </g>
                    <!-- Círculos dos Balões -->
                    <circle cx="50" cy="60" r="15" fill="#ff5e5e" class="b-0" />
                    <circle cx="70" cy="40" r="15" fill="#ffce54" class="b-1" />
                    <circle cx="100" cy="30" r="15" fill="#4fc1e9" class="b-2" />
                    <circle cx="130" cy="40" r="15" fill="#a0d468" class="b-3" />
                    <circle cx="150" cy="60" r="15" fill="#ed5565" class="b-4" />
                    <circle cx="100" cy="60" r="15" fill="#ac92ec" class="b-5" />
                    
                    <!-- Boneco -->
                    <g id="character">
                        <circle cx="100" cy="150" r="10" fill="#3d7db8" />
                        <line x1="100" y1="160" x2="100" y2="175" stroke="#3d7db8" stroke-width="3" />
                        <line x1="100" y1="165" x2="85" y2="160" stroke="#3d7db8" stroke-width="2" />
                        <line x1="100" y1="165" x2="115" y2="160" stroke="#3d7db8" stroke-width="2" />
                    </g>
                </svg>
            </div>

            <div style="font-size:14px; font-weight:800; color:var(--primary-blue); background:#fff; padding:2px 10px; border-radius:10px;">
                TEMA: ${JOGO_CONFIG.categorias[currentCategory].nome.toUpperCase()}
            </div>

            <div id="word-container" style="display:flex; gap:6px; margin:10px 0; flex-wrap:wrap; justify-content:center;">
                ${updateWordDisplay()}
            </div>

            <div id="keyboard" style="display:flex; flex-wrap:wrap; gap:5px; justify-content:center; width:100%; max-width:550px;">
                ${"ABCDEFGHIJKLMNOPQRSTUVWXYZÇ".split('').map(l => `
                    <button class="key-btn" onclick="handleGuess(this, '${l}')" 
                        style="width:38px; height:38px; border:none; background:white; color:var(--text-grey); border-radius:8px; font-weight:900; font-size:16px; cursor:pointer; box-shadow:0 3px 0 #cbd9e6; transition:0.1s;">
                        ${l}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function updateWordDisplay() {
    return targetWord.split('').map(letter => {
        const isRevealed = guessedLetters.includes(letter) || letter === " " || letter === "-";
        return `<div style="width:30px; border-bottom:3px solid var(--primary-blue); text-align:center; font-size:22px; font-weight:900; color:var(--primary-dark); min-height:30px; margin: 0 2px;">
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
        btn.style.boxShadow = "0 3px 0 #66a318";
        document.getElementById('word-container').innerHTML = updateWordDisplay();
        
        if (targetWord.split('').every(l => guessedLetters.includes(l) || l === " " || l === "-")) {
            handleRoundSuccess();
        }
    } else {
        mistakes++;
        btn.style.background = "#eee";
        btn.style.color = "#ccc";
        btn.style.boxShadow = "none";
        btn.style.transform = "translateY(3px)";
        
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erroLetra);
        document.getElementById('score-val').innerText = score;
        
        updateBalloonsVisual();
        
        if (mistakes >= maxMistakes) {
            handleRoundFailure();
        } else {
            sndErro.play();
        }
    }
};

function updateBalloonsVisual() {
    const idx = mistakes - 1;
    const balloon = document.querySelector(`.b-${idx}`);
    const string = document.querySelector(`.s-${idx}`);
    if (balloon) balloon.style.display = "none";
    if (string) string.style.display = "none";
    
    // Se for o último erro, faz o boneco cair
    if (mistakes === maxMistakes) {
        const char = document.getElementById('character');
        char.style.transition = "transform 1s ease-in";
        char.style.transform = "translateY(100px)";
        char.style.opacity = "0";
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
    document.getElementById('word-container').style.opacity = "0.6";
    document.querySelectorAll('.key-btn').forEach(b => b.disabled = true);
    setTimeout(nextRound, 2000);
}

function nextRound() {
    currentIndex++; roundInLevel++;
    if (roundInLevel < 5) {
        renderRound();
    } else {
        if (currentLevel === 1) {
            currentLevel = 2; roundInLevel = 0;
            setupDots(); renderRound();
        } else {
            finishGame();
        }
    }
}

function finishGame() {
    if(timerInterval) clearInterval(timerInterval);
    sndVitoria.play();
    document.getElementById('res-pts').innerText = score;
    const t = document.getElementById('timer').innerText.replace('⏳ ', '');
    document.getElementById('res-tim').innerText = t;
    
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
