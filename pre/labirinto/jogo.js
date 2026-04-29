let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "natureza";
let mapaAtual = [];
let posPersonagem = { x: 0, y: 0 };
let tamanhoGrelha = 6;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.addEventListener('keydown', (e) => {
    if (!document.getElementById('scr-game').classList.contains('active')) return;
    if (e.key === "ArrowUp") tentarMover(0, -1);
    if (e.key === "ArrowDown") tentarMover(0, 1);
    if (e.key === "ArrowLeft") tentarMover(-1, 0);
    if (e.key === "ArrowRight") tentarMover(1, 0);
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
});

window.startLogic = function() {
    if (!JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = Object.keys(JOGO_CATEGORIAS)[0];
    tamanhoGrelha = JOGO_CATEGORIAS[categoriaAtual].tamanho;
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Leva o teu amigo ao objetivo sem bater nas paredes!";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    tamanhoGrelha = JOGO_CATEGORIAS[key].tamanho;
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div class="tut-maze-box">
            <div class="tut-maze-grid">
                <div class="tut-cell"></div><div class="tut-cell"></div><div class="tut-cell">🎯</div>
                <div class="tut-cell"></div><div class="tut-cell" style="background:#eee"></div><div class="tut-cell"></div>
                <div class="tut-cell"></div><div class="tut-cell"></div><div class="tut-cell"></div>
                <div id="tut-hero" class="tut-hero">🐝</div>
            </div>
            <div class="tut-keys">
                <div class="tut-key">▲</div>
                <div style="display:flex; gap:4px;">
                    <div class="tut-key">◀</div><div class="tut-key">▼</div><div id="tut-key-right" class="tut-key">▶</div>
                </div>
            </div>
            <div id="tut-hand" class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-maze-box { position: relative; display: flex; align-items: center; gap: 20px; background: white; padding: 15px; border-radius: 20px; border: 2px solid #eee; }
            .tut-maze-grid { display: grid; grid-template-columns: repeat(3, 30px); grid-template-rows: repeat(3, 30px); gap: 2px; background: #ddd; position: relative; }
            .tut-cell { background: white; display: flex; align-items: center; justify-content: center; font-size: 14px; }
            .tut-hero { position: absolute; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 20px; transition: 0.5s; top: 64px; left: 0; }
            .tut-keys { display: flex; flex-direction: column; align-items: center; gap: 4px; opacity: 0.7; }
            .tut-key { width: 22px; height: 22px; background: #eee; border-radius: 4px; font-size: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; }
            .tut-hand { position: absolute; font-size: 35px; z-index: 10; animation: tutMoveHand 3s infinite; }
            @keyframes tutMoveHand { 0% { transform: translate(110px, 45px); } 20% { transform: translate(110px, 45px) scale(0.8); } 40% { transform: translate(110px, 45px); } }
            #tut-hero { animation: tutMoveHero 3s infinite; }
            @keyframes tutMoveHero { 0%, 20% { left: 0; } 40%, 100% { left: 32px; } }
            #tut-key-right { animation: tutPressKey 3s infinite; }
            @keyframes tutPressKey { 0%, 15% { background: #eee; } 20%, 35% { background: var(--primary-blue); color: white; } 40%, 100% { background: #eee; } }
        </style>
    `;
}

window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    proximaRonda();
};

function iniciarCronometro() {
    tempoInicio = Date.now();
    clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const min = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const seg = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${min}:${seg}`;
    }, 1000);
}

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
            maze[cy + (ny - cy) / 2][cx + (nx - cx) / 2] = 0;
            maze[ny][nx] = 0;
            stack.push([nx, ny]);
        } else { stack.pop(); }
    }
    // DIFICULDADE: Menos atalhos extras para obrigar a usar o caminho real
    for(let i=0; i < dim/2; i++) {
        let rx = Math.floor(Math.random()*(dim-2))+1;
        let ry = Math.floor(Math.random()*(dim-2))+1;
        maze[ry][rx] = 0;
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
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;
    container.innerHTML = `
        <style>
            .maze-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: center; padding: 5px; box-sizing: border-box; overflow: hidden; }
            .maze-area { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0; }
            .maze-grid { display: grid; grid-template-columns: repeat(${tamanhoGrelha}, 1fr); grid-template-rows: repeat(${tamanhoGrelha}, 1fr); height: 95%; aspect-ratio: 1/1; background: #fff; border: 4px solid #eee; border-radius: 15px; position: relative; }
            .maze-cell { border: 1px solid #f9f9f9; display: flex; align-items: center; justify-content: center; }
            .wall { width: 80%; height: 80%; object-fit: contain; }
            .goal { width: 75%; height: 75%; object-fit: contain; animation: bounce 2s infinite; transition: opacity 0.3s; }
            .hero-p { position: absolute; width: ${100/tamanhoGrelha}%; height: ${100/tamanhoGrelha}%; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease-out; z-index: 10; }
            .hero-p img { width: 85%; height: 85%; object-fit: contain; }
            .hero-p.shake { animation: shake 0.3s; }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
            .maze-controls { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px; flex-shrink: 0; }
            .c-row { display: flex; gap: 8px; }
            .b-dir { width: 65px; height: 55px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 26px; color: var(--primary-blue); cursor: pointer; box-shadow: 0 4px 0 #ddd; border: 2px solid #eee; user-select: none; }
            .b-dir:active { transform: translateY(2px); box-shadow: none; }
            @media (orientation: landscape) and (max-height: 550px) { .maze-wrapper { flex-direction: row; gap: 20px; } .b-dir { width: 55px; height: 45px; } }
        </style>
        <div class="maze-wrapper">
            <div class="maze-area">
                <div class="maze-grid">
                    ${mapaAtual.map((row, y) => row.map((cell, x) => {
                        let content = "";
                        if (cell === 1) content = `<img src="${JOGO_CONFIG.caminhoImg}${cat.obstaculo}" class="wall">`;
                        else if (x === tamanhoGrelha-1 && y === tamanhoGrelha-1) content = `<img id="target-img" src="${JOGO_CONFIG.caminhoImg}${cat.objetivo}" class="goal">`;
                        return `<div class="maze-cell">${content}</div>`;
                    }).join('')).join('')}
                    <div class="hero-p" id="player" style="left:${posPersonagem.x*(100/tamanhoGrelha)}%; top:${posPersonagem.y*(100/tamanhoGrelha)}%;">
                        <img src="${JOGO_CONFIG.caminhoImg}${cat.personagem}">
                    </div>
                </div>
            </div>
            <div class="maze-controls">
                <div class="c-row"><div class="b-dir" onclick="tentarMover(0, -1)">▲</div></div>
                <div class="c-row">
                    <div class="b-dir" onclick="tentarMover(-1, 0)">◀</div>
                    <div class="b-dir" style="background:#f8f8f8; color:#999;" onclick="proximaRonda()"><i class="fas fa-sync-alt" style="font-size:18px;"></i></div>
                    <div class="b-dir" onclick="tentarMover(1, 0)">▶</div>
                </div>
                <div class="c-row"><div class="b-dir" onclick="tentarMover(0, 1)">▼</div></div>
            </div>
        </div>
    `;
}

window.tentarMover = function(dx, dy) {
    let nx = posPersonagem.x + dx, ny = posPersonagem.y + dy;
    const hero = document.getElementById('player');
    if (nx < 0 || nx >= tamanhoGrelha || ny < 0 || ny >= tamanhoGrelha || mapaAtual[ny][nx] === 1) {
        somErro.play();
        hero.classList.add('shake');
        setTimeout(() => hero.classList.remove('shake'), 300);
        return;
    }
    posPersonagem.x = nx; posPersonagem.y = ny;
    hero.style.left = `${nx * (100/tamanhoGrelha)}%`;
    hero.style.top = `${ny * (100/tamanhoGrelha)}%`;

    if (nx === tamanhoGrelha - 1 && ny === tamanhoGrelha - 1) {
        // AQUI: Faz o objetivo desaparecer
        const target = document.getElementById('target-img');
        if(target) target.style.opacity = "0";

        somAcerto.play(); acertos++;
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
    }
};

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:10px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-container">
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:260px;">
                <button class="res-btn res-btn-p" onclick="location.reload()">Jogar de Novo</button>
                <button class="res-btn res-btn-o" onclick="openRDMenu()">Outro Tema</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="res-btn res-btn-m">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
