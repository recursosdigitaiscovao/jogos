let jogoEstado = {
    categoria: null,
    nivelID: null,
    nivelDados: null,
    ronda: 1,
    acertosRonda: 0,
    totalAcertos: 0,
    erros: 0,
    tempo: 0,
    timerInterval: null,
    cartasViradas: [],
    bloquear: false
};

// --- INICIALIZAÇÃO ---
window.startLogic = function() {
    // Definir valores padrão caso o utilizador não escolha no RD
    jogoEstado.categoria = Object.keys(JOGO_CONFIG.categorias)[0];
    selecionarCategoria(jogoEstado.categoria);
};

function selecionarCategoria(key) {
    jogoEstado.categoria = key;
    // Quando escolhe categoria no RD, vamos mudar o título do menu RD para escolher nível
    const rdBox = document.getElementById('rd-list');
    const rdTitle = document.querySelector('#rdMenu h3');
    rdTitle.innerText = "Escolher Nível";
    rdBox.innerHTML = '';

    Object.keys(JOGO_CONFIG.niveis).forEach(n => {
        const niv = JOGO_CONFIG.niveis[n];
        const div = document.createElement('div');
        div.className = 'rd-item';
        div.innerHTML = `<div style="font-size:24px; font-weight:900;">${n}</div><span>${niv.nome}</span><small>${niv.cartas} Cartas</small>`;
        div.onclick = () => {
            jogoEstado.nivelID = n;
            jogoEstado.nivelDados = niv;
            closeMenus();
            goToIntro();
        };
        rdBox.appendChild(div);
    });
}

// Resetar o menu RD para categorias quando fechado ou ao início
function resetRDMenu() {
    const rdTitle = document.querySelector('#rdMenu h3');
    rdTitle.innerText = "Escolher Tema";
    const rdBox = document.getElementById('rd-list');
    rdBox.innerHTML = '';
    Object.keys(JOGO_CONFIG.categorias).forEach(key => {
        const c = JOGO_CONFIG.categorias[key];
        const div = document.createElement('div');
        div.className = 'rd-item';
        div.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${c.imgCapa}"><span>${c.nome}</span>`;
        div.onclick = () => selecionarCategoria(key);
        rdBox.appendChild(div);
    });
}

// Sobrescrever a função openRDMenu original para garantir o reset
const originalOpenRDMenu = window.openRDMenu;
window.openRDMenu = function(e) {
    resetRDMenu();
    originalOpenRDMenu(e);
}

// --- LÓGICA DO JOGO ---
window.initGame = function() {
    if(!jogoEstado.nivelID) { // Forçar nível 1 se não escolhido
        jogoEstado.nivelID = 1;
        jogoEstado.nivelDados = JOGO_CONFIG.niveis[1];
    }
    
    jogoEstado.ronda = 1;
    jogoEstado.totalAcertos = 0;
    jogoEstado.erros = 0;
    jogoEstado.tempo = 0;
    
    atualizarStatus();
    iniciarTimer();
    prepararRonda();
};

function iniciarTimer() {
    clearInterval(jogoEstado.timerInterval);
    jogoEstado.timerInterval = setInterval(() => {
        jogoEstado.tempo++;
        const min = Math.floor(jogoEstado.tempo / 60).toString().padStart(2, '0');
        const sec = (jogoEstado.tempo % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${min}:${sec}`;
    }, 1000);
}

function prepararRonda() {
    jogoEstado.acertosRonda = 0;
    jogoEstado.cartasViradas = [];
    jogoEstado.bloquear = false;
    
    document.getElementById('round-val').innerText = `${jogoEstado.ronda} / ${jogoEstado.nivelDados.rondas}`;
    
    const container = document.getElementById('game-main-content');
    container.innerHTML = '';
    
    // Configurar Grid
    const colunas = jogoEstado.nivelDados.cartas > 8 ? 4 : 3;
    container.style.gridTemplateColumns = `repeat(${colunas}, auto)`;

    // Selecionar itens aleatórios
    const cat = JOGO_CONFIG.categorias[jogoEstado.categoria];
    const itens = [...cat.itens].sort(() => 0.5 - Math.random()).slice(0, jogoEstado.nivelDados.pares);

    // Criar Deck (Imagem + Texto)
    let deck = [];
    itens.forEach(item => {
        deck.push({ ...item, tipo: 'img' });
        deck.push({ ...item, tipo: 'txt' });
    });
    deck.sort(() => 0.5 - Math.random());

    // Gerar HTML
    deck.forEach(item => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.dataset.nome = item.nome;
        
        const conteudo = item.tipo === 'img' 
            ? `<img src="${JOGO_CONFIG.caminhoImg}${cat.pastaImg}/${item.img}">` 
            : `<div class="texto-carta">${item.nome}</div>`;

        carta.innerHTML = `
            <div class="face frente">?</div>
            <div class="face verso">${conteudo}</div>
        `;
        
        carta.onclick = () => virarCarta(carta);
        container.appendChild(carta);
    });
}

function virarCarta(carta) {
    if (jogoEstado.bloquear || carta.classList.contains('virada')) return;

    tocarSom('pop'); // Som de clique
    carta.classList.add('virada');
    jogoEstado.cartasViradas.push(carta);

    if (jogoEstado.cartasViradas.length === 2) {
        verificarPar();
    }
}

function verificarPar() {
    jogoEstado.bloquear = true;
    const [c1, c2] = jogoEstado.cartasViradas;

    if (c1.dataset.nome === c2.dataset.nome) {
        tocarSom('acerto');
        jogoEstado.acertosRonda++;
        jogoEstado.totalAcertos++;
        jogoEstado.cartasViradas = [];
        jogoEstado.bloquear = false;
        atualizarStatus();

        if (jogoEstado.acertosRonda === jogoEstado.nivelDados.pares) {
            setTimeout(proximaRonda, 1000);
        }
    } else {
        tocarSom('erro');
        jogoEstado.erros++;
        atualizarStatus();
        setTimeout(() => {
            c1.classList.remove('virada');
            c2.classList.remove('virada');
            jogoEstado.cartasViradas = [];
            jogoEstado.bloquear = false;
        }, 1000);
    }
}

function proximaRonda() {
    if (jogoEstado.ronda < jogoEstado.nivelDados.rondas) {
        jogoEstado.ronda++;
        prepararRonda();
    } else {
        finalizarJogo();
    }
}

function atualizarStatus() {
    document.getElementById('hits-val').innerText = jogoEstado.totalAcertos;
    document.getElementById('miss-val').innerText = jogoEstado.erros;
}

function finalizarJogo() {
    clearInterval(jogoEstado.timerInterval);
    const tempoFinal = document.getElementById('timer-val').innerText;
    
    // Calcular precisão para o relatório
    const totalTentativas = jogoEstado.totalAcertos + jogoEstado.erros;
    const perc = Math.round((jogoEstado.totalAcertos / totalTentativas) * 100) || 0;
    
    // Usar a função global definida no teu HTML
    window.mostrarResultados(jogoEstado.totalAcertos, tempoFinal);
}

function tocarSom(som) {
    const audio = new Audio(JOGO_CONFIG.sons[som]);
    audio.play().catch(() => {});
}
