let currentCategory = 'animais';
let gameItems = [];
let currentIndex = 0; // 0 a 9 (total 10 itens)
let roundInLevel = 0; // 0 a 4
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
    // Intro animada
    document.getElementById('intro-animation-container').innerHTML = `
        <img src="${JOGO_CONFIG.caminhoImg}intro_anim.gif" style="width:180px; margin-bottom:20px; border-radius:20px;" 
             onerror="this.src='${JOGO_CONFIG.caminhoImg}${JOGO_CONFIG.categorias.animais.imgCapa}'">
    `;
    
    // Garantir ícone RD
    document.getElementById('rd-intro-btn').src = JOGO_CONFIG.caminhoImg + "rd.png";
    document.getElementById('rd-game-btn').src = JOGO_CONFIG.caminhoImg + "rd.png";

    // Categoria inicial padrão
    setCategoryData(Object.keys(JOGO_CONFIG.categorias)[0]);
});

// Esta função apenas prepara os dados sem iniciar o cronómetro (usada no menu)
function setCategoryData(key) {
    currentCategory = key;
    const cat = JOGO_CONFIG.categorias[key];
    let all = [...cat.itens].sort(() => Math.random() - 0.5);
    gameItems = all.slice(0, 10); // 5 para nível 1, 5 para nível 2
}

// Chamada pelo template quando selecionas uma categoria no menu lateral ou roleta
window.selectCategory = function(key) {
    setCategoryData(key);
    // Se o jogo já estiver a decorrer (ecrã game ativo), reinicia o jogo
    if(document.getElementById('scr-game').classList.contains('active')) {
        initGame();
    }
};

