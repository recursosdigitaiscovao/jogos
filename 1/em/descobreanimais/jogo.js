let categoriaAtual = "nivel1";
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let jogoAtivo = false;

// Inicialização (Chamado pelo sistema quando entra na intro)
window.startLogic = function() {
    rondaAtual = 1;
    acertos = 0;
    erros = 0;
    jogoAtivo = false;
    atualizarPlacar();
};

// Início Real (Botão JOGAR)
window.initGame = function() {
    jogoAtivo = true;
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
                background: #020617; overflow: hidden; cursor: none;
                border-radius: 25px; touch-action: none;
            }
            .spotlight-mask {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: black; pointer-events: none; z-index: 10;
                --x: 50%; --y: 50%;
                mask-image: radial-gradient(circle 100px at var(--x) var(--y), transparent 0%, rgba(0,0,0,0.98) 100%);
                -webkit-mask-image: radial-gradient(circle 100px at var(--x) var(--y), transparent 0%, rgba(0,0,0,0.98) 100%);
            }
            #flashlight-cursor {
                position: absolute; width: 200px; height: 200px;
                border: 2px solid rgba(255,255,255,0.3); border-radius: 50%;
                pointer-events: none; z-index: 11; transform: translate(-50%, -50%);
                box-shadow: 0 0 30px rgba(255,255,255,0.1);
            }
            .animal-item {
                position: absolute; width: 70px; height: 70px;
                object-fit: contain; cursor: pointer; z-index: 5;
                transition: transform 0.2s;
            }
            /* Estímulos Visuais */
            .feedback-icon {
                position: absolute; font-size: 40px; font-weight: bold;
                pointer-events: none; z-index: 30; transform: translate(-50%, -50%);
                animation: popFeedback 0.6s ease-out forwards;
            }
            @keyframes popFeedback {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -100%) scale(1.5); opacity: 1; }
                100% { transform: translate(-50%, -150%) scale(1); opacity: 0; }
            }
            .shake { animation: shakeAnim 0.3s ease-in-out; }
            @keyframes shakeAnim {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
            #instrucao-ronda {
                position: absolute; top: 15px; left: 50%; transform: translateX(-50%);
                background: white; padding: 6px 20px; border-radius: 20px;
                font-weight: 900; z-index: 20; color: #1a1a1a;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4); text-transform: uppercase;
            }
        </style>
        <div id="night-zone">
            <div id="instrucao-ronda">Procura o Animal Doméstico</div>
            <div id="flashlight-cursor"></div>
            <div class="spotlight-mask" id="lanterna"></div>
        </div>
    `;

    const zone = document.getElementById('night-zone');
    const lanterna = document.getElementById('lanterna');
    const cursor = document.getElementById('flashlight-cursor');

    const mover = (e) => {
        const rect = zone.getBoundingClientRect();
        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        lanterna.style.setProperty('--x', `${x}px`);
        lanterna.style.setProperty('--y', `${y}px`);
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
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
    atualizarPlacar();

    // Calcular Grelha
    const posicoes = calcularGrelha(zone, 1 + config.quantidadeDistracoes);

    // Animal Certo
    const alvo = config.alvos[Math.floor(Math.random() * config.alvos.length)];
    const posAlvo = posicoes.pop();
    criarAnimal(alvo, config.pastaAlvos, true, posAlvo);

    // Distrações
    for (let i = 0; i < config.quantidadeDistracoes; i++) {
        const fake = config.distracoes[Math.floor(Math.random() * config.distracoes.length)];
        const posFake = posicoes.pop();
        if(posFake) criarAnimal(fake, config.pastaDistracoes, false, posFake);
    }
}

function calcularGrelha(container, qtd) {
    const w = container.clientWidth;
    const h = container.clientHeight;
    const size = 90; // tamanho da célula
    const cols = Math.floor(w / size);
    const rows = Math.floor((h - 80) / size);
    
    let cells = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            cells.push({ x: c * size + size/2, y: (r * size + 80) + size/2 });
        }
    }
    return cells.sort(() => Math.random() - 0.5).slice(0, qtd);
}

function criarAnimal(imgNome, pasta, isCorrect, pos) {
    const zone = document.getElementById('night-zone');
    const img = document.createElement('img');
    img.src = JOGO_CONFIG.caminhoImg + pasta + imgNome;
    img.className = 'animal-item';
    img.style.left = `${pos.x - 35}px`;
    img.style.top = `${pos.y - 35}px`;

    img.onclick = (e) => {
        if (!jogoAtivo) return;
        const rect = zone.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        if (isCorrect) {
            jogoAtivo = false; // Bloqueia cliques repetidos
            mostrarFeedback("✓", "#4cd137", clickX, clickY);
            tocarSom(JOGO_CONFIG.sons.acerto);
            img.style.transform = "scale(1.5)";
            acertos++;
            rondaAtual++;
            setTimeout(() => { 
                jogoAtivo = true; 
                proximaRonda(); 
            }, 800);
        } else {
            mostrarFeedback("✗", "#e84118", clickX, clickY);
            tocarSom(JOGO_CONFIG.sons.erro);
            img.classList.add('shake');
            setTimeout(() => img.classList.remove('shake'), 300);
            erros++;
            img.style.filter = "grayscale(1) opacity(0.3)";
            img.style.pointerEvents = "none";
        }
        atualizarPlacar();
    };
    zone.appendChild(img);
}

function mostrarFeedback(texto, cor, x, y) {
    const zone = document.getElementById('night-zone');
    const fb = document.createElement('div');
    fb.className = 'feedback-icon';
    fb.innerText = texto;
    fb.style.color = cor;
    fb.style.left = `${x}px`;
    fb.style.top = `${y}px`;
    zone.appendChild(fb);
    setTimeout(() => fb.remove(), 700);
}

function atualizarPlacar() {
    const config = JOGO_CONFIG.categorias[categoriaAtual];
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    document.getElementById('round-val').innerText = `${rondaAtual} / ${config.totalRondas}`;
}

function tocarSom(url) {
    const a = new Audio(url);
    a.volume = 0.5;
    a.play().catch(()=>{});
}

function finalizarJogo() {
    jogoAtivo = false;
    const perc = Math.round((acertos / (acertos + erros)) * 100) || 0;
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const scrResult = document.getElementById('scr-result');
    scrResult.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    scrResult.innerHTML = `
        <div class="screen-box" style="text-align:center; padding: 30px; background: white;">
            <h2 style="font-size:2rem; color:var(--primary-blue); margin-bottom:15px;">${rank.titulo}</h2>
            <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:160px; margin-bottom:20px;">
            <div style="background:#f8f9fa; padding:15px; border-radius:15px; margin-bottom:20px;">
                <p style="font-size:1.2rem; color:var(--text-grey); margin-bottom:5px;"><b>Nível:</b> ${JOGO_CONFIG.categorias[categoriaAtual].nome}</p>
                <p style="color: #4cd137; font-weight:900;">Acertos: ${acertos}</p>
                <p style="color: #e84118; font-weight:900;">Erros: ${erros}</p>
            </div>
            <button class="btn-jogar-stretch" onclick="goToIntro()" style="width:240px; align-self:center;">VOLTAR AO INÍCIO</button>
        </div>
    `;
    tocarSom(JOGO_CONFIG.sons.vitoria);
}

window.gerarIntroJogo = function() {
    return JOGO_CATEGORIAS[categoriaAtual].descricao;
};
