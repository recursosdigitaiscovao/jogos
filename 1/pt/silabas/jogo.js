let currentCategory = 'animais';
let gameItems = [];
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let selectedSyllables = []; 
let draggedElement = null;
let isMoving = false;

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a UI do template (Menu, Título, Voltar)
    if (window.initUI) window.initUI();

    const rd1 = document.getElementById('rd-intro-btn');
    const rd2 = document.getElementById('rd-game-btn');
    if(rd1) rd1.src = JOGO_CONFIG.caminhoImg + "rd.png";
    if(rd2) rd2.src = JOGO_CONFIG.caminhoImg + "rd.png";

    // Inicia com a primeira categoria
    const primeiraCat = Object.keys(JOGO_CONFIG.categorias)[0];
    window.selectCategory(primeiraCat);
});

window.selectCategory = function(key) {
    currentCategory = key;
    const cat = JOGO_CONFIG.categorias[key];
    if(!cat) return;

    let all = [...cat.itens].sort(() => Math.random() - 0.5);
    gameItems = all.slice(0, 10);

    renderTutorial(cat);

    if(document.getElementById('scr-game').classList.contains('active')) {
        window.initGame();
    }
};

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const item = cat.itens[0];
    const silShuffled = item.silabas.length > 1 ? [...item.silabas].reverse() : [...item.silabas];

    container.innerHTML = `
        <div style="position:relative; width:260px; height:180px; background:white; border-radius:25px; box-shadow:0 10px 30px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; border: 4px solid #f0f7ff;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:60px; margin-bottom:10px;">
            <div style="display:flex; gap:8px; margin-bottom:20px;">
                <div style="width:35px; height:35px; border:2px dashed #ddd; border-radius:8px;"></div>
                <div style="width:35px; height:35px; border:2px dashed #ddd; border-radius:8px;"></div>
            </div>
            <div style="display:flex; gap:10px;">
                <div style="background:#eee; padding:5px 10px; border-radius:8px; font-weight:900; font-size:14px; color:#999;">${silShuffled[0]}</div>
                <div id="tuto-sil-drag" style="background:var(--primary-blue); color:white; padding:5px 10px; border-radius:8px; font-weight:900; font-size:14px; position:absolute; z-index:10; left:140px; bottom:25px;">${item.silabas[0]}</div>
            </div>
            <i class="fas fa-hand-pointer" id="tuto-hand" style="position:absolute; bottom:15px; left:155px; color:#f39c12; font-size:24px; z-index:11;"></i>
        </div>
        <style>
            @keyframes tutoMove { 0% { transform: translate(0,0); } 40% { transform: translate(-60px, -85px); } 70% { transform: translate(-60px, -85px); opacity:1; } 100% { transform: translate(-60px, -85px); opacity:0; } }
            #tuto-hand, #tuto-sil-drag { animation: tutoMove 3s infinite ease-in-out; }
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
    const dotsContainer = document.getElementById('dots-container');
    if(dotsContainer) {
        dotsContainer.innerHTML = '';
        for(let i=0; i<5; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dotsContainer.appendChild(dot);
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
    selectedSyllables = new Array(item.silabas.length).fill(null);

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:15px;">
            <div id="word-hint" style="font-size:30px; font-weight:900; color:var(--primary-blue); letter-spacing:4px; height:40px;">
                ${isLevel2 ? '???' : item.nome}
            </div>
            <div style="background:white; padding:12px; border-radius:30px; box-shadow:0 8px 25px rgba(0,0,0,0.06);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:120px; max-width:210px; object-fit:contain;" draggable="false">
            </div>
            <div id="drop-zones" style="display:flex; gap:12px; min-height:80px; justify-content:center; width:100%;">
                ${item.silabas.map((_, i) => `
                    <div class="target-box" data-idx="${i}" onclick="removeSyllable(${i})"
                         style="width:75px; height:75px; border:3px dashed #cbd9e6; border-radius:18px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:26px; color:var(--primary-dark); background:rgba(255,255,255,0.5); cursor:pointer;">
                    </div>
                `).join('')}
            </div>
            <div id="drag-options" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; padding:10px;">
                ${shuffleArray([...item.silabas]).map((sil, i) => `
                    <div class="silaba-card" 
                         onmousedown="startDrag(event)" ontouchstart="startDrag(event)"
                         data-silaba="${sil}" id="sil-orig-${currentIndex}-${i}"
                         style="background:white; padding:15px 25px; border-radius:20px; font-weight:900; font-size:26px; color:var(--text-grey); cursor:grab; box-shadow:0 6px 0 #d0e0f0; border:1px solid #eee; touch-action:none; user-select:none;">
                        ${sil}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.removeSyllable = function(idx) {
    const data = selectedSyllables[idx];
    if(!data) return;
    const originalEl = document.getElementById(data.originalId);
    if(originalEl) originalEl.style.visibility = 'visible';
    const target = document.querySelector(`.target-box[data-idx="${idx}"]`);
    target.innerText = "";
    target.style.background = "rgba(255,255,255,0.5)";
    target.style.border = "3px dashed #cbd9e6";
    selectedSyllables[idx] = null;
};

