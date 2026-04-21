let currentCategory = 'cat1';
let currentIndex = 0; 
let roundInLevel = 0; 
let currentLevel = 1;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let placedItems = [null, null, null, null];
let correctOrder = [];
let draggedElement = null;

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

document.addEventListener('DOMContentLoaded', () => {
    if (window.initUI) window.initUI();
    
    const rd1 = document.getElementById('rd-intro-btn');
    const rd2 = document.getElementById('rd-game-btn');
    if(rd1) rd1.src = JOGO_CONFIG.caminhoImg + "rd.png";
    if(rd2) rd2.src = JOGO_CONFIG.caminhoImg + "rd.png";

    window.selectCategory(Object.keys(JOGO_CONFIG.categorias)[0]);
});

window.selectCategory = function(key) {
    currentCategory = key;
    renderTutorial(JOGO_CONFIG.categorias[key]);
    if(document.getElementById('scr-game').classList.contains('active')) window.initGame();
};

function renderTutorial(cat) {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itemEx = cat.rondas[0].itens[0];
    
    container.innerHTML = `
        <div style="position:relative; width:300px; height:150px; background: url('${JOGO_CONFIG.caminhoImg}letras_magicas.png') no-repeat center; background-size: contain; border-radius:15px; overflow:hidden;">
            <div id="tuto-card" style="background:white; padding:5px 10px; border-radius:8px; font-weight:900; font-size:12px; position:absolute; left:120px; bottom:10px; z-index:10; box-shadow:0 4px 0 #cbd9e6; border:1px solid #eee;">
                ${itemEx}
            </div>
            <i id="tuto-hand" class="fas fa-hand-pointer" style="position:absolute; bottom:5px; left:140px; color:#f39c12; font-size:20px; z-index:11;"></i>
        </div>
        <style>
            @keyframes tutoMove { 0% { transform: translate(0,0); opacity:1; } 40% { transform: translate(-102px, -78px); } 70% { transform: translate(-102px, -78px); opacity:1; } 100% { transform: translate(-102px, -78px); opacity:0; } }
            #tuto-card, #tuto-hand { animation: tutoMove 3s infinite ease-in-out; }
        </style>
    `;
}

window.initGame = function() {
    currentIndex = 0; roundInLevel = 0; currentLevel = 1; score = 0; timerSeconds = 0;
    document.getElementById('score-val').innerText = score;
    setupDots();
    startTimer();
    renderRound();
};

function setupDots() {
    const dc = document.getElementById('dots-container');
    if(dc) { dc.innerHTML = ''; for(let i=0; i<5; i++) { const dot = document.createElement('div'); dot.className = 'dot'; dc.appendChild(dot); } }
}

function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds++;
        const min = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const sec = (timerSeconds % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `⏳ ${min}:${sec}`;
    }, 1000);
}

function renderRound() {
    const cat = JOGO_CONFIG.categorias[currentCategory];
    const ronda = cat.rondas[currentIndex];
    if(!ronda) { finishGame(); return; }

    correctOrder = [...ronda.itens].sort((a,b) => a.localeCompare(b, 'pt'));
    let shuffled = [...ronda.itens].sort(() => Math.random() - 0.5);
    placedItems = [null, null, null, null];

    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.re
