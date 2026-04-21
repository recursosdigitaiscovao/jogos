let currentCategory = 'animais';
let currentIndex = 0; 
let roundInLevel = 0; 
let score = 0;
let timerSeconds = 0;
let timerInterval;
let draggedElement = null;
let isDraggingActive = false;
let startPos = { x: 0, y: 0 }; // Para detetar se foi clique ou arrasto

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
            <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:60px; height:60px; object-fit:contain; margin-bottom:5px;">
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
        <div style="position:relative; width:240px; height:150px; margin:0 auto; background:rgba(255,255,255,0.4); border-radius:30px; border:3px dashed var(--primary-blue); overflow:hidden;">
            <img src="${JOGO_CONFIG.caminhoImg}${exampleItem.img}" style="position:absolute; top:10px; left:10px; width:50px; height:50px; object-fit:contain;">
            <div style="position:absolute; top:20px; right:30px; width:50px; height:60px; background:white; border:3px dashed var(--primary-blue); border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:24px;">?</div>
            <div id="tuto-card" style="position:absolute; bottom:20px; left:30px; width:50px; height:50px; background:white; border:3px solid var(--primary-blue); border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-dark); font-size:28px; z-index:10;">${letter}</div>
            <i id="tuto-hand" class="fas fa-hand-pointer" style="position:absolute; bottom:10px; left:70px; font-size:40px; color:#f39c12; z-index:11; text-shadow: 2px 2px 0 white;"></i>
        </div>
        <style>
            @keyframes tutoDragClick { 0% { transform: translate(0,0); opacity:0; } 10% { opacity:1; } 50% { transform: translate(110px, -75px); } 80% { transform: translate(110px, -75px); opacity:1; } 100% { transform: translate(110px, -75px); opacity:0; } }
            #tuto-card, #tuto-hand { animation: tutoDragClick 3s infinite ease-in-out; }
        </style>
    `;
}

window.initGame = function() {
    currentIndex = 0; roundInLevel = 0; score = 0; timerSeconds = 0;
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
    const cat = JOGO_CONFIG.categorias[currentCategory];
    const item = cat.itens[currentIndex];
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
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while(options.length < 4) {
        let r = alphabet[Math.floor(Math.random() * 26)];
        if(!options.includes(r)) options.push(r);
    }
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:clamp(10px, 4vh, 20px); touch-action:none;">
            
            <!-- IMAGEM (TAMANHO ADAPTÁVEL) -->
            <div class="pop-animation" style="background: white; padding: 10px; border-radius: clamp(20px, 5vw, 40px); box-shadow: 0 10px 25px rgba(176,196,217,0.4); width: clamp(140px, 45vw, 190px); height: clamp(140px, 45vw, 190px); display: flex; align-items: center; justify-content: center; border: 4px solid #f0f7ff;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width: 85%; max-height: 85%; object-fit: contain;">
            </div>

            <!-- PALAVRA (TEXTO RESPONSIVO) -->
            <div style="display: flex; align-items: center; gap: 10px;">
                <div id="target-letter" style="width: clamp(55px, 15vw, 75px); height: clamp(65px, 18vw, 85px); background: rgba(255,255,255,0.6); border: 3px dashed var(--primary-blue); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: clamp(30px, 10vw, 45px); font-weight: 900; color: var(--primary-blue);">
                    _
                </div>
                <div style="font-size: clamp(35px, 12vw, 55px); font-weight: 900; color: var(--text-grey); letter-spacing: 3px; text-transform: uppercase;">
                    ${restOfWord}
                </div>
            </div>

            <!-- OPÇÕES (ADAPTÁVEIS) -->
            <div id="drag-options" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; padding:10px; background:rgba(255,255,255,0.4); border-radius:25px; width:100%;">
                ${options.map(letra => `
                    <div class="letter-card" 
                         onmousedown="startDrag(event)" ontouchstart="startDrag(event)"
                         data-val="${letra}"
                         style="background: rgba(255,255,255,0.7); width: clamp(60px, 18vw, 75px); height: clamp(60px, 18vw, 75px); border-radius:18px; font-weight:900; font-size: clamp(28px, 8vw, 38px); color:var(--primary-dark); cursor:pointer; box-shadow:0 5px 0 #cbd9e6; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; user-select:none;">
                        ${letra}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- SISTEMA UNIFICADO: CLIQUE OU ARRASTO ---
function startDrag(e) {
    const el = e.target.closest('.letter-card');
    if (!el) return;
    
    // Captura posição inicial
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    startPos = { x: touch.clientX, y: touch.clientY };
    
    draggedElement = el;
    isDraggingActive = false;
    
    const rect = draggedElement.getBoundingClientRect();
    const offsetX = startPos.x - rect.left;
    const offsetY = startPos.y - rect.top;

    function onMove(ev) {
        const t = ev.type === 'touchmove' ? ev.touches[0] : ev;
        
        // Se moveu mais de 10px, ativa o modo "arrastar"
        if (Math.abs(t.clientX - startPos.x) > 10 || Math.abs(t.clientY - startPos.y) > 10) {
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
        const correctLetter = JOGO_CONFIG.categorias[currentCategory].itens[currentIndex].nome[0];

        if (!isDraggingActive) {
            // FOI UM CLIQUE/TOQUE
            checkLetter(draggedElement.dataset.val, correctLetter);
        } else {
            // FOI UM ARRASTO
            const dropTarget = document.elementFromPoint(t.clientX, t.clientY)?.closest('#target-letter');
            if (dropTarget) {
                checkLetter(draggedElement.dataset.val, correctLetter);
            }
        }

        // Reset visual do elemento
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
    if(!target) return;

    target.innerText = escolhida;
    target.style.borderStyle = "solid";

    if (escolhida === correta) {
        sndAcerto.play();
        score += JOGO_CONFIG.pontuacao.acertoNivel1;
        document.getElementById('score-val').innerText = score;
        target.style.background = "rgba(240, 255, 240, 0.8)";
        target.style.borderColor = "var(--highlight-green)";
        target.style.color = "var(--highlight-green)";
        setTimeout(nextRound, 1200);
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        target.style.background = "rgba(255, 245, 245, 0.8)";
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
    if (roundInLevel < 5 && currentIndex < JOGO_CONFIG.categorias[currentCategory].itens.length) {
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
    .letter-card:active { transform: scale(0.92); transition: 0.1s; }
    .pop-animation { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .shake-animation { animation: shake 0.4s; }
    @keyframes popIn { 0% { transform: scale(0.5); opacity:0; } 100% { transform: scale(1); opacity:1; } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
`;
document.head.appendChild(styleTag);
