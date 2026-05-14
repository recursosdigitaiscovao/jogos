let categoriaAtual = "nivel1";
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;

// Cor Castanha do botão voltar/tema estudo
const COR_CASTANHA = "#6C3737"; 

// 1. INICIALIZAÇÃO
window.startLogic = function() {
    rondaAtual = 1;
    acertos = 0;
    erros = 0;
    jogoAtivo = false;
    ajudaDisponivel = true;

    // Injetar a Lâmpada de Ajuda (Imagem limpa, sem filtros)
    const timerBadge = document.querySelector('.badge-timer');
    if(timerBadge) {
        timerBadge.style.cursor = "pointer";
        timerBadge.style.background = "rgba(255,255,255,0.2)";
        timerBadge.innerHTML = `
            <img id="btn-ajuda-luz" src="${JOGO_CONFIG.caminhoImg}lampada.png" 
                 style="height:30px; width:auto; vertical-align:middle; filter:none;"> 
            <span id="timer-val" style="color:white; margin-left:5px;">AJUDA</span>
        `;
        timerBadge.onclick = usarAjudaLuz;
    }
    
    atualizarPlacar();
    renderTutorialAnimation();
};

function usarAjudaLuz() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    const alvo = document.querySelector('.animal-alvo');
    if (alvo) {
        ajudaDisponivel = false;
        const btn = document.getElementById('btn-ajuda-luz');
        if(btn) btn.style.opacity = "0.3";
        
        alvo.style.transition = "all 0.4s ease";
        alvo.style.filter = "drop-shadow(0 0 35px #FFF) brightness(1.5)";
        alvo.style.transform = "scale(1.4)";
        
        setTimeout(() => {
            alvo.style.filter = "none";
            alvo.style.transform = "scale(1)";
            setTimeout(() => {
                ajudaDisponivel = true;
                if(btn) btn.style.opacity = "1";
            }, 4000);
        }, 1200);
    }
}

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const animalExemplo = config.tipoAlvo === "domestico" ? "cao.png" : "leao.png";
    const textoTutorial = config.tipoAlvo === "domestico" ? "ENCONTRA OS DOMÉSTICOS" : "ENCONTRA OS SELVAGENS";

    container.innerHTML = `
        <style>
            .tutorial-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
            .tutorial-box { position: relative; width: 280px; height: 160px; background: ${COR_CASTANHA}; border-radius: 20px; overflow: hidden; border: 3px solid #fff; }
            /* Lanterna Desfocada no Tutorial */
            .tut-spot { 
                position: absolute; width: 100px; height: 100px; 
                background: radial-gradient(circle, transparent 0%, ${COR_CASTANHA} 75%); 
                z-index: 10; transform: translate(-50%, -50%); 
                animation: moveFlashlight 5s infinite ease-in-out; 
            }
            .tut-animal { 
                position: absolute; width: 60px; left: 70%; top: 50%; 
                transform: translate(-50%, -50%); z-index: 5; 
                animation: revealAnimal 5s infinite ease-in-out;
            }
            .tut-label { font-weight: 900; color: var(--primary-blue); font-size: 0.9rem; }
            @keyframes moveFlashlight { 0%, 100% { left: 20%; top: 30%; } 40%, 60% { left: 70%; top: 50%; } 80% { left: 40%; top: 70%; } }
            @keyframes revealAnimal { 0%, 30%, 70%, 100% { opacity: 0; } 45%, 55% { opacity: 1; } }
        </style>
        <div class="tutorial-wrap">
            <div class="tut-label">${textoTutorial}</div>
            <div class="tutorial-box">
                <div class="tut-spot"></div>
                <img src="${JOGO_CONFIG.caminhoImg}${config.pastaAlvos}${animalExemplo}" class="tut-animal">
            </div>
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
            #night-zone { position: relative; width: 100%; height: 100%; background: ${COR_CASTANHA}; overflow: hidden; cursor: none; border-radius: 25px; touch-action: none; }
            /* Lanterna com foco desfocado (Mask com Radial Gradient Suave) */
            .spotlight-mask { 
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                background: ${COR_CASTANHA}; pointer-events: none; z-index: 10; 
                --x: 50%; --y: 50%; 
                mask-image: radial-gradient(circle 120px at var(--x) var(--y), transparent 0%, rgba(0,0,0,1) 90%); 
                -webkit-mask-image: radial-gradient(circle 120px at var(--x) var(--y), transparent 0%, rgba(0,0,0,1) 90%); 
            }
            /* Brilho sutil seguindo o foco */
            #flashlight-glow { 
                position: absolute; width: 240px; height: 240px; 
                background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
                pointer-events: none; z-index: 11; transform: translate(-50%, -50%); 
            }
            .animal-item { position: absolute; width: 75px; height: 75px; object-fit: contain; cursor: pointer; z-index: 5; transition: transform 0.2s; }
            .feedback-icon { position: absolute; font-size: 70px; font-weight: 900; pointer-events: none; z-index: 30; transform: translate(-50%, -50%); animation: popFeedback 0.6s ease-out forwards; }
            @keyframes popFeedback { 0% { opacity:0; transform: translate(-50%, -50%) scale(0); } 50% { opacity:1; transform: translate(-50%, -100%) scale(1.4); } 100% { opacity:0; transform: translate(-50%, -150%) scale(1); } }
            .shake { animation: shakeAnim 0.3s ease-in-out; }
            @keyframes shakeAnim { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }
            #instrucao-ronda { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); background: white; padding: 8px 30px; border-radius: 30px; font-weight: 900; z-index: 20; color: ${COR_CASTANHA}; box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-transform: uppercase; font-size: 0.85rem; pointer-events: none; }
        </style>
        <div id="night-zone">
            <div id="instrucao-ronda">...</div>
            <div id="flashlight-glow"></div>
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
        const lan = document.getElementById('lanterna');
        const glo = document.getElementById('flashlight-glow');
        if(lan) lan.style.setProperty('--x', `${x}px`);
        if(lan) lan.style.setProperty('--y', `${y}px`);
        if(glo) { glo.style.left = `${x}px`; glo.style.top = `${y}px`; }
    };
    zone.addEventListener('mousemove', mover);
    zone.addEventListener('touchmove', mover);
}

function proximaRonda() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    if (rondaAtual > config.totalRondas) { finalizarJogo(); return; }

    const zone = document.getElementById('night-zone');
    zone.querySelectorAll('.animal-item').forEach(a => a.remove());
    
    // Instrução Corrigida conforme o Nível
    const tipoTexto = config.tipoAlvo === "domestico" ? "DOMÉSTICO" : "SELVAGEM";
    document.getElementById('instrucao-ronda').innerText = `Encontra o animal ${tipoTexto}!`;
    
    atualizarPlacar();
    const posicoes = calcularGrelha(zone, 12);

    // Alvo
    const alvo = config.alvos[Math.floor(Math.random() * config.alvos.length)];
    const elAlvo = criarAnimal(alvo, config.pastaAlvos, true, posicoes.pop());
    elAlvo.classList.add('animal-alvo');

    // Distrações
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
    const rows = Math.floor((h - 90) / size);
    let cells = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            cells.push({ x: c * size + size/2, y: (r * size + 90) + size/2 });
        }
    }
    return cells.sort(() => Math.random() - 0.5).slice(0, qtd);
}

function criarAnimal(imgNome, pasta, isCorrect, pos) {
    const zone = document.getElementById('night-zone');
    const img = document.createElement('img');
    img.src = JOGO_CONFIG.caminhoImg + pasta + imgNome;
    img.className = 'animal-item';
    img.style.left = `${pos.x - 37}px`;
    img.style.top = `${pos.y - 37}px`;

    img.onclick = (e) => {
        if (!jogoAtivo) return;
        const rect = zone.getBoundingClientRect();
        const x = (e.clientX || (e.touches ? e.touches[0].clientX : 0)) - rect.left;
        const y = (e.clientY || (e.touches ? e.touches[0].clientY : 0)) - rect.top;

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
            img.style.opacity = "0.4"; // Apenas transparência, sem cinzento
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
    const zone = document.getElementById('night-zone');
    if(zone) zone.appendChild(fb);
    setTimeout(() => fb.remove(), 600);
}

function atualizarPlacar() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const h = document.getElementById('hits-val');
    const m = document.getElementById('miss-val');
    const r = document.getElementById('round-val');
    if(h) h.innerText = acertos;
    if(m) m.innerText = erros;
    if(r) r.innerText = `${rondaAtual} / ${config.totalRondas}`;
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
