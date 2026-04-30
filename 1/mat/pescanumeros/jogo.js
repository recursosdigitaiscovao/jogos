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

window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "mar-calmo";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Pesca o peixe com o número correto! Se errares, o peixe vai para o fundo do aquário.";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

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
    spawnInterval = setInterval(() => { if(jogoAtivo) criarPeixe(); }, 1200);
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
            .ocean-bg { width: 100%; height: 100%; background: linear-gradient(180deg, #bae6fd 0%, #0284c7 100%); position: relative; overflow: hidden; border-radius: 25px; }
            .mission-panel { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); background: white; padding: 10px 25px; border-radius: 20px; border: 3px solid #0ea5e9; box-shadow: 0 5px 15px rgba(0,0,0,0.1); font-weight: 900; color: #0369a1; z-index: 100; text-align: center; white-space: nowrap; }
            
            /* PEIXES */
            .fish { position: absolute; width: 90px; height: 60px; cursor: pointer; z-index: 50; transition: filter 0.5s, transform 0.5s; }
            .fish-body { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
            .fish-value { color: white; font-weight: 900; font-size: 22px; text-shadow: 2px 2px #000; font-family: Fredoka; z-index: 10; }
            
            /* VARIAÇÕES DE FORMATO */
            .f-round { border-radius: 50% 50% 40% 40%; }
            .f-tall { border-radius: 50% 50% 10% 10%; height: 75px !important; }
            .f-long { border-radius: 60% 60% 30% 30%; width: 110px !important; height: 45px !important; }

            /* BARBATANAS */
            .fin-tail { position: absolute; left: -18px; width: 0; height: 0; border-top: 18px solid transparent; border-bottom: 18px solid transparent; }
            .fin-top { position: absolute; top: -10px; width: 30px; height: 15px; border-radius: 50% 50% 0 0; }

            /* ANIMAÇÕES */
            @keyframes moveRight { from { left: -120px; } to { left: 110%; } }
            @keyframes moveLeft { from { right: -120px; } to { right: 110%; } }
            .falling { transition: all 1.5s cubic-bezier(0.55, 0.05, 0.675, 0.19) !important; top: 85% !important; transform: rotate(180deg) scaleX(-1) !important; filter: grayscale(1) opacity(0.7) !important; pointer-events: none !important; }
        </style>
        <div class="ocean-bg" id="ocean"><div class="mission-panel" id="mission-ui"></div></div>
    `;
}

function proximaMissao() {
    if (indicePergunta >= 10) { finalizar(); return; }
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;
    const config = JOGO_CATEGORIAS[categoriaAtual];
    targetNum = Math.floor(Math.random() * (config.maxNum - 4)) + 3;
    rule = Math.random() > 0.5 ? 'greater' : 'less';
    document.getElementById('mission-ui').innerHTML = `PESCA UM NÚMERO <span style="color:#ef4444">${rule === 'greater' ? 'MAIOR' : 'MENOR'}</span> QUE ${targetNum}`;
}

function criarPeixe() {
    const ocean = document.getElementById('ocean');
    if(!ocean) return;
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const val = Math.floor(Math.random() * config.maxNum) + 1;
    const colors = ["#ff6b6b", "#ff9f43", "#54a0ff", "#1dd1a1", "#feca57", "#ff4d5e", "#2ecc71"];
    const formats = ["f-round", "f-tall", "f-long"];
    
    const color = colors[Math.floor(Math.random()*colors.length)];
    const format = formats[Math.floor(Math.random()*formats.length)];
    
    const fish = document.createElement('div');
    fish.className = 'fish';
    const isLeft = Math.random() > 0.5;
    fish.style.top = (Math.random()*60 + 15) + '%';
    const vel = config.velocidade + (Math.random() * 2 - 1);
    fish.style.animation = `${isLeft ? 'moveRight' : 'moveLeft'} ${vel}s linear forwards`;
    if(!isLeft) fish.style.transform = 'scaleX(-1)';

    fish.innerHTML = `
        <div class="fish-body ${format}" style="background:${color}">
            <div class="fin-top" style="background:${color}; opacity:0.8;"></div>
            <div class="fin-tail" style="border-right: 25px solid ${color}"></div>
            <div class="fish-value" style="${!isLeft ? 'transform:scaleX(-1)' : ''}">${val}</div>
        </div>
    `;

    fish.onclick = (e) => { e.stopPropagation(); if(jogoAtivo) capturarPeixe(fish, val); };
    ocean.appendChild(fish);
    setTimeout(() => { if(fish.parentNode && !fish.classList.contains('falling')) fish.remove(); }, vel * 1000);
}

function capturarPeixe(el, val) {
    const acerto = (rule === 'greater' ? val > targetNum : val < targetNum);
    el.style.pointerEvents = "none";

    if(acerto) {
        acertos++; somAcerto.play();
        el.style.transform = "scale(1.8) rotate(360deg)";
        el.style.opacity = "0";
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { if(el.parentNode) el.remove(); }, 500);
    } else {
        erros++; somErro.play();
        // Feedback de Erro: Perde cor e cai
        el.style.animation = "none"; // Para o movimento lateral
        el.classList.add('falling');
        document.getElementById('miss-val').innerText = erros;
        // O peixe fica no fundo um tempo antes de sumir
        setTimeout(() => { if(el.parentNode) el.remove(); }, 3000);
    }

    indicePergunta++;
    setTimeout(proximaMissao, 600);
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
