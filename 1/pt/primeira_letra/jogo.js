let currentCategory = 'animais';
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
        card.style.cssText = "background:#fff; border-radius:20px; padding:15px; text-align:center; cursor:pointer; box-shadow:0 5px 15px rgba(0,0,0,0.08); display:flex; flex-direction:column; align-items:center; justify-content:center;";
        card.innerHTML = `
            <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:65px; height:65px; object-fit:contain; margin-bottom:5px;">
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
    container.innerHTML = `
        <div style="position:relative; width:200px; height:150px; margin:0 auto; background:rgba(255,255,255,0.3); border-radius:30px; border:3px dashed var(--primary-blue);">
            <div style="position:absolute; top:20px; left:50%; transform:translateX(-50%); width:60px; height:70px; background:rgba(255,255,255,0.5); border:3px solid var(--primary-blue); border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:30px;">V</div>
            <i class="fas fa-hand-pointer" style="position:absolute; top:90px; left:50%; font-size:45px; color:#f39c12; animation: tutoTap 2s infinite;"></i>
        </div>
        <style>
            @keyframes tutoTap { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-40px) scale(0.8); opacity:0.7; } }
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
    const item = cat.itens[currentIndex];
    if(!item) { finishGame(); return; }

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    const correctLetter = item.nome[0];
    const restOfWord = item.nome.substring(1);

    // Gerar letras aleatórias para as opções
    let options = [correctLetter];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while(options.length < 4) {
        let randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if(!options.includes(randomLetter)) options.push(randomLetter);
    }
    options.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px; touch-action:none;">
            
            <div class="pop-animation" style="background: white; padding: 10px; border-radius: 40px; box-shadow: 0 15px 35px rgba(176,196,217,0.5); width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; border: 5px solid #f0f7ff;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
            </div>

            <div style="display: flex; align-items: center; gap: 15px;">
                <div id="target-letter" style="width: 80px; height: 90px; background: rgba(255,255,255,0.5); border: 4px dashed var(--primary-blue); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 50px; font-weight: 900; color: var(--primary-blue);">
                    _
                </div>
                <div style="font-size: 60px; font-weight: 900; color: var(--text-grey); letter-spacing: 5px;">
                    ${restOfWord}
                </div>
            </div>

            <div id="drag-options" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; padding:15px; background:rgba(255,255,255,0.4); border-radius:30px; width:100%;">
                ${options.map(letra => `
                    <div class="letter-card" 
                         onclick="checkLetter('${letra}', '${correctLetter}')"
                         onmousedown="startDrag(event)" ontouchstart="startDrag(event)"
                         data-val="${letra}"
                         style="background: rgba(255,255,255,0.5); width: 80px; height: 80px; border-radius:22px; font-weight:900; font-size: 40px; color:var(--primary-dark); cursor:pointer; box-shadow:0 6px 0 #cbd9e6; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; user-select:none;">
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
        target.style.background = "rgba(240, 255, 240, 0.5)";
        target.style.borderColor = "var(--highlight-green)";
        target.style.color = "var(--highlight-green)";
        
        setTimeout(nextRound, 1200);
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        target.style.background = "rgba(255, 245, 245, 0.5)";
        target.style.borderColor = "var(--error-red)";
        target.style.color = "var(--error-red)";
        target.classList.add('shake-animation');

        setTimeout(() => {
            target.innerText = "_";
            target.classList.remove('shake-animation');
            target.style.background = "rgba(255,255,255,0.5)";
            target.style.borderColor = "var(--primary-blue)";
            target.style.borderStyle = "dashed";
            target.style.color = "var(--primary-blue)";
        }, 1000);
    }
}

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
        draggedElement.style.pointerEvents = 'none';
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
                const correta = JOGO_CONFIG.categorias[currentCategory].itens[currentIndex].nome[0];
                checkLetter(draggedElement.dataset.val, correta);
            }
        }
        draggedElement.style.position = ''; 
        draggedElement.style.transform = '';
        draggedElement.style.pointerEvents = 'auto';
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
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
    timerInterval = setInterval(() => {
        timerSeconds++;
        const min = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const sec = (timerSeconds % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `⏳ ${min}:${sec}`;
    }, 1000);
}

const styleTag = document.createElement('style');
styleTag.innerHTML = `
    .letter-card:active { transform: scale(0.9); transition: 0.1s; }
    .pop-animation { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .shake-animation { animation: shake 0.4s; }
    @keyframes popIn { 0% { transform: scale(0.5); opacity:0; } 100% { transform: scale(1); opacity:1; } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
`;
document.head.appendChild(styleTag);
