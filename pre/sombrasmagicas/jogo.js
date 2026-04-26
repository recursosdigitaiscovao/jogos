let categoriaAtual = 'animais';
let rondaAtual = 1;
let acertos = 0;
let erros = 0;
let segundos = 0;
let timerInterval;
let itensNaRonda = [];
let totalItensConcluidos = 0;

// Estilos Dinâmicos Otimizados para 6 Itens
const style = document.createElement('style');
style.innerHTML = `
    .game-area { 
        display: flex; flex-direction: column; width: 100%; height: 100%; 
        justify-content: center; align-items: center; gap: 10px;
    }
    .row-shadows, .row-images { 
        display: grid; 
        grid-template-columns: repeat(6, 1fr); 
        gap: 10px; width: 100%; max-width: 900px; 
        justify-items: center;
    }
    
    .slot-sombra { 
        width: 100%; max-width: 120px; aspect-ratio: 1/1;
        border: 3px dashed #ccc; border-radius: 15px; 
        display: flex; align-items: center; justify-content: center; 
        background: rgba(255,255,255,0.4); position: relative;
    }
    .img-sombra { 
        width: 75%; height: 75%; object-fit: contain; 
        filter: brightness(0); opacity: 0.2; pointer-events: none;
    }
    
    .peça-cor { 
        width: 100%; max-width: 120px; aspect-ratio: 1/1;
        cursor: grab; touch-action: none;
        display: flex; align-items: center; justify-content: center;
        background: white; border-radius: 15px; 
        box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 10;
    }
    .peça-cor img { width: 75%; height: 75%; object-fit: contain; pointer-events: none; }
    .peça-cor.dragging { opacity: 0.8; transform: scale(1.1); cursor: grabbing; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
    
    .acertou { border-color: var(--highlight-green) !important; background: #e8f5e9 !important; border-style: solid !important; }
    .acertou .img-sombra { filter: none !important; opacity: 1 !important; transition: 0.4s transform ease-out, 0.4s opacity; transform: scale(1.1); }

    /* Ajuste para ecrãs pequenos (Mobile) */
    @media (max-width: 700px) {
        .row-shadows, .row-images { grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .slot-sombra, .peça-cor { max-width: 90px; }
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
            <div style="display:flex; gap:15px; justify-content:center; align-items:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:70px; filter:brightness(0); opacity:0.2">
                <i class="fas fa-magic" style="color:var(--primary-blue); font-size:20px"></i>
                <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:70px;">
            </div>
            <p style="margin-top:15px; color:var(--text-grey); font-weight:900; font-size:1.1rem;">TEMA: ${cat.nome.toUpperCase()}</p>
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

    // Selecionar 6 itens aleatórios para esta ronda
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
            <div style="height:10px;"></div>
            <div class="row-images" id="container-pecas"></div>
        </div>
    `;

    const containerSombras = document.getElementById('container-sombras');
    const containerPecas = document.getElementById('container-pecas');

    // Renderizar Sombras
    itensNaRonda.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'slot-sombra';
        slot.dataset.id = item.id;
        slot.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" class="img-sombra">`;
        containerSombras.appendChild(slot);
    });

    // Renderizar Peças (Embaralhadas)
    [...itensNaRonda].sort(() => 0.5 - Math.random()).forEach(item => {
        const peca = document.createElement('div');
        peca.className = 'peça-cor';
        peca.dataset.id = item.id;
        peca.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}">`;
        
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

        // Detetar sobreposição
        el.style.visibility = 'hidden';
        let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        el.style.visibility = 'visible';

        let shadowSlot = elemBelow?.closest('.slot-sombra');
        
        // Feedback visual no alvo
        document.querySelectorAll('.slot-sombra').forEach(s => s.style.borderColor = '#ccc');
        if (shadowSlot && !shadowSlot.classList.contains('acertou')) {
            shadowSlot.style.borderColor = 'var(--primary-blue)';
            currentTarget = shadowSlot;
        } else {
            currentTarget = null;
        }
    };

    el.onpointerup = (e) => {
        if (!el.classList.contains('dragging')) return;
        el.classList.remove('dragging');
        document.querySelectorAll('.slot-sombra').forEach(s => s.style.borderColor = '#ccc');

        if (currentTarget && currentTarget.dataset.id === el.dataset.id) {
            // ACERTO MÁGICO
            acertos++;
            playSound(JOGO_CONFIG.sons.acerto);
            currentTarget.classList.add('acertou');
            el.style.display = 'none';
            totalItensConcluidos++;
            
            document.getElementById('hits-val').innerText = acertos;

            if (totalItensConcluidos === itensNaRonda.length) {
                setTimeout(() => {
                    rondaAtual++;
                    proximaRonda();
                }, 1000);
            }
        } else {
            // ERRO (apenas se soltou em cima de uma sombra errada)
            if (currentTarget) {
                erros++;
                playSound(JOGO_CONFIG.sons.erro);
                document.getElementById('miss-val').innerText = erros;
            }
            // Volta para a posição original
            el.style.position = 'static';
            el.style.width = '';
            el.style.height = '';
        }
    };
}

function playSound(url) {
    const audio = new Audio(url);
    audio.volume = 0.4;
    audio.play().catch(() => {});
}

function finalizarJogo() {
    clearInterval(timerInterval);
    playSound(JOGO_CONFIG.sons.vitoria);
    const tempoFinal = document.getElementById('timer-val').innerText;
    mostrarResultados(acertos, tempoFinal);
}
