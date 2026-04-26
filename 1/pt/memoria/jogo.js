let itensAtuais = Array(10).fill({}); // Necessário para o cálculo de % no index.html
let indiceAtual = 0; // Pares encontrados (Rondas)
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let cartasData = [];
let primeiraEscolha = null;
let segundaEscolha = null;
let bloqueioTabuleiro = false;

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO (Simula o Flip)
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    CONFIG_MESTRE.area = key;

    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="display:flex; gap:15px;">
                <div class="demo-card" style="width:50px; height:70px; background:var(--primary-blue); border-radius:10px; border:3px solid white; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; font-weight:900; animation: flipDemo 3s infinite;">?</div>
                <div class="demo-card" style="width:50px; height:70px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--primary-blue); font-size:10px; font-weight:900; animation: flipDemo 3s infinite reverse;">${cat.exemplo}</div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-transform:uppercase;">ENCONTRA OS PARES!</p>
        </div>
        <style>
            @keyframes flipDemo { 0%, 40% { transform: rotateY(0deg); background: var(--primary-blue); color:white; } 50%, 100% { transform: rotateY(180deg); background: white; color:var(--primary-blue); } }
            @keyframes cardPop { from { transform: scale(0.8); opacity:0; } to { transform: scale(1); opacity:1; } }
        </style>`;
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarTimer(); 
    gerarNovoTabuleiro(); 
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

function gerarNovoTabuleiro() {
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    
    // Pegar 6 itens aleatórios para fazer 12 cartas (espaço ideal para mobile)
    const categoria = JOGO_CONFIG.categorias[CONFIG_MESTRE.area];
    const itensSorteados = [...categoria.itens].sort(() => Math.random() - 0.5).slice(0, 6);
    
    cartasData = [];
    itensSorteados.forEach(item => {
        cartasData.push({ id: item.nome, tipo: 'img', conteudo: item.img });
        cartasData.push({ id: item.nome, tipo: 'txt', conteudo: item.nome });
    });

    cartasData.sort(() => Math.random() - 0.5);
    montarGrid();
}

function montarInterface() { /* Função exigida pelo padrão, mas o grid é montado em montarGrid */ }

function montarGrid() {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 650;
    document.getElementById('round-val').innerText = `${indiceAtual} / 10`;

    container.innerHTML = `
        <div id="memory-grid" style="
            display: grid; 
            grid-template-columns: repeat(${isMobile ? 3 : 4}, 1fr); 
            gap: 10px; width: 100%; height: 100%; padding: 10px; align-content: center;
        ">
            ${cartasData.map((carta, i) => `
                <div class="m-card" onclick="virarCarta(this, ${i})" style="
                    aspect-ratio: 3/4; background: var(--primary-blue); border-radius: 12px; 
                    border: 3px solid white; cursor: pointer; display: flex; align-items: center; 
                    justify-content: center; font-weight: 900; color: white; font-size: 28px;
                    transition: 0.4s; box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
                    animation: cardPop 0.5s ease backwards ${i * 0.05}s;
                    transform-style: preserve-3d;
                ">?</div>
            `).join('')}
        </div>
    `;
}

window.virarCarta = function(el, idx) {
    if (bloqueioTabuleiro || el.classList.contains('flipped') || el.classList.contains('matched')) return;

    const info = cartasData[idx];
    el.classList.add('flipped');
    el.style.transform = "rotateY(180deg)";
    el.style.background = "white";
    
    if (info.tipo === 'img') {
        el.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${info.conteudo}" style="width:80%; transform: rotateY(180deg);">`;
    } else {
        el.innerHTML = `<span style="font-size: 10px; color: var(--primary-blue); transform: rotateY(180deg); text-transform:uppercase; text-align:center; padding:2px;">${info.conteudo}</span>`;
    }

    if (!primeiraEscolha) {
        primeiraEscolha = { el, idx, id: info.id };
    } else {
        segundaEscolha = { el, idx, id: info.id };
        bloqueioTabuleiro = true;
        validarPar();
    }
};

function validarPar() {
    if (primeiraEscolha.id === segundaEscolha.id) {
        // ACERTO
        somAcerto.play();
        primeiraEscolha.el.classList.add('matched');
        segundaEscolha.el.classList.add('matched');
        primeiraEscolha.el.style.borderColor = "#7ed321";
        segundaEscolha.el.style.borderColor = "#7ed321";
        
        acertos++;
        indiceAtual++;
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('round-val').innerText = `${indiceAtual} / 10`;

        limparTurno();

        // Verificar se limpou o tabuleiro
        const encontrados = document.querySelectorAll('.matched').length;
        if (encontrados === cartasData.length) {
            setTimeout(gerarNovoTabuleiro, 1000);
        } else if (indiceAtual >= 10) {
            setTimeout(finalizarJogo, 1000);
        }
    } else {
        // ERRO
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        
        setTimeout(() => {
            [primeiraEscolha.el, segundaEscolha.el].forEach(card => {
                card.style.transform = "rotateY(0deg)";
                card.style.background = "var(--primary-blue)";
                card.innerHTML = "?";
                card.classList.remove('flipped');
            });
            limparTurno();
        }, 1000);
    }
}

function limparTurno() {
    primeiraEscolha = null;
    segundaEscolha = null;
    bloqueioTabuleiro = false;
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    const tempo = document.getElementById('timer-val').innerText;
    window.mostrarResultados(acertos, tempo);
}
