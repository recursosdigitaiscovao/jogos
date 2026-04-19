/** 
 * MOTOR DE SOPA DE LETRAS - Pequenos Leitores
 */

let categoriaSelecionada = null;
let palavrasEncontradas = [];
let selecaoAtual = [];
let isDragging = false;
let pontuacaoFinal = 0;

// Inicialização
window.onload = () => {
    carregarInterfaceConfig();
    renderCategoriasIntro();
    renderMenuHamburguer();
};

function carregarInterfaceConfig() {
    document.getElementById('txt-tit-1').innerText = JOGO_CONFIG.textos.tituloLinha1;
    document.getElementById('txt-tit-2').innerText = JOGO_CONFIG.textos.tituloLinha2;
    document.getElementById('txt-subtit').innerText = JOGO_CONFIG.textos.subtitulo;
    document.getElementById('logo-img').src = JOGO_CONFIG.caminhoIcons + "logo.png"; // Ajuste conforme seu logo
    document.getElementById('intro-msg').innerText = JOGO_CONFIG.textos.intro;
    document.getElementById('link-voltar-top').href = JOGO_CONFIG.links.home;
}

// Menu Hamburguer Dinâmico
function renderMenuHamburguer() {
    const menu = document.getElementById('dropdownMenu');
    const links = JOGO_CONFIG.links;
    const icons = JOGO_CONFIG.iconesMenu;
    const path = JOGO_CONFIG.caminhoIcons;

    const itens = [
        { label: 'Início', link: links.home, img: icons.home },
        { label: 'Pré-Escolar', link: links.pre, img: icons.pre },
        { label: '1º Ano', link: links.ano1, img: icons.ano1 },
        { label: '2º Ano', link: links.ano2, img: icons.ano2 },
        { label: '3º Ano', link: links.ano3, img: icons.ano3 },
        { label: '4º Ano', link: links.ano4, img: icons.ano4 }
    ];

    menu.innerHTML = itens.map(i => `
        <a href="${i.link}" class="menu-item">
            <img src="${path}${i.img}">
            <span>${i.label}</span>
        </a>
    `).join('');

    document.getElementById('btn-hamburger').onclick = (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        document.getElementById('overlay').style.display = menu.style.display === 'flex' ? 'block' : 'none';
    };
}

// Renderizar Categorias no Ecrã Inicial
function renderCategoriasIntro() {
    const container = document.getElementById('intro-categories');
    const rdList = document.getElementById('rd-list');
    
    Object.keys(JOGO_CONFIG.categorias).forEach(key => {
        const cat = JOGO_CONFIG.categorias[key];
        const cardHtml = `
            <div class="cat-card" onclick="iniciarJogo('${key}')" style="background:white; padding:15px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 0 #cbd9e6;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:80px; height:80px; object-fit:contain;">
                <h3 style="color:var(--text-grey); font-size:16px; margin-top:10px;">${cat.nome}</h3>
            </div>
        `;
        container.innerHTML += cardHtml;
        rdList.innerHTML += cardHtml;
    });
}

// Lógica de Início de Jogo
function iniciarJogo(key) {
    categoriaSelecionada = JOGO_CONFIG.categorias[key];
    palavrasEncontradas = [];
    document.getElementById('scr-intro').classList.remove('active');
    document.getElementById('scr-game').classList.add('active');
    fecharMenus();
    gerarSopaLetras();
}

