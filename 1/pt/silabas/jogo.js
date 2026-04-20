let currentCategory = 'animais';
let gameItems = [];
let currentIndex = 0;
let score = 0;
let timerSeconds = 0;
let timerInterval;
let selectedSyllables = [];

const sndAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const sndErro = new Audio(JOGO_CONFIG.sons.erro);
const sndVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// Inicializa ao carregar
window.addEventListener('load', () => {
    // Injetar imagem de introdução
    document.getElementById('intro-animation-container').innerHTML = `
        <img src="${JOGO_CONFIG.caminhoImg}intro_anim.gif" style="width:180px; margin-bottom:20px; border-radius:20px;" 
             onerror="this.src='${JOGO_CONFIG.caminhoImg}${JOGO_CONFIG.categorias.animais.imgCapa}'">
    `;
    // Set default category
    selectCategory(Object.keys(JOGO_CONFIG.categorias)[0]);
});

function selectCategory(key) {
    currentCategory = key;
    const cat = JOGO_CONFIG.categorias[key];
    // Preparar 10 itens aleatórios (ou todos se forem menos de 10)
    let all = [...cat.itens].sort(() => Math.random() - 0.5);
    gameItems = all.slice(0, 10);
    
    // Reset visual
    document.getElementById('rd-intro-btn').src = JOGO_CONFIG.caminhoImg + cat.imgCapa;
}

function initGame() {
    currentIndex = 0;
    score = 0;
    timerSeconds = 0;
    document.getElementById('score-val').innerText = score;
    
    // Criar as 10 bolinhas no status-bar
    const dotsContainer = document.getElementById('dots-container');
    dotsContainer.innerHTML = '';
    for(let i=0; i<10; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
    }

    startTimer();
    renderRound();
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
    const item = gameItems[currentIndex];
    const isLevel2 = currentIndex >= 5; // Nível 2 após a 5ª ronda
    selectedSyllables = [];

    // Atualizar Dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        d.classList.remove('active');
        if(i < currentIndex) d.classList.add('done');
        if(i === currentIndex) d.classList.add('active');
    });

    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:15px;">
            
            <!-- Nome da Imagem (Apenas Nível 1) -->
            <div id="word-hint" style="font-size:28px; font-weight:900; color:var(--primary-blue); letter-spacing:4px; height:40px;">
                ${isLevel2 ? '???' : item.nome}
            </div>

            <!-- Imagem -->
            <div style="background:white; padding:15px; border-radius:25px; box-shadow:0 8px 20px rgba(0,0,0,0.1);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:140px; object-fit:contain;">
            </div>

            <!-- Caixas de Destino -->
            <div id="drop-zones" style="display:flex; gap:10px; min-height:60px; justify-content:center; width:100%;">
                ${item.silabas.map((_, i) => `<div class="target-box" data-idx="${i}" style="width:65px; height:60px; border:3px dashed #cbd9e6; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:22px; color:var(--primary-dark); background:rgba(255,255,255,0.5);"></div>`).join('')}
            </div>

            <!-- Sílabas Desordenadas -->
            <div id="drag-options" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:10px;">
                ${shuffleArray([...item.silabas]).map((sil, i) => `
                    <div class="silaba-card" onclick="handleSyllableClick(this, '${sil}')" style="background:white; padding:12px 20px; border-radius:15px; font-weight:900; font-size:22px; color:var(--text-grey); cursor:pointer; box-shadow:0 5px 0 #d0e0f0; border:1px solid #eee; transition:0.1s;">
                        ${sil}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function handleSyllableClick(el, sil) {
    const item = gameItems[currentIndex];
    const targets = document.querySelectorAll('.target-box');
    
    if (el.style.visibility === 'hidden') return;

    // Adiciona à primeira caixa vazia
    for (let i = 0; i < targets.length; i++) {
        if (targets[i].innerText === "") {
            targets[i].innerText = sil;
            targets[i].style.background = "white";
            targets[i].style.border = "2px solid var(--primary-blue)";
            el.style.visibility = 'hidden';
            selectedSyllables[i] = sil;
            break;
        }
    }

    // Verificar se completou a palavra
    if (selectedSyllables.filter(s => s).length === item.silabas.length) {
        checkWord();
    }
}

function checkWord() {
    const item = gameItems[currentIndex];
    const userWord = selectedSyllables.join('');
    const correctWord = item.silabas.join('');

    if (userWord === correctWord) {
        // ACERTO
        sndAcerto.play();
        const isLevel2 = currentIndex >= 5;
        score += isLevel2 ? JOGO_CONFIG.pontuacao.acertoNivel2 : JOGO_CONFIG.pontuacao.acertoNivel1;
        document.getElementById('score-val').innerText = score;
        
        // Efeito Visual de Sucesso
        document.querySelectorAll('.target-box').forEach(b => b.style.borderColor = "var(--highlight-green)");
        
        setTimeout(() => {
            nextRound();
        }, 1000);
    } else {
        // ERRO
        sndErro.play();
        score = Math.max(0, score - JOGO_CONFIG.pontuacao.erro);
        document.getElementById('score-val').innerText = score;
        
        // Feedback Visual de Erro e Reset da ronda
        document.querySelectorAll('.target-box').forEach(b => b.style.borderColor = "var(--error-red)");
        setTimeout(() => {
            renderRound();
        }, 800);
    }
}

function nextRound() {
    currentIndex++;
    if (currentIndex < gameItems.length) {
        renderRound();
    } else {
        finishGame();
    }
}

function finishGame() {
    clearInterval(timerInterval);
    sndVitoria.play();
    
    // Preparar Ecrã de Resultados
    document.getElementById('res-pts').innerText = score;
    document.getElementById('res-tim').innerText = document.getElementById('timer').innerText.replace('⏳ ', '');
    
    // Escolher a taça com base no score definido no dados.js
    let rel = JOGO_CONFIG.relatorios[JOGO_CONFIG.relatorios.length - 1];
    for (let r of JOGO_CONFIG.relatorios) {
        if (score >= r.min) {
            rel = r;
            break;
        }
    }
    
    document.getElementById('res-tit').innerText = rel.titulo;
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + rel.img;
    
    goToResult();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
