let currentCategory = 'cat1';
let currentRoundIdx = 0;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let placedItems = [null, null, null, null];
let correctOrder = [];

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

document.addEventListener('DOMContentLoaded', () => {
    if (window.initUI) window.initUI();
    
    // Injetar Tutorial
    const container = document.getElementById('intro-animation-container');
    if(container) {
        container.innerHTML = `
            <div style="position:relative; width:280px; height:120px; background:white; border-radius:20px; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 20px rgba(0,0,0,0.05); border:4px solid #f0f7ff;">
                <div style="display:flex; gap:10px;">
                    <div style="width:50px; height:60px; background:#5ba4e5; color:white; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900;">A</div>
                    <div style="width:50px; height:60px; border:2px dashed #ccc; border-radius:8px;"></div>
                    <div style="width:50px; height:60px; background:#7ed321; color:white; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; position:absolute; left:165px; top:25px; animation: moveTuto 2s infinite;">B</div>
                </div>
                <i class="fas fa-hand-pointer" style="position:absolute; left:185px; top:60px; color:#f39c12; font-size:24px; animation: moveTuto 2s infinite;"></i>
            </div>
            <style>
                @keyframes moveTuto { 0% { transform: translate(0,0); } 50% { transform: translate(-85px, 0); } 100% { transform: translate(-85px, 0); opacity:0; } }
            </style>
        `;
    }

    const rd1 = document.getElementById('rd-intro-btn');
    const rd2 = document.getElementById('rd-game-btn');
    if(rd1) rd1.src = JOGO_CONFIG.caminhoImg + "rd.png";
    if(rd2) rd2.src = JOGO_CONFIG.caminhoImg + "rd.png";

    window.selectCategory(Object.keys(JOGO_CONFIG.categorias)[0]);
});

window.selectCategory = function(key) {
    currentCategory = key;
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
};

window.initGame = function() {
    currentRoundIdx = 0;
    score = 0;
    timerSeconds = 0;
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
        document.getElementById('timer').innerText = `⏳ ${min}:${sec}`;
    }, 1000);
}

