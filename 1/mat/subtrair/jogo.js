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
    return "Resolve as subtrações! Se precisares de ajuda, conta as bolinhas coloridas.";
};

window.selecionarCategoria = function(key) { 
    categoriaAtual = key; 
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; position:relative;">
            <div style="display:flex; gap:8px; font-size:1.8rem; font-weight:900;">
                <div style="background:white; padding:8px; border-radius:10px; border:3px solid #f97316; color:#7c2d12;">5</div>
                <div style="color:#f97316;">-</div>
                <div style="background:white; padding:8px; border-radius:10px; border:3px solid #f97316; color:#7c2d12;">2</div>
            </div>
            <div style="display:flex; gap:3px;">
                <div style="width:12px; height:12px; background:#f97316; border-radius:50%;"></div>
                <div style="width:12px; height:12px; background:#f97316; border-radius:50%;"></div>
                <div style="width:12px; height:12px; background:#f97316; border-radius:50%;"></div>
                <div style="width:12px; height:12px; background:#ddd; border-radius:50%; text-decoration:line-through;"></div>
                <div style="width:12px; height:12px; background:#ddd; border-radius:50%;"></div>
            </div>
            <div id="tut-hand" style="position:absolute; font-size:30px; bottom:-20px; right:-15px; animation: tapH 2s infinite; z-index:10;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px); } } </style>
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
    
    // Gerar subtração (num1 sempre maior ou igual a num2)
    num1 = Math.floor(Math.random() * (config.maxNum - 1)) + 1;
    num2 = Math.floor(Math.random() * (num1 + 1));
    resultadoCorreto = num1 - num2;

    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    let choices = [resultadoCorreto];
    while(choices.length < 4) {
        let w = resultadoCorreto + (Math.floor(Math.random() * 8) - 4);
        if(w >= 0 && !choices.includes(w)) choices.push(w);
    }
    choices.sort((a, b) => a - b);

    // Gerar bolinhas de ajuda
    let htmlAjuda = "";
    if(config.mostrarAjuda) {
        htmlAjuda = `<div class="help-dots">`;
        for(let i=0; i<num1; i++) {
            // As bolinhas que "tiramos" ficam com a classe 'taken'
            const isTaken = i < num2;
            htmlAjuda += `<div class="dot ${isTaken ? 'taken' : ''}"></div>`;
        }
        htmlAjuda += `</div>`;
    }

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-between; padding: 15px 5px; box-sizing: border-box; overflow:hidden; }
            
            .category-label {
                background: #ffffff; color: #c2410c; padding: 10px 25px; border-radius: 20px; 
                font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1.5px;
                border: 4px solid #c2410c; margin-top: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }

            .op-container { flex:1; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 20px; }
            
            .blocks-row { display:flex; align-items:center; justify-content:center; gap: clamp(8px, 3vw, 20px); }
            
            .op-block {
                background: white; border: 4px solid #fed7aa; border-bottom: 8px solid #fb923c; border-radius: 20px;
                min-width: clamp(60px, 18vw, 110px); height: clamp(80px, 18vh, 130px);
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(2rem, 8vw, 4rem); font-weight: 900; color: #7c2d12;
                box-shadow: 0 10px 20px rgba(0,0,0,0.05); animation: popBlock 0.4s forwards;
            }
            .op-sign { font-size: clamp(2rem, 8vw, 3.5rem); font-weight: 900; color: #f97316; }
            .op-target { border-color: #f97316; border-bottom-color: #ea580c; color: #f97316; background: #fff7ed; }

            /* ESTILO DAS BOLINHAS DE AJUDA */
            .help-dots { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; max-width: 400px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 15px; }
            .dot { width: 22px; height: 22px; background: #f97316; border-radius: 50%; box-shadow: inset 0 -3px 0 rgba(0,0,0,0.2); }
            .dot.taken { background: #e5e7eb; position: relative; opacity: 0.6; }
            .dot.taken::after { content: '✕'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #9ca3af; font-size: 14px; font-weight: 900; }

            @keyframes popBlock { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }

            .options-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; max-width: 550px; padding: 10px 10px 30px; }
            .opt-btn { 
                background: white; border: 3px solid #cbd5e1; border-radius: 20px; aspect-ratio: 1/1; 
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.5rem, 6vw, 2.2rem); font-weight: 900; cursor: pointer; 
                box-shadow: 0 6px 0 #cbd5e1; color: #1e293b; transition: 0.1s;
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #cbd5e1; }

            @media (max-width: 480px) {
                .dot { width: 16px; height: 16px; }
                .opt-btn { border-radius: 15px; box-shadow: 0 4px 0 #cbd5e1; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="op-container">
                <div class="blocks-row">
                    <div class="op-block">${num1}</div>
                    <div class="op-sign">-</div>
                    <div class="op-block">${num2}</div>
                    <div class="op-sign">=</div>
                    <div class="op-block op-target">?</div>
                </div>
                
                ${htmlAjuda}
            </div>
            
            <div class="options-row">
                ${choices.map(val => `<button class="opt-btn" onclick="verificarSubtracao(this, ${val})">${val}</button>`).join('')}
            </div>
        </div>
    `;
}

function verificarSubtracao(btn, val) {
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.style.pointerEvents = 'none');
    const targetBlock = document.querySelector('.op-target');

    if (val === resultadoCorreto) {
        somAcerto.play();
        btn.style.background = "#dcfce7"; btn.style.borderColor = "#22c55e"; btn.style.color = "#166534";
        targetBlock.innerText = resultadoCorreto;
        targetBlock.style.background = "#22c55e"; targetBlock.style.borderColor = "#16a34a"; targetBlock.style.color = "white";
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1200);
    } else {
        somErro.play();
        btn.style.background = "#fee2e2"; btn.style.borderColor = "#ef4444"; btn.style.color = "#991b1b";
        erros++;
        document.getElementById('miss-val').innerText = erros;
        btns.forEach(b => { if(parseInt(b.innerText) === resultadoCorreto) b.style.borderColor = "#22c55e"; });
        setTimeout(() => { indicePergunta++; proximaRonda(); }, 1600);
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
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:26px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:11px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0;">
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
