let categoriaAtual = "nivel1";
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;
let lanternaAtiva = false; 

const COR_FUNDO_SISTEMA = "#AC919B"; 

// 1. INICIALIZAÇÃO
window.startLogic = function() {
    rondaAtual = 1; acertos = 0; erros = 0; ajudasUtilizadas = 0;
    jogoAtivo = false; ajudaDisponivel = true; lanternaAtiva = false;

    const statusBar = document.getElementById('status-bar');
    if(statusBar) {
        statusBar.style.display = "none";
        // BARRA DE STATUS: Alturas equalizadas e Lâmpada em destaque
        statusBar.innerHTML = `
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" id="btn-ajuda-luz" style="cursor:pointer; background:rgba(255,255,255,0.4); height:35px; width:55px; display:flex; align-items:center; justify-content:center; border-radius:12px;">
                    <img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:26px;">
                </div>
                <div class="badge" style="background:var(--primary-blue); height:30px; padding:0 12px; display:flex; align-items:center; border-radius:10px; font-weight:900; color:white; font-size:13px;">
                    <span id="round-val">1 / 10</span>
                </div>
            </div>
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" style="background:#7ed321; height:30px; padding:0 12px; display:flex; align-items:center; border-radius:10px; font-weight:900; color:white; font-size:13px;">
                    ✓ <span id="hits-val">0</span>
                </div>
                <div class="badge" style="background:#ff5e5e; height:30px; padding:0 12px; display:flex; align-items:center; border-radius:10px; font-weight:900; color:white; font-size:13px;">
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

    lanternaMask.style.transition = "opacity 0.2s ease-out";
    lanternaMask.style.opacity = "0"; 
    document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "1");

    setTimeout(() => {
        lanternaMask.style.opacity = "1";
        if(!lanternaAtiva) document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "0");
        setTimeout(() => { ajudaDisponivel = true; if(btnLuz) btnLuz.style.opacity = "1"; }, 5000);
    }, 1200);
}

// TUTORIAL: Visual esbatido / Grayscale
function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const isDom = config.tipoAlvo === "domestico";
    
    container.innerHTML = `
        <style>
            .tut-wrap { display: flex; flex-direction: column; align-items: center; width: 100%; }
            .tut-screen { position: relative; width: 280px; height: 150px; background: #e2e8f0; border: 1px solid #cbd5e1; border-radius: 25px; overflow: hidden; filter: grayscale(100%); }
            .tut-dark { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #64748b; z-index: 2; }
            .tut-lens { position: absolute; width: 90px; height: 90px; background: radial-gradient(circle, transparent 10%, #64748b 80%); border: 2px solid white; border-radius: 50%; z-index: 10; transform: translate(-50%, -50%); animation: moveLens 5s infinite ease-in-out; }
            .tut-img { position: absolute; width: 50px; transform: translate(-50%, -50%); z-index: 5; opacity: 0; }
            @keyframes moveLens { 0%, 100% { left: 15%; top: 50%; } 30% { left: 35%; top: 50%; } 60%, 85% { left: 70%; top: 50%; } }
            @keyframes revFake { 0%, 25%, 35%, 100% { opacity: 0; } 30% { opacity: 0.2; } }
            @keyframes revAlvo { 0%, 55%, 85%, 100% { opacity: 0; } 65%, 80% { opacity: 0.8; transform: translate(-50%,-50%) scale(1.1); } }
        </style>
        <div class="tut-wrap">
            <div style="font-weight:900; color:#475569; margin-bottom:12px; font-size:1.1rem; text-transform:uppercase;">ENCONTRA OS ${isDom ? 'DOMÉSTICOS' : 'SELVAGENS'}</div>
            <div class="tut-screen">
                <div class="tut-dark"></div><div class="tut-lens"></div>
                <img src="${JOGO_CONFIG.caminhoImg}${isDom ? 'animaisselvagens/leao.png' : 'animaisdomesticos/cao.png'}" class="tut-img" style="left:30%; top:50%; animation: revFake 5s infinite;">
                <img src="${JOGO_CONFIG.caminhoImg}${isDom ? 'animaisdomesticos/cao.png' : 'animaisselvagens/leao.png'}" class="tut-img" style="left:70%; top:50%; animation: revAlvo 5s infinite;">
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
            :root { --raio-f: 120px; }
            @media (max-width: 600px) { :root { --raio-f: 90px; } }
            #night-zone { position: relative; width: 100%; height: 100%; background: ${COR_FUNDO_SISTEMA}; overflow: hidden; cursor: none; border-radius: 25px; touch-action: none; }
            
            /* LANTERNA PROFISSIONAL ESFUMADA */
            .spotlight-mask { 
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                background: ${COR_FUNDO_SISTEMA}; pointer-events: none; z-index: 10; 
                --x: 50%; --y: 50%; 
                mask-image: radial-gradient(circle var(--raio-f) at var(--x) var(--y), transparent 0%, transparent 40%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.9) 85%, black 100%); 
                -webkit-mask-image: radial-gradient(circle var(--raio-f) at var(--x) var(--y), transparent 0%, transparent 40%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.9) 85%, black 100%); 
            }
            
            .animal-item { position: absolute; width: 75px; height: 75px; object-fit: contain; cursor: pointer; z-index: 5; opacity: 0; transition: opacity 0.3s; }
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
    if (rondaAtual > 10) { finalizarJogo(); return; }
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
    const size = 80; const cols = Math.floor(w / size); const rows = Math.floor((h - 80) / size);
    let cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ x: c * size + size/2, y: (r * size + 80) + size/2 });
    return cells.sort(() => Math.random() - 0.5).slice(0, qtd);
}

function criarAnimal(imgNome, pasta, isCorrect, pos) {
    const zone = document.getElementById('night-zone');
    const img = document.createElement('img');
    img.src = JOGO_CONFIG.caminhoImg + pasta + imgNome;
    img.className = 'animal-item';
    img.style.left = `${pos.x - 37}px`; img.style.top = `${pos.y - 37}px`;
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
    fb.innerText = t; fb.style.cssText = `position:absolute; font-size:75px; font-weight:900; pointer-events:none; z-index:30; color:${c}; left:${x}px; top:${y}px; transform:translate(-50%,-50%); animation: popFeedback 0.6s ease-out forwards;`;
    document.getElementById('night-zone').appendChild(fb); setTimeout(() => fb.remove(), 600);
}

function atualizarPlacar() {
    if(document.getElementById('round-val')) document.getElementById('round-val').innerText = `${rondaAtual > 10 ? 10 : rondaAtual} / 10`;
    if(document.getElementById('hits-val')) document.getElementById('hits-val').innerText = acertos;
    if(document.getElementById('miss-val')) document.getElementById('miss-val').innerText = erros;
}

function tocarSom(url) { new Audio(url).play().catch(()=>{}); }

// 3. ECRÃ DE RESULTADOS FINAL (IDÊNTICO À IMAGEM)
function finalizarJogo() {
    jogoAtivo = false;
    const perc = Math.round((acertos / 10) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const scrResult = document.getElementById('scr-result');
    scrResult.classList.add('active');
    document.getElementById('status-bar').style.display = "none";

    scrResult.innerHTML = `
        <style>
            .res-card { display:flex; flex-direction:column; align-items:center; width:100%; max-width:600px; margin:auto; padding:20px; }
            .res-title { color:var(--primary-blue); font-size:2.4rem; font-weight:900; margin-bottom:30px; }
            .res-stats { display:flex; gap:15px; margin-bottom:35px; width:100%; justify-content:center; }
            .res-box { 
                background:white; border-radius:25px; width:110px; height:110px; 
                display:flex; flex-direction:column; align-items:center; justify-content:center;
                box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            }
            .res-btns { display:flex; flex-direction:column; gap:15px; width:100%; max-width:340px; }
            .res-btn { 
                height:60px; border-radius:30px; display:flex; align-items:center; justify-content:center; 
                gap:15px; font-weight:900; font-size:1.1rem; text-decoration:none; cursor:pointer; border:none;
            }
            /* Cores dos botões conforme a imagem */
            .btn-redo { background:var(--primary-blue); color:white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-redo:active { transform:translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }
            
            .btn-level { border:3px solid var(--primary-blue); color:var(--primary-blue); background:white; }
            .btn-level:active { background:#f0f7ff; }
            
            .btn-exit { background:#e2e8f0; color:#64748b; }
        </style>

        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <div class="res-card">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px; margin-bottom:10px;">
                <h1 class="res-title">${rank.titulo}</h1>

                <div class="res-stats">
                    <div class="res-box"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div class="res-box"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div class="res-box"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>

                <div class="res-btns">
                    <button class="res-btn btn-redo" onclick="goToIntro()">
                        <i class="fas fa-redo"></i> JOGAR DE NOVO
                    </button>
                    <button class="res-btn btn-level" onclick="openRDMenu(event)">
                        <i class="fas fa-chart-line"></i> OUTRO NÍVEL
                    </button>
                    <a href="${JOGO_CONFIG.linkVoltar}" class="res-btn btn-exit">
                        <i class="fas fa-sign-out-alt"></i> SAIR
                    </a>
                </div>
            </div>
        </div>
    `;
    tocarSom(JOGO_CONFIG.sons.vitoria);
}

window.gerarIntroJogo = function() { 
    return JOGO_CATEGORIAS[categoriaAtual].descricao;
};
