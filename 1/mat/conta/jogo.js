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
            .tut-items img { width: 40px; height: 40px; object-fit: contain; }
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
    
    // Sorteia a quantidade
    totalObjetos = Math.floor(Math.random() * config.maxNum) + 1;
    
    // Sorteia QUAL item vai aparecer nesta ronda
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
        let w = totalObjetos + (Math.floor(Math.random() * 6) - 3);
        if(w > 0 && w <= (config.maxNum + 5) && !choices.includes(w)) choices.push(w);
    }
    choices.sort((a, b) => a - b);

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-between; padding: 20px 5px; box-sizing: border-box; }
            
            .category-label {
                background: #ffffff; color: #0369a1; padding: 10px 25px; border-radius: 20px; 
                font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1.5px;
                border: 4px solid #0369a1; margin-top: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .display-stage { 
                flex:1; width:100%; display:flex; flex-wrap: wrap; 
                align-items:center; justify-content:center; align-content: center;
                gap: 12px; padding: 15px; max-width: 600px;
            }

            .count-item {
                width: 75px; height: 75px; object-fit: contain;
                animation: popItem 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                opacity: 0;
            }

            @keyframes popItem {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            .options-row { display: flex; justify-content: center; gap: 10px; width: 100%; padding-bottom: 20px; }
            
            .opt-btn { 
                width: 75px; height: 75px; background: white; border: 4px solid #cbd5e1; border-radius: 20px; 
                font-size: 2rem; font-weight: 900; cursor: pointer; box-shadow: 0 6px 0 #cbd5e1; color: #1e293b; 
                flex: 1; max-width: 85px; aspect-ratio: 1/1;
            }
            .opt-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #cbd5e1; }

            @media (max-width: 480px) {
                .count-item { width: 55px; height: 55px; }
                .opt-btn { height: 60px; font-size: 1.6rem; }
                .category-label { font-size: 0.75rem; padding: 6px 15px; }
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
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:20px; text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:20px;">
            <h2 style="color:var(--primary-blue); font-size:1.8rem; font-weight:900;">${rel.titulo}</h2>
            <div style="background:white; padding:15px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.1); margin: 20px 0;">
                <div style="font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos}/10</div>
                <div style="font-size:12px; color:#88a;">Acertos</div>
            </div>
            <button onclick="location.reload()" style="background:var(--primary-blue); color:white; border:none; padding:15px 40px; border-radius:50px; font-weight:900; cursor:pointer; box-shadow:0 5px 0 var(--primary-dark);">JOGAR DE NOVO</button>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
