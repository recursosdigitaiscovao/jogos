let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 
let formaAlvo = "";
let itensNoEcra = [];

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
    return "Consegues identificar as formas geométricas? Presta atenção ao que é pedido!";
};

window.selecionarCategoria = function(key) { 
    categoriaAtual = key; 
};

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const path = JOGO_CONFIG.caminhoImg + "formas/";

    container.innerHTML = `
        <div class="tut-wrapper">
            <p style="font-weight:900; color:#0369a1; margin-bottom:10px;">"Encontra o Quadrado"</p>
            <div class="tut-items">
                <img src="${path}circulo_v.png">
                <img src="${path}quadrado_v.png" class="tut-target">
                <img src="${path}triangulo_v.png">
            </div>
            <div class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; }
            .tut-items { display: flex; gap: 10px; }
            .tut-items img { width: 50px; height: 50px; object-fit: contain; }
            .tut-hand { position: absolute; font-size: 35px; animation: tutClickShapes 3s infinite ease-in-out; bottom: -20px; }
            @keyframes tutClickShapes { 0%, 100% { transform: translate(30px, 20px); opacity: 0; } 20% { opacity: 1; transform: translate(30px, 0px); } 50% { transform: translate(5px, -35px); } }
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
    
    // Escolher a forma que o aluno deve procurar
    formaAlvo = BIBLIOTECA_FORMAS.formas[Math.floor(Math.random() * BIBLIOTECA_FORMAS.formas.length)];
    
    // Gerar os itens do ecrã
    itensNoEcra = [];
    const corBase = BIBLIOTECA_FORMAS.cores[Math.floor(Math.random() * BIBLIOTECA_FORMAS.cores.length)];

    for (let i = 0; i < config.quantidade; i++) {
        let formaRandom = BIBLIOTECA_FORMAS.formas[Math.floor(Math.random() * BIBLIOTECA_FORMAS.formas.length)];
        let corRandom = config.coresMisturadas ? BIBLIOTECA_FORMAS.cores[Math.floor(Math.random() * BIBLIOTECA_FORMAS.cores.length)] : corBase;
        
        itensNoEcra.push({ tipo: formaRandom, cor: corRandom });
    }

    // Garantir que existe pelo menos uma resposta correta no ecrã
    if (!itensNoEcra.some(item => item.tipo === formaAlvo || (formaAlvo === "retangulo" && item.tipo === "quadrado"))) {
        itensNoEcra[0].tipo = formaAlvo;
    }

    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    const path = JOGO_CONFIG.caminhoImg + "formas/";

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-between; padding: 15px 5px; box-sizing: border-box; }
            
            .category-label {
                background: #ffffff; color: #0369a1; padding: 8px 25px; border-radius: 15px; 
                font-weight: 900; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.2px;
                border: 4px solid #0369a1; margin-top: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }

            .instruction-box {
                margin: 10px 0; font-size: 1.4rem; font-weight: 900; color: #1e293b; text-align: center;
            }
            .instruction-box b { color: #ef4444; text-transform: uppercase; }

            .display-stage { 
                flex:1; width:100%; max-width: 850px;
                display: flex; flex-wrap: wrap; 
                align-items:center; justify-content:center; align-content: center;
                gap: 15px; padding: 15px;
            }

            .shape-item {
                width: calc(20% - 15px); max-width: 80px; height: auto; aspect-ratio: 1/1; 
                object-fit: contain; cursor: pointer;
                transition: transform 0.2s;
                animation: popShape 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .shape-item:hover { transform: scale(1.1); }
            .shape-item:active { transform: scale(0.9); }

            @keyframes popShape { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

            @media (max-width: 600px) {
                .shape-item { width: calc(25% - 10px); max-width: 60px; }
                .instruction-box { font-size: 1.1rem; }
                .category-label { font-size: 0.75rem; padding: 6px 15px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="instruction-box">Encontra todos os: <b>${BIBLIOTECA_FORMAS.nomes[formaAlvo]}</b></div>

            <div class="display-stage">
                ${itensNoEcra.map((item, i) => `
                    <img src="${path}${item.tipo}_${item.cor}.png" 
                         class="shape-item" 
                         onclick="verificarForma(this, '${item.tipo}')"
                         style="animation-delay: ${i * 0.03}s">
                `).join('')}
            </div>
        </div>
    `;
}

function verificarForma(el, tipoClicado) {
    if (el.classList.contains('clicked')) return;

    // Regra especial: Quadrado também é retângulo
    const eCorreto = (tipoClicado === formaAlvo) || (formaAlvo === "retangulo" && tipoClicado === "quadrado");

    if (eCorreto) {
        somAcerto.play();
        el.classList.add('clicked');
        el.style.filter = "drop-shadow(0 0 10px #22c55e) brightness(1.1)";
        el.style.transform = "scale(0.8)";
        el.style.opacity = "0.5";
        el.style.pointerEvents = "none";

        // Verificar se ainda existem mais formas alvo no ecrã
        const formasRestantes = Array.from(document.querySelectorAll('.shape-item:not(.clicked)')).filter(img => {
            // Extrai o tipo do src ou usa um atributo data
            const src = img.getAttribute('src');
            const tipo = src.split('/').pop().split('_')[0];
            return (tipo === formaAlvo) || (formaAlvo === "retangulo" && tipo === "quadrado");
        });

        if (formasRestantes.length === 0) {
            acertos++;
            document.getElementById('hits-val').innerText = acertos;
            setTimeout(() => {
                indicePergunta++;
                proximaRonda();
            }, 800);
        }
    } else {
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        el.style.animation = "shakeError 0.4s";
        setTimeout(() => el.style.animation = "", 400);
    }
}

// Adicionar animação de erro dinamicamente se não existir no CSS do wrapper
if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.innerHTML = `@keyframes shakeError { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }`;
    document.head.appendChild(style);
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
