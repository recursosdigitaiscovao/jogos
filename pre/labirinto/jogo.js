let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;

let categoriaAtual = "natureza";
let mapaAtual = [];
let posPersonagem = { x: 0, y: 0 };
let cols, rows; // Dinâmicas

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. CONTROLO POR TECLADO ===
window.addEventListener('keydown', (e) => {
    if (!document.getElementById('scr-game').classList.contains('active') || !jogoAtivo) return;
    if (e.key === "ArrowUp") tentarMover(0, -1);
    if (e.key === "ArrowDown") tentarMover(0, 1);
    if (e.key === "ArrowLeft") tentarMover(-1, 0);
    if (e.key === "ArrowRight") tentarMover(1, 0);
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
});

// === 2. INICIALIZAÇÃO ===
window.startLogic = function() {
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
    }
    renderTutorialAnimation();
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const cat = JOGO_CATEGORIAS[categoriaAtual] || JOGO_CATEGORIAS[Object.keys(JOGO_CATEGORIAS)[0]];
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div style="display:grid; grid-template-columns:repeat(3, 30px); gap:2px; background:#eee; border:2px solid #ddd; border-radius:10px; position:relative; overflow:hidden;">
                ${Array(9).fill('<div style="width:30px; height:30px; background:white;"></div>').join('')}
                <div style="position:absolute; top:2px; left:64px;">🎯</div>
                <div style="position:absolute; top:64px; left:2px; font-size:20px; animation: moveT 3s infinite;">${cat.personagem.includes('abelha') ? '🐝' : '👤'}</div>
            </div>
            <div style="font-size:30px; animation: tapT 3s infinite;">☝️</div>
        </div>
        <style>
            @keyframes moveT { 0%, 20% { transform: translate(0,0); } 50%, 100% { transform: translate(32px, 0); } }
            @keyframes tapT { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px) scale(0.8); } }
        </style>
    `;
}

// === 3. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0; ajudasUtilizadas = 0; jogoAtivo = true;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    proximaRonda();
};

function calcularDimensoesGrelha() {
    const container = document.getElementById('game-main-content');
    const largura = container.clientWidth;
    const altura = container.clientHeight;
    const isLandscape = largura > altura;

    // Tamanho base da célula para garantir que cabe
    const cellSize = isLandscape ? 55 : 45; 

    cols = Math.floor((largura * 0.9) / cellSize);
    rows = Math.floor((altura * 0.7) / cellSize);

    // Limites mínimos e máximos para jogabilidade
    cols = Math.max(5, Math.min(cols, 15));
    rows = Math.max(5, Math.min(rows, 12));
}

function gerarLabirinto(c, r) {
    let maze = Array.from({ length: r }, () => Array(c).fill(1));
    let stack = [[0, 0]];
    maze[0][0] = 0;

    while (stack.length > 0) {
        let [cx, cy] = stack[stack.length - 1];
        let neighbors = [];
        [[0, -2], [0, 2], [-2, 0], [2, 0]].forEach(([dx, dy]) => {
            let nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < c && ny >= 0 && ny < r && maze[ny][nx] === 1) neighbors.push([nx, ny]);
        });
        if (neighbors.length > 0) {
            let [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[cy + (ny - cy) / 2][cx + (nx - cx) / 2] = 0; 
            maze[ny][nx] = 0; 
            stack.push([nx, ny]);
        } else { stack.pop(); }
    }
    // Abrir alguns caminhos extras para não ser impossível
    for(let i=0; i < (c*r)/10; i++) {
        let rx = Math.floor(Math.random()*(c-2))+1;
        let ry = Math.floor(Math.random()*(r-2))+1;
        maze[ry][rx] = 0;
    }
    maze[r-1][c-1] = 0; // Saída
    return maze;
}

function proximaRonda() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    calcularDimensoesGrelha();
    mapaAtual = gerarLabirinto(cols, rows);
    posPersonagem = { x: 0, y: 0 };
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const cat = JOGO_CATEGORIAS[categoriaAtual];
    const tema = BIBLIOTECA_TEMAS[CONFIG_MESTRE.area];
    const imgSeta = JOGO_CONFIG.caminhoIcons + tema.voltarMobile;

    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;
    
    container.innerHTML = `
        <style>
            .maze-wrapper { display: flex; flex-direction: column; width: 98%; height: 98%; margin: auto; align-items: center; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding: 5px; }
            .maze-area { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0; }
            .maze-grid { 
                display: grid; 
                grid-template-columns: repeat(${cols}, 1fr); 
                grid-template-rows: repeat(${rows}, 1fr); 
                width: auto; height: auto;
                max-width: 100%; max-height: 100%;
                aspect-ratio: ${cols}/${rows};
                background: #fff; border: 3px solid #eee; border-radius: 12px; position: relative; 
            }
            .maze-cell { border: 0.5px solid #f0f0f0; display: flex; align-items: center; justify-content: center; position: relative; }
            .wall { width: 90%; height: 90%; object-fit: contain; }
            .goal { width: 85%; height: 85%; object-fit: contain; animation: bounce 2s infinite; }
            .hero-p { position: absolute; width: ${100/cols}%; height: ${100/rows}%; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease-out; z-index: 10; }
            .hero-p img { width: 90%; height: 90%; object-fit: contain; transition: transform 0.2s; }
            .hint-dot { width: 35%; height: 35%; background: var(--primary-blue); border-radius: 50%; opacity: 0.7; z-index: 5; animation: pulseHint 1s infinite; }
            
            .maze-controls-row { display: flex; gap: 10px; padding: 5px 0; flex-shrink: 0; justify-content: center; width: 100%; }
            .b-nav { width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border: 2px solid #f0f0f0; }
            .b-nav img { height: 28px; width: auto; }
            .rot-up { transform: rotate(90deg); } .rot-down { transform: rotate(270deg); } .rot-right { transform: rotate(180deg); }

            @media (orientation: landscape) {
                .maze-wrapper { flex-direction: row; gap: 15px; }
                .maze-controls-row { flex-direction: column; width: auto; height: 100%; }
            }
            @keyframes pulseHint { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.4); } }
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        </style>

        <div class="maze-wrapper">
            <div class="maze-area">
                <div class="maze-grid">
                    ${mapaAtual.map((rowArr, y) => rowArr.map((cell, x) => {
                        let content = "";
                        if (cell === 1) content = `<img src="${JOGO_CONFIG.caminhoImg}${cat.obstaculo}" class="wall">`;
                        else if (x === cols-1 && y === rows-1) content = `<img id="target-img" src="${JOGO_CONFIG.caminhoImg}${cat.objetivo}" class="goal">`;
                        return `<div class="maze-cell" id="cell-${x}-${y}">${content}</div>`;
                    }).join('')).join('')}
                    <div class="hero-p" id="player" style="left:${posPersonagem.x*(100/cols)}%; top:${posPersonagem.y*(100/rows)}%;"><img src="${JOGO_CONFIG.caminhoImg}${cat.personagem}"></div>
                </div>
            </div>
            <div class="maze-controls-row">
                <div class="b-nav" onclick="tentarMover(-1, 0)"><img src="${imgSeta}"></div>
                <div class="b-nav" onclick="tentarMover(0, -1)"><img src="${imgSeta}" class="rot-up"></div>
                <div class="b-nav" onclick="tentarMover(0, 1)"><img src="${imgSeta}" class="rot-down"></div>
                <div class="b-nav" onclick="tentarMover(1, 0)"><img src="${imgSeta}" class="rot-right"></div>
            </div>
        </div>
    `;
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const caminho = calcularCaminho(posPersonagem, {x: cols-1, y: rows-1});
    caminho.forEach(pos => {
        const cell = document.getElementById(`cell-${pos.x}-${pos.y}`);
        if (cell && !cell.querySelector('.wall') && !cell.querySelector('.goal')) {
            const dot = document.createElement('div');
            dot.className = 'hint-dot';
            cell.appendChild(dot);
        }
    });
    setTimeout(() => {
        document.querySelectorAll('.hint-dot').forEach(d => d.remove());
        setTimeout(() => ajudaDisponivel = true, 2000);
    }, 2000);
};

function calcularCaminho(start, end) {
    let queue = [[start]];
    let visited = new Set([`${start.x},${start.y}`]);
    while (queue.length > 0) {
        let path = queue.shift();
        let current = path[path.length - 1];
        if (current.x === end.x && current.y === end.y) return path;
        for (let [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
            let nx = current.x + dx, ny = current.y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && mapaAtual[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
                visited.add(`${nx},${ny}`);
                queue.push([...path, {x: nx, y: ny}]);
            }
        }
    }
    return [];
}

window.tentarMover = function(dx, dy) {
    if (!jogoAtivo) return;
    let nx = posPersonagem.x + dx, ny = posPersonagem.y + dy;
    const hero = document.getElementById('player');
    const heroImg = hero.querySelector('img');

    // Virar conforme a direção
    if (dx > 0) heroImg.style.transform = "scaleX(-1)"; 
    else if (dx < 0) heroImg.style.transform = "scaleX(1)";

    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows || mapaAtual[ny][nx] === 1) {
        somErro.play(); erros++; document.getElementById('miss-val').innerText = erros;
        hero.classList.add('shake'); setTimeout(() => hero.classList.remove('shake'), 300); return;
    }
    posPersonagem.x = nx; posPersonagem.y = ny;
    hero.style.left = `${nx * (100/cols)}%`;
    hero.style.top = `${ny * (100/rows)}%`;
    if (nx === cols - 1 && ny === rows - 1) {
        somAcerto.play(); acertos++; document.getElementById('hits-val').innerText = acertos;
        jogoAtivo = false;
        setTimeout(() => { indicePergunta++; proximaRonda(); jogoAtivo = true; }, 800);
    }
};

function finalizarJogo() {
    jogoAtivo = false; somVitoria.play();
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <style>
                .res-container { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 450px; }
                .res-trophy { height: 110px; margin-bottom: 10px; }
                .res-stats-row { display: flex; gap: 15px; margin-bottom: 30px; width: 100%; justify-content: center; }
                .stat-box { background: white; border-radius: 25px; width: 100px; height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .stat-val { font-size: 1.8rem; font-weight: 900; margin-bottom: 2px; }
                .stat-lab { font-size: 0.65rem; font-weight: 900; color: #88a; text-transform: uppercase; }
                .btn-res { height: 55px; width: 100%; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 900; font-size: 1.1rem; text-decoration: none; cursor: pointer; border: none; margin-bottom: 10px; }
                .btn-redo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
                .btn-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); }
                .btn-exit { background: #e2e8f0; color: #64748b; }
            </style>
            <div class="res-container">
                <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" class="res-trophy">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2rem; margin-bottom:20px;">${rel.titulo}</h1>
                <div class="res-stats-row">
                    <div class="stat-box"><span class="stat-val" style="color:#7ed321;">${acertos}</span><span class="stat-lab">Certos</span></div>
                    <div class="stat-box"><span class="stat-val" style="color:#ff5e5e;">${erros}</span><span class="stat-lab">Errados</span></div>
                    <div class="stat-box"><span class="stat-val" style="color:#ff9f43;">${ajudasUtilizadas}</span><span class="stat-lab">Ajudas</span></div>
                </div>
                <button class="btn-res btn-redo" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button class="btn-res btn-outline" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-exit"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
