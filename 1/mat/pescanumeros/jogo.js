let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "mar-calmo";
let targetNum = 0;
let rule = 'greater'; 
let spawnInterval;
let jogoAtivo = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "mar-calmo";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Pesca o peixe com o número correto! Se errares, ele afunda.";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; position:relative; padding:20px;">
            <div class="fish-box" style="position:relative; width:120px; height:80px; animation: swimTut 3s infinite ease-in-out; display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}peixe01.png" style="width:100%; height:100%; object-fit:contain; position:absolute;">
                <div style="position:relative; z-index:2; color:white; font-weight:900; font-size:24px; text-shadow:2px 2px #000;">8</div>
            </div>
            <div id="tut-hand" style="position:absolute; font-size:45px; bottom:-10px; right:10px; animation: tapH 2s infinite; z-index:10;">☝️</div>
        </div>
        <style>
            @keyframes swimTut { 0%, 100% { transform: translateX(-30px); } 50% { transform: translateX(30px); } }
            @keyframes tapH { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px) scale(0.9); } }
        </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('round-val').innerText = "1 / 10";
    jogoAtivo = true;
    iniciarCronometro();
    montarCenario();
    proximaMissao();
    
    clearInterval(spawnInterval);
    spawnInterval = setInterval(() => { if(jogoAtivo) criarPeixe(); }, 1300);
};

function iniciarCronometro() {
    tempoInicio = Date.now();
    clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const min = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const seg = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${min}:${seg}`;
    }, 1000);
}

function montarCenario() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <style>
            .ocean-bg { width: 100%; height: 100%; background: linear-gradient(180deg, #38bdf8 0%, #0369a1 100%); position: relative; overflow: hidden; border-radius: 25px; cursor: crosshair; }
            
            /* PAINEL DE COMANDO VERTICAL */
            .mission-panel { 
                position: absolute; 
                top: 15px; 
                left: 50%; 
                transform: translateX(-50%); 
                background: #ffffff; 
                padding: 10px 35px; 
                border-radius: 30px; 
                border: 4px solid #0ea5e9; 
                box-shadow: 0 10px 25px rgba(0,0,0,0.2); 
                z-index: 1000; 
                display: flex;
                flex-direction: column; /* Organiza em colunas: cima, meio, baixo */
                align-items: center;
                justify-content: center;
                min-width: 200px;
            }

            .mission-label-top { font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: -5px; }
            .mission-main-row { display: flex; align-items: center; justify-content: center; gap: 10px; line-height: 1; }
            .mission-label-bottom { font-size: 0.9rem; font-weight: 900; text-transform: uppercase; margin-top: -5px; }

            /* IMAGEM DE FUNDO ESTÁTICA */
            .decoracao-fundo { 
                position: absolute; 
                bottom: -5px; 
                right: -5px; 
                width: 320px; 
                height: auto; 
                z-index: 5; 
                pointer-events: none; 
                opacity: 0.95;
            }

            .fish-box { position: absolute; width: 110px; height: 80px; cursor: pointer; z-index: 100; display: flex; align-items: center; justify-content: center; }
            .fish-img { width: 100%; height: 100%; object-fit: contain; position: absolute; inset: 0; z-index: 1; transition: filter 0.5s; }
            .fish-num { position: relative; z-index: 2; color: white; font-weight: 900; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); font-family: 'Fredoka', sans-serif; pointer-events: none; }
            
            @keyframes swimRight { from { left: -150px; } to { left: 110%; } }
            @keyframes swimLeft { from { right: -150px; } to { right: 110%; } }
            
            .fish-dead { transition: all 1.8s ease-in !important; top: 90% !important; transform: rotate(180deg) !important; filter: grayscale(1) brightness(0.6) !important; pointer-events: none !important; }
        </style>
        <div class="ocean-bg" id="ocean">
            <div class="mission-panel" id="mission-ui"></div>
            <img src="${JOGO_CONFIG.caminhoImg}fundomar.png" class="decoracao-fundo">
        </div>
    `;
}

