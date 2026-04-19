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
    
    // Injeção de Textos das 3 Linhas no Header
    document.getElementById('h-tit1').innerText = txt.tituloLinha1;
    document.getElementById('h-tit2').innerText = txt.tituloLinha2;
    document.getElementById('h-sub').innerText = txt.subtitulo;
    document.getElementById('mainFooter').innerHTML = txt.rodape;

    // Configuração de Assets Visuais e Botão Voltar do Header (Desktop)
    document.getElementById('head-logo').src = pI + JOGO_CONFIG.iconesMenu.ano1;
    document.getElementById('header-back-icon').src = pI + "voltar.png";
    document.getElementById('link-voltar-main').href = JOGO_CONFIG.linkVoltar; 
    document.getElementById('rd-game-btn').src = pImg + "rd.png";
    document.getElementById('rd-intro-btn').src = pImg + "rd.png";
    document.getElementById('btn-back-link').onclick = () => window.location.href = JOGO_CONFIG.linkVoltar;

    // --- CONSTRUÇÃO DO MENU HAMBÚRGUER ---
    const menuBox = document.getElementById('dropdownMenu');
    menuBox.innerHTML = ''; 

    // 1. Primeiro, gera os links normais (Home, Pré, Anos...)
    ['home', 'pre', 'ano1', 'ano2', 'ano3', 'ano4'].forEach(k => {
        const label = k === 'home' ? 'Início' : (k === 'pre' ? 'Pré' : k.replace('ano', '') + 'º Ano');
        const a = document.createElement('a'); 
        a.className = 'menu-item'; 
        a.href = JOGO_CONFIG.links[k];
        a.innerHTML = `<img src="${pI}${JOGO_CONFIG.iconesMenu[k]}"><span>${label}</span>`; 
        menuBox.appendChild(a);
    });

    // 2. Adiciona a linha divisória antes do botão voltar
    const divisor = document.createElement('div');
    divisor.className = 'menu-divider';
    menuBox.appendChild(divisor);

    // 3. Adiciona o botão VOLTAR como ÚLTIMO item da lista
    const btnVoltarMenu = document.createElement('a');
    btnVoltarMenu.className = 'menu-item menu-item-voltar';
    btnVoltarMenu.href = JOGO_CONFIG.linkVoltar;
    btnVoltarMenu.innerHTML = `<img src="${pI}voltar.png"><span>${JOGO_CONFIG.textoVoltar}</span>`;
    menuBox.appendChild(btnVoltarMenu);

    // --- MENU DE TEMAS (RD) ---
    const rdList = document.getElementById('rd-list');
    rdList.innerHTML = ''; 
    Object.keys(JOGO_CONFIG.categorias).forEach(k => {
        const c = JOGO_CONFIG.categorias[k];
        const card = document.createElement('div');
        card.style = "background:white; border-radius:20px; padding:15px; display:flex; flex-direction:column; align-items:center; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.05); text-align:center;";
        card.innerHTML = `<img src="${pImg}${c.imgCapa}" style="width:55px; height:55px; object-fit:contain; margin-bottom:10px;"><span style="font-weight:800; color:#5d7082; font-size:14px;">${c.nome}</span>`;
        card.onclick = () => { selectCat(k); }; 
        rdList.appendChild(card);
    });

    updateIntroTutorial(category);
}

function updateIntroTutorial(catKey) {
    const item = JOGO_CONFIG.categorias[catKey].itens[0];
    const pImg = JOGO_CONFIG.caminhoImg;
    const introWord = item.nome.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    document.getElementById('intro-img').src = pImg + item.img;
    document.getElementById('intro-name-label').innerText = item.nome;

    const gridCont = document.getElementById('intro-letter-cells');
    gridCont.style.gridTemplateColumns = `repeat(${introWord.length}, 40px)`;
    document.documentElement.style.setProperty('--drag-dist', `${(introWord.length - 1) * 42 + 10}px`);

    gridCont.innerHTML = `<i class="fas fa-hand-pointer hand-tutorial"></i>`;
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i=0; i<introWord.length; i++) gridCont.innerHTML += `<div class="cell" style="width:40px; height:40px;">${abc[Math.floor(Math.random()*26)]}</div>`;
    for(let i=0; i<introWord.length; i++) gridCont.innerHTML += `<div class="cell highlight" style="width:40px; height:40px;">${introWord[i]}</div>`;

    const slotsCont = document.getElementById('intro-slots');
    slotsCont.innerHTML = '';
    for(let i=0; i<introWord.length; i++) {
        slotsCont.innerHTML += `<div style="width:45px; height:45px; background:white; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); border:2px solid #cbd9e6;">${introWord[i]}</div>`;
    }
}

