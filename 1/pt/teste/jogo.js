/**
 * MOTOR DO JOGO: SOPA DE LETRAS PROFISSIONAL
 * Lógica: Nível 1 (7x7 - 1 palavra) | Nível 2 (9x9 - 3 palavras)
 */

let currentCat = 'animais';
let gameItems = [];
let roundGlobal = 0;
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
    const allItems = [...JOGO_CONFIG.categorias[currentCat].itens].sort(() => 0.5 - Math.random());
    gameItems = allItems;
    roundGlobal = 0;
    currentLevel = 1;
    score = 0;
    timer = 0;
    
    startTimer();
    loadRound();
    updateDots();
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

    let gridSize = (currentLevel === 1) ? 7 : 9;
    let wordsToFind = [];

    // Selecionar palavras
    if (currentLevel === 1) {
        wordsToFind.push(gameItems[roundGlobal % gameItems.length].nome);
    } else {
        const startIdx = (roundGlobal * 3) % gameItems.length;
        for(let i=0; i<3; i++) wordsToFind.push(gameItems[(startIdx + i) % gameItems.length].nome);
    }

    // Criar Contentor de Jogo
    const gameWrapper = document.createElement('div');
    gameWrapper.className = 'sopa-layout';
    gameWrapper.style.cssText = "display:flex; gap:20px; align-items:center; justify-content:center; width:100%; height:100%;";

    // Painel de Imagens
    const panel = document.createElement('div');
    panel.style.cssText = "display:flex; flex-direction:column; gap:10px; flex-shrink:0;";
    
    wordsToFind.forEach(w => {
        const item = gameItems.find(it => it.nome === w);
        const card = document.createElement('div');
        card.id = `card-${w}`;
        card.style.cssText = "background:white; padding:10px; border-radius:15px; display:flex; flex-direction:column; align-items:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); width: 110px; border: 3px solid transparent;";
        card.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:60px; height:60px; object-fit:contain;">
                          <b style="font-size:14px; color:var(--text-grey); margin-top:5px;">${currentLevel === 1 ? w : '???'}</b>`;
        panel.appendChild(card);
    });

    // Grelha
    const grid = document.createElement('div');
    grid.id = 'sopa-grid';
    // Cálculo do tamanho da célula para caber no monitor
    const cellSize = `clamp(35px, 60vh / ${gridSize}, 55px)`;
    grid.style.cssText = `display:grid; grid-template-columns: repeat(${gridSize}, ${cellSize}); gap:5px; background:white; padding:10px; border-radius:20px; box-shadow:0 8px 20px rgba(0,0,0,0.1); user-select:none; touch-action:none;`;

    const letters = generateGrid(gridSize, wordsToFind);
    
    letters.forEach((row, r) => {
        row.forEach((char, c) => {
            const cell = document.createElement('div');
            cell.className = 'sopa-cell';
            cell.style.cssText = `width:${cellSize}; height:${cellSize}; display:flex; align-items:center; justify-content:center; background:#f8fbff; border-radius:8px; font-weight:900; font-size:22px; color:var(--text-grey); cursor:pointer;`;
            cell.innerText = char;
            cell.dataset.r = r;
            cell.dataset.c = c;

            // Eventos Mouse
            cell.onmousedown = () => handleStart(r, c);
            cell.onmouseenter = () => handleMove(r, c);
            // Eventos Touch
            cell.ontouchstart = (e) => { e.preventDefault(); handleStart(r, c); };

            grid.appendChild(cell);
        });
    });

    // Eventos de Soltar (Global)
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
    isSelecting = true;
    selectStart = {r, c};
    clearSelection();
}

function handleMove(r, c) {
    if(!isSelecting) return;
    const grid = document.getElementById('sopa-grid');
    const end = {r, c};
    
    clearSelection();
    currentSelection = [];

    // Apenas Horizontal ou Vertical
    if(selectStart.r === end.r) { // Horizontal
        const min = Math.min(selectStart.c, end.c);
        const max = Math.max(selectStart.c, end.c);
        for(let i=min; i<=max; i++){
            const cell = grid.querySelector(`[data-r="${selectStart.r}"][data-c="${i}"]`);
            if(cell) highlight(cell);
        }
    } else if(selectStart.c === end.c) { // Vertical
        const min = Math.min(selectStart.r, end.r);
        const max = Math.max(selectStart.r, end.r);
        for(let i=min; i<=max; i++){
            const cell = grid.querySelector(`[data-r="${i}"][data-c="${selectStart.c}"]`);
            if(cell) highlight(cell);
        }
    }
}

function highlight(cell) {
    cell.style.background = "var(--primary-blue)";
    cell.style.color = "white";
    currentSelection.push(cell);
}

function clearSelection() {
    document.querySelectorAll('.sopa-cell').forEach(el => {
        if(!el.classList.contains('found')) {
            el.style.background = "#f8fbff";
            el.style.color = "var(--text-grey)";
        }
    });
}

function handleEnd(targets) {
    if(!isSelecting) return;
    isSelecting = false;

    const word = currentSelection.map(el => el.innerText).join('');
    const rev = word.split('').reverse().join('');
    const match = targets.find(t => t === word || t === rev);

    if(match && !foundWords.includes(match)) {
        foundWords.push(match);
        currentSelection.forEach(el => {
            el.classList.add('found');
            el.style.background = "var(--highlight-green)";
        });
        document.getElementById(`card-${match}`).style.borderColor = "var(--highlight-green)";
        score += (currentLevel * 100);
        document.getElementById('score-val').innerText = score;
        playSound('acerto');

        if(foundWords.length === targets.length) {
            setTimeout(() => {
                roundGlobal++;
                if(roundGlobal >= 5) {
                    if(currentLevel === 1) { 
                        currentLevel = 2; roundGlobal = 0; 
                        alert("Nível 2: Agora encontras 3 palavras!");
                        loadRound(); 
                    } else { finishGame(); }
                } else { loadRound(); }
                updateDots();
            }, 800);
        }
    } else {
        playSound('erro');
        score = Math.max(0, score - 10);
        document.getElementById('score-val').innerText = score;
        clearSelection();
    }
}

// 4. AUXILIARES
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
                for(let i=0; i<word.length; i++) {
                    if(hor) grid[r][c+i] = word[i]; else grid[r+i][c] = word[i];
                }
                placed = true;
            }
        }
    });
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return grid.map(row => row.map(l => l === '' ? abc[Math.floor(Math.random()*26)] : l));
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
    // Chamar a função de transição do index
    if(window.goToResult) window.goToResult();
    
    const finalTime = document.getElementById('timer').innerText.replace('⏳ ', '');
    const report = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[3];
    
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + report.img;
    document.getElementById('res-tit').innerText = report.titulo;
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = finalTime;
}

function playSound(s) {
    if(JOGO_CONFIG.sons[s]) new Audio(JOGO_CONFIG.sons[s]).play().catch(()=>{});
}

// Chamar pelo menu RD
window.selectCategory = function(cat) {
    currentCat = cat;
    location.reload();
};