function proximaMissao() {
    if (indicePergunta >= 10) { finalizar(); return; }
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;
    
    const config = JOGO_CATEGORIAS[categoriaAtual];
    targetNum = Math.floor(Math.random() * (config.maxNum - 4)) + 3;
    rule = Math.random() > 0.5 ? 'greater' : 'less';

    const simbolo = rule === 'greater' ? '>' : '<';
    const textoBaixo = rule === 'greater' ? 'Maiores' : 'Menores';
    const corTema = rule === 'greater' ? '#16a34a' : '#ef4444'; // Verde para >, Vermelho para <

    document.getElementById('mission-ui').innerHTML = `
        <div class="mission-label-top">Pesca números</div>
        <div class="mission-main-row">
            <span style="font-size: 3.8rem; font-weight: 900; color: ${corTema}; font-family: sans-serif;">${simbolo}</span>
            <span style="font-size: 3.5rem; font-weight: 900; color: #0369a1;">${targetNum}</span>
        </div>
        <div class="mission-label-bottom" style="color: ${corTema}">${textoBaixo}</div>
    `;
}

function criarPeixe() {
    const ocean = document.getElementById('ocean');
    if(!ocean) return;
    const config = JOGO_CATEGORIAS[categoriaAtual];
    
    const val = Math.floor(Math.random() * config.maxNum) + 1;
    const numImg = Math.floor(Math.random() * 8) + 1;
    const imgName = `peixe${numImg.toString().padStart(2, '0')}.png`;
    
    const isFromLeft = Math.random() > 0.5;
    
    const fishBox = document.createElement('div');
    fishBox.className = 'fish-box';
    fishBox.style.top = (Math.random()*65 + 15) + '%';
    
    const vel = config.velocidadeBase + (Math.random() * 2 - 1);
    fishBox.style.animation = `${isFromLeft ? 'swimRight' : 'swimLeft'} ${vel}s linear forwards`;

    const flipImg = isFromLeft ? '' : 'transform: scaleX(-1);';

    fishBox.innerHTML = `
        <img src="${JOGO_CONFIG.caminhoImg}${imgName}" class="fish-img" style="${flipImg}">
        <div class="fish-num">${val}</div>
    `;

    fishBox.onclick = (e) => { 
        e.stopPropagation(); 
        if(jogoAtivo && !fishBox.classList.contains('fish-dead')) capturarPeixe(fishBox, val); 
    };

    ocean.appendChild(fishBox);
    setTimeout(() => { if(fishBox.parentNode && !fishBox.classList.contains('fish-dead')) fishBox.remove(); }, vel * 1000);
}

function capturarPeixe(el, val) {
    const acerto = (rule === 'greater' ? val > targetNum : val < targetNum);
    el.style.pointerEvents = "none";

    if(acerto) {
        acertos++; somAcerto.play();
        el.style.transform = "scale(1.6) translateY(-80px)";
        el.style.opacity = "0";
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { if(el.parentNode) el.remove(); }, 500);
    } else {
        erros++; somErro.play();
        el.style.animationPlayState = "paused";
        el.classList.add('fish-dead'); 
        document.getElementById('miss-val').innerText = erros;
        setTimeout(() => { if(el.parentNode) el.remove(); }, 2000);
    }

    indicePergunta++;
    setTimeout(proximaMissao, 800);
}

function finalizar() {
    jogoAtivo = false;
    clearInterval(spawnInterval);
    clearInterval(intervaloTempo);
    somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:10px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.6rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:10px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:15px; padding:12px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:15px; padding:12px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;">
                <button style="padding:16px; border-radius:20px; font-weight:900; font-size:15px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:13px; border-radius:20px; font-weight:900; font-size:15px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:20px; font-weight:900; font-size:15px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
