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
let isDraggingActive = false;

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// --- COORDENADAS AJUSTADAS: Cartão 1 puxado 15% para a esquerda ---
const BOX_CFG = {
    top: 38,          
    height: 38,       
    width: 21.4,      
    lefts: [-10.2, 28.2, 51.6, 75.0] // O primeiro valor mudou de 4.8 para -10.2
};

function startLogic() {
    reconstruirMenuCategorias();
    window.selectCategory(Object.keys(JOGO_CONFIG.categorias)[0]);
}

function reconstruirMenuCategorias() {
    const rdList = document.getElementById('rd-list');
    if(!rdList) return;
    rdList.innerHTML = ''; 
    Object.keys(JOGO_CONFIG.categorias).forEach(k => {
        const cat = JOGO_CONFIG.categorias[k];
        const card = document.createElement('div');
        card.style.cssText = "background:#fff; border-radius:20px; padding:15px; text-align:center; cursor:pointer; box-shadow:0 5px 15px rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center;";
        card.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:80px; height:80px; object-fit:contain;">`;
        card.onclick = () => { window.selectCategory(k); closeMenus(); };
        rdList.appendChild(card);
    });
}

window.selectCategory = function(key) {
    currentCategory = key;
    renderTutorial(JOGO_CONFIG.categorias[key]);
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
};

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
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px; touch-action:none;">
            <div id="shelf-container" style="position:relative; width:100%; max-width:800px; aspect-ratio: 1014/380; background: url('${JOGO_CONFIG.caminhoImg}letras_magicas.png') no-repeat center; background-size: contain;">
                ${BOX_CFG.lefts.map((l, i) => `
                    <div class="target-box" data-idx="${i}" onclick="removeItem(${i})" 
                         style="position:absolute; top:${BOX_CFG.top}%; left:${l}%; width:${BOX_CFG.width}%; height:${BOX_CFG.height}%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    </div>
                `).join('')}
            </div>
            <div id="drag-options" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; padding:12px; background:rgba(255,255,255,0.4); border-radius:25px; width:100%; min-height:75px;">
                ${shuffled.map((item, i) => `
                    <div class="sort-card" 
                         onmousedown="startDrag(event)" ontouchstart="startDrag(event)"
                         data-val="${item}" id="card-${currentIndex}-${i}"
                         style="background:white; padding:8px 12px; border-radius:12px; font-weight:900; font-size:clamp(12px, 3.5vw, 16px); color:var(--primary-dark); cursor:grab; box-shadow:0 4px 0 #cbd9e6; border:2px solid #eee; min-width:75px; text-align:center;">
                        ${item}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function fillTarget(targetIdx, val, originalEl) {
    const target = document.querySelector(`.target-box[data-idx="${targetIdx}"]`);
    if(!target) return;
    target.innerHTML = `<div class="placed-card" style="background:white; color:var(--primary-dark); font-weight:900; font-size:clamp(10px, 3.2vw, 19px); text-align:center; width:96%; height:94%; display:flex; align-items:center; justify-content:center; border-radius:10px; border: 2px solid #ddd; box-shadow: 0 4px 8px rgba(0,0,0,0.1); animation: popIn 0.3s; padding: 4px; overflow: hidden; word-break: break-word;">${val}</div>`;
    originalEl.style.visibility = 'hidden';
    placedItems[targetIdx] = { val: val, originalId: originalEl.id, locked: false };
    if (placedItems.every(x => x !== null)) setTimeout(checkOrder, 600);
}

function checkOrder() {
    const userOrder = placedItems.map(x => x.val);
    const isRoundCorrect = userOrder.every((val, i) => val === correctOrder[i]);

    if (isRoundCorrect) {
        sndAcerto.play();
        score += (currentLevel === 1) ? JOGO_CONFIG.pontuacao.acertoNivel1 : JOGO_CONFIG.pontuacao.acertoNivel2;
        document.getElementById('score-val').innerText = score;
        
        document.querySelectorAll('.placed-card').forEach(card => {
            card.style.borderColor = "var(--highlight-green)";
            card.style.color = "var(--highlight-green)";
            card.style.background = "#f0fff0";
        });
        
        setTimeout(nextRound, 1200);
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;

        placedItems.forEach((item, i) => {
            const target = document.querySelector(`.target-box[data-idx="${i}"]`);
            const cardInner = target.querySelector('.placed-card');
            
            if (item && item.val === correctOrder[i]) {
                cardInner.style.borderColor = "var(--highlight-green)";
                cardInner.style.color = "var(--highlight-green)";
                cardInner.style.background = "#f0fff0";
                item.locked = true; 
            } else if (item) {
                cardInner.style.borderColor = "var(--error-red)";
                cardInner.style.color = "var(--error-red)";
                cardInner.style.background = "#fff5f5";
                
                setTimeout(() => {
                    if(!item.locked) {
                        const originalEl = document.getElementById(item.originalId);
                        target.innerHTML = "";
                        if(originalEl) originalEl.style.visibility = 'visible';
                        placedItems[i] = null;
                    }
                }, 1000);
            }
        });
    }
}

window.removeItem = function(idx) {
    const item = placedItems[idx];
    if(!item || item.locked) return; 
    const originalEl = document.getElementById(item.originalId);
    if(originalEl) originalEl.style.visibility = 'visible';
    const target = document.querySelector(`.target-box[data-idx="${idx}"]`);
    target.innerHTML = "";
    placedItems[idx] = null;
};

function startDrag(e) {
    const el = e.target.closest('.sort-card');
    if (!el || el.style.visibility === 'hidden') return;
    if(e.cancelable) e.preventDefault();
    draggedElement = el;
    isDraggingActive = false;
    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    const rect = draggedElement.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    function onMove(ev) {
        isDraggingActive = true;
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
        if (!isDraggingActive) {
            const freeIdx = placedItems.findIndex(x => x === null);
            if(freeIdx !== -1) fillTarget(freeIdx, draggedElement.dataset.val, draggedElement);
        } else {
            const x = (ev.type === 'touchend' ? ev.changedTouches[0].clientX : ev.clientX);
            const y = (ev.type === 'touchend' ? ev.changedTouches[0].clientY : ev.clientY);
            const dropTarget = document.elementFromPoint(x, y)?.closest('.target-box');
            if (dropTarget && !placedItems[dropTarget.dataset.idx]) fillTarget(dropTarget.dataset.idx, draggedElement.dataset.val, draggedElement);
        }
        draggedElement.style.position = ''; draggedElement.style.zIndex = '';
        draggedElement.style.pointerEvents = 'auto'; draggedElement.style.left = ''; draggedElement.style.top = '';
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
}

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itemEx = cat.rondas[0].itens[0];
    container.innerHTML = `<div style="position:relative; width:300px; height:112px; background: url('${JOGO_CONFIG.caminhoImg}letras_magicas.png') no-repeat center; background-size: contain; margin: 0 auto; overflow:hidden; border-radius:10px; border:2px solid #ddd;"><div id="tuto-card" style="background:white; padding:2px 8px; border-radius:5px; font-weight:900; font-size:12px; position:absolute; left:135px; top:80px; z-index:10; box-shadow:0 3px 0 #cbd9e6; border:1px solid #eee;">${itemEx}</div><i id="tuto-hand" class="fas fa-hand-pointer" style="position:absolute; top:90px; left:150px; color:#f39c12; font-size:18px; z-index:11;"></i></div><style>@keyframes tutoMove { 0% { transform: translate(0,0); opacity:1; } 40% { transform: translate(-103px, -52px); } 70% { transform: translate(-103px, -52px); opacity:1; } 100% { transform: translate(-103px, -52px); opacity:0; } } #tuto-card, #tuto-hand { animation: tutoMove 3s infinite ease-in-out; }</style>`;
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

function nextRound() {
    currentIndex++; roundInLevel++;
    if (roundInLevel < 5) renderRound();
    else if (currentLevel === 1) {
        currentLevel = 2; roundInLevel = 0; setupDots(); renderRound();
    } else finishGame();
}

function finishGame() {
    if(timerInterval) clearInterval(timerInterval);
    sndVitoria.play();
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText.replace('⏳ ', '');
    const rel = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
    if(window.goToResult) window.goToResult();
}

const styleTag = document.createElement('style');
styleTag.innerHTML = `@keyframes popIn { 0% { transform: scale(0.8); opacity:0; } 100% { transform: scale(1); opacity:1; } }`;
document.head.appendChild(styleTag);
