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
    return "Pesca o peixe com o número correto! Tens 10 missões para completar.";
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; position:relative; background:#e0f2fe; padding:20px; border-radius:20px; border:2px solid #bae6fd;">
            <div style="font-size:50px; animation: swimTut 3s infinite ease-in-out;">🐠</div>
            <div style="position:absolute; font-size:40px; bottom:-10px; right:10px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style>
            @keyframes swimTut { 0%, 100% { transform: translateX(-20px); } 50% { transform: translateX(20px); } }
            @keyframes tapH { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px) scale(0.9); } }
        </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; 
    acertos = 0; 
    erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('round-val').innerText = "1 / 10";
    
    jogoAtivo = true;
    iniciarCronometro();
    montarCenario();
    proximaMissao();
    
    clearInterval(spawnInterval);
    spawnInterval = setInterval(() => {
        if(jogoAtivo) criarPeixe();
    }, 1200); // Peixes aparecem com mais frequência
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
            .ocean-bg { 
                width: 100%; height: 100%; background: linear-gradient(180deg, #bae6fd 0%, #0284c7 100%);
                position: relative; overflow: hidden; border-radius: 25px; cursor: crosshair;
            }
            .bubble { position: absolute; background: rgba(255,255,255,0.3); border-radius: 50%; animation: rise 4s infinite ease-in; }
            @keyframes rise { 0% { transform: translateY(100%); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(-100px); opacity: 0; } }
            
            .mission-panel {
                position: absolute; top: 15px; left: 50%; transform: translateX(-50%);
                background: white; padding: 10px 25px; border-radius: 20px;
                border: 3px solid #0ea5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                font-weight: 900; color: #0369a1; z-index: 100; text-align: center; white-space: nowrap;
            }

            .fish {
                position: absolute; width: 85px; height: 55px; cursor: pointer;
                transition: transform 0.2s; z-index: 50;
                display: flex; align-items: center; justify-content: center;
                filter: drop-shadow(0 3px 5px rgba(0,0,0,0.2));
            }
            .fish-body { 
                width: 100%; height: 100%; border-radius: 50% 50% 40% 40%;
                position: relative; display: flex; align-items: center; justify-content: center;
            }
            .fish-tail {
                position: absolute; left: -18px; width: 0; height: 0;
                border-top: 18px solid transparent; border-bottom: 18px solid transparent;
            }
            .fish-value { color: white; font-weight: 900; font-size: 24px; text-shadow: 2px 2px #000; font-family: Fredoka; z-index: 2; }
            
            @keyframes moveRight { from { left: -120px; } to { left: 110%; } }
            @keyframes moveLeft { from { right: -120px; } to { right: 110%; } }
        </style>
        <div class="ocean-bg" id="ocean">
            <div class="mission-panel" id="mission-ui">Preparando rede...</div>
        </div>
    `;
}

function proximaMissao() {
    if (indicePergunta >= 10) { 
        finalizar(); 
        return; 
    }
    
    // Atualizar Barra de Status
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    const config = JOGO_CATEGORIAS[categoriaAtual];
    targetNum = Math.floor(Math.random() * (config.maxNum - 4)) + 3; // Evita extremos 1 e Max
    rule = Math.random() > 0.5 ? 'greater' : 'less';
    
    document.getElementById('mission-ui').innerHTML = 
        `PESCA UM NÚMERO <span style="color:#ef4444">${rule === 'greater' ? 'MAIOR' : 'MENOR'}</span> QUE ${targetNum}`;
}

function criarPeixe() {
    const ocean = document.getElementById('ocean');
    if(!ocean) return;

    const config = JOGO_CATEGORIAS[categoriaAtual];
    const val = Math.floor(Math.random() * config.maxNum) + 1;
    const colors = ["#ff6b6b", "#ff9f43", "#54a0ff", "#1dd1a1", "#feca57", "#ff4d5e", "#2ecc71"];
    const color = colors[Math.floor(Math.random()*colors.length)];
    
    const fish = document.createElement('div');
    fish.className = 'fish';
    
    const isLeft = Math.random() > 0.5;
    fish.style.top = (Math.random()*65 + 15) + '%';
    
    // Velocidade ligeiramente variável para não parecer mecânico
    const variacaoVel = config.velocidade + (Math.random() * 2 - 1);
    fish.style.animation = `${isLeft ? 'moveRight' : 'moveLeft'} ${variacaoVel}s linear forwards`;
    
    if(!isLeft) fish.style.transform = 'scaleX(-1)';

    fish.innerHTML = `
        <div class="fish-body" style="background:${color}">
            <div class="fish-tail" style="border-right: 25px solid ${color}"></div>
            <div class="fish-value" style="${!isLeft ? 'transform:scaleX(-1)' : ''}">${val}</div>
        </div>
    `;

    fish.onclick = (e) => {
        e.stopPropagation();
        if(jogoAtivo) capturarPeixe(fish, val);
    };

    ocean.appendChild(fish);
    
    // Auto-remover peixes que escaparam
    setTimeout(() => { if(fish.parentNode) fish.remove(); }, variacaoVel * 1000);
}

function capturarPeixe(el, val) {
    const acerto = (rule === 'greater' ? val > targetNum : val < targetNum);
    
    if(acerto) {
        acertos++; 
        somAcerto.play();
        el.style.pointerEvents = "none";
        el.style.transform = "scale(1.8) rotate(360deg)";
        el.style.opacity = "0";
        
        document.getElementById('hits-val').innerText = acertos;
        
        indicePergunta++; // Avança a ronda
        
        setTimeout(() => {
            if(el.parentNode) el.remove();
            proximaMissao();
        }, 300);
    } else {
        erros++; 
        somErro.play();
        el.style.transform = "translateX(30px) rotate(10deg)";
        setTimeout(() => el.style.transform = "translateX(-30px) rotate(-10deg)", 100);
        setTimeout(() => el.style.transform = "scale(1)", 200);
        document.getElementById('miss-val').innerText = erros;
    }
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
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:10px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:22%; min-height:90px; width:auto; margin-bottom:10px; object-fit:contain;">
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
                <button style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:13px; border-radius:20px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Escolher outro jogo</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
