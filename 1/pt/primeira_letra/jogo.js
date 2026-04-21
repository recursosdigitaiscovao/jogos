let currentCategory = 'animais';
let currentIndex = 0; 
let roundInLevel = 0; 
let score = 0;
let timerSeconds = 0;
let timerInterval;

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

function startLogic() {
    const rdList = document.getElementById('rd-list');
    rdList.innerHTML = '';
    Object.keys(JOGO_CONFIG.categorias).forEach(k => {
        const cat = JOGO_CONFIG.categorias[k];
        const card = document.createElement('div');
        card.style.cssText = "background:white; border-radius:15px; padding:10px; text-align:center; cursor:pointer; box-shadow:0 3px 6px rgba(0,0,0,0.1);";
        card.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" style="width:50px; height:50px; object-fit:contain;"><br><span style="font-weight:900; font-size:12px;">${cat.nome}</span>`;
        card.onclick = () => { currentCategory = k; closeMenus(); if(document.getElementById('scr-game').classList.contains('active')) window.initGame(); };
        rdList.appendChild(card);
    });
    renderTutorial();
}

function renderTutorial() {
    const container = document.getElementById('intro-animation-container');
    container.innerHTML = `
        <div style="position:relative; width:150px; height:120px; margin:0 auto;">
            <div style="width:60px; height:70px; background:rgba(255,255,255,0.5); border:3px dashed var(--primary-blue); border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:30px;">V</div>
            <i class="fas fa-hand-pointer" style="position:absolute; top:40px; left:40px; font-size:40px; color:#f39c12; animation: tutoTap 2s infinite;"></i>
        </div>
        <style> @keyframes tutoTap { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } } </style>
    `;
}

window.initGame = function() {
    currentIndex = 0; roundInLevel = 0; score = 0; timerSeconds = 0;
    document.getElementById('score-val').innerText = score;
    setupDots();
    startTimer();
    renderRound();
};

function setupDots() {
    const dc = document.getElementById('dots-container');
    dc.innerHTML = '';
    for(let i=0; i<5; i++) { const dot = document.createElement('div'); dot.className = 'dot'; dc.appendChild(dot); }
}

function renderRound() {
    const cat = JOGO_CONFIG.categorias[currentCategory];
    const item = cat.itens[currentIndex];
    const correctLetter = item.nome[0];
    const rest = item.nome.substring(1);

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if(i < roundInLevel) d.classList.add('done');
        if(i === roundInLevel) d.classList.add('active');
    });

    let options = [correctLetter];
    while(options.length < 4) {
        let r = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random()*26)];
        if(!options.includes(r)) options.push(r);
    }
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px;">
            <div style="background:white; padding:15px; border-radius:30px; box-shadow:0 10px 20px rgba(0,0,0,0.05); width:180px; height:180px; display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width:90%; max-height:90%;">
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <div id="target-letter" style="width:70px; height:85px; background:rgba(255,255,255,0.5); border:4px dashed var(--primary-blue); border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:45px; font-weight:900; color:var(--primary-blue);">_</div>
                <div style="font-size:55px; font-weight:900; color:var(--text-grey); letter-spacing:5px;">${rest}</div>
            </div>
            <div style="display:flex; gap:10px; justify-content:center; width:100%;">
                ${options.map(l => `
                    <div onclick="checkLetter('${l}', '${correctLetter}')" style="background:rgba(255,255,255,0.5); width:75px; height:75px; border-radius:20px; font-weight:900; font-size:35px; border:3px solid var(--primary-blue); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--primary-dark);">${l}</div>
                `).join('')}
            </div>
        </div>
    `;
}

function checkLetter(l, c) {
    const t = document.getElementById('target-letter');
    t.innerText = l;
    if(l === c) {
        sndAcerto.play(); score += 100;
        t.style.borderColor = "var(--highlight-green)"; t.style.color = "var(--highlight-green)";
        setTimeout(nextRound, 1000);
    } else {
        sndErro.play(); score = Math.max(0, score - 50);
        t.style.borderColor = "var(--error-red)"; t.style.color = "var(--error-red)";
        setTimeout(() => { t.innerText = "_"; t.style.borderColor = "var(--primary-blue)"; t.style.color = "var(--primary-blue)"; }, 800);
    }
    document.getElementById('score-val').innerText = score;
}

function nextRound() {
    currentIndex++; roundInLevel++;
    if(roundInLevel < 5) renderRound(); else finishGame();
}

function finishGame() {
    clearInterval(timerInterval); sndVitoria.play();
    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('scr-result').classList.add('active');
    document.getElementById('status-bar').style.display = 'none';
    document.getElementById('res-pts').innerText = score;
    const rel = JOGO_CONFIG.relatorios.find(r => score >= r.min);
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
}

function startTimer() {
    timerSeconds = 0;
    timerInterval = setInterval(() => {
        timerSeconds++;
        let m = Math.floor(timerSeconds/60).toString().padStart(2,'0');
        let s = (timerSeconds%60).toString().padStart(2,'0');
        document.getElementById('timer').innerText = `⏳ ${m}:${s}`;
        document.getElementById('res-tim').innerText = `${m}:${s}`;
    }, 1000);
}
