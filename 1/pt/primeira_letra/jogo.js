let currentCategory = 'animais';
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1; 
let score = 0;
let timerSeconds = 0;
let timerInterval;
let draggedElement = null;
let isDraggingActive = false;
let touchStartTime = 0;
let startPos = { x: 0, y: 0 };
let originalRect = null;
let shuffledItems = [];

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

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
        card.style.cssText = "background:#fff; border-radius:20px; padding:12px; text-align:center; cursor:pointer; box-shadow:0 5px 15px rgba(0,0,0,0.08); display:flex; flex-direction:column; align-items:center; justify-content:center;";
        card.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:50px; height:50px; object-fit:contain; margin-bottom:5px;"><span style="font-weight:900; font-size:10px; color:var(--primary-dark);">${cat.nome}</span>`;
        card.onclick = () => { window.selectCategory(k); closeMenus(); };
        rdList.appendChild(card);
    });
}

window.selectCategory = function(key) {
    currentCategory = key;
    renderTutorial();
    
    const isResult = document.getElementById('scr-result').classList.contains('active');
    const isGame = document.getElementById('scr-game').classList.contains('active');

    // Se estiver no relatório ou já no jogo, reinicia/inicia o jogo na nova categoria
    if(isResult) {
        if(typeof goToGame === 'function') goToGame();
    } else if(isGame) {
        window.initGame();
    }
};

function renderTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const exampleItem = JOGO_CONFIG.categorias[currentCategory].itens[0];
    const letter = exampleItem.nome[0];
    container.innerHTML = `
        <div style="position:relative; width:220px; height:140px; margin:0 auto; background:rgba(255,255,255,0.4); border-radius:25px; border:3px dashed var(--primary-blue); overflow:hidden;">
            <img src="${JOGO_CONFIG.caminhoImg}${exampleItem.img}" style="position:absolute; top:10px; left:10px; width:45px; height:45px; object-fit:contain;">
            <div style="position:absolute; top:20px; right:20px; width:45px; height:55px; background:white; border:3px dashed var(--primary-blue); border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:22px;">?</div>
            <div id="tuto-card" style="position:absolute; bottom:15px; left:30px; width:45px; height:45px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-dark); font-size:24px; z-index:10;">${letter}</div>
            <i id="tuto-hand" class="fas fa-hand-pointer" style="position:absolute; bottom:5px; left:65px; font-size:35px; color:#f39c12; z-index:11; text-shadow: 2px 2px 0 white;"></i>
        </div>
        <style> @keyframes tutoDragClick { 0% { transform: translate(0,0); opacity:0; } 10% { opacity:1; } 50% { transform: translate(100px, -65px); } 80% { transform: translate(100px, -65px); opacity:1; } 100% { transform: translate(100px, -65px); opacity:0; } } #tuto-card, #tuto-hand { animation: tutoDragClick 3s infinite ease-in-out; } </style>
    `;
}

window.initGame = function() {
    currentIndex = 0; 
    roundInLevel = 0; 
    currentLevel = 1; 
    score = 0; 
    timerSeconds = 0;
    shuffledItems = [...JOGO_CONFIG.categorias[currentCategory].itens].sort(() => Math.random() - 0.5);
    document.getElementById('score-val').innerText = score;
    setupDots();
    startTimer();
    renderRound();
};

function setupDots() {
    const dc = document.getElementById('dots-container');
    if(dc) { dc.innerHTML = ''; for(let i=0; i<5; i++) { const dot = document.createElement('div'); dot.className = 'dot'; dc.appendChild(dot); } }
}

