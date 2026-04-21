let currentCategory = 'cat1';
let currentIndex = 0; 
let roundInLevel = 0; 
let score = 0;
let timerSeconds = 0;
let timerInterval;
let draggedElement = null;
let isDraggingActive = false;

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
        card.style.cssText = "background:#fff; border-radius:20px; padding:15px; text-align:center; cursor:pointer; box-shadow:0 5px 15px rgba(0,0,0,0.08);";
        card.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:60px; height:60px; object-fit:contain;" onerror="this.src='${JOGO_CONFIG.caminhoImg}cat_animais.png'"><br><small>${cat.nome}</small>`;
        card.onclick = () => { window.selectCategory(k); closeMenus(); };
        rdList.appendChild(card);
    });
}

window.selectCategory = function(key) {
    currentCategory = key;
    renderTutorial(JOGO_CONFIG.categorias[key]);
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
};

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `
        <div style="text-align:center;">
            <i class="fas fa-hand-pointer" style="font-size:40px; color:var(--primary-blue); animation: fingerTap 1.5s infinite;"></i>
            <p style="margin-top:10px; font-weight:900; color:var(--text-grey);">Clica na letra correta!</p>
        </div>
        <style>
            @keyframes fingerTap { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.8); } }
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
            const dot = document.createElement('div'); 
            dot.className = 'dot'; 
            dc.appendChild(dot); 
        } 
    }
}

function renderRound() {
    const cat = JOGO_CONFIG.categorias[currentCategory];
    const ronda = cat.rondas[currentIndex];
    if(!ronda) { finishGame(); return; }

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    
    // Palavra sem a primeira letra
    const suffix = ronda.palavra.substring(1);
    const correctLetter = ronda.palavra[0];

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:15px; touch-action:none;">
            
            <!-- Imagem do Objeto -->
            <div style="background: white; padding: 15px; border-radius: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); width: 180px; height: 180px; display: flex; align-items: center; justify-content: center;">
                <img src="${JOGO_CONFIG.caminhoImg}${ronda.img}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>

            <!-- Palavra com Espaço Vazio -->
            <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                <div id="target-letter" style="width: 60px; height: 70px; background: #e0e8f0; border: 3px dashed var(--primary-blue); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 900; color: var(--primary-blue);">
                    _
                </div>
                <div style="font-size: 50px; font-weight: 900; color: var(--text-grey); letter-spacing: 5px;">
                    ${suffix}
                </div>
            </div>

            <!-- Opções de Letras -->
            <div id="drag-options" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; padding:15px; background:rgba(255,255,255,0.4); border-radius:25px; width:100%;">
                ${ronda.opcoes.sort(() => Math.random() - 0.5).map(letra => `
                    <div class="letter-card" 
                         onclick="checkLetter('${letra}', '${correctLetter}')"
                         onmousedown="startDrag(event)" ontouchstart="startDrag(event)"
                         data-val="${letra}"
                         style="background: #ffffff; width: 70px; height: 70px; border-radius:15px; font-weight:900; font-size: 30px; color:var(--primary-dark); cursor:pointer; box-shadow:0 5px 0 #cbd9e6; border:2px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; user-select:none;">
                        ${letra}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function checkLetter(escolhida, correta) {
    const target = document.getElementById('target-letter');
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

        setTimeout(() => {
            target.innerText = "_";
            target.style.background = "#e0e8f0";
            target.style.borderColor = "var(--primary-blue)";
            target.style.borderStyle = "dashed";
            target.style.color = "var(--primary-blue)";
        }, 1000);
    }
}

// Lógica de Drag and Drop (opcional, mas mantida para fluidez)
function startDrag(e) {
    const el = e.target.closest('.letter-card');
    if (!el) return;
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
        draggedElement.style.left = (x - offsetX) + 'px';
        draggedElement.style.top = (y - offsetY) + 'px';
        draggedElement.style.transform = 'scale(1.1)';
    }

    function onUp(ev) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);

        if (isDraggingActive) {
            const x = (ev.type === 'touchend' ? ev.changedTouches[0].clientX : ev.clientX);
            const y = (ev.type === 'touchend' ? ev.changedTouches[0].clientY : ev.clientY);
            const dropTarget = document.elementFromPoint(x, y)?.closest('#target-letter');
            
            if (dropTarget) {
                const correta = JOGO_CONFIG.categorias[currentCategory].rondas[currentIndex].palavra[0];
                checkLetter(draggedElement.dataset.val, correta);
            }
        }

        draggedElement.style.position = ''; 
        draggedElement.style.transform = '';
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
}

function nextRound() {
    currentIndex++; roundInLevel++;
    if (roundInLevel < 5) renderRound();
    else finishGame();
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
    timerInterval = setInterval(() => {
        timerSeconds++;
        const min = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const sec = (timerSeconds % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `⏳ ${min}:${sec}`;
    }, 1000);
}

const styleTag = document.createElement('style');
styleTag.innerHTML = `.letter-card:active { transform: scale(0.92); transition: 0.1s; }`;
document.head.appendChild(styleTag);
