// VARIÁVEIS DE ESTADO DO JOGO
let gameState = {
    categoriaAtual: 'animais',
    nivel: 1, // 1: Imagem + Nome, 2: Só Imagem
    ronda: 1,
    maxRondasPorNivel: 5,
    pontos: 0,
    tempo: 0,
    timerInterval: null,
    palavraAtual: "",
    gridTamanho: 8, // 8x8 para ser acessível
    selecionando: false,
    celulasSelecionadas: [], // Array de {r, c, id}
    letrasEncontradas: [],
    palavrasUsadas: []
};

// INICIALIZAÇÃO
window.onload = () => {
    configurarInterface();
    gerarMenuCategorias();
    carregarCategoria(Object.keys(JOGO_CONFIG.categorias)[0]);
};

function configurarInterface() {
    // Header e Logos
    document.getElementById('head-logo').src = JOGO_CONFIG.caminhoIcons + "logo.png";
    document.getElementById('tit-l1').innerText = JOGO_CONFIG.textos.tituloLinha1;
    document.getElementById('tit-l2').innerText = JOGO_CONFIG.textos.tituloLinha2;
    document.getElementById('sub-tit').innerText = JOGO_CONFIG.textos.subtitulo;
    
    // Back links
    document.getElementById('link-voltar').href = JOGO_CONFIG.linkVoltar;
    document.getElementById('btn-back-link').onclick = () => window.location.href = JOGO_CONFIG.linkVoltar;
    document.getElementById('header-back-icon').src = JOGO_CONFIG.caminhoIcons + "back.png";
    document.getElementById('rd-game-btn').src = JOGO_CONFIG.caminhoIcons + "temas.png";
    document.getElementById('rd-intro-btn').src = JOGO_CONFIG.caminhoIcons + "temas.png";
    
    // Footer
    document.getElementById('mainFooter').innerHTML = JOGO_CONFIG.textos.rodape;

    // Menu Hamburger
    const menu = document.getElementById('dropdownMenu');
    const items = [
        { t: "Início", i: JOGO_CONFIG.iconesMenu.home, l: JOGO_CONFIG.links.home },
        { t: "Pré-Escolar", i: JOGO_CONFIG.iconesMenu.pre, l: JOGO_CONFIG.links.pre },
        { t: "1º Ano", i: JOGO_CONFIG.iconesMenu.ano1, l: JOGO_CONFIG.links.ano1 },
    ];
    
    items.forEach(it => {
        const a = document.createElement('a');
        a.className = "menu-item";
        a.href = it.l;
        a.innerHTML = `<img src="${JOGO_CONFIG.caminhoIcons}${it.i}"> ${it.t}`;
        menu.appendChild(a);
    });
}

function gerarMenuCategorias() {
    const container = document.getElementById('rd-list');
    container.innerHTML = "";
    for (let key in JOGO_CONFIG.categorias) {
        const cat = JOGO_CONFIG.categorias[key];
        const card = document.createElement('div');
        card.className = "category-card";
        card.onclick = () => carregarCategoria(key);
        card.innerHTML = `
            <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}">
            <div style="font-weight:900; color:var(--primary-blue)">${cat.nome}</div>
        `;
        container.appendChild(card);
    }
}

function carregarCategoria(key) {
    gameState.categoriaAtual = key;
    const cat = JOGO_CONFIG.categorias[key];
    const itemSorteado = cat.itens[Math.floor(Math.random() * cat.itens.length)];
    
    document.getElementById('intro-img').src = JOGO_CONFIG.caminhoImg + itemSorteado.img;
    document.getElementById('intro-name-label').innerText = itemSorteado.nome;
    
    closeMenus();
}

function startGame() {
    gameState.nivel = 1;
    gameState.ronda = 1;
    gameState.pontos = 0;
    gameState.tempo = 0;
    gameState.palavrasUsadas = [];
    
    showScreen('scr-game');
    document.getElementById('status-bar').style.display = 'flex';
    
    startTimer();
    proximaRonda();
}

