let itensAtuais = Array(10).fill({}); // Para o template calcular o total
let indiceAtual = 0; // Total de pares encontrados
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let cartasNoGrid = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    CONFIG_MESTRE.area = key;

    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="display:flex; gap:10px;">
                <div class="demo-card" style="width:50px; height:70px; background:var(--primary-blue); border-radius:10px; border:3px solid white; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; font-weight:900; animation: flipDemo 3s infinite;">?</div>
                <div class="demo-card" style="width:50px; height:70px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--primary-blue); font-size:10px; font-weight:900; animation: flipDemo 3s infinite reverse;">${cat.exemplo}</div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue);">ENCONTRA OS PARES!</p>
        </div>
        <style>
            @keyframes flipDemo { 0%, 40% { transform: rotateY(0deg); background: var(--primary-blue); color:white; } 50%, 100% { transform: rotateY(180deg); background: white; color:var(--primary-blue); } }
        </style>`;
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarTimer(); 
    carregarNovoTabuleiro(); 
};

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoInicio = Date.now();
    intervaloTimer = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const m = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const s = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function carregarNovoTabuleiro() {
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    
    // Sorteia 4 pares (8 cartas) para mobile ficar bem visível, ou 6 pares (12 cartas) para PC
    const isMobile = window.innerWidth < 600;
    const numPares = isMobile ? 4 : 6;
    
    const categoria = JOGO_CONFIG.categorias[CONFIG_MESTRE.area];
    const itensSorteados = [...categoria.itens].sort(() => Math.random() - 0.5).slice(0, numPares);
    
    cartasNoGrid = [];
    itensSorteados.forEach(item => {
        cartasNoGrid.push({ id: item.nome, tipo: 'img', conteudo: item.img });
        cartasNoGrid.push({ id: item.nome, tipo: 'txt', conteudo: item.nome });
    });

    cartasNoGrid.sort(() => Math.random() - 0.5);
    montarGrid();
}

function montarGrid() {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 650;
    
    // Grid adaptativo: 3 colunas no mobile, 4 no tablet/PC
    const cols = isMobile ? 3 : 4;
    
    container.innerHTML = `
        <div id="memory-board" style="
            display: grid; 
            grid-template-columns: repeat(${cols}, 1fr); 
            gap: 10px; 
            width: 100%; 
            height: 100%; 
            max-width: 600px;
            padding: 10px; 
            align-content: center;
            margin: auto;
        ">
            ${cartasNoGrid.map((carta, i) => `
                <div class="card-box" id="box-${i}" onclick="virarCarta(this, ${i})" style="
                    aspect-ratio: 1 / 1.3;
                    background: var(--primary-blue);
                    border-radius: 12px;
                    border: 3px solid white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    color: white;
                    font-size: min(8vw, 35px);
                    transition: transform 0.4s, opacity 0.3s;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    transform-style: preserve-3d;
                ">?</div>
            `).join('')}
        </div>
    `;
}

window.virarCarta = function(el, idx) {
    if (bloqueado || el.classList.contains('flipped')) return;

    const info = cartasNoGrid[idx];
    el.classList.add('flipped');
    el.style.transform = "rotateY(180deg)";
    el.style.background = "white";
    
    if (info.tipo === 'img') {
        el.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${info.conteudo}" style="width:80%; transform: rotateY(180deg); pointer-events:none;">`;
    } else {
        el.innerHTML = `<span style="font-size: min(3vw, 12px); color: var(--primary-blue); transform: rotateY(180deg); text-transform:uppercase; text-align:center;">${info.conteudo}</span>`;
    }

    if (!primeiraCarta) {
        primeiraCarta = { el, idx, id: info.id };
    } else {
        segundaCarta = { el, idx, id: info.id };
        bloqueado = true;
        checkMatch();
    }
};

function checkMatch() {
    if (primeiraCarta.id === segundaCarta.id && primeiraCarta.idx !== segundaCarta.idx) {
        // ACERTO
        somAcerto.play();
        acertos++;
        indiceAtual++;
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('round-val').innerText = `${indiceAtual} / 10`;

        setTimeout(() => {
            // DESAPARECER
            primeiraCarta.el.style.visibility = "hidden";
            segundaCarta.el.style.visibility = "hidden";
            resetTurno();

            // Verificar se todas as cartas do tabuleiro atual sumiram
            const totalVisiveis = document.querySelectorAll('.card-box[style*="visibility: visible"], .card-box:not([style*="visibility"])').length;
            
            if (totalVisiveis === 0) {
                if (indiceAtual < 10) carregarNovoTabuleiro();
                else finalizarJogo();
            } else if (indiceAtual >= 10) {
                finalizarJogo();
            }
        }, 600);
    } else {
        // ERRO
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        
        setTimeout(() => {
            [primeiraCarta.el, segundaCarta.el].forEach(card => {
                card.style.transform = "rotateY(0deg)";
                card.style.background = "var(--primary-blue)";
                card.innerHTML = "?";
                card.classList.remove('flipped');
            });
            resetTurno();
        }, 1000);
    }
}

function resetTurno() {
    primeiraCarta = null;
    segundaCarta = null;
    bloqueado = false;
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    const tempo = document.getElementById('timer-val').innerText;
    window.mostrarResultados(acertos, tempo);
}
