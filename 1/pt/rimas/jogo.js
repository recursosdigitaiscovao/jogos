let currentCategory = 'cat1';
let currentDifficulty = 'facil';
let currentIndex = 0; 
let roundInLevel = 0; 
let currentSubLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let foundRhymes = 0;
let totalRhymesInRound = 0;

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
            <div style="font-weight:900; color:var(--primary-blue); font-size:14px;">${cat.nome}</div>
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
    currentCategory = cat;
    currentDifficulty = diff;
    closeMenus();
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
    else goToGame();
}

window.initGame = function() {
    currentIndex = 0; roundInLevel = 0; currentSubLevel = 1; score = 0; timerSeconds = 0;
    document.getElementById('score-val').innerText = score;
    setupDots();
    startTimer();
    renderRound();
};

function setupDots() {
    const dc = document.getElementById('dots-container');
    dc.innerHTML = '';
    // 5 bolinhas por subnível
    for(let i=0; i<5; i++) { 
        const dot = document.createElement('div'); 
        dot.className = 'dot'; 
        dc.appendChild(dot); 
    }
}

function renderRound() {
    const roundData = JOGO_CONFIG.categorias[currentCategory].niveis[currentDifficulty][currentIndex];
    if(!roundData) { finishGame(); return; }

    foundRhymes = 0;
    totalRhymesInRound = roundData.rimas.length;
    
    // Atualizar Dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <svg id="laser-svg" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:5;"></svg>
        
        <!-- FOGUETÃO CENTRAL -->
        <div id="rocket-node" class="floating" style="position:absolute; top:45%; left:50%; transform:translate(-50%, -50%); z-index:10; text-align:center; transition: all 1s ease-in;">
            <div style="position:relative;">
                <img src="${JOGO_CONFIG.caminhoImg}foguetao.png" style="width:160px; filter: drop-shadow(0 0 15px rgba(91,164,229,0.4));">
                <div style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); width:100px; text-align:center;">
                    <span style="font-weight:900; color:#0b0e1b; font-size:18px; text-transform:uppercase; background:rgba(255,255,255,0.8); padding:2px 8px; border-radius:5px;">${roundData.alvo}</span>
                </div>
            </div>
            <div id="thruster" style="height:40px; width:40px; background:orange; margin: -10px auto 0; border-radius: 50% 50% 20% 20%; filter:blur(10px); opacity:0; transition:0.3s;"></div>
        </div>

        <!-- ASTERÓIDES -->
        <div id="asteroids-field"></div>
    `;

    const field = document.getElementById('asteroids-field');
    const options = [...roundData.rimas.map(r => ({txt: r, ok: true})), ...roundData.dist.map(d => ({txt: d, ok: false}))];
    options.sort(() => Math.random() - 0.5);

    // Posições circulares ao redor do foguete
    const total = options.length;
    options.forEach((opt, i) => {
        const angle = (i * (360 / total)) * (Math.PI / 180);
        const radius = 140; 
        const x = 50 + (radius/4) * Math.cos(angle); 
        const y = 45 + (radius/3) * Math.sin(angle);

        const ast = document.createElement('div');
        ast.className = 'asteroid floating';
        ast.style.cssText = `position:absolute; top:${y}%; left:${x}%; transform:translate(-50%, -50%); cursor:pointer; z-index:15; transition:0.5s;`;
        ast.innerHTML = `
            <div style="position:relative; width:90px; height:90px; display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}asteroides.png" style="width:100%; height:100%; object-fit:contain;">
                <span style="position:absolute; font-weight:900; font-size:12px; color:white; text-align:center; padding:10px;">${opt.txt}</span>
            </div>
        `;
        ast.onclick = () => handleChoice(ast, opt.ok);
        field.appendChild(ast);
    });
}

function handleChoice(el, isOk) {
    if(el.classList.contains('clicked')) return;
    
    if(isOk) {
        el.classList.add('clicked');
        sndAcerto.play();
        score += JOGO_CONFIG.pontuacao.acerto;
        document.getElementById('score-val').innerText = score;
        
        // Efeito Laser
        drawLaser(el);
        
        // Sugar asteróide para o foguete
        const rocket = document.getElementById('rocket-node');
        const rRect = rocket.getBoundingClientRect();
        const aRect = el.getBoundingClientRect();
        
        el.style.left = (rRect.left + rRect.width/2) + 'px';
        el.style.top = (rRect.top + rRect.height/2) + 'px';
        el.style.transform = 'translate(-50%, -50%) scale(0)';
        el.style.opacity = '0';
        
        document.getElementById('thruster').style.opacity = '1';
        setTimeout(() => document.getElementById('thruster').style.opacity = '0.4', 300);

        foundRhymes++;
        if(foundRhymes >= totalRhymesInRound) {
            setTimeout(nextRound, 1000);
        }
    } else {
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        el.classList.add('shake-animation');
        setTimeout(() => el.classList.remove('shake-animation'), 400);
    }
}

function drawLaser(el) {
    const svg = document.getElementById('laser-svg');
    const rocket = document.getElementById('rocket-node');
    const rRect = rocket.getBoundingClientRect();
    const aRect = el.getBoundingClientRect();
    
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", rRect.left + rRect.width/2);
    line.setAttribute("y1", rRect.top + rRect.height/2);
    line.setAttribute("x2", aRect.left + aRect.width/2);
    line.setAttribute("y2", aRect.top + aRect.height/2);
    line.setAttribute("stroke", "#5ba4e5");
    line.setAttribute("stroke-width", "4");
    line.style.filter = "drop-shadow(0 0 5px #5ba4e5)";
    
    svg.appendChild(line);
    setTimeout(() => line.remove(), 400);
}

function nextRound() {
    currentIndex++;
    roundInLevel++;
    
    if(roundInLevel < 5) {
        renderRound();
    } else if (currentSubLevel === 1) {
        // Lançar foguete entre subníveis
        currentSubLevel = 2;
        roundInLevel = 0;
        launchRocket(() => {
            setupDots();
            renderRound();
        });
    } else {
        launchRocket(() => finishGame());
    }
}

function launchRocket(callback) {
    const rocket = document.getElementById('rocket-node');
    const thruster = document.getElementById('thruster');
    thruster.style.opacity = '1';
    thruster.style.height = '100px';
    thruster.style.background = 'linear-gradient(to bottom, orange, transparent)';
    
    rocket.style.transition = 'transform 1.5s cubic-bezier(.62,-0.18,.96,.56), opacity 1s';
    rocket.style.transform = 'translate(-50%, -1000px) scale(0.5)';
    
    setTimeout(callback, 1600);
}

function finishGame() {
    if(timerInterval) clearInterval(timerInterval);
    sndVitoria.play();
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText;
    const rel = JOGO_CONFIG.relatorios.find(r => score >= r.min) || JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length-1];
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
    if(window.goToResult) window.goToResult();
}

function startTimer() { 
    if(timerInterval) clearInterval(timerInterval); 
    timerSeconds = 0; 
    timerInterval = setInterval(() => { 
        timerSeconds++; 
        const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0'); 
        const s = (timerSeconds % 60).toString().padStart(2, '0'); 
        document.getElementById('timer').innerText = `${m}:${s}`; 
    }, 1000); 
}

const styleTag = document.createElement('style');
styleTag.innerHTML = `
    .floating { animation: floatingMove 3s infinite ease-in-out; }
    @keyframes floatingMove { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-50%, -60%); } }
    .shake-animation { animation: shake 0.4s; }
    @keyframes shake { 0%, 100% { transform: translate(-50%, -50%) rotate(0); } 25% { transform: translate(-50%, -50%) rotate(-5deg); } 75% { transform: translate(-50%, -50%) rotate(5deg); } }
    .pop-animation { animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
`;
document.head.appendChild(styleTag);
