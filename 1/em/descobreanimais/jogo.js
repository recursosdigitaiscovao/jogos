let categoriaAtual = "nivel1";
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;
let lanternaAtiva = false; 

const COR_CASTANHA = "#6C3737"; 

// 1. INICIALIZAÇÃO
window.startLogic = function() {
    rondaAtual = 1;
    acertos = 0;
    erros = 0;
    jogoAtivo = false;
    ajudaDisponivel = true;
    lanternaAtiva = false;

    const statusBar = document.getElementById('status-bar');
    if(statusBar) {
        statusBar.style.display = "none";
        // BARRA REORGANIZADA COM ALTURAS IGUAIS (35px)
        statusBar.innerHTML = `
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" id="btn-ajuda-luz" style="cursor:pointer; background:rgba(255,255,255,0.2); height:35px; width:45px; display:flex; align-items:center; justify-content:center; border-radius:10px;">
                    <img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:24px;">
                </div>
                <div class="badge badge-round" style="background:var(--primary-blue); height:35px; padding:0 15px; display:flex; align-items:center; border-radius:10px; font-weight:900; white-space:nowrap;">
                    <span id="round-val">1 / 10</span>
                </div>
            </div>
            <div class="status-group" style="display:flex; gap:8px; align-items:center;">
                <div class="badge" style="background:#7ed321; height:35px; padding:0 12px; display:flex; align-items:center; border-radius:10px; font-weight:900;">
                    ✓ <span id="hits-val" style="margin-left:5px;">0</span>
                </div>
                <div class="badge" style="background:#ff5e5e; height:35px; padding:0 12px; display:flex; align-items:center; border-radius:10px; font-weight:900;">
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
    const lanternaMask = document.getElementById('lanterna');
    const focoBrilho = document.getElementById('flashlight-glow');
    const btnLuz = document.getElementById('btn-ajuda-luz');

    if(btnLuz) btnLuz.style.opacity = "0.2";

    // Mostra todos os animais removendo a máscara temporariamente
    lanternaMask.style.transition = "opacity 0.2s";
    lanternaMask.style.opacity = "0"; 
    
    // Tornar animais visíveis durante o relâmpago
    document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "1");

    setTimeout(() => {
        lanternaMask.style.opacity = "1";
        // Se a lanterna ainda não foi usada pelo toque, volta a esconder os animais
        if(!lanternaAtiva) {
            document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "0");
        }
        setTimeout(() => {
            ajudaDisponivel = true;
            if(btnLuz) btnLuz.style.opacity = "1";
        }, 5000);
    }, 1200);
}

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const animalExemplo = config.tipoAlvo === "domestico" ? "cao.png" : "leao.png";
    const textoTutorial = config.tipoAlvo === "domestico" ? "DOMÉSTICOS" : "SELVAGENS";

    container.innerHTML = `
        <style>
            .tutorial-wrap { display:flex; flex-direction:column; align-items:center; gap:10px; }
            .tutorial-box { position:relative; width:260px; height:140px; background:${COR_CASTANHA}; border-radius:20px; overflow:hidden; border:3px solid #fff; }
            .tut-spot { position:absolute; width:80px; height:80px; background:radial-gradient(circle, transparent 10%, ${COR_CASTANHA} 80%); z-index:10; transform:translate(-50%,-50%); animation:moveTut 4s infinite ease-in-out; }
            .tut-animal { position:absolute; width:50px; left:70%; top:50%; transform:translate(-50%,-50%); z-index:5; animation:revealTut 4s infinite ease-in-out; }
            @keyframes moveTut { 0%,100% {left:25%; top:35%;} 50% {left:75%; top:55%;} }
            @keyframes revealTut { 0%,30%,70%,100% {opacity:0;} 45%,55% {opacity:1;} }
        </style>
        <div class="tutorial-wrap">
            <div style="font-weight:900; color:var(--primary-blue); font-size:14px;">ENCONTRA OS ${textoTutorial}</div>
            <div class="tutorial-box"><div class="tut-spot"></div><img src="${JOGO_CONFIG.caminhoImg}${config.pastaAlvos}${animalExemplo}" class="tut-animal"></div>
        </div>
    `;
}

// 2. MOTOR DO JOGO
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
            :root { --raio-foco: 85px; }
            @media (max-width: 600px) { :root { --raio-foco: 65px; } }

            #night-zone { position: relative; width: 100%; height: 100%; background: ${COR_CASTANHA}; overflow: hidden; cursor: none; border-radius: 25px; touch-action: none; }
            .spotlight-mask { 
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                background: ${COR_CASTANHA}; pointer-events: none; z-index: 10; 
                --x: 50%; --y: 50%; 
                mask-image: radial-gradient(circle var(--raio-foco) at var(--x) var(--y), transparent 0%, black 95%); 
                -webkit-mask-image: radial-gradient(circle var(--raio-foco) at var(--x) var(--y), transparent 0%, black 95%); 
                transition: opacity 0.3s;
            }
            #flashlight-glow { 
                position: absolute; width: calc(var(--raio-foco) * 2.2); height: calc(var(--raio-foco) * 2.2); 
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 75%);
                pointer-events: none; z-index: 11; transform: translate(-50%, -50%); 
                opacity: 0;
            }
            /* Animais começam invisíveis */
            .animal-item { position: absolute; width: 70px; height: 70px; object-fit: contain; cursor: pointer; z-index: 5; opacity: 0; transition: opacity 0.3s; }
            #instrucao-ronda { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); background: white; padding: 6px 25px; border-radius: 30px; font-weight: 900; z-index: 20; color: ${COR_CASTANHA}; box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-transform: uppercase; font-size: 1.1rem; pointer-events: none; }
        </style>
        <div id="night-zone">
            <div id="instrucao-ronda">...</div>
            <div id="flashlight-glow"></div>
            <div class="spotlight-mask" id="lanterna"></div>
        </div>
    `;

    const zone = document.getElementById('night-zone');
    const mover = (e) => {
        if(!lanternaAtiva) {
            lanternaAtiva = true;
            document.getElementById('flashlight-glow').style.opacity = "1";
            // Ao tocar, todos os animais ficam com opacity 1, mas a máscara "black" esconde os que estão fora do foco
            document.querySelectorAll('.animal-item').forEach(img => img.style.opacity = "1");
        }

        const rect = zone.getBoundingClientRect();
        const clientX = (e.clientX || (e.touches ? e.touches[0].clientX : 0));
        const clientY = (e.clientY || (e.touches ? e.touches[0].clientY : 0));
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const lan = document.getElementById('lanterna');
        const glo = document.getElementById('flashlight-glow');
        if(lan) { lan.style.setProperty('--x', `${x}px`); lan.style.setProperty('--y', `${y}px`); }
        if(glo) { glo.style.left = `${x}px`; glo.style.top = `${y}px`; }
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
    
    // Apenas DOMÉSTICO ou SELVAGEM no topo
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
    const size = 75;
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
    img.style.left = `${pos.x - 35}px`;
    img.style.top = `${pos.y - 35}px`;
    // Se a lanterna já estiver ativa (em rondas seguintes), o animal já nasce visível
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
    document.getElementById('status-bar').style.display = "none";

    scrResult.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <div style="background: white; width: 95%; max-width: 400px; padding: 30px; border-radius: 35px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); text-align: center;">
                <h2 style="color: var(--primary-blue); font-weight: 900; margin-bottom: 10px;">${rank.titulo}</h2>
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width: 140px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-around; background: #f0f7ff; padding: 15px; border-radius: 20px; margin-bottom: 25px;">
                    <div><p style="font-size: 0.8rem; color: #88a; font-weight:700;">ACERTOS</p><p style="font-size: 1.5rem; font-weight: 900; color: #7ed321;">${acertos}</p></div>
                    <div style="width:1px; background:#ddd; height:40px; align-self:center;"></div>
                    <div><p style="font-size: 0.8rem; color: #88a; font-weight:700;">ERROS</p><p style="font-size: 1.5rem; font-weight: 900; color: #ff5e5e;">${erros}</p></div>
                </div>
                <button class="btn-jogar-stretch" onclick="goToIntro()">JOGAR NOVAMENTE</button>
            </div>
        </div>
    `;
    tocarSom(JOGO_CONFIG.sons.vitoria);
}

window.gerarIntroJogo = function() { 
    const config = JOGO_CATEGORIAS[categoriaAtual];
    return config.tipoAlvo === "domestico" ? "Encontra os animais DOMÉSTICOS na escuridão!" : "Encontra os animais SELVAGENS na escuridão!";
};
