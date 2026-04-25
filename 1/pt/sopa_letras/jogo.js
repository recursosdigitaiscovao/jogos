let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let grid = [];
let gridCols, gridRows;
let selectedCells = [];
let isSelecting = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO (Simula o jogo real)
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px;">
            </div>
            <div id="mini-grid-intro" style="display:grid; grid-template-columns: repeat(4, 30px); gap:4px; background:#cbd9e6; padding:6px; border-radius:10px; position:relative;">
                ${['G','X','O','L','A','A','Z','U','T','V','P','M','O','R','S','I'].map((l, i) => `
                    <div class="mini-cell" style="width:30px; height:30px; background:white; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; border-radius:4px;">${l}</div>
                `).join('')}
                <div id="intro-line" style="position:absolute; background:var(--highlight-green); height:6px; border-radius:10px; opacity:0.6; transform-origin: left center; transition: 0.5s; pointer-events:none;"></div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); font-size:15px;">ENCONTRA A PALAVRA!</p>
        </div>
    `;

    // Animação da linha na intro (simulando encontrar "GATO")
    const line = document.getElementById('intro-line');
    if(line) {
        line.style.width = "0px"; line.style.top = "20px"; line.style.left = "20px"; line.style.transform = "rotate(90deg)";
        setTimeout(() => { line.style.width = "100px"; }, 500);
    }
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    iniciarTimer(); 
    proximaRodada(); 
};

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoInicio = Date.now();
    intervaloTimer = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        document.getElementById('timer-val').innerText = `${Math.floor(decorrido/60).toString().padStart(2,'0')}:${(decorrido%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= itensAtuais.length) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(itensAtuais[indiceAtual]);
}

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const isLargeScreen = window.innerWidth > 1000;
    const isMobile = window.innerWidth < 650;
    const palavra = item.nome.toUpperCase();

    // Dimensões baseadas no dispositivo
    gridCols = isLargeScreen ? 9 : 7;
    gridRows = isLargeScreen ? 7 : 9;

    // Ajuste se a palavra for maior que a grelha padrão
    if (palavra.length > gridCols && palavra.length > gridRows) {
        gridCols = palavra.length; gridRows = palavra.length;
    } else if (palavra.length > gridCols) {
        gridCols = palavra.length;
    } else if (palavra.length > gridRows) {
        gridRows = palavra.length;
    }

    generateGrid(palavra);

    // Estilos de Responsividade
    container.style.flexDirection = isLargeScreen ? "row" : "column";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.gap = isLargeScreen ? "40px" : "15px";
    container.style.padding = "20px";

    // Tamanho das células para ecrãs grandes
    const cellSize = isLargeScreen ? "min(75px, 10vh)" : "min(45px, 8vw)";

    container.innerHTML = `
        <!-- Área da Imagem -->
        <div id="image-area" style="background:white; padding:20px; border-radius:30px; box-shadow:0 12px 30px rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:${isLargeScreen ? '300px' : '120px'}; width:${isLargeScreen ? '300px' : '120px'}; object-fit:contain;">
        </div>

        <!-- Área da Grelha -->
        <div id="sopa-grid" style="
            display: grid; 
            grid-template-columns: repeat(${gridCols}, 1fr); 
            gap: 6px; 
            background: #cbd9e6; 
            padding: 10px; 
            border-radius: 20px; 
            user-select: none; 
            touch-action: none;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        ">
            ${grid.flat().map((char, idx) => `
                <div class="grid-cell" 
                     data-idx="${idx}" 
                     style="
                        width: ${cellSize}; 
                        height: ${cellSize}; 
                        background: white; 
                        border-radius: 12px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-weight: 900; 
                        font-size: calc(${cellSize} * 0.5); 
                        color: #3d4a59; 
                        cursor: pointer;
                        transition: background 0.1s;
                        box-shadow: 0 3px 0 #e0e7ee;
                     ">
                    ${char}
                </div>
            `).join('')}
        </div>
    `;

    setupInteractions(palavra);
}

function generateGrid(palavra) {
    grid = Array(gridRows).fill().map(() => Array(gridCols).fill(''));
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // Decidir direção aleatória
    const canHorizontal = palavra.length <= gridCols;
    const canVertical = palavra.length <= gridRows;
    let direction = (canHorizontal && canVertical) ? (Math.random() > 0.5 ? 0 : 1) : (canHorizontal ? 0 : 1);

    let row, col;
    if (direction === 0) { 
        row = Math.floor(Math.random() * gridRows);
        col = Math.floor(Math.random() * (gridCols - palavra.length + 1));
        for (let i = 0; i < palavra.length; i++) grid[row][col + i] = palavra[i];
    } else { 
        row = Math.floor(Math.random() * (gridRows - palavra.length + 1));
        col = Math.floor(Math.random() * gridCols);
        for (let i = 0; i < palavra.length; i++) grid[row + i][col] = palavra[i];
    }

    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            if (grid[r][c] === '') grid[r][c] = chars[Math.floor(Math.random() * chars.length)];
        }
    }
}

function setupInteractions(palavraCorreta) {
    const cells = document.querySelectorAll('.grid-cell');
    
    const startSelect = (e) => {
        isSelecting = true;
        selectedCells = [];
        clearHighlight();
        handleCell(e.target || e.currentTarget);
    };

    const moveSelect = (e) => {
        if (!isSelecting) return;
        let target;
        if (e.type === 'touchmove') {
            const touch = e.touches[0];
            target = document.elementFromPoint(touch.clientX, touch.clientY);
        } else {
            target = e.target;
        }
        if (target && target.classList.contains('grid-cell')) handleCell(target);
    };

    const endSelect = () => {
        if (!isSelecting) return;
        isSelecting = false;
        checkWord(palavraCorreta);
    };

    cells.forEach(cell => {
        cell.onmousedown = startSelect;
        cell.onmouseenter = moveSelect;
        cell.ontouchstart = (e) => { e.preventDefault(); startSelect(e); };
    });

    window.ontouchmove = moveSelect;
    window.onmouseup = endSelect;
    window.ontouchend = endSelect;
}

function handleCell(cell) {
    const idx = cell.getAttribute('data-idx');
    if (idx && !selectedCells.includes(idx)) {
        selectedCells.push(idx);
        cell.style.background = "var(--primary-blue)";
        cell.style.color = "white";
        cell.style.boxShadow = "none";
        cell.style.transform = "translateY(2px)";
    }
}

function clearHighlight() {
    document.querySelectorAll('.grid-cell').forEach(c => {
        c.style.background = "white";
        c.style.color = "#3d4a59";
        c.style.boxShadow = "0 3px 0 #e0e7ee";
        c.style.transform = "none";
    });
}

function checkWord(correta) {
    const palavraSelecionada = selectedCells.map(idx => {
        const r = Math.floor(idx / gridCols);
        const c = idx % gridCols;
        return grid[r][c];
    }).join('');

    if (palavraSelecionada === correta || palavraSelecionada === correta.split('').reverse().join('')) {
        acertos++;
        somAcerto.play();
        selectedCells.forEach(idx => {
            const cell = document.querySelector(`[data-idx="${idx}"]`);
            cell.style.background = "#7ed321";
            cell.style.color = "white";
        });
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => {
            indiceAtual++;
            proximaRodada();
        }, 800);
    } else {
        if (palavraSelecionada.length >= correta.length) {
            erros++;
            somErro.play();
            document.getElementById('miss-val').innerText = erros;
        }
        clearHighlight();
    }
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
