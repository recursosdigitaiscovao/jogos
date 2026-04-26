let itensAtuais = Array(10).fill({}); // Necessário para o template calcular o total
let indiceAtual = 0; // Controla a ronda (tabuleiro) de 0 a 9
let acertos = 0; // Total de pares encontrados (para o badge)
let erros = 0;
let tempoInicio;
let intervaloTimer;

let cartasNoGrid = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let paresEncontradosNestaRonda = 0;
let totalParesNecessarios = 0;

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
            <p style="font-weight:900; color:var(--primary-blue); text-align:center;">MEMÓRIA: IMAGEM + PALAVRA</p>
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
    proximaRodada(); 
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

function proximaRodada() {
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;
    paresEncontradosNestaRonda = 0;
    
    // DEFINIÇÃO DOS NÍVEIS
    if (indiceAtual < 3) totalParesNecessarios = 3;      // Nível 1: 6 cartas (Rondas 1, 2, 3)
    else if (indiceAtual < 6) totalParesNecessarios = 4; // Nível 2: 8 cartas (Rondas 4, 5, 6)
    else totalParesNecessarios = 6;                      // Nível 3: 12 cartas (Rondas 7, 8, 9, 10)

    gerarTabuleiro(totalParesNecessarios);
}

function gerarTabuleiro(numPares) {
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
    
    // Ajuste de colunas conforme o nível e orientação
    let cols = 3;
    if (totalParesNecessarios === 4) cols = isMobile ? 2 : 4;
    if (totalParesNecessarios === 6) cols = isMobile ? 3 : 4;
    
    container.innerHTML = `
        <div id="memory-board" style="
            display: grid; 
            grid-template-columns: repeat(${cols}, 1fr); 
            gap: 8px; 
            width: 100%; 
            height: 100%; 
            max-width: 600px;
            padding: 5px; 
            align-content: center;
            margin: auto;
        ">
            ${cartasNoGrid.map((carta, i) => `
                <div class="card-box" id="card-${i}" onclick="virarCarta(this, ${i})" style="
                    aspect-ratio: 1 / 1.2;
                    background: var(--primary-blue);
                    border-radius: 12px;
                    border: 3px solid white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    color: white;
                    font-size: min(8vw, 30px);
                    transition: transform 0.4s, opacity 0.3s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transform-style: preserve-3d;
                    user-select: none;
                ">?</div>
            `).join('')}
        </div>
    `;
}

window.virarCarta = function(el, idx) {
    if (bloqueado || el.classList.contains('flipped') || el.style.visibility === "hidden") return;

    const info = cartasNoGrid[idx];
    el.classList.add('flipped');
    el.style.transform = "rotateY(180deg)";
    el.style.background = "white";
    
    if (info.tipo === 'img') {
        el.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${info.conteudo}" style="width:85%; transform: rotateY(180deg); pointer-events:none;">`;
    } else {
        el.innerHTML = `<span style="font-size: min(3.5vw, 13px); color: var(--primary-blue); transform: rotateY(180deg); text-transform:uppercase; text-align:center; padding:2px; line-height:1;">${info.conteudo}</span>`;
    }

    if (!primeiraCarta) {
        primeiraCarta = { el, idx, id: info.id };
    } else {
        segundaCarta = { el, idx, id: info.id };
        bloqueado = true;
        verificarPar();
    }
};

function verificarPar() {
    if (primeiraCarta.id === segundaCarta.id && primeiraCarta.idx !== segundaCarta.idx) {
        // ACERTO
        somAcerto.play();
        acertos++;
        paresEncontradosNestaRonda++;
        document.getElementById('hits-val').innerText = acertos;

        setTimeout(() => {
            // DESAPARECER
            primeiraCarta.el.style.visibility = "hidden";
            segundaCarta.el.style.visibility = "hidden";
            resetVariaveisTurno();

            // Se todos os pares do tabuleiro foram encontrados, passa de ronda
            if (paresEncontradosNestaRonda === totalParesNecessarios) {
                indiceAtual++;
                setTimeout(proximaRodada, 500);
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
            resetVariaveisTurno();
        }, 1000);
    }
}

function resetVariaveisTurno() {
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
