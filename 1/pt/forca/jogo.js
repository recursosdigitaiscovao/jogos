let currentCategory = 'animais';
let gameItems = [];
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;

let targetWord = "";
let guessedLetters = []; // Armazena a versão "base" (sem acento) clicada
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
            <i class="fas fa-🎈" style="font-size:50px; color:#ff5e5e;"></i>
            <p style="font-weight:800; color:var(--text-grey); margin-top:10px;">Salva o boneco adivinhando as letras!</p>
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

// Função para remover acentos para comparação
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
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
            
            <div style="font-size:16px; font-weight:900; color:white; background:var(--primary-blue); padding:5px 20px; border-radius:30px; margin-bottom:5px;">
                TEMA: ${JOGO_CONFIG.categorias[currentCategory].nome.toUpperCase()}
            </div>

            <div style="height:160px; width:220px; position:relative; background: rgba(255,255,255,0.4); border-radius: 25px;">
                <svg width="220" height="160" viewBox="0 0 200 160">
                    <g id="strings" stroke="#999" stroke-width="1.5">
                        ${[60, 40, 30, 40, 60, 60].map((y, i) => `<line x1="100" y1="130" x2="${[40,70,100,130,160,100][i]}" y2="${y}" class="s-${i}" />`).join('')}
                    </g>
                    <circle cx="40" cy="60" r="15" fill="#ff5e5e" class="b-0" />
                    <circle cx="70" cy="40" r="15" fill="#ffce54" class="b-1" />
                    <circle cx="100" cy="30" r="15" fill="#4fc1e9" class="b-2" />
                    <circle cx="130" cy="40" r="15" fill="#a0d468" class="b-3" />
                    <circle cx="160" cy="60" r="15" fill="#ed5565" class="b-4" />
                    <circle cx="100" cy="60" r="15" fill="#ac92ec" class="b-5" />
                    
                    <g id="character">
                        <circle cx="100" cy="140" r="10" fill="#3d7db8" />
                        <line x1="100" y1="150" x2="100" y2="165" stroke="#3d7db8" stroke-width="3" />
                        <line x1="100" y1="155" x2="85" y2="150" stroke="#3d7db8" stroke-width="2" />
                        <line x1="100" y1="155" x2="115" y2="150" stroke="#3d7db8" stroke-width="2" />
                    </g>
                </svg>
            </div>

            <div id="word-container" style="display:flex; gap:8px; margin: 10px 0;">
                ${updateWordDisplay()}
            </div>

            <div id="keyboard" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; width:100%; max-width:550px; padding: 0 10px;">
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
        const baseLetter = removeAccents(letter);
        const isRevealed = guessedLetters.includes(baseLetter) || letter === " " || letter === "-";
        return `<div style="width:30px; border-bottom:4px solid var(--primary-blue); text-align:center; font-size:26px; font-weight:900; color:var(--primary-dark); min-height:35px;">
                    ${isRevealed ? letter : ""}
                </div>`;
    }).join('');
}

window.handleGuess = function(btn, clickedLetter) {
    if (guessedLetters.includes(clickedLetter) || mistakes >= maxMistakes) return;

    btn.disabled = true;
    
    // Comparação inteligente: Verificamos se a letra clicada (sem acento) existe na palavra (também normalizada)
    const normalizedTarget = removeAccents(targetWord);
    
    if (normalizedTarget.includes(clickedLetter)) {
        // ACERTO
        guessedLetters.push(clickedLetter);
        btn.style.background = "var(--highlight-green)";
        btn.style.color = "white";
        btn.style.boxShadow = "0 4px 0 #66a318";
        document.getElementById('word-container').innerHTML = updateWordDisplay();
        
        // Verificar vitória
        const allRevealed = targetWord.split('').every(l => guessedLetters.includes(removeAccents(l)) || l === " " || l === "-");
        if (allRevealed) handleRoundSuccess();
    } else {
        // ERRO
        mistakes++;
        btn.style.background = "#ddd";
        btn.style.color = "#aaa";
        btn.style.boxShadow = "none";
        btn.style.transform = "translateY(4px)";
        
        updateBalloonsVisual();
        
        if (mistakes >= maxMistakes) handleRoundFailure();
        else sndErro.play();
    }
};

function updateBalloonsVisual() {
    const idx = mistakes - 1;
    const balloon = document.querySelector(`.b-${idx}`);
    const string = document.querySelector(`.s-${idx}`);
    if (balloon) {
        balloon.style.transition = "0.3s";
        balloon.style.transform = "scale(1.5)";
        balloon.style.opacity = "0";
    }
    if (string) string.style.opacity = "0";
    
    if (mistakes === maxMistakes) {
        const char = document.getElementById('character');
        char.style.transition = "transform 1s ease-in";
        char.style.transform = "translateY(200px)";
        char.style.opacity = "0";
    }
}

function handleRoundSuccess() {
    sndAcerto.play();
    score += (currentLevel === 2) ? JOGO_CONFIG.pontuacao.vitoria : JOGO_CONFIG.pontuacao.vitoria;
    document.getElementById('score-val').innerText = score;
    document.querySelectorAll('.key-btn').forEach(b => b.disabled = true);
    setTimeout(nextRound, 1000);
}

function handleRoundFailure() {
    sndErro.play();
    score = Math.max(0, score - JOGO_CONFIG.pontuacao.derrota);
    document.getElementById('score-val').innerText = score;
    
    // Revelar palavra
    guessedLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÇ".split('');
    document.getElementById('word-container').innerHTML = updateWordDisplay();
    document.getElementById('word-container').style.opacity = "0.5";
    
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
            setupDots(); // Reseta as bolinhas para o nível 2
            renderRound();
        } else {
            finishGame();
        }
    }
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