function startGame() {
    showScreen('scr-game'); 
    document.getElementById('status-bar').style.display = 'flex'; 
    document.getElementById('main-title').style.display = 'none';
    const all = [...JOGO_CONFIG.categorias[category].itens];
    itemsGame = all.sort(() => 0.5 - Math.random()).slice(0, 10);
    while(itemsGame.length < 10) { itemsGame.push(all[Math.floor(Math.random()*all.length)]); }
    
    timer = 0;
    timerInt = setInterval(() => { timer++; let m = Math.floor(timer/60).toString().padStart(2,'0'); let s = (timer%60).toString().padStart(2,'0'); document.getElementById('timer').innerText = `⏳ ${m}:${s}`; }, 1000);
    loadRound();
}

function loadRound() {
    const it = itemsGame[roundGlobal]; word = it.nome.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
    updateDots(5, roundGlobal % 5);
    document.getElementById('game-banner').classList.remove('feedback-correct', 'feedback-wrong');
    document.getElementById('game-name').innerText = it.nome;
    document.getElementById('game-name').style.visibility = roundGlobal >= 5 ? 'hidden' : 'visible';
    document.getElementById('game-img').src = JOGO_CONFIG.caminhoImg + it.img;
    genGrid();
}

function genGrid() {
    const el = document.getElementById('game-grid'); el.innerHTML = ''; let cells = Array(64).fill('');
    const isH = Math.random() > 0.5;
    const start = isH ? Math.floor(Math.random()*8)*8 + Math.floor(Math.random()*(8-word.length)) : Math.floor(Math.random()*(8-word.length))*8 + Math.floor(Math.random()*8);
    for(let i=0; i<word.length; i++) cells[isH ? start+i : start+(i*8)] = word[i];
    const abc = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
    cells.forEach(c => {
        const d = document.createElement('div'); d.className = 'cell'; d.innerText = c || abc[Math.floor(Math.random()*abc.length)];
        d.onmousedown = (e) => { e.preventDefault(); startSel(d); }; d.onmouseenter = () => contSel(d); d.ontouchstart = (e) => { e.preventDefault(); startSel(d); }; el.appendChild(d);
    });
    window.onmouseup = window.ontouchend = endSel;
    document.getElementById('grid-container').ontouchmove = (e) => {
        let touch = e.touches[0]; let target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains('cell')) contSel(target);
    };
}

function startSel(el) { isDragging = true; selectedCells = [el]; el.classList.add('selecting'); }
function contSel(el) { if (isDragging && !selectedCells.includes(el)) { selectedCells.push(el); el.classList.add('selecting'); } }

function endSel() {
    if (!isDragging) return; isDragging = false;
    const res = selectedCells.map(c => c.innerText).join('');
    if (res === word) {
        document.getElementById('game-banner').classList.add('feedback-correct');
        selectedCells.forEach(el => { el.classList.remove('selecting'); el.classList.add('highlight'); });
        score += 150; document.getElementById('score-val').innerText = score; playSound('acerto');
        setTimeout(() => { roundGlobal++; if(roundGlobal >= 10) finish(); else loadRound(); }, 800);
    } else {
        document.getElementById('game-banner').classList.add('feedback-wrong'); playSound('erro');
        setTimeout(() => document.getElementById('game-banner').classList.remove('feedback-wrong'), 800);
        selectedCells.forEach(el => el.classList.remove('selecting'));
    }
    selectedCells = [];
}

function finish() {
    clearInterval(timerInt); playSound('vitoria'); showScreen('scr-result');
    document.getElementById('status-bar').style.display = 'none';
    const rep = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[3];
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rep.img;
    document.getElementById('res-tit').innerText = rep.titulo; 
    document.getElementById('res-msg').innerText = "Parabéns por terminares o desafio!";
    document.getElementById('res-pts').innerText = score; 
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText.replace('⏳ ','');
}

// Controle do Menu e Overlay
function toggleHamburger(e) { 
    e.stopPropagation(); 
    const m = document.getElementById('dropdownMenu'); 
    const isVisible = (m.style.display === 'flex');
    m.style.display = isVisible ? 'none' : 'flex'; 
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

function playSound(t) { if(JOGO_CONFIG.sons[t]) new Audio(JOGO_CONFIG.sons[t]).play().catch(()=>{}); }

function selectCat(k) { 
    category = k; roundGlobal = 0; score = 0; timer = 0; 
    if(timerInt) clearInterval(timerInt); 
    closeMenus(); 
    showScreen('scr-intro'); 
    updateIntroTutorial(k); 
}

window.onload = init;
