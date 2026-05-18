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

    // Configurar Lâmpada de Ajuda
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
            .tut-stage { position: relative; width: 320px; height: 160px; background: white; border: 3px dashed var(--primary-blue); border-radius: 25px; display: flex; align-items: center; justify-content: center; gap: 4px; overflow: hidden; }
            .crop-box { width: 60px; height: 90px; overflow: hidden; border: 2px solid #ddd; background: #fff; position: relative; border-radius: 8px; }
            .crop-box img { position: absolute; height: 100%; width: 120px; object-fit: contain; }
            .side-l img { left: 0; filter: brightness(0); opacity: 0.8; } /* Sombra no tutorial */
            .side-r img { right: 0; }
            .tut-hand { position: absolute; font-size: 35px; z-index: 20; animation: handM 4s infinite ease-in-out; }
            .moving-p { animation: partM 4s infinite ease-in-out; }
            @keyframes handM { 0%, 20% { left: 200px; top: 100px; } 50%, 70% { left: 165px; top: 80px; } 100% { left: 200px; top: 100px; } }
            @keyframes partM { 0%, 20% { transform: translateX(60px); opacity: 0.5; } 50%, 70% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(60px); opacity: 0.5; } }
        </style>
        <div class="tut-stage">
            <div class="crop-box side-l"><img src="${imgEx}"></div>
            <div class="crop-box side-r moving-p"><img src="${imgEx}"></div>
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
    
    // Escolher item correto e 3 distrações
    const embaralhado = [...config.itens].sort(() => 0.5 - Math.random());
    itemCorreto = embaralhado[0];
    const distracoes = embaralhado.slice(1, 4); 
    const opcoes = [itemCorreto, ...distracoes].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .game-path { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; padding: 10px; box-sizing: border-box; }
            
            /* Área do Alvo */
            .target-zone { display: flex; align-items: center; justify-content: center; gap: 4px; height: 45%; }
            .box-left-shadow { 
                width: clamp(100px, 20vh, 150px); height: clamp(120px, 25vh, 180px); 
                background: white; border: 4px solid var(--primary-blue); border-radius: 20px 0 0 20px; 
                overflow: hidden; position: relative; 
            }
            .box-right-empty { 
                width: clamp(100px, 20vh, 150px); height: clamp(120px, 25vh, 180px); 
                border: 4px dashed #ccc; border-radius: 0 20px 20px 0; background: rgba(0,0,0,0.02); 
                display: flex; align-items: center; justify-content: center; font-size: 40px; color: #ddd;
            }
            
            /* A imagem à esquerda começa como SOMBRA (brightness 0) */
            #img-left { position: absolute; height: 100%; width: 200%; object-fit: contain; left: 0; filter: brightness(0); opacity: 0.8; transition: filter 0.5s; }
            .box-full-right img { position: absolute; height: 100%; width: 200%; right: 0; object-fit: contain; }

            /* Área das Opções (Metades Direitas em cores) */
            .options-row { display: flex; gap: 15px; justify-content: center; width: 100%; }
            .option-card { 
                width: clamp(70px, 15vh, 100px); height: clamp(90px, 18vh, 130px); 
                background: white; border: 3px solid #eee; border-radius: 12px; 
                overflow: hidden; cursor: pointer; box-shadow: 0 5px 0 #ddd; position: relative; 
            }
            .option-card img { position: absolute; height: 100%; width: 200%; right: 0; object-fit: contain; }
            .option-card:active { transform: translateY(3px); box-shadow: none; }

            .correct-anim { border-color: #7ed321 !important; background: #e8f9e8 !important; }
            .wrong-anim { border-color: #ff5e5e !important; background: #fff1f1 !important; }

            @media (max-width: 600px) {
                .target-zone { transform: scale(0.9); }
                .option-card { width: 22%; height: 100px; }
            }
        </style>

        <div class="game-path">
            <div class="target-zone">
                <div class="box-left-shadow">
                    <img id="img-left" src="${JOGO_CONFIG.caminhoImg}${config.pasta}${itemCorreto}">
                </div>
                <div class="box-right-empty" id="target-slot">?</div>
            </div>

            <div class="options-row">
                ${opcoes.map(img => `
                    <div class="option-card" data-img="${img}" onclick="validarEscolha(this, '${img}')">
                        <img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function validarEscolha(el, imgNome) {
    if (!jogoAtivo) return;
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    jogoAtivo = false;
    
    const allCards = document.querySelectorAll('.option-card');
    allCards.forEach(c => c.style.pointerEvents = 'none');

    if (imgNome === itemCorreto) {
        acertos++; somAcerto.play();
        el.classList.add('correct-anim');
        
        // 1. Tira a sombra da metade esquerda
        const imgLeft = document.getElementById('img-left');
        imgLeft.style.filter = "none";
        imgLeft.style.opacity = "1";

        // 2. Preenche a metade direita com cor
        const slot = document.getElementById('target-slot');
        slot.innerHTML = `<div class="box-full-right" style="width:100%; height:100%; position:relative; overflow:hidden;">
                            <img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${imgNome}">
                          </div>`;
        slot.style.border = "4px solid #7ed321";
        slot.style.background = "white";
    } else {
        erros++; somErro.play();
        el.classList.add('wrong-anim');
        // Mostra qual era a certa nas opções
        allCards.forEach(c => {
            if(c.getAttribute('data-img') === itemCorreto) c.classList.add('correct-anim');
        });
    }

    setTimeout(() => {
        rondaAtual++;
        jogoAtivo = true;
        proximaRonda();
    }, 2000);
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const cards = document.querySelectorAll('.option-card');
    cards.forEach(c => {
        if (c.getAttribute('data-img') === itemCorreto) {
            c.style.borderColor = "#ff9800";
            c.style.boxShadow = "0 0 15px #ff9800";
            setTimeout(() => {
                c.style.boxShadow = "0 5px 0 #ddd";
                ajudaDisponivel = true;
            }, 1500);
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
        <div class="screen-box" style="justify-content: center; padding: 20px; display: flex !important;">
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; max-width:450px; margin:auto;">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px; margin-bottom:10px; display:block; margin-left:auto; margin-right:auto;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center; line-height:1;">${rank.titulo}</h1>
                <div style="display:flex; gap:15px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:25px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button class="btn-redo-final" style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button class="btn-other-final" style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 12px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
