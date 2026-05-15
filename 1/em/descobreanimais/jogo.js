let categoriaAtual = "nivel1";
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;
let lanternaAtiva = false; 

const COR_CASTANHA = "#6C3737"; 

// 1. INICIALIZAÇÃO E BARRA DE STATUS
window.startLogic = function() {
    rondaAtual = 1;
    acertos = 0;
    erros = 0;
    ajudasUtilizadas = 0;
    jogoAtivo = false;
    ajudaDisponivel = true;
    lanternaAtiva = false;

    const statusBar = document.getElementById('status-bar');
    if(statusBar) {
        statusBar.style.display = "none";
        // BARRA COM ALTURA CORRIGIDA (35px exatos)
        statusBar.innerHTML = `
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" id="btn-ajuda-luz" style="cursor:pointer; background:rgba(255,255,255,0.2); height:35px; width:45px; display:flex; align-items:center; justify-content:center; border-radius:12px;">
                    <img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:22px;">
                </div>
                <div class="badge" style="background:var(--primary-blue); height:35px; padding:0 12px; display:flex; align-items:center; border-radius:12px; font-weight:900; color:white; font-size:13px;">
                    <span id="round-val">1 / 10</span>
                </div>
            </div>
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" style="background:#7ed321; height:35px; padding:0 12px; display:flex; align-items:center; border-radius:12px; font-weight:900; color:white;">
                    ✓ <span id="hits-val" style="margin-left:5px;">0</span>
                </div>
                <div class="badge" style="background:#ff5e5e; height:35px; padding:0 12px; display:flex; align-items:center; border-radius:12px; font-weight:900; color:white;">
                    ✗ <span id="miss-val" style="margin-left:5px;">0</span>
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
    ajudaDisponivel = false;
    ajudasUtilizadas++; // Conta a ajuda
    
    const lanternaMask = document.getElementById('lanterna');
    const btnLuz = document.getElementById('btn-ajuda-luz');
    if(btnLuz) btnLuz.style.opacity = "0.2";

    lanternaMask.style.transition = "opacity 0.2s";
    lanternaMask.style.opacity = "0"; 
    document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "1");

    setTimeout(() => {
        lanternaMask.style.opacity = "1";
        if(!lanternaAtiva) {
            document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "0");
        }
        setTimeout(() => {
            ajudaDisponivel = true;
            if(btnLuz) btnLuz.style.opacity = "1";
        }, 5000);
    }, 1200);
}

// 2. EXPLICAÇÃO / TUTORIAL LIMPO
function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const animalExemplo = config.tipoAlvo === "domestico" ? "cao.png" : "leao.png";
    const textoTutorial = config.tipoAlvo === "domestico" ? "DOMÉSTICOS" : "SELVAGENS";

    container.innerHTML = `
        <style>
            .tutorial-wrap { display:flex; flex-direction:column; align-items:center; width:100%; }
            .tutorial-box { position:relative; width:280px; height:150px; background:${COR_CASTANHA}; border-radius:20px; overflow:hidden; border:2px solid #ccc; }
            .tut-spot { position:absolute; width:90px; height:90px; background:radial-gradient(circle, transparent 10%, ${COR_CASTANHA} 85%); z-index:10; transform:translate(-50%,-50%); animation:moveTut 4s infinite ease-in-out; }
            .tut-animal { position:absolute; width:55px; left:70%; top:50%; transform:translate(-50%,-50%); z-index:5; animation:revealTut 4s infinite ease-in-out; }
            .tut-txt { font-weight:900; color:var(--primary-blue); font-size:16px; margin-bottom:10px; text-transform:uppercase; }
            @keyframes moveTut { 0%,100% {left:25%; top:35%;} 50% {left:75%; top:55%;} }
            @keyframes revealTut { 0%,30%,70%,100% {opacity:0;} 45%,55% {opacity:1;} }
        </style>
        <div class="tutorial-wrap">
            <div class="tut-txt">Procura os animais ${textoTutorial}</div>
            <div class="tutorial-box">
                <div class="tut-spot"></div>
                <img src="${JOGO_CONFIG.caminhoImg}${config.pastaAlvos}${animalExemplo}" class="tut-animal">
            </div>
        </div>
    `;
}

// 3. MOTOR DO JOGO
window.initGame = function() {
    jogoAtivo = true;
    lanternaAtiva = false; 
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
            .spotlight-mask { 
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                background: ${COR_CASTANHA}; pointer-events: none; z-index: 10; 
                --x: 50%; --y: 50%; 
                mask-image: radial-gradient(circle 80px at var(--x) var(--y), transparent 0%, black 98%); 
                -webkit-mask-image: radial-gradient(circle 80px at var(--x) var(--y), transparent 0%, black 98%); 
            }
            .animal-item { position: absolute; width: 70px; height: 70px; object-fit: contain; cursor: pointer; z-index: 5; opacity: 0; transition: opacity 0.3s; }
            #instrucao-ronda { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); background: white; padding: 6px 30px; border-radius: 30px; font-weight: 900; z-index: 20; color: ${COR_CASTANHA}; box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-transform: uppercase; font-size: 1.1rem; pointer-events: none; }
        </style>
        <div id="night-zone">
            <div id="instrucao-ronda">...</div>
            <div class="spotlight-mask" id="lanterna"></div>
        </div>
    `;

    const zone = document.getElementById('night-zone');
    const mover = (e) => {
        if(!lanternaAtiva) {
            lanternaAtiva = true;
            document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "1");
        }
        const rect = zone.getBoundingClientRect();
        const clientX = (e.clientX || (e.touches ? e.touches[0].clientX : 0));
        const clientY = (e.clientY || (e.touches ? e.touches[0].clientY : 0));
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const lan = document.getElementById('lanterna');
        if(lan) { lan.style.setProperty('--x', `${x}px`); lan.style.setProperty('--y', `${y}px`); }
    };
    zone.addEventListener('mousemove', mover);
    zone.addEventListener('touchstart', mover);
    zone.addEventListener('touchmove', mover);
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
    const w = container.clientWidth;
    const h = container.clientHeight;
    const size = 78;
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
    if(lanternaAtiva) img.style.opacity = "1";

    img.onclick = (e) => {
        if (!jogoAtivo) return;
        const rect = zone.getBoundingClientRect();
        const x = (e.clientX || (e.touches ? e.touches[0].clientX : 0)) - rect.left;
        const y = (e.clientY || (e.touches ? e.touches[0].clientY : 0)) - rect.top;

        if (isCorrect) {
            jogoAtivo = false;
            mostrarFeedback("✓", "#7ed321", x, y);
            tocarSom(JOGO_CONFIG.sons.acerto);
            img.style.transform = "scale(1.8) rotate(12deg)";
            acertos++; rondaAtual++;
            setTimeout(() => { jogoAtivo = true; proximaRonda(); }, 800);
        } else {
            mostrarFeedback("✗", "#ff5e5e", x, y);
            tocarSom(JOGO_CONFIG.sons.erro);
            img.classList.add('shake');
            setTimeout(() => img.classList.remove('shake'), 300);
            erros++;
            img.style.opacity = "0.4";
            img.style.pointerEvents = "none";
        }
        atualizarPlacar();
    };
    zone.appendChild(img);
    return img;
}

function mostrarFeedback(t, c, x, y) {
    const fb = document.createElement('div');
    fb.innerText = t; 
    fb.style.cssText = `position:absolute; font-size:70px; font-weight:900; pointer-events:none; z-index:30; color:${c}; left:${x}px; top:${y}px; transform:translate(-50%,-50%); animation: popFeedback 0.6s ease-out forwards;`;
    document.getElementById('night-zone').appendChild(fb);
    setTimeout(() => fb.remove(), 600);
}

function atualizarPlacar() {
    const r = document.getElementById('round-val');
    const h = document.getElementById('hits-val');
    const m = document.getElementById('miss-val');
    if(r) r.innerText = `${rondaAtual} / 10`;
    if(h) h.innerText = acertos;
    if(m) m.innerText = erros;
}

function tocarSom(url) { new Audio(url).play().catch(()=>{}); }

// 4. ECRÃ DE RESULTADOS COMPLETO (SISTEMA PADRÃO)
function finalizarJogo() {
    jogoAtivo = false;
    const perc = Math.round((acertos / (acertos + erros)) * 100) || 0;
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const scrResult = document.getElementById('scr-result');
    scrResult.classList.add('active');
    document.getElementById('status-bar').style.display = "none";

    scrResult.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 15px; overflow-y: auto;">
            <div style="background: white; width: 100%; max-width: 400px; padding: 25px; border-radius: 35px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center;">
                <h2 style="color: var(--primary-blue); font-weight: 900; margin-bottom: 5px; font-size: 1.6rem;">${rank.titulo}</h2>
                <p style="color: #88a; font-weight: 700; font-size: 0.9rem; margin-bottom: 15px;">Concluíste o desafio!</p>
                
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width: 130px; margin-bottom: 20px;">
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #f0f7ff; padding: 15px; border-radius: 20px; margin-bottom: 25px;">
                    <div><p style="font-size: 0.7rem; color: #88a; font-weight:700;">CERTOS</p><p style="font-size: 1.2rem; font-weight: 900; color: #7ed321;">${acertos}</p></div>
                    <div><p style="font-size: 0.7rem; color: #88a; font-weight:700;">ERRADOS</p><p style="font-size: 1.2rem; font-weight: 900; color: #ff5e5e;">${erros}</p></div>
                    <div><p style="font-size: 0.7rem; color: #88a; font-weight:700;">AJUDAS</p><p style="font-size: 1.2rem; font-weight: 900; color: #ff9f43;">${ajudasUtilizadas}</p></div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button class="btn-jogar-stretch" onclick="goToIntro()" style="padding: 12px; font-size: 16px;">REPETIR</button>
                    <button class="btn-jogar-stretch" onclick="openRDMenu(event)" style="padding: 12px; font-size: 16px; background: #ff9f43; box-shadow: 0 6px 0 #d38336;">TEMAS</button>
                    <a href="${JOGO_CONFIG.linkVoltar}" class="btn-jogar-stretch" style="padding: 12px; font-size: 16px; background: #5d7082; box-shadow: 0 6px 0 #465461;">SAIR</a>
                </div>
            </div>
        </div>
    `;
    tocarSom(JOGO_CONFIG.sons.vitoria);
}

window.gerarIntroJogo = function() { 
    const config = JOGO_CATEGORIAS[categoriaAtual];
    return config.tipoAlvo === "domestico" ? "Encontra os animais DOMÉSTICOS na escuridão!" : "Encontra os animais SELVAGENS na escuridão!";
};
