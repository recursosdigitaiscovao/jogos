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
    const imgEx = config.itens[0];

    container.innerHTML = `
        <style>
            .tut-stage { position: relative; width: 300px; height: 160px; background: white; border: 3px dashed var(--primary-blue); border-radius: 25px; display: flex; align-items: center; justify-content: center; gap: 10px; overflow: hidden; }
            .half-box { width: 70px; height: 100px; overflow: hidden; border: 2px solid #eee; border-radius: 10px; background: #f9f9f9; }
            .half-box img { height: 100%; width: 200%; object-fit: contain; }
            .left-h img { object-position: left; }
            .right-h img { object-position: right; }
            .tut-hand { position: absolute; font-size: 35px; z-index: 20; animation: handMove 4s infinite ease-in-out; }
            .moving-half { animation: pieceMove 4s infinite ease-in-out; }
            @keyframes handMove { 0%, 20% { left: 200px; top: 100px; } 50%, 70% { left: 145px; top: 80px; } 100% { left: 200px; top: 100px; } }
            @keyframes pieceMove { 0%, 20% { transform: translate(60px, 0); } 50%, 70% { transform: translate(-5px, 0); } 100% { transform: translate(60px, 0); } }
        </style>
        <div class="tut-stage">
            <div class="half-box left-h"><img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${imgEx}"></div>
            <div class="half-box right-h moving-half"><img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${imgEx}"></div>
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
    
    // Escolher item correto e distrações
    const embaralhado = [...config.itens].sort(() => 0.5 - Math.random());
    itemCorreto = embaralhado[0];
    const distracoes = embaralhado.slice(1, 4); // 3 errados
    const opcoes = [itemCorreto, ...distracoes].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .game-path { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; padding: 10px; box-sizing: border-box; }
            
            /* Zona do Modelo (Metade Esquerda) */
            .target-area { display: flex; align-items: center; justify-content: center; gap: 5px; height: 40%; width: 100%; }
            .half-main { width: clamp(100px, 20vh, 180px); height: clamp(120px, 25vh, 220px); background: white; border: 4px solid var(--primary-blue); border-radius: 20px 0 0 20px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
            .half-empty { width: clamp(100px, 20vh, 180px); height: clamp(120px, 25vh, 220px); border: 4px dashed #ccc; border-radius: 0 20px 20px 0; background: rgba(255,255,255,0.3); position: relative; }
            
            .half-main img { height: 100%; width: 200%; object-fit: contain; object-position: left; }
            
            /* Grelha de Opções (Metades Direitas) */
            .options-area { display: flex; gap: 15px; justify-content: center; width: 100%; flex-wrap: wrap; }
            .card-half { width: clamp(80px, 15vh, 120px); height: clamp(100px, 18vh, 150px); background: white; border: 3px solid #eee; border-radius: 15px; overflow: hidden; cursor: pointer; box-shadow: 0 5px 0 #ddd; transition: 0.2s; }
            .card-half img { height: 100%; width: 200%; object-fit: contain; object-position: right; pointer-events: none; }
            .card-half:active { transform: translateY(3px); box-shadow: none; }

            .is-correct { border-color: #7ed321 !important; background: #e8f9e8 !important; }
            .is-wrong { border-color: #ff5e5e !important; background: #fff1f1 !important; }

            /* Mobile Vertical */
            @media (max-width: 600px) and (orientation: portrait) {
                .target-area { height: 30%; }
                .card-half { width: 28%; height: 110px; }
                .options-area { gap: 10px; }
            }
        </style>

        <div class="game-path">
            <div class="target-area">
                <div class="half-main">
                    <img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${itemCorreto}">
                </div>
                <div class="half-empty" id="drop-zone"></div>
            </div>

            <div class="options-area">
                ${opcoes.map((img, i) => `
                    <div class="card-half" data-img="${img}" onclick="verificar(this, '${img}')">
                        <img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${img}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function verificar(el, imgNome) {
    if (!jogoAtivo) return;
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    document.querySelectorAll('.card-half').forEach(c => c.style.pointerEvents = 'none');

    if (imgNome === itemCorreto) {
        acertos++; somAcerto.play();
        el.classList.add('is-correct');
        // Completa a imagem no modelo
        const dropZone = document.getElementById('drop-zone');
        dropZone.style.border = "4px solid #7ed321";
        dropZone.style.background = "white";
        dropZone.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${imgNome}" style="height:100%; width:200%; object-fit:contain; object-position:right;">`;
    } else {
        erros++; somErro.play();
        el.classList.add('is-wrong');
        // Mostrar o correto por transparência
        document.querySelectorAll('.card-half').forEach(c => {
            if(c.getAttribute('data-img') === itemCorreto) c.classList.add('is-correct');
        });
    }

    setTimeout(() => {
        rondaAtual++;
        proximaRonda();
    }, 1500);
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const cards = document.querySelectorAll('.card-half');
    cards.forEach(c => {
        if (c.getAttribute('data-img') === itemCorreto) {
            c.style.borderColor = "#ff9800";
            c.style.transform = "scale(1.1)";
            setTimeout(() => {
                c.style.borderColor = "#eee";
                c.style.transform = "scale(1)";
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
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px; display:block; margin: 0 auto 10px;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center; line-height:1;">${rank.titulo}</h1>
                <div style="display:flex; gap:12px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button class="btn-redo-final" style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button class="btn-other-final" style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 12px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}

window.gerarIntroJogo = function() { 
    return JOGO_CATEGORIAS[categoriaAtiva].descricao;
};
