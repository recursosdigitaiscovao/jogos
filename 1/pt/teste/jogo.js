/**
 * MOTOR DO JOGO: SOPA DE LETRAS (8x8)
 * 2 Níveis | 5 Rondas por nível | Transição Automática
 */

let currentCat = 'animais';
let gameItems = [];
let roundGlobal = 0; // 0 a 4 por nível
let currentLevel = 1; 
let score = 0;
let timer = 0;
let timerInt;
let foundWords = [];

// Estado da Seleção
let isSelecting = false;
let selectStart = null; 
let currentSelection = [];

// 1. INICIALIZAÇÃO
function initGame() {
    // Buscar itens e baralhar
    const allItems = [...JOGO_CONFIG.categorias[currentCat].itens].sort(() => 0.5 - Math.random());
    gameItems = allItems;
    
    roundGlobal = 0;
    currentLevel = 1;
    score = 0;
    timer = 0;
    
    renderDots(); // Cria as 5 bolinhas iniciais
    startTimer();
    loadRound();
}

function startTimer() {
    if(timerInt) clearInterval(timerInt);
    timerInt = setInterval(() => {
        timer++;
        const m = Math.floor(timer/60).toString().padStart(2,'0');
        const s = (timer%60).toString().padStart(2,'0');
        document.getElementById('timer').innerText = `⏳ ${m}:${s}`;
    }, 1000);
}

// 2. CARREGAR RONDA
function loadRound() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = ''; 
    foundWords = [];

    const gridSize = 8; // Fixado em 8x8 conforme pedido
    let wordsToFind = [];

    // Nível 1: 1 palavra | Nível 2: 3 palavras
    if (currentLevel === 1) {
        wordsToFind.push(gameItems[roundGlobal % gameItems.length].nome);
    } else {
        const startIdx = (roundGlobal * 3) % gameItems.length;
        for(let i=0; i<3; i++) wordsToFind.push(gameItems[(startIdx + i) % gameItems.length].nome);
    }

    // CONTENTOR PRINCIPAL (Centrado verticalmente)
    const gameWrapper = document.createElement('div');
    gameWrapper.style.cssText = `
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 100%; height: 100%; gap: 15px; padding: 10px; box-sizing: border-box;
    `;

    // PAINEL DE IMAGENS (Horizontal para poupar espaço vertical)
    const panel = document.createElement('div');
    panel.style.cssText = "display:flex; flex-wrap:wrap; gap:10px; justify-content:center; align-items:center;";
    
    wordsToFind.forEach(w => {
        const item = gameItems.find(it => it.nome === w);
        const card = document.createElement('div');
        card.id = `card-${w}`;
        card.style.cssText = "background:white; padding:8px; border-radius:15px; display:flex; flex-direction:column; align-items:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); width: clamp(80px, 15vw, 100px); border: 3px solid transparent; transition: 0.3s;";
        card.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; height:clamp(40px, 8vh, 60px); object-fit:contain;">
                          <b style="font-size: clamp(10px, 1.8vh, 13px); color:var(--text-grey); margin-top:4px;">${currentLevel === 1 ? w : '???'}</b>`;
        panel.appendChild(card);
    });

    // GRELHA (Tamanho reduzido para mobile)
    const grid = document.createElement('div');
    grid.id = 'sopa-grid';
    // cellSize: no máximo 50px, mas reduz para caber na largura (90vw) ou na altura (50vh)
    const cellSize = `min(45px, 85vw / 8, 45vh / 8)`; 
    grid.style.cssText = `
        display:grid; grid-template-columns: repeat(8, ${cellSize}); 
        gap:4px; background:white; padding:10px; border-radius:20px; 
        box-shadow:0 8px 20px rgba(0,0,0,0.1); user-select:none; touch-action:none;
        margin: 0 auto;
    `;

    const letters = generateGrid(gridSize, wordsToFind);
    letters.forEach((row, r) => {
        row.forEach((char, c) => {
            const cell = document.createElement('div');
            cell.className = 'sopa-cell';
            cell.style.cssText = `width:${cellSize}; height:${cellSize}; display:flex; align-items:center; justify-content:center; background:#f8fbff; border-radius:6px; font-weight:900; font-size:clamp(14px, 2.5vh, 22px); color:var(--text-grey); cursor:pointer;`;
            cell.innerText = char;
            cell.dataset.r = r; cell.dataset.c = c;

            cell.onmousedown = () => handleStart(r, c);
            cell.onmouseenter = () => handleMove(r, c);
            cell.ontouchstart = (e) => { e.preventDefault(); handleStart(r, c); };
            grid.appendChild(cell);
        });
    });

    // Eventos globais de soltar
    window.onmouseup = () => handleEnd(wordsToFind);
    grid.ontouchend = () => handleEnd(wordsToFind);
    grid.ontouchmove = (e) => {
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if(el && el.dataset.r) handleMove(parseInt(el.dataset.r), parseInt(el.dataset.c));
    };

    gameWrapper.appendChild(panel);
    gameWrapper.appendChild(grid);
    container.appendChild(gameWrapper);
}

// 3. SELEÇÃO
function handleStart(r, c) {
    isSelecting = true; selectStart = {r, c};
    clearSelectionStyles();
}

