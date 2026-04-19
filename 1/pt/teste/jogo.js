let category = 'animais';
let roundGlobal = 0;
let score = 0;
let timer = 0;
let timerInt;
let word = "";
let isDragging = false;
let selectedCells = [];
let itemsGame = [];

function init() {
    const pI = JOGO_CONFIG.caminhoIcons;
    const pImg = JOGO_CONFIG.caminhoImg;
    const txt = JOGO_CONFIG.textos;
    
    // Injeção de Textos
    document.getElementById('h-tit1').innerText = txt.tituloLinha1;
    document.getElementById('h-tit2').innerText = txt.tituloLinha2;
    document.getElementById('h-sub').innerText = txt.subtitulo;
    document.getElementById('mainFooter').innerHTML = txt.rodape;

    // Assets de Cabeçalho
    document.getElementById('head-logo').src = pI + JOGO_CONFIG.iconesMenu.ano1;
    document.getElementById('header-back-icon').src = pI + "voltar.png";
    document.getElementById('link-voltar-main').href = JOGO_CONFIG.linkVoltar;
    document.getElementById('rd-game-btn').src = pImg + "rd.png";
    document.getElementById('rd-intro-btn').src = pImg + "rd.png";

    // --- CONSTRUÇÃO DO MENU HAMBÚRGUER ---
    const menuBox = document.getElementById('dropdownMenu');
    menuBox.innerHTML = ''; 

    // 1. Adiciona links de Anos primeiro
    ['home', 'pre', 'ano1', 'ano2', 'ano3', 'ano4'].forEach(k => {
        const label = k === 'home' ? 'Início' : (k === 'pre' ? 'Pré' : k.replace('ano', '') + 'º Ano');
        const a = document.createElement('a'); 
        a.className = 'menu-item'; 
        a.href = JOGO_CONFIG.links[k];
        a.innerHTML = `<img src="${pI}${JOGO_CONFIG.iconesMenu[k]}"><span>${label}</span>`; 
        menuBox.appendChild(a);
    });

    // 2. Adiciona Divisor
    const divisor = document.createElement('div');
    divisor.className = 'menu-divider';
    menuBox.appendChild(divisor);

    // 3. Adiciona Botão VOLTAR por ÚLTIMO
    const btnVoltarMenu = document.createElement('a');
    btnVoltarMenu.className = 'menu-item menu-item-voltar';
    btnVoltarMenu.href = JOGO_CONFIG.linkVoltar;
    btnVoltarMenu.innerHTML = `<img src="${pI}voltar.png"><span>${JOGO_CONFIG.textoVoltar}</span>`;
    menuBox.appendChild(btnVoltarMenu);

    // --- MENU RD (TEMAS) ---
    const rdList = document.getElementById('rd-list');
    rdList.innerHTML = ''; 
    Object.keys(JOGO_CONFIG.categorias).forEach(k => {
        const c = JOGO_CONFIG.categorias[k];
        const card = document.createElement('div');
        card.style = "background:white; border-radius:20px; padding:15px; display:flex; flex-direction:column; align-items:center; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.05); text-align:center;";
        card.innerHTML = `<img src="${pImg}${c.imgCapa}" style="width:55px; height:55px; object-fit:contain; margin-bottom:10px;"><span style="font-weight:800; color:#5d7082; font-size:14px;">${c.nome}</span>`;
        card.onclick = () => { selectCat(k); }; rdList.appendChild(card);
    });

    updateIntroTutorial(category);
}

// CONTROLES DE INTERFACE (CORRIGIDOS)
function toggleHamburger(e) { 
    if(e) e.stopPropagation(); 
    const m = document.getElementById('dropdownMenu'); 
    const overlay = document.getElementById('overlay');
    const isVisible = window.getComputedStyle(m).display === 'flex';

    if(isVisible) {
        m.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        m.style.display = 'flex';
        overlay.style.display = 'block';
    }
}

function closeMenus() { 
    document.getElementById('dropdownMenu').style.display = 'none'; 
    document.getElementById('rdMenu').classList.remove('active'); 
    document.getElementById('overlay').style.display = 'none'; 
}