function initGame() {
    currentIndex = 0;
    roundInLevel = 0;
    currentLevel = 1;
    score = 0;
    timerSeconds = 0;
    document.getElementById('score-val').innerText = score;
    
    startTimer();
    setupDots();
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

    // Atualizar Dots (0 a 4)
    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:10px;">
            <div style="color:var(--primary-blue); font-weight:900; font-size:14px; text-transform:uppercase; background:#fff; padding:2px 12px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.05)">Nível ${currentLevel}</div>
            
            <div id="word-hint" style="font-size:26px; font-weight:900; color:var(--primary-blue); letter-spacing:4px; height:35px; transition: 0.3s;">
                ${isLevel2 ? '???' : item.nome}
            </div>

            <div style="background:white; padding:10px; border-radius:25px; box-shadow:0 8px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:125px; max-width:200px; object-fit:contain;" draggable="false">
            </div>

            <div id="drop-zones" style="display:flex; gap:10px; min-height:70px; justify-content:center; width:100%; margin: 5px 0;">
                ${item.silabas.map((_, i) => `
                    <div class="target-box" data-idx="${i}" 
                         style="width:65px; height:65px; border:3px dashed #cbd9e6; border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:22px; color:var(--primary-dark); background:rgba(255,255,255,0.5); transition: 0.2s;">
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
                         style="background:white; padding:12px 18px; border-radius:15px; font-weight:900; font-size:22px; color:var(--text-grey); cursor:grab; box-shadow:0 5px 0 #d0e0f0; border:1px solid #eee; touch-action:none; user-select:none; transition: transform 0.1s;">
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
    target.style.transform = "scale(1.05)";
    setTimeout(() => target.style.transform = "scale(1)", 200);
    
    originalEl.style.visibility = 'hidden';
    selectedSyllables[targetIdx] = silaba;

    if (selectedSyllables.filter(s => s !== null).length === gameItems[currentIndex].silabas.length) {
        setTimeout(checkWord, 300);
    }
}

// --- DRAG & DROP MELHORADO ---
function startDrag(e) {
    draggedElement = e.target.closest('.silaba-card');
    if (!draggedElement || draggedElement.style.visibility === 'hidden') return;

    const rect = draggedElement.getBoundingClientRect();
    const shiftX = (e.type === 'touchstart' ? e.touches[0].clientX : e.clientX) - rect.left;
    const shiftY = (e.type === 'touchstart' ? e.touches[0].clientY : e.clientY) - rect.top;

    draggedElement.style.transition = 'none';
    draggedElement.style.zIndex = '2000';
    draggedElement.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    draggedElement.style.transform = 'scale(1.1)';

    const moveEvent = e.type === 'touchstart' ? 'touchmove' : 'mousemove';
    const upEvent = e.type === 'touchstart' ? 'touchend' : 'mouseup';

    function onMove(ev) {
        const x = (ev.type === 'touchmove' ? ev.touches[0].clientX : ev.clientX) - shiftX;
        const y = (ev.type === 'touchmove' ? ev.touches[0].clientY : ev.clientY) - shiftY;
        
        draggedElement.style.position = 'fixed';
        draggedElement.style.left = x + 'px';
        draggedElement.style.top = y + 'px';

        // Feedback visual na caixa mais próxima
        checkHover(ev);
    }

    function checkHover(ev) {
        const x = (ev.type === 'touchmove' ? ev.touches[0].clientX : ev.clientX);
        const y = (ev.type === 'touchmove' ? ev.touches[0].clientY : ev.clientY);
        
        document.querySelectorAll('.target-box').forEach(box => {
            const bRect = box.getBoundingClientRect();
            if (x > bRect.left && x < bRect.right && y > bRect.top && y < bRect.bottom) {
                box.style.background = "#e0f0ff";
            } else {
                box.style.background = "rgba(255,255,255,0.5)";
            }
        });
    }

    function onUp(ev) {
        document.removeEventListener(moveEvent, onMove);
        document.removeEventListener(upEvent, onUp);

        const x = (ev.type === 'touchend' ? ev.changedTouches[0].clientX : ev.clientX);
        const y = (ev.type === 'touchend' ? ev.changedTouches[0].clientY : ev.clientY);

        const dropTarget = document.elementFromPoint(x, y)?.closest('.target-box');

        if (dropTarget && !selectedSyllables[dropTarget.dataset.idx]) {
            fillTarget(dropTarget.dataset.idx, draggedElement.dataset.silaba, draggedElement);
            // Reset de estilo
            draggedElement.style.position = '';
            draggedElement.style.transform = '';
        } else {
            // Volta para a posição original de forma suave
            draggedElement.style.transition = '0.3s';
            draggedElement.style.position = '';
            draggedElement.style.left = '';
            draggedElement.style.top = '';
            draggedElement.style.transform = '';
            draggedElement.style.boxShadow = '0 5px 0 #d0e0f0';
        }
        draggedElement.style.zIndex = '';
    }

    document.addEventListener(moveEvent, onMove);
    document.addEventListener(upEvent, onUp);
}

// --- LÓGICA DE PROGRESSÃO ---
function checkWord() {
    const item = gameItems[currentIndex];
    const userWord = selectedSyllables.join('');
    const correctWord = item.silabas.join('');

    if (userWord === correctWord) {
        sndAcerto.play();
        score += (currentLevel === 2) ? JOGO_CONFIG.pontuacao.acertoNivel2 : JOGO_CONFIG.pontuacao.acertoNivel1;
        document.getElementById('score-val').innerText = score;
        document.querySelectorAll('.target-box').forEach(b => {
            b.style.borderColor = "var(--highlight-green)";
            b.style.color = "var(--highlight-green)";
        });
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
    roundInLevel++;

    if (roundInLevel < 5) {
        // Continua no mesmo nível
        renderRound();
    } else {
        // Fim de um bloco de 5
        if (currentLevel === 1) {
            currentLevel = 2;
            roundInLevel = 0;
            alert("Nível 1 Concluído! Vamos para o Nível 2?");
            setupDots(); // Reseta as 5 bolas para o novo nível
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
