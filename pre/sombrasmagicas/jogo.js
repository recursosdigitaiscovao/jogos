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
    .game-area { display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-evenly; align-items: center; }
    .row-shadows, .row-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 100%; max-width: 800px; justify-items: center; }
    @media (min-width: 768px) { .row-shadows, .row-images { grid-template-columns: repeat(6, 1fr); } }
    .slot-sombra { width: 100%; max-width: 100px; aspect-ratio: 1/1; border: 3px dashed #cbd9e6; border-radius: 15px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.4); position: relative; }
    .img-sombra { width: 75%; height: 75%; object-fit: contain; filter: brightness(0); opacity: 0.15; pointer-events: none; }
    .peça-cor { width: 100%; max-width: 100px; aspect-ratio: 1/1; cursor: grab; touch-action: none; display: flex; align-items: center; justify-content: center; background: white; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.08); z-index: 10; }
    .peça-cor img { width: 75%; height: 75%; object-fit: contain; pointer-events: none; }
    .peça-cor.dragging { opacity: 0.9; transform: scale(1.1); cursor: grabbing; box-shadow: 0 10px 20px rgba(0,0,0,0.2); z-index: 5000; }
    .acertou { border-color: #7ed321 !important; background: #f0fff0 !important; border-style: solid !important; }
    .acertou .img-sombra { filter: none !important; opacity: 1 !important; transform: scale(1.1); transition: 0.4s; }
    .target-hover { border-color: var(--primary-blue) !important; transform: scale(1.05); }

    .tutorial-box { position: relative; width: 220px; height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; }
    .hand-icon { position: absolute; font-size: 35px; color: #ffcc00; z-index: 100; animation: demoMove 3s infinite ease-in-out; pointer-events: none; }
    .demo-piece { animation: pieceMove 3s infinite ease-in-out; }
    .demo-shadow { animation: shadowMatch 3s infinite ease-in-out; }

    @keyframes demoMove { 0%, 10% { top: 110px; left: 80px; opacity: 0; } 20% { opacity: 1; } 70% { top: 10px; left: 80px; opacity: 1; } 85%, 100% { opacity: 0; } }
    @keyframes pieceMove { 0%, 20% { transform: translateY(0); opacity: 1; } 70%, 100% { transform: translateY(-100px); opacity: 0; } }
    @keyframes shadowMatch { 0%, 69% { filter: brightness(0); opacity: 0.15; background: rgba(255,255,255,0.4); } 70%, 90% { filter: none; opacity: 1; background: #f0fff0; } }
`;
document.head.appendChild(gameStyle);

function startLogic() { selecionarCategoria('domesticos'); renderIntroAnimation(); }
function selecionarCategoria(key) { categoriaAtual = key; rondaAtual = 1; acertos = 0; erros = 0; segundos = 0; }

function renderIntroAnimation() {
    const container = document.getElementById('intro-animation-container');
    const cat = JOGO_CONFIG.categorias[categoriaAtual];
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <p style="font-weight: 800; color: var(--text-grey); text-align: center; max-width: 250px;">${cat.intro || ""}</p>
            <div class="tutorial-box">
                <i class="fas fa-hand-pointer hand-icon"></i>
                <div class="slot-sombra demo-shadow" style="width:75px; height:75px;"><img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" class="img-sombra"></div>
                <div class="peça-cor demo-piece" style="width:75px; height:75px;"><img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}"></div>
            </div>
        </div>
    `;
}

function initGame() {
    rondaAtual = 1; acertos = 0; erros = 0; segundos = 0;
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
    container.innerHTML = `<div class="game-area"><div class="row-shadows" id="c-sombras"></div><div class="row-images" id="c-pecas"></div></div>`;
    itensNaRonda.forEach(item => {
        const div = document.createElement('div'); div.className = 'slot-sombra'; div.dataset.id = item.id;
        div.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" class="img-sombra">`;
        document.getElementById('c-sombras').appendChild(div);
    });
    [...itensNaRonda].sort(() => 0.5 - Math.random()).forEach(item => {
        const div = document.createElement('div'); div.className = 'peça-cor'; div.dataset.id = item.id;
        div.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}">`;
        initDrag(div); document.getElementById('c-pecas').appendChild(div);
    });
}

function initDrag(el) {
    let sX, sY, iX, iY, target = null;
    el.onpointerdown = (e) => {
        el.setPointerCapture(e.pointerId); el.classList.add('dragging');
        const r = el.getBoundingClientRect(); sX = e.clientX; sY = e.clientY; iX = r.left; iY = r.top;
        el.style.position = 'fixed'; el.style.left = iX+'px'; el.style.top = iY+'px';
        el.style.width = r.width+'px'; el.style.height = r.height+'px';
    };
    el.onpointermove = (e) => {
        if (!el.classList.contains('dragging')) return;
        el.style.left = (iX + (e.clientX - sX)) + 'px'; el.style.top = (iY + (e.clientY - sY)) + 'px';
        el.style.visibility = 'hidden'; let under = document.elementFromPoint(e.clientX, e.clientY); el.style.visibility = 'visible';
        let slot = under?.closest('.slot-sombra');
        document.querySelectorAll('.slot-sombra').forEach(s => s.classList.remove('target-hover'));
        if (slot && !slot.classList.contains('acertou')) { slot.classList.add('target-hover'); target = slot; } else { target = null; }
    };
    el.onpointerup = () => {
        if (!el.classList.contains('dragging')) return; el.classList.remove('dragging');
        if (target && target.dataset.id === el.dataset.id) {
            acertos++; totalItensConcluidosNaRonda++; playSound(JOGO_CONFIG.sons.acerto);
            target.classList.add('acertou'); el.remove();
            if (totalItensConcluidosNaRonda === 6) setTimeout(() => { rondaAtual++; proximaRonda(); }, 800);
        } else {
            if (target) { erros++; playSound(JOGO_CONFIG.sons.erro); }
            el.style.position = 'static'; el.style.width = ''; el.style.height = '';
        }
        document.getElementById('hits-val').innerText = acertos; document.getElementById('miss-val').innerText = erros;
    };
}
function playSound(u) { const a = new Audio(u); a.volume = 0.3; a.play().catch(()=>{}); }
function finalizarJogo() { clearInterval(timerInterval); playSound(JOGO_CONFIG.sons.vitoria); window.mostrarResultados(acertos, document.getElementById('timer-val').innerText); }