function renderRound() {
    const item = shuffledItems[currentIndex];
    if(!item) { finishGame(); return; }
    
    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => { 
        d.classList.remove('active', 'done'); 
        if(i < roundInLevel) d.classList.add('done'); 
        if(i === roundInLevel) d.classList.add('active'); 
    });

    const correctLetter = item.nome[0];
    const restOfWord = item.nome.substring(1);
    let options = [correctLetter];
    while(options.length < 4) { let r = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random()*26)]; if(!options.includes(r)) options.push(r); }
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:clamp(8px, 2vh, 15px); touch-action:none;">
            <div class="pop-animation" style="background: white; padding: 10px; border-radius: 30px; box-shadow: 0 10px 25px rgba(176,196,217,0.4); width: clamp(120px, 38vw, 170px); height: clamp(120px, 38vw, 170px); display: flex; align-items: center; justify-content: center; border: 4px solid #f0f7ff;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width: 85%; max-height: 85%; object-fit: contain;">
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div id="target-letter" style="width: clamp(50px, 14vw, 65px); height: clamp(60px, 16vw, 75px); background: rgba(255,255,255,0.6); border: 3px dashed var(--primary-blue); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: clamp(28px, 8vw, 36px); font-weight: 900; color: var(--primary-blue);">_</div>
                <div style="font-size: clamp(30px, 10vw, 45px); font-weight: 900; color: var(--text-grey); letter-spacing: 2px; text-transform: uppercase;">${restOfWord}</div>
            </div>
            <div id="drag-options" style="display:flex; gap:8px; flex-wrap:nowrap; justify-content:center; padding:10px; background:rgba(255,255,255,0.4); border-radius:20px; width:100%;">
                ${options.map(letra => `
                    <div class="letter-card" onmousedown="startDrag(event)" ontouchstart="startDrag(event)" data-val="${letra}"
                         style="background: #ffffff; flex: 1; max-width: 70px; height: clamp(55px, 18vw, 70px); border-radius:15px; font-weight:900; font-size: clamp(22px, 6vw, 32px); color:var(--primary-dark); cursor:pointer; box-shadow:0 4px 0 #cbd9e6; border:2px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; user-select:none;">${letra}</div>
                `).join('')}
            </div>
        </div>
    `;
}

function startDrag(e) {
    const el = e.target.closest('.letter-card');
    if (!el) return;
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    startPos = { x: touch.clientX, y: touch.clientY };
    touchStartTime = Date.now();
    draggedElement = el;
    isDraggingActive = false;
    originalRect = el.getBoundingClientRect();
    const offsetX = startPos.x - originalRect.left;
    const offsetY = startPos.y - originalRect.top;
    const targetBox = document.getElementById('target-letter');

    function onMove(ev) {
        const t = ev.type === 'touchmove' ? ev.touches[0] : ev;
        const dist = Math.sqrt(Math.pow(t.clientX - startPos.x, 2) + Math.pow(t.clientY - startPos.y, 2));
        if (dist > 10) { isDraggingActive = true; if(ev.cancelable) ev.preventDefault(); }
        if (isDraggingActive) {
            draggedElement.style.position = 'fixed'; draggedElement.style.zIndex = '3000';
            draggedElement.style.left = (t.clientX - offsetX) + 'px'; draggedElement.style.top = (t.clientY - offsetY) + 'px';
            draggedElement.style.transform = 'scale(1.15)'; draggedElement.style.pointerEvents = 'none';
            const overAlvo = document.elementFromPoint(t.clientX, t.clientY)?.closest('#target-letter');
            if(targetBox) targetBox.style.borderColor = overAlvo ? "#f39c12" : "var(--primary-blue)";
        }
    }

    function onUp(ev) {
        document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onUp);
        const t = ev.type === 'touchend' ? ev.changedTouches[0] : ev;
        const correctLetter = shuffledItems[currentIndex].nome[0];
        const duration = Date.now() - touchStartTime;

        if (!isDraggingActive || duration < 250) {
            checkLetter(draggedElement.dataset.val, correctLetter);
            resetEl();
        } else {
            const dropTarget = document.elementFromPoint(t.clientX, t.clientY)?.closest('#target-letter');
            if (dropTarget) {
                checkLetter(draggedElement.dataset.val, correctLetter);
                resetEl();
            } else {
                draggedElement.style.transition = 'all 0.3s';
                draggedElement.style.left = originalRect.left + 'px';
                draggedElement.style.top = originalRect.top + 'px';
                draggedElement.style.transform = 'scale(1)';
                setTimeout(resetEl, 300);
            }
        }
    }
    function resetEl() { 
        if(!draggedElement) return;
        draggedElement.style.position = ''; draggedElement.style.zIndex = ''; draggedElement.style.pointerEvents = 'auto'; 
        draggedElement.style.transform = ''; draggedElement.style.transition = ''; draggedElement = null; 
        if(targetBox) targetBox.style.borderColor = "var(--primary-blue)";
    }
    document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false }); document.addEventListener('touchend', onUp);
}

function checkLetter(l, c) {
    const t = document.getElementById('target-letter');
    if(!t || t.innerText !== "_") return;
    t.innerText = l;
    if (l === c) {
        sndAcerto.play(); score += JOGO_CONFIG.pontuacao.acertoNivel1;
        document.getElementById('score-val').innerText = score;
        t.style.background = "#f0fff0"; t.style.borderColor = "var(--highlight-green)"; t.style.color = "var(--highlight-green)";
        setTimeout(nextRound, 1200);
    } else {
        sndErro.play(); score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        t.style.background = "#fff5f5"; t.style.borderColor = "var(--error-red)"; t.style.color = "var(--error-red)";
        t.classList.add('shake-animation');
        setTimeout(() => { t.innerText = "_"; t.classList.remove('shake-animation'); t.style.background = "rgba(255,255,255,0.6)"; t.style.borderColor = "var(--primary-blue)"; t.style.borderStyle = "dashed"; t.style.color = "var(--primary-blue)"; }, 1000);
    }
}

function nextRound() { 
    currentIndex++; 
    roundInLevel++; 
    
    if (roundInLevel < 5 && currentIndex < shuffledItems.length) {
        renderRound(); 
    } else if (currentLevel === 1) {
        currentLevel = 2;
        roundInLevel = 0;
        setupDots(); 
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
    
    // Procura taca conforme pontuação (taca_1, taca_2, etc)
    const rel = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
    
    if(window.goToResult) window.goToResult();
}

function startTimer() { if(timerInterval) clearInterval(timerInterval); timerSeconds = 0; timerInterval = setInterval(() => { timerSeconds++; const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0'); const s = (timerSeconds % 60).toString().padStart(2, '0'); document.getElementById('timer').innerText = `⏳ ${m}:${s}`; }, 1000); }

const styleTag = document.createElement('style');
styleTag.innerHTML = `
    .letter-card:active { transform: scale(1.1) !important; background: #fff !important; }
    .pop-animation { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .shake-animation { animation: shake 0.4s; }
    @keyframes popIn { 0% { transform: scale(0.5); opacity:0; } 100% { transform: scale(1); opacity:1; } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
`;
document.head.appendChild(styleTag);
