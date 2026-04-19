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

    document.getElementById('head-logo').src = pI + JOGO_CONFIG.iconesMenu.ano1;
    document.getElementById('header-back-icon').src = pI + "voltar.png";
    document.getElementById('txt-titulo-linha1').innerHTML = `${txt.tituloLinha1}<br>${txt.tituloLinha2}`;
    document.getElementById('txt-subtitulo').innerText = txt.subtitulo;
    document.getElementById('mainFooter').innerHTML = txt.rodape;
    document.getElementById('rd-game-btn').src = pImg + "rd.png";
    document.getElementById('rd-intro-btn').src = pImg + "rd.png";
    document.getElementById('btn-back-header').href = JOGO_CONFIG.links.home;

    // Menu Hamburger
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
    
    const divider = document.createElement('div');
    divider.className = 'menu-divider';
    menuBox.appendChild(divider);

    const btnV = document.createElement('a');
    btnV.className = 'menu-item menu-item-voltar';
    btnV.href = '../index.html'; 
    btnV.innerHTML = `<img src="${pI}voltar.png" style="filter: brightness(0) invert(1);"><span>VOLTAR</span>`;
    menuBox.appendChild(btnV);

    // RD Menu
    const rdList = document.getElementById('rd-list');
    Object.keys(JOGO_CONFIG.categorias).forEach(k => {
        const c = JOGO_CONFIG.categorias[k];
        const card = document.createElement('div'); 
        card.className = 'category-card';
        card.innerHTML = `<img src="${pImg}${c.imgCapa}"><span>${c.nome}</span>`;
        card.onclick = () => selectCat(k);
        rdList.appendChild(card);
    });

    updateIntroTutorial(category);
}

function toggleHamburger(e) { e.stopPropagation(); const m = document.getElementById('dropdownMenu'); const vis = m.style.display === 'flex'; m.style.display = vis ? 'none' : 'flex'; document.getElementById('overlay').style.display = vis ? 'none' : 'block'; }
function openRDMenu(e) { if(e) e.stopPropagation(); document.getElementById('rdMenu').classList.add('active'); document.getElementById('overlay').style.display = 'block'; closeHamburger(); }
function closeHamburger() { document.getElementById('dropdownMenu').style.display = 'none'; }
function closeMenus() { closeHamburger(); document.getElementById('rdMenu').classList.remove('active'); document.getElementById('overlay').style.display = 'none'; }
window.onclick = () => closeMenus();

function selectCat(k) { category = k; roundGlobal = 0; score = 0; timer = 0; if(timerInt) clearInterval(timerInt); closeMenus(); show('scr-intro'); updateIntroTutorial(k); document.getElementById('mainFooter').style.display = 'flex'; document.getElementById('main-title').style.display = 'block'; document.getElementById('status-bar').style.display = 'none'; document.getElementById('score-val').innerText = "0"; }

function updateIntroTutorial(catKey) {
    const item = JOGO_CONFIG.categorias[catKey].itens[0], pImg = JOGO_CONFIG.caminhoImg;
    const introWord = item.nome.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    document.getElementById('intro-img').src = pImg + item.img;
    document.getElementById('intro-name-label').innerText = item.nome;
    const gridCont = document.getElementById('intro-letter-cells');
    gridCont.style.gridTemplateColumns = `repeat(${introWord.length}, 40px)`;
    document.documentElement.style.setProperty('--drag-dist', `${(introWord.length - 1) * 42 + 10}px`);
    gridCont.innerHTML = `<i class="fas fa-hand-pointer hand-tutorial"></i>`;
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i=0; i<introWord.length; i++) gridCont.innerHTML += `<div class="cell" style="width:40px; height:40px;">${abc[Math.floor(Math.random()*26)]}</div>`;
    for(let i=0; i
