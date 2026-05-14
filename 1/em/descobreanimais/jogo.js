let categoriaAtual = "nivel1";
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;

// 1. INICIALIZAÇÃO
window.startLogic = function() {
    rondaAtual = 1;
    acertos = 0;
    erros = 0;
    jogoAtivo = false;
    ajudaDisponivel = true;

    // Injetar a Lâmpada de Ajuda no Badge do Timer (conforme pedido)
    const timerBadge = document.querySelector('.badge-timer');
    if(timerBadge) {
        timerBadge.style.cursor = "pointer";
        timerBadge.innerHTML = `<img id="btn-ajuda-luz" src="${JOGO_CONFIG.caminhoIcons}lampada.png" style="height:25px; vertical-align:middle;"> <span id="timer-val">AJUDA</span>`;
        timerBadge.onclick = usarAjudaLuz;
    }
    
    atualizarPlacar();
    renderTutorialAnimation();
};

// Função de Ajuda (Faz o animal certo brilhar por um momento)
function usarAjudaLuz() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    
    const alvo = document.querySelector('.animal-alvo');
    if (alvo) {
        ajudaDisponivel = false;
        document.getElementById('btn-ajuda-luz').style.opacity = "0.3"; // Desativa visualmente
        
        // Efeito de brilho/pulo
        alvo.style.transition = "all 0.3s";
        alvo.style.filter = "drop-shadow(0 0 20px white) brightness(1.5)";
        alvo.style.transform = "scale(1.3)";
        
        setTimeout(() => {
            alvo.style.filter = "none";
            alvo.style.transform = "scale(1)";
            setTimeout(() => ajudaDisponivel = true, 5000); // Reativa após 5 segundos
            document.getElementById('btn-ajuda-luz').style.opacity = "1";
        }, 1000);
    }
}

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    container.innerHTML = `
        <style>
            .tutorial-box { position: relative; width: 280px; height: 160px; background: #010409; border-radius: 20px; overflow: hidden; border: 3px solid #ccc; }
            .tut-spot { position: absolute; width: 80px; height: 80px; background: radial-gradient(circle, transparent 20%, rgba(0,0,0,0.9) 80%); border: 2px solid white; border-radius: 50%; z-index: 10; transform: translate(-50%, -50%); animation: moveSpot 4s infinite ease-in-out; }
            .tut-animal { position: absolute; width: 50px; left: 70%; top: 50%; transform: translate(-50%, -50%); z-index: 5; }
            @keyframes moveSpot { 0%, 100% { left: 25%; top: 50%; } 50% { left: 75%; top: 50%; } }
        </style>
        <div class="tutorial-box">
            <div class="tut-spot"></div>
            <img src="${JOGO_CONFIG.caminhoImg}${config.pastaAlvos}${config.alvos[0]}" class="tut-animal">
        </div>
    `;
}

