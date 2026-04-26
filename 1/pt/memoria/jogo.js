/**
 * JOGO DE MEMÓRIA - Lógica Principal
 */

let jogoEstado = {
    categoriaAtual: null,
    nivelAtual: null,
    rondaAtual: 1,
    pontos: 0,
    erros: 0,
    cartasViradas: [],
    bloquearTabuleiro: false,
    paresEncontrados: 0
};

// --- INICIALIZAÇÃO ---
window.onload = () => {
    aplicarTema();
    gerarMenuCategorias();
};

function aplicarTema() {
    const tema = BIBLIOTECA_TEMAS[CONFIG_MESTRE.area];
    const conteudo = BIBLIOTECA_CONTEUDO[CONFIG_MESTRE.ano][CONFIG_MESTRE.area];

    // Aplicar Cores
    document.body.style.backgroundColor = tema.corPagina;
    document.documentElement.style.setProperty('--cor-primaria', tema.corPrimaria);
    document.documentElement.style.setProperty('--cor-escura', tema.corEscura);
    document.documentElement.style.setProperty('--cor-texto', tema.corTexto);

    // Aplicar Textos
    document.getElementById('titulo1').innerText = conteudo.t1;
    document.getElementById('titulo2').innerText = conteudo.t2;
    document.getElementById('subtitulo').innerText = conteudo.sub;
    document.getElementById('intro-texto').innerText = conteudo.intro;
    document.getElementById('rodape').innerHTML = conteudo.rodape;
}

// --- MENUS ---
function gerarMenuCategorias() {
    const container = document.getElementById('menu-selecao');
    container.innerHTML = '<h2>Escolhe um tema:</h2>';
    
    Object.keys(JOGO_CONFIG.categorias).forEach(chave => {
        const cat = JOGO_CONFIG.categorias[chave];
        const btn = document.createElement('div');
        btn.className = 'card-menu';
        btn.innerHTML = `
            <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" alt="${cat.nome}">
            <span>${cat.nome}</span>
        `;
        btn.onclick = () => selecionarNivel(chave);
        container.appendChild(btn);
    });
}

function selecionarNivel(chaveCat) {
    jogoEstado.categoriaAtual = chaveCat;
    const container = document.getElementById('menu-selecao');
    container.innerHTML = '<h2>Escolhe o nível:</h2>';

    Object.keys(JOGO_CONFIG.niveis).forEach(n => {
        const nivel = JOGO_CONFIG.niveis[n];
        const btn = document.createElement('button');
        btn.className = 'btn-nivel';
        btn.innerHTML = `NÍVEL ${n}<br><small>${nivel.cartas} Cartas</small>`;
        btn.onclick = () => iniciarJogo(parseInt(n));
        container.appendChild(btn);
    });
}

// --- LÓGICA DO JOGO ---
function iniciarJogo(n) {
    jogoEstado.nivelAtual = JOGO_CONFIG.niveis[n];
    jogoEstado.rondaAtual = 1;
    jogoEstado.pontos = 0;
    jogoEstado.erros = 0;
    
    document.getElementById('tela-inicio').style.display = 'none';
    document.getElementById('tela-jogo').style.display = 'block';
    
    prepararRonda();
}

