let currentCategory = 'animais';
let gameItems = [];
let currentIndex = 0;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let selectedSyllables = [];

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// Elemento que está a ser arrastado
let draggedElement = null;

window.addEventListener('load', () => {
    // Injetar animação inicial
    document.getElementById('intro-animation-container').innerHTML = `
        <img src="${JOGO_CONFIG.caminhoImg}intro_anim.gif" style="width:180px; margin-bottom:20px; border-radius:20px;" 
             onerror="this.src='${JOGO_CONFIG.caminhoImg}${JOGO_CONFIG.categorias.animais.imgCapa}'">
    `;
    
    // Corrigir ícones da Roleta (RD)
    document.getElementById('rd-intro-btn').src = JOGO_CONFIG.caminhoImg + "rd.png";
    document.getElementById('rd-game-btn').src = JOGO_CONFIG.caminhoImg + "rd.png";

    selectCategory(Object.keys(JOGO_CONFIG.categorias)[0]);
});

function selectCategory(key) {
    currentCategory = key;
    const cat = JOGO_CONFIG.categorias[key];
    let all = [...cat.itens].sort(() => Math.random() - 0.5);
    gameItems = all.slice(0, 10);
    // REMOVIDO: a linha que trocava o rd-intro-btn pela imagem do gato
}

function initGame() {
    currentIndex = 0;
    score = 0;
    timerSeconds = 0;
    document.getElementById('score-val').innerText = score;
    
    const dotsContainer = document.getElementById('dots-container');
    dotsContainer.innerHTML = '';
    for(let i=0; i<10; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
    }

    startTimer();
    renderRound();
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
    const isLevel2 = currentIndex >= 5;
    selectedSyllables = new Array(item.silabas.length).fill(null);

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active');
        if(i < currentIndex) d.classList.add('done');
        if(i === currentIndex) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:10px;">
            <div id="word-hint" style="font-size:24px; font-weight:900; color:var(--primary-blue); letter-spacing:4px; height:35px;">
                ${isLevel2 ? '???' : item.nome}
            </div>

            <div style="background:white; padding:10px; border-radius:25px; box-shadow:0 8px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:120px; object-fit:contain;" draggable="false">
            </div>

            <div id="drop-zones" style="display:flex; gap:10px; min-height:70px; justify-content:center; width:100%; margin: 10px 0;">
                ${item.silabas.map((_, i) => `
                    <div class="target-box" data-idx="${i}" 
                         style="width:65px; height:65px; border:3px dashed #cbd9e6; border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:22px; color:var(--primary-dark); background:rgba(255,255,255,0.5);">
                    </div>
                `).join('')}
            </div>

            <div id="drag-options" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
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

// --- LÓGICA DE CLIQUE ---
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
    target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    originalEl.style.visibility = 'hidden';
    selectedSyllables[targetIdx] = silaba;

    if (selectedSyllables.filter(s => s !== null).length === gameItems[currentIndex].silabas.length) {
        checkWord();
    }
}

// --- LÓGICA DE ARRASTAR (DRAG & DROP) ---
function startDrag(e) {
    draggedElement = e.target.closest('.silaba-card');
    if (!draggedElement) return;

    draggedElement.style.cursor = 'grabbing';
    draggedElement.style.zIndex = '1000';
    
    const moveEvent = e.type === 'touchstart' ? 'touchmove' : 'mousemove';
    const upEvent = e.type === 'touchstart' ? 'touchend' : 'mouseup';

    const onMove = (event) => {
        const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
        const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
        
        draggedElement.style.position = 'fixed';
        draggedElement.style.left = (clientX - draggedElement.offsetWidth / 2) + 'px';
        draggedElement.style.top = (clientY - draggedElement.offsetHeight / 2) + 'px';
    };

    const onUp = (event) => {
        document.removeEventListener(moveEvent, onMove);
        document.removeEventListener(upEvent, onUp);
        
        const clientX = event.type === 'touchend' ? event.changedTouches[0].clientX : event.clientX;
        const clientY = event.type === 'touchend' ? event.changedTouches[0].clientY : event.clientY;

        draggedElement.style.display = 'none'; // Esconder temporariamente para ver o que está por baixo
        const dropTarget = document.elementFromPoint(clientX, clientY)?.closest('.target-box');
        draggedElement.style.display = 'block';

        if (dropTarget && !selectedSyllables[dropTarget.dataset.idx]) {
            const sil = draggedElement.dataset.silaba;
            fillTarget(dropTarget.dataset.idx, sil, draggedElement);
        }
        
        // Resetar estilo se não foi dropado com sucesso
        draggedElement.style.position = '';
        draggedElement.style.left = '';
        draggedElement.style.top = '';
        draggedElement.style.zIndex = '';
        draggedElement.style.cursor = 'grab';
    };

    document.addEventListener(moveEvent, onMove);
    document.addEventListener(upEvent, onUp);
}

// --- VERIFICAÇÃO E PROGRESSO ---
function checkWord() {
    const item = gameItems[currentIndex];
    const userWord = selectedSyllables.join('');
    const correctWord = item.silabas.join('');

    if (userWord === correctWord) {
        sndAcerto.play();
        const isLevel2 = currentIndex >= 5;
        score += isLevel2 ? JOGO_CONFIG.pontuacao.acertoNivel2 : JOGO_CONFIG.pontuacao.acertoNivel1;
        document.getElementById('score-val').innerText = score;
        document.querySelectorAll('.target-box').forEach(b => b.style.borderColor = "var(--highlight-green)");
        setTimeout(nextRound, 1000);
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
    if (currentIndex < gameItems.length) {
        renderRound();
    } else {
        finishGame();
    }
}

function finishGame() {
    clearInterval(timerInterval);
    sndVitoria.play();
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText.replace('⏳ ', '');
    
    let rel = JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length - 1];
    for (let r of JOGO_CONFIG.relatorios) {
        if (score >= r.min) { rel = r; break; }
    }
    
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
