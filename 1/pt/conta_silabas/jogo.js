/**
 * MOTOR DO JOGO: CONTAR SÍLABAS
 * Pequenos Leitores - Versão Sílabas
 */

let category = Object.keys(JOGO_CONFIG.categorias)[0];
let roundGlobal = 0; // De 0 a 4 (5 itens)
let levelInternal = 0; // 0 = Imagem + Palavra, 1 = Só Imagem
let score = 0;
let timer = 0;
let timerInt;
let itemsGame = [];
let currentItem = null;

// INICIALIZAÇÃO
function init() {
    const pI = JOGO_CONFIG.caminhoIcons;
    const pImg = JOGO_CONFIG.caminhoImg;

    // Header e Navegação
    document.getElementById('head-logo').src = pI + JOGO_CONFIG.iconesMenu.ano1;
    document.getElementById('header-back-icon').src = pI + "voltar.png";
    
    const btnVoltarHeader = document.getElementById('link-voltar');
    btnVoltarHeader.href = JOGO_CONFIG.linkVoltar;
    btnVoltarHeader.innerHTML = `<img src="${pI}voltar.png"> ${JOGO_CONFIG.textoVoltar}`;

    document.getElementById('tit-l1').innerText = "CONTAR";
    document.getElementById('sub-tit').innerText = "SÍLABAS";
    document.getElementById('mainFooter').innerHTML = JOGO_CONFIG.textos.rodape;

    document.getElementById('rd-game-btn').src = pImg + "rd.png";
    document.getElementById('rd-intro-btn').src = pImg + "rd.png";
    document.getElementById('btn-back-link').onclick = () => window.location.href = JOGO_CONFIG.linkVoltar;

    // Menu Hambúrguer
    const menuBox = document.getElementById('dropdownMenu');
    menuBox.innerHTML = '';
    ['home', 'pre', 'ano1', 'ano2', 'ano3', 'ano4'].forEach(k => {
        const label = k === 'home' ? 'Início' : (k === 'pre' ? 'Pré' : k.replace('ano', '') + 'º Ano');
        const a = document.createElement('a'); 
        a.className = 'menu-item'; 
        a.href = JOGO_CONFIG.links[k];
        a.innerHTML = `<img src="${pI}${JOGO_CONFIG.iconesMenu[k]}"><span>${label}</span>`; 
        menuBox.appendChild(a);
    });

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

// Tutorial simples adaptado para sílabas
function updateIntroTutorial() {
    const cat = JOGO_CONFIG.categorias[category];
    const item = cat.itens[0];
    document.getElementById('intro-img').src = JOGO_CONFIG.caminhoImg + item.img;
    document.getElementById('intro-name-label').innerText = item.nome;
    
    // Mostra um exemplo de botões no tutorial
    const slotsCont = document.getElementById('intro-slots');
    slotsCont.innerHTML = '<div style="font-weight:700; color:#89a; font-size:14px;">Quantas sílabas tem?</div>';
    
    const gridCont = document.getElementById('intro-letter-cells');
    gridCont.innerHTML = `<div style="display:flex; gap:10px;">
        <div class="cell" style="width:45px; height:45px; background:var(--primary-blue); color:white;">1</div>
        <div class="cell" style="width:45px; height:45px; background:var(--highlight-green); color:white;">2</div>
        <div class="cell" style="width:45px; height:45px; background:var(--primary-blue); color:white;">3</div>
    </div>`;
}

// LÓGICA DO JOGO
function startGame() {
    show('scr-game');
    document.getElementById('status-bar').style.display = 'flex';
    document.getElementById('main-title').style.display = 'none';
    
    const all = [...JOGO_CONFIG.categorias[category].itens];
    itemsGame = all.sort(() => 0.5 - Math.random()).slice(0, 5); // 5 palavras aleatórias
    
    roundGlobal = 0;
    levelInternal = 0;
    score = 0;
    timer = 0;
    timerInt = setInterval(() => {
        timer++;
        let m = Math.floor(timer/60).toString().padStart(2,'0');
        let s = (timer%60).toString().padStart(2,'0');
        document.getElementById('timer').innerText = `⏳ ${m}:${s}`;
    }, 1000);

    loadTask();
}

function loadTask() {
    currentItem = itemsGame[roundGlobal];
    updateDots(5, roundGlobal);

    const banner = document.getElementById('game-banner');
    banner.classList.remove('feedback-correct', 'feedback-wrong');
    
    document.getElementById('game-img').src = JOGO_CONFIG.caminhoImg + currentItem.img;
    
    // Nível 0: Mostra nome | Nível 1: Esconde nome
    const nameLabel = document.getElementById('game-name');
    nameLabel.innerText = currentItem.nome;
    nameLabel.style.visibility = (levelInternal === 0) ? 'visible' : 'hidden';

    renderButtons();
}

function renderButtons() {
    const grid = document.getElementById('game-grid');
    grid.style.gridTemplateColumns = "repeat(2, 1fr)";
    grid.style.gap = "15px";
    grid.innerHTML = '';

    // Criar botões de 1 a 4
    for (let i = 1; i <= 4; i++) {
        const btn = document.createElement('div');
        btn.className = 'cell';
        btn.style.width = "100%";
        btn.style.height = "60px";
        btn.style.fontSize = "28px";
        btn.innerText = i;
        btn.onclick = () => checkAnswer(i);
        grid.appendChild(btn);
    }
}

function checkAnswer(numSelected) {
    const correctSyllables = countSyllables(currentItem.nome);
    const banner = document.getElementById('game-banner');

    if (numSelected === correctSyllables) {
        // ACERTO
        banner.classList.add('feedback-correct');
        score += (levelInternal === 0) ? 100 : 150; // Nível 2 vale mais pontos
        document.getElementById('score-val').innerText = score;
        playSound('acerto');

        setTimeout(() => {
            if (levelInternal === 0) {
                levelInternal = 1; // Passa para o nível 2 da mesma palavra
            } else {
                levelInternal = 0;
                roundGlobal++; // Passa para a próxima palavra
            }

            if (roundGlobal >= 5) finish();
            else loadTask();
        }, 800);

    } else {
        // ERRO
        banner.classList.add('feedback-wrong');
        playSound('erro');
        score = Math.max(0, score - 20);
        document.getElementById('score-val').innerText = score;
        setTimeout(() => banner.classList.remove('feedback-wrong'), 800);
    }
}

// Função para contar sílabas (Lógica simplificada para Português de 1º Ano)
function countSyllables(word) {
    let w = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Regra básica para 1º ano: contar grupos de vogais
    // Ex: "vaca" (v-a-c-a) -> 2 | "cão" (c-ão) -> 1 | "cavalo" (c-a-v-a-l-o) -> 3
    const matches = w.match(/[aeiouy]+/g);
    let count = matches ? matches.length : 0;

    // Ajuste para hiatos comuns no 1º ano (ex: coelho -> co-e-lho)
    if (w.includes("oe")) count++; 
    if (w.includes("ua") && w !== "ua") count++; // simplificação

    return count;
}

// INTERFACE FINAL
function finish() {
    clearInterval(timerInt);
    playSound('vitoria');
    show('scr-result');
    document.getElementById('status-bar').style.display = 'none';
    
    const rep = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[3];
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rep.img;
    document.getElementById('res-tit').innerText = rep.titulo;
    document.getElementById('res-msg').innerText = "Completaste as 5 palavras nos dois níveis!";
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
    category = k; roundGlobal = 0; levelInternal = 0; score = 0;
    if(timerInt) clearInterval(timerInt);
    closeMenus(); show('scr-intro'); updateIntroTutorial();
    document.getElementById('main-title').style.display = 'block';
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
