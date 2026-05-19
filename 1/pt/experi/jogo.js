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
            .tut-stage { position: relative; width: 320px; height: 160px; background: white; border: 3px dashed var(--primary-blue); border-radius: 25px; display: flex; align-items: center; justify-content: center; gap: 4px; overflow: hidden; }
            .crop-box { width: 60px; height: 90px; overflow: hidden; border: 2px solid #ddd; background: #fff; position: relative; border-radius: 8px; }
            .crop-box img { position: absolute; height: 100%; width: 120px; object-fit: contain; }
            .side-l img { left: 0; filter: brightness(0); opacity: 0.7; }
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
    
    // Sorteia o correto e agora 4 distrações (Total 5 opções)
    const embaralhado = [...config.itens].sort(() => 0.5 - Math.random());
    itemCorreto = embaralhado[0];
    const distracoes = embaralhado.slice(1, 5); 
    const opcoes = [itemCorreto, ...distracoes].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .game-path { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; padding: 10px; box-sizing: border-box; }
            
            .target-zone { display: flex; align-items: center; justify-content: center; gap: 4px; height: 40%; width: 100%; }
            .box-l { width: clamp(90px, 20vh, 140px); height: clamp(110px, 25vh, 170px); background: white; border: 4px solid var(--primary-blue); border-radius: 20px 0 0 20px; overflow: hidden; position: relative; }
            .box-r-empty { width: clamp(90px, 20vh, 140px); height: clamp(110px, 25vh, 170px); border: 4px dashed #ccc; border-radius: 0 20px 20px 0; background: rgba(0,0,0,0.02); display: flex; align-items: center; justify-content: center; font-size: 40px; color: #ddd; }
            
            #img-l { position: absolute; height: 100%; width: 200%; object-fit: contain; left: 0; filter: brightness(0); opacity: 0.8; transition: filter 0.5s; }
            .box-full-r img { position: absolute; height: 100%; width: 200%; right: 0; object-fit: contain; }

            .options-area { display: flex; gap: 10px; justify-content: center; width: 100%; flex-wrap: wrap; }
            .option-card { 
                width: clamp(65px, 14vh, 90px); height: clamp(85px, 17vh, 120px); 
                background: white; border: 3px solid #eee; border-radius: 12px; 
                overflow: hidden; cursor: pointer; box-shadow: 0 4px 0 #ddd; position: relative; 
            }
            .option-card img { position: absolute; height: 100%; width: 200%; right: 0; object-fit: contain; }
            .option-card:active { transform: translateY(2px); box-shadow: none; }

            .correct-anim { border-color: #7ed321 !important; background: #e8f9e8 !important; }
            .wrong-anim { border-color: #ff5e5e !important; background: #fff1f1 !important; }

            @media (max-width: 600px) {
                .target-zone { transform: scale(0.9); }
                .option-card { width: 18%; height: 85px; }
            }
        </style>

        <div class="game-path">
            <div class="target-zone">
                <div class="box-l"><img id="img-l" src="${JOGO_CONFIG.caminhoImg}${config.pasta}${itemCorreto}"></div>
                <div class="box-r-empty" id="target-slot">?</div>
            </div>

            <div class="options-area">
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
    document.querySelectorAll('.option-card').forEach(c => c.style.pointerEvents = 'none');

    if (imgNome === itemCorreto) {
        acertos++; somAcerto.play();
        el.classList.add('correct-anim');
        document.getElementById('img-l').style.filter = "none";
        document.getElementById('img-l').style.opacity = "1";

        const slot = document.getElementById('target-slot');
        slot.innerHTML = `<div class="box-full-r" style="width:100%; height:100%; position:relative; overflow:hidden;"><img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${imgNome}"></div>`;
        slot.style.border = "4px solid #7ed321"; slot.style.background = "white";
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
            <style>
                .res-c { display:flex; flex-direction:column; align-items:center; width:100%; max-width:420px; margin:auto; }
                .res-t { height: clamp(80px, 15vh, 110px); margin-bottom: 5px; }
                .res-m { color:var(--primary-blue); font-size: 1.8rem; font-weight:900; margin: 10px 0 20px; text-align:center; line-height:1; }
                .res-s { display:flex; gap:10px; margin-bottom:25px; width:100%; justify-content:center; }
                .res-b { background:white; border-radius:20px; width:95px; height:95px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 8px 20px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; }
                .res-n { font-size: 1.5rem; font-weight: 900; }
                .res-l { font-size: 0.6rem; font-weight: 900; color:#88a; text-transform:uppercase; letter-spacing: 0.5px; }
                .res-gs { display:flex; flex-direction:column; gap:10px; width:100%; max-width:300px; }
                .btn-f { height:50px; border-radius:30px; display:flex; align-items:center; justify-content:center; gap:12px; font-weight:900; font-size:1rem; text-decoration:none; cursor:pointer; border:none; transition: 0.2s; }
                .btn-s { background:var(--primary-blue); color:white; box-shadow: 0 5px 0 var(--primary-dark); }
                .btn-s:active { transform:translateY(3px); box-shadow: 0 2px 0 var(--primary-dark); }
                .btn-o { background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); }
                .btn-m { background:#e2e8f0; color:#64748b; }
            </style>
            <div class="res-c">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" class="res-t">
                <h1 class="res-m">${rank.titulo}</h1>
                <div class="res-s">
                    <div class="res-b"><span class="res-n" style="color:#7ed321;">${acertos}</span><span class="res-l">Certos</span></div>
                    <div class="res-b"><span class="res-n" style="color:#ff5e5e;">${erros}</span><span class="res-l">Errados</span></div>
                    <div class="res-b"><span class="res-n" style="color:#ff9f43;">${ajudasUtilizadas}</span><span class="res-l">Ajudas</span></div>
                </div>
                <div class="res-gs">
                    <button class="btn-f btn-s" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                    <button class="btn-f btn-o" onclick="openRDMenu(event)"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                    <a href="${JOGO_CONFIG.linkVoltar}" class="btn-f btn-m"><i class="fas fa-sign-out-alt"></i> SAIR</a>
                </div>
            </div>
        </div>
    `;
}

window.gerarIntroJogo = function() { return JOGO_CATEGORIAS[categoriaAtiva].descricao; };
