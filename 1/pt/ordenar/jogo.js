let currentCategory = 'cat1';
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let placedItems = [null, null, null, null];
let correctOrder = [];
let draggedElement = null;

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
    renderTutorial(JOGO_CONFIG.categorias[key]);
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
};

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itemEx = cat.rondas[0].itens[0];
    
    container.innerHTML = `
        <div style="position:relative; width:300px; height:112px; background: url('${JOGO_CONFIG.caminhoImg}letras_magicas.png') no-repeat center; background-size: contain; margin: 0 auto; overflow:hidden; border-radius:10px; border:1px solid #ddd;">
            <div id="tuto-card" style="background:white; padding:2px 8px; border-radius:5px; font-weight:900; font-size:12px; position:absolute; left:135px; top:80px; z-index:10; box-shadow:0 3px 0 #cbd9e6; border:1px solid #eee;">
                ${itemEx}
            </div>
            <i id="tuto-hand" class="fas fa-hand-pointer" style="position:absolute; top:90px; left:150px; color:#f39c12; font-size:18px; z-index:11;"></i>
        </div>
        <style>
            @keyframes tutoDrag { 
                0% { left: 135px; top: 80px; opacity: 1; } 
                40% { left: 45px; top: 52px; } 
                70% { left: 45px; top: 52px; opacity: 1; } 
                100% { left: 45px; top: 52px; opacity: 0; } 
            }
            @keyframes handDrag { 
                0% { left: 150px; top: 90px; opacity: 1; } 
                40% { left: 55px; top: 62px; } 
                70% { left: 55px; top: 62px; opacity: 1; } 
                100% { left: 55px; top: 62px; opacity: 0; } 
            }
            #tuto-card { animation: tutoDrag 3s infinite ease-in-out; }
            #tuto-hand { animation: handDrag 3s infinite ease-in-out; }
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
    if(dc) { dc.innerHTML = ''; for(let i=0; i<5; i++) { const dot = document.createElement('div'); dot.className = 'dot'; dc.appendChild(dot); } }
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
    const cat = JOGO_CONFIG.categorias[currentCategory];
    const ronda = cat.rondas[currentIndex];
    if(!ronda) { finishGame(); return; }

    correctOrder = [...ronda.itens].sort((a,b) => a.localeCompare(b, 'pt'));
    let shuffled = [...ronda.itens].sort(() => Math.random() - 0.5);
    placedItems = [null, null, null, null];

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:15px; touch-action:none;">
            
            <div id="shelf-container" style="position:relative; width:100%; max-width:800px; aspect-ratio: 1014/380; background: url('${JOGO_CONFIG.caminhoImg}letras_magicas.png') no-repeat center; background-size: contain; user-select:none; touch-action:none;">
                
                <!-- DROP ZONES CALIBRADAS (TOP 44%, HEIGHT 45%) -->
                <div id="drop-zones" style="position:absolute; top:44%; left:5.2%; right:5.2%; height:45%; display:grid; grid-template-columns: repeat(4, 1fr); gap:2%;">
                    ${[0,1,2,3].map(i => `
                        <div class="target-box" data-idx="${i}" onclick="removeItem(${i})"
                             style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                        </div>
                    `).join('')}
                </div>
            </div>

            <div id="drag-options" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; padding:15px; background:rgba(255,255,255,0.4); border-radius:25px; width:100%; min-height:85px;">
                ${shuffled.map((item, i) => `
                    <div class="sort-card" 
                         onmousedown="startDrag(event)" ontouchstart="startDrag(event)"
                         onclick="handleItemClick(this)"
                         data-val="${item}" id="card-${currentIndex}-${i}"
                         style="background:white; padding:12px 18px; border-radius:12px; font-weight:900; font-size:clamp(14px, 4vw, 22px); color:var(--primary-dark); cursor:grab; box-shadow:0 6px 0 #cbd9e6; border:2px solid #eee; min-width:75px; text-align:center; user-select:none; touch-action:none;">
                        ${item}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.handleItemClick = function(el) {
    if(el.style.visibility === 'hidden') return;
    const freeIdx = placedItems.findIndex(x => x === null);
    if(freeIdx !== -1) fillTarget(freeIdx, el.dataset.val, el);
};

