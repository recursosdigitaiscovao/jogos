/**
 * MOTOR DO JOGO: SOPA DE LETRAS 
 * Layout Adaptável | Tutorial Dinâmico | Transição Final Corrigida
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
    document.getElementById('score-val').innerText = "0";
    
    // Forçar limpeza do ícone estático do ecrã de intro
    const staticIcon = document.getElementById('intro-icon');
    if(staticIcon) staticIcon.style.display = 'none';

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

// 2. CARREGAR RONDA (Padding 15px)
function loadRound() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = ''; 
    foundWords = [];

    const isMobile = window.innerWidth < 650;
    const cols = isMobile ? 7 : 8;
    const rows = isMobile ? 8 : 7;
    
    let wordsToFind = [];
    if (currentLevel === 1) {
        wordsToFind.push(gameItems[roundGlobal % gameItems.length].nome);
    } else {
        const startIdx = (roundGlobal * 3) % gameItems.length;
        for(let i=0; i<3; i++) wordsToFind.push(gameItems[(startIdx + i) % gameItems.length].nome);
    }

    const gameWrapper = document.createElement('div');
    gameWrapper.style.cssText = `
        display: flex; flex-direction: ${isMobile ? 'column' : 'row'}; 
        align-items: center; justify-content: center; width: 100%; height: 100%; gap: 15px;
        box-sizing: border-box; padding: 15px;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `display: flex; flex-direction: ${isMobile ? 'row' : 'column'}; flex-wrap: wrap; gap: 8px; justify-content: center;`;
    
    wordsToFind.forEach(w => {
        const item = gameItems.find(it => it.nome === w);
        const card = document.createElement('div');
        card.id = `card-${w}`;
        card.style.cssText = "background:white; padding:6px; border-radius:15px; display:flex; flex-direction:column; align-items:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); width: clamp(75px, 16vw, 110px); border: 3px solid transparent;";
        card.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; height:clamp(45px, 10vh, 70px); object-fit:contain;">
                          <b style="font-size: clamp(10px, 1.8vh, 14px); color:var(--text-grey); margin-top:3px;">${currentLevel === 1 ? w : '???'}</b>`;
        panel.appendChild(card);
    });

    const grid = document.createElement('div');
    grid.id = 'sopa-grid';
    const cellW = `calc((100vw - ${isMobile ? '50px' : '250px'}) / ${cols})`;
    const cellH = `calc((100vh - 260px) / ${rows})`;
    const cellSize = `min(50px, ${cellW}, ${cellH})`;

    grid.style.cssText = `
        display:grid; grid-template-columns: repeat(${cols}, ${cellSize}); 
        grid-template-rows: repeat(${rows}, ${cellSize}); gap:4px; background:white; 
        padding:10px; border-radius:20px; box-shadow:0 8px 25px rgba(0,0,0,0.1); 
        user-select:none; touch-action:none;
    `;

    const letters = generateGrid(rows, cols, wordsToFind);
    letters.forEach((row, r) => {
        row.forEach((char, c) => {
            const cell = document.createElement('div');
            cell.className = 'sopa-cell';
            cell.style.cssText = `width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f8fbff; border-radius:6px; font-weight:900; font-size:clamp(14px, 2.8vh, 24px); color:var(--text-grey); cursor:pointer;`;
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
                if (roundGlobal < 4) {
                    roundGlobal++;
                    loadRound();
                    updateDots();
                } else {
                    if (currentLevel === 1) {
                        currentLevel = 2; roundGlobal = 0; renderDots(); loadRound();
                    } else {
                        finishGame(); // AQUI: Ativa o Ecrã 3 após 5 rondas do Nível 2
                    }
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

function generateGrid(rows, cols, words) {
    let grid = Array(rows).fill().map(() => Array(cols).fill(''));
    words.forEach(word => {
        let placed = false;
        while(!placed) {
            let hor = Math.random() > 0.5;
            let r = Math.floor(Math.random() * (hor ? rows : rows - word.length));
            let c = Math.floor(Math.random() * (hor ? cols : cols - word.length));
            let fits = true;
            for(let i=0; i<word.length; i++) {
                let checkR = hor ? r : r + i; let checkC = hor ? c + i : c;
                if(grid[checkR][checkC] !== '') { fits = false; break; }
            }
            if(fits) {
                for(let i=0; i<word.length; i++) {
                    let fillR = hor ? r : r + i; let fillC = hor ? c + i : c;
                    grid[fillR][fillC] = word[i];
                }
                placed = true;
            }
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
    
    // Mudar para ecrã de resultados (Ecrã 3)
    if(window.goToResult) window.goToResult(); 
    
    const finalTime = document.getElementById('timer').innerText.replace('⏳ ', '');
    const report = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + report.img;
    document.getElementById('res-tit').innerText = report.titulo;
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = finalTime;
}

function playSound(s) { if(JOGO_CONFIG.sons[s]) new Audio(JOGO_CONFIG.sons[s]).play().catch(()=>{}); }

// 5. ANIMAÇÃO DINÂMICA (IMAGEM + GRELHA + SUBILNHAR)
function updateIntroAnimation() {
    const introBox = document.getElementById('intro-animation');
    if(!introBox) return;

    // ESCONDER O ÍCONE DO DADOS.JS NO INDEX
    const staticIcon = document.getElementById('intro-icon');
    if(staticIcon) staticIcon.style.display = 'none';

    const cat = JOGO_CONFIG.categorias[currentCat] || JOGO_CONFIG.categorias.animais;
    const item = cat.itens[0];
    const word = item.nome;
    
    introBox.style.cssText = "display:flex; flex-direction:column; align-items:center; gap:15px; border:none; background:transparent;";
    introBox.innerHTML = `
        <div style="background:white; padding:15px; border-radius:20px; box-shadow:0 4px 15px rgba(0,0,0,0.1); text-align:center;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:80px; height:80px; object-fit:contain;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:16px; margin-top:5px;">${word}</div>
        </div>
        <div id="tut-grid-box" style="display:grid; grid-template-columns: repeat(${word.length}, 38px); gap:5px; background:white; padding:10px; border-radius:15px; position:relative; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
            ${word.split('').map(l => `<div class="tut-cell" style="width:38px; height:38px; background:#f0f7ff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:20px; color:var(--text-grey); transition:0.3s;">${l}</div>`).join('')}
            <div id="hand-tut" style="position:absolute; top:28px; left:18px; font-size:38px; color:var(--primary-blue); z-index:10; transition: 2s ease-in-out; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.3));">
                <i class="fas fa-hand-pointer"></i>
            </div>
        </div>
    `;

    const hand = document.getElementById('hand-tut');
    const cells = document.querySelectorAll('.tut-cell');
    
    const runTutorial = () => {
        if(!hand) return;
        hand.style.transform = `translateX(0)`;
        cells.forEach(c => { c.style.background = "#f0f7ff"; c.style.color = "var(--text-grey)"; });
        
        setTimeout(() => {
            hand.style.transform = `translateX(${(word.length - 1) * 43}px)`;
            cells.forEach((c, idx) => setTimeout(() => {
                c.style.background = "var(--primary-blue)";
                c.style.color = "white";
            }, idx * 250));
        }, 800);
    };

    runTutorial();
    setInterval(runTutorial, 4500);
}

// Eventos de Sistema
window.selectCategory = function(cat) { 
    currentCat = cat; 
    initUI(); // Atualiza textos do index
    updateIntroAnimation(); // Atualiza animação
};

window.addEventListener('DOMContentLoaded', () => { 
    initUI();
    // Pequeno delay para garantir que o ícone do index já foi carregado para o podermos esconder
    setTimeout(updateIntroAnimation, 100); 
});
