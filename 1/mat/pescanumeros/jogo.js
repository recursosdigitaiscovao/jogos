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
    return "Pesca o peixe com o número correto! Se errares, ele perde a cor e afunda.";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; position:relative;">
            <div id="tut-fish-box" style="transform: scale(1.2);"></div>
            <div id="tut-hand" style="position:absolute; font-size:45px; bottom:-20px; right:0; animation: tapH 2s infinite; z-index:10;">☝️</div>
        </div>
        <style>
            @keyframes tapH { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px) scale(0.9); } }
        </style>
    `;
    // Injetar um peixe de exemplo na animação
    const tutBox = document.getElementById('tut-fish-box');
    tutBox.appendChild(gerarHTMLPeixe(8, "#ff9f43", "f-normal", true));
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
    spawnInterval = setInterval(() => { if(jogoAtivo) criarPeixe(); }, 1400);
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
            .ocean-bg { width: 100%; height: 100%; background: linear-gradient(180deg, #38bdf8 0%, #0369a1 100%); position: relative; overflow: hidden; border-radius: 25px; }
            .mission-panel { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.95); padding: 10px 30px; border-radius: 25px; border: 3px solid #0ea5e9; box-shadow: 0 8px 20px rgba(0,0,0,0.15); font-weight: 900; color: #0369a1; z-index: 1000; text-align: center; font-size: 1.1rem; }
            
            /* ESTRUTURA DO PEIXE REALISTA */
            .fish { position: absolute; width: 100px; height: 60px; cursor: pointer; z-index: 100; transition: filter 0.5s, transform 0.5s; }
            .fish-body { position: relative; width: 100%; height: 100%; border-radius: 50% 50% 45% 45%; border: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; overflow: visible; }
            
            /* OLHO */
            .eye { position: absolute; top: 20%; right: 15%; width: 12px; height: 12px; background: white; border-radius: 50%; border: 1px solid #666; }
            .pupil { position: absolute; top: 20%; right: 15%; width: 5px; height: 5px; background: black; border-radius: 50%; }
            .eye-shine { position: absolute; top: 15%; left: 15%; width: 2px; height: 2px; background: white; border-radius: 50%; }

            /* BARBATANAS */
            .fin-dorsal { position: absolute; top: -12px; left: 30%; width: 35px; height: 20px; border-radius: 50% 50% 0 0; z-index: -1; filter: brightness(0.8); }
            .fin-tail { position: absolute; right: 98%; width: 30px; height: 45px; clip-path: polygon(100% 50%, 0% 0%, 20% 50%, 0% 100%); animation: tailWag 0.4s infinite alternate ease-in-out; }
            .fin-pectoral { position: absolute; bottom: 20%; left: 35%; width: 20px; height: 12px; border-radius: 0 0 100% 100%; background: rgba(255,255,255,0.3); border: 1px solid rgba(0,0,0,0.1); z-index: 11; transform-origin: top; animation: finMove 2s infinite; }

            /* VARIAÇÕES */
            .f-long { transform: scaleX(1.3) scaleY(0.8); }
            .f-fat { transform: scaleY(1.3); }

            @keyframes tailWag { from { transform: rotateY(-20deg); } to { transform: rotateY(20deg); } }
            @keyframes finMove { 0%, 100% { transform: rotateX(0deg); } 50% { transform: rotateX(40deg); } }
            @keyframes moveRight { from { left: -150px; } to { left: 110%; } }
            @keyframes moveLeft { from { right: -150px; } to { right: 110%; } }

            .fish-value { position: relative; color: white; font-weight: 900; font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); font-family: 'Fredoka', sans-serif; z-index: 20; }
            .falling { transition: all 1.8s ease-in !important; top: 90% !important; transform: rotate(180deg) !important; filter: grayscale(1) opacity(0.6) !important; pointer-events: none !important; }
        </style>
        <div class="ocean-bg" id="ocean"><div class="mission-panel" id="mission-ui"></div></div>
    `;
}

function gerarHTMLPeixe(val, cor, formato, isTut = false) {
    const div = document.createElement('div');
    div.className = `fish ${formato}`;
    // Se for na intro, não precisa de movimento
    if(!isTut) div.style.animation = "none"; 

    div.innerHTML = `
        <div class="fin-dorsal" style="background: ${cor}"></div>
        <div class="fish-body" style="background: radial-gradient(circle at 30% 30%, ${cor} 0%, ${ajustarCor(cor, -40)} 100%)">
            <div class="eye"><div class="pupil"><div class="eye-shine"></div></div></div>
            <div class="fin-pectoral"></div>
            <div class="fish-value">${val}</div>
            <div class="fin-tail" style="background: ${cor}"></div>
        </div>
    `;
    return div;
}

function ajustarCor(col, amt) {
    let usePound = false;
    if (col[0] == "#") { col = col.slice(1); usePound = true; }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

function proximaMissao() {
    if (indicePergunta >= 10) { finalizar(); return; }
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;
    const config = JOGO_CATEGORIAS[categoriaAtual];
    targetNum = Math.floor(Math.random() * (config.maxNum - 4)) + 3;
    rule = Math.random() > 0.5 ? 'greater' : 'less';
    document.getElementById('mission-ui').innerHTML = `Missão: Pesca um número <b style="color:#ef4444">${rule === 'greater' ? 'MAIOR' : 'MENOR'}</b> que ${targetNum}`;
}

function criarPeixe() {
    const ocean = document.getElementById('ocean');
    if(!ocean) return;
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const val = Math.floor(Math.random() * config.maxNum) + 1;
    const colors = ["#ff4d5e", "#ff9f43", "#2ecc71", "#2196f3", "#feca57", "#9c27b0"];
    const formats = ["f-normal", "f-long", "f-fat"];
    
    const color = colors[Math.floor(Math.random()*colors.length)];
    const format = formats[Math.floor(Math.random()*formats.length)];
    
    const isLeft = Math.random() > 0.5;
    const fishWrap = document.createElement('div');
    fishWrap.style.position = "absolute";
    fishWrap.style.width = "110px";
    fishWrap.style.height = "70px";
    fishWrap.style.top = (Math.random()*65 + 15) + '%';
    
    const vel = config.velocidade + (Math.random() * 2);
    fishWrap.style.animation = `${isLeft ? 'moveRight' : 'moveLeft'} ${vel}s linear forwards`;
    
    const peixeHTML = gerarHTMLPeixe(val, color, format);
    if(!isLeft) peixeHTML.style.transform += ' scaleX(-1)';
    
    fishWrap.appendChild(peixeHTML);
    fishWrap.onclick = (e) => { e.stopPropagation(); if(jogoAtivo) capturarPeixe(fishWrap, val); };
    
    ocean.appendChild(fishWrap);
    setTimeout(() => { if(fishWrap.parentNode && !fishWrap.classList.contains('falling')) fishWrap.remove(); }, vel * 1000);
}

function capturarPeixe(el, val) {
    const acerto = (rule === 'greater' ? val > targetNum : val < targetNum);
    el.style.pointerEvents = "none";

    if(acerto) {
        acertos++; somAcerto.play();
        el.style.transform = "scale(1.5) translateY(-50px)";
        el.style.opacity = "0";
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play();
        el.style.animationPlayState = "paused";
        el.classList.add('falling');
        document.getElementById('miss-val').innerText = erros;
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
                <button class="res-btn res-btn-p" style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button class="res-btn res-btn-o" style="padding:13px; border-radius:20px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Escolher outro jogo</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
