let categoriaAtual = "nivel1";
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;
let lanternaAtiva = false; 

const COR_FUNDO_JOGO = "#AC919B"; 

// 1. INICIALIZAÇÃO
window.startLogic = function() {
    rondaAtual = 1; acertos = 0; erros = 0; ajudasUtilizadas = 0;
    jogoAtivo = false; ajudaDisponivel = true; lanternaAtiva = false;

    const statusBar = document.getElementById('status-bar');
    if(statusBar) {
        statusBar.style.display = "none";
        statusBar.innerHTML = `
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" id="btn-ajuda-luz" style="cursor:pointer; background:rgba(255,255,255,0.3); height:35px; width:50px; display:flex; align-items:center; justify-content:center; border-radius:12px;">
                    <img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:22px;">
                </div>
                <div class="badge" style="background:var(--primary-blue); height:35px; padding:0 15px; display:flex; align-items:center; border-radius:12px; font-weight:900; color:white; font-size:14px;">
                    <span id="round-val">1 / 10</span>
                </div>
            </div>
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" style="background:#7ed321; height:35px; padding:0 12px; display:flex; align-items:center; border-radius:12px; font-weight:900; color:white;">
                    ✓ <span id="hits-val">0</span>
                </div>
                <div class="badge" style="background:#ff5e5e; height:35px; padding:0 12px; display:flex; align-items:center; border-radius:12px; font-weight:900; color:white;">
                    ✗ <span id="miss-val">0</span>
                </div>
                <img id="rd-game-btn" src="${JOGO_CONFIG.caminhoImg}rd.png" style="height:35px; width:35px; cursor:pointer;" onclick="openRDMenu(event)">
            </div>
        `;
        document.getElementById('btn-ajuda-luz').onclick = usarAjudaRelampago;
    }
    atualizarPlacar();
    renderTutorialAnimation();
};

function usarAjudaRelampago() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const lanternaMask = document.getElementById('lanterna');
    const btnLuz = document.getElementById('btn-ajuda-luz');
    if(btnLuz) btnLuz.style.opacity = "0.2";
    lanternaMask.style.transition = "opacity 0.2s";
    lanternaMask.style.opacity = "0"; 
    document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "1");
    setTimeout(() => {
        lanternaMask.style.opacity = "1";
        if(!lanternaAtiva) document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "0");
        setTimeout(() => { ajudaDisponivel = true; if(btnLuz) btnLuz.style.opacity = "1"; }, 5000);
    }, 1200);
}

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    container.innerHTML = `
        <style>
            .tutorial-wrap { display:flex; flex-direction:column; align-items:center; width:100%; }
            .tutorial-box { position:relative; width:280px; height:150px; background:${COR_FUNDO_JOGO}; border-radius:20px; overflow:hidden; border:2px solid #fff; }
            .tut-spot { position:absolute; width:100px; height:100px; background:radial-gradient(circle, transparent 0%, ${COR_FUNDO_JOGO} 80%); z-index:10; transform:translate(-50%,-50%); animation:moveTut 4s infinite ease-in-out; }
            .tut-animal { position:absolute; width:55px; left:70%; top:50%; transform:translate(-50%,-50%); z-index:5; animation:revealTut 4s infinite ease-in-out; }
            @keyframes moveTut { 0%,100% {left:25%; top:35%;} 50% {left:75%; top:55%;} }
            @keyframes revealTut { 0%,30%,70%,100% {opacity:0;} 45%,55% {opacity:1;} }
        </style>
        <div class="tutorial-wrap">
            <div style="font-weight:900; color:var(--primary-blue); margin-bottom:10px;">ENCONTRA OS ${config.tipoAlvo === "domestico" ? "DOMÉSTICOS" : "SELVAGENS"}</div>
            <div class="tutorial-box"><div class="tut-spot"></div><img src="${JOGO_CONFIG.caminhoImg}${config.pastaAlvos}${config.alvos[0]}" class="tut-animal"></div>
        </div>
    `;
}

// 2. MOTOR DO JOGO
window.initGame = function() {
    jogoAtivo = true; lanternaAtiva = false; 
    renderizarEstruturaLanterna();
    proximaRonda();
};

function selecionarCategoria(id) { categoriaAtual = id; }

