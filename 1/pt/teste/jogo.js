let category = Object.keys(JOGO_CONFIG.categorias)[0];
let roundGlobal = 0; 
let currentLevel = 1; 
let score = 0;
let timer = 0;
let timerInt;
let itemsGame = [];
let currentItem = null;

function init() {
    const pI = JOGO_CONFIG.caminhoIcons;
    const pImg = JOGO_CONFIG.caminhoImg;

    // PREENCHER OS 3 TÍTULOS DINÂMICOS
    document.getElementById('head-logo').src = pI + JOGO_CONFIG.iconesMenu.ano1;
    document.getElementById('header-back-icon').src = pI + "voltar.png";
    document.getElementById('tit-l1').innerText = JOGO_CONFIG.textos.tituloLinha1;
    document.getElementById('tit-l2').innerText = JOGO_CONFIG.textos.tituloLinha2;
    document.getElementById('sub-tit').innerText = JOGO_CONFIG.textos.subtitulo;
    document.getElementById('mainFooter').innerHTML = JOGO_CONFIG.textos.rodape;

    const btnVoltarH = document.getElementById('link-voltar');
    btnVoltarH.href = JOGO_CONFIG.linkVoltar;
    btnVoltarH.innerHTML = `<img src="${pI}voltar.png"> ${JOGO_CONFIG.textoVoltar}`;

    document.getElementById('rd-game-btn').src = pImg + "rd.png";
    document.getElementById('rd-intro-btn').src = pImg + "rd.png";
    document.getElementById('btn-back-link').onclick = () => window.location.href = JOGO_CONFIG.linkVoltar;

    // MENU HAMBÚRGUER
    const menuBox = document.getElementById('dropdownMenu');
    menuBox.innerHTML = '';
    ['home', 'pre', 'ano1', 'ano2', 'ano3', 'ano4'].forEach(k => {
        const a = document.createElement('a'); a.className = 'menu-item'; a.href = JOGO_CONFIG.links[k];
        a.innerHTML = `<img src="${pI}${JOGO_CONFIG.iconesMenu[k]}"><span>${k === 'home' ? 'Início' : k.replace('ano',' ')+'º Ano'}</span>`; 
        menuBox.appendChild(a);
    });
    const div = document.createElement('div'); div.className = 'menu-divider'; menuBox.appendChild(div);
    const btnV = document.createElement('a'); btnV.className = 'menu-item menu-item-voltar'; btnV.href = JOGO_CONFIG.linkVoltar;
    btnV.innerHTML = `<img src="${pI}voltar.png"><span>${JOGO_CONFIG.textoVoltar}</span>`;
    menuBox.appendChild(btnV);

    // RD MENU
    const rdList = document.getElementById('rd-list');
    rdList.innerHTML = '';
    Object.keys(JOGO_CONFIG.categorias).forEach(k => {
        const c = JOGO_CONFIG.categorias[k];
        const card = document.createElement('div'); card.className = 'category-card';
        card.innerHTML = `<img src="${pImg}${c.imgCapa}"><span>${c.nome}</span>`;
        card.onclick = (e) => { e.stopPropagation(); selectCat(k); }; 
        rdList.appendChild(card);
    });

    updateIntroTutorial();
}

function updateIntroTutorial() {
    const cat = JOGO_CONFIG.categorias[category];
    const item = cat.itens[0];
    document.getElementById('intro-img').src = JOGO_CONFIG.caminhoImg + item.img;
    document.getElementById('intro-name-label').innerText = item.nome;
    
    const slotsArea = document.getElementById('intro-slots');
    slotsArea.innerHTML = ''; 
    for(let i=1; i<=4; i++) {
        const b = document.createElement('div');
        b.className = 'cell'; b.style.width = "65px"; b.style.height = "65px";
        b.innerText = i;
        if(i === item.silabas) b.id = "hand-target"; 
        slotsArea.appendChild(b);
    }

    const hand = document.createElement('i');
    hand.className = "fas fa-hand-pointer hand-tutorial";
    hand.id = "moving-hand";
    hand.style.top = "50px";
    slotsArea.appendChild(hand);

    setTimeout(() => {
        const target = document.getElementById('hand-target');
        const handEl = document.getElementById('moving-hand');
        if(target && handEl) {
            const pos = target.offsetLeft + (target.offsetWidth / 2) - 10;
            handEl.style.left = pos + "px";
            setInterval(() => {
                handEl.style.transform = "translateY(15px) scale(0.9)";
                target.style.backgroundColor = "#bbdefb";
                setTimeout(() => {
                    handEl.style.transform = "translateY(0) scale(1.1)";
                    target.style.backgroundColor = "white";
                }, 500);
            }, 1500);
        }
    }, 400);
}