function prepararRonda() {
    jogoEstado.paresEncontrados = 0;
    jogoEstado.cartasViradas = [];
    jogoEstado.bloquearTabuleiro = false;
    
    // Atualizar HUD
    document.getElementById('info-ronda').innerText = `Ronda: ${jogoEstado.rondaAtual} / ${jogoEstado.nivelAtual.rondas}`;
    
    const container = document.getElementById('tabuleiro');
    container.innerHTML = '';
    
    // Ajustar grid conforme número de cartas
    const colunas = jogoEstado.nivelAtual.cartas > 8 ? 4 : 3;
    container.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`;

    // 1. Escolher itens aleatórios da categoria
    const todosItens = [...JOGO_CONFIG.categorias[jogoEstado.categoriaAtual].itens];
    const itensEscolhidos = todosItens.sort(() => 0.5 - Math.random()).slice(0, jogoEstado.nivelAtual.pares);

    // 2. Criar pares (Um de Imagem, um de Texto)
    let deck = [];
    itensEscolhidos.forEach(item => {
        deck.push({ ...item, tipo: 'img' });
        deck.push({ ...item, tipo: 'txt' });
    });

    // 3. Baralhar deck
    deck.sort(() => 0.5 - Math.random());

    // 4. Criar Elementos HTML
    deck.forEach((item, index) => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.dataset.nome = item.nome;
        carta.dataset.index = index;

        const pasta = JOGO_CONFIG.categorias[jogoEstado.categoriaAtual].pastaImg;
        const conteudoCarta = item.tipo === 'img' 
            ? `<img src="${JOGO_CONFIG.caminhoImg}${pasta}/${item.img}">` 
            : `<p class="texto-carta">${item.nome}</p>`;

        carta.innerHTML = `
            <div class="face frente">?</div>
            <div class="face verso">${conteudoCarta}</div>
        `;
        
        carta.onclick = () => virarCarta(carta);
        container.appendChild(carta);
    });
}

function virarCarta(carta) {
    if (jogoEstado.bloquearTabuleiro) return;
    if (carta.classList.contains('virada')) return;

    tocarSom('virar');
    carta.classList.add('virada');
    jogoEstado.cartasViradas.push(carta);

    if (jogoEstado.cartasViradas.length === 2) {
        verificarPar();
    }
}

function verificarPar() {
    jogoEstado.bloquearTabuleiro = true;
    const [c1, c2] = jogoEstado.cartasViradas;

    const ePar = c1.dataset.nome === c2.dataset.nome;

    if (ePar) {
        tocarSom('acerto');
        jogoEstado.paresEncontrados++;
        jogoEstado.pontos += 10;
        jogoEstado.cartasViradas = [];
        jogoEstado.bloquearTabuleiro = false;

        if (jogoEstado.paresEncontrados === jogoEstado.nivelAtual.pares) {
            setTimeout(proximaRonda, 1000);
        }
    } else {
        tocarSom('erro');
        jogoEstado.erros++;
        setTimeout(() => {
            c1.classList.remove('virada');
            c2.classList.remove('virada');
            jogoEstado.cartasViradas = [];
            jogoEstado.bloquearTabuleiro = false;
        }, 1000);
    }
}

function proximaRonda() {
    if (jogoEstado.rondaAtual < jogoEstado.nivelAtual.rondas) {
        jogoEstado.rondaAtual++;
        prepararRonda();
    } else {
        finalizarJogo();
    }
}

// --- FINALIZAÇÃO ---
function finalizarJogo() {
    tocarSom('vitoria');
    document.getElementById('tela-jogo').style.display = 'none';
    document.getElementById('tela-relatorio').style.display = 'block';

    // Cálculo de performance (0 a 100)
    const totalJogadas = jogoEstado.pontos + jogoEstado.erros;
    const perc = Math.round((jogoEstado.pontos / (jogoEstado.pontos + jogoEstado.erros)) * 100) || 0;

    const rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);

    document.getElementById('resumo-final').innerHTML = `
        <img src="${JOGO_CONFIG.caminhoIcons}${rank.img}" style="width:120px">
        <h2>${rank.titulo}</h2>
        <p>Concluíste as 10 rondas do nível ${jogoEstado.nivelAtual.nome}!</p>
        <p>Precisão: ${perc}%</p>
        <button class="btn-nivel" onclick="location.reload()">JOGAR NOVAMENTE</button>
    `;
}

function tocarSom(som) {
    const audio = new Audio(JOGO_CONFIG.sons[som]);
    audio.play().catch(() => {}); // Catch para evitar erro de interação do browser
}
