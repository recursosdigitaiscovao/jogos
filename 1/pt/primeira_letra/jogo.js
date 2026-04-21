let currentCategory = 'animais';
let currentIndex = 0; 
let roundInLevel = 0; 
let score = 0;
let timerSeconds = 0;
let timerInterval;
let draggedElement = null;
let isDraggingActive = false;

// Variáveis para controlo de toque/clique
let touchStartTime = 0;
let startPos = { x: 0, y: 0 };
let shuffledItems = []; // Para não repetir a sequência de imagens

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
        card.style.cssText = "background:#fff; border-radius:20px; padding:15px; text-align:center; cursor:pointer; box-shadow:0 5px 15px rgba(0,0,0,0.08); display:flex; flex-direction:column; align-items:center; justify-content:center;";
        card.innerHTML = `
            <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:55px; height:55px; object-fit:contain; margin-bottom:5px;">
            <span style="font-weight:900; font-size:11px; color:var(--primary-dark);">${cat.nome}</span>
        `;
        card.onclick = () => { window.selectCategory(k); closeMenus(); };
        rdList.appendChild(card);
    });
}

window.selectCategory = function(key) {
    currentCategory = key;
    renderTutorial();
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
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
        <style>
            @keyframes tutoDragClick { 0% { transform: translate(0,0); opacity:0; } 10% { opacity:1; } 50% { transform: translate(100px, -65px); } 80% { transform: translate(100px, -65px); opacity:1; } 100% { transform: translate(100px, -65px); opacity:0; } }
            #tuto-card, #tuto-hand { animation: tutoDragClick 3s infinite ease-in-out; }
        </style>
    `;
}

window.initGame = function() {
    currentIndex = 0; 
    roundInLevel = 0; 
    score = 0; 
    timerSeconds = 0;
    
    // BARALHAR IMAGENS NO INÍCIO DO JOGO
    shuffledItems = [...JOGO_CONFIG.categorias[currentCategory].itens].sort(() => Math.random() - 0.5);
    
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
            const dot = document.createElement('div'); dot.className = 'dot'; dc.appendChild(dot); 
        } 
    }
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

    // Gerar distratores
    let options = [correctLetter];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while(options.length < 4) {
        let r = alphabet[Math.floor(Math.random() * 26)];
        if(!options.includes(r)) options.push(r);
    }
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:clamp(10px, 3vh, 20px); touch-action:none;">
            
            <div class="pop-animation" style="background: white; padding: 10px; border-radius: clamp(20px, 5vw, 40px); box-shadow: 0 10px 25px rgba(176,196,217,0.4); width: clamp(130px, 40vw, 180px); height: clamp(130px, 40vw, 180px); display: flex; align-items: center; justify-content: center; border: 4px solid #f0f7ff;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width: 85%; max-height: 85%; object-fit: contain;">
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
                <div id="target-letter" style="width: clamp(50px, 14vw, 70px); height: clamp(60px, 16vw, 80px); background: rgba(255,255,255,0.6); border: 3px dashed var(--primary-blue); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: clamp(28px, 8vw, 40px); font-weight: 900; color: var(--primary-blue);">
                    _
                </div>
                <div style="font-size: clamp(30px, 10vw, 50px); font-weight: 900; color: var(--text-grey); letter-spacing: 2px; text-transform: uppercase;">
                    ${restOfWord}
                </div>
            </div>

            <!-- OPÇÕES EM UMA LINHA HORIZONTAL PARA TELEMÓVEL -->
            <div id="drag-options" style="display:flex; gap:8px; flex-wrap:nowrap; justify-content:center; padding:10px; background:rgba(255,255,255,0.4); border-radius:20px; width:100%; overflow-x: auto;">
                ${options.map(letra => `
                    <div class="letter-card" 
                         onmousedown="startDrag(event)" ontouchstart="startDrag(event)"
                         data-val="${letra}"
                         style="background: #ffffff; flex: 0 0 clamp(55px, 20vw, 75px); height: clamp(55px, 20vw, 75px); border-radius:15px; font-weight:900; font-size: clamp(24px, 7vw, 36px); color:var(--primary-dark); cursor:pointer; box-shadow:0 4px 0 #cbd9e6; border:2px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; user-select:none;">
                        ${letra}
                    </div>
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
    
    const rect = draggedElement.getBoundingClientRect();
    const offsetX = startPos.x - rect.left;
    const offsetY = startPos.y - rect.top;

    function onMove(ev) {
        const t = ev.type === 'touchmove' ? ev.touches[0] : ev;
        const dist = Math.sqrt(Math.pow(t.clientX - startPos.x, 2) + Math.pow(t.clientY - startPos.y, 2));

        if (dist > 10) { // Se moveu mais de 10px, é arrasto
            isDraggingActive = true;
            if(ev.cancelable) ev.preventDefault();
        }

        if (isDraggingActive) {
            draggedElement.style.position = 'fixed';
            draggedElement.style.zIndex = '3000';
            draggedElement.style.left = (t.clientX - offsetX) + 'px';
            draggedElement.style.top = (t.clientY - offsetY) + 'px';
            draggedElement.style.transform = 'scale(1.1)';
            draggedElement.style.pointerEvents = 'none';
        }
    }

    function onUp(ev) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);

        const t = ev.type === 'touchend' ? ev.changedTouches[0] : ev;
        const correctLetter = shuffledItems[currentIndex].nome[0];
        const duration = Date.now() - touchStartTime;

        // SE NÃO MOVEU QUASE NADA OU FOI TOQUE RÁPIDO = CLIQUE
        if (!isDraggingActive || duration < 200) {
            checkLetter(draggedElement.dataset.val, correctLetter);
        } else {
            // VERIFICAR DROP
            const dropTarget = document.elementFromPoint(t.clientX, t.clientY)?.closest('#target-letter');
            if (dropTarget) {
                checkLetter(draggedElement.dataset.val, correctLetter);
            }
        }

        draggedElement.style.position = ''; 
        draggedElement.style.transform = '';
        draggedElement.style.zIndex = '';
        draggedElement.style.pointerEvents = 'auto';
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
}

