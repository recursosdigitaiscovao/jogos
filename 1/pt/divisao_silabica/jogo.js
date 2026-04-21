let currentCategory = 'animais';
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let shuffledItems = [];
let activeCuts = []; 

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

function startLogic() {
    reconstruirMenuCategorias();
    // Seleciona a primeira categoria mas não inicia o jogo logo (espera pelo clique em JOGAR)
    const primeiraCat = Object.keys(JOGO_CONFIG.categorias)[0];
    currentCategory = primeiraCat;
    renderTutorial();
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
        
        card.onclick = () => { 
            window.selectCategory(k); 
            closeMenus(); 
        };
        rdList.appendChild(card);
    });
}

// FUNÇÃO CRUCIAL: Agora deteta em que ecrã estás
window.selectCategory = function(key) {
    currentCategory = key;
    renderTutorial();
    
    const isResultScreen = document.getElementById('scr-result').classList.contains('active');
    const isIntroScreen = document.getElementById('scr-intro').classList.contains('active');

    if (isResultScreen || isIntroScreen) {
        // Se estiver nos resultados ou intro, muda para o jogo e inicia
        if(window.goToGame) window.goToGame(); 
    } else {
        // Se já estiver no jogo, apenas reinicia com a nova categoria
        window.initGame();
    }
};

function renderTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `
        <div style="position:relative; width:240px; height:120px; margin:0 auto; background:white; border-radius:20px; border:3px dashed var(--primary-blue); display:flex; align-items:center; justify-content:center; flex-direction:column;">
            <div style="font-size:30px; font-weight:900; color:var(--text-grey); letter-spacing:8px;">GA<span style="color:var(--primary-blue)">|</span>TO</div>
            <i class="fas fa-hand-pointer" style="font-size:35px; color:#f39c12; margin-top:10px; animation: tutoTap 1.5s infinite;"></i>
        </div>
        <style> @keyframes tutoTap { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.8); opacity:0.7; } } </style>
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
    activeCuts = [];

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => { d.classList.remove('active', 'done'); if(i < roundInLevel) d.classList.add('done'); if(i === roundInLevel) d.classList.add('active'); });

    const container = document.getElementById('game-main-content');
    let wordHTML = `<div id="word-cutter-container" style="display:flex; align-items:center; justify-content:center; background:white; padding:20px; border-radius:25px; box-shadow:0 10px 20px rgba(0,0,0,0.05); border: 4px solid transparent; transition: 0.3s;">`;
    
    const letters = item.nome.split('');
    letters.forEach((char, index) => {
        wordHTML += `<div style="font-size:clamp(35px, 9vw, 60px); font-weight:900; color:var(--text-grey);">${char}</div>`;
        if(index < letters.length - 1) {
            wordHTML += `
                <div class="cut-zone" data-index="${index + 1}" onclick="toggleCut(this)"
                     style="width:20px; height:60px; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative;">
                    <div class="cut-line" style="width:4px; height:40px; background:#e0e8f0; border-radius:2px; transition:0.2s;"></div>
                </div>`;
        }
    });
    wordHTML += `</div>`;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px;">
            <div class="pop-animation" id="item-img-box" style="background: white; padding: 15px; border-radius: 35px; box-shadow: 0 15px 35px rgba(176,196,217,0.4); width: clamp(130px, 38vw, 180px); height: clamp(130px, 38vw, 180px); display: flex; align-items: center; justify-content: center; border: 5px solid #f0f7ff; transition: transform 0.4s;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
            </div>
            ${wordHTML}
            <button class="btn-jogar-stretch" onclick="validateCuts()" style="max-width:200px; padding: 12px;">PRONTO!</button>
        </div>
    `;
}

window.toggleCut = function(el) {
    const idx = parseInt(el.dataset.index);
    const line = el.querySelector('.cut-line');
    if(activeCuts.includes(idx)) {
        activeCuts = activeCuts.filter(i => i !== idx);
        line.style.background = "#e0e8f0";
        line.style.height = "40px";
    } else {
        activeCuts.push(idx);
        line.style.background = "var(--primary-blue)";
        line.style.height = "60px";
    }
};

function validateCuts() {
    const item = shuffledItems[currentIndex];
    let correctCuts = [];
    let currentPos = 0;
    for(let i=0; i < item.silabas.length - 1; i++) {
        currentPos += item.silabas[i].length;
        correctCuts.push(currentPos);
    }

    const isCorrect = activeCuts.length === correctCuts.length && 
                      activeCuts.every(val => correctCuts.includes(val));

    const container = document.getElementById('word-cutter-container');

    if(isCorrect) {
        sndAcerto.play();
        score += JOGO_CONFIG.pontuacao.acerto;
        document.getElementById('score-val').innerText = score;
        container.style.borderColor = "var(--highlight-green)";
        container.style.background = "#f0fff0";
        document.querySelectorAll('.cut-line').forEach(l => {
            if(l.style.background.includes('rgb')) l.style.background = "var(--highlight-green)";
        });
        document.getElementById('item-img-box').style.transform = "scale(1.1)";
        setTimeout(nextRound, 1200);
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        container.classList.add('shake-animation');
        setTimeout(() => { container.classList.remove('shake-animation'); }, 500);
    }
}

function nextRound() { 
    currentIndex++; roundInLevel++; 
    if (roundInLevel < 5 && currentIndex < shuffledItems.length) {
        renderRound(); 
    } else if (currentLevel === 1) {
        currentLevel = 2; roundInLevel = 0; setupDots(); renderRound();
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
    .pop-animation { animation: popIn 0.5s; }
    .shake-animation { animation: shake 0.4s; }
    @keyframes popIn { 0% { transform: scale(0.5); opacity:0; } 100% { transform: scale(1); opacity:1; } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
`;
document.head.appendChild(styleTag);
