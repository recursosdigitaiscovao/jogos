let currentCategory = 'cat1';
let score = 0;
let timerSeconds = 0;
let timerInterval;
let selectedDot = null; // { side: 'L'/'R', word: string, element: HTMLElement }
let completedPairs = 0;
let totalPairs = 0;

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
    score = 0; 
    timerSeconds = 0;
    completedPairs = 0;
    document.getElementById('score-val').innerText = score;
    startTimer();
    renderMatchingGame();
};

function renderMatchingGame() {
    const cat = JOGO_CONFIG.categorias[currentCategory];
    const pares = cat.pares;
    totalPairs = pares.length;

    // Criar listas baralhadas
    let leftWords = pares.map(p => p.a).sort(() => Math.random() - 0.5);
    let rightWords = pares.map(p => p.b).sort(() => Math.random() - 0.5);

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div id="matching-container" style="position:relative; width:100%; max-width:500px; display:flex; justify-content:space-between; gap:40px; padding:20px; user-select:none;">
            <!-- SVG para as linhas -->
            <svg id="lines-svg" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;"></svg>
            
            <!-- Coluna Esquerda -->
            <div style="display:flex; flex-direction:column; gap:20px; z-index:2;">
                ${leftWords.map(w => `
                    <div class="word-row left" data-word="${w}" style="display:flex; align-items:center; gap:10px;">
                        <div class="word-card">${w}</div>
                        <div class="dot-btn" onclick="handleDotClick('L', '${w}', this)"></div>
                    </div>
                `).join('')}
            </div>

            <!-- Coluna Direita -->
            <div style="display:flex; flex-direction:column; gap:20px; z-index:2;">
                ${rightWords.map(w => `
                    <div class="word-row right" data-word="${w}" style="display:flex; align-items:center; gap:10px;">
                        <div class="dot-btn" onclick="handleDotClick('R', '${w}', this)"></div>
                        <div class="word-card">${w}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function handleDotClick(side, word, el) {
    if (el.classList.contains('connected')) return;

    // Se já havia algo selecionado e clicamos no mesmo lado, apenas trocamos a seleção
    if (selectedDot && selectedDot.side === side) {
        selectedDot.element.classList.remove('selected');
        selectedDot = { side, word, element: el };
        el.classList.add('selected');
        return;
    }

    // Se não há nada selecionado
    if (!selectedDot) {
        selectedDot = { side, word, element: el };
        el.classList.add('selected');
    } else {
        // Tentar ligar
        checkMatch(selectedDot, { side, word, element: el });
    }
}

function checkMatch(dot1, dot2) {
    const cat = JOGO_CONFIG.categorias[currentCategory];
    const parCorreto = cat.pares.find(p => 
        (p.a === dot1.word && p.b === dot2.word) || 
        (p.a === dot2.word && p.b === dot1.word)
    );

    if (parCorreto) {
        // ACERTO
        sndAcerto.play();
        score += JOGO_CONFIG.pontuacao.acerto;
        document.getElementById('score-val').innerText = score;
        
        dot1.element.classList.add('connected');
        dot2.element.classList.add('connected');
        drawPermanentLine(dot1.element, dot2.element, "var(--highlight-green)");
        
        completedPairs++;
        if (completedPairs === totalPairs) setTimeout(finishGame, 1000);
    } else {
        // ERRO
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        
        dot1.element.classList.add('error-shake');
        dot2.element.classList.add('error-shake');
        drawPermanentLine(dot1.element, dot2.element, "var(--error-red)", true);

        setTimeout(() => {
            dot1.element.classList.remove('error-shake');
            dot2.element.classList.remove('error-shake');
        }, 500);
    }

    dot1.element.classList.remove('selected');
    selectedDot = null;
}

function drawPermanentLine(el1, el2, color, temporary = false) {
    const svg = document.getElementById('lines-svg');
    const containerRect = document.getElementById('matching-container').getBoundingClientRect();
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();

    const x1 = r1.left + r1.width / 2 - containerRect.left;
    const y1 = r1.top + r1.height / 2 - containerRect.top;
    const x2 = r2.left + r2.width / 2 - containerRect.left;
    const y2 = r2.top + r2.height / 2 - containerRect.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "4");
    line.setAttribute("stroke-linecap", "round");
    line.style.transition = "opacity 0.5s";
    
    if (color.includes("green")) {
        line.style.filter = "drop-shadow(0 0 5px var(--highlight-green))";
    }

    svg.appendChild(line);

    if (temporary) {
        setTimeout(() => {
            line.style.opacity = "0";
            setTimeout(() => line.remove(), 500);
        }, 800);
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

// Estilos dinâmicos do jogo
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    .word-card { 
        background: white; 
        padding: 10px 15px; 
        border-radius: 12px; 
        font-weight: 900; 
        font-size: 14px; 
        color: var(--text-grey); 
        box-shadow: 0 4px 0 rgba(0,0,0,0.05); 
        min-width: 100px; 
        text-align: center;
        border: 2px solid transparent;
    }
    .dot-btn { 
        width: 20px; 
        height: 20px; 
        background: var(--primary-blue); 
        border-radius: 50%; 
        cursor: pointer; 
        border: 4px solid white; 
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: transform 0.2s, background 0.2s;
    }
    .dot-btn.selected { 
        background: #f39c12; 
        transform: scale(1.3); 
        box-shadow: 0 0 10px #f39c12;
    }
    .dot-btn.connected { 
        background: var(--highlight-green); 
        cursor: default; 
        transform: scale(1);
    }
    .error-shake { animation: shake 0.4s; background: var(--error-red) !important; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
`;
document.head.appendChild(styleTag);