function openRDMenu(e) { 
    if(e) e.stopPropagation(); 
    document.getElementById('rdMenu').classList.add('active'); 
    document.getElementById('overlay').style.display = 'block'; 
}

// LÓGICA DO JOGO
function updateIntroTutorial(catKey) {
    const item = JOGO_CONFIG.categorias[catKey].itens[0];
    document.getElementById('intro-img').src = JOGO_CONFIG.caminhoImg + item.img;
    document.getElementById('intro-name-label').innerText = item.nome;
}

function startGame() {
    showScreen('scr-game'); 
    document.getElementById('status-bar').style.display = 'flex'; 
    document.getElementById('main-title').style.display = 'none';
    const all = [...JOGO_CONFIG.categorias[category].itens];
    itemsGame = all.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    timer = 0;
    if(timerInt) clearInterval(timerInt);
    timerInt = setInterval(() => { 
        timer++; 
        let m = Math.floor(timer/60).toString().padStart(2,'0'); 
        let s = (timer%60).toString().padStart(2,'0'); 
        document.getElementById('timer').innerText = `⏳ ${m}:${s}`; 
    }, 1000);
    loadRound();
}

function loadRound() {
    const it = itemsGame[roundGlobal]; 
    word = it.nome.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
    updateDots(5, roundGlobal % 5);
    document.getElementById('game-banner').classList.remove('feedback-correct', 'feedback-wrong');
    document.getElementById('game-name').innerText = it.nome;
    document.getElementById('game-img').src = JOGO_CONFIG.caminhoImg + it.img;
    genGrid();
}

function genGrid() {
    const el = document.getElementById('game-grid'); 
    el.innerHTML = ''; 
    let cells = Array(64).fill('');
    const isH = Math.random() > 0.5;
    const start = isH ? Math.floor(Math.random()*8)*8 + Math.floor(Math.random()*(8-word.length)) : Math.floor(Math.random()*(8-word.length))*8 + Math.floor(Math.random()*8);
    for(let i=0; i<word.length; i++) cells[isH ? start+i : start+(i*8)] = word[i];
    const abc = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
    cells.forEach(c => {
        const d = document.createElement('div'); d.className = 'cell'; d.innerText = c || abc[Math.floor(Math.random()*abc.length)];
        d.onmousedown = (e) => { e.preventDefault(); startSel(d); }; d.onmouseenter = () => contSel(d); d.ontouchstart = (e) => { e.preventDefault(); startSel(d); }; el.appendChild(d);
    });
    window.onmouseup = window.ontouchend = endSel;
}

function startSel(el) { isDragging = true; selectedCells = [el]; el.classList.add('selecting'); }
function contSel(el) { if (isDragging && !selectedCells.includes(el)) { selectedCells.push(el); el.classList.add('selecting'); } }
function endSel() {
    if (!isDragging) return; isDragging = false;
    const res = selectedCells.map(c => c.innerText).join('');
    if (res === word) {
        document.getElementById('game-banner').classList.add('feedback-correct');
        selectedCells.forEach(el => { el.classList.remove('selecting'); el.classList.add('highlight'); });
        score += 150; document.getElementById('score-val').innerText = score;
        setTimeout(() => { roundGlobal++; if(roundGlobal >= 10) finish(); else loadRound(); }, 800);
    } else {
        document.getElementById('game-banner').classList.add('feedback-wrong'); 
        selectedCells.forEach(el => el.classList.remove('selecting'));
    }
    selectedCells = [];
}

function finish() {
    clearInterval(timerInt); showScreen('scr-result');
    document.getElementById('status-bar').style.display = 'none';
}

function showScreen(id) { 
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); 
    document.getElementById(id).classList.add('active'); 
}

function updateDots(total, current) { 
    const c = document.getElementById('dots'); 
    c.innerHTML = ''; 
    for(let i=0; i<total; i++) { 
        const d = document.createElement('div'); 
        d.className = i < current ? 'dot done' : (i === current ? 'dot active' : 'dot');
        c.appendChild(d); 
    } 
}

function selectCat(k) { 
    category = k; roundGlobal = 0; score = 0; 
    closeMenus(); showScreen('scr-intro'); updateIntroTutorial(k); 
}

window.onload = init;