function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.tempo++;
        const min = Math.floor(gameState.tempo / 60).toString().padStart(2, '0');
        const sec = (gameState.tempo % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `⏳ ${min}:${sec}`;
    }, 1000);
}

function proximaRonda() {
    const cat = JOGO_CONFIG.categorias[gameState.categoriaAtual];
    
    // Escolher palavra que ainda não foi usada
    let disponiveis = cat.itens.filter(i => !gameState.palavrasUsadas.includes(i.nome));
    if (disponiveis.length === 0) {
        gameState.palavrasUsadas = [];
        disponiveis = cat.itens;
    }
    const item = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    gameState.palavraAtual = item.nome;
    gameState.palavrasUsadas.push(item.nome);

    // Atualizar UI do Nível
    document.getElementById('main-title').innerText = `NÍVEL ${gameState.nivel} - RONDA ${gameState.ronda}/5`;
    document.getElementById('game-img').src = JOGO_CONFIG.caminhoImg + item.img;
    
    // Nível 2 esconde o nome
    document.getElementById('game-name').innerText = (gameState.nivel === 1) ? item.nome : "???";
    
    atualizarDots();
    gerarGrid(item.nome);
}

function atualizarDots() {
    const container = document.getElementById('dots');
    container.innerHTML = "";
    for (let i = 1; i <= gameState.maxRondasPorNivel; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i < gameState.ronda ? 'done' : (i === gameState.ronda ? 'active' : '')}`;
        container.appendChild(dot);
    }
}

function gerarGrid(palavra) {
    const tamanho = gameState.gridTamanho;
    const gridElement = document.getElementById('game-grid');
    gridElement.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;
    gridElement.innerHTML = "";

    // Criar matriz vazia
    let matriz = Array(tamanho).fill().map(() => Array(tamanho).fill(''));

    // Colocar a palavra (Horizontal ou Vertical)
    const horizontal = Math.random() > 0.5;
    let r, c;

    if (horizontal) {
        r = Math.floor(Math.random() * tamanho);
        c = Math.floor(Math.random() * (tamanho - palavra.length));
        for (let i = 0; i < palavra.length; i++) matriz[r][c + i] = palavra[i];
    } else {
        r = Math.floor(Math.random() * (tamanho - palavra.length));
        c = Math.floor(Math.random() * tamanho);
        for (let i = 0; i < palavra.length; i++) matriz[r + i][c] = palavra[i];
    }

    // Preencher resto com letras aleatórias
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < tamanho; i++) {
        for (let j = 0; j < tamanho; j++) {
            if (matriz[i][j] === '') {
                matriz[i][j] = letras[Math.floor(Math.random() * letras.length)];
            }
            
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.innerText = matriz[i][j];
            cell.dataset.r = i;
            cell.dataset.c = j;
            cell.id = `cell-${i}-${j}`;
            
            // Eventos Mouse
            cell.onmousedown = (e) => iniciarSelecao(i, j, cell);
            cell.onmouseenter = (e) => moverSelecao(i, j, cell);
            
            // Eventos Touch (precisam ser no container pai para funcionar o drag)
            gridElement.addEventListener('touchstart', handleTouch, {passive: false});
            gridElement.addEventListener('touchmove', handleTouch, {passive: false});
            gridElement.addEventListener('touchend', finalizarSelecao, {passive: false});

            gridElement.appendChild(cell);
        }
    }
    window.addEventListener('mouseup', finalizarSelecao);
}

// LOGICA DE SELEÇÃO (DRAG)
function iniciarSelecao(r, c, el) {
    gameState.selecionando = true;
    gameState.celulasSelecionadas = [{r, c, id: el.id}];
    limparHighlights();
    el.classList.add('highlight');
}

function moverSelecao(r, c, el) {
    if (!gameState.selecionando) return;

    const inicio = gameState.celulasSelecionadas[0];
    
    // Só permite linha reta (horizontal ou vertical)
    if (r !== inicio.r && c !== inicio.c) return;

    // Se o utilizador voltou atrás, reduz o array (backtrack)
    const indexExistente = gameState.celulasSelecionadas.findIndex(item => item.id === el.id);
    if (indexExistente !== -1) {
        gameState.celulasSelecionadas = gameState.celulasSelecionadas.slice(0, indexExistente + 1);
    } else {
        // Verifica se é adjacente à última selecionada para manter continuidade
        const ultima = gameState.celulasSelecionadas[gameState.celulasSelecionadas.length - 1];
        const dist = Math.abs(r - ultima.r) + Math.abs(c - ultima.c);
        if (dist === 1) {
            gameState.celulasSelecionadas.push({r, c, id: el.id});
        }
    }

    limparHighlights();
    gameState.celulasSelecionadas.forEach(sel => {
        document.getElementById(sel.id).classList.add('highlight');
    });
}

function finalizarSelecao() {
    if (!gameState.selecionando) return;
    gameState.selecionando = false;

    const palavraFormada = gameState.celulasSelecionadas.map(s => 
        document.getElementById(s.id).innerText
    ).join('');

    const palavraInversa = palavraFormada.split('').reverse().join('');

    if (palavraFormada === gameState.palavraAtual || palavraInversa === gameState.palavraAtual) {
        sucessoRonda();
    } else {
        erroRonda();
    }
}

function limparHighlights() {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
}

// TOUCH SUPPORT
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el || !el.classList.contains('cell')) return;

    const r = parseInt(el.dataset.r);
    const c = parseInt(el.dataset.c);

    if (e.type === 'touchstart') {
        iniciarSelecao(r, c, el);
    } else if (e.type === 'touchmove') {
        moverSelecao(r, c, el);
    }
}

// FEEDBACKS
function sucessoRonda() {
    tocarSom('acerto');
    gameState.pontos += (gameState.nivel * 100);
    document.getElementById('score-val').innerText = gameState.pontos;
    document.getElementById('game-banner').classList.add('feedback-correct');

    setTimeout(() => {
        document.getElementById('game-banner').classList.remove('feedback-correct');
        
        if (gameState.ronda < gameState.maxRondasPorNivel) {
            gameState.ronda++;
            proximaRonda();
        } else {
            if (gameState.nivel === 1) {
                gameState.nivel = 2;
                gameState.ronda = 1;
                proximaRonda();
            } else {
                finalizarJogo();
            }
        }
    }, 1000);
}

function erroRonda() {
    tocarSom('erro');
    document.getElementById('game-banner').classList.add('feedback-wrong');
    setTimeout(() => {
        document.getElementById('game-banner').classList.remove('feedback-wrong');
        limparHighlights();
    }, 500);
}

function finalizarJogo() {
    clearInterval(gameState.timerInterval);
    tocarSom('vitoria');
    showScreen('scr-result');
    document.getElementById('status-bar').style.display = 'none';

    // Calcular troféu
    const relatorio = JOGO_CONFIG.relatorios.find(r => gameState.pontos >= r.min);
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + relatorio.img;
    document.getElementById('res-tit').innerText = relatorio.titulo;
    document.getElementById('res-pts').innerText = gameState.pontos;
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText.replace('⏳ ', '');
}

// UTILITÁRIOS
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function toggleHamburger(e) {
    e.stopPropagation();
    const menu = document.getElementById('dropdownMenu');
    const isVisible = menu.style.display === 'flex';
    menu.style.display = isVisible ? 'none' : 'flex';
    document.getElementById('overlay').style.display = isVisible ? 'none' : 'block';
}

function openRDMenu(e) {
    e.stopPropagation();
    document.getElementById('rdMenu').classList.add('active');
    document.getElementById('overlay').style.display = 'block';
}

function closeMenus() {
    document.getElementById('dropdownMenu').style.display = 'none';
    document.getElementById('rdMenu').classList.remove('active');
    document.getElementById('overlay').style.display = 'none';
}

function tocarSom(tipo) {
    const audio = new Audio(JOGO_CONFIG.sons[tipo]);
    audio.play().catch(() => {}); // Catch para navegadores que bloqueiam autoplay sem interação
}
