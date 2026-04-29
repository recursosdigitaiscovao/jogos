let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "natureza";
let posPersonagem = { x: 0, y: 0 };
let nivelAtual = null;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO E TUTORIAL ===
window.startLogic = function() {
    const primeiraCat = Object.keys(JOGO_CATEGORIAS)[0];
    if (!categoriaAtual) categoriaAtual = primeiraCat;
    selecionarCategoria(categoriaAtual);
    
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Usa as setas para levar o amigo até ao seu objetivo! Cuidado com os obstáculos!";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    // O jogo rodará os níveis disponíveis da categoria (se tiver menos de 10, repete)
    const itens = JOGO_CATEGORIAS[key].itens;
    perguntas = [];
    for(let i=0; i<10; i++) {
        perguntas.push(itens[i % itens.length]);
    }
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;

    container.innerHTML = `
        <div class="tut-lab">
            <div class="tut-grid">
                <div class="tut-c"></div><div class="tut-c"></div>
                <div class="tut-c"></div><div class="tut-c">🎯</div>
                <div id="tut-hero" class="tut-p">🐝</div>
            </div>
            <div class="tut-controls">
                <div class="tut-btn">▲</div>
                <div style="display:flex; gap:5px;">
                    <div class="tut-btn">◀</div><div class="tut-btn">▼</div><div id="tut-key-right" class="tut-btn">▶</div>
                </div>
            </div>
            <div id="tut-hand" class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-lab { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; background: #fff; padding: 15px; border-radius: 20px; border: 2px solid #eee; }
            .tut-grid { display: grid; grid-template-columns: repeat(2, 40px); grid-template-rows: repeat(2, 40px); gap: 2px; background: #eee; position: relative; }
            .tut-c { background: white; display: flex; align-items: center; justify-content: center; font-size: 20px; }
            .tut-p { position: absolute; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 25px; transition: 0.5s; top:0; left:0; }
            .tut-controls { display: flex; flex-direction: column; align-items: center; gap: 2px; opacity: 0.5; }
            .tut-btn { width: 25px; height: 25px; background: #ccc; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; }
            .tut-hand { position: absolute; font-size: 40px; animation: moveMazeHand 3s infinite; z-index: 10; }
            @keyframes moveMazeHand {
                0% { transform: translate(40px, 100px); }
                30% { transform: translate(40px, 100px) scale(0.8); }
                50% { transform: translate(60px, 30px); }
                100% { transform: translate(60px, 30px); }
            }
            #tut-hero { animation: moveMazeHero 3s infinite; }
            @keyframes moveMazeHero { 0%, 30% { top: 0; left: 0; } 50%, 100% { top: 0; left: 42px; } }
            #tut-key-right { animation: blinkKey 3s infinite; }
            @keyframes blinkKey { 0%, 20% { background: #ccc; } 30%, 50% { background: var(--primary-blue); } 60%, 100% { background: #ccc; } }
        </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    carregarNivel();
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

function carregarNivel() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    
    nivelAtual = perguntas[indicePergunta];
    posPersonagem = { x: nivelAtual.inicio[0], y: nivelAtual.inicio[1] };
    
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const cat = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-between; padding: 10px; box-sizing: border-box; overflow: hidden; }
            
            /* GRELHA DO LABIRINTO */
            .maze-container { 
                flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0; 
                padding: 10px;
            }
            .maze-grid { 
                display: grid; 
                grid-template-columns: repeat(${nivelAtual.tamanho}, 1fr);
                grid-template-rows: repeat(${nivelAtual.tamanho}, 1fr);
                height: 95%; aspect-ratio: 1/1;
                background: #f0f4f0; border: 4px solid #ddd; border-radius: 15px;
                position: relative; overflow: hidden;
            }
            .maze-cell { border: 1px solid rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: center; position: relative; }
            .wall { background-size: contain; background-repeat: no-repeat; background-position: center; opacity: 0.9; width: 80%; height: 80%; }
            .goal { width: 80%; height: 80%; object-fit: contain; animation: bounce 2s infinite; }
            
            /* PERSONAGEM */
            .hero { 
                position: absolute; width: calc(100% / ${nivelAtual.tamanho}); height: calc(100% / ${nivelAtual.tamanho});
                display: flex; align-items: center; justify-content: center;
                transition: all 0.2s ease-out; z-index: 5;
            }
            .hero img { width: 85%; height: 85%; object-fit: contain; }

            /* CONTROLOS */
            .maze-controls { 
                display: flex; flex-direction: column; align-items: center; gap: 8px; 
                width: 100%; height: 160px; flex-shrink: 0; padding-bottom: 10px;
            }
            .ctrl-row { display: flex; gap: 10px; }
            .btn-dir { 
                width: 70px; height: 60px; background: white; border-radius: 15px;
                display: flex; align-items: center; justify-content: center;
                font-size: 30px; color: var(--primary-blue); cursor: pointer;
                box-shadow: 0 5px 0 #ddd; border: 2px solid #eee; transition: 0.1s;
            }
            .btn-dir:active { transform: translateY(3px); box-shadow: none; }
            .btn-dir.center { background: #eee; color: #aaa; cursor: default; box-shadow: none; }

            @media (max-width: 600px) {
                .maze-grid { height: 90%; }
                .maze-controls { height: 130px; }
                .btn-dir { width: 60px; height: 50px; font-size: 24px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="maze-container">
                <div class="maze-grid" id="maze">
                    ${gerarCelulas()}
                    <div class="hero" id="hero-obj" style="left: ${posPersonagem.x * (100/nivelAtual.tamanho)}%; top: ${posPersonagem.y * (100/nivelAtual.tamanho)}%;">
                        <img src="${JOGO_CONFIG.caminhoImg}${cat.personagem}">
                    </div>
                </div>
            </div>

            <div class="maze-controls">
                <div class="ctrl-row">
                    <div class="btn-dir" onclick="tentarMover(0, -1)">▲</div>
                </div>
                <div class="ctrl-row">
                    <div class="btn-dir" onclick="tentarMover(-1, 0)">◀</div>
                    <div class="btn-dir" onclick="recomecarNivel()"><i class="fas fa-undo" style="font-size: 20px;"></i></div>
                    <div class="btn-dir" onclick="tentarMover(1, 0)">▶</div>
                </div>
                <div class="ctrl-row">
                    <div class="btn-dir" onclick="tentarMover(0, 1)">▼</div>
                </div>
            </div>
        </div>
    `;
}

