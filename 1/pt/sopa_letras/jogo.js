let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let grid = [];
const gridSize = 8; // Grelha 8x8
let selectedCells = [];
let isSelecting = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px;">
            </div>
            <div style="display:grid; grid-template-columns: repeat(3, 30px); gap:5px;">
                ${['G','X','O','A','A','Z','T','L','P'].map((l, i) => `
                    <div style="width:30px; height:30px; background:${[0,3,6].includes(i)?'var(--highlight-green)':'white'}; border:1px solid #eee; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; border-radius:4px;">${l}</div>
                `).join('')}
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-align:center;">PROCURA A PALAVRA!</p>
        </div>`;
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
    const isMobile = window.innerWidth < 600;
    const palavra = item.nome.toUpperCase();
    
    generateGrid(palavra);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly; padding: 5px 0;">
            
            <!-- Imagem Alvo -->
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 6px 15px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile ? '80px' : '130px'}; max-width:150px; object-fit:contain;">
            </div>

            <!-- Grelha da Sopa de Letras -->
            <div id="sopa-grid" style="
                display: grid; 
                grid-template-columns: repeat(${gridSize}, 1fr); 
                gap: 5px; 
                background: #cbd9e6; 
                padding: 8px; 
                border-radius: 15px; 
                user-select: none; 
                touch-action: none;
                width: 95%;
                max-width: 450px;
            ">
                ${grid.flat().map((char, idx) => `
                    <div class="grid-cell" 
                         data-idx="${idx}" 
                         style="
                            aspect-ratio: 1; 
                            background: white; 
                            border-radius: 8px; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-weight: 900; 
                            font-size: ${isMobile ? '18px' : '22px'}; 
                            color: #445; 
                            cursor: pointer;
                            transition: 0.2s;
                         ">
                        ${char}
                    </div>
                `).join('')}
            </div>

            <div style="font-weight: 900; color: var(--primary-blue); font-size: 18px; letter-spacing: 2px;">
                ${palavra.split('').map(() => '_ ').join('')}
            </div>
        </div>`;

    setupInteractions(palavra);
}

function generateGrid(palavra) {
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // Decidir direção: 0 = Horizontal, 1 = Vertical
    const direction = Math.random() > 0.5 ? 0 : 1;
    let row, col;

    if (direction === 0) { // Horizontal
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * (gridSize - palavra.length));
        for (let i = 0; i < palavra.length; i++) grid[row][col + i] = palavra[i];
    } else { // Vertical
        row = Math.floor(Math.random() * (gridSize - palavra.length));
        col = Math.floor(Math.random() * gridSize);
        for (let i = 0; i < palavra.length; i++) grid[row + i][col] = palavra[i];
    }

    // Preencher o resto
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
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
        c.style.color = "#445";
    });
}

function checkWord(correta) {
    const palavraSelecionada = selectedCells.map(idx => {
        const r = Math.floor(idx / gridSize);
        const c = idx % gridSize;
        return grid[r][c];
    }).join('');

    // Verifica se a palavra selecionada é igual à correta (ou ao contrário)
    if (palavraSelecionada === correta || palavraSelecionada === correta.split('').reverse().join('')) {
        acertos++;
        somAcerto.play();
        selectedCells.forEach(idx => {
            const cell = document.querySelector(`[data-idx="${idx}"]`);
            cell.style.background = "#7ed321";
        });
        document.getElementById('hits-val').innerText = acertos;
        
        setTimeout(() => {
            indiceAtual++;
            proximaRodada();
        }, 1000);
    } else {
        // Se soltou e não é a palavra, reseta mas não conta erro imediatamente 
        // para permitir exploração, a menos que o tamanho seja o mesmo.
        if (palavraSelecionada.length >= correta.length) {
            erros++;
            somErro.play();
            document.getElementById('miss-val').innerText = erros;
            clearHighlight();
        } else {
            clearHighlight();
        }
    }
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
