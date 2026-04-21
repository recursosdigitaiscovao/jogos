let currentCategory = 'numeros';
let gameItems = [];
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

document.addEventListener('DOMContentLoaded', () => {
    if (window.initUI) window.initUI();
    
    const rd1 = document.getElementById('rd-intro-btn');
    const rd2 = document.getElementById('rd-game-btn');
    if(rd1) rd1.src = JOGO_CONFIG.caminhoImg + "rd.png";
    if(rd2) rd2.src = JOGO_CONFIG.caminhoImg + "rd.png";

    // Carregar categoria inicial
    const primeiraCat = Object.keys(JOGO_CONFIG.categorias)[0];
    window.selectCategory(primeiraCat);
});

// ESTA FUNÇÃO AGORA REINICIA O ESTADO DOS ECRÃS
window.selectCategory = function(key) {
    currentCategory = key;
    const cat = JOGO_CONFIG.categorias[key];
    if(!cat) return;

    let all = [...cat.itens].sort(() => Math.random() - 0.5);
    gameItems = all.slice(0, 10);

    renderTutorial(cat);

    // SE ESTIVER NO RELATÓRIO: Volta para a Intro para ver o novo tutorial
    if(document.getElementById('scr-result').classList.contains('active')) {
        document.getElementById('scr-result').classList.remove('active');
        document.getElementById('scr-intro').classList.add('active');
        document.body.classList.add('with-footer');
        document.body.classList.remove('no-footer');
        document.getElementById('status-bar').style.display = 'none';
        document.getElementById('main-game-title').style.display = 'block';
    }

    // SE ESTIVER NO MEIO DO JOGO: Reinicia o jogo com a nova categoria
    if(document.getElementById('scr-game').classList.contains('active')) {
        window.initGame();
    }
};

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const item = cat.itens[0];
    
    container.innerHTML = `
        <div style="position:relative; width:260px; height:180px; background:white; border-radius:25px; box-shadow:0 10px 30px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; justify-content:center; border: 4px solid #f0f7ff; margin-bottom:15px;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:65px; margin-bottom:10px;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:16px; margin-bottom:10px; letter-spacing:2px;">${item.nome}</div>
            <div style="width:140px; height:35px; border:3px solid #eee; border-radius:10px; display:flex; align-items:center; padding-left:10px; background:#fafafa;">
                <span id="tuto-text" style="font-weight:900; font-size:16px; color:var(--highlight-green);"></span>
                <span style="width:2px; height:18px; background:var(--primary-blue); margin-left:2px; animation: blink 0.8s infinite;"></span>
            </div>
        </div>
        <style> @keyframes blink { 50% { opacity: 0; } } </style>
    `;
    
    let i = 0;
    const txt = item.nome;
    if(window.tutoInterval) clearInterval(window.tutoInterval);
    window.tutoInterval = setInterval(() => {
        const introActive = document.getElementById('scr-intro').classList.contains('active');
        if(!introActive) { clearInterval(window.tutoInterval); return; }
        const el = document.getElementById('tuto-text');
        if(el) el.innerText = txt.substring(0, i);
        i = (i > txt.length) ? 0 : i + 1;
    }, 400);
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

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:15px; padding:10px;">
            
            <div style="background:white; padding:15px; border-radius:30px; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:130px; max-width:220px; object-fit:contain;">
            </div>

            <div id="word-to-copy" style="font-size:32px; font-weight:900; color:var(--primary-blue); letter-spacing:5px; height:40px;">
                ${isLevel2 ? '???' : item.nome}
            </div>

            <input type="text" id="game-input" autocomplete="off" spellcheck="false" 
                   oninput="validateInput(this)"
                   placeholder="ESCREVE AQUI..."
                   style="width:100%; max-width:320px; padding:15px; font-size:26px; font-weight:900; text-align:center; border:4px solid #cbd9e6; border-radius:20px; color:var(--text-grey); outline:none; text-transform:uppercase; transition: 0.2s; box-shadow: 0 5px 0 #cbd9e6;">
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('game-input');
        if(input) { input.focus(); input.click(); }
    }, 200);
}

window.validateInput = function(inputEl) {
    const item = gameItems[currentIndex];
    const val = inputEl.value.toUpperCase();
    const target = item.nome.toUpperCase();

    if (target.startsWith(val)) {
        inputEl.style.borderColor = "var(--highlight-green)";
        inputEl.style.color = "var(--highlight-green)";
    } else {
        inputEl.style.borderColor = "var(--error-red)";
        inputEl.style.color = "var(--error-red)";
    }

    if (val.length === target.length) {
        if (val === target) {
            handleSuccess(inputEl);
        } else {
            handleError(inputEl);
        }
    }
}

function handleSuccess(inputEl) {
    inputEl.disabled = true;
    sndAcerto.play();
    score += (currentLevel === 2) ? JOGO_CONFIG.pontuacao.acertoNivel2 : JOGO_CONFIG.pontuacao.acertoNivel1;
    document.getElementById('score-val').innerText = score;
    setTimeout(nextRound, 800);
}

function handleError(inputEl) {
    sndErro.play();
    score = Math.max(0, score - JOGO_CONFIG.pontuacao.erroFinal);
    document.getElementById('score-val').innerText = score;
    
    inputEl.style.animation = "shake 0.4s";
    setTimeout(() => {
        inputEl.style.animation = "";
        inputEl.value = "";
        inputEl.style.borderColor = "#cbd9e6";
        inputEl.style.color = "var(--text-grey)";
    }, 400);
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

const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
`;
document.head.appendChild(style);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
