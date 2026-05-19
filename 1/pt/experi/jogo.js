let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let rondaAtual = 1;
let jogoAtivo = false;
let ajudaDisponivel = true;
let categoriaAtiva = "nivel1";
let itemCorreto = "";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = config.descricao;

    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent"; timerBadge.style.padding = "0";
    }
    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtiva = key;
    if(document.getElementById('intro-instr')) 
        document.getElementById('intro-instr').innerText = JOGO_CATEGORIAS[key].descricao;
    renderTutorialAnimation();
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    const imgEx = JOGO_CONFIG.caminhoImg + config.pasta + config.itens[0];

    container.innerHTML = `
        <style>
            .tut-stage { position: relative; width: 320px; height: 160px; background: white; border: 3px dashed var(--primary-blue); border-radius: 25px; display: flex; align-items: center; justify-content: center; gap: 5px; overflow: hidden; }
            .crop-box { 
                width: 60px; height: 90px; border: 2px solid #ddd; background-color: #fff; border-radius: 8px;
                background-size: 120px 90px; /* Dobro da largura */
                background-repeat: no-repeat;
            }
            .side-l { background-position: left center; filter: brightness(0); opacity: 0.6; }
            .side-r { background-position: right center; }
            .tut-hand { position: absolute; font-size: 35px; z-index: 20; animation: handM 4s infinite ease-in-out; }
            .moving-p { animation: partM 4s infinite ease-in-out; }
            @keyframes handM { 0%, 20% { left: 200px; top: 100px; } 50%, 70% { left: 165px; top: 80px; } 100% { left: 200px; top: 100px; } }
            @keyframes partM { 0%, 20% { transform: translateX(60px); opacity: 0.5; } 50%, 70% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(60px); opacity: 0.5; } }
        </style>
        <div class="tut-stage">
            <div class="crop-box side-l" style="background-image: url('${imgEx}')"></div>
            <div class="crop-box side-r moving-p" style="background-image: url('${imgEx}')"></div>
            <div class="tut-hand">☝️</div>
        </div>
    `;
}

// === 2. MOTOR DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0; rondaAtual = 1;
    jogoAtivo = true;
    proximaRonda();
};

