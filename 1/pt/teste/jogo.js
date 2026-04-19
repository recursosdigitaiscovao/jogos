/**
 * MOTOR DO JOGO: SOPA DE LETRAS (8x8)
 * 2 Níveis | 5 Rondas por nível | 10 Rondas Totais
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
    // Buscar itens da categoria e baralhar
    const allItems = [...JOGO_CONFIG.categorias[currentCat].itens].sort(() => 0.5 - Math.random());
    gameItems = allItems;
    
    roundGlobal = 0;
    currentLevel = 1;
    score = 0;
    timer = 0;
    
    document.getElementById('score-val').innerText = "0";
    renderDots(); 
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

    const gridSize = 8;
    let wordsToFind = [];

    // Nível 1: 1 palavra | Nível 2: 3 palavras
    if (currentLevel === 1) {
        wordsToFind.push(gameItems[roundGlobal % gameItems.length].nome);
    } else {
        const startIdx = (roundGlobal * 2) % gameItems.length;
        for(let i=0; i<2; i++) {
            wordsToFind.push(gameItems[(startIdx + i) % gameItems.length].nome);
        }
    }

    // Estrutura de Centramento Vertical Máximo
    const gameWrapper = document.createElement('div');
    gameWrapper.style.cssText = `
        display: flex; flex-direction: column; align-items: center; justify-content: space-evenly;
        width: 100%; height: 100%; max-height: 100%; padding: 5px; box-sizing: border-box;
    `;

    // Painel de Pistas (Imagens)
    const panel = document.createElement('div');
    panel.style.cssText = "display:flex; flex-wrap:wrap; gap:10px; justify-content:center; align-items:center; width:100%;";
    
    wordsToFind.forEach(w => {
        const item = gameItems.find(it => it.nome === w);
        const card = document.createElement('div');
        card.id = `card-${w}`;
        card.style.cssText = "background:white; padding:6px; border-radius:15px; display:flex; flex-direction:column; align-items:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); width: clamp(75px, 18vw, 110px); border: 3px solid transparent; transition: 0.3s;";
        card.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; height:clamp(40px, 9vh, 70px); object-fit:contain;">
                          <b style="font-size: clamp(10px, 1.8vh, 14px); color:var(--text-grey); margin-top:4px;">${currentLevel === 1 ? w : '???'}</b>`;
        panel.appendChild(card);
    });

    // Grelha (Ocupa o máximo sem sair das bordas)
    const grid = document.createElement('div');
    grid.id = 'sopa-grid';
    const cellSize = `min(50px, 85vw / 8, 52vh / 8)`; 
    grid.style.cssText = `
        display:grid; grid-template-columns: repeat(8, ${cellSize}); 
        grid-template-rows: repeat(8, ${cellSize});
        gap:4px; background:white; padding:8px; border-radius:20px; 
        box-shadow:0 8px 25px rgba(0,0,0,0.1); user-select:none; touch-action:none;
        aspect-ratio: 1 / 1;
    `;

    const letters = generateGrid(gridSize, wordsToFind);
    letters.forEach((row, r) => {
        row.forEach((char, c) => {
            const cell = document.createElement('div');
            cell.className = 'sopa-cell';
            cell.style.cssText = `width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f8fbff; border-radius:6px; font-weight:900; font-size:clamp(14px, 2.5vh, 24px); color:var(--text-grey); cursor:pointer;`;
            cell.innerText = char;
            cell.dataset.r = r; cell.dataset.c = c;
            
            cell.onmousedown = () => handleStart(r, c);
            cell.onmouseenter = () => handleMove(r, c);
            cell.ontouchstart = (e) => { e.preventDefault(); handleStart(r, c); };
            grid.appendChild(cell);
        });
    });

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

// 3. LÓGICA DE SELEÇÃO
function handleStart(r, c) { isSelecting = true; selectStart = {r, c}; clearSelectionStyles(); }
function handleMove(r, c) {
    if(!isSelecting) return;
    const grid = document.getElementById('sopa-grid');
    const end = {r, c};
    clearSelectionStyles();
    currentSelection = [];
    if(selectStart.r === end.r) {
        const min = Math.min(selectStart.c, end.c); const max = Math.max(selectStart.c, end.c);
        for(let i=min; i<=max; i++){
            const cell = grid.querySelector(`[data-r="${selectStart.r}"][data-c="${i}"]`);
            if(cell) { cell.style.background = "var(--primary-blue)"; cell.style.color="white"; currentSelection.push(cell); }
        }
    } else if(selectStart.c === end.c) {
        const min = Math.min(selectStart.r, end.r); const max = Math.max(selectStart.r, end.r);
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
                        currentLevel = 2; roundGlobal = 0; renderDots(); loadRound(); 
                    } else { 
                        finishGame(); // Termina as 10 rondas e vai para ecrã 3
                    }
                } else { 
                    loadRound(); 
                    updateDots();
                }
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
            for(let i=0; i<word.length; i++) { if((hor ? grid[r][c+i] : grid[r+i][c]) !== '') { fits = false; break; } }
            if(fits) { for(let i=0; i<word.length; i++) { if(hor) grid[r][c+i] = word[i]; else grid[r+i][c] = word[i]; } placed = true; }
        }
    });
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return grid.map(row => row.map(l => l === '' ? abc[Math.floor(Math.random()*26)] : l));
}

// 4. STATUS BAR E RESULTADOS
function renderDots() {
    const dots = document.getElementById('dots-container');
    dots.innerHTML = '';
    for(let i=0; i<5; i++) { const d = document.createElement('div'); d.className = 'dot'; dots.appendChild(d); }
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
    
    // Função do index.html para mudar de ecrã
    if(window.goToResult) window.goToResult(); 
    
    const finalTime = document.getElementById('timer').innerText.replace('⏳ ', '');
    const report = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + report.img;
    document.getElementById('res-tit').innerText = report.titulo;
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = finalTime;
}

function playSound(s) { if(JOGO_CONFIG.sons[s]) new Audio(JOGO_CONFIG.sons[s]).play().catch(()=>{}); }

// 5. ANIMAÇÃO DINÂMICA (ECRÃ 1)
function updateIntroAnimation() {
    const introBox = document.getElementById('intro-animation');
    if(!introBox) return;

    // Pega o primeiro item da categoria atual para o tutorial
    const item = JOGO_CONFIG.categorias[currentCat].itens[0];
    const word = item.nome;
    
    introBox.style.cssText = "display:flex; flex-direction:column; align-items:center; gap:10px; min-height:150px;";

    introBox.innerHTML = `
        <div style="background:white; padding:10px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.1); width:90px; text-align:center;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:60px; height:60px; object-fit:contain;">
            <div style="font-size:12px; font-weight:900; color:var(--primary-blue);">${word}</div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(${word.length}, 32px); gap:4px; background:white; padding:10px; border-radius:12px; position:relative; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
            ${word.split('').map(l => `<div class="tut-cell" style="width:32px; height:32px; background:#f0f7ff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px; color:var(--text-grey); transition:0.3s;">${l}</div>`).join('')}
            <div id="hand-tut" style="position:absolute; top:25px; left:12px; font-size:32px; color:var(--primary-blue); z-index:10; transition: 2s ease-in-out; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.3));">
                <i class="fas fa-hand-pointer"></i>
            </div>
        </div>
    `;

    const hand = document.getElementById('hand-tut');
    const cells = document.querySelectorAll('.tut-cell');
    
    setInterval(() => {
        // Mão move-se
        hand.style.transform = `translateX(${(word.length - 1) * 36}px)`;
        // Células acendem-se enquanto a mão passa
        cells.forEach((c, idx) => {
            setTimeout(() => {
                c.style.background = "var(--primary-blue)";
                c.style.color = "white";
            }, idx * 300);
        });
        
        setTimeout(() => {
            hand.style.transform = "translateX(0)";
            cells.forEach(c => {
                c.style.background = "#f0f7ff";
                c.style.color = "var(--text-grey)";
            });
        }, 2500);
    }, 4500);
}

// Iniciar animação e categoria
window.selectCategory = function(cat) { 
    currentCat = cat; 
    initUI(); // Atualiza textos do index
    updateIntroAnimation(); // Atualiza tutorial
};
window.addEventListener('DOMContentLoaded', () => {
    updateIntroAnimation();
});
