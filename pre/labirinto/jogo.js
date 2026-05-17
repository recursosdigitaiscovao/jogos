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
let tamanhoGrelha = 6;

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
    const cat = JOGO_CATEGORIAS[categoriaAtual] || Object.keys(JOGO_CATEGORIAS)[0];
    tamanhoGrelha = cat.tamanho;
    
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer; display:block;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
    }

    document.getElementById('intro-instr').innerText = "Leva o teu amigo ao objetivo sem bater nas paredes!";
    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    tamanhoGrelha = JOGO_CATEGORIAS[key].tamanho;
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const cat = JOGO_CATEGORIAS[categoriaAtual];
    
    container.innerHTML = `
        <style>
            .tut-wrapper { position:relative; display:flex; flex-direction:column; align-items:center; gap:15px; width:100%; }
            .tut-grid { display:grid; grid-template-columns:repeat(3, 35px); gap:2px; background:#eee; border:2px solid #ddd; border-radius:10px; overflow:hidden; position:relative; }
            .tut-cell { background:white; width:35px; height:35px; display:flex; align-items:center; justify-content:center; }
            .tut-hero { position:absolute; width:35px; height:35px; display:flex; align-items:center; justify-content:center; transition:0.5s; top:74px; left:0; z-index:5; }
            .tut-hand { position:absolute; font-size:40px; z-index:10; animation: tutHandTap 3s infinite; }
            @keyframes tutHandTap { 0%, 100% { transform:translate(80px, 40px); } 50% { transform:translate(80px, 40px) scale(0.8); } }
            @keyframes tutHeroMove { 0%, 20% { left:0; } 40%, 100% { left:37px; } }
            .tut-hero img { width:85%; height:85%; object-fit:contain; animation: tutHeroMove 3s infinite; }
        </style>
        <div class="tut-wrapper">
            <div class="tut-grid">
                <div class="tut-cell"></div><div class="tut-cell"></div><div class="tut-cell">🎯</div>
                <div class="tut-cell"></div><div class="tut-cell" style="background:#f5f5f5"></div><div class="tut-cell"></div>
                <div class="tut-cell"></div><div class="tut-cell"></div><div class="tut-cell"></div>
                <div class="tut-hero"><img src="${JOGO_CONFIG.caminhoImg}${cat.personagem}"></div>
            </div>
            <div class="tut-hand">☝️</div>
        </div>
    `;
}

// === 3. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0; ajudasUtilizadas = 0; jogoAtivo = true;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    proximaRonda();
};

function gerarLabirinto(dim) {
    let maze = Array.from({ length: dim }, () => Array(dim).fill(1));
    let stack = [[0, 0]];
    maze[0][0] = 0;
    while (stack.length > 0) {
        let [cx, cy] = stack[stack.length - 1];
        let neighbors = [];
        [[0, -2], [0, 2], [-2, 0], [2, 0]].forEach(([dx, dy]) => {
            let nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < dim && ny >= 0 && ny < dim && maze[ny][nx] === 1) neighbors.push([nx, ny]);
        });
        if (neighbors.length > 0) {
            let [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[cy + (ny - cy) / 2][cx + (nx - cx) / 2] = 0; maze[ny][nx] = 0; stack.push([nx, ny]);
        } else { stack.pop(); }
    }
    for(let i=0; i < dim/2; i++) {
        let rx = Math.floor(Math.random()*(dim-2))+1; let ry = Math.floor(Math.random()*(dim-2))+1; maze[ry][rx] = 0;
    }
    maze[dim-1][dim-1] = 0;
    return maze;
}

function proximaRonda() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    mapaAtual = gerarLabirinto(tamanhoGrelha);
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
            .maze-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: center; padding: 5px; box-sizing: border-box; overflow: hidden; }
            .maze-area { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0; }
            
            /* Grelha responsiva para evitar transbordar no mobile vertical */
            .maze-grid { 
                display: grid; 
                grid-template-columns: repeat(${tamanhoGrelha}, 1fr); 
                grid-template-rows: repeat(${tamanhoGrelha}, 1fr); 
                width: 90vmin; height: 90vmin;
                max-width: 95%; max-height: 95%;
                background: #fff; border: 4px solid #eee; border-radius: 15px; position: relative; 
            }

            .maze-cell { border: 1px solid #f9f9f9; display: flex; align-items: center; justify-content: center; position: relative; }
            .wall { width: 85%; height: 85%; object-fit: contain; }
            .goal { width: 80%; height: 80%; object-fit: contain; animation: bounce 2s infinite; }
            .hero-p { position: absolute; width: ${100/tamanhoGrelha}%; height: ${100/tamanhoGrelha}%; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease-out; z-index: 10; }
            .hero-p img { width: 85%; height: 85%; object-fit: contain; transition: transform 0.2s; }
            .hero-p.shake { animation: shake 0.3s; }
            .hint-dot { width: 30%; height: 30%; background: var(--primary-blue); border-radius: 50%; opacity: 0.6; z-index: 5; animation: pulseHint 1s infinite; }
            
            .maze-controls-row { display: flex; gap: 10px; padding: 10px 0; flex-shrink: 0; align-items: center; justify-content: center; width: 100%; }
            .b-nav { 
                width: 55px; height: 55px; background: white; border-radius: 50%; 
                display: flex; align-items: center; justify-content: center; 
                cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 2px solid #f0f0f0; 
            }
            .b-nav img { height: 32px; width: auto; pointer-events: none; }
            .rot-up { transform: rotate(90deg); }
            .rot-down { transform: rotate(270deg); }
            .rot-right { transform: rotate(180deg); }
            .rot-left { transform: rotate(0deg); }

            @keyframes pulseHint { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.5); } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

            @media (max-width: 500px) {
                .maze-grid { width: 75vw; height: 75vw; }
                .b-nav { width: 50px; height: 50px; }
                .b-nav img { height: 28px; }
            }
        </style>

        <div class="maze-wrapper">
            <div class="maze-area">
                <div class="maze-grid" id="maze-container">
                    ${mapaAtual.map((row, y) => row.map((cell, x) => {
                        let content = "";
                        if (cell === 1) content = `<img src="${JOGO_CONFIG.caminhoImg}${cat.obstaculo}" class="wall">`;
                        else if (x === tamanhoGrelha-1 && y === tamanhoGrelha-1) content = `<img id="target-img" src="${JOGO_CONFIG.caminhoImg}${cat.objetivo}" class="goal">`;
                        return `<div class="maze-cell" id="cell-${x}-${y}">${content}</div>`;
                    }).join('')).join('')}
                    <div class="hero-p" id="player" style="left:${posPersonagem.x*(100/tamanhoGrelha)}%; top:${posPersonagem.y*(100/tamanhoGrelha)}%;"><img src="${JOGO_CONFIG.caminhoImg}${cat.personagem}"></div>
                </div>
            </div>

            <div class="maze-controls-row">
                <div class="b-nav" onclick="tentarMover(-1, 0)"><img src="${imgSeta}" class="rot-left"></div>
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
    const btnLuz = document.querySelector('.badge-timer img');
    if(btnLuz) btnLuz.style.opacity = "0.3";

    const caminho = calcularCaminho(posPersonagem, {x: tamanhoGrelha-1, y: tamanhoGrelha-1});
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
        setTimeout(() => { ajudaDisponivel = true; if(btnLuz) btnLuz.style.opacity = "1"; }, 2000);
    }, 2000);
};

