let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let indicePergunta = 0; // Controla os níveis 1, 2, 3
let jogoAtivo = false;
let ajudaDisponivel = true;
let categoriaAtual = "nivel1";
let correctFeedsInLevel = 0;
let targetNeeded = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    const primeiraCat = Object.keys(JOGO_CATEGORIAS)[0];
    if (!categoriaAtual) categoriaAtual = primeiraCat;
    
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = JOGO_CATEGORIAS[categoriaAtual].descricao;

    // Configurar botão da Lâmpada (Ajuda)
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
    }

    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    if(document.getElementById('intro-instr')) 
        document.getElementById('intro-instr').innerText = JOGO_CATEGORIAS[key].descricao;
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <style>
            .tut-monster { width: 100px; height: 100px; background: #9c27b0; border-radius: 50% 50% 40% 40%; position: relative; }
            .tut-mouth { width: 50px; height: 20px; background: #210329; border-radius: 5px 5px 20px 20px; position: absolute; bottom: 20px; left: 25px; border: 2px solid yellow; }
            .tut-food { position: absolute; font-size: 30px; animation: moveFood 3s infinite; }
            @keyframes moveFood { 0% { transform: translate(120px, 40px); } 60% { transform: translate(45px, 60px); opacity:1; } 80%, 100% { transform: translate(45px, 60px); opacity:0; } }
        </style>
        <div style="position:relative; width:200px; height:150px; display:flex; align-items:center; justify-content:center;">
            <div class="tut-monster"><div class="tut-mouth"></div></div>
            <div class="tut-food">🍎</div>
        </div>
    `;
}

// === 2. MOTOR DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0;
    jogoAtivo = true;
    
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('round-val').innerText = "Nível 1";

    renderEstruturaJogo();
};

function renderEstruturaJogo() {
    const container = document.getElementById('game-main-content');
    const levelData = JOGO_CATEGORIAS[categoriaAtual];
    
    // Lista de itens do nível (misturados)
    const items = [...levelData.itens].sort(() => Math.random() - 0.5);
    targetNeeded = items.filter(i => i.type === levelData.targetProp).length;
    correctFeedsInLevel = 0;

    container.innerHTML = `
        <style>
            .monster-game-area { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 10px; box-sizing: border-box; }
            
            .instruction-box { background: white; padding: 10px 20px; border-radius: 20px; border: 3px solid var(--primary-blue); font-weight: 900; display: flex; align-items: center; gap: 15px; width: 100%; max-width: 600px; margin-bottom: 10px; }
            .voice-btn { background: #ff9800; border: none; border-radius: 50%; width: 40px; height: 40px; color: white; cursor: pointer; box-shadow: 0 4px 0 #e65100; }
            
            .stage-area { flex: 1; width: 100%; display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 20px; }
            
            /* O Monstro */
            .monster-body { width: clamp(150px, 40vh, 220px); height: clamp(150px, 40vh, 220px); background: #9c27b0; border-radius: 50% 50% 40% 40%; position: relative; box-shadow: 0 10px 0 #4a148c; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .monster-eyes { display: flex; gap: 20px; margin-bottom: 10px; }
            .monster-eye { width: 30px; height: 30px; background: white; border-radius: 50%; position: relative; }
            .monster-pupil { width: 12px; height: 12px; background: black; border-radius: 50%; position: absolute; top: 30%; left: 30%; }
            .monster-mouth { width: 80px; height: 40px; background: #210329; border: 4px solid #ffeb3b; border-radius: 10px 10px 50px 50px; transition: 0.2s; }
            .monster-body.open .monster-mouth { height: 70px; }

            /* Alimentos */
            .food-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .food-card { width: clamp(80px, 15vh, 110px); height: clamp(80px, 15vh, 110px); background: white; border: 3px solid #eee; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 50px; cursor: pointer; box-shadow: 0 5px 0 #ddd; transition: 0.2s; }
            .food-card:active { transform: scale(1.1); }
            
            .flying { position: fixed !important; z-index: 999; transition: all 0.6s ease-in; pointer-events: none; }
        </style>

        <div class="monster-game-area">
            <div class="instruction-box">
                <button class="voice-btn" onclick="falarInstrucao()"><i class="fas fa-volume-up"></i></button>
                <span style="font-size: 1.1rem; color: #5d7082;">${levelData.descricao}</span>
            </div>

            <div class="stage-area">
                <div class="monster-body" id="monster-main">
                    <div class="monster-eyes">
                        <div class="monster-eye"><div class="monster-pupil"></div></div>
                        <div class="monster-eye"><div class="monster-pupil"></div></div>
                    </div>
                    <div class="monster-mouth"></div>
                </div>

                <div class="food-grid">
                    ${items.map(item => `
                        <div class="food-card" data-type="${item.type}" onclick="alimentar(this)">
                            ${item.icon}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Auto-fala no início do nível
    setTimeout(falarInstrucao, 500);
}

function falarInstrucao() {
    const texto = JOGO_CATEGORIAS[categoriaAtual].descricao;
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-PT';
    window.speechSynthesis.speak(msg);
}

function alimentar(el) {
    if (!jogoAtivo) return;
    const type = el.getAttribute('data-type');
    const target = JOGO_CATEGORIAS[categoriaAtual].targetProp;
    const monster = document.getElementById('monster-main');

    // Efeito de voar
    const rect = el.getBoundingClientRect();
    const mRect = monster.getBoundingClientRect();
    
    el.classList.add('flying');
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";

    monster.classList.add('open');

    setTimeout(() => {
        el.style.left = (mRect.left + mRect.width/2 - 40) + "px";
        el.style.top = (mRect.top + mRect.height/2) + "px";
        el.style.transform = "scale(0.2)";
        el.style.opacity = "0";
    }, 50);

    setTimeout(() => {
        monster.classList.remove('open');
        if (type === target) {
            acertos++;
            correctFeedsInLevel++;
            somAcerto.play();
            el.remove();
            if (correctFeedsInLevel >= targetNeeded) {
                proximoNivel();
            }
        } else {
            erros++;
            somErro.play();
            // Devolve o item
            el.classList.remove('flying');
            el.style.position = "static";
            el.style.transform = "scale(1)";
            el.style.opacity = "1";
        }
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('miss-val').innerText = erros;
    }, 600);
}

function proximoNivel() {
    const keys = Object.keys(JOGO_CATEGORIAS);
    const currentIndex = keys.indexOf(categoriaAtual);
    
    if (currentIndex < keys.length - 1) {
        categoriaAtual = keys[currentIndex + 1];
        document.getElementById('round-val').innerText = "Nível " + (currentIndex + 2);
        setTimeout(renderEstruturaJogo, 500);
    } else {
        setTimeout(finalizarJogo, 500);
    }
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false;
    ajudasUtilizadas++;
    
    const target = JOGO_CATEGORIAS[categoriaAtual].targetProp;
    const cards = document.querySelectorAll('.food-card');
    
    cards.forEach(c => {
        if (c.getAttribute('data-type') === target) {
            c.style.borderColor = "#ff9800";
            c.style.transform = "scale(1.1)";
        }
    });

    setTimeout(() => {
        cards.forEach(c => {
            c.style.borderColor = "#eee";
            c.style.transform = "scale(1)";
        });
        ajudaDisponivel = true;
    }, 1500);
};

function finalizarJogo() {
    jogoAtivo = false;
    somVitoria.play();
    const perc = Math.round((acertos / (acertos + erros || 1)) * 100);
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <style>
                .res-card { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 450px; }
                .res-stats-row { display: flex; gap: 15px; margin: 25px 0; width: 100%; justify-content: center; }
                .stat-item { background: white; border-radius: 20px; width: 100px; height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
                .btn-final { height: 55px; width: 100%; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 900; font-size: 1.1rem; text-decoration: none; cursor: pointer; border: none; margin-bottom: 10px; }
            </style>
            <div class="res-card">
                <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" style="height:120px;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2rem; margin:15px 0;">${rel.titulo}</h1>
                <div class="res-stats-row">
                    <div class="stat-item"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.7rem; color:#88a; font-weight:900; text-transform:uppercase;">Certos</span></div>
                    <div class="stat-item"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.7rem; color:#88a; font-weight:900; text-transform:uppercase;">Errados</span></div>
                    <div class="stat-item"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.7rem; color:#88a; font-weight:900; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button class="btn-final" style="background:var(--primary-blue); color:white; box-shadow:0 6px 0 var(--primary-dark);" onclick="location.reload()">REPETIR</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-final" style="background:#e2e8f0; color:#64748b;">SAIR</a>
            </div>
        </div>
    `;
}
