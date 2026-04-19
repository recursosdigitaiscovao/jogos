let catAtiva = null;
let palavrasEncontradas = [];
let selecaoIndices = [];
let isDragging = false;

window.onload = () => {
    configurarCabecalho();
    renderMenu();
    renderIntro();
};

function configurarCabecalho() {
    // Aqui injetamos as 3 linhas do título
    document.getElementById('txt-l1').innerText = JOGO_CONFIG.textos.tituloLinha1;
    document.getElementById('txt-l2').innerText = JOGO_CONFIG.textos.tituloLinha2;
    document.getElementById('txt-sub').innerText = JOGO_CONFIG.textos.subtitulo;
    document.getElementById('head-logo').src = JOGO_CONFIG.caminhoIcons + "logo.png";
    document.getElementById('btn-topo-voltar').href = JOGO_CONFIG.links.home;
}

function renderMenu() {
    const menu = document.getElementById('dropdownMenu');
    const links = JOGO_CONFIG.links;
    const icons = JOGO_CONFIG.iconesMenu;
    const path = JOGO_CONFIG.caminhoIcons;

    const itens = [
        { n: 'Início', l: links.home, i: icons.home },
        { n: 'Pré-Escolar', l: links.pre, i: icons.pre },
        { n: '1º Ano', l: links.ano1, i: icons.ano1 },
        { n: '2º Ano', l: links.ano2, i: icons.ano2 },
        { n: '3º Ano', l: links.ano3, i: icons.ano3 },
        { n: '4º Ano', l: links.ano4, i: icons.ano4 }
    ];

    menu.innerHTML = itens.map(item => `
        <a href="${item.l}" class="menu-item">
            <img src="${path}${item.i}">
            <span>${item.n}</span>
        </a>
    `).join('');
}

function renderIntro() {
    const container = document.getElementById('intro-cats');
    const rd = document.getElementById('rd-list');
    
    Object.keys(JOGO_CONFIG.categorias).forEach(id => {
        const c = JOGO_CONFIG.categorias[id];
        const card = `
            <div onclick="iniciarJogo('${id}')" style="background:white; padding:20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 8px 0 #cbd9e6;">
                <img src="${JOGO_CONFIG.caminhoImg}${c.imgCapa}" style="width:70px; height:70px; object-fit:contain;">
                <h3 style="margin-top:10px; font-size:15px; color:#5d7082;">${c.nome.toUpperCase()}</h3>
            </div>
        `;
        container.innerHTML += card;
        rd.innerHTML += card;
    });
}

function iniciarJogo(id) {
    catAtiva = JOGO_CONFIG.categorias[id];
    palavrasEncontradas = [];
    document.getElementById('scr-intro').classList.remove('active');
    document.getElementById('scr-game').classList.add('active');
    fecharMenus();
    gerarSopa();
}

function gerarSopa() {
    const size = 10;
    const grid = Array(size).fill().map(() => Array(size).fill(''));
    const palavras = catAtiva.itens.map(i => i.nome.toUpperCase());

    // Colocação Básica (Horizontal ou Vertical)
    palavras.forEach(word => {
        let colocada = false;
        while (!colocada) {
            let horizontal = Math.random() > 0.5;
            let r = Math.floor(Math.random() * (horizontal ? size : size - word.length));
            let c = Math.floor(Math.random() * (horizontal ? size - word.length : size));
            
            let ocupado = false;
            for(let i=0; i<word.length; i++) {
                if(grid[horizontal ? r : r+i][horizontal ? c+i : c] !== '') ocupado = true;
            }

            if(!ocupado) {
                for(let i=0; i<word.length; i++) grid[horizontal ? r : r+i][horizontal ? c+i : c] = word[i];
                colocada = true;
            }
        }
    });

    // Encher vazios
    const letras = "ABCDEfGHIJKLMNOPQRSTUVWXYZ";
    const board = document.getElementById('grid-board');
    board.innerHTML = '';
    
    grid.forEach((row, r) => {
        row.forEach((char, c) => {
            const l = char || letras[Math.floor(Math.random()*letras.length)];
            const div = document.createElement('div');
            div.className = 'letter';
            div.innerText = l;
            div.dataset.pos = `${r}-${c}`;
            
            // Eventos Mouse/Touch
            div.onmousedown = () => startSelect(div);
            div.onmouseover = () => moveSelect(div);
            div.ontouchstart = (e) => { e.preventDefault(); startSelect(div); };
            board.appendChild(div);
        });
    });

    document.onmouseup = endSelect;
    board.ontouchend = endSelect;
    board.ontouchmove = (e) => {
        const t = e.touches[0];
        const el = document.elementFromPoint(t.clientX, t.clientY);
        if(el && el.classList.contains('letter')) moveSelect(el);
    };

    document.getElementById('words-list').innerHTML = palavras.map(p => `<div class="word-tag" id="tag-${p}">${p}</div>`).join('');
}

function startSelect(el) { isDragging = true; selecaoIndices = [el]; el.classList.add('selected'); }
function moveSelect(el) { if(isDragging && !selecaoIndices.includes(el)) { selecaoIndices.push(el); el.classList.add('selected'); } }

function endSelect() {
    if(!isDragging) return;
    isDragging = false;
    const word = selecaoIndices.map(el => el.innerText).join('');
    const rev = word.split('').reverse().join('');
    const lista = catAtiva.itens.map(i => i.nome.toUpperCase());

    if(lista.includes(word) || lista.includes(rev)) {
        const certa = lista.includes(word) ? word : rev;
        if(!palavrasEncontradas.includes(certa)) {
            palavrasEncontradas.push(certa);
            selecaoIndices.forEach(el => el.classList.add('found'));
            document.getElementById(`tag-${certa}`).classList.add('found');
            tocarSom('acerto');
        }
    }
    selecaoIndices.forEach(el => el.classList.remove('selected'));
    selecaoIndices = [];
    if(palavrasEncontradas.length === lista.length) setTimeout(finalizar, 800);
}

function finalizar() {
    tocarSom('vitoria');
    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('scr-result').classList.add('active');
    const rel = JOGO_CONFIG.relatorios[0]; // Simplificado
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-msg').innerText = rel.msg;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
}

function tocarSom(s) { new Audio(JOGO_CONFIG.sons[s]).play().catch(()=>{}); }
function toggleMenu(e) { e.stopPropagation(); const m = document.getElementById('dropdownMenu'); m.style.display = m.style.display === 'flex' ? 'none' : 'flex'; document.getElementById('overlay').style.display = m.style.display; }
function fecharMenus() { document.getElementById('dropdownMenu').style.display = 'none'; document.getElementById('rdMenu').classList.remove('active'); document.getElementById('overlay').style.display = 'none'; }
