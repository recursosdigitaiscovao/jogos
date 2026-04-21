let currentCategory = 'cat1';
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let selectedDot = null; 
let completedPairs = 0;
let totalPairs = 3;

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
        card.innerHTML = `<div style="font-size:24px; margin-bottom:5px;">↔️</div><span style="font-weight:900; font-size:11px; color:var(--primary-dark);">${cat.nome}</span>`;
        card.onclick = () => { window.selectCategory(k); closeMenus(); };
        rdList.appendChild(card);
    });
}

window.selectCategory = function(key) {
    currentCategory = key;
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
};

window.initGame = function() {
    currentIndex = 0; 
    roundInLevel = 0; 
    currentLevel = 1; 
    score = 0; 
    timerSeconds = 0;
    document.getElementById('score-val').innerText = score;
    setupDots();
    startTimer();
    renderMatchingGame();
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

function renderMatchingGame() {
    const cat = JOGO_CONFIG.categorias[currentCategory];
    const ronda = cat.rondas[currentIndex];
    if(!ronda) { finishGame(); return; }

    completedPairs = 0;
    selectedDot = null;

    // Atualizar Dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const pares = ronda.pares;
    let leftWords = pares.map(p => p.a).sort(() => Math.random() - 0.5);
    let rightWords = pares.map(p => p.b).sort(() => Math.random() - 0.5);

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div id="matching-wrapper" style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center; overflow:hidden;">
            
            <!-- Personagens de Fundo -->
            <img src="${JOGO_CONFIG.caminhoImg}menino.png" style="position:absolute; bottom:-10px; left:0; height:180px; opacity:0.6; pointer-events:none; z-index:0;">
            <img src="${JOGO_CONFIG.caminhoImg}menina.png" style="position:absolute; bottom:-10px; right:0; height:180px; opacity:0.6; pointer-events:none; z-index:0;">

            <div id="matching-container" style="position:relative; width:100%; max-width:500px; display:flex; justify-content:space-between; gap:20px; padding:20px; z-index:2;">
                <!-- SVG para as linhas mágicas -->
                <svg id="lines-svg" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;"></svg>
                
                <!-- Coluna Esquerda -->
                <div style="display:flex; flex-direction:column; gap:30px;">
                    ${leftWords.map(w => `
                        <div class="word-row left" style="display:flex; align-items:center; gap:15px;">
                            <div class="word-card">${w}</div>
                            <div class="dot-btn" data-word="${w}" data-side="L" onclick="handleDotClick(this)"></div>
                        </div>
                    `).join('')}
                </div>

                <!-- Coluna Direita -->
                <div style="display:flex; flex-direction:column; gap:30px;">
                    ${rightWords.map(w => `
                        <div class="word-row right" style="display:flex; align-items:center; gap:15px;">
                            <div class="dot-btn" data-word="${w}" data-side="R" onclick="handleDotClick(this)"></div>
                            <div class="word-card">${w}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function handleDotClick(el) {
    if (el.classList.contains('connected')) return;

    const side = el.dataset.side;
    const word = el.dataset.word;

    if (selectedDot && selectedDot.side === side) {
        selectedDot.element.classList.remove('selected');
        if (selectedDot.element === el) {
            selectedDot = null;
            return;
        }
    }

    if (!selectedDot) {
        selectedDot = { side, word, element: el };
        el.classList.add('selected');
    } else {
        checkMatch(selectedDot, { side, word, element: el });
    }
}

function checkMatch(dot1, dot2) {
    const cat = JOGO_CONFIG.categorias[currentCategory];
    const paresDaRonda = cat.rondas[currentIndex].pares;
    
    const parCorreto = paresDaRonda.find(p => 
        (p.a === dot1.word && p.b === dot2.word) || 
        (p.a === dot2.word && p.b === dot1.word)
    );

    if (parCorreto) {
        sndAcerto.play();
        score += JOGO_CONFIG.pontuacao.acerto;
        document.getElementById('score-val').innerText = score;
        
        dot1.element.classList.add('connected');
        dot2.element.classList.add('connected');
        drawFioMagico(dot1.element, dot2.element, "var(--highlight-green)");
        
        completedPairs++;
        if (completedPairs === totalPairs) {
            setTimeout(nextRound, 1200);
        }
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        
        dot1.element.classList.add('error-shake');
        dot2.element.classList.add('error-shake');
        drawFioMagico(dot1.element, dot2.element, "var(--error-red)", true);

        setTimeout(() => {
            dot1.element.classList.remove('error-shake', 'selected');
            dot2.element.classList.remove('error-shake', 'selected');
        }, 500);
    }

    dot1.element.classList.remove('selected');
    selectedDot = null;
}

function drawFioMagico(el1, el2, color, isTemporary = false) {
    const svg = document.getElementById('lines-svg');
    const containerRect = document.getElementById('matching-container').getBoundingClientRect();
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();

    const x1 = r1.left + r1.width/2 - containerRect.left;
    const y1 = r1.top + r1.height/2 - containerRect.top;
    const x2 = r2.left + r2.width/2 - containerRect.left;
    const y2 = r2.top + r2.height/2 - containerRect.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "5");
    line.setAttribute("stroke-linecap", "round");
    line.style.filter = `drop-shadow(0 0 5px ${color})`;
    
    if(isTemporary) {
        line.style.strokeDasharray = "10";
        line.style.animation = "dash 0.5s linear infinite";
    }

    svg.appendChild(line);

    if (isTemporary) {
        setTimeout(() => {
            line.style.opacity = "0";
            line.style.transition = "opacity 0.3s";
            setTimeout(() => line.remove(), 300);
        }, 600);
    }
}

function nextRound() { 
    currentIndex++; 
    roundInLevel++; 
    
    if (roundInLevel < 5) {
        renderMatchingGame(); 
    } else if (currentLevel === 1) {
        currentLevel = 2;
        roundInLevel = 0;
        setupDots(); 
        renderMatchingGame();
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
    .word-card { background: white; padding: 12px 20px; border-radius: 15px; font-weight: 900; font-size: 16px; color: var(--primary-dark); box-shadow: 0 4px 0 #cbd9e6; min-width: 110px; text-align: center; }
    .dot-btn { width: 24px; height: 24px; background: var(--primary-blue); border-radius: 50%; cursor: pointer; border: 4px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: 0.2s; }
    .dot-btn.selected { background: #f39c12; transform: scale(1.3); box-shadow: 0 0 15px #f39c12; }
    .dot-btn.connected { background: var(--highlight-green); cursor: default; transform: scale(1); box-shadow: none; border-color: #f0f7ff; }
    .error-shake { animation: shake 0.4s; background: var(--error-red) !important; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    @keyframes dash { to { stroke-dashoffset: -20; } }
`;
document.head.appendChild(styleTag);