// GERADOR DE SOPA DE LETRAS
function gerarSopaLetras() {
    const gridBoard = document.getElementById('grid-board');
    const wordsListContainer = document.getElementById('words-list');
    const size = 10;
    let grid = Array(size).fill().map(() => Array(size).fill(''));
    
    const palavras = categoriaSelecionada.itens.map(i => i.nome.toUpperCase());
    
    // 1. Colocar palavras no grid (Horizontal ou Vertical)
    palavras.forEach(word => {
        let colocada = false;
        while (!colocada) {
            let isVert = Math.random() > 0.5;
            let row = Math.floor(Math.random() * (isVert ? size - word.length : size));
            let col = Math.floor(Math.random() * (isVert ? size : size - word.length));
            
            let cabe = true;
            for (let i = 0; i < word.length; i++) {
                let r = isVert ? row + i : row;
                let c = isVert ? col : col + i;
                if (grid[r][c] !== '' && grid[r][c] !== word[i]) { cabe = false; break; }
            }

            if (cabe) {
                for (let i = 0; i < word.length; i++) {
                    grid[isVert ? row + i : row][isVert ? col : col + i] = word[i];
                }
                colocada = true;
            }
        }
    });

    // 2. Preencher espaços vazios com letras aleatórias
    const letras = "ABCDEfGHIJKLMNOPQRSTUVWXYZ";
    for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
            if(grid[r][c] === '') grid[r][c] = letras[Math.floor(Math.random()*letras.length)];
        }
    }

    // 3. Renderizar Grid
    gridBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gridBoard.innerHTML = '';
    grid.forEach((row, r) => {
        row.forEach((letra, c) => {
            const el = document.createElement('div');
            el.className = 'letter';
            el.innerText = letra;
            el.dataset.row = r;
            el.dataset.col = c;
            
            // Eventos de Touch/Mouse
            el.onmousedown = () => startSelection(el);
            el.onmouseover = () => updateSelection(el);
            el.ontouchstart = (e) => { e.preventDefault(); startSelection(el); };
            
            gridBoard.appendChild(el);
        });
    });

    document.onmouseup = endSelection;
    gridBoard.ontouchend = endSelection;
    gridBoard.ontouchmove = (e) => {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if(target && target.classList.contains('letter')) updateSelection(target);
    };

    // 4. Renderizar Lista de Palavras
    wordsListContainer.innerHTML = palavras.map(p => `<div class="word-item" id="word-${p}">${p}</div>`).join('');
}

// Interatividade da Sopa de Letras
function startSelection(el) {
    isDragging = true;
    selecaoAtual = [el];
    el.classList.add('selected');
}

function updateSelection(el) {
    if(!isDragging || selecaoAtual.includes(el)) return;
    selecaoAtual.push(el);
    el.classList.add('selected');
}

function endSelection() {
    if(!isDragging) return;
    isDragging = false;
    
    const palavraFormada = selecaoAtual.map(el => el.innerText).join('');
    const palavraReversa = palavraFormada.split('').reverse().join('');
    
    const palavrasAlvo = categoriaSelecionada.itens.map(i => i.nome.toUpperCase());
    
    if (palavrasAlvo.includes(palavraFormada) || palavrasAlvo.includes(palavraReversa)) {
        const p = palavrasAlvo.includes(palavraFormada) ? palavraFormada : palavraReversa;
        if (!palavrasEncontradas.includes(p)) {
            palavrasEncontradas.push(p);
            selecaoAtual.forEach(el => el.classList.add('found'));
            document.getElementById(`word-${p}`).classList.add('found');
            tocarSom('acerto');
        }
    }
    
    selecaoAtual.forEach(el => el.classList.remove('selected'));
    selecaoAtual = [];

    if(palavrasEncontradas.length === categoriaSelecionada.itens.length) {
        setTimeout(finalizarJogo, 1000);
    }
}

function tocarSom(tipo) {
    const audio = new Audio(JOGO_CONFIG.sons[tipo]);
    audio.play().catch(() => {});
}

function finalizarJogo() {
    tocarSom('vitoria');
    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('scr-result').classList.add('active');
    
    const percentagem = 100; // Como encontrou todas as palavras
    const relatorio = JOGO_CONFIG.relatorios.find(r => percentagem >= r.min);
    
    document.getElementById('res-tit').innerText = relatorio.titulo;
    document.getElementById('res-msg').innerText = relatorio.msg;
    document.getElementById('res-img').src = JOGO_CONFIG.caminhoIcons + relatorio.img;
}

function fecharMenus() {
    document.getElementById('dropdownMenu').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('rdMenu').classList.remove('active');
}

document.getElementById('overlay').onclick = fecharMenus;