function startGame() {
    show('scr-game');
    document.getElementById('status-bar').style.display = 'flex';
    document.getElementById('main-title').style.display = 'none';
    
    const all = [...JOGO_CONFIG.categorias[category].itens].sort(() => 0.5 - Math.random());
    itemsGame = all.slice(0, 10);
    if(itemsGame.length < 10) {
        while(itemsGame.length < 10) itemsGame.push(all[Math.floor(Math.random()*all.length)]);
    }

    roundGlobal = 0; currentLevel = 1; score = 0; timer = 0;
    timerInt = setInterval(() => {
        timer++;
        let m = Math.floor(timer/60).toString().padStart(2,'0');
        let s = (timer%60).toString().padStart(2,'0');
        document.getElementById('timer').innerText = `⏳ ${m}:${s}`;
    }, 1000);
    loadTask();
}

function loadTask() {
    const idx = (currentLevel === 1) ? roundGlobal : (roundGlobal + 5);
    currentItem = itemsGame[idx];
    updateDots(5, roundGlobal);
    document.getElementById('game-banner').classList.remove('feedback-correct', 'feedback-wrong');
    document.getElementById('game-img').src = JOGO_CONFIG.caminhoImg + currentItem.img;
    const nl = document.getElementById('game-name');
    nl.innerText = currentItem.nome;
    nl.style.visibility = (currentLevel === 1) ? 'visible' : 'hidden';
    renderButtons();
}

function renderButtons() {
    const grid = document.getElementById('game-grid'); grid.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
        const btn = document.createElement('div');
        btn.className = 'cell'; btn.innerText = i;
        btn.onclick = () => checkAnswer(i);
        grid.appendChild(btn);
    }
}

function checkAnswer(num) {
    const banner = document.getElementById('game-banner');
    if (num === currentItem.silabas) {
        banner.classList.add('feedback-correct');
        score += (currentLevel === 1) ? 100 : 200;
        document.getElementById('score-val').innerText = score;
        playSound('acerto');
        setTimeout(() => {
            roundGlobal++;
            if (roundGlobal >= 5) {
                if (currentLevel === 1) { currentLevel = 2; roundGlobal = 0; loadTask(); }
                else finish();
            } else loadTask();
        }, 800);
    } else {
        banner.classList.add('feedback-wrong'); playSound('erro');
        score = Math.max(0, score - 20); document.getElementById('score-val').innerText = score;
        setTimeout(() => banner.classList.remove('feedback-wrong'), 800);
    }
}

function finish() {
    clearInterval(timerInt); playSound('vitoria'); show('scr-result');
    document.getElementById('status-bar').style.display = 'none';
    const rep = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[3];
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rep.img;
    document.getElementById('res-tit').innerText = rep.titulo;
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
    category = k; roundGlobal = 0; currentLevel = 1; score = 0;
    if(timerInt) clearInterval(timerInt);
    closeMenus(); show('scr-intro'); updateIntroTutorial();
}

function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function toggleHamburger(e) { e.stopPropagation(); document.getElementById('dropdownMenu').style.display = (document.getElementById('dropdownMenu').style.display === 'flex') ? 'none' : 'flex'; }
function openRDMenu(e) { if(e) e.stopPropagation(); document.getElementById('rdMenu').classList.add('active'); document.getElementById('overlay').style.display = 'block'; }
function closeMenus() { document.getElementById('dropdownMenu').style.display = 'none'; document.getElementById('rdMenu').classList.remove('active'); document.getElementById('overlay').style.display = 'none'; }
function playSound(t) { if(JOGO_CONFIG.sons[t]) new Audio(JOGO_CONFIG.sons[t]).play().catch(()=>{}); }

window.onload = init;
