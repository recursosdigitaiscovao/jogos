let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 
let num1 = 0;
let num2 = 0;
let resultadoCorreto = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) {
        categoriaAtual = "Nível 1";
    }
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Resolve as somas! Escolhe o resultado correto para avançar.";
};

window.selecionarCategoria = function(key) { 
    categoriaAtual = key; 
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;

    container.innerHTML = `
        <div class="tut-wrapper">
            <div class="tut-sum">2 + 3 = ?</div>
            <div class="tut-opts">
                <div class="tut-opt">4</div>
                <div class="tut-opt tut-target">5</div>
                <div class="tut-opt">6</div>
            </div>
            <div class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; gap: 15px; }
            .tut-sum { font-size: 2rem; font-weight: 900; color: #0369a1; }
            .tut-opts { display: flex; gap: 10px; }
            .tut-opt { width: 35px; height: 35px; background: white; border: 2px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
            .tut-hand { position: absolute; font-size: 30px; animation: tutClickSum 3s infinite ease-in-out; bottom: -15px; }
            @keyframes tutClickSum { 0%, 100% { transform: translate(25px, 15px); opacity: 0; } 20% { opacity: 1; transform: translate(25px, 0px); } 50% { transform: translate(5px, -30px); } }
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
    
    // Gerar números aleatórios baseados no nível
    resultadoCorreto = Math.floor(Math.random() * (config.maxResultado - 1)) + 2; 
    num1 = Math.floor(Math.random() * (resultadoCorreto));
    num2 = resultadoCorreto - num1;

    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    let choices = [resultadoCorreto];
    while(choices.length < 4) {
        let w = resultadoCorreto + (Math.floor(Math.random() * 10) - 5);
        if(w >= 0 && !choices.includes(w)) choices.push(w);
    }
    choices.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { 
                display:flex; flex-direction:column; width:100%; height:100%; 
                align-items:center; justify-content:space-between; 
                padding: 10px; box-sizing: border-box; overflow:hidden; 
            }
            
            .category-label {
                background: #ffffff; color: #0369a1; padding: 8px 25px; border-radius: 20px; 
                font-weight: 900; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px;
                border: 4px solid #0369a1; margin-top: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                z-index: 10;
            }

            /* ÁREA DA OPERAÇÃO - AJUSTE DINÂMICO */
            .operation-display { 
                flex:1; width: 100%; display:flex; align-items:center; justify-content:center;
                /* Escala entre 2.5rem em ecrãs pequenos e 6rem em grandes */
                font-size: clamp(2.5rem, 12vw, 6rem); 
                font-weight: 900; color: #1e3a8a;
                text-align: center; white-space: nowrap;
                padding: 0 10px;
            }

            .options-row { 
                display: grid; 
                grid-template-columns: repeat(2, 1fr); 
                gap: 15px; width: 100%; max-width: 450px; 
                padding-bottom: 15px; 
            }
            
            .opt-btn { 
                background: white; border: 4px solid #cbd5e1; border-radius: 22px; 
                height: clamp(60px, 15vh, 90px);
                font-size: clamp(1.8rem, 8vw, 2.5rem); 
                font-weight: 900; cursor: pointer; 
                box-shadow: 0 6px 0 #cbd5e1; color: #1e293b; transition: 0.1s;
                display: flex; align-items: center; justify-content: center;
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #cbd5e1; }

            /* Ajuste para ecrãs horizontais baixos (ex: phones em landscape) */
            @media (max-height: 450px) {
                .game-wrapper { padding: 5px; }
                .category-label { margin-top: 0; padding: 4px 15px; font-size: 0.7rem; }
                .operation-display { font-size: clamp(2rem, 10vh, 3.5rem); }
                .options-row { grid-template-columns: repeat(4, 1fr); max-width: 100%; gap: 10px; }
                .opt-btn { height: 50px; border-radius: 12px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="operation-display">
                ${num1} + ${num2} = ?
            </div>
            
            <div class="options-row">
                ${choices.map(val => `<button class="opt-btn" onclick="verificarSoma(this, ${val})">${val}</button>`).join('')}
            </div>
        </div>
    `;
}

function verificarSoma(btn, val) {
    document.querySelectorAll('.opt-btn').forEach(b => b.style.pointerEvents = 'none');

    if (val === resultadoCorreto) {
        acertos++; somAcerto.play();
        btn.style.background = "#dcfce7"; btn.style.borderColor = "#22c55e";
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 800);
    } else {
        erros++; somErro.play();
        btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444";
        document.getElementById('miss-val').innerText = erros;
        
        // Brilho rápido na correta
        const botoes = document.querySelectorAll('.opt-btn');
        botoes.forEach(b => { if(parseInt(b.innerText) === resultadoCorreto) b.style.borderColor = "#22c55e"; });

        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1400);
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
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:15px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #eee;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #eee;">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempoFinal}</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:16px; border-radius:22px; font-weight:900; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark);" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:14px; border-radius:22px; font-weight:900; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue);" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:22px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