function startDrag(e) {
    draggedElement = e.target.closest('.silaba-card');
    if (!draggedElement || draggedElement.style.visibility === 'hidden') return;

    isMoving = false;
    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    const rect = draggedElement.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    const moveEvent = e.type === 'touchstart' ? 'touchmove' : 'mousemove';
    const upEvent = e.type === 'touchstart' ? 'touchend' : 'mouseup';

    function onMove(ev) {
        isMoving = true;
        const x = (ev.type === 'touchmove' ? ev.touches[0].clientX : ev.clientX);
        const y = (ev.type === 'touchmove' ? ev.touches[0].clientY : ev.clientY);
        draggedElement.style.zIndex = '3000';
        draggedElement.style.pointerEvents = 'none';
        draggedElement.style.position = 'fixed';
        draggedElement.style.left = (x - offsetX) + 'px';
        draggedElement.style.top = (y - offsetY) + 'px';
    }

    function onUp(ev) {
        document.removeEventListener(moveEvent, onMove);
        document.removeEventListener(upEvent, onUp);

        const endX = (ev.type === 'touchend' ? ev.changedTouches[0].clientX : ev.clientX);
        const endY = (ev.type === 'touchend' ? ev.changedTouches[0].clientY : ev.clientY);

        if (!isMoving) {
            const targets = document.querySelectorAll('.target-box');
            for (let i = 0; i < targets.length; i++) {
                if (!selectedSyllables[i]) {
                    fillTarget(i, draggedElement.dataset.silaba, draggedElement);
                    break;
                }
            }
        } else {
            const dropTarget = document.elementFromPoint(endX, endY)?.closest('.target-box');
            if (dropTarget && !selectedSyllables[dropTarget.dataset.idx]) {
                fillTarget(dropTarget.dataset.idx, draggedElement.dataset.silaba, draggedElement);
            }
        }

        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        draggedElement.style.zIndex = '';
        draggedElement.style.pointerEvents = 'auto';
        draggedElement.style.transition = '0.3s';
        setTimeout(() => draggedElement.style.transition = '', 300);
    }
    document.addEventListener(moveEvent, onMove);
    document.addEventListener(upEvent, onUp);
}

function fillTarget(targetIdx, silaba, originalEl) {
    const target = document.querySelector(`.target-box[data-idx="${targetIdx}"]`);
    if(!target) return;
    target.innerText = silaba;
    target.style.background = "white";
    target.style.border = "2px solid var(--primary-blue)";
    originalEl.style.visibility = 'hidden';
    selectedSyllables[targetIdx] = { silaba: silaba, originalId: originalEl.id };

    if (selectedSyllables.filter(s => s !== null).length === gameItems[currentIndex].silabas.length) {
        setTimeout(checkWord, 400);
    }
}

function checkWord() {
    const item = gameItems[currentIndex];
    const userWord = selectedSyllables.map(s => s ? s.silaba : "").join('');
    const correctWord = item.silabas.join('');

    if (userWord === correctWord) {
        sndAcerto.play();
        score += (currentLevel === 2) ? JOGO_CONFIG.pontuacao.acertoNivel2 : JOGO_CONFIG.pontuacao.acertoNivel1;
        document.getElementById('score-val').innerText = score;
        document.querySelectorAll('.target-box').forEach(b => b.style.color = "var(--highlight-green)");
        setTimeout(nextRound, 800);
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        document.querySelectorAll('.target-box').forEach(b => b.style.borderColor = "var(--error-red)");
    }
}

function nextRound() {
    currentIndex++; roundInLevel++;
    if (roundInLevel < 5) renderRound();
    else {
        if (currentLevel === 1) {
            currentLevel = 2; roundInLevel = 0;
            setupDots(); renderRound();
        } else finishGame();
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
