let currentCategory = 'animais';
let gameItems = [];
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let selectedSyllables = []; // Guarda as sílabas colocadas e a referência ao elemento original
let draggedElement = null;

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.addEventListener('load', () => {
    document.getElementById('rd-intro-btn').src = JOGO_CONFIG.caminhoImg + "rd.png";
    document.getElementById('rd-game-btn').src = JOGO_CONFIG.caminhoImg + "rd.png";
    selectCategory(Object.keys(JOGO_CONFIG.categorias)[0]);
});

// Seleção de categoria e atualização do Tutorial
window.selectCategory = function(key) {
    currentCategory = key;
    const cat = JOGO_CONFIG.categorias[key];
    let all = [...cat.itens].sort(() => Math.random() - 0.5);
    gameItems = all.slice(0, 10);

    renderTutorial(cat);

    if(document.getElementById('scr-game').classList.contains('active')) {
        initGame();
    }
};

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    const item = cat.itens[0];
    const sil Shuffled = [...item.silabas].reverse(); // Simula desordem
    
    container.innerHTML = `
        <div class="tutorial-box" style="position:relative; width:260px; height:200px; background:white; border-radius:25px; box-shadow:0 10px 30px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; border: 4px solid #f0f7ff;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:60px; margin-bottom:10px;">
            
            <!-- Caixas de destino -->
            <div style="display:flex; gap:8px; margin-bottom:20px;">
                <div class="tuto-target" style="width:35px; height:35px; border:2px dashed #ddd; border-radius:8px;"></div>
                <div class="tuto-target" style="width:35px; height:35px; border:2px dashed #ddd; border-radius:8px;"></div>
            </div>

            <!-- Sílabas desordenadas -->
            <div style="display:flex; gap:10px;">
                <div id="tuto-sil-1" style="background:#eee; padding:5px 10px; border-radius:8px; font-weight:900; font-size:14px; color:#999;">${silShuffled[0]}</div>
                <div id="tuto-sil-drag" style="background:var(--primary-blue); color:white; padding:5px 10px; border-radius:8px; font-weight:900; font-size:14px; position:absolute; z-index:10; left:140px; bottom:30px;">${item.silabas[0]}</div>
            </div>

            <i class="fas fa-hand-pointer" id="tuto-hand" style="position:absolute; bottom:20px; left:155px; color:#f39c12; font-size:24px; z-index:11;"></i>
        </div>
        <style>
            @keyframes tutoMove {
                0% { transform: translate(0,0); }
                30% { transform: translate(-60px, -90px); }
                70% { transform: translate(-60px, -90px); opacity:1; }
                100% { transform: translate(-60px, -90px); opacity:0; }
            }
            #tuto-hand, #tuto-sil-drag { animation: tutoMove 3s infinite ease-in-out; }
        </style>
    `;
}

