let roundAtual = 0;
let acertos = 0;
let erros = 0;
let contadorAjudas = 0;
let desafiosEmbaralhados = [];
let jogoAtivo = false;

let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    
    // Configura o Botão de Ajuda (Lâmpada)
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.id = "btn-ajuda";
        timerBadge.style.cursor = "pointer";
        timerBadge.style.background = "transparent";
        timerBadge.style.boxShadow = "none";
        timerBadge.style.padding = "0";
        timerBadge.style.display = "flex";
        timerBadge.style.alignItems = "center";
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:35px; width:auto;">`;
        timerBadge.onclick = darAjuda;
    }

    // Padronizar badges da barra de estado
    const badges = document.querySelectorAll('.badge');
    badges.forEach(b => {
        b.style.height = "28px";
        b.style.display = "flex";
        b.style.alignItems = "center";
        b.style.justifyContent = "center";
        b.style.padding = "0 12px";
        b.style.lineHeight = "1";
    });

    const introContainer = document.getElementById('intro-animation-container');
    introContainer.innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div style="font-size: clamp(50px, 10vh, 80px);">🤔 ↔️ 😄</div>
            <h2 style="color: var(--primary-blue); font-size: 22px; font-weight:900;">ANTÓNIMOS</h2>
            <p style="color: var(--text-grey); font-weight:700;">Encontra os opostos!</p>
        </div>
    `;
};

window.gerarIntroJogo = function() {
    return "Clica na palavra que significa o contrário!";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; contadorAjudas = 0; roundAtual = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";

    const config = JOGO_CATEGORIAS[categoriaAtual];
    desafiosEmbaralhados = shuffleArray([...config.desafios]); 
    
    proximaRonda();
};

function proximaRonda() {
    roundAtual++;
    if (roundAtual > 10 || roundAtual > desafiosEmbaralhados.length) {
        finalizarJogo();
        return;
    }
    
    document.getElementById('round-val').innerText = `${roundAtual} / 10`;
    jogoAtivo = true;
    renderizarDesafio();
}

function renderizarDesafio() {
    const container = document.getElementById('game-main-content');
    const desafio = desafiosEmbaralhados[roundAtual - 1];
    
    // Embaralha as 4 opções para não estarem sempre na mesma ordem
    const opcoesAleatorias = shuffleArray([...desafio.opcoes]);

    container.innerHTML = `
        <style>
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: space-evenly; padding: 10px; box-sizing: border-box; }
            .row-title { height: 5%; display: flex; align-items: center; justify-content: center; }
            .row-question { height: 35%; display: flex; align-items: center; justify-content: center; width: 100%; }
            .row-options { height: 50%; display: flex; align-items: center; justify-content: center; width: 100%; }
            
            .question-box { 
                background: #f0f9ff; border: 3px dashed var(--primary-blue); border-radius: 25px;
                padding: 20px; width: 90%; max-width: 450px; text-align: center;
            }
            .question-text { font-size: clamp(1.8rem, 5vh, 2.5rem); font-weight: 900; color: var(--primary-dark); text-transform: uppercase; }
            
            .options-grid { 
                display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 95%; max-width: 450px; 
            }
            .btn-option { 
                background: white; border: 3px solid #eee; border-radius: 18px; 
                padding: 15px 5px; font-size: 1.1rem; font-weight: 900; color: var(--text-grey);
                cursor: pointer; transition: 0.2s; box-shadow: 0 4px 0 #ddd; text-transform: uppercase;
            }
            .btn-option:active { transform: translateY(2px); box-shadow: none; }
            
            .btn-option.correct-hint { animation: blinkHelp 0.6s infinite alternate; border-color: #f59e0b !important; background: #fef3c7 !important; }
            @keyframes blinkHelp { from { transform: scale(1); } to { transform: scale(1.05); } }
        </style>

        <div class="factory-wrapper">
            <div class="row-title"><div style="font-size:0.75rem; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${JOGO_CATEGORIAS[categoriaAtual].nome}</div></div>
            
            <div class="row-question">
                <div class="question-box">
                    <div style="font-size:0.7rem; font-weight:800; color:var(--text-grey); margin-bottom:5px;">O CONTRÁRIO DE:</div>
                    <div class="question-text">${desafio.pergunta}</div>
                </div>
            </div>

            <div class="row-options">
                <div class="options-grid">
                    ${opcoesAleatorias.map(opt => `
                        <button class="btn-option" onclick="validarResposta(this, '${opt}')">${opt}</button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

window.validarResposta = function(btn, escolha) {
    if (!jogoAtivo) return;
    jogoAtivo = false;

    const desafio = desafiosEmbaralhados[roundAtual - 1];
    const botoes = document.querySelectorAll('.btn-option');

    if (escolha === desafio.resposta) {
        somAcerto.play();
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        btn.style.background = "#dcfce7"; // Verde Claro
        btn.style.borderColor = "#22c55e";
        btn.style.color = "#166534";
    } else {
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        btn.style.background = "#fee2e2"; // Vermelho Claro
        btn.style.borderColor = "#ef4444";
        btn.style.color = "#991b1b";
        
        // Mostrar a correta
        botoes.forEach(b => {
            if (b.innerText.trim() === desafio.resposta) {
                b.style.background = "#dcfce7";
                b.style.borderColor = "#22c55e";
            }
        });
    }

    setTimeout(proximaRonda, 1500);
};

window.darAjuda = function() {
    if (!jogoAtivo) return;
    const desafio = desafiosEmbaralhados[roundAtual - 1];
    const botoes = document.querySelectorAll('.btn-option');
    
    contadorAjudas++;
    
    botoes.forEach(b => {
        if (b.innerText.trim() === desafio.resposta) {
            b.classList.add('correct-hint');
            setTimeout(() => b.classList.remove('correct-hint'), 2500);
        }
    });
};

function finalizarJogo() {
    somVitoria.play();
    const resScreen = document.getElementById('scr-result');
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    document.getElementById('scr-game').innerHTML = ""; 

    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <style>
            .res-inner { display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing: border-box; }
            .res-stats { display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; width:100%; max-width:400px; margin:15px 0; }
            .stat-box { background:white; border-radius:20px; padding:15px 5px; text-align:center; border:1px solid #f0f0f0; box-shadow:0 6px 15px rgba(0,0,0,0.05); }
            .stat-val { display:block; font-size:24px; font-weight:900; color:var(--primary-blue); }
            .stat-label { font-size:10px; font-weight:800; color:#88a; text-transform:uppercase; }
            .btn-res-container { display:flex; flex-direction:column; gap:15px; width:100%; max-width:320px; }
            .btn-res { display: flex; align-items: center; padding: 16px 25px; border-radius: 50px; font-weight: 900; font-size: 17px; text-transform: uppercase; cursor: pointer; border: none; text-decoration: none; transition: 0.1s; gap: 20px; }
            .btn-res i { font-size: 22px; }
            .btn-res span { flex: 1; text-align: center; margin-right: 30px; }
            .btn-novo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
            .btn-outro { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); box-shadow: 0 6px 0 var(--primary-blue); }
            .btn-sair { background: #dce4ee; color: #5d7082; box-shadow: 0 6px 0 #b8c5d4; }
            .btn-res:active { transform: translateY(3px); box-shadow: none; }
        </style>
        <div class="res-inner">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:110px; margin-bottom:15px;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:2rem; margin-bottom:10px;">${rel.titulo}</h2>
            <div class="res-stats">
                <div class="stat-box"><span class="stat-val" style="color:#7ed321;">${acertos}</span><span class="stat-label">Certos</span></div>
                <div class="stat-box"><span class="stat-val" style="color:#ff5e5e;">${erros}</span><span class="stat-label">Errados</span></div>
                <div class="stat-box"><span class="stat-val" style="color:#f59e0b;">${contadorAjudas}</span><span class="stat-label">Ajudas</span></div>
            </div>
            <div class="btn-res-container">
                <button class="btn-res btn-novo" onclick="location.reload()"><i class="fas fa-rotate-right"></i><span>Jogar de Novo</span></button>
                <button class="btn-res btn-outro" onclick="openRDMenu()"><i class="fas fa-chart-line"></i><span>Outro Nível</span></button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-sair"><i class="fas fa-right-from-bracket"></i><span>Sair</span></a>
            </div>
        </div>
    `;
    document.getElementById('status-bar').style.display = 'none';
}
