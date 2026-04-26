let categoriaAtual = 'domesticos';
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let segundos = 0;
let timerInterval;
let itensNaRonda = [];
let totalItensConcluidosNaRonda = 0;

const gameStyle = document.createElement('style');
gameStyle.innerHTML = `
    .game-area { display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-evenly; align-items: center; padding: 5px; }
    .row-shadows, .row-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; max-width: 800px; justify-items: center; align-items: center; }
    @media (min-width: 768px) { .row-shadows, .row-images { grid-template-columns: repeat(6, 1fr); } }
    .slot-sombra { width: 100%; max-width: 110px; aspect-ratio: 1/1; border: 3px dashed #cbd9e6; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.4); position: relative; transition: transform 0.2s, border-color 0.2s; }
    .img-sombra { width: 75%; height: 75%; object-fit: contain; filter: brightness(0); opacity: 0.15; pointer-events: none; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .peça-cor { width: 100%; max-width: 110px; aspect-ratio: 1/1; cursor: grab; touch-action: none; display: flex; align-items: center; justify-content: center; background: white; border-radius: 20px; box-shadow: 0 6px 12px rgba(0,0,0,0.08); z-index: 10; user-select: none; }
    .peça-cor img { width: 75%; height: 75%; object-fit: contain; pointer-events: none; }
    .peça-cor.dragging { opacity: 0.9; transform: scale(1.15); cursor: grabbing; box-shadow: 0 15px 30px rgba(0,0,0,0.2); z-index: 5000; }
    .acertou { border-color: #7ed321 !important; background: #f0fff0 !important; border-style: solid !important; }
    .acertou .img-sombra { filter: none !important; opacity: 1 !important; transform: scale(1.1); }
    .target-hover { border-color: var(--primary-blue) !important; transform: scale(1.05); }
    #intro-animation-container { flex:1; width:100%; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.5); border-radius:30px; margin-bottom:15px; border:3px dashed rgba(0,0,0,0.05); }
`;
document.head.appendChild(gameStyle);

function startLogic() { selecionarCategoria('domesticos'); renderIntroAnimation(); }
function selecionarCategoria(key) { categoriaAtual = key; rondaAtual = 1; acertos = 0; erros = 0; segundos = 0; }

function renderIntroAnimation() {
    const container = document.getElementById('intro-animation-container');
    const cat = JOGO_CONFIG.categorias[categoriaAtual];
    container.innerHTML = `
        <div style="text-align:center">
            <div style="display:flex; gap:20px; justify-content:center; align-items:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:80px; filter:brightness(0); opacity:0.2">
                <i class="fas fa-magic" style="color:var(--primary-blue); font-size:25px;"></i>
                <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:80px;">
            </div>
            <p style="margin-top:20px; color:var(--text-grey); font-weight:900; font-size:1.2rem;">TEMA: ${cat.nome.toUpperCase()}</p>
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
