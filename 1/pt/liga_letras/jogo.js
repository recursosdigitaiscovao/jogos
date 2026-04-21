let currentCategory = 'frutos';
let gameItems = [];
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;

let isDrawing = false;
let currentPath = []; 
let lettersOrder = []; 

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
        <div style="position:relative; width:260px; height:180px; background:white; border-radius:25px; box-shadow:0 10px 30px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; border: 4px solid #f0f7ff;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:70px; z-index:2;">
            <div style="position:absolute; width:40px; height:40px; background:var(--primary-blue); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; top:20px; left:110px; z-index:3;">${item.nome[0]}</div>
            <i class="fas fa-hand-pointer" id="tuto-hand" style="position:absolute; top:45px; left:130px; color:#f39c12; font-size:24px; z-index:4; animation: tapLetter 1.5s infinite;"></i>
        </div>
        <style> @keyframes tapLetter { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.8); } } </style>
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
    
    currentPath = [];
    lettersOrder = item.nome.toUpperCase().split('');
    const isLevel2 = (currentLevel === 2);

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    let shuffled = [...lettersOrder].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; position:relative; min-height:360px; touch-action:none;">
            <div id="word-guide" style="font-size:32px; font-weight:900; color:var(--primary-blue); letter-spacing:8px; height:40px; margin-bottom:10px;">
                ${isLevel2 ? lettersOrder.map(()=>'_').join(' ') : item.nome}
            </div>
            
            <div id="game-wheel" style="position:relative; width:260px; height:260px; border-radius:50%; background:white; box-shadow:0 10px 30px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <canvas id="line-canvas" width="260" height="260" style="position:absolute; top:0; left:0; pointer-events:none; z-index:5;"></canvas>
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:110px; z-index:2; pointer-events:none;">
                ${shuffled.map((l, i) => {
                    const angle = (360 / shuffled.length) * i - 90;
                    const x = 130 + 105 * Math.cos(angle * Math.PI / 180);
                    const y = 130 + 105 * Math.sin(angle * Math.PI / 180);
                    return `<div class="letter-node" data-letter="${l}" 
                                 style="position:absolute; left:${x-25}px; top:${y-25}px; width:50px; height:50px; background:var(--primary-blue); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:24px; cursor:pointer; z-index:10; box-shadow:0 4px 0 var(--primary-dark); user-select:none;">${l}</div>`;
                }).join('')}
            </div>
        </div>
    `;

    setupInteractions();
}

function setupInteractions() {
    const wheel = document.getElementById('game-wheel');
    const canvas = document.getElementById('line-canvas');
    const ctx = canvas.getContext('2d');

    const handleInput = (e) => {
        const x = (e.touches ? e.touches[0].clientX : e.clientX);
        const y = (e.touches ? e.touches[0].clientY : e.clientY);
        const node = document.elementFromPoint(x, y)?.closest('.letter-node');

        if (e.type === 'mousedown' || e.type === 'touchstart') {
            isDrawing = true;
            if (node) checkNode(node);
        } else if (isDrawing && node) {
            checkNode(node);
        }
        
        if (isDrawing) drawLines(x, y);
    };

    const stopInput = () => {
        if (!isDrawing) return;
        isDrawing = false;
        if (currentPath.length < lettersOrder.length) resetRoundUI();
    };

    const checkNode = (node) => {
        if (currentPath.includes(node)) return;
        const nextIdx = currentPath.length;
        if (node.dataset.letter === lettersOrder[nextIdx]) {
            currentPath.push(node);
            node.style.background = "var(--highlight-green)";
            node.style.boxShadow = "0 4px 0 #66a318";
            if (currentPath.length === lettersOrder.length) {
                isDrawing = false;
                drawLines();
                setTimeout(handleSuccess, 500);
            }
        } else {
            isDrawing = false;
            triggerError(node);
        }
    };

    const drawLines = (curX, curY) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (currentPath.length === 0) return;
        ctx.beginPath();
        ctx.strokeStyle = "#7ed321"; ctx.lineWidth = 6; ctx.lineCap = ctx.lineJoin = "round";
        const rect = wheel.getBoundingClientRect();
        currentPath.forEach((node, i) => {
            const r = node.getBoundingClientRect();
            const x = (r.left + r.width/2) - rect.left;
            const y = (r.top + r.height/2) - rect.top;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        if (isDrawing && curX && curY) ctx.lineTo(curX - rect.left, curY - rect.top);
        ctx.stroke();
    };

    wheel.addEventListener('mousedown', handleInput);
    window.addEventListener('mousemove', handleInput);
    window.addEventListener('mouseup', stopInput);
    wheel.addEventListener('touchstart', handleInput);
    window.addEventListener('touchmove', handleInput);
    window.addEventListener('touchend', stopInput);
}

function triggerError(node) {
    sndErro.play();
    score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
    document.getElementById('score-val').innerText = score;
    node.style.background = "var(--error-red)";
    setTimeout(resetRoundUI, 400);
}

function resetRoundUI() {
    const ctx = document.getElementById('line-canvas')?.getContext('2d');
    if(ctx) ctx.clearRect(0, 0, 260, 260);
    currentPath = [];
    document.querySelectorAll('.letter-node').forEach(n => {
        n.style.background = "var(--primary-blue)";
        n.style.boxShadow = "0 4px 0 var(--primary-dark)";
    });
}

function handleSuccess() {
    sndAcerto.play();
    score += (currentLevel === 2) ? JOGO_CONFIG.pontuacao.acertoNivel2 : JOGO_CONFIG.pontuacao.acertoNivel1;
    document.getElementById('score-val').innerText = score;
    setTimeout(nextRound, 800);
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
