let categoriaAtual = "nivel1";
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;
let lanternaAtiva = false; 

// Configuração Visual
const COR_FUNDO_SISTEMA = "#AC919B"; 

// 1. INICIALIZAÇÃO DA LÓGICA E UI
window.startLogic = function() {
    rondaAtual = 1; acertos = 0; erros = 0; ajudasUtilizadas = 0;
    jogoAtivo = false; ajudaDisponivel = true; lanternaAtiva = false;

    const statusBar = document.getElementById('status-bar');
    if(statusBar) {
        statusBar.style.display = "none";
        // BARRA DE STATUS: Alturas equalizadas (35px) e alinhamento perfeito
        statusBar.innerHTML = `
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" id="btn-ajuda-luz" style="cursor:pointer; background:rgba(255,255,255,0.4); height:35px; width:50px; display:flex; align-items:center; justify-content:center; border-radius:12px;">
                    <img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:24px; filter:none;">
                </div>
                <div class="badge" style="background:var(--primary-blue); height:35px; padding:0 15px; display:flex; align-items:center; border-radius:12px; font-weight:900; color:white; font-size:14px; white-space:nowrap;">
                    <span id="round-val">1 / 10</span>
                </div>
            </div>
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" style="background:#7ed321; height:35px; padding:0 12px; display:flex; align-items:center; border-radius:12px; font-weight:900; color:white;">
                    ✓ <span id="hits-val" style="margin-left:4px;">0</span>
                </div>
                <div class="badge" style="background:#ff5e5e; height:35px; padding:0 12px; display:flex; align-items:center; border-radius:12px; font-weight:900; color:white;">
                    ✗ <span id="miss-val" style="margin-left:4px;">0</span>
                </div>
                <img id="rd-game-btn" src="${JOGO_CONFIG.caminhoImg}rd.png" style="height:35px; width:35px; cursor:pointer;" onclick="openRDMenu(event)">
            </div>
        `;
        document.getElementById('btn-ajuda-luz').onclick = usarAjudaRelampago;
    }
    atualizarPlacar();
    renderTutorialAnimation();
};

// AJUDA: EFEITO RELÂMPAGO
function usarAjudaRelampago() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const lanternaMask = document.getElementById('lanterna');
    const btnLuz = document.getElementById('btn-ajuda-luz');
    if(btnLuz) btnLuz.style.opacity = "0.2";

    lanternaMask.style.transition = "opacity 0.2s ease-out";
    lanternaMask.style.opacity = "0"; 
    document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "1");

    setTimeout(() => {
        lanternaMask.style.opacity = "1";
        if(!lanternaAtiva) document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "0");
        setTimeout(() => { ajudaDisponivel = true; if(btnLuz) btnLuz.style.opacity = "1"; }, 5000);
    }, 1200);
}

