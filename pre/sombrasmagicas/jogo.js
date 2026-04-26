let categoriaAtual = 'domesticos';
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let segundos = 0;
let timerInterval;
let itensNaRonda = [];
let totalItensConcluidosNaRonda = 0;

// Estilos Dinâmicos e Animações do Tutorial
const gameStyle = document.createElement('style');
gameStyle.innerHTML = `
    .game-area { display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-evenly; align-items: center; padding: 5px; }
    .row-shadows, .row-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; max-width: 800px; justify-items: center; align-items: center; }
    @media (min-width: 768px) { .row-shadows, .row-images { grid-template-columns: repeat(6, 1fr); } }
    
    .slot-sombra { width: 100%; max-width: 110px; aspect-ratio: 1/1; border: 3px dashed #cbd9e6; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.4); position: relative; }
    .img-sombra { width: 75%; height: 75%; object-fit: contain; filter: brightness(0); opacity: 0.15; pointer-events: none; }
    
    .peça-cor { width: 100%; max-width: 110px; aspect-ratio: 1/1; cursor: grab; touch-action: none; display: flex; align-items: center; justify-content: center; background: white; border-radius: 20px; box-shadow: 0 6px 12px rgba(0,0,0,0.08); z-index: 10; user-select: none; }
    .peça-cor img { width: 75%; height: 75%; object-fit: contain; pointer-events: none; }
    
    .peça-cor.dragging { opacity: 0.9; transform: scale(1.15); cursor: grabbing; box-shadow: 0 15px 30px rgba(0,0,0,0.2); z-index: 5000; }
    .acertou { border-color: #7ed321 !important; background: #f0fff0 !important; border-style: solid !important; }
    .acertou .img-sombra { filter: none !important; opacity: 1 !important; transform: scale(1.1); transition: 0.4s; }
    .target-hover { border-color: var(--primary-blue) !important; transform: scale(1.05); }

    /* --- ANIMAÇÃO DO TUTORIAL --- */
    .tutorial-container { position: relative; width: 250px; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; }
    .hand-icon { 
        position: absolute; font-size: 40px; color: #ffcc00; z-index: 100; 
        filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2));
        pointer-events: none;
        animation: demoMove 3s infinite ease-in-out;
    }
    .demo-piece { animation: pieceMove 3s infinite ease-in-out; }
    .demo-shadow-target.active-demo { animation: shadowMatch 3s infinite ease-in-out; }

    @keyframes demoMove {
        0% { top: 140px; left: 100px; opacity: 0; }
        15% { top: 140px; left: 100px; opacity: 1; }
        60% { top: 30px; left: 100px; opacity: 1; }
        80% { top: 30px; left: 100px; opacity: 0; }
        100% { top: 140px; left: 100px; opacity: 0; }
    }
    @keyframes pieceMove {
        0% { transform: translateY(0); opacity: 1; }
        15% { transform: translateY(0); opacity: 1; }
        60% { transform: translateY(-110px); opacity: 1; }
        61% { opacity: 0; }
        100% { opacity: 0; }
    }
    @keyframes shadowMatch {
        0%, 59% { filter: brightness(0); opacity: 0.15; background: rgba(255,255,255,0.4); border-color: #cbd9e6; }
        60%, 85% { filter: none; opacity: 1; background: #f0fff0; border-color: #7ed321; }
        100% { filter: brightness(0); opacity: 0.15; }
    }
`;
document.head.appendChild(gameStyle);

function startLogic() { 
    selecionarCategoria('domesticos'); 
    renderIntroAnimation(); 
}

function selecionarCategoria(key) { 
    categoriaAtual = key; 
    rondaAtual = 1; acertos = 0; erros = 0; segundos = 0; 
}

function renderIntroAnimation() {
    const container = document.getElementById('intro-animation-container');
    const instrText = document.getElementById('intro-instr');
    const cat = JOGO_CONFIG.categorias[categoriaAtual];
    
    instrText.innerText = cat.intro || "Arrasta as imagens para as sombras!";

    // Criamos uma mini-cena de demonstração
    container.innerHTML = `
        <div class="tutorial-container">
            <i class="fas fa-hand-pointer hand-icon"></i>
            
            <!-- Sombra Alvo -->
            <div class="slot-sombra demo-shadow-target active-demo" style="width:80px; height:80px;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" class="img-sombra">
            </div>

            <!-- Peça que se move -->
            <div class="peça-cor demo-piece" style="width:80px; height:80px;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}">
            </div>
            
            <h3 style="color:var(--primary-blue); font-weight:900; margin-top:10px;">${cat.nome}</h3>
        </div>
    `;
}