function proximaRonda() {
    if (rondaAtual > 10) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${rondaAtual} / 10`;
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    renderizarEcraJogo();
}

function renderizarEcraJogo() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    
    const embaralhado = [...config.itens].sort(() => 0.5 - Math.random());
    itemCorreto = embaralhado[0];
    const distracoes = embaralhado.slice(1, 5); 
    const opcoes = [itemCorreto, ...distracoes].sort(() => 0.5 - Math.random());

    const imgPath = JOGO_CONFIG.caminhoImg + config.pasta;

    container.innerHTML = `
        <style>
            .game-path { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; padding: 10px; box-sizing: border-box; }
            
            .target-zone { display: flex; align-items: center; justify-content: center; gap: 4px; height: 40%; width: 100%; }
            
            /* Metade Esquerda com Sombra */
            .box-l { 
                width: clamp(90px, 20vh, 140px); height: clamp(110px, 25vh, 170px); 
                background-color: white; border: 4px solid var(--primary-blue); border-radius: 20px 0 0 20px; 
                background-size: 200% 100%; background-position: left center; background-repeat: no-repeat;
                filter: brightness(0); opacity: 0.8; transition: all 0.5s;
            }
            
            /* Espaço para a Metade Direita */
            .box-r-slot { 
                width: clamp(90px, 20vh, 140px); height: clamp(110px, 25vh, 170px); 
                border: 4px dashed #ccc; border-radius: 0 20px 20px 0; background: rgba(0,0,0,0.02); 
                display: flex; align-items: center; justify-content: center; font-size: 40px; color: #ddd;
                background-size: 200% 100%; background-position: right center; background-repeat: no-repeat;
            }

            .options-area { display: flex; gap: 10px; justify-content: center; width: 100%; flex-wrap: wrap; }
            
            /* Cartões das Opções usando Background */
            .option-card { 
                width: clamp(65px, 14vh, 95px); height: clamp(85px, 17vh, 125px); 
                background: white; border: 3px solid #eee; border-radius: 12px; 
                cursor: pointer; box-shadow: 0 4px 0 #ddd; transition: 0.2s;
                background-size: 200% 100%; background-position: right center; background-repeat: no-repeat;
            }
            .option-card:active { transform: translateY(2px); box-shadow: none; }

            .correct-anim { border-color: #7ed321 !important; background-color: #e8f9e8 !important; }
            .wrong-anim { border-color: #ff5e5e !important; background-color: #fff1f1 !important; }

            @media (max-width: 600px) {
                .target-zone { transform: scale(0.95); }
                .option-card { width: 18%; height: 90px; }
            }
        </style>

        <div class="game-path">
            <div class="target-zone">
                <div class="box-l" id="main-left" style="background-image: url('${imgPath}${itemCorreto}')"></div>
                <div class="box-r-slot" id="main-right">?</div>
            </div>

            <div class="options-area">
                ${opcoes.map(img => `
                    <div class="option-card" data-img="${img}" 
                         style="background-image: url('${imgPath}${img}')"
                         onclick="validarEscolha(this, '${img}')">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function validarEscolha(el, imgNome) {
    if (!jogoAtivo) return;
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    const imgPath = JOGO_CONFIG.caminhoImg + config.pasta;
    jogoAtivo = false;
    document.querySelectorAll('.option-card').forEach(c => c.style.pointerEvents = 'none');

    if (imgNome === itemCorreto) {
        acertos++; somAcerto.play();
        el.classList.add('correct-anim');
        
        // Revela a cor à esquerda
        const leftSide = document.getElementById('main-left');
        leftSide.style.filter = "none";
        leftSide.style.opacity = "1";

        // Preenche a direita
        const rightSide = document.getElementById('main-right');
        rightSide.style.backgroundImage = `url('${imgPath}${imgNome}')`;
        rightSide.style.border = "4px solid #7ed321";
        rightSide.style.backgroundWeight = "white";
        rightSide.innerText = "";
    } else {
        erros++; somErro.play();
        el.classList.add('wrong-anim');
        document.querySelectorAll('.option-card').forEach(c => {
            if(c.getAttribute('data-img') === itemCorreto) c.classList.add('correct-anim');
        });
    }

    setTimeout(() => { rondaAtual++; jogoAtivo = true; proximaRonda(); }, 2000);
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const cards = document.querySelectorAll('.option-card');
    cards.forEach(c => {
        if (c.getAttribute('data-img') === itemCorreto) {
            c.style.borderColor = "#ff9800"; c.style.boxShadow = "0 0 15px #ff9800";
            setTimeout(() => { c.style.boxShadow = "0 4px 0 #ddd"; ajudaDisponivel = true; }, 1500);
        }
    });
};

function finalizarJogo() {
    jogoAtivo = false; somVitoria.play();
    const perc = Math.round((acertos / 10) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 15px; display: flex !important;">
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; max-width:420px; margin:auto;">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="height: clamp(80px, 15vh, 110px); margin-bottom: 5px;">
                <h1 style="color:var(--primary-blue); font-size: 1.8rem; font-weight:900; margin: 10px 0 20px; text-align:center; line-height:1;">${rank.titulo}</h1>
                <div style="display:flex; gap:10px; margin-bottom:25px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:20px; width:95px; height:95px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
                        <span style="font-size: 1.5rem; font-weight: 900; color:#7ed321;">${acertos}</span>
                        <span style="font-size: 0.6rem; font-weight: 900; color:#88a; text-transform:uppercase;">Certos</span>
                    </div>
                    <div style="background:white; border-radius:20px; width:95px; height:95px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
                        <span style="font-size: 1.5rem; font-weight: 900; color:#ff5e5e;">${erros}</span>
                        <span style="font-size: 0.6rem; font-weight: 900; color:#88a; text-transform:uppercase;">Errados</span>
                    </div>
                    <div style="background:white; border-radius:20px; width:95px; height:95px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
                        <span style="font-size: 1.5rem; font-weight: 900; color:#ff9f43;">${ajudasUtilizadas}</span>
                        <span style="font-size: 0.6rem; font-weight: 900; color:#88a; text-transform:uppercase;">Ajudas</span>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:300px;">
                    <button style="height:50px; border-radius:30px; display:flex; align-items:center; justify-content:center; gap:12px; font-weight:900; font-size:1rem; text-decoration:none; cursor:pointer; border:none; background:var(--primary-blue); color:white; box-shadow: 0 5px 0 var(--primary-dark);" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                    <button style="height:50px; border-radius:30px; display:flex; align-items:center; justify-content:center; gap:12px; font-weight:900; font-size:1rem; text-decoration:none; cursor:pointer; border:3px solid var(--primary-blue); background:white; color:var(--primary-blue);" onclick="openRDMenu(event)"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                    <a href="${JOGO_CONFIG.linkVoltar}" style="height:50px; border-radius:30px; display:flex; align-items:center; justify-content:center; gap:12px; font-weight:900; font-size:1rem; text-decoration:none; background:#e2e8f0; color:#64748b;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
                </div>
            </div>
        </div>
    `;
}
