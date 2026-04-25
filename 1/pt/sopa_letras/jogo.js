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
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%;">
            <div style="background:white; padding:8px; border-radius:15px; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:60px;">
            </div>
            <div id="mini-grid-intro" style="display:grid; grid-template-columns: repeat(4, 25px); gap:4px; background:#cbd9e6; padding:5px; border-radius:8px; position:relative;">
                ${['G','X','O','L','A','A','Z','U','T','V','P','M','O','R','S','I'].map((l, i) => `
                    <div class="mini-cell" style="width:25px; height:25px; background:white; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:12px; border-radius:3px;">${l}</div>
                `).join('')}
                <div id="intro-hand" style="position:absolute; width:15px; height:15px; background:var(--highlight-green); border-radius:50%; opacity:0.7; pointer-events:none; transition: 0.5s ease-in-out;"></div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); font-size:14px;">ENCONTRA A PALAVRA!</p>
        </div>
    `;

    // Animar a seleção na intro
    const hand = document.getElementById('intro-hand');
    const points = [{t:0, l:0}, {t:30, l:0}, {t:60, l:0}, {t:90, l:0}]; // Selecionando GATO na vertical (simulado)
    let step = 0;
    setInterval(() => {
        if(!hand) return;
        let p = points[step % points.length];
        hand.style.top = (p.t + 10) + 'px';
        hand.style.left = (p.l + 10) + 'px';
        step++;
    }, 600);
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
    const isMobile = window.innerWidth < 1024;
    const palavra = item.nome.toUpperCase();

    // Configurar dimensões baseadas no dispositivo
    gridCols = isMobile ? 7 : 9;
    gridRows = isMobile ? 9 : 7;

    // Ajuste automático se a palavra for maior que a grelha
    if (palavra.length > gridCols && palavra.length > gridRows) {
        gridCols = palavra.length;
        gridRows = palavra.length;
    } else if (palavra.length > gridCols) {
        // Se a palavra só couber na vertical, garantimos que gridRows chega lá
        if (palavra.length > gridRows) gridRows = palavra.length;
    } else if (palavra.length > gridRows) {
         // Se a palavra só couber na horizontal, garantimos que gridCols chega lá
        if (palavra.length > gridCols) gridCols = palavra.length;
    }

    generateGrid(palavra);

    // Layout Híbrido: Lado a lado no PC, Coluna no Mobile
    container.style.flexDirection = isMobile ? "column" : "row";
    container.style.justifyContent = "space-around";
    container.style.padding = "10px";

    container.innerHTML = `
        <div id="image-area" style="background:white; padding:15px; border-radius:25px; box-shadow:0 8px 20px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center; margin:10px;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile ? '100px' : '220px'}; max-width:${isMobile ? '120px' : '250px'}; object-fit:contain;">
        </div>

        <div id="sopa-grid" style="
            display: grid; 
            grid-template-columns: repeat(${gridCols}, 1fr); 
            gap: 4px; 
            background: #cbd9e6; 
            padding: 6px; 
            border-radius: 12px; 
            user-select: none; 
            touch-action: none;
            width: ${isMobile ? '98%' : 'auto'};
            max-height: ${isMobile ? '55vh' : '85%'};
            aspect-ratio: ${gridCols}/${gridRows};
        ">
            ${grid.flat().map((char, idx) => `
                <div class="grid-cell" 
                     data-idx="${idx}" 
                     style="
                        background: white; 
                        border-radius: 6px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-weight: 900; 
                        font-size: calc(12px + 1vw); 
                        color: #3d4a59; 
                        cursor: pointer;
                        transition: background 0.1s;
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
    
    const canHorizontal = palavra.length <= gridCols;
    const canVertical = palavra.length <= gridRows;

    let direction; // 0 H, 1 V
    if (canHorizontal && canVertical) direction = Math.random() > 0.5 ? 0 : 1;
    else direction = canHorizontal ? 0 : 1;

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
        handleCell(e.target);
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
    if (!selectedCells.includes(idx)) {
        selectedCells.push(idx);
        cell.style.background = "var(--primary-blue)";
        cell.style.color = "white";
    }
}

function clearHighlight() {
    document.querySelectorAll('.grid-cell').forEach(c => {
        c.style.background = "white";
        c.style.color = "#3d4a59";
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
        }, 1000);
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
