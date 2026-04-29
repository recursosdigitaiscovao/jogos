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

// === 1. CONTROLO POR TECLADO ===
window.addEventListener('keydown', (e) => {
    if (!document.getElementById('scr-game').classList.contains('active')) return;
    if (e.key === "ArrowUp") tentarMover(0, -1);
    if (e.key === "ArrowDown") tentarMover(0, 1);
    if (e.key === "ArrowLeft") tentarMover(-1, 0);
    if (e.key === "ArrowRight") tentarMover(1, 0);
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
});

// === 2. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = Object.keys(JOGO_CATEGORIAS)[0];
    tamanhoGrelha = JOGO_CATEGORIAS[categoriaAtual].tamanho;
    
    document.getElementById('intro-instr').innerText = "Leva o teu amigo ao objetivo sem bater nas paredes!";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    tamanhoGrelha = JOGO_CATEGORIAS[key].tamanho;
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="position:relative; display:flex; align-items:center; gap:20px; background:white; padding:15px; border-radius:20px; border:2px solid #eee;">
            <div style="display:grid; grid-template-columns:repeat(3, 30px); gap:2px; background:#ddd; position:relative;">
                <div style="background:white; width:30px; height:30px;"></div><div style="background:white; width:30px; height:30px;"></div><div style="background:white; width:30px; height:30px; display:flex; align-items:center; justify-content:center;">🎯</div>
                <div style="background:white; width:30px; height:30px;"></div><div style="background:#eee; width:30px; height:30px;"></div><div style="background:white; width:30px; height:30px;"></div>
                <div style="background:white; width:30px; height:30px;"></div><div style="background:white; width:30px; height:30px;"></div><div style="background:white; width:30px; height:30px;"></div>
                <div id="tut-hero" style="position:absolute; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:20px; transition:0.5s; top:64px; left:0;">🐝</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px; opacity:0.7;">
                <div style="width:22px; height:22px; background:#eee; border-radius:4px; border:1px solid #ddd;"></div>
                <div style="display:flex; gap:4px;">
                    <div style="width:22px; height:22px; background:#eee; border-radius:4px; border:1px solid #ddd;"></div><div style="width:22px; height:22px; background:#eee; border-radius:4px; border:1px solid #ddd;"></div><div id="tut-key-right" style="width:22px; height:22px; background:#eee; border-radius:4px; border:1px solid #ddd;">▶</div>
                </div>
            </div>
            <div id="tut-hand" style="position:absolute; font-size:35px; z-index:10; animation: tutHandMove 3s infinite;">☝️</div>
        </div>
        <style>
            @keyframes tutHandMove { 0%, 100% { transform:translate(110px, 45px); } 50% { transform:translate(110px, 45px) scale(0.8); } }
            #tut-hero { animation: tutHeroMove 3s infinite; }
            @keyframes tutHeroMove { 0%, 20% { left:0; } 40%, 100% { left:32px; } }
            #tut-key-right { animation: tutKeyPress 3s infinite; }
            @keyframes tutKeyPress { 0%, 15% { background:#eee; } 20%, 35% { background:var(--primary-blue); color:white; } 40%, 100% { background:#eee; } }
        </style>
    `;
}

// === 3. LÓGICA DO JOGO ===
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
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;
    container.innerHTML = `
        <style>
            .maze-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: center; padding: 10px; box-sizing: border-box; overflow: hidden; }
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
            .b-dir { width: 65px; height: 55px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 26px; color: var(--primary-blue); cursor: pointer; box-shadow: 0 4px 0 #ddd; border: 2px solid #eee; }
            .b-dir:active { transform: translateY(2px); box-shadow: none; }
            @media (orientation: landscape) and (max-height: 550px) { .maze-wrapper { flex-direction: row; gap: 20px; } .b-dir { width: 55px; height: 45px; } }
        </style>
        <div class="maze-wrapper">
            <div class="maze-area"><div class="maze-grid">
                ${mapaAtual.map((row, y) => row.map((cell, x) => {
                    let content = "";
                    if (cell === 1) content = `<img src="${JOGO_CONFIG.caminhoImg}${cat.obstaculo}" class="wall">`;
                    else if (x === tamanhoGrelha-1 && y === tamanhoGrelha-1) content = `<img id="target-img" src="${JOGO_CONFIG.caminhoImg}${cat.objetivo}" class="goal">`;
                    return `<div class="maze-cell">${content}</div>`;
                }).join('')).join('')}
                <div class="hero-p" id="player" style="left:${posPersonagem.x*(100/tamanhoGrelha)}%; top:${posPersonagem.y*(100/tamanhoGrelha)}%;"><img src="${JOGO_CONFIG.caminhoImg}${cat.personagem}"></div>
            </div></div>
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
        somErro.play(); hero.classList.add('shake'); setTimeout(() => hero.classList.remove('shake'), 300); return;
    }
    posPersonagem.x = nx; posPersonagem.y = ny;
    hero.style.left = `${nx * (100/tamanhoGrelha)}%`;
    hero.style.top = `${ny * (100/tamanhoGrelha)}%`;
    if (nx === tamanhoGrelha - 1 && ny === tamanhoGrelha - 1) {
        const target = document.getElementById('target-img'); if(target) target.style.opacity = "0";
        somAcerto.play(); acertos++; document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
    }
};

// === 4. ECRÃ DE RESULTADOS (CORRIGIDO) ===
function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 

    resScreen.innerHTML = `
        <style>
            .res-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; }
            .res-stats { display: flex; gap: 12px; width: 100%; max-width: 320px; margin: 15px 0; }
            .res-card { background: white; border-radius: 18px; padding: 12px; flex: 1; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; }
            .res-val { display: block; font-size: 24px; font-weight: 900; color: var(--primary-blue); line-height: 1.1; }
            .res-lab { font-size: 10px; font-weight: 800; color: #88a; text-transform: uppercase; letter-spacing: 0.5px; }
            
            .res-btns { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px; }
            .btn-f { padding: 16px; border-radius: 20px; font-weight: 900; font-size: 15px; cursor: pointer; border: none; text-align: center; text-decoration: none; text-transform: uppercase; transition: 0.2s; }
            
            .btn-f-primary { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-f-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); box-shadow: 0 6px 0 var(--primary-blue); padding: 13px; }
            .btn-f-muted { background: #dce4ee; color: #5d7082; box-shadow: 0 6px 0 #b8c5d4; }
            
            .btn-f:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }
        </style>
        <div class="res-container">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:25%; min-height:90px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color: var(--primary-blue); font-weight:900; font-size:1.8rem; margin-bottom:5px; text-align:center;">${rel.titulo}</h2>
            
            <div class="res-stats">
                <div class="res-card"><span class="res-val">${acertos} / 10</span><span class="res-lab">Acertos</span></div>
                <div class="res-card"><span class="res-val">${tempoFinal}</span><span class="res-lab">Tempo</span></div>
            </div>

            <div class="res-btns">
                <button class="btn-f btn-f-primary" onclick="location.reload()">Jogar de Novo</button>
                <button class="btn-f btn-f-outline" onclick="openRDMenu()">Outro Tema / Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-f btn-f-muted">Escolher outro jogo</a>
            </div>
        </div>
    `;

    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
