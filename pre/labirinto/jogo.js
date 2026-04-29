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

// === 1. CONTROLO POR TECLADO ===
window.addEventListener('keydown', function(e) {
    // Só move se o ecrã de jogo estiver ativo
    if (!document.getElementById('scr-game').classList.contains('active')) return;

    switch(e.key) {
        case "ArrowUp":    tentarMover(0, -1); e.preventDefault(); break;
        case "ArrowDown":  tentarMover(0, 1);  e.preventDefault(); break;
        case "ArrowLeft":  tentarMover(-1, 0); e.preventDefault(); break;
        case "ArrowRight": tentarMover(1, 0);  e.preventDefault(); break;
    }
});

// === 2. INICIALIZAÇÃO ===
window.startLogic = function() {
    const primeiraCat = Object.keys(JOGO_CATEGORIAS)[0];
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = primeiraCat;
    selecionarCategoria(categoriaAtual);
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Leva o teu amigo ao objetivo usando as setas ou o teclado! Não batas nas paredes!";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    const itens = JOGO_CATEGORIAS[key].itens;
    perguntas = [];
    for(let i=0; i<10; i++) { perguntas.push(itens[i % itens.length]); }
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; background:#fff; padding:10px; border-radius:15px; border:2px solid #eee;">
            <div style="display:grid; grid-template-columns:repeat(2, 35px); gap:2px; background:#eee; position:relative;">
                <div style="background:white; width:35px; height:35px;"></div><div style="background:white; width:35px; height:35px; display:flex; align-items:center; justify-content:center;">🎯</div>
                <div style="background:white; width:35px; height:35px;"></div><div style="background:white; width:35px; height:35px;"></div>
                <div id="tut-hero" style="position:absolute; width:35px; height:35px; display:flex; align-items:center; justify-content:center; font-size:20px; transition:0.5s; top:0; left:0;">🐝</div>
            </div>
            <div style="display:flex; gap:5px; opacity:0.6;">
                <div style="width:20px; height:20px; background:#ccc; border-radius:4px;"></div>
                <div style="width:20px; height:20px; background:var(--primary-blue); border-radius:4px; position:relative;">
                    <div style="position:absolute; font-size:30px; bottom:-25px; right:-15px; animation: tapM 2s infinite;">☝️</div>
                </div>
            </div>
        </div>
        <style>
            @keyframes tapM { 0%, 100% { transform:translate(0,0); } 50% { transform:translate(-5px,-10px); } }
            #tut-hero { animation: moveM 2s infinite; }
            @keyframes moveM { 0%, 20% { left:0; } 50%, 100% { left:37px; } }
        </style>
    `;
}

// === 3. LÓGICA DO JOGO ===
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
            .maze-wrapper { 
                display: flex; flex-direction: column; width: 100%; height: 100%; 
                align-items: center; justify-content: center; padding: 5px; box-sizing: border-box; overflow: hidden;
            }
            .maze-area { 
                flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0; 
            }
            .maze-grid { 
                display: grid; 
                grid-template-columns: repeat(${nivelAtual.tamanho}, 1fr);
                grid-template-rows: repeat(${nivelAtual.tamanho}, 1fr);
                height: 95%; aspect-ratio: 1/1;
                background: #fdfdfd; border: 4px solid #eee; border-radius: 15px;
                position: relative; box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
            }
            .maze-cell { border: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            
            /* Paredes um pouco mais pequenas */
            .wall-img { width: 80%; height: 80%; object-fit: contain; }
            
            .goal-img { width: 70%; height: 70%; object-fit: contain; animation: bounce 2s infinite; }
            
            .hero-p { 
                position: absolute; width: calc(100% / ${nivelAtual.tamanho}); height: calc(100% / ${nivelAtual.tamanho});
                display: flex; align-items: center; justify-content: center;
                transition: all 0.15s ease; z-index: 10;
            }
            .hero-p img { width: 85%; height: 85%; object-fit: contain; }

            .maze-controls { 
                display: flex; flex-direction: column; align-items: center; gap: 5px; 
                padding: 10px; flex-shrink: 0;
            }
            .c-row { display: flex; gap: 8px; }
            .b-dir { 
                width: 60px; height: 50px; background: white; border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
                font-size: 24px; color: var(--primary-blue); cursor: pointer;
                box-shadow: 0 4px 0 #ddd; border: 2px solid #eee;
            }
            .b-dir:active { transform: translateY(2px); box-shadow: none; }
            .b-undo { background: #f8f8f8; color: #999; font-size: 18px; }

            @media (orientation: landscape) and (max-height: 550px) {
                .maze-wrapper { flex-direction: row; padding: 10px; gap: 20px; }
                .maze-controls { height: 100%; justify-content: center; }
                .b-dir { width: 55px; height: 45px; }
            }
        </style>

        <div class="maze-wrapper">
            <div class="maze-area">
                <div class="maze-grid">
                    ${Array.from({length: nivelAtual.tamanho * nivelAtual.tamanho}).map((_, i) => {
                        const x = i % nivelAtual.tamanho;
                        const y = Math.floor(i / nivelAtual.tamanho);
                        let content = "";
                        if (nivelAtual.mapa[y][x] === 1) content = `<img src="${JOGO_CONFIG.caminhoImg}${cat.obstaculo}" class="wall-img">`;
                        else if (x === nivelAtual.fim[0] && y === nivelAtual.fim[1]) content = `<img src="${JOGO_CONFIG.caminhoImg}${cat.objetivo}" class="goal-img">`;
                        return `<div class="maze-cell">${content}</div>`;
                    }).join('')}
                    <div class="hero-p" id="player" style="left: ${posPersonagem.x * (100/nivelAtual.tamanho)}%; top: ${posPersonagem.y * (100/nivelAtual.tamanho)}%;">
                        <img src="${JOGO_CONFIG.caminhoImg}${cat.personagem}">
                    </div>
                </div>
            </div>

            <div class="maze-controls">
                <div class="c-row"><div class="b-dir" onclick="tentarMover(0, -1)">▲</div></div>
                <div class="c-row">
                    <div class="b-dir" onclick="tentarMover(-1, 0)">◀</div>
                    <div class="b-dir b-undo" onclick="resetPos()"><i class="fas fa-undo"></i></div>
                    <div class="b-dir" onclick="tentarMover(1, 0)">▶</div>
                </div>
                <div class="c-row"><div class="b-dir" onclick="tentarMover(0, 1)">▼</div></div>
            </div>
        </div>
    `;
}

