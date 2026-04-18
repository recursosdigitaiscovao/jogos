/* =========================================================
   SOPA.JS - LÓGICA DO MOTOR DO JOGO
   ========================================================= */

let category = 'animais';
let roundGlobal = 0;
let score = 0;
let timer = 0;
let timerInt;
let itemsGame = [];
let word = "";
let isDragging = false;
let selectedCells = [];

function initInterface() {
    const pI = JOGO_CONFIG.caminhoIcons;
    const pImg = JOGO_CONFIG.caminhoImg;
    
    // Configura Header e Assets Iniciais
    document.getElementById('head-logo').src = pI + JOGO_CONFIG.iconesMenu.ano1;
    document.getElementById('icon-voltar').src = pI + "voltar.png";
    document.getElementById('link-voltar').href = JOGO_CONFIG.links.ano1;
    document.getElementById('rd-game-btn').src = pImg + "rd.png";
    document.getElementById('rd-intro-btn').src = pImg + "rd.png";

    // Menu Hamburguer
    const menuBox = document.getElementById('dropdownMenu');
    menuBox.innerHTML = '';
    ['home', 'pre', 'ano1', 'ano2', 'ano3', 'ano4'].forEach(k => {
        const a = document.createElement('a');
        a.className = 'menu-item';
        a.href = JOGO_CONFIG.links[k];
        a.innerHTML = `<img src="${pI}${JOGO_CONFIG.iconesMenu[k]}"><span>${k==='home'?'Início':k==='pre'?'Pré':k.replace('ano','')+'º Ano'}</span>`;
        menuBox.appendChild(a);
    });

    // Lista de Temas (RD)
    const rdList = document.getElementById('rd-list');
    rdList.innerHTML = '';
    Object.keys(JOGO_CONFIG.categorias).forEach(k => {
        const c = JOGO_CONFIG.categorias[k];
        const card = document.createElement('div');
        card.style = "background:#f8faff; padding:15px; border-radius:20px; text-align:center; cursor:pointer; border:1px solid #eef2f6;";
        card.innerHTML = `<img src="${pImg}${c.imgCapa}" style="width:50px; margin-bottom:8px;"><br><span style="font-weight:800; font-size:14px; color:#5d7082;">${c.nome}</span>`;
        card.onclick = () => selectCat(k);
        rdList.appendChild(card);
    });

    updateIntroTutorial(category);
}

// Funções de Menu
function toggleHamburger(e) { e.stopPropagation(); const m = document.getElementById('dropdownMenu'); m.style.display = (m.style.display==='flex')?'none':'flex'; }
function openRDMenu(e) { e.stopPropagation(); document.getElementById('rdMenu').classList.add('active'); document.getElementById('overlay').style.display='block'; }
function closeMenus() { document.getElementById('dropdownMenu').style.display='none'; document.getElementById('rdMenu').classList.remove('active'); document.getElementById('overlay').style.display='none'; }

function selectCat(k) { 
    category = k; roundGlobal = 0; score = 0; timer = 0; 
    if(timerInt) clearInterval(timerInt); 
    closeMenus(); updateIntroTutorial(k); showScreen('scr-intro'); 
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
}

function playSnd(type) {
    if(JOGO_CONFIG.sons[type]) {
        let audio = new Audio(JOGO_CONFIG.sons[type]);
        audio.play().catch(e => console.log("Erro som:", e));
    }
}

// Lógica de Jogo
function updateIntroTutorial(catKey) {
    const item = JOGO_CONFIG.categorias[catKey].itens[0];
    const cleanWord = item.nome.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    document.getElementById('intro-img').src = JOGO_CONFIG.caminhoImg + item.img;
    document.getElementById('intro-name-label').innerText = item.nome;

    const gridCont = document.getElementById('intro-letter-cells');
    gridCont.style.gridTemplateColumns = `repeat(${cleanWord.length}, 40px)`;
    document.documentElement.style.setProperty('--drag-dist', `${(cleanWord.length-1)*42 + 10}px`);

    const slots = document.getElementById('intro-slots'); slots.innerHTML = '';
    for(let i=0; i<cleanWord.length; i++) {
        slots.innerHTML += `<div style="width:42px; height:42px; background:white; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); border:2px solid #cbd9e6;">${cleanWord[i]}</div>`;
    }
}

function startGame() {
    showScreen('scr-game');
    document.getElementById('status-bar').style.display = 'flex';
    document.getElementById('main-title').style.display = 'none';
    
    const all = [...JOGO_CONFIG.categorias[category].itens];
    itemsGame = all.sort(() => 0.5 - Math.random()).slice(0, 10);
    
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
    const el = document.getElementById('game-grid'); el.innerHTML = ''; 
    let cells = Array(64).fill('');
    const isH = Math.random() > 0.5;
    const start = isH ? Math.floor(Math.random()*8)*8 + Math.floor(Math.random()*(8-word.length)) : Math.floor(Math.random()*(8-word.length))*8 + Math.floor(Math.random()*8);
    for(let i=0; i<word.length; i++) cells[isH ? start+i : start+(i*8)] = word[i];
    const abc = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
    cells.forEach(c => {
        const d = document.createElement('div'); d.className = 'cell'; d.innerText = c || abc[Math.floor(Math.random()*abc.length)];
        d.onmousedown = (e) => { e.preventDefault(); startSel(d); }; d.onmouseenter = () => contSel(d);
        d.ontouchstart = (e) => { e.preventDefault(); startSel(d); }; el.appendChild(d);
    });
    window.onmouseup = window.ontouchend = endSel;
    document.getElementById('grid-container').ontouchmove = (e) => {
        let t = e.touches[0]; let target = document.elementFromPoint(t.clientX, t.clientY);
        if (target && target.classList.contains('cell')) contSel(target);
    };
}

function startSel(el) { isDragging = true; selectedCells = [el]; el.classList.add('selecting'); }
function contSel(el) { if (isDragging && !selectedCells.includes(el)) { selectedCells.push(el); el.classList.add('selecting'); } }

function endSel() {
    if (!isDragging) return; isDragging = false;
    const res = selectedCells.map(c => c.innerText).join('');
    if (res === word) {
        playSnd('acerto');
        document.getElementById('game-banner').classList.add('feedback-correct');
        selectedCells.forEach(c => { c.classList.remove('selecting'); c.classList.add('highlight'); });
        score += 150; document.getElementById('score-val').innerText = score;
        setTimeout(() => { roundGlobal++; if(roundGlobal >= 10) finish(); else loadRound(); }, 800);
    } else {
        playSnd('erro');
        document.getElementById('game-banner').classList.add('feedback-wrong');
        setTimeout(() => document.getElementById('game-banner').classList.remove('feedback-wrong'), 800);
        selectedCells.forEach(c => c.classList.remove('selecting'));
    }
    selectedCells = [];
}

function finish() {
    clearInterval(timerInt);
    playSnd('vitoria');
    showScreen('scr-result');
    document.getElementById('status-bar').style.display = 'none';
    
    // Escolhe o relatório certo baseado no score
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
        d.style = `width:12px; height:12px; border-radius:50%; background:${i <= current ? 'var(--primary-blue)' : '#d0e0f0'}; transition:0.3s; ${i===current?'transform:scale(1.3);':''}`;
        c.appendChild(d);
    }
}

window.onload = initInterface;