function initGame() {
    currentIndex = 0; roundInLevel = 0; currentLevel = 1; score = 0; timerSeconds = 0;
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
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:8px;">
            <div style="color:var(--primary-blue); font-weight:900; font-size:12px; background:#fff; padding:2px 15px; border-radius:20px; border:1px solid #d0e0f0;">NÍVEL ${currentLevel}</div>
            <div id="word-hint" style="font-size:26px; font-weight:900; color:var(--primary-blue); letter-spacing:4px; height:35px;">${isLevel2 ? '???' : item.nome}</div>

            <div style="background:white; padding:10px; border-radius:25px; box-shadow:0 8px 20px rgba(0,0,0,0.05); margin-bottom:5px;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:110px; max-width:180px; object-fit:contain;" draggable="false">
            </div>

            <div id="drop-zones" style="display:flex; gap:10px; min-height:70px; justify-content:center; width:100%;">
                ${item.silabas.map((_, i) => `
                    <div class="target-box" data-idx="${i}" onclick="removeSyllable(${i})"
                         style="width:65px; height:65px; border:3px dashed #cbd9e6; border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:22px; color:var(--primary-dark); background:rgba(255,255,255,0.5); cursor:pointer;">
                    </div>
                `).join('')}
            </div>

            <div id="drag-options" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; padding:10px;">
                ${shuffleArray([...item.silabas]).map((sil, i) => `
                    <div class="silaba-card" 
                         draggable="true"
                         onmousedown="startDrag(event)" ontouchstart="startDrag(event)"
                         data-silaba="${sil}" id="sil-orig-${currentIndex}-${i}"
                         style="background:white; padding:12px 18px; border-radius:15px; font-weight:900; font-size:22px; color:var(--text-grey); cursor:grab; box-shadow:0 5px 0 #d0e0f0; border:1px solid #eee; touch-action:none;">
                        ${sil}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// REMOVER SÍLABA (CORREÇÃO)
window.removeSyllable = function(idx) {
    const data = selectedSyllables[idx];
    if(!data) return;

    // Torna a sílaba original visível novamente
    const originalEl = document.getElementById(data.originalId);
    if(originalEl) originalEl.style.visibility = 'visible';

    // Limpa a caixa
    const target = document.querySelector(`.target-box[data-idx="${idx}"]`);
    target.innerText = "";
    target.style.background = "rgba(255,255,255,0.5)";
    target.style.border = "3px dashed #cbd9e6";
    
    selectedSyllables[idx] = null;
};

function fillTarget(targetIdx, silaba, originalEl) {
    const target = document.querySelector(`.target-box[data-idx="${targetIdx}"]`);
    target.innerText = silaba;
    target.style.background = "white";
    target.style.border = "2px solid var(--primary-blue)";
    
    originalEl.style.visibility = 'hidden';
    selectedSyllables[targetIdx] = { silaba: silaba, originalId: originalEl.id };

    if (selectedSyllables.filter(s => s !== null).length === gameItems[currentIndex].silabas.length) {
        setTimeout(checkWord, 400);
    }
}

// DRAG & DROP COM LANÇAMENTO
function startDrag(e) {
    draggedElement = e.target.closest('.silaba-card');
    if (!draggedElement || draggedElement.style.visibility === 'hidden') return;

    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    const rect = draggedElement.getBoundingClientRect();
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    draggedElement.style.zIndex = '2000';
    draggedElement.style.transform = 'scale(1.1) rotate(3deg)';
    draggedElement.style.pointerEvents = 'none'; // Importante para o elementFromPoint

    const moveEvent = e.type === 'touchstart' ? 'touchmove' : 'mousemove';
    const upEvent = e.type === 'touchstart' ? 'touchend' : 'mouseup';

    function onMove(ev) {
        const x = (ev.type === 'touchmove' ? ev.touches[0].clientX : ev.clientX);
        const y = (ev.type === 'touchmove' ? ev.touches[0].clientY : ev.clientY);
        draggedElement.style.position = 'fixed';
        draggedElement.style.left = (x - offsetX) + 'px';
        draggedElement.style.top = (y - offsetY) + 'px';
    }

    function onUp(ev) {
        document.removeEventListener(moveEvent, onMove);
        document.removeEventListener(upEvent, onUp);

        const endX = (ev.type === 'touchend' ? ev.changedTouches[0].clientX : ev.clientX);
        const endY = (ev.type === 'touchend' ? ev.changedTouches[0].clientY : ev.clientY);

        // Verifica o que está por baixo da posição onde soltou
        const dropTarget = document.elementFromPoint(endX, endY)?.closest('.target-box');

        if (dropTarget && !selectedSyllables[dropTarget.dataset.idx]) {
            fillTarget(dropTarget.dataset.idx, draggedElement.dataset.silaba, draggedElement);
            draggedElement.style.position = '';
        } else {
            // Volta para a posição original
            draggedElement.style.transition = '0.3s';
            draggedElement.style.position = '';
            draggedElement.style.left = '';
            draggedElement.style.top = '';
            draggedElement.style.transform = '';
            setTimeout(() => draggedElement.style.transition = '', 300);
        }
        draggedElement.style.zIndex = '';
        draggedElement.style.pointerEvents = 'auto';
    }

    document.addEventListener(moveEvent, onMove);
    document.addEventListener(upEvent, onUp);
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
        // Não reseta automático para permitir que o aluno corrija clicando na caixa
    }
}

function nextRound() {
    currentIndex++; roundInLevel++;
    if (roundInLevel < 5) renderRound();
    else {
        if (currentLevel === 1) {
            currentLevel = 2; roundInLevel = 0;
            alert("Nível 1 concluído! Agora sem ajuda!");
            setupDots(); renderRound();
        } else finishGame();
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
