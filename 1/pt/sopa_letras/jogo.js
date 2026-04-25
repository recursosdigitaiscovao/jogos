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

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div style="background:white; padding:8px; border-radius:15px; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:60px;">
            </div>
            <div style="display:grid; grid-template-columns: repeat(3, 30px); gap:4px; background:#cbd9e6; padding:5px; border-radius:8px;">
                ${['G','X','O','A','A','Z','T','L','P'].map((l, i) => `
                    <div style="width:30px; height:30px; background:${[0,3,6].includes(i)?'var(--highlight-green)':'white'}; color:${[0,3,6].includes(i)?'white':'#445'}; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; border-radius:3px;">${l}</div>
                `).join('')}
            </div>
            <p style="font-weight:900; color:var(--primary-blue);">ENCONTRA A PALAVRA!</p>
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
    const isMobile = window.innerWidth < 768;
    const palavra = item.nome.toUpperCase();

    // Dimensões solicitadas
    gridCols = isMobile ? 7 : 9;
    gridRows = isMobile ? 9 : 7;

    // Ajuste se a palavra for maior que os limites
    if (palavra.length > gridCols && isMobile) gridCols = palavra.length;
    if (palavra.length > gridRows && !isMobile) gridRows = palavra.length;

    generateGrid(palavra, isMobile);

    container.style.flexDirection = isMobile ? "column" : "row";
    container.style.padding = isMobile ? "10px 5px" : "20px";
    container.style.gap = "15px";

    container.innerHTML = `
        <div id="image-area" style="
            flex: ${isMobile ? '0' : '1'}; 
            background:white; padding:15px; border-radius:25px; 
            box-shadow:0 8px 20px rgba(0,0,0,0.05); 
            display:flex; align-items:center; justify-content:center;
            min-width: ${isMobile ? 'auto' : '200px'};
        ">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile ? '80px' : '250px'}; max-width:${isMobile ? '100px' : '100%'}; object-fit:contain;">
        </div>

        <div id="sopa-grid" style="
            flex: ${isMobile ? '1' : '3'};
            display: grid; 
            grid-template-columns: repeat(${gridCols}, 1fr); 
            gap: 4px; 
            background: #cbd9e6; 
            padding: 6px; 
            border-radius: 12px; 
            user-select: none; 
            touch-action: none;
            width: 100%;
            height: 100%;
            max-height: ${isMobile ? '65vh' : '90vh'};
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
                        font-size: ${isMobile ? 'min(6vw, 24px)' : 'min(3vw, 40px)'}; 
                        color: #3d4a59; 
                        cursor: pointer;
                        box-shadow: inset 0 -2px 0 rgba(0,0,0,0.05);
                        transition: 0.1s;
                     ">
                    ${char}
                </div>
            `).join('')}
        </div>
    `;

    setupInteractions(palavra);
}

function generateGrid(palavra, isMobile) {
    grid = Array(gridRows).fill().map(() => Array(gridCols).fill(''));
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // Lógica para forçar vertical no mobile se a palavra for grande
    let direction; // 0 H, 1 V
    if (isMobile && palavra.length > 5) {
        direction = 1; // Força vertical para caber na largura de 7 colunas
    } else {
        const canH = palavra.length <= gridCols;
        const canV = palavra.length <= gridRows;
        if (canH && canV) direction = Math.random() > 0.5 ? 0 : 1;
        else direction = canH ? 0 : 1;
    }

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

    // Preencher espaços vazios com letras aleatórias
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
        handleCell(e.target || e.touches[0].target);
    };

    const moveSelect = (e) => {
        if (!isSelecting) return;
        let target;
        if (e.type.includes('touch')) {
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
        cell.style.transform = "scale(0.95)";
    }
}

function clearHighlight() {
    document.querySelectorAll('.grid-cell').forEach(c => {
        c.style.background = "white";
        c.style.color = "#3d4a59";
        c.style.transform = "scale(1)";
    });
}

function checkWord(correta) {
    const palavraSelecionada = selectedCells.map(idx => {
        const r = Math.floor(idx / gridCols);
        const c = idx % gridCols;
        return grid[r][c];
    }).join('');

    const invertida = palavraSelecionada.split('').reverse().join('');

    if (palavraSelecionada === correta || invertida === correta) {
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