window.removeItem = function(idx) {
    if(!placedItems[idx]) return;
    const originalEl = document.getElementById(placedItems[idx].originalId);
    if(originalEl) originalEl.style.visibility = 'visible';
    const target = document.querySelector(`.target-box[data-idx="${idx}"]`);
    target.innerHTML = "";
    placedItems[idx] = null;
};

function fillTarget(targetIdx, val, originalEl) {
    const target = document.querySelector(`.target-box[data-idx="${targetIdx}"]`);
    if(!target) return;

    // Fica apenas o texto, centrado
    target.innerHTML = `
        <div style="color:var(--primary-dark); font-weight:900; font-size:clamp(14px, 4.5vw, 32px); text-align:center; width:100%; line-height:1; display:flex; align-items:center; justify-content:center; animation: popIn 0.3s; word-break: break-all;">
            ${val}
        </div>
    `;
    originalEl.style.visibility = 'hidden';
    placedItems[targetIdx] = { val: val, originalId: originalEl.id };

    if (placedItems.every(x => x !== null)) setTimeout(checkOrder, 600);
}

function checkOrder() {
    const userOrder = placedItems.map(x => x.val);
    const isCorrect = userOrder.every((val, i) => val === correctOrder[i]);

    if (isCorrect) {
        sndAcerto.play();
        score += (currentLevel === 1) ? JOGO_CONFIG.pontuacao.acertoNivel1 : JOGO_CONFIG.pontuacao.acertoNivel2;
        document.getElementById('score-val').innerText = score;
        document.querySelectorAll('.target-box div').forEach(d => d.style.color = "var(--highlight-green)");
        setTimeout(nextRound, 1000);
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        
        // CORREÇÃO SELETIVA: Só saltam as que estão na posição errada
        placedItems.forEach((item, i) => {
            if (item.val !== correctOrder[i]) {
                const target = document.querySelector(`.target-box[data-idx="${i}"]`);
                const originalEl = document.getElementById(item.originalId);
                const txtDiv = target.querySelector('div');
                if(txtDiv) txtDiv.style.color = "var(--error-red)";
                
                setTimeout(() => {
                    target.innerHTML = "";
                    if(originalEl) originalEl.style.visibility = 'visible';
                    placedItems[i] = null;
                }, 800);
            } else {
                // As certas ficam verdes temporariamente para indicar sucesso parcial
                const txtDiv = target.querySelector(`div`);
                if(txtDiv) txtDiv.style.color = "var(--highlight-green)";
            }
        });
    }
}

function startDrag(e) {
    const el = e.target.closest('.sort-card');
    if (!el || el.style.visibility === 'hidden') return;
    if(e.cancelable) e.preventDefault();

    draggedElement = el;
    let isDragging = false;
    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    const rect = draggedElement.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    function onMove(ev) {
        isDragging = true;
        const x = (ev.type === 'touchmove' ? ev.touches[0].clientX : ev.clientX);
        const y = (ev.type === 'touchmove' ? ev.touches[0].clientY : ev.clientY);
        
        draggedElement.style.position = 'fixed';
        draggedElement.style.zIndex = '3000';
        draggedElement.style.pointerEvents = 'none';
        draggedElement.style.left = (x - offsetX) + 'px';
        draggedElement.style.top = (y - offsetY) + 'px';
    }

    function onUp(ev) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);

        if (isDragging) {
            const x = (ev.type === 'touchend' ? ev.changedTouches[0].clientX : ev.clientX);
            const y = (ev.type === 'touchend' ? ev.changedTouches[0].clientY : ev.clientY);
            const dropTarget = document.elementFromPoint(x, y)?.closest('.target-box');
            if (dropTarget && !placedItems[dropTarget.dataset.idx]) {
                fillTarget(dropTarget.dataset.idx, draggedElement.dataset.val, draggedElement);
            }
        }
        if (draggedElement) {
            draggedElement.style.position = '';
            draggedElement.style.zIndex = '';
            draggedElement.style.pointerEvents = 'auto';
            draggedElement.style.left = '';
            draggedElement.style.top = '';
        }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
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
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText.replace('⏳ ', '');
    let rel = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
    if(window.goToResult) window.goToResult();
}
