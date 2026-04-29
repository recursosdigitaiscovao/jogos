let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "natureza";
let posPersonagem = { x: 0, y: 0 };
let mapaAtual = [];
let tamanhoAtual = 6;

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
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
});

// === 2. GERADOR DE LABIRINTO (Garante caminho sempre possível) ===
function gerarLabirinto(dim) {
    let maze = Array.from({ length: dim }, () => Array(dim).fill(1));
    let stack = [[0, 0]];
    maze[0][0] = 0;

    while (stack.length > 0) {
        let [cx, cy] = stack[stack.length - 1];
        let neighbors = [];

        [[0, -2], [0, 2], [-2, 0], [2, 0]].forEach(([dx, dy]) => {
            let nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < dim && ny >= 0 && ny < dim && maze[ny][nx] === 1) {
                neighbors.push([nx, ny]);
            }
        });

        if (neighbors.length > 0) {
            let [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[cy + (ny - cy) / 2][cx + (nx - cx) / 2] = 0;
            maze[ny][nx] = 0;
            stack.push([nx, ny]);
        } else {
            stack.pop();
        }
    }
    // Abrir algumas paredes extras para facilitar (Pre-escolar)
    for(let i=0; i<dim; i++) {
        let rx = Math.floor(Math.random()*(dim-2))+1;
        let ry = Math.floor(Math.random()*(dim-2))+1;
        maze[ry][rx] = 0;
    }
    maze[dim-1][dim-1] = 0; // Garantir fim livre
    return maze;
}

// === 3. LÓGICA DO JOGO ===
window.startLogic = function() {
    categoriaAtual = Object.keys(JOGO_CATEGORIAS)[0];
    setTimeout(criarAnimacaoTutorial, 100);
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    carregarNivel();
};

function carregarNivel() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    tamanhoAtual = JOGO_CATEGORIAS[categoriaAtual].tamanho;
    mapaAtual = gerarLabirinto(tamanhoAtual);
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
            .maze-area { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0; position: relative; }
            .maze-grid { 
                display: grid; grid-template-columns: repeat(${tamanhoAtual}, 1fr); grid-template-rows: repeat(${tamanhoAtual}, 1fr);
                height: 90%; aspect-ratio: 1/1; background: #fff; border: 4px solid #eee; border-radius: 15px; position: relative;
            }
            .maze-cell { border: 1px solid #f8f8f8; display: flex; align-items: center; justify-content: center; position: relative; }
            .wall { width: 85%; height: 85%; object-fit: contain; transition: 0.2s; }
            .wall.hit { transform: scale(1.2); filter: sepia(1) saturate(10) hue-rotate(-50deg); } /* Feedback visual parede */
            .goal { width: 70%; height: 70%; object-fit: contain; animation: bounce 2s infinite; }
            .hero { 
                position: absolute; width: ${100/tamanhoAtual}%; height: ${100/tamanhoAtual}%;
                display: flex; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28); z-index: 10;
            }
            .hero img { width: 85%; height: 85%; object-fit: contain; }
            .hero.shake { animation: shake 0.4s; }
            
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
            
            .maze-controls { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px; flex-shrink: 0; }
            .c-row { display: flex; gap: 10px; }
            .btn-dir { width: 65px; height: 55px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--primary-blue); cursor: pointer; box-shadow: 0 4px 0 #ddd; border: 2px solid #eee; user-select: none; }
            .btn-dir:active { transform: translateY(2px); box-shadow: none; }

            @media (orientation: landscape) and (max-height: 550px) {
                .maze-wrapper { flex-direction: row; gap: 20px; }
                .btn-dir { width: 55px; height: 45px; }
            }
        </style>

        <div class="maze-wrapper">
            <div class="maze-area">
                <div class="maze-grid">
                    ${mapaAtual.map((row, y) => row.map((cell, x) => {
                        let content = "";
                        if (cell === 1) content = `<img src="${JOGO_CONFIG.caminhoImg}${cat.obstaculo}" class="wall" id="w-${x}-${y}">`;
                        else if (x === tamanhoAtual-1 && y === tamanhoAtual-1) content = `<img src="${JOGO_CONFIG.caminhoImg}${cat.objetivo}" class="goal">`;
                        return `<div class="maze-cell">${content}</div>`;
                    }).join('')).join('')}
                    <div class="hero" id="hero-p" style="left:${posPersonagem.x*(100/tamanhoAtual)}%; top:${posPersonagem.y*(100/tamanhoAtual)}%;">
                        <img src="${JOGO_CONFIG.caminhoImg}${cat.personagem}">
                    </div>
                </div>
            </div>
            <div class="maze-controls">
                <div class="c-row"><div class="btn-dir" onclick="tentarMover(0, -1)">▲</div></div>
                <div class="c-row">
                    <div class="btn-dir" onclick="tentarMover(-1, 0)">◀</div>
                    <div class="btn-dir" onclick="carregarNivel()"><i class="fas fa-sync-alt" style="font-size:18px;"></i></div>
                    <div class="btn-dir" onclick="tentarMover(1, 0)">▶</div>
                </div>
                <div class="c-row"><div class="btn-dir" onclick="tentarMover(0, 1)">▼</div></div>
            </div>
        </div>
    `;
}

window.tentarMover = function(dx, dy) {
    let nx = posPersonagem.x + dx, ny = posPersonagem.y + dy;
    const heroEl = document.getElementById('hero-p');

    // Bateu numa parede ou limite
    if (nx < 0 || nx >= tamanhoAtual || ny < 0 || ny >= tamanhoAtual || mapaAtual[ny][nx] === 1) {
        somErro.play();
        heroEl.classList.add('shake');
        if(mapaAtual[ny] && mapaAtual[ny][nx] === 1) {
            const wall = document.getElementById(`w-${nx}-${ny}`);
            if(wall) wall.classList.add('hit');
        }
        setTimeout(() => { 
            heroEl.classList.remove('shake'); 
            document.querySelectorAll('.wall').forEach(w => w.classList.remove('hit'));
        }, 400);
        return;
    }

    // Movimento válido
    posPersonagem.x = nx; posPersonagem.y = ny;
    heroEl.style.left = `${nx * (100/tamanhoAtual)}%`;
    heroEl.style.top = `${ny * (100/tamanhoAtual)}%`;

    // Chegou ao fim
    if (nx === tamanhoAtual - 1 && ny === tamanhoAtual - 1) {
        somAcerto.play();
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; carregarNivel(); }, 800);
    }
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
                <div class="res-stat-card"><span class="res-stat-val">${acertos}</span><span class="res-stat-lab">Níveis</span></div>
                <div class="res-stat-card"><span class="res-stat-val">${tempo}</span><span class="res-stat-lab">Tempo</span></div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;">
                <button class="res-btn res-btn-p" onclick="location.reload()">Jogar de Novo</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="res-btn res-btn-m">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `<div style="font-size:50px; animation: bounce 2s infinite;">🐝 ➡️ 🎯</div>`;
}
