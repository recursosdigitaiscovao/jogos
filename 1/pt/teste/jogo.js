/**
 * MOTOR DO JOGO: SOPA DE LETRAS
 * Pequenos Leitores - Versão Genérica
 */

let category = Object.keys(JOGO_CONFIG.categorias)[0]; // Pega a primeira categoria por defeito
let roundGlobal = 0;
let score = 0;
let timer = 0;
let timerInt;
let word = "";
let isDragging = false;
let selectedCells = [];
let itemsGame = [];

// INICIALIZAÇÃO
function init() {
    const pI = JOGO_CONFIG.caminhoIcons;
    const pImg = JOGO_CONFIG.caminhoImg;

    // Configuração do Header
    document.getElementById('head-logo').src = pI + JOGO_CONFIG.iconesMenu.ano1;
    document.getElementById('header-back-icon').src = pI + "voltar.png";
    
    // BOTÃO VOLTAR DINÂMICO (Lê do dados.js)
    const btnVoltarHeader = document.getElementById('link-voltar');
    btnVoltarHeader.href = JOGO_CONFIG.linkVoltar;
    btnVoltarHeader.innerHTML = `<img src="${pI}voltar.png"> ${JOGO_CONFIG.textoVoltar}`;

    // Textos e Títulos
    document.getElementById('tit-l1').innerText = JOGO_CONFIG.textos.tituloLinha1;
    document.getElementById('sub-tit').innerText = JOGO_CONFIG.textos.subtitulo;
    document.getElementById('mainFooter').innerHTML = JOGO_CONFIG.textos.rodape;

    // Botões RD (Menu de Temas)
    document.getElementById('rd-game-btn').src = pImg + "rd.png";
    document.getElementById('rd-intro-btn').src = pImg + "rd.png";
    document.getElementById('btn-back-link').onclick = () => window.location.href = JOGO_CONFIG.linkVoltar;

    // Construção do Menu Hambúrguer
    const menuBox = document.getElementById('dropdownMenu');
    menuBox.innerHTML = ''; // Limpa antes de gerar
    ['home', 'pre', 'ano1', 'ano2', 'ano3', 'ano4'].forEach(k => {
        const label = k === 'home' ? 'Início' : (k === 'pre' ? 'Pré' : k.replace('ano', '') + 'º Ano');
        const a = document.createElement('a'); 
        a.className = 'menu-item'; 
        a.href = JOGO_CONFIG.links[k];
        a.innerHTML = `<img src="${pI}${JOGO_CONFIG.iconesMenu[k]}"><span>${label}</span>`; 
        menuBox.appendChild(a);
    });

    const div = document.createElement('div'); div.className = 'menu-divider'; menuBox.appendChild(div);
    
    // BOTÃO VOLTAR NO MENU (Dinâmico)
    const btnV = document.createElement('a'); 
    btnV.className = 'menu-item menu-item-voltar'; 
    btnV.href = JOGO_CONFIG.linkVoltar; 
    btnV.innerHTML = `<img src="${pI}voltar.png"><span>${JOGO_CONFIG.textoVoltar}</span>`; 
    menuBox.appendChild(btnV);

    // Gerar lista de temas no painel RD
    const rdList = document.getElementById('rd-list');
    rdList.innerHTML = '';
    Object.keys(JOGO_CONFIG.categorias).forEach(k => {
        const c = JOGO_CONFIG.categorias[k];
        const card = document.createElement('div'); card.className = 'category-card';
        card.innerHTML = `<img src="${pImg}${c.imgCapa}"><span>${c.nome}</span>`;
        card.onclick = (e) => { e.stopPropagation(); selectCat(k); }; 
        rdList.appendChild(card);
    });

    updateIntroTutorial(category);
}

// TUTORIAL INICIAL (Animação da mão)
function updateIntroTutorial(catKey) {
    const cat = JOGO_CONFIG.categorias[catKey];
    const item = cat.itens[0];
    const pImg = JOGO_CONFIG.caminhoImg;
    const introWord = item.nome.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    document.getElementById('intro-img').src = pImg + item.img;
    document.getElementById('intro-name-label').innerText = item.nome;

    const gridCont = document.getElementById('intro-letter-cells');
    gridCont.style.gridTemplateColumns = `repeat(${introWord.length}, 40px)`;
    const dragDistance = (introWord.length - 1) * 42;
    document.documentElement.style.setProperty('--drag-dist', `${dragDistance + 10}px`);

    gridCont.innerHTML = `<i class="fas fa-hand-pointer hand-tutorial"></i>`;
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i=0; i<introWord.length; i++) gridCont.innerHTML += `<div class="cell" style="width:40px; height:40px;">${abc[Math.floor(Math.random()*26)]}</div>`;
    for(let i=0; i<introWord.length; i++) gridCont.innerHTML += `<div class="cell highlight" style="width:40px; height:40px;">${introWord[i]}</div>`;

    const slotsCont = document.getElementById('intro-slots');
    slotsCont.innerHTML = '';
    for(let i=0; i<introWord.length; i++) {
        slotsCont.innerHTML += `<div class="slot" style="border:3px solid #b8d9a7;">${introWord[i]}</div>`;
    }
}