function renderizarEstruturaLanterna() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <style>
            #night-zone { position: relative; width: 100%; height: 100%; background: ${COR_FUNDO_JOGO}; overflow: hidden; cursor: none; border-radius: 25px; touch-action: none; }
            .spotlight-mask { 
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                background: ${COR_FUNDO_JOGO}; pointer-events: none; z-index: 10; 
                --x: 50%; --y: 50%; 
                mask-image: radial-gradient(circle 110px at var(--x) var(--y), transparent 0%, black 95%); 
                -webkit-mask-image: radial-gradient(circle 110px at var(--x) var(--y), transparent 0%, black 95%); 
            }
            .animal-item { position: absolute; width: 70px; height: 70px; object-fit: contain; cursor: pointer; z-index: 5; opacity: 0; transition: opacity 0.3s; }
            #instrucao-ronda { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); background: white; padding: 6px 30px; border-radius: 30px; font-weight: 900; z-index: 20; color: var(--primary-blue); box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-transform: uppercase; font-size: 1.1rem; pointer-events: none; }
        </style>
        <div id="night-zone"><div id="instrucao-ronda">...</div><div class="spotlight-mask" id="lanterna"></div></div>
    `;
    const zone = document.getElementById('night-zone');
    const mover = (e) => {
        if(!lanternaAtiva) { lanternaAtiva = true; document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "1"); }
        const rect = zone.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        const lan = document.getElementById('lanterna');
        if(lan) { lan.style.setProperty('--x', `${x}px`); lan.style.setProperty('--y', `${y}px`); }
    };
    zone.addEventListener('mousemove', mover); zone.addEventListener('touchstart', mover); zone.addEventListener('touchmove', mover);
}

function proximaRonda() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    if (rondaAtual > config.totalRondas) { finalizarJogo(); return; }
    const zone = document.getElementById('night-zone');
    zone.querySelectorAll('.animal-item').forEach(a => a.remove());
    document.getElementById('instrucao-ronda').innerText = config.tipoAlvo === "domestico" ? "DOMÉSTICO" : "SELVAGEM";
    atualizarPlacar();
    const posicoes = calcularGrelha(zone, 12);
    const alvo = config.alvos[Math.floor(Math.random() * config.alvos.length)];
    const elAlvo = criarAnimal(alvo, config.pastaAlvos, true, posicoes.pop());
    elAlvo.classList.add('animal-alvo');
    for (let i = 0; i < 11; i++) {
        const fake = config.distracoes[Math.floor(Math.random() * config.distracoes.length)];
        criarAnimal(fake, config.pastaDistracoes, false, posicoes.pop());
    }
}

function calcularGrelha(container, qtd) {
    const w = container.clientWidth; const h = container.clientHeight;
    const size = 78; const cols = Math.floor(w / size); const rows = Math.floor((h - 80) / size);
    let cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ x: c * size + size/2, y: (r * size + 80) + size/2 });
    return cells.sort(() => Math.random() - 0.5).slice(0, qtd);
}

function criarAnimal(imgNome, pasta, isCorrect, pos) {
    const zone = document.getElementById('night-zone');
    const img = document.createElement('img');
    img.src = JOGO_CONFIG.caminhoImg + pasta + imgNome;
    img.className = 'animal-item';
    img.style.left = `${pos.x - 35}px`; img.style.top = `${pos.y - 35}px`;
    if(lanternaAtiva) img.style.opacity = "1";
    img.onclick = (e) => {
        if (!jogoAtivo) return;
        const rect = zone.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        if (isCorrect) {
            jogoAtivo = false; mostrarFeedback("✓", "#7ed321", x, y); tocarSom(JOGO_CONFIG.sons.acerto);
            img.style.transform = "scale(1.8) rotate(12deg)"; acertos++; rondaAtual++;
            setTimeout(() => { jogoAtivo = true; proximaRonda(); }, 800);
        } else {
            mostrarFeedback("✗", "#ff5e5e", x, y); tocarSom(JOGO_CONFIG.sons.erro);
            img.classList.add('shake'); setTimeout(() => img.classList.remove('shake'), 300);
            erros++; img.style.opacity = "0.4"; img.style.pointerEvents = "none";
        }
        atualizarPlacar();
    };
    zone.appendChild(img); return img;
}

function mostrarFeedback(t, c, x, y) {
    const fb = document.createElement('div');
    fb.innerText = t; fb.style.cssText = `position:absolute; font-size:70px; font-weight:900; pointer-events:none; z-index:30; color:${c}; left:${x}px; top:${y}px; transform:translate(-50%,-50%); animation: popFeedback 0.6s ease-out forwards;`;
    document.getElementById('night-zone').appendChild(fb); setTimeout(() => fb.remove(), 600);
}

function atualizarPlacar() {
    if(document.getElementById('round-val')) document.getElementById('round-val').innerText = `${rondaAtual} / 10`;
    if(document.getElementById('hits-val')) document.getElementById('hits-val').innerText = acertos;
    if(document.getElementById('miss-val')) document.getElementById('miss-val').innerText = erros;
}

function tocarSom(url) { new Audio(url).play().catch(()=>{}); }

// 3. ECRÃ DE RESULTADOS IDÊNTICO À IMAGEM
function finalizarJogo() {
    jogoAtivo = false;
    const perc = Math.round((acertos / (acertos + erros)) * 100) || 0;
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const scrResult = document.getElementById('scr-result');
    scrResult.classList.add('active');
    document.getElementById('status-bar').style.display = "none";

    scrResult.innerHTML = `
        <style>
            .res-container { display:flex; flex-direction:column; align-items:center; width:100%; max-width:600px; margin:auto; padding:20px; }
            .res-trophy { width:120px; margin-bottom:10px; }
            .res-title { color:var(--primary-blue); font-size:2.4rem; font-weight:900; margin-bottom:30px; }
            
            .res-stats-grid { display:flex; gap:15px; margin-bottom:35px; width:100%; justify-content:center; }
            .res-stat-box { 
                background:white; border-radius:25px; width:110px; height:110px; 
                display:flex; flex-direction:column; align-items:center; justify-content:center;
                box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            }
            .res-stat-num { font-size:1.8rem; font-weight:900; margin-bottom:5px; }
            .res-stat-label { font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase; }

            .res-buttons { display:flex; flex-direction:column; gap:15px; width:100%; max-width:320px; }
            .res-btn { 
                height:60px; border-radius:30px; display:flex; align-items:center; justify-content:center; 
                gap:15px; font-weight:900; font-size:1.1rem; text-decoration:none; transition:0.2s; cursor:pointer;
            }
            .res-btn-main { background:var(--primary-blue); color:white; box-shadow: 0 6px 0 var(--primary-dark); border:none; }
            .res-btn-main:active { transform:translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }
            
            .res-btn-outline { border:3px solid var(--primary-blue); color:var(--primary-blue); background:white; }
            .res-btn-outline:active { background:#f0f7ff; }
            
            .res-btn-subtle { background:#e2e8f0; color:#64748b; border:none; }
        </style>

        <div class="res-container">
            <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" class="res-trophy">
            <h1 class="res-title">${rank.titulo}</h1>

            <div class="res-stats-grid">
                <div class="res-stat-box">
                    <span class="res-stat-num" style="color:#7ed321;">${acertos}</span>
                    <span class="res-stat-label">Certos</span>
                </div>
                <div class="res-stat-box">
                    <span class="res-stat-num" style="color:#ff5e5e;">${erros}</span>
                    <span class="res-stat-label">Errados</span>
                </div>
                <div class="res-stat-box">
                    <span class="res-stat-num" style="color:#ff9f43;">${ajudasUtilizadas}</span>
                    <span class="res-stat-label">Ajudas</span>
                </div>
            </div>

            <div class="res-buttons">
                <button class="res-btn res-btn-main" onclick="goToIntro()">
                    <i class="fas fa-redo"></i> JOGAR DE NOVO
                </button>
                <button class="res-btn res-btn-outline" onclick="openRDMenu(event)">
                    <i class="fas fa-chart-line"></i> OUTRO NÍVEL
                </button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="res-btn res-btn-subtle">
                    <i class="fas fa-sign-out-alt"></i> SAIR
                </a>
            </div>
        </div>
    `;
    tocarSom(JOGO_CONFIG.sons.vitoria);
}

window.gerarIntroJogo = function() { 
    const config = JOGO_CATEGORIAS[categoriaAtual];
    return config.tipoAlvo === "domestico" ? "Encontra os animais DOMÉSTICOS na escuridão!" : "Encontra os animais SELVAGENS na escuridão!";
};