window.tentarMover = function(dx, dy) {
    let nx = posPersonagem.x + dx;
    let ny = posPersonagem.y + dy;

    // Verificar se saiu dos limites ou bateu numa parede
    if (nx < 0 || nx >= nivelAtual.tamanho || ny < 0 || ny >= nivelAtual.tamanho || nivelAtual.mapa[ny][nx] === 1) {
        somErro.play(); return;
    }

    posPersonagem.x = nx;
    posPersonagem.y = ny;
    
    const p = document.getElementById('player');
    if(p) {
        p.style.left = `${nx * (100/nivelAtual.tamanho)}%`;
        p.style.top = `${ny * (100/nivelAtual.tamanho)}%`;
    }

    // Verificar se chegou ao objetivo
    if (nx === nivelAtual.fim[0] && ny === nivelAtual.fim[1]) {
        document.querySelectorAll('.b-dir').forEach(b => b.style.pointerEvents = 'none');
        acertos++; somAcerto.play();
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; carregarNivel(); }, 1000);
    }
};

window.resetPos = function() {
    posPersonagem = { x: nivelAtual.inicio[0], y: nivelAtual.inicio[1] };
    const p = document.getElementById('player');
    if(p) {
        p.style.left = `${posPersonagem.x * (100/nivelAtual.tamanho)}%`;
        p.style.top = `${posPersonagem.y * (100/nivelAtual.tamanho)}%`;
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
            <div class="res-stats-container" style="display:flex; gap:10px; width:100%; max-width:300px; margin-bottom:15px;">
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
                <button class="res-btn res-btn-p" style="padding:14px; border-radius:15px; font-weight:900; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);" onclick="location.reload()">Jogar de Novo</button>
                <button class="res-btn res-btn-o" style="padding:11px; border-radius:15px; font-weight:900; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 5px 0 var(--primary-blue);" onclick="openRDMenu()">Outro Tema</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:14px; border-radius:15px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 5px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
