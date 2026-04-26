let categoriaAtual = 'animais';
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let segundos = 0;
let timerInterval;
let itensNaRonda = [];
let totalItensConcluidos = 0;

// Configuração de Estilo Dinâmico para o Jogo de Sombras
const style = document.createElement('style');
style.innerHTML = `
    .game-area { display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-around; align-items: center; }
    .row-shadows { display: flex; gap: 20px; justify-content: center; width: 100%; }
    .row-images { display: flex; gap: 20px; justify-content: center; width: 100%; margin-top: 20px; }
    
    .slot-sombra { 
        width: 100px; height: 100px; border: 3px dashed #ccc; border-radius: 20px; 
        display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.03);
        position: relative;
    }
    .img-sombra { 
        width: 80%; height: 80%; object-fit: contain; 
        filter: brightness(0); opacity: 0.3; pointer-events: none;
    }
    
    .peça-cor { 
        width: 100px; height: 100px; cursor: grab; touch-action: none;
        display: flex; align-items: center; justify-content: center;
        background: white; border-radius: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        z-index: 10;
    }
    .peça-cor img { width: 80%; height: 80%; object-fit: contain; pointer-events: none; }
    .peça-cor.dragging { opacity: 0.7; transform: scale(1.1); cursor: grabbing; }
    
    .acertou { border-color: var(--highlight-green) !important; background: #f0fff0 !important; }
    .acertou .img-sombra { filter: none !important; opacity: 1 !important; transition: 0.5s; }

    @media (max-width: 600px) {
        .slot-sombra, .peça-cor { width: 80px; height: 80px; }
    }
`;
document.head.appendChild(style);

function startLogic() {
    selecionarCategoria(Object.keys(JOGO_CONFIG.categorias)[0]);
    renderIntroAnimation();
}

function selecionarCategoria(key) {
    categoriaAtual = key;
    rondaAtual = 1;
    acertos = 0;
    erros = 0;
    segundos = 0;
}

function renderIntroAnimation() {
    const container = document.getElementById('intro-animation-container');
    const cat = JOGO_CONFIG.categorias[categoriaAtual];
    container.innerHTML = `
        <div style="text-align:center">
            <div style="display:flex; gap:20px; justify-content:center; align-items:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:80px; filter:brightness(0); opacity:0.3">
                <i class="fas fa-arrow-right" style="color:#ccc; font-size:24px"></i>
                <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:80px;">
            </div>
            <p style="margin-top:15px; color:#88a; font-weight:bold;">TEMA: ${cat.nome.toUpperCase()}</p>
        </div>
    `;
}

function initGame() {
    rondaAtual = 1;
    acertos = 0;
    erros = 0;
    segundos = 0;
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
    if (rondaAtual > cat.totalRondas) {
        finalizarJogo();
        return;
    }

    document.getElementById('round-val').innerText = `${rondaAtual} / ${cat.totalRondas}`;
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;

    // Selecionar itens aleatórios para esta ronda
    const embaralhados = [...cat.itens].sort(() => 0.5 - Math.random());
    itensNaRonda = embaralhados.slice(0, cat.itensPorRonda);
    totalItensConcluidos = 0;

    renderizarTabuleiro();
}

function renderizarTabuleiro() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div class="game-area">
            <div class="row-shadows" id="container-sombras"></div>
            <div class="row-images" id="container-pecas"></div>
        </div>
    `;

    const containerSombras = document.getElementById('container-sombras');
    const containerPecas = document.getElementById('container-pecas');

    // Sombras (ordem fixa da seleção)
    itensNaRonda.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'slot-sombra';
        slot.dataset.id = item.id;
        slot.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" class="img-sombra">`;
        containerSombras.appendChild(slot);
    });

    // Peças coloridas (embaralhadas para a criança procurar)
    [...itensNaRonda].sort(() => 0.5 - Math.random()).forEach(item => {
        const peca = document.createElement('div');
        peca.className = 'peça-cor';
        peca.dataset.id = item.id;
        peca.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}">`;
        
        // Adicionar eventos de Drag
        initDragEvents(peca);
        
        containerPecas.appendChild(peca);
    });
}

function initDragEvents(el) {
    let startX, startY, initialX, initialY;
    let currentTarget = null;

    el.onpointerdown = (e) => {
        el.setPointerCapture(e.pointerId);
        el.classList.add('dragging');
        
        const rect = el.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialX = rect.left;
        initialY = rect.top;

        el.style.position = 'fixed';
        el.style.left = initialX + 'px';
        el.style.top = initialY + 'px';
        el.style.width = rect.width + 'px';
        el.style.height = rect.height + 'px';
    };

    el.onpointermove = (e) => {
        if (!el.classList.contains('dragging')) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        el.style.left = (initialX + dx) + 'px';
        el.style.top = (initialY + dy) + 'px';

        // Check hover over shadow
        el.style.display = 'none';
        let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        el.style.display = 'flex';

        let shadowSlot = elemBelow?.closest('.slot-sombra');
        document.querySelectorAll('.slot-sombra').forEach(s => s.style.transform = 'scale(1)');
        if (shadowSlot && !shadowSlot.classList.contains('acertou')) {
            shadowSlot.style.transform = 'scale(1.1)';
            currentTarget = shadowSlot;
        } else {
            currentTarget = null;
        }
    };

    el.onpointerup = (e) => {
        el.classList.remove('dragging');
        document.querySelectorAll('.slot-sombra').forEach(s => s.style.transform = 'scale(1)');

        if (currentTarget && currentTarget.dataset.id === el.dataset.id) {
            // ACERTO
            acertos++;
            playSound(JOGO_CONFIG.sons.acerto);
            currentTarget.classList.add('acertou');
            el.remove();
            totalItensConcluidos++;
            
            document.getElementById('hits-val').innerText = acertos;

            if (totalItensConcluidos === itensNaRonda.length) {
                setTimeout(() => {
                    rondaAtual++;
                    proximaRonda();
                }, 800);
            }
        } else {
            // ERRO ou soltou fora
            if (currentTarget) {
                erros++;
                playSound(JOGO_CONFIG.sons.erro);
                document.getElementById('miss-val').innerText = erros;
            }
            // Reset position
            el.style.position = 'static';
            el.style.width = '';
            el.style.height = '';
        }
    };
}

function playSound(url) {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(() => {});
}

function finalizarJogo() {
    clearInterval(timerInterval);
    playSound(JOGO_CONFIG.sons.vitoria);
    const tempoFinal = document.getElementById('timer-val').innerText;
    mostrarResultados(acertos, tempoFinal);
}