// TUTORIAL: EXPLICAÇÃO DINÂMICA E LIMPA
function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const isDom = config.tipoAlvo === "domestico";
    const alvoImg = isDom ? "cao.png" : "leao.png";
    const fakeImg = isDom ? "leao.png" : "cao.png";
    const pAlvo = isDom ? "animaisdomesticos/" : "animaisselvagens/";
    const pFake = isDom ? "animaisselvagens/" : "animaisdomesticos/";

    container.innerHTML = `
        <style>
            .tut-wrap { display: flex; flex-direction: column; align-items: center; width: 100%; }
            .tut-screen { position: relative; width: 280px; height: 160px; background: #f8fafc; border: 2px dashed var(--primary-blue); border-radius: 25px; overflow: hidden; }
            .tut-dark { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #475569; z-index: 2; }
            .tut-lens { position: absolute; width: 90px; height: 90px; background: radial-gradient(circle, transparent 10%, #475569 80%); border: 2px solid white; border-radius: 50%; z-index: 10; transform: translate(-50%, -50%); animation: moveLens 6s infinite ease-in-out; }
            .tut-img { position: absolute; width: 50px; transform: translate(-50%, -50%); z-index: 5; opacity: 0; }
            .t-fake { left: 30%; top: 50%; animation: revFake 6s infinite; }
            .t-alvo { left: 75%; top: 50%; animation: revAlvo 6s infinite; }
            @keyframes moveLens { 0%, 100% { left: 15%; top: 50%; } 30% { left: 35%; top: 50%; } 60%, 80% { left: 75%; top: 50%; } }
            @keyframes revFake { 0%, 25%, 35%, 100% { opacity: 0; } 30% { opacity: 0.3; } }
            @keyframes revAlvo { 0%, 55%, 85%, 100% { opacity: 0; } 65%, 80% { opacity: 1; transform: translate(-50%,-50%) scale(1.2); } }
        </style>
        <div class="tut-wrap">
            <div style="font-weight:900; color:var(--primary-blue); margin-bottom:10px; font-size:1.1rem;">ENCONTRA OS ${isDom ? 'DOMÉSTICOS' : 'SELVAGENS'}</div>
            <div class="tut-screen">
                <div class="tut-dark"></div><div class="tut-lens"></div>
                <img src="${JOGO_CONFIG.caminhoImg}${pFake}${fakeImg}" class="tut-img t-fake">
                <img src="${JOGO_CONFIG.caminhoImg}${pAlvo}${alvoImg}" class="tut-img t-alvo">
            </div>
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
            :root { --raio: 120px; }
            @media (max-width: 600px) { :root { --raio: 80px; } }
            #night-zone { position: relative; width: 100%; height: 100%; background: ${COR_FUNDO_SISTEMA}; overflow: hidden; cursor: none; border-radius: 25px; touch-action: none; }
            /* LANTERNA PROFISSIONAL ESFUMADA */
            .spotlight-mask { 
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                background: ${COR_FUNDO_SISTEMA}; pointer-events: none; z-index: 10; 
                --x: 50%; --y: 50%; 
                mask-image: radial-gradient(circle var(--raio) at var(--x) var(--y), transparent 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.8) 75%, black 100%); 
                -webkit-mask-image: radial-gradient(circle var(--raio) at var(--x) var(--y), transparent 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.8) 75%, black 100%); 
                opacity: 1; 
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
        const x = (e.clientX || (e.touches ? e.touches[0].clientX : 0)) - rect.left;
        const y = (e.clientY || (e.touches ? e.touches[0].clientY : 0)) - rect.top;
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
        const x = (e.clientX || (e.touches ? e.touches[0].clientX : 0)) - rect.left;
        const y = (e.clientY || (e.touches ? e.touches[0].clientY : 0)) - rect.top;
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

// 3. ECRÃ DE RESULTADOS (DESIGN FINAL)
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
            .res-card { display:flex; flex-direction:column; align-items:center; width:100%; max-width:550px; margin:auto; padding:10px; }
            .res-title { color:var(--primary-blue); font-size:2.2rem; font-weight:900; margin: 15px 0 25px; }
            .res-stats { display:flex; gap:15px; margin-bottom:30px; }
            .res-box { background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
            .res-num { font-size:1.8rem; font-weight:900; }
            .res-lab { font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase; margin-top:2px; }
            .res-btns { display:flex; flex-direction:column; gap:12px; width:100%; max-width:320px; }
            .btn-base { height:55px; border-radius:30px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1rem; text-decoration:none; cursor:pointer; border:none; gap:10px; }
            .btn-solid { background:var(--primary-blue); color:white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-outline { background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); box-shadow:none; }
            .btn-subtle { background:#e2e8f0; color:#64748b; }
        </style>
        <div class="res-card">
            <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px;">
            <h1 class="res-title">${rank.titulo}</h1>
            <div class="res-stats">
                <div class="res-box"><span class="res-num" style="color:#7ed321;">${acertos}</span><span class="res-lab">Certos</span></div>
                <div class="res-box"><span class="res-num" style="color:#ff5e5e;">${erros}</span><span class="res-lab">Errados</span></div>
                <div class="res-box"><span class="res-num" style="color:#ff9f43;">${ajudasUtilizadas}</span><span class="res-lab">Ajudas</span></div>
            </div>
            <div class="res-btns">
                <button class="btn-base btn-solid" onclick="goToIntro()"><i class="fas fa-undo"></i> JOGAR DE NOVO</button>
                <button class="btn-base btn-outline" onclick="openRDMenu(event)"><i class="fas fa-list"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-base btn-subtle"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
    tocarSom(JOGO_CONFIG.sons.vitoria);
}

window.gerarIntroJogo = function() { 
    const config = JOGO_CATEGORIAS[categoriaAtual];
    return config.tipoAlvo === "domestico" ? "Encontra os animais DOMÉSTICOS na escuridão!" : "Encontra os animais SELVAGENS na escuridão!";
};
