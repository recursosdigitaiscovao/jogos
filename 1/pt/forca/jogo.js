let currentCategory = 'frutos';
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
            <i class="fas fa-keyboard" style="font-size:60px; color:var(--primary-blue); margin-bottom:15px;"></i>
            <p style="font-weight:800; color:var(--text-grey); font-size:1.1rem;">Escolhe as letras certas para descobrir o nome da imagem!</p>
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
    
    targetWord = item.nome.toUpperCase();
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
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:15px;">
            <div style="display:flex; align-items:center; gap:20px; justify-content:center; flex-wrap:wrap; width:100%;">
                <!-- Forca SVG -->
                <div style="width:120px; height:150px; background:#fff; border-radius:15px; padding:10px; box-shadow:0 5px 15px rgba(0,0,0,0.05);">
                    <svg width="100" height="130" viewBox="0 0 100 130">
                        <line x1="10" y1="120" x2="90" y2="120" stroke="#3d7db8" stroke-width="4" />
                        <line x1="30" y1="120" x2="30" y2="10" stroke="#3d7db8" stroke-width="4" />
                        <line x1="30" y1="10" x2="70" y2="10" stroke="#3d7db8" stroke-width="4" />
                        <line x1="70" y1="10" x2="70" y2="25" stroke="#3d7db8" stroke-width="4" />
                        <circle id="h-head" cx="70" cy="35" r="10" stroke="#5d7082" stroke-width="3" fill="none" style="display:none" />
                        <line id="h-body" x1="70" y1="45" x2="70" y2="75" stroke="#5d7082" stroke-width="3" style="display:none" />
                        <line id="h-larm" x1="70" y1="55" x2="55" y2="65" stroke="#5d7082" stroke-width="3" style="display:none" />
                        <line id="h-rarm" x1="70" y1="55" x2="85" y2="65" stroke="#5d7082" stroke-width="3" style="display:none" />
                        <line id="h-lleg" x1="70" y1="75" x2="55" y2="90" stroke="#5d7082" stroke-width="3" style="display:none" />
                        <line id="h-rleg" x1="70" y1="75" x2="85" y2="90" stroke="#5d7082" stroke-width="3" style="display:none" />
                    </svg>
                </div>

                <!-- Pista (Nível 1 mostra imagem, Nível 2 esconde) -->
                <div style="width:130px; height:130px; background:white; border-radius:25px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,0,0,0.05);">
                    ${currentLevel === 1 ? 
                        `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width:100px; max-height:100px; object-fit:contain;">` : 
                        `<i class="fas fa-question" style="font-size:60px; color:#cbd9e6;"></i>`}
                </div>
            </div>

            <!-- Palavra -->
            <div id="word-container" style="display:flex; gap:8px; margin:15px 0; flex-wrap:wrap; justify-content:center;">
                ${updateWordDisplay()}
            </div>

            <!-- Teclado -->
            <div id="keyboard" style="display:flex; flex-wrap:wrap; gap:6px; justify-content:center; width:100%; max-width:600px; padding:10px;">
                ${"ABCDEFGHIJKLMNOPQRSTUVWXYZÇ".split('').map(l => `
                    <button class="key-btn" onclick="handleGuess(this, '${l}')" 
                        style="width:40px; height:40px; border:none; background:white; color:var(--text-grey); border-radius:10px; font-weight:900; font-size:18px; cursor:pointer; box-shadow:0 4px 0 #cbd9e6; transition:0.1s;">
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
        return `<div style="width:35px; border-bottom:4px solid var(--primary-blue); text-align:center; font-size:26px; font-weight:900; color:var(--primary-dark); min-height:35px; margin: 0 2px;">
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
        btn.style.background = "#eee";
        btn.style.color = "#ccc";
        btn.style.boxShadow = "none";
        btn.style.transform = "translateY(4px)";
        
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erroLetra);
        document.getElementById('score-val').innerText = score;
        
        updateHangmanVisual();
        
        if (mistakes >= maxMistakes) {
            handleRoundFailure();
        } else {
            sndErro.play();
        }
    }
};

function updateHangmanVisual() {
    const parts = ["h-head", "h-body", "h-larm", "h-rarm", "h-lleg", "h-rleg"];
    for (let i = 0; i < mistakes; i++) {
        const part = document.getElementById(parts[i]);
        if (part) part.style.display = "block";
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