function handleMove(r, c) {
    if(!isSelecting) return;
    const grid = document.getElementById('sopa-grid');
    const end = {r, c};
    clearSelectionStyles();
    currentSelection = [];

    if(selectStart.r === end.r) { // Horizontal
        const min = Math.min(selectStart.c, end.c);
        const max = Math.max(selectStart.c, end.c);
        for(let i=min; i<=max; i++){
            const cell = grid.querySelector(`[data-r="${selectStart.r}"][data-c="${i}"]`);
            if(cell) { cell.style.background = "var(--primary-blue)"; cell.style.color="white"; currentSelection.push(cell); }
        }
    } else if(selectStart.c === end.c) { // Vertical
        const min = Math.min(selectStart.r, end.r);
        const max = Math.max(selectStart.r, end.r);
        for(let i=min; i<=max; i++){
            const cell = grid.querySelector(`[data-r="${i}"][data-c="${selectStart.c}"]`);
            if(cell) { cell.style.background = "var(--primary-blue)"; cell.style.color="white"; currentSelection.push(cell); }
        }
    }
}

function handleEnd(targets) {
    if(!isSelecting) return;
    isSelecting = false;

    const word = currentSelection.map(el => el.innerText).join('');
    const rev = word.split('').reverse().join('');
    const match = targets.find(t => t === word || t === rev);

    if(match && !foundWords.includes(match)) {
        foundWords.push(match);
        currentSelection.forEach(el => { el.classList.add('found'); el.style.background = "var(--highlight-green)"; el.style.color="white"; });
        document.getElementById(`card-${match}`).style.borderColor = "var(--highlight-green)";
        score += (currentLevel * 100);
        document.getElementById('score-val').innerText = score;
        playSound('acerto');

        if(foundWords.length === targets.length) {
            setTimeout(() => {
                roundGlobal++;
                if(roundGlobal >= 5) {
                    if(currentLevel === 1) { 
                        currentLevel = 2; roundGlobal = 0; loadRound(); 
                    } else { finishGame(); }
                } else { loadRound(); }
                updateDots();
            }, 800);
        }
    } else {
        playSound('erro');
        score = Math.max(0, score - 10);
        document.getElementById('score-val').innerText = score;
        clearSelectionStyles();
    }
}

function clearSelectionStyles() {
    document.querySelectorAll('.sopa-cell').forEach(el => {
        if(!el.classList.contains('found')) { el.style.background = "#f8fbff"; el.style.color = "var(--text-grey)"; }
    });
}

function generateGrid(size, words) {
    let grid = Array(size).fill().map(() => Array(size).fill(''));
    words.forEach(word => {
        let placed = false;
        while(!placed) {
            let hor = Math.random() > 0.5;
            let r = Math.floor(Math.random() * (hor ? size : size - word.length));
            let c = Math.floor(Math.random() * (hor ? size - word.length : size));
            let fits = true;
            for(let i=0; i<word.length; i++) {
                if((hor ? grid[r][c+i] : grid[r+i][c]) !== '') { fits = false; break; }
            }
            if(fits) {
                for(let i=0; i<word.length; i++) { if(hor) grid[r][c+i] = word[i]; else grid[r+i][c] = word[i]; }
                placed = true;
            }
        }
    });
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return grid.map(row => row.map(l => l === '' ? abc[Math.floor(Math.random()*26)] : l));
}

// --- BARRA DE STATUS (5 CÍRCULOS QUE RESETAM NO NÍVEL 2) ---
function renderDots() {
    const dots = document.getElementById('dots-container');
    dots.innerHTML = '';
    for(let i=0; i<5; i++) {
        const d = document.createElement('div');
        d.className = 'dot';
        dots.appendChild(d);
    }
    updateDots();
}

function updateDots() {
    const dots = document.getElementById('dots-container').querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.className = 'dot';
        if(i < roundGlobal) d.classList.add('done');
        if(i === roundGlobal) d.classList.add('active');
    });
}

function finishGame() {
    clearInterval(timerInt);
    playSound('vitoria');
    if(window.goToResult) window.goToResult();
    const finalTime = document.getElementById('timer').innerText.replace('⏳ ', '');
    const report = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + report.img;
    document.getElementById('res-tit').innerText = report.titulo;
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = finalTime;
}

function playSound(s) {
    if(JOGO_CONFIG.sons[s]) new Audio(JOGO_CONFIG.sons[s]).play().catch(()=>{});
}

// --- TUTORIAL ANIMADO NO ECRÃ 1 (SIMULANDO JOGO) ---
window.addEventListener('DOMContentLoaded', () => {
    const introBox = document.getElementById('intro-animation');
    if(introBox) {
        introBox.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(4, 25px); gap:3px; background:white; padding:8px; border-radius:12px; position:relative; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                ${Array(16).fill('<div style="width:25px; height:25px; background:#f0f7ff; border-radius:4px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:10px; color:#c0cddb;">A</div>').join('')}
                <div id="hand-tut" style="position:absolute; top:12px; left:12px; font-size:28px; color:var(--primary-blue); z-index:10; transition: 1.5s ease-in-out; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
                    <i class="fas fa-hand-pointer"></i>
                </div>
            </div>
        `;
        const hand = document.getElementById('hand-tut');
        setInterval(() => {
            hand.style.transform = "translateX(75px)";
            setTimeout(() => { hand.style.transform = "translateX(0)"; }, 2000);
        }, 4000);
    }
});
