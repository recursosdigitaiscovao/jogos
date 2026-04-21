let currentCat = 'cat1';
let currentDiff = 'facil';
let currentIndex = 0;
let roundInLevel = 0;
let currentSubLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let foundInRound = 0;

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

function startLogic() {
    const rdList = document.getElementById('rd-list');
    rdList.innerHTML = '';
    Object.keys(JOGO_CONFIG.categorias).forEach(k => {
        const cat = JOGO_CONFIG.categorias[k];
        const group = document.createElement('div');
        group.className = 'cat-group';
        group.innerHTML = `
            <div style="font-weight:900; color:var(--primary-blue); margin-bottom:10px;">${cat.nome}</div>
            <div class="level-btns">
                <button class="btn-lvl" onclick="selectMission('${k}', 'facil')">FÁCIL</button>
                <button class="btn-lvl" onclick="selectMission('${k}', 'normal')">NORMAL</button>
                <button class="btn-lvl" onclick="selectMission('${k}', 'dificil')">DIFÍCIL</button>
            </div>
        `;
        rdList.appendChild(group);
    });
}

function selectMission(cat, diff) {
    currentCat = cat;
    currentDiff = diff;
    closeMenus();
    currentIndex = 0;
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
    else goToGame();
}

window.initGame = function() {
    currentIndex = 0; roundInLevel = 0; currentSubLevel = 1; score = 0;
    document.getElementById('score-val').innerText = score;
    setupDots();
    startTimer();
    renderRound();
};

function setupDots() {
    const dc = document.getElementById('dots-container');
    dc.innerHTML = '';
    for(let i=0; i<5; i++) {
        const d = document.createElement('div');
        d.className = 'dot';
        dc.appendChild(d);
    }
}

function renderRound() {
    const catData = JOGO_CONFIG.categorias[currentCat].niveis[currentDiff];
    const data = catData && catData[currentIndex] ? catData[currentIndex] : JOGO_CONFIG.categorias['cat1'].niveis['facil'][0];
    
    foundInRound = 0;
    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div id="rocket" style="position:absolute; top:45%; left:50%; transform:translate(-50%, -50%); transition: 1s cubic-bezier(.62,-0.18,.96,.56);">
            <img src="${JOGO_CONFIG.caminhoImg}foguetao.png" style="width:140px;">
            <div style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); background:white; color:black; padding:2px 10px; border-radius:5px; font-weight:900; font-size:18px;">${data.alvo}</div>
            <div id="fire" style="width:30px; height:60px; background:orange; margin:-10px auto; filter:blur(10px); opacity:0; border-radius:50%;"></div>
        </div>
        <div id="asteroids-field"></div>
        <svg id="laser-svg" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></svg>
    `;

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const field = document.getElementById('asteroids-field');
    const options = [...data.rimas.map(r => ({t: r, ok: true})), ...data.dist.map(d => ({t: d, ok: false}))].sort(() => Math.random() - 0.5);

    options.forEach((opt, i) => {
        const angle = (i * (360 / options.length)) * (Math.PI / 180);
        const x = 50 + 35 * Math.cos(angle);
        const y = 45 + 30 * Math.sin(angle);
        const ast = document.createElement('div');
        ast.style.cssText = `position:absolute; top:${y}%; left:${x}%; transform:translate(-50%, -50%); cursor:pointer; transition: 0.5s; z-index:10;`;
        ast.innerHTML = `
            <div style="position:relative; width:80px; height:80px; display:flex; align-items:center; justify-content:center; background:url('${JOGO_CONFIG.caminhoImg}asteroides.png') no-repeat center; background-size:contain;">
                <span style="font-weight:900; font-size:12px; color:white;">${opt.t}</span>
            </div>
        `;
        ast.onclick = () => handleChoice(ast, opt.ok, data.rimas.length);
        field.appendChild(ast);
    });
}

function handleChoice(el, ok, total) {
    if(el.style.opacity === "0") return;
    if(ok) {
        sndAcerto.play();
        score += 100;
        document.getElementById('score-val').innerText = score;
        
        // Efeito Laser e Sugar
        const rocket = document.getElementById('rocket');
        const rRect = rocket.getBoundingClientRect();
        const aRect = el.getBoundingClientRect();
        drawLaser(rRect.left + rRect.width/2, rRect.top + rRect.height/2, aRect.left + aRect.width/2, aRect.top + aRect.height/2);
        
        el.style.left = "50%"; el.style.top = "45%"; el.style.transform = "translate(-50%,-50%) scale(0)"; el.style.opacity = "0";
        foundInRound++;
        if(foundInRound >= total) setTimeout(nextRound, 1000);
    } else {
        sndErro.play();
        score = Math.max(0, score - 30);
        document.getElementById('score-val').innerText = score;
        el.style.animation = "shake 0.4s";
        setTimeout(() => el.style.animation = "", 400);
    }
}

function drawLaser(x1, y1, x2, y2) {
    const svg = document.getElementById('laser-svg');
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#5ba4e5"); line.setAttribute("stroke-width", "5");
    line.style.filter = "drop-shadow(0 0 5px white)";
    svg.appendChild(line);
    setTimeout(() => line.remove(), 300);
}

function nextRound() {
    currentIndex++; roundInLevel++;
    if(roundInLevel < 5) renderRound();
    else {
        // Decolagem
        const r = document.getElementById('rocket');
        document.getElementById('fire').style.opacity = "1";
        r.style.transform = "translate(-50%, -1000px)";
        setTimeout(() => {
            if(currentSubLevel === 1) {
                currentSubLevel = 2; roundInLevel = 0; setupDots(); renderRound();
            } else finishGame();
        }, 1200);
    }
}

function finishGame() {
    clearInterval(timerInterval); sndVitoria.play();
    document.getElementById('res-pts').innerText = score;
    const rel = JOGO_CONFIG.relatorios.find(r => score >= r.min);
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
    goToResult();
}

function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerSeconds = 0;
    timerInterval = setInterval(() => {
        timerSeconds++;
        const m = Math.floor(timerSeconds/60).toString().padStart(2,'0');
        const s = (timerSeconds%60).toString().padStart(2,'0');
        document.getElementById('timer').innerText = `${m}:${s}`;
    }, 1000);
}
