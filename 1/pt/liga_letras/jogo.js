let currentCategory = 'animais';
let gameItems = [];
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let currentWordProgress = ""; 

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

    renderTutorial(cat);

    if(document.getElementById('scr-result').classList.contains('active')) {
        document.getElementById('scr-result').classList.remove('active');
        document.getElementById('scr-intro').classList.add('active');
        document.body.classList.add('with-footer');
        document.body.classList.remove('no-footer');
        document.getElementById('status-bar').style.display = 'none';
        document.getElementById('main-game-title').style.display = 'block';
    }

    if(document.getElementById('scr-game').classList.contains('active')) {
        window.initGame();
    }
};

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const item = cat.itens[0];
    
    container.innerHTML = `
        <div style="position:relative; width:260px; height:200px; background:white; border-radius:25px; box-shadow:0 10px 30px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; border: 4px solid #f0f7ff;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:70px; z-index:2;">
            <div id="tuto-letter" style="position:absolute; width:40px; height:40px; background:var(--primary-blue); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; top:20px; left:110px; z-index:3;">${item.nome[0]}</div>
            <i class="fas fa-hand-pointer" id="tuto-hand" style="position:absolute; top:45px; left:130px; color:#f39c12; font-size:24px; z-index:4;"></i>
        </div>
        <style>
            @keyframes tapLetter { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.8); } }
            #tuto-hand { animation: tapLetter 1.5s infinite; }
        </style>
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
    if(!item) return;
    const isLevel2 = (currentLevel === 2);
    currentWordProgress = "";

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    
    // Criar as letras embaralhadas
    let letters = item.nome.split('');
    let shuffledLetters = [...letters].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; position:relative; min-height:350px;">
            
            <div id="word-display" style="font-size:32px; font-weight:900; color:var(--primary-blue); letter-spacing:8px; margin-bottom:10px; height:40px;">
                ${isLevel2 ? item.nome.split('').map(()=>'_').join(' ') : item.nome}
            </div>

            <div id="current-typing" style="font-size:32px; font-weight:900; color:var(--highlight-green); letter-spacing:8px; height:40px; margin-bottom:20px;"></div>

            <div class="circle-container" style="position:relative; width:220px; height:220px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:100px; max-width:130px; object-fit:contain; z-index:2;">
                ${shuffledLetters.map((l, i) => {
                    const angle = (360 / shuffledLetters.length) * i;
                    return `
                        <button class="letter-btn" onclick="handleLetterClick(this, '${l}')" 
                            style="position:absolute; width:55px; height:55px; border-radius:50%; border:none; background:var(--primary-blue); color:white; font-size:24px; font-weight:900; cursor:pointer; box-shadow:0 4px 0 var(--primary-dark); transform: rotate(${angle}deg) translate(105px) rotate(-${angle}deg); transition: 0.2s;">
                            ${l}
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

window.handleLetterClick = function(btn, letter) {
    const item = gameItems[currentIndex];
    const targetChar = item.nome[currentWordProgress.length];

    if (letter === targetChar) {
        // ACERTO DA LETRA
        currentWordProgress += letter;
        btn.style.background = "var(--highlight-green)";
        btn.style.boxShadow = "0 4px 0 #66a318";
        btn.disabled = true;
        
        document.getElementById('current-typing').innerText = currentWordProgress;

        if (currentWordProgress === item.nome) {
            handleRoundSuccess();
        }
    } else {
        // ERRO
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        
        // Feedback visual de erro
        btn.style.background = "var(--error-red)";
        btn.style.boxShadow = "0 4px 0 #cc4b4b";
        
        setTimeout(() => {
            renderRound(); // Reinicia a tentativa da palavra
        }, 400);
    }
};

function handleRoundSuccess() {
    sndAcerto.play();
    score += (currentLevel === 2) ? JOGO_CONFIG.pontuacao.acertoNivel2 : JOGO_CONFIG.pontuacao.acertoNivel1;
    document.getElementById('score-val').innerText = score;
    
    setTimeout(nextRound, 800);
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
