let categoriaAtual = "nivel1";
let rondaAtual = 1;
let acertos = 0;
let erros = 0;

// Inicializa a lógica base
window.startLogic = function() {
    rondaAtual = 1;
    acertos = 0;
    erros = 0;
    atualizarPlacar();
};

// Inicia o ecrã de jogo
window.initGame = function() {
    renderizarEstruturaLanterna();
    proximaRonda();
};

function selecionarCategoria(id) {
    categoriaAtual = id;
}

function renderizarEstruturaLanterna() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <style>
            #night-zone {
                position: relative; width: 100%; height: 100%;
                background: #020617; overflow: hidden; cursor: none; border-radius: 20px;
            }
            .spotlight-mask {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: black; pointer-events: none; z-index: 10;
                --x: 50%; --y: 50%;
                mask-image: radial-gradient(circle 100px at var(--x) var(--y), transparent 0%, black 100%);
                -webkit-mask-image: radial-gradient(circle 100px at var(--x) var(--y), transparent 0%, black 100%);
            }
            .animal-item {
                position: absolute; width: 80px; height: 80px;
                object-fit: contain; cursor: pointer; transition: transform 0.2s; z-index: 5;
            }
            #instrucao-ronda {
                position: absolute; top: 15px; left: 50%; transform: translateX(-50%);
                background: rgba(255,255,255,0.95); padding: 8px 20px;
                border-radius: 30px; color: #333; font-weight: 900; z-index: 20;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3); pointer-events: none;
            }
        </style>
        <div id="night-zone">
            <div id="instrucao-ronda">Carregando...</div>
            <div class="spotlight-mask" id="lanterna"></div>
        </div>
    `;

    const zone = document.getElementById('night-zone');
    const lanterna = document.getElementById('lanterna');

    const mover = (e) => {
        const rect = zone.getBoundingClientRect();
        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        lanterna.style.setProperty('--x', `${x}px`);
        lanterna.style.setProperty('--y', `${y}px`);
    };

    zone.addEventListener('mousemove', mover);
    zone.addEventListener('touchmove', mover);
}

function proximaRonda() {
    const config = JOGO_CONFIG.categorias[categoriaAtual];

    if (rondaAtual > config.totalRondas) {
        finalizarJogo();
        return;
    }

    const zone = document.getElementById('night-zone');
    zone.querySelectorAll('.animal-item').forEach(a => a.remove());
    
    document.getElementById('instrucao-ronda').innerText = `Encontra um ANIMAL DOMÉSTICO!`;
    atualizarPlacar();

    // 1. Criar Animal Alvo (Correcto)
    const animalCerto = config.alvos[Math.floor(Math.random() * config.alvos.length)];
    criarElemento(animalCerto, config.pastaAlvos, true);

    // 2. Criar Distrações (Errados)
    for (let i = 0; i < config.quantidadeDistracoes; i++) {
        const animalErrado = config.distracoes[Math.floor(Math.random() * config.distracoes.length)];
        criarElemento(animalErrado, config.pastaDistracoes, false);
    }
}

function criarElemento(imgNome, pasta, isCorrect) {
    const zone = document.getElementById('night-zone');
    const img = document.createElement('img');
    img.src = JOGO_CONFIG.caminhoImg + pasta + imgNome;
    img.className = 'animal-item';
    
    // Posições aleatórias seguras
    img.style.left = (5 + Math.random() * 80) + "%";
    img.style.top = (20 + Math.random() * 65) + "%";

    img.onclick = (e) => {
        e.stopPropagation();
        if (isCorrect) {
            tocarSom(JOGO_CONFIG.sons.acerto);
            acertos++;
            rondaAtual++;
            // Pequeno efeito visual de acerto
            img.style.transform = "scale(1.5)";
            setTimeout(proximaRonda, 400);
        } else {
            tocarSom(JOGO_CONFIG.sons.erro);
            erros++;
            img.style.filter = "grayscale(1) opacity(0.3)";
            img.style.pointerEvents = "none";
        }
        atualizarPlacar();
    };

    zone.appendChild(img);
}

function atualizarPlacar() {
    const config = JOGO_CONFIG.categorias[categoriaAtual];
    if(document.getElementById('hits-val')) document.getElementById('hits-val').innerText = acertos;
    if(document.getElementById('miss-val')) document.getElementById('miss-val').innerText = erros;
    if(document.getElementById('round-val')) document.getElementById('round-val').innerText = `${rondaAtual} / ${config.totalRondas}`;
    if(document.getElementById('timer-val')) document.getElementById('timer-val').innerText = "NOITE";
}

function tocarSom(url) {
    new Audio(url).play().catch(() => {});
}

function finalizarJogo() {
    const total = acertos + erros;
    const perc = Math.round((acertos / total) * 100) || 0;
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const scrResult = document.getElementById('scr-result');
    scrResult.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    scrResult.innerHTML = `
        <div class="screen-box" style="text-align:center; padding: 20px; background: white;">
            <h2 style="font-size:2rem; color:var(--primary-blue); margin-bottom:10px;">${rank.titulo}</h2>
            <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:150px; margin-bottom:20px;">
            <p style="font-size:1.2rem; font-weight:800; color:var(--text-grey);">Nível: ${JOGO_CONFIG.categorias[categoriaAtual].nome}</p>
            <p style="font-size:1.1rem; color:var(--text-grey);">Acertos: ${acertos} | Erros: ${erros}</p>
            <button class="btn-jogar-stretch" onclick="goToIntro()" style="margin-top:20px; width:220px; align-self:center;">VOLTAR AO INÍCIO</button>
        </div>
    `;
    tocarSom(JOGO_CONFIG.sons.vitoria);
}

window.gerarIntroJogo = function() {
    return JOGO_CONFIG.categorias[categoriaAtual].descricao;
};
