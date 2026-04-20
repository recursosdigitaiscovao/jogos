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

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.addEventListener('load', () => {
    // Configuração inicial dos ícones
    document.getElementById('rd-intro-btn').src = JOGO_CONFIG.caminhoImg + "rd.png";
    document.getElementById('rd-game-btn').src = JOGO_CONFIG.caminhoImg + "rd.png";

    // Iniciar com a primeira categoria
    selectCategory(Object.keys(JOGO_CONFIG.categorias)[0]);
});

// Função para mudar de categoria (pode ser chamada a qualquer momento)
window.selectCategory = function(key) {
    currentCategory = key;
    const cat = JOGO_CONFIG.categorias[key];
    let all = [...cat.itens].sort(() => Math.random() - 0.5);
    gameItems = all.slice(0, 10);

    // Gerar Tutorial Animado para esta categoria
    renderTutorial(cat);

    // Se estiver no meio de um jogo, reinicia
    if(document.getElementById('scr-game').classList.contains('active')) {
        initGame();
    }
};

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    const itemExemplo = cat.itens[0]; // Usa o primeiro item para o exemplo
    
    container.innerHTML = `
        <div style="position:relative; width:220px; height:180px; background:white; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden;">
            <img src="${JOGO_CONFIG.caminhoImg}${itemExemplo.img}" style="height:70px; margin-bottom:10px;">
            <div style="display:flex; gap:5px; margin-bottom:15px;">
                <div style="width:30px; height:30px; border:2px dashed #ccc; border-radius:5px;"></div>
                <div style="width:30px; height:30px; border:2px dashed #ccc; border-radius:5px;"></div>
            </div>
            <div id="tuto-silaba" style="background:var(--primary-blue); color:white; padding:5px 10px; border-radius:8px; font-weight:900; font-size:14px; position:absolute; bottom:20px; left:30px; z-index:10;">
                ${itemExemplo.silabas[0]}
            </div>
            <i class="fas fa-hand-pointer" id="tuto-hand" style="position:absolute; bottom:10px; left:50px; color:#f39c12; font-size:24px; z-index:11;"></i>
        </div>
        <style>
            @keyframes handMove {
                0% { transform: translate(0,0); }
                50% { transform: translate(40px, -70px); }
                100% { transform: translate(40px, -70px); opacity:0; }
            }
            #tuto-hand, #tuto-silaba { animation: handMove 2s infinite ease-in-out; }
        </style>
    `;
}

function initGame() {
    currentIndex = 0;
    roundInLevel = 0;
    currentLevel = 1;
    score = 0;
    timerSeconds = 0;
    document.getElementById('score-val').innerText = score;
    
    setupDots();
    startTimer();
    renderRound();
}

