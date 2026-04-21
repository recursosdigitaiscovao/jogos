let currentCategory = 'frutos';
let gameItems = [];
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;

let isDrawing = false;
let currentPathNodes = []; 
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
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
};

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const item = cat.itens[0];
    
    container.innerHTML = `
        <div style="position:relative; width:260px; height:200px; background:white; border-radius:25px; box-shadow:0 10px 30px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; border: 4px solid #f0f7ff; overflow:hidden;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:70px; z-index:2;">
            <div class="tuto-node" style="position:absolute; top:30px; left:110px; width:35px; height:35px; background:var(--primary-blue); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; z-index:3;">${item.nome[0]}</div>
            <div class="tuto-node" style="position:absolute; top:130px; left:160px; width:35px; height:35px; background:var(--primary-blue); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; z-index:3;">${item.nome[1]}</div>
            
            <svg style="position:absolute; width:100%; height:100%; pointer-events:none; z-index:2;">
                <line id="tuto-line" x1="127" y1="47" x2="127" y2="47" stroke="#7ed321" stroke-width="4" stroke-linecap="round" />
            </svg>

            <i class="fas fa-hand-pointer" id="tuto-hand" style="position:absolute; top:50px; left:120px; color:#f39c12; font-size:24px; z-index:10;"></i>
        </div>
        <style>
            @keyframes tutoPlay {
                0% { top: 50px; left: 120px; }
                50% { top: 150px; left: 170px; }
                100% { top: 150px; left: 170px; opacity:0; }
            }
            @keyframes linePlay {
                0% { x2: 127; y2: 47; }
                50%, 100% { x2: 177; y2: 147; }
            }
            #tuto-hand { animation: tutoPlay 2.5s infinite ease-in-out; }
            #tuto-line { animation: linePlay 2.5s infinite ease-in-out; }
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
    if(!item) { finishGame(); return; }
    
    currentPathNodes = [];
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
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; position:relative; min-height:400px; touch-action:none; padding-top:10px;">
            
            <!-- WORD GUIDE: Aumentado o margin-bottom de 10px para 35px -->
            <div id="word-guide" style="font-size:32px; font-weight:900; color:var(--primary-blue); letter-spacing:8px; height:45px; margin-bottom:35px; text-align:center;">
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

    const getTargetNode = (x, y) => document.elementFromPoint(x, y)?.closest('.letter-node');

    const handleStart = (e) => {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const node = getTargetNode(x, y);
        if (node) {
            isDrawing = true;
            checkNode(node);
        }
    };

    const handleMove = (e) => {
        if (!isDrawing) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const node = getTargetNode(x, y);
        if (node) checkNode(node);
        drawLines(x, y);
    };

    const handleEnd = () => {
        if (!isDrawing) return;
        isDrawing = false;
        if (currentPathNodes.length < lettersOrder.length) {
             drawLines(); 
        }
    };

    const checkNode = (node) => {
        if (currentPathNodes.includes(node)) return;
        const nextIdx = currentPathNodes.length;
        if (node.dataset.letter === lettersOrder[nextIdx]) {
            currentPathNodes.push(node);
            node.style.background = "var(--highlight-green)";
            node.style.boxShadow = "0 4px 0 #66a318";
            if (currentPathNodes.length === lettersOrder.length) {
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
        if (currentPathNodes.length === 0) return;
        ctx.beginPath();
        ctx.strokeStyle = "#7ed321"; ctx.lineWidth = 8; ctx.lineCap = ctx.lineJoin = "round";
        const rect = wheel.getBoundingClientRect();
        currentPathNodes.forEach((node, i) => {
            const r = node.getBoundingClientRect();
            const x = (r.left + r.width/2) - rect.left;
            const y = (r.top + r.height/2) - rect.top;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        if (isDrawing && curX && curY) ctx.lineTo(curX - rect.left, curY - rect.top);
        ctx.stroke();
    };

    wheel.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    wheel.addEventListener('touchstart', handleStart);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
}

function triggerError(node) {
    sndErro.play();
    score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
    document.getElementById('score-val').innerText = score;
    node.style.background = "var(--error-red)";
    setTimeout(() => {
        const ctx = document.getElementById('line-canvas').getContext('2d');
        if(ctx) ctx.clearRect(0, 0, 260, 260);
        currentPathNodes = [];
        document.querySelectorAll('.letter-node').forEach(n => {
            n.style.background = "var(--primary-blue)";
            n.style.boxShadow = "0 4px 0 var(--primary-dark)";
        });
    }, 400);
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