// 2. MOTOR DO JOGO
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
            #night-zone { position: relative; width: 100%; height: 100%; background: #010409; overflow: hidden; cursor: none; border-radius: 25px; touch-action: none; }
            .spotlight-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: black; pointer-events: none; z-index: 10; --x: 50%; --y: 50%; mask-image: radial-gradient(circle 100px at var(--x) var(--y), transparent 0%, black 100%); -webkit-mask-image: radial-gradient(circle 100px at var(--x) var(--y), transparent 0%, black 100%); }
            #flashlight-cursor { position: absolute; width: 200px; height: 200px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; pointer-events: none; z-index: 11; transform: translate(-50%, -50%); }
            .animal-item { position: absolute; width: 70px; height: 70px; object-fit: contain; cursor: pointer; z-index: 5; transition: transform 0.2s; }
            .feedback-icon { position: absolute; font-size: 60px; font-weight: 900; pointer-events: none; z-index: 30; transform: translate(-50%, -50%); animation: popFeedback 0.6s ease-out forwards; }
            @keyframes popFeedback { 0% { opacity:0; transform: translate(-50%, -50%) scale(0); } 50% { opacity:1; transform: translate(-50%, -100%) scale(1.5); } 100% { opacity:0; transform: translate(-50%, -150%) scale(1); } }
            .shake { animation: shakeAnim 0.3s ease-in-out; }
            @keyframes shakeAnim { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }
            #instrucao-ronda { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); background: white; padding: 8px 25px; border-radius: 30px; font-weight: 900; z-index: 20; color: #1a1a1a; box-shadow: 0 4px 20px rgba(0,0,0,0.6); text-transform: uppercase; font-size: 0.8rem; pointer-events: none; }
        </style>
        <div id="night-zone">
            <div id="instrucao-ronda">...</div>
            <div id="flashlight-cursor"></div>
            <div class="spotlight-mask" id="lanterna"></div>
        </div>
    `;

    const zone = document.getElementById('night-zone');
    const mover = (e) => {
        const rect = zone.getBoundingClientRect();
        const clientX = (e.clientX || (e.touches ? e.touches[0].clientX : 0));
        const clientY = (e.clientY || (e.touches ? e.touches[0].clientY : 0));
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        document.getElementById('lanterna').style.setProperty('--x', `${x}px`);
        document.getElementById('lanterna').style.setProperty('--y', `${y}px`);
        document.getElementById('flashlight-cursor').style.left = `${x}px`;
        document.getElementById('flashlight-cursor').style.top = `${y}px`;
    };
    zone.addEventListener('mousemove', mover);
    zone.addEventListener('touchmove', mover);
}

function proximaRonda() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    if (rondaAtual > config.totalRondas) { finalizarJogo(); return; }

    const zone = document.getElementById('night-zone');
    zone.querySelectorAll('.animal-item').forEach(a => a.remove());
    document.getElementById('instrucao-ronda').innerText = `Encontra o animal ${config.tipoAlvo === "domestico" ? "DOMÉSTICO" : "SELVAGEM"}!`;
    atualizarPlacar();

    const posicoes = calcularGrelha(zone, 12);

    // Criar Animal Certo
    const alvo = config.alvos[Math.floor(Math.random() * config.alvos.length)];
    const elAlvo = criarAnimal(alvo, config.pastaAlvos, true, posicoes.pop());
    elAlvo.classList.add('animal-alvo');

    // Criar 11 Distrações
    for (let i = 0; i < 11; i++) {
        const fake = config.distracoes[Math.floor(Math.random() * config.distracoes.length)];
        criarAnimal(fake, config.pastaDistracoes, false, posicoes.pop());
    }
}

function calcularGrelha(container, qtd) {
    const w = container.clientWidth;
    const h = container.clientHeight;
    const size = 80;
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
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        if (isCorrect) {
            jogoAtivo = false;
            mostrarFeedback("✓", "#7ed321", x, y);
            tocarSom(JOGO_CONFIG.sons.acerto);
            img.style.transform = "scale(1.8) rotate(10deg)";
            acertos++; rondaAtual++;
            setTimeout(() => { jogoAtivo = true; proximaRonda(); }, 800);
        } else {
            mostrarFeedback("✗", "#ff5e5e", x, y);
            tocarSom(JOGO_CONFIG.sons.erro);
            img.classList.add('shake');
            setTimeout(() => img.classList.remove('shake'), 300);
            erros++;
            // SEM FORMA CINZENTA: apenas reduzimos opacidade e bloqueamos clique
            img.style.opacity = "0.5";
            img.style.pointerEvents = "none";
        }
        atualizarPlacar();
    };
    zone.appendChild(img);
    return img;
}

function mostrarFeedback(t, c, x, y) {
    const fb = document.createElement('div');
    fb.className = 'feedback-icon'; fb.innerText = t; fb.style.color = c;
    fb.style.left = `${x}px`; fb.style.top = `${y}px`;
    document.getElementById('night-zone').appendChild(fb);
    setTimeout(() => fb.remove(), 600);
}

function atualizarPlacar() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    document.getElementById('round-val').innerText = `${rondaAtual} / ${config.totalRondas}`;
}

function tocarSom(url) { new Audio(url).play().catch(()=>{}); }

function finalizarJogo() {
    jogoAtivo = false;
    const perc = Math.round((acertos / (acertos + erros)) * 100) || 0;
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const scrResult = document.getElementById('scr-result');
    scrResult.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    scrResult.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <div style="background: white; width: 90%; max-width: 400px; padding: 30px; border-radius: 35px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); text-align: center;">
                <h2 style="color: var(--primary-blue); font-weight: 900; margin-bottom: 10px;">${rank.titulo}</h2>
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width: 150px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-around; background: #f0f7ff; padding: 15px; border-radius: 25px; margin-bottom: 25px;">
                    <div><p style="font-size: 0.8rem; color: #88a; font-weight:700;">ACERTOS</p><p style="font-size: 1.6rem; font-weight: 900; color: #7ed321;">${acertos}</p></div>
                    <div style="width:1px; background:#ddd; height:40px; align-self:center;"></div>
                    <div><p style="font-size: 0.8rem; color: #88a; font-weight:700;">ERROS</p><p style="font-size: 1.6rem; font-weight: 900; color: #ff5e5e;">${erros}</p></div>
                </div>
                <button class="btn-jogar-stretch" onclick="goToIntro()">JOGAR NOVAMENTE</button>
            </div>
        </div>
    `;
    tocarSom(JOGO_CONFIG.sons.vitoria);
}

window.gerarIntroJogo = function() { return JOGO_CATEGORIAS[categoriaAtual].descricao; };