// LOGICA DE INTERFACE
function toggleHamburger(e) { e.stopPropagation(); document.getElementById('dropdownMenu').style.display = (document.getElementById('dropdownMenu').style.display === 'flex') ? 'none' : 'flex'; }
function openRDMenu(e) { if(e) e.stopPropagation(); document.getElementById('rdMenu').classList.add('active'); document.getElementById('overlay').style.display = 'block'; closeHamburger(); }
function closeHamburger() { document.getElementById('dropdownMenu').style.display = 'none'; }
function closeMenus() { closeHamburger(); document.getElementById('rdMenu').classList.remove('active'); document.getElementById('overlay').style.display = 'none'; }
window.onclick = () => closeMenus();

// JOGO: INICIAR E ROUNDS
function startGame() {
    show('scr-game'); 
    document.getElementById('status-bar').style.display = 'flex'; 
    document.getElementById('main-title').style.display = 'none'; 
    document.getElementById('mainFooter').style.display = 'none';
    
    const all = [...JOGO_CONFIG.categorias[category].itens];
    // Sorteia 10 palavras (5 aleatórias + 5 aleatórias)
    itemsGame = [...all].sort(() => 0.5 - Math.random()).slice(0, 10);
    if(itemsGame.length < 10) itemsGame = [...itemsGame, ...itemsGame].slice(0,10);

    timer = 0;
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
    document.getElementById('game-name').style.visibility = roundGlobal >= 5 ? 'hidden' : 'visible';
    document.getElementById('game-img').src = JOGO_CONFIG.caminhoImg + it.img;
    
    genGrid();
}

function genGrid() {
    const el = document.getElementById('game-grid'); el.innerHTML = ''; 
    let cells = Array(64).fill('');
    const isH = Math.random() > 0.5;
    const start = isH ? Math.floor(Math.random()*8)*8 + Math.floor(Math.random()*(8-word.length)) : Math.floor(Math.random()*(8-word.length))*8 + Math.floor(Math.random()*8);
    
    for(let i=0; i<word.length; i++) cells[isH ? start+i : start+(i*8)] = word[i];
    const abc = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
    cells.forEach(c => {
        const d = document.createElement('div'); d.className = 'cell'; d.innerText = c || abc[Math.floor(Math.random()*abc.length)];
        d.onmousedown = (e) => { e.preventDefault(); startSelection(d); }; 
        d.onmouseenter = () => continueSelection(d); 
        d.ontouchstart = (e) => { e.preventDefault(); startSelection(d); }; 
        el.appendChild(d);
    });
    window.onmouseup = window.ontouchend = endSelection;
    document.getElementById('grid-container').ontouchmove = (e) => {
        e.preventDefault(); let touch = e.touches[0]; 
        let target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains('cell')) continueSelection(target);
    };
}

function startSelection(el) { if (el.classList.contains('highlight')) return; isDragging = true; selectedCells = [el]; el.classList.add('selecting'); }
function continueSelection(el) {
    if (!isDragging || el.classList.contains('highlight')) return;
    if (selectedCells.length > 1 && el === selectedCells[selectedCells.length - 2]) { let last = selectedCells.pop(); last.classList.remove('selecting'); return; }
    if (!selectedCells.includes(el)) { selectedCells.push(el); el.classList.add('selecting'); }
}

function endSelection() {
    if (!isDragging) return; isDragging = false;
    const res = selectedCells.map(c => c.innerText).join('');
    const banner = document.getElementById('game-banner');
    if (res === word) {
        banner.classList.add('feedback-correct');
        selectedCells.forEach(el => { el.classList.remove('selecting'); el.classList.add('highlight'); });
        score += 150; document.getElementById('score-val').innerText = score; playSound('acerto');
        setTimeout(() => { roundGlobal++; if(roundGlobal >= 10) finish(); else loadRound(); }, 800);
    } else {
        if(selectedCells.length > 0) {
            banner.classList.add('feedback-wrong'); playSound('erro'); 
            score = Math.max(0, score - 20); document.getElementById('score-val').innerText = score;
            setTimeout(() => banner.classList.remove('feedback-wrong'), 800);
        }
        selectedCells.forEach(el => el.classList.remove('selecting'));
    }
    selectedCells = [];
}

function finish() {
    clearInterval(timerInt); playSound('vitoria'); show('scr-result');
    document.getElementById('status-bar').style.display = 'none';
    const rep = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[3];
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rep.img;
    document.getElementById('res-tit').innerText = rep.titulo; 
    document.getElementById('res-msg').innerText = rep.msg;
    document.getElementById('res-pts').innerText = score; 
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText.replace('⏳ ','');
}

function updateDots(total, current) {
    const c = document.getElementById('dots'); c.innerHTML = '';
    for(let i=0; i<total; i++) { 
        const d = document.createElement('div'); 
        d.className = 'dot' + (i < current ? ' done' : (i === current ? ' active' : '')); 
        c.appendChild(d); 
    }
}

function selectCat(k) { 
    category = k; roundGlobal = 0; score = 0; timer = 0; 
    if(timerInt) clearInterval(timerInt); 
    closeMenus(); show('scr-intro'); updateIntroTutorial(k); 
    document.getElementById('mainFooter').style.display = 'flex'; 
    document.getElementById('main-title').style.display = 'block'; 
    document.getElementById('status-bar').style.display = 'none'; 
}

function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id).classList.add('active'); }
function playSound(t) { if(JOGO_CONFIG.sons[t]) { new Audio(JOGO_CONFIG.sons[t]).play().catch(()=>{}); } }

window.onload = init;