function calcularCaminho(start, end) {
    let queue = [[start]];
    let visited = new Set([`${start.x},${start.y}`]);
    while (queue.length > 0) {
        let path = queue.shift();
        let current = path[path.length - 1];
        if (current.x === end.x && current.y === end.y) return path;
        const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
        for (let [dx, dy] of dirs) {
            let nx = current.x + dx, ny = current.y + dy;
            if (nx >= 0 && nx < tamanhoGrelha && ny >= 0 && ny < tamanhoGrelha && mapaAtual[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
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

    if (dx > 0) heroImg.style.transform = "scaleX(-1)"; 
    else if (dx < 0) heroImg.style.transform = "scaleX(1)";

    if (nx < 0 || nx >= tamanhoGrelha || ny < 0 || ny >= tamanhoGrelha || mapaAtual[ny][nx] === 1) {
        somErro.play(); erros++; document.getElementById('miss-val').innerText = erros;
        hero.classList.add('shake'); setTimeout(() => hero.classList.remove('shake'), 300); return;
    }
    posPersonagem.x = nx; posPersonagem.y = ny;
    hero.style.left = `${nx * (100/tamanhoGrelha)}%`;
    hero.style.top = `${ny * (100/tamanhoGrelha)}%`;
    if (nx === tamanhoGrelha - 1 && ny === tamanhoGrelha - 1) {
        const target = document.getElementById('target-img'); if(target) target.style.opacity = "0";
        somAcerto.play(); acertos++; document.getElementById('hits-val').innerText = acertos;
        jogoAtivo = false;
        setTimeout(() => { indicePergunta++; proximaRonda(); jogoAtivo = true; }, 800);
    }
};

function finalizarJogo() {
    jogoAtivo = false;
    somVitoria.play();
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <style>
                .res-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 450px; }
                .res-trophy { height: 120px; margin-bottom: 10px; object-fit: contain; }
                .res-msg { color: var(--primary-blue); font-weight: 900; font-size: 2.2rem; margin-bottom: 25px; text-align: center; line-height: 1; }
                .res-stats-row { display: flex; gap: 15px; margin-bottom: 30px; width: 100%; justify-content: center; }
                .stat-box { background: white; border-radius: 25px; width: 105px; height: 105px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .stat-val { font-size: 1.8rem; font-weight: 900; margin-bottom: 2px; }
                .stat-lab { font-size: 0.65rem; font-weight: 900; color: #88a; text-transform: uppercase; letter-spacing: 0.5px; }
                .res-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 320px; }
                .btn-res { height: 60px; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; font-weight: 900; font-size: 1.1rem; text-decoration: none; cursor: pointer; transition: 0.2s; border: none; }
                .btn-redo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
                .btn-redo:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }
                .btn-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); }
                .btn-exit { background: #e2e8f0; color: #64748b; }
            </style>
            <div class="res-container">
                <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" class="res-trophy">
                <h1 class="res-msg">${rel.titulo}</h1>
                <div class="res-stats-row">
                    <div class="stat-box"><span class="stat-val" style="color: #7ed321;">${acertos}</span><span class="stat-lab">Certos</span></div>
                    <div class="stat-box"><span class="stat-val" style="color: #ff5e5e;">${erros}</span><span class="stat-lab">Errados</span></div>
                    <div class="stat-box"><span class="stat-val" style="color: #ff9f43;">${ajudasUtilizadas}</span><span class="stat-lab">Ajudas</span></div>
                </div>
                <div class="res-actions">
                    <button class="btn-res btn-redo" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                    <button class="btn-res btn-outline" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                    <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-exit"><i class="fas fa-sign-out-alt"></i> SAIR</a>
                </div>
            </div>
        </div>
    `;
}
