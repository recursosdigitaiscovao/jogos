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
let palavrasDestaRonda = [];
let palavrasEncontradas = [];

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO (Mostra a palavra toda sendo selecionada)
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    const totalPalavras = [...cat.itens].sort(() => Math.random() - 0.5);
    // Agrupar de 3 em 3 para o jogo
    itensAtuais = [];
    for (let i = 0; i < totalPalavras.length; i += 3) {
        if (totalPalavras[i+2]) itensAtuais.push([totalPalavras[i], totalPalavras[i+1], totalPalavras[i+2]]);
    }
    
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%;">
            <div style="background:white; padding:8px; border-radius:15px; box-shadow:0 8px 15px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:60px;">
            </div>
            <div id="intro-grid-anim" style="display:grid; grid-template-columns: repeat(4, 28px); gap:4px; background:#cbd9e6; padding:5px; border-radius:8px; position:relative;">
                ${['G','A','T','O','X','Y','Z','W','L','M','N','P','R','S','T','U'].map(l => `
                    <div style="width:28px; height:28px; background:white; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; border-radius:3px;">${l}</div>
                `).join('')}
                <div id="intro-line" style="position:absolute; top:18px; left:18px; height:6px; width:0; background:var(--highlight-green); opacity:0.6; border-radius:10px; transition: width 2s ease-in-out; pointer-events:none;"></div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); font-size:14px;">ENCONTRA AS 3 PALAVRAS!</p>
        </div>
    `;

    setTimeout(() => {
        const line = document.getElementById('intro-line');
        if(line) line.style.width = "90px";
    }, 500);
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
    palavrasEncontradas = [];
    palavrasDestaRonda = itensAtuais[indiceAtual].map(it => it.nome.toUpperCase());
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(itensAtuais[indiceAtual]);
}

function montarInterface(itens) {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 1024;
    
    // Dimensões base
    gridCols = isMobile ? 7 : 10;
    gridRows = isMobile ? 10 : 7;

    // Ajuste se alguma palavra for maior que a grelha
    const maxL = Math.max(...palavrasDestaRonda.map(p => p.length));
    if (maxL > gridCols) gridCols = maxL + 1;
    if (maxL > gridRows && !isMobile) gridRows = maxL;

    generateGrid(palavrasDestaRonda, isMobile);

    container.style.flexDirection = isMobile ? "column" : "row";
    container.style.alignItems = "center";
    container.style.padding = "10px";
    container.style.gap = "10px";

    container.innerHTML = `
        <div id="side-images" style="
            display: flex; 
            flex-direction: ${isMobile ? 'row' : 'column'}; 
            gap: 10px; 
            justify-content: center;
            width: ${isMobile ? '100%' : '180px'};
        ">
            ${itens.map((item, i) => `
                <div id="img-card-${i}" style="background:white; padding:8px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center; position:relative; border: 3px solid transparent; transition:0.3s;">
                    <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:${isMobile ? '50px' : '90px'}; width:auto; object-fit:contain;">
                    <div class="check-mark" style="display:none; position:absolute; color:#7ed321; font-size:24px; font-weight:900;">✓</div>
                </div>
            `).join('')}
        </div>

        <div id="sopa-grid" style="
            flex: 1;
            display: grid; 
            grid-template-columns: repeat(${gridCols}, 1fr); 
            gap: 4px; 
            background: #cbd9e6; 
            padding: 6px; 
            border-radius: 12px; 
            user-select: none; 
            touch-action: none;
            width: 100%;
            max-width: ${isMobile ? '400px' : '700px'};
            max-height: ${isMobile ? '60vh' : '90%'};
            aspect-ratio: ${gridCols}/${gridRows};
        ">
            ${grid.flat().map((char, idx) => `
                <div class="grid-cell" data-idx="${idx}" style="
                    background: white; border-radius: 5px; display: flex; 
                    align-items: center; justify-content: center; font-weight: 900; 
                    font-size: ${isMobile ? 'min(5vw, 18px)' : 'min(2.2vw, 32px)'}; 
                    color: #3d4a59; cursor: pointer; transition: 0.1s;
                ">${char}</div>
            `).join('')}
        </div>
    `;

    setupInteractions();
}

function generateGrid(palavras, isMobile) {
    grid = Array(gridRows).fill().map(() => Array(gridCols).fill(''));
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    palavras.forEach(palavra => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            const direction = Math.random() > 0.5 ? 0 : 1; // 0 H, 1 V
            const row = Math.floor(Math.random() * (gridRows - (direction === 1 ? palavra.length : 0)));
            const col = Math.floor(Math.random() * (gridCols - (direction === 0 ? palavra.length : 0)));
            
            let canPlace = true;
            for (let i = 0; i < palavra.length; i++) {
                const r = row + (direction === 1 ? i : 0);
                const c = col + (direction === 0 ? i : 0);
                if (grid[r][c] !== '' && grid[r][c] !== palavra[i]) { canPlace = false; break; }
            }

            if (canPlace) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[row + (direction === 1 ? i : 0)][col + (direction === 0 ? i : 0)] = palavra[i];
                }
                placed = true;
            }
            attempts++;
        }
    });

    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            if (grid[r][c] === '') grid[r][c] = chars[Math.floor(Math.random() * chars.length)];
        }
    }
}

function setupInteractions() {
    const cells = document.querySelectorAll('.grid-cell');
    const startSelect = (e) => {
        isSelecting = true;
        selectedCells = [];
        const target = e.target || e.touches[0].target;
        if(target.classList.contains('grid-cell')) handleCell(target);
    };

    const moveSelect = (e) => {
        if (!isSelecting) return;
        let target = e.type.includes('touch') ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : e.target;
        if (target && target.classList.contains('grid-cell')) handleCell(target);
    };

    const endSelect = () => {
        if (!isSelecting) return;
        isSelecting = false;
        checkWord();
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

function checkWord() {
    const selectedText = selectedCells.map(idx => {
        const r = Math.floor(idx / gridCols);
        const c = idx % gridCols;
        return grid[r][c];
    }).join('');
    const reversed = selectedText.split('').reverse().join('');

    let foundIdx = palavrasDestaRonda.findIndex(p => (p === selectedText || p === reversed) && !palavrasEncontradas.includes(p));

    if (foundIdx !== -1) {
        const palavra = palavrasDestaRonda[foundIdx];
        palavrasEncontradas.push(palavra);
        somAcerto.play();
        
        // Marcar imagem como concluída
        const imgCard = document.getElementById(`img-card-${foundIdx}`);
        imgCard.style.borderColor = "#7ed321";
        imgCard.querySelector('.check-mark').style.display = "block";

        selectedCells.forEach(idx => {
            const cell = document.querySelector(`[data-idx="${idx}"]`);
            cell.style.background = "#7ed321";
            cell.classList.add('permanente');
        });

        if (palavrasEncontradas.length === 3) {
            acertos += 3;
            document.getElementById('hits-val').innerText = acertos;
            setTimeout(() => { indiceAtual++; proximaRodada(); }, 1000);
        }
    } else {
        selectedCells.forEach(idx => {
            const cell = document.querySelector(`[data-idx="${idx}"]`);
            if(!cell.classList.contains('permanente')) {
                cell.style.background = "white";
                cell.style.color = "#3d4a59";
            }
        });
    }
    selectedCells = [];
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
