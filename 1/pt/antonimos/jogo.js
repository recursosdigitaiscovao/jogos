let hits = 0;
let miss = 0;
let timer = 0;
let timerInterval;
let selectedA = null;
let selectedB = null;
let totalPairs = 5; // Quantos pares aparecem por jogo

window.onload = function() {
    initUI();
};

function initUI() {
    const setup = CONFIG_MESTRE;
    const tema = BIBLIOTECA_TEMAS[setup.area];
    const cont = BIBLIOTECA_CONTEUDO[setup.ano][setup.area];
    const conf = JOGO_CONFIG;

    // Aplicar Cores Dinâmicas
    const root = document.documentElement;
    root.style.setProperty('--primary-blue', tema.corPrimaria);
    root.style.setProperty('--primary-dark', tema.corEscura);
    root.style.setProperty('--bg-page', tema.corPagina);
    root.style.setProperty('--bg-header', tema.corHeader);
    root.style.setProperty('--bg-container', tema.corContainer);
    root.style.setProperty('--bg-card', tema.corCard);
    root.style.setProperty('--bg-espaco-jogo', tema.corEspacoJogo);
    root.style.setProperty('--borda-espaco-jogo', tema.bordaEspacoJogo);

    document.body.style.opacity = '1';

    // Textos e Logos
    document.getElementById('tit-l1').innerText = cont.t1;
    document.getElementById('tit-l2').innerText = cont.t2;
    document.getElementById('sub-tit').innerText = cont.sub;
    document.getElementById('head-logo').src = conf.caminhoIcons + conf.iconesMenu[setup.ano];
    document.getElementById('header-back-mobile').src = conf.caminhoIcons + tema.voltarMobile;
    document.getElementById('link-voltar-mobile').href = conf.linkVoltar;
    document.getElementById('intro-instr').innerText = "Clica numa palavra e depois no seu antónimo (o seu contrário).";

    // Menu dropdown
    const menuBox = document.getElementById('dropdownMenu');
    ['home', 'pre', 'ano1', 'ano2', 'ano3', 'ano4'].forEach(k => {
        const a = document.createElement('a'); a.className = 'menu-item'; a.href = conf.links[k];
        a.innerHTML = `<img src="${conf.caminhoIcons}${conf.iconesMenu[k]}" width="20"><span>${k.toUpperCase()}</span>`;
        menuBox.appendChild(a);
    });
}

function goToGame() {
    document.getElementById('scr-intro').classList.remove('active');
    document.getElementById('scr-game').classList.add('active');
    document.getElementById('status-bar').style.display = 'flex';
    initGame();
}

function initGame() {
    const cat = JOGO_CATEGORIAS["antonimos_1"];
    const grid = document.getElementById('matching-grid');
    grid.innerHTML = '';
    
    // Sorteia 5 pares
    let embaralhado = [...cat.pares].sort(() => 0.5 - Math.random()).slice(0, totalPairs);
    
    let colA = embaralhado.map(p => ({txt: p.a, id: p.a}));
    let colB = embaralhado.map(p => ({txt: p.b, id: p.a}));

    colA.sort(() => 0.5 - Math.random());
    colB.sort(() => 0.5 - Math.random());

    const divA = document.createElement('div'); divA.className = 'column';
    const divB = document.createElement('div'); divB.className = 'column';

    colA.forEach(item => divA.appendChild(createWordBtn(item, 'A')));
    colB.forEach(item => divB.appendChild(createWordBtn(item, 'B')));

    grid.appendChild(divA);
    grid.appendChild(divB);
    startTimer();
}

function createWordBtn(item, col) {
    const div = document.createElement('div');
    div.className = 'word-item';
    div.innerText = item.txt;
    div.onclick = () => selectWord(div, col, item.id);
    return div;
}

function selectWord(el, col, id) {
    if(el.classList.contains('correct')) return;

    if(col === 'A') {
        document.querySelectorAll('.column:first-child .word-item').forEach(b => b.classList.remove('selected'));
        selectedA = { el, id };
    } else {
        document.querySelectorAll('.column:last-child .word-item').forEach(b => b.classList.remove('selected'));
        selectedB = { el, id };
    }
    el.classList.add('selected');

    if(selectedA && selectedB) {
        if(selectedA.id === selectedB.id) {
            selectedA.el.classList.add('correct');
            selectedB.el.classList.add('correct');
            hits++;
            document.getElementById('hits-val').innerText = hits;
            selectedA = null; selectedB = null;
            if(hits === totalPairs) finishGame();
        } else {
            const a = selectedA.el; const b = selectedB.el;
            a.classList.add('wrong'); b.classList.add('wrong');
            miss++;
            document.getElementById('miss-val').innerText = miss;
            setTimeout(() => { 
                a.classList.remove('wrong', 'selected'); 
                b.classList.remove('wrong', 'selected');
            }, 500);
            selectedA = null; selectedB = null;
        }
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        let m = Math.floor(timer/60).toString().padStart(2,'0');
        let s = (timer%60).toString().padStart(2,'0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function finishGame() {
    clearInterval(timerInterval);
    const score = Math.round((hits / (hits + miss)) * 100);
    const rel = JOGO_CONFIG.relatorios.find(r => score >= r.min && score <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('scr-result').classList.add('active');
    document.getElementById('res-titulo').innerText = rel.titulo;
    document.getElementById('res-img').src = JOGO_CONFIG.caminhoImg + rel.img;
    document.getElementById('res-stats').innerText = `Acertos: ${hits} | Erros: ${miss} | Tempo: ${document.getElementById('timer-val').innerText}`;
}

function toggleHamburger(e) { e.stopPropagation(); const m = document.getElementById('dropdownMenu'); m.style.display = m.style.display === 'flex' ? 'none' : 'flex'; document.getElementById('overlay').style.display = m.style.display; }
function closeMenus() { document.getElementById('dropdownMenu').style.display = 'none'; document.getElementById('overlay').style.display = 'none'; }