function checkLetter(escolhida, correta) {
    const target = document.getElementById('target-letter');
    if(!target || target.innerText !== "_") return; // Evita cliques múltiplos durante a animação

    target.innerText = escolhida;
    target.style.borderStyle = "solid";

    if (escolhida === correta) {
        sndAcerto.play();
        score += JOGO_CONFIG.pontuacao.acertoNivel1;
        document.getElementById('score-val').innerText = score;
        target.style.background = "#f0fff0";
        target.style.borderColor = "var(--highlight-green)";
        target.style.color = "var(--highlight-green)";
        setTimeout(nextRound, 1200);
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        target.style.background = "#fff5f5";
        target.style.borderColor = "var(--error-red)";
        target.style.color = "var(--error-red)";
        target.classList.add('shake-animation');

        setTimeout(() => {
            target.innerText = "_";
            target.classList.remove('shake-animation');
            target.style.background = "rgba(255,255,255,0.6)";
            target.style.borderColor = "var(--primary-blue)";
            target.style.borderStyle = "dashed";
            target.style.color = "var(--primary-blue)";
        }, 1000);
    }
}

function nextRound() {
    currentIndex++; roundInLevel++;
    if (roundInLevel < 5 && currentIndex < shuffledItems.length) {
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
    const rel = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
    if(window.goToResult) window.goToResult();
}

function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerSeconds = 0;
    timerInterval = setInterval(() => {
        timerSeconds++;
        const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const s = (timerSeconds % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `⏳ ${m}:${s}`;
    }, 1000);
}

const styleTag = document.createElement('style');
styleTag.innerHTML = `
    .letter-card:active { transform: scale(0.92); transition: 0.1s; background: #eee !important; }
    .pop-animation { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .shake-animation { animation: shake 0.4s; }
    @keyframes popIn { 0% { transform: scale(0.5); opacity:0; } 100% { transform: scale(1); opacity:1; } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
`;
document.head.appendChild(styleTag);
