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
    return "Resolve as adições o mais rápido que conseguires! Escolhe o resultado correto.";
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
            .tut-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; gap: 20px; }
            .tut-sum { font-size: 2.5rem; font-weight: 900; color: #0369a1; }
            .tut-opts { display: flex; gap: 10px; }
            .tut-opt { width: 40px; height: 40px; background: white; border: 2px solid #cbd5e1; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
            .tut-hand { position: absolute; font-size: 35px; animation: tutClickSum 3s infinite ease-in-out; bottom: -20px; }
            @keyframes tutClickSum { 0%, 100% { transform: translate(30px, 20px); opacity: 0; } 20% { opacity: 1; transform: translate(30px, 0px); } 50% { transform: translate(5px, -35px); } }
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
    
    // Gerar soma baseada no nível
    resultadoCorreto = Math.floor(Math.random() * (config.maxResultado - 1)) + 2; 
    num1 = Math.floor(Math.random() * (resultadoCorreto));
    num2 = resultadoCorreto - num1;

    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    // Gerar opções de resposta próximas do resultado
    let choices = [resultadoCorreto];
    while(choices.length < 4) {
        let w = resultadoCorreto + (Math.floor(Math.random() * 10) - 5);
        if(w >= 0 && !choices.includes(w)) choices.push(w);
    }
    choices.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-between; padding: 20px 5px; box-sizing: border-box; }
            
            .category-label {
                background: #ffffff; color: #0369a1; padding: 10px 30px; border-radius: 20px; 
                font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1.5px;
                border: 4px solid #0369a1; margin-top: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }

            .operation-display { 
                flex:1; display:flex; align-items:center; justify-content:center;
                font-size: clamp(3.5rem, 15vw, 6rem); font-weight: 900; color: #1e3a8a;
                text-shadow: 4px 4px 0px rgba(0,0,0,0.05);
                animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn { from { opacity:0; transform: translateY(-20px); } to { opacity:1; transform: translateY(0); } }

            .options-row { 
                display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; 
                width: 100%; max-width: 400px; padding-bottom: 20px; 
            }
            
            .opt-btn { 
                background: white; border: 4px solid #cbd5e1; border-radius: 25px; 
                padding: 20px; font-size: 2.5rem; font-weight: 900; cursor: pointer; 
                box-shadow: 0 8px 0 #cbd5e1; color: #1e293b; transition: 0.1s;
                display: flex; align-items: center; justify-content: center;
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 4px 0 #cbd5e1; }

            @media (max-width: 480px) {
                .operation-display { font-size: 4rem; }
                .opt-btn { padding: 15px; font-size: 2rem; border-radius: 20px; }
                .category-label { font-size: 0.75rem; padding: 8px 20px; }
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
        btn.style.color = "#166534";
        document.getElementById('hits-val').innerText = acertos;
        
        setTimeout(() => {
            indicePergunta++;
            proximaRonda();
        }, 800);
    } else {
        erros++; somErro.play();
        btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444";
        btn.style.color = "#991b1b";
        document.getElementById('miss-val').innerText = erros;
        
        // Destaca a correta visualmente antes de passar
        const botoes = document.querySelectorAll('.opt-btn');
        botoes.forEach(b => {
            if(parseInt(b.innerText) === resultadoCorreto) {
                b.style.borderColor = "#22c55e";
            }
        });

        setTimeout(() => {
            indicePergunta++;
            proximaRonda();
        }, 1500);
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
                <button style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:14px; border-radius:22px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
