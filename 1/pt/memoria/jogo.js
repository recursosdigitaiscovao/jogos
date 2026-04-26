let categoriaAtual = "animais";
let nivelAtual = 1;
let cartasViradas = [];
let paresEncontrados = 0;
let erros = 0;
let tempoSegundos = 0;
let cronometro;
let jogoBloqueado = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

function startLogic() {
    renderMenuRD();
    selecionarCategoria(categoriaAtual);
    selecionarNivel(nivelAtual);
    goToIntro();
}

function renderMenuRD() {
    const boxTemas = document.getElementById('lista-temas');
    const boxNiveis = document.getElementById('lista-niveis');
    
    boxTemas.innerHTML = '';
    Object.keys(JOGO_CONFIG.categorias).forEach(key => {
        const c = JOGO_CONFIG.categorias[key];
        const div = document.createElement('div');
        div.className = `rd-item cat-${key}`;
        div.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${c.imgCapa}"><span>${c.nome}</span>`;
        div.onclick = () => { selecionarCategoria(key); closeMenus(); goToIntro(); };
        boxTemas.appendChild(div);
    });

    boxNiveis.innerHTML = '';
    Object.keys(JOGO_CONFIG.niveis).forEach(num => {
        const n = JOGO_CONFIG.niveis[num];
        const div = document.createElement('div');
        div.className = `rd-item niv-${num}`;
        div.innerHTML = `<span>${n.nome}</span><small style="font-size:9px">${n.cartas} Cartas</small>`;
        div.onclick = () => { selecionarNivel(num); closeMenus(); goToIntro(); };
        boxNiveis.appendChild(div);
    });
}

function selecionarCategoria(key) {
    categoriaAtual = key;
    document.querySelectorAll('#lista-temas .rd-item').forEach(el => el.classList.remove('selected'));
    const target = document.querySelector(`.cat-${key}`);
    if(target) target.classList.add('selected');
}

function selecionarNivel(num) {
    nivelAtual = num;
    document.querySelectorAll('#lista-niveis .rd-item').forEach(el => el.classList.remove('selected'));
    const target = document.querySelector(`.niv-${num}`);
    if(target) target.classList.add('selected');
}

function initGame() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = '';
    cartasViradas = [];
    paresEncontrados = 0;
    erros = 0;
    tempoSegundos = 0;
    jogoBloqueado = false;
    
    document.getElementById('timer-val').innerText = "00:00";
    clearInterval(cronometro);
    iniciarCronometro();

    const configNivel = JOGO_CONFIG.niveis[nivelAtual];
    document.getElementById('round-label').innerText = configNivel.nome;

    let itensPool = [...JOGO_CONFIG.categorias[categoriaAtual].itens];
    itensPool.sort(() => Math.random() - 0.5);
    let selecionados = itensPool.slice(0, configNivel.cartas / 2);
    let deck = [...selecionados, ...selecionados].sort(() => Math.random() - 0.5);

    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    grid.style.gridTemplateColumns = `repeat(${configNivel.colunas}, 1fr)`;

    deck.forEach(item => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.name = item.nome;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-back">?</div>
                <div class="card-front">
                    <img src="${JOGO_CONFIG.caminhoImg}${item.img}">
                    <span>${item.nome}</span>
                </div>
            </div>
        `;
        card.onclick = () => virarCarta(card);
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

function virarCarta(card) {
    if (jogoBloqueado || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    cartasViradas.push(card);

    if (cartasViradas.length === 2) {
        jogoBloqueado = true;
        verificarPar();
    }
}

function verificarPar() {
    const [c1, c2] = cartasViradas;
    if (c1.dataset.name === c2.dataset.name) {
        paresEncontrados++;
        c1.classList.add('matched');
        c2.classList.add('matched');
        somAcerto.play();
        cartasViradas = [];
        jogoBloqueado = false;
        if (paresEncontrados === JOGO_CONFIG.niveis[nivelAtual].cartas / 2) finalizarJogo();
    } else {
        erros++;
        somErro.play();
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            cartasViradas = [];
            jogoBloqueado = false;
        }, 1000);
    }
}

function iniciarCronometro() {
    cronometro = setInterval(() => {
        tempoSegundos++;
        let m = Math.floor(tempoSegundos / 60).toString().padStart(2, '0');
        let s = (tempoSegundos % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function finalizarJogo() {
    clearInterval(cronometro);
    somVitoria.play();
    setTimeout(() => {
        const perc = (paresEncontrados / (paresEncontrados + erros)) * 100;
        const feedback = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max) || JOGO_CONFIG.relatorios[0];
        document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + feedback.img;
        document.getElementById('res-tit').innerText = feedback.titulo;
        document.getElementById('res-pts').innerText = erros;
        document.getElementById('res-tim').innerText = document.getElementById('timer-val').innerText;
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('scr-result').classList.add('active');
        document.getElementById('status-bar').style.display = 'none';
    }, 1000);
}

window.startLogic = startLogic;
window.initGame = initGame;