function gerarCelulas() {
    const cat = JOGO_CATEGORIAS[categoriaAtual];
    let html = "";
    for (let y = 0; y < nivelAtual.tamanho; y++) {
        for (let x = 0; x < nivelAtual.tamanho; x++) {
            let conteudo = "";
            if (nivelAtual.mapa[y][x] === 1) {
                conteudo = `<div class="wall" style="background-image: url('${JOGO_CONFIG.caminhoImg}${cat.obstaculo}')"></div>`;
            } else if (x === nivelAtual.fim[0] && y === nivelAtual.fim[1]) {
                conteudo = `<img src="${JOGO_CONFIG.caminhoImg}${cat.objetivo}" class="goal">`;
            }
            html += `<div class="maze-cell">${conteudo}</div>`;
        }
    }
    return html;
}

window.tentarMover = function(dx, dy) {
    let nx = posPersonagem.x + dx;
    let ny = posPersonagem.y + dy;

    // Verificar limites
    if (nx < 0 || nx >= nivelAtual.tamanho || ny < 0 || ny >= nivelAtual.tamanho) {
        somErro.play(); return;
    }

    // Verificar parede
    if (nivelAtual.mapa[ny][nx] === 1) {
        somErro.play(); return;
    }

    // Mover
    posPersonagem.x = nx;
    posPersonagem.y = ny;
    
    const hero = document.getElementById('hero-obj');
    hero.style.left = `${nx * (100/nivelAtual.tamanho)}%`;
    hero.style.top = `${ny * (100/nivelAtual.tamanho)}%`;

    // Verificar vitória
    if (nx === nivelAtual.fim[0] && ny === nivelAtual.fim[1]) {
        vitoriaNivel();
    }
};

window.recomecarNivel = function() {
    posPersonagem = { x: nivelAtual.inicio[0], y: nivelAtual.inicio[1] };
    const hero = document.getElementById('hero-obj');
    hero.style.left = `${posPersonagem.x * (100/nivelAtual.tamanho)}%`;
    hero.style.top = `${posPersonagem.y * (100/nivelAtual.tamanho)}%`;
};

function vitoriaNivel() {
    // Bloquear controlos
    const btns = document.querySelectorAll('.btn-dir');
    btns.forEach(b => b.style.pointerEvents = 'none');

    acertos++;
    somAcerto.play();
    document.getElementById('hits-val').innerText = acertos;

    setTimeout(() => {
        indicePergunta++;
        carregarNivel();
    }, 1000);
}

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const totalP = 10;
    const perc = (acertos / totalP) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:10px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats-container" style="display:flex; gap:10px; width:100%; max-width:300px; margin-bottom:15px;">
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Níveis</span>
                </div>
                <div style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:260px;">
                <button class="res-btn res-btn-p" style="padding:14px; border-radius:15px; font-weight:900; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);" onclick="location.reload()">Jogar de Novo</button>
                <button class="res-btn res-btn-o" style="padding:11px; border-radius:15px; font-weight:900; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 5px 0 var(--primary-blue);" onclick="openRDMenu()">Outro Tema</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:14px; border-radius:15px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 5px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
