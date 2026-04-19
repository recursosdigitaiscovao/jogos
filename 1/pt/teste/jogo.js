/**
 * MOTOR DO JOGO: SOPA DE LETRAS - PEQUENOS LEITORES
 * Lógica: 2 Níveis (5 rondas cada)
 * Nível 1: 1 Palavra (Grelha 7x7)
 * Nível 2: 3 Palavras (Grelha 9x9)
 */

let currentCat = 'animais';
let gameItems = [];
let roundGlobal = 0;
let level = 1; // 1 ou 2
let score = 0;
let timer = 0;
let timerInt;

// Estado da Seleção
let isSelecting = false;
let selectStart = null; // {r, c}
let selectEnd = null;
let currentSelection = []; // Elementos DOM selecionados

function initGame() {
    // Esta função é chamada pelo botão JOGAR do index.html
    setupGame();
}

function setupGame() {
    // Baralhar itens da categoria
    const allItems = [...JOGO_CONFIG.categorias[currentCat].itens].sort(() => 0.5 - Math.random());
    gameItems = allItems;
    
    roundGlobal = 0;
    level = 1;
    score = 0;
    timer = 0;
    
    updateDots();
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

function loadRound() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = ''; // Limpar ecrã de jogo

    const wordsToFind = [];
    let gridSize = (level === 1) ? 7 : 9;

    // Selecionar palavras para esta ronda
    if (level === 1) {
        wordsToFind.push(gameItems[roundGlobal % gameItems.length].nome);
    } else {
        // Nível 2: 3 palavras (usa o roundGlobal para saltar de 3 em 3)
        const startIdx = (roundGlobal * 3) % gameItems.length;
        for(let i=0; i<3; i++) {
            wordsToFind.push(gameItems[(startIdx + i) % gameItems.length].nome);
        }
    }

    // Gerar Layout da Sopa
    const sopaLayout = document.createElement('div');
    sopaLayout.className = 'sopa-layout';
    
    // 1. Painel de Imagens (Pistas)
    const wordPanel = document.createElement('div');
    wordPanel.id = 'word-panel';
    wordPanel.className = 'word-panel'; // Estilo já no CSS do index
    wordPanel.style.cssText = "display:flex; flex-direction:column; gap:10px; min-width:120px;";

    wordsToFind.forEach(w => {
        const itemData = gameItems.find(it => it.nome === w);
        const card = document.createElement('div');
        card.className = 'word-card';
        card.id = `card-${w}`;
        card.style.cssText = "background:white; padding:10px; border-radius:15px; display:flex; flex-direction:column; align-items:center; border:3px solid transparent;";
        card.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${itemData.img}" style="width:50px; height:50px; object-fit:contain;">
                          <span style="font-weight:900; font-size:12px; margin-top:5px;">${level === 1 ? w : '???'}</span>`;
        wordPanel.appendChild(card);
    });

    // 2. Grelha
    const gridDiv = document.createElement('div');
    gridDiv.id = 'sopa-grid';
    gridDiv.className = 'sopa-grid';
    gridDiv.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const gridData = generateGridData(gridSize, wordsToFind);
    
    // Renderizar Grelha
    gridData.forEach((row, r) => {
        row.forEach((char, c) => {
            const cell = document.createElement('div');
            cell.className = 'sopa-cell';
            cell.innerText = char;
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            // Eventos Mouse
            cell.onmousedown = (e) => startSelection(r, c);
            cell.onmouseenter = (e) => updateSelection(r, c);
            // Eventos Touch
            cell.ontouchstart = (e) => { e.preventDefault(); startSelection(r, c); };
            
            gridDiv.appendChild(cell);
        });
    });

    // Evento Global de Soltar
    window.onmouseup = () => endSelection(wordsToFind);
    gridDiv.ontouchend = () => endSelection(wordsToFind);
    gridDiv.ontouchmove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if(el && el.classList.contains('sopa-cell')) {
            updateSelection(parseInt(el.dataset.r), parseInt(el.dataset.c));
        }
    };

    sopaLayout.appendChild(gridDiv);
    sopaLayout.appendChild(wordPanel);
    container.appendChild(sopaLayout);
    
    updateDots();
}

// --- LÓGICA DA GRELHA ---

function generateGridData(size, words) {
    let grid = Array(size).fill().map(() => Array(size).fill(''));
    
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const dir = Math.random() > 0.5 ? 'H' : 'V';
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            
            if (canPlace(grid, word, row, col, dir, size)) {
                for (let i = 0; i < word.length; i++) {
                    if (dir === 'H') grid[row][col + i] = word[i];
                    else grid[row + i][col] = word[i];
                }
                placed = true;
            }
        }
    });

    // Preencher vazios
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === '') grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
    }
    return grid;
}

function canPlace(grid, word, r, c, dir, size) {
    if (dir === 'H' && c + word.length > size) return false;
    if (dir === 'V' && r + word.length > size) return false;
    for (let i = 0; i < word.length; i++) {
        const char = (dir === 'H') ? grid[r][c + i] : grid[r + i][c];
        if (char !== '' && char !== word[i]) return false;
    }
    return true;
}

// --- LÓGICA DE SELEÇÃO ---

function startSelection(r, c) {
    isSelecting = true;
    selectStart = { r, c };
    clearSelectionStyles();
}

function updateSelection(r, c) {
    if (!isSelecting) return;
    selectEnd = { r, c };
    highlightSelection();
}

function highlightSelection() {
    clearSelectionStyles();
    currentSelection = getCellsInRange(selectStart, selectEnd);
    currentSelection.forEach(el => el.classList.add('selected'));
}

function endSelection(targetWords) {
    if (!isSelecting) return;
    isSelecting = false;

    const selectedWord = currentSelection.map(el => el.innerText).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    let foundWord = null;
    if (targetWords.includes(selectedWord)) foundWord = selectedWord;
    else if (targetWords.includes(reversedWord)) foundWord = reversedWord;

    if (foundWord) {
        currentSelection.forEach(el => {
            el.classList.remove('selected');
            el.classList.add('found');
        });
        document.getElementById(`card-${foundWord}`).classList.add('found');
        score += (level * 100);
        document.getElementById('score-val').innerText = score;
        playSound('acerto');
        checkRoundComplete(targetWords);
    } else {
        playSound('erro');
        score = Math.max(0, score - 10);
        document.getElementById('score-val').innerText = score;
        clearSelectionStyles();
    }
}

function getCellsInRange(start, end) {
    const cells = [];
    const grid = document.getElementById('sopa-grid');
    if (!grid) return [];

    // Limitar a Horizontal ou Vertical apenas
    if (start.r === end.r) { // Horizontal
        const minC = Math.min(start.c, end.c);
        const maxC = Math.max(start.c, end.c);
        for (let c = minC; c <= maxC; c++) {
            cells.push(grid.querySelector(`[data-r="${start.r}"][data-c="${c}"]`));
        }
    } else if (start.c === end.c) { // Vertical
        const minR = Math.min(start.r, end.r);
        const maxR = Math.max(start.r, end.r);
        for (let r = minR; r <= maxR; r++) {
            cells.push(grid.querySelector(`[data-r="${r}"][data-c="${start.c}"]`));
        }
    }
    return cells.filter(el => el !== null);
}

function clearSelectionStyles() {
    document.querySelectorAll('.sopa-cell.selected').forEach(el => el.classList.remove('selected'));
}

function checkRoundComplete(targets) {
    const foundCount = document.querySelectorAll('.word-card.found').length;
    if (foundCount === targets.length) {
        setTimeout(() => {
            roundGlobal++;
            if (roundGlobal >= 5) {
                if (level === 1) {
                    level = 2;
                    roundGlobal = 0;
                    alert("Nível 1 Concluído! Vamos para o Nível 2 (Mais palavras!)");
                    loadRound();
                } else {
                    finishGame();
                }
            } else {
                loadRound();
            }
        }, 1000);
    }
}

function updateDots() {
    const dots = document.getElementById('dots-container');
    if(!dots) return;
    const allDots = dots.querySelectorAll('.dot');
    allDots.forEach((d, i) => {
        d.className = 'dot';
        if (i < roundGlobal) d.classList.add('done');
        if (i === roundGlobal) d.classList.add('active');
    });
}

function finishGame() {
    clearInterval(timerInt);
    playSound('vitoria');
    
    // Mudar para o ecrã de resultados (Ecrã 3)
    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('scr-result').classList.add('active');
    
    const finalTime = document.getElementById('timer').innerText.replace('⏳ ', '');
    const report = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[3];
    
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + report.img;
    document.getElementById('res-tit').innerText = report.titulo;
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = finalTime;
    
    // Mostrar que o footer pode voltar ou manter o layout expandido
    document.body.classList.remove('no-footer');
    document.body.classList.add('with-footer');
}

function playSound(s) {
    const audio = new Audio(JOGO_CONFIG.sons[s]);
    audio.play().catch(() => {});
}

// Função chamada pelo Menu RD
window.selectCategory = function(catKey) {
    currentCat = catKey;
    location.reload(); // Reinicia para aplicar o novo tema
};