function initGame() {
    rondaAtual = 1; acertos = 0; erros = 0; segundos = 0;
    document.getElementById('timer-val').innerText = "00:00";
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        segundos++;
        const m = Math.floor(segundos / 60).toString().padStart(2, '0');
        const s = (segundos % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
    proximaRonda();
}

function proximaRonda() {
    const cat = JOGO_CONFIG.categorias[categoriaAtual];
    if (rondaAtual > 10) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${rondaAtual} / 10`;
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    let embaralhados = [...cat.itens].sort(() => 0.5 - Math.random());
    itensNaRonda = embaralhados.slice(0, 6);
    totalItensConcluidosNaRonda = 0;
    renderizarTabuleiro();
}

function renderizarTabuleiro() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = `<div class="game-area"><div class="row-shadows" id="container-sombras"></div><div class="row-images" id="container-pecas"></div></div>`;
    const cSombras = document.getElementById('container-sombras');
    const cPecas = document.getElementById('container-pecas');
    
    itensNaRonda.forEach(item => {
        const div = document.createElement('div'); div.className = 'slot-sombra'; div.dataset.id = item.id;
        div.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" class="img-sombra">`;
        cSombras.appendChild(div);
    });

    [...itensNaRonda].sort(() => 0.5 - Math.random()).forEach(item => {
        const div = document.createElement('div'); div.className = 'peça-cor'; div.dataset.id = item.id;
        div.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}">`;
        initDragLogic(div); cPecas.appendChild(div);
    });
}

function initDragLogic(el) {
    let startX, startY, initialRect, currentTarget = null;
    el.onpointerdown = (e) => {
        el.setPointerCapture(e.pointerId); el.classList.add('dragging');
        initialRect = el.getBoundingClientRect(); startX = e.clientX; startY = e.clientY;
        el.style.position = 'fixed'; el.style.left = initialRect.left + 'px'; el.style.top = initialRect.top + 'px';
        el.style.width = initialRect.width + 'px'; el.style.height = initialRect.height + 'px'; el.style.margin = '0';
    };
    el.onpointermove = (e) => {
        if (!el.classList.contains('dragging')) return;
        el.style.left = (initialRect.left + (e.clientX - startX)) + 'px'; el.style.top = (initialRect.top + (e.clientY - startY)) + 'px';
        el.style.visibility = 'hidden'; let elementBelow = document.elementFromPoint(e.clientX, e.clientY); el.style.visibility = 'visible';
        let slot = elementBelow?.closest('.slot-sombra');
        document.querySelectorAll('.slot-sombra').forEach(s => s.classList.remove('target-hover'));
        if (slot && !slot.classList.contains('acertou')) { slot.classList.add('target-hover'); currentTarget = slot; } else { currentTarget = null; }
    };
    el.onpointerup = (e) => {
        if (!el.classList.contains('dragging')) return; el.classList.remove('dragging');
        document.querySelectorAll('.slot-sombra').forEach(s => s.classList.remove('target-hover'));
        if (currentTarget && currentTarget.dataset.id === el.dataset.id) {
            acertos++; totalItensConcluidosNaRonda++; playSound(JOGO_CONFIG.sons.acerto);
            currentTarget.classList.add('acertou'); el.remove();
            document.getElementById('hits-val').innerText = acertos;
            if (totalItensConcluidosNaRonda === 6) setTimeout(() => { rondaAtual++; proximaRonda(); }, 800);
        } else {
            if (currentTarget) { erros++; playSound(JOGO_CONFIG.sons.erro); document.getElementById('miss-val').innerText = erros; }
            el.style.position = 'static'; el.style.width = ''; el.style.height = ''; el.style.left = ''; el.style.top = '';
        }
    };
}

function playSound(url) { const audio = new Audio(url); audio.volume = 0.3; audio.play().catch(() => {}); }
function finalizarJogo() { clearInterval(timerInterval); playSound(JOGO_CONFIG.sons.vitoria); window.mostrarResultados(acertos, document.getElementById('timer-val').innerText); }