function renderRound() {
    const ronda = JOGO_CONFIG.categorias[currentCategory].rondas[currentRoundIdx];
    const originalItens = [...ronda.itens];
    // A ordem correta é a alfabética
    correctOrder = [...originalItens].sort((a,b) => a.localeCompare(b, 'pt'));
    
    // Embaralhar para o utilizador escolher
    let shuffled = [...originalItens].sort(() => Math.random() - 0.5);
    placedItems = [null, null, null, null];

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < currentRoundIdx) d.classList.add('done');
        if(i === currentRoundIdx) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px;">
            
            <!-- Estante cenário -->
            <div id="shelf-container" style="position:relative; width:100%; max-width:600px; aspect-ratio: 500/160; background: url('${JOGO_CONFIG.caminhoImg}estante.png') no-repeat center; background-size: contain;">
                <div id="drop-zones" style="position:absolute; bottom:15%; left:5%; right:5%; height:65%; display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; padding: 0 10px;">
                    ${[0,1,2,3].map(i => `
                        <div class="target-box" data-idx="${i}" onclick="removeItem(${i})"
                             style="height:100%; display:flex; align-items:center; justify-content:center; transition:0.2s; cursor:pointer; border-radius:10px;">
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Itens para ordenar -->
            <div id="drag-options" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; padding:15px; background:rgba(255,255,255,0.5); border-radius:20px; width:100%;">
                ${shuffled.map((item, i) => `
                    <div class="sort-card" draggable="true" 
                         onmousedown="startDrag(event)" ontouchstart="startDrag(event)"
                         onclick="handleItemClick(this)"
                         data-val="${item}" id="card-${i}"
                         style="background:white; padding:12px 18px; border-radius:12px; font-weight:900; font-size:18px; color:var(--primary-dark); cursor:grab; box-shadow:0 5px 0 #cbd9e6; border:2px solid #eee; min-width:60px; text-align:center; user-select:none; touch-action:none;">
                        ${item}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Lógica de Clique: vai para a próxima vaga livre na estante
window.handleItemClick = function(el) {
    if(el.style.visibility === 'hidden') return;
    const freeIdx = placedItems.findIndex(x => x === null);
    if(freeIdx !== -1) {
        fillTarget(freeIdx, el.dataset.val, el);
    }
};

// Remover da estante se clicar no buraco
window.removeItem = function(idx) {
    if(!placedItems[idx]) return;
    const itemVal = placedItems[idx].val;
    const originalId = placedItems[idx].originalId;
    
    document.getElementById(originalId).style.visibility = 'visible';
    const target = document.querySelector(`.target-box[data-idx="${idx}"]`);
    target.innerHTML = "";
    placedItems[idx] = null;
};

function fillTarget(targetIdx, val, originalEl) {
    const target = document.querySelector(`.target-box[data-idx="${targetIdx}"]`);
    target.innerHTML = `
        <div style="background:var(--primary-blue); color:white; padding:10px; border-radius:8px; font-weight:900; font-size:14px; width:90%; text-align:center; box-shadow:0 4px 0 var(--primary-dark); animation: popIn 0.3s;">
            ${val}
        </div>
    `;
    originalEl.style.visibility = 'hidden';
    placedItems[targetIdx] = { val: val, originalId: originalEl.id };

    // Se as 4 vagas estiverem cheias, verifica
    if (placedItems.every(x => x !== null)) {
        setTimeout(checkOrder, 500);
    }
}

function checkOrder() {
    const userOrder = placedItems.map(x => x.val);
    const isCorrect = userOrder.every((val, i) => val === correctOrder[i]);

    if (isCorrect) {
        sndAcerto.play();
        score += JOGO_CONFIG.pontuacao.acerto;
        document.getElementById('score-val').innerText = score;
        document.querySelectorAll('.target-box div').forEach(d => d.style.background = "var(--highlight-green)");
        setTimeout(nextRound, 1000);
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        document.querySelectorAll('.target-box div').forEach(d => d.style.background = "var(--error-red)");
        setTimeout(() => {
            renderRound(); // Reinicia a ronda para tentar de novo
        }, 800);
    }
}

// DRAG AND DROP
let draggedElement = null;
window.startDrag = function(e) {
    draggedElement = e.target.closest('.sort-card');
    if (!draggedElement || draggedElement.style.visibility === 'hidden') return;

    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    const rect = draggedElement.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    draggedElement.style.zIndex = '1000';
    draggedElement.style.pointerEvents = 'none';

    const onMove = (ev) => {
        const x = (ev.type === 'touchmove' ? ev.touches[0].clientX : ev.clientX);
        const y = (ev.type === 'touchmove' ? ev.touches[0].clientY : ev.clientY);
        draggedElement.style.position = 'fixed';
        draggedElement.style.left = (x - offsetX) + 'px';
        draggedElement.style.top = (y - offsetY) + 'px';
    };

    const onUp = (ev) => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);

        const x = (ev.type === 'touchend' ? ev.changedTouches[0].clientX : ev.clientX);
        const y = (ev.type === 'touchend' ? ev.changedTouches[0].clientY : ev.clientY);

        const dropTarget = document.elementFromPoint(x, y)?.closest('.target-box');

        if (dropTarget && !placedItems[dropTarget.dataset.idx]) {
            fillTarget(dropTarget.dataset.idx, draggedElement.dataset.val, draggedElement);
        }

        draggedElement.style.position = '';
        draggedElement.style.zIndex = '';
        draggedElement.style.pointerEvents = 'auto';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
};

function nextRound() {
    currentRoundIdx++;
    if (currentRoundIdx < 5) {
        renderRound();
    } else {
        finishGame();
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