function setupDots() {
    const dotsContainer = document.getElementById('dots-container');
    dotsContainer.innerHTML = '';
    for(let i=0; i<5; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
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
    const item = gameItems[currentIndex];
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
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:10px;">
            <div style="color:var(--primary-blue); font-weight:900; font-size:12px; background:#fff; padding:2px 15px; border-radius:20px;">NÍVEL ${currentLevel}</div>
            
            <div id="word-hint" style="font-size:26px; font-weight:900; color:var(--primary-blue); letter-spacing:4px; height:35px;">
                ${isLevel2 ? '???' : item.nome}
            </div>

            <div style="background:white; padding:10px; border-radius:25px; box-shadow:0 8px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:120px; max-width:200px; object-fit:contain;" draggable="false">
            </div>

            <div id="drop-zones" style="display:flex; gap:10px; min-height:70px; justify-content:center; width:100%; margin: 10px 0;">
                ${item.silabas.map((_, i) => `
                    <div class="target-box" data-idx="${i}" 
                         style="width:65px; height:65px; border:3px dashed #cbd9e6; border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:22px; color:var(--primary-dark); background:rgba(255,255,255,0.5);">
                    </div>
                `).join('')}
            </div>

            <div id="drag-options" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; padding:10px;">
                ${shuffleArray([...item.silabas]).map((sil, i) => `
                    <div class="silaba-card" 
                         draggable="true"
                         onclick="handleSyllableClick(this, '${sil}')"
                         onmousedown="startDrag(event)" 
                         ontouchstart="startDrag(event)"
                         data-silaba="${sil}"
                         style="background:white; padding:12px 18px; border-radius:15px; font-weight:900; font-size:22px; color:var(--text-grey); cursor:grab; box-shadow:0 5px 0 #d0e0f0; border:1px solid #eee; touch-action:none; user-select:none;">
                        ${sil}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- CLIQUE ---
function handleSyllableClick(el, sil) {
    if (el.style.visibility === 'hidden') return;
    const targets = document.querySelectorAll('.target-box');
    for (let i = 0; i < targets.length; i++) {
        if (!selectedSyllables[i]) {
            fillTarget(i, sil, el);
            break;
        }
    }
}

function fillTarget(targetIdx, silaba, originalEl) {
    const target = document.querySelector(`.target-box[data-idx="${targetIdx}"]`);
    target.innerText = silaba;
    target.style.background = "white";
    target.style.border = "2px solid var(--primary-blue)";
    target.style.transform = "scale(1.1)";
    setTimeout(() => target.style.transform = "scale(1)", 150);
    
    originalEl.style.visibility = 'hidden';
    selectedSyllables[targetIdx] = silaba;

    if (selectedSyllables.filter(s => s !== null).length === gameItems[currentIndex].silabas.length) {
        setTimeout(checkWord, 400);
    }
}

// --- DRAG & DROP AFINADO ---
function startDrag(e) {
    draggedElement = e.target.closest('.silaba-card');
    if (!draggedElement || draggedElement.style.visibility === 'hidden') return;

    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    const rect = draggedElement.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    draggedElement.style.zIndex = '2000';
    draggedElement.style.transform = 'scale(1.1)';
    draggedElement.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';

    const moveEvent = e.type === 'touchstart' ? 'touchmove' : 'mousemove';
    const upEvent = e.type === 'touchstart' ? 'touchend' : 'mouseup';

    function onMove(ev) {
        const x = (ev.type === 'touchmove' ? ev.touches[0].clientX : ev.clientX);
        const y = (ev.type === 'touchmove' ? ev.touches[0].clientY : ev.clientY);
        
        draggedElement.style.position = 'fixed';
        draggedElement.style.left = (x - offsetX) + 'px';
        draggedElement.style.top = (y - offsetY) + 'px';

        // Feedback visual de hover
        document.querySelectorAll('.target-box').forEach(box => {
            const b = box.getBoundingClientRect();
            if (x > b.left && x < b.right && y > b.top && y < b.bottom) {
                box.style.background = "#d0e8ff";
            } else {
                box.style.background = "rgba(255,255,255,0.5)";
            }
        });
    }

    function onUp(ev) {
        document.removeEventListener(moveEvent, onMove);
        document.removeEventListener(upEvent, onUp);

        const endX = (ev.type === 'touchend' ? ev.changedTouches[0].clientX : ev.clientX);
        const endY = (ev.type === 'touchend' ? ev.changedTouches[0].clientY : ev.clientY);

        // Encontrar a caixa de destino
        const dropTarget = document.elementFromPoint(endX, endY)?.closest('.target-box');

        if (dropTarget && !selectedSyllables[dropTarget.dataset.idx]) {
            fillTarget(dropTarget.dataset.idx, draggedElement.dataset.silaba, draggedElement);
            // Reset parcial para não "saltar" antes de ocultar
            draggedElement.style.position = '';
        } else {
            // Volta para a origem
            draggedElement.style.transition = '0.3s';
            draggedElement.style.position = '';
            draggedElement.style.left = '';
            draggedElement.style.top = '';
            draggedElement.style.transform = '';
            draggedElement.style.boxShadow = '0 5px 0 #d0e0f0';
            setTimeout(() => draggedElement.style.transition = '', 300);
        }
        draggedElement.style.zIndex = '';
    }

    document.addEventListener(moveEvent, onMove);
    document.addEventListener(upEvent, onUp);
}

// --- LOGICA DE JOGO ---
function checkWord() {
    const item = gameItems[currentIndex];
    const userWord = selectedSyllables.join('');
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
        setTimeout(renderRound, 800);
    }
}

function nextRound() {
    currentIndex++;
    roundInLevel++;

    if (roundInLevel < 5) {
        renderRound();
    } else {
        if (currentLevel === 1) {
            currentLevel = 2;
            roundInLevel = 0;
            setupDots();
            renderRound();
        } else {
            finishGame();
        }
    }
}

function finishGame() {
    clearInterval(timerInterval);
    sndVitoria.play();
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText.replace('⏳ ', '');
    
    let rel = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
    goToResult();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
