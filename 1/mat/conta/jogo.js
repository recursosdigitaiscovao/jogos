let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 
let totalObjetos = 0;
let itemSorteado = "";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) {
        categoriaAtual = Object.keys(JOGO_CATEGORIAS)[0] || "Nível 1";
    }
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Quantos objetos consegues contar? Escolhe o número correto!";
};

window.selecionarCategoria = function(key) { 
    categoriaAtual = key; 
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const imgExemplo = JOGO_CONFIG.caminhoImg + config.pasta + config.itens[0];

    container.innerHTML = `
        <div class="tut-wrapper">
            <div class="tut-items">
                <img src="${imgExemplo}"><img src="${imgExemplo}"><img src="${imgExemplo}">
            </div>
            <div class="tut-options">
                <div class="tut-btn">1</div><div class="tut-btn tut-target">3</div><div class="tut-btn">5</div>
            </div>
            <div class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; gap: 15px; }
            .tut-items { display: flex; gap: 5px; }
            .tut-items img { width: 45px; height: 45px; object-fit: contain; }
            .tut-options { display: flex; gap: 8px; }
            .tut-btn { width: 35px; height: 35px; background: white; border: 2px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
            .tut-hand { position: absolute; font-size: 30px; animation: tutClick 3s infinite ease-in-out; bottom: -10px; }
            @keyframes tutClick { 0%, 100% { transform: translate(20px, 20px); opacity: 0; } 20% { opacity: 1; transform: translate(20px, 0px); } 50% { transform: translate(5px, -30px); } }
        </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    proximaRonda();
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

function proximaRonda() {
    if (indicePergunta >= 10) { finalizarJogo(); return; }
    const config = JOGO_CATEGORIAS[categoriaAtual];
    
    totalObjetos = Math.floor(Math.random() * config.maxNum) + 1;
    const randomIndex = Math.floor(Math.random() * config.itens.length);
    itemSorteado = config.itens[randomIndex];
    
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    const imgPath = JOGO_CONFIG.caminhoImg + config.pasta + itemSorteado;

    let choices = [totalObjetos];
    while(choices.length < 4) {
        let w = totalObjetos + (Math.floor(Math.random() * 8) - 4);
        if(w > 0 && !choices.includes(w)) choices.push(w);
    }
    choices.sort((a, b) => a - b);

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-between; padding: 15px 5px; box-sizing: border-box; }
            
            .category-label {
                background: #ffffff; color: #0369a1; padding: 10px 25px; border-radius: 20px; 
                font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1.5px;
                border: 4px solid #0369a1; margin-top: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }

            .display-stage { 
                flex:1; width:100%; max-width: 850px;
                display: flex; flex-wrap: wrap; 
                align-items:center; justify-content:center; align-content: center;
                gap: 12px; padding: 15px;
            }

            .count-item {
                width: calc(10% - 12px); /* 10 por fila em landscape */
                max-width: 75px; height: auto; aspect-ratio: 1/1; object-fit: contain;
                animation: popItem 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                opacity: 0;
            }

            @keyframes popItem {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            .options-row { display: flex; justify-content: center; gap: 10px; width: 100%; padding-bottom: 25px; }
            
            .opt-btn { 
                width: 75px; height: 75px; background: white; border: 4px solid #cbd5e1; border-radius: 20px; 
                font-size: 2rem; font-weight: 900; cursor: pointer; box-shadow: 0 6px 0 #cbd5e1; color: #1e293b; 
                flex: 1; max-width: 85px; aspect-ratio: 1/1;
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #cbd5e1; }

            @media (max-width: 600px) {
                .display-stage { gap: 8px; }
                .count-item { width: calc(20% - 10px); } /* 5 por fila em vertical/mobile */
                .opt-btn { height: 60px; font-size: 1.6rem; }
                .category-label { font-size: 0.75rem; padding: 8px 15px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="display-stage">
                ${Array(totalObjetos).fill(0).map((_, i) => `
                    <img src="${imgPath}" class="count-item" style="animation-delay: ${i * 0.04}s">
                `).join('')}
            </div>
            
            <div class="options-row">
                ${choices.map(val => `<button class="opt-btn" onclick="verificar(this, ${val})">${val}</button>`).join('')}
            </div>
        </div>
    `;
}

function verificar(btn, val) {
    document.querySelectorAll('.opt-btn').forEach(b => b.style.pointerEvents = 'none');

    if (val === totalObjetos) {
        acertos++; somAcerto.play();
        btn.style.background = "#dcfce7"; btn.style.borderColor = "#22c55e";
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1000);
    } else {
        erros++; somErro.play();
        btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444";
        document.getElementById('miss-val').innerText = erros;
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1200);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo); 
    somVitoria.play();
    
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
            
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; width:auto; margin-bottom:15px; object-fit:contain;">
            
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:26px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:11px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:26px; font-weight:900; color:var(--primary-blue);">${tempoFinal}</span>
                    <span style="font-size:11px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" 
                    onclick="location.reload()">Jogar de Novo</button>
                
                <button style="padding:14px; border-radius:22px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" 
                    onclick="openRDMenu()">Outro Nível</button>
                
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
