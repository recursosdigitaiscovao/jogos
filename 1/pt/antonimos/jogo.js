let selectedSyllables = [];
let discoveredWords = []; 
let roundAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;
let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Puzzle de Sílabas: Quantas palavras consegues formar?";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:1.2rem;">COMO JOGAR</div>
            <div style="display:flex; gap:10px; background:white; padding:20px; border-radius:20px; border:4px solid #0891b2;">
                <div style="width:50px; height:50px; background:#f0f9ff; border:2px solid #0891b2; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900;">MA</div>
                <div style="width:50px; height:50px; border:3px dashed #cbd5e1; border-radius:10px;"></div>
            </div>
            <div style="font-size:40px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px); } } </style>
    `;
}

window.initGame = function() {
    discoveredWords = [];
    roundAtual = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    iniciarCronometro();
    proximaRondaFabrica();
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

function proximaRondaFabrica() {
    roundAtual++;
    if (roundAtual > 10) { finalizarFabrica(); return; }
    document.getElementById('round-val').innerText = `${roundAtual} / 10`;
    selectedSyllables = [];
    renderizarEcraFabrica();
}

// === FUNÇÃO DE AJUDA ===
window.darAjuda = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];
    
    // 1. Procurar no dicionário palavras que usem APENAS as sílabas do banco atual e tenham o tamanho certo
    const palavrasPossiveis = DICIONARIO_MESTRE.filter(palavra => {
        if (palavra.length !== desafio.slots * 2 && desafio.slots > 0) {
            // Verificação simples por número de sílabas (assumindo que cada sílaba tem 2 letras nos exemplos)
            // Se as tuas sílabas variarem de tamanho, esta lógica precisará de um ajuste fino.
        }
        
        // Verifica se a palavra pode ser construída com o banco desta ronda
        let silabasDaPalavra = [];
        for(let i=0; i<palavra.length; i+=2) silabasDaPalavra.push(palavra.substr(i,2));
        
        return silabasDaPalavra.every(s => desafio.bank.includes(s)) && 
               silabasDaPalavra.length === desafio.slots &&
               !discoveredWords.includes(palavra);
    });

    if (palavrasPossiveis.length > 0) {
        // Escolhe a primeira palavra da lista de sugestões
        const sugestao = palavrasPossiveis[0];
        const primeiraSilaba = sugestao.substr(0, 2);
        
        // Limpa o que o user fez e coloca a primeira peça
        selectedSyllables = [primeiraSilaba];
        atualizarMoldes();
        
        // Efeito visual de brilho na lâmpada
        const btn = document.getElementById('help-btn');
        btn.style.transform = "scale(1.3)";
        setTimeout(() => btn.style.transform = "scale(1)", 300);
    }
}

function renderizarEcraFabrica() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const desafio = config.desafios[roundAtual - 1];

    container.innerHTML = `
        <style>
            .factory-wrapper { display: flex; flex-direction: column; width: 100%; min-height: 100%; align-items: center; justify-content: space-between; padding: 15px; box-sizing: border-box; }
            .station { 
                display: flex; gap: 10px; justify-content: center; align-items: center; 
                background: #f0f9ff; border: 3px dashed #0891b2; padding: 15px; border-radius: 25px;
                min-height: 100px; width: 100%; max-width: 400px;
            }
            .mold {
                width: 70px; height: 70px; background: white; border: 3px dashed #cbd5e1; border-radius: 15px;
                display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 950; color: #0891b2;
            }
            .mold.filled { border: 3px solid #0891b2; animation: popIn 0.3s; }
            .btn-row { display: flex; gap: 12px; margin-top: 10px; }
            .btn-f { padding: 12px 25px; border-radius: 15px; font-weight: 800; border: none; cursor: pointer; font-size: 0.9rem; }
            .btn-mount { background: #0ea5e9; color: white; box-shadow: 0 5px 0 #0369a1; }
            .btn-clear { background: #94a3b8; color: white; box-shadow: 0 5px 0 #64748b; }
            .bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 15px 0; width: 100%; }
            .pill { 
                background: white; border: 3px solid #0891b2; color: #164e63; border-radius: 18px; 
                padding: 12px; min-width: 80px; font-size: 1.2rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 0 #0e7490;
            }
            .warehouse { width: 100%; max-width: 500px; background: rgba(255,255,255,0.7); border-radius: 20px; padding: 10px; border: 1px solid #eee; min-height: 60px; }
            
            /* PALAVRAS DESCOBERTAS - PEQUENAS E SEM FUNDO AZUL */
            .tag { color: #5d7082; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; border-bottom: 2px solid #ddd; padding: 2px 5px; }

            @media screen and (max-height: 500px) {
                .factory-wrapper { height: auto; gap: 15px; padding: 10px; }
                .station { min-height: 80px; }
                .mold { width: 55px; height: 55px; font-size: 1.2rem; }
                .pill { padding: 8px; min-width: 65px; font-size: 1rem; }
            }
            @keyframes popIn { from { transform: scale(0.5); } to { transform: scale(1); } }
        </style>
        <div class="factory-wrapper">
            <div class="station" id="molds-area"></div>
            <div class="btn-row">
                <button class="btn-f btn-mount" onclick="validarProducao()">MONTAR</button>
                <button class="btn-f btn-clear" onclick="limparProducao()">LIMPAR</button>
            </div>
            <div class="bank">
                ${desafio.bank.map(s => `<button class="pill" onclick="clicarSilaba('${s}')">${s}</button>`).join('')}
            </div>
            <div class="warehouse">
                <div style="font-size:0.55rem; font-weight:900; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">Palavras Criadas:</div>
                <div id="history-list" style="display:flex; flex-wrap:wrap; gap:10px;">
                    ${discoveredWords.map(p => `<span class="tag">${p}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    atualizarMoldes();
}

function atualizarMoldes() {
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    const area = document.getElementById('molds-area');
    area.innerHTML = "";
    for (let i = 0; i < desafio.slots; i++) {
        const m = document.createElement('div');
        m.className = "mold " + (selectedSyllables[i] ? "filled" : "");
        m.innerText = selectedSyllables[i] || "";
        area.appendChild(m);
    }
}

window.clicarSilaba = function(s) {
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) {
        selectedSyllables.push(s);
        atualizarMoldes();
    }
};

window.limparProducao = function() {
    selectedSyllables = [];
    atualizarMoldes();
};

window.validarProducao = function() {
    const desafio = JOGO_CATEGORIAS[categoriaAtual].desafios[roundAtual - 1];
    if (selectedSyllables.length < desafio.slots) return;
    const palavra = selectedSyllables.join('');

    if (discoveredWords.includes(palavra)) {
        somErro.play();
        feedbackEstacao("#f59e0b", "REPETIDA!");
    } else if (DICIONARIO_MESTRE.includes(palavra)) {
        somAcerto.play();
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        discoveredWords.push(palavra);
        feedbackEstacao("#10b981", "CERTO!");
    } else {
        somErro.play();
        feedbackEstacao("#ef4444", "ERRO!");
    }
    setTimeout(proximaRondaFabrica, 1200);
};

function feedbackEstacao(color, txt) {
    const area = document.getElementById('molds-area');
    area.innerHTML = `<span style="color:${color}; font-weight:950; font-size:1.5rem; animation: popIn 0.3s;">${txt}</span>`;
    document.querySelectorAll('.pill').forEach(b => b.style.pointerEvents = 'none');
}

function finalizarFabrica() {
    clearInterval(intervaloTempo);
    somVitoria.play();
    
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; padding:20px; text-align:center;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:15px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; margin-bottom:10px;">${rel.titulo}</h2>
            
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos} / 10</span>
                    <span style="font-size:11px; font-weight:800; color:#88a;">ACERTOS</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:11px; font-weight:800; color:#88a;">TEMPO</span>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark);" 
                    onclick="location.reload()">JOGAR DE NOVO</button>
                
                <button style="padding:14px; border-radius:22px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 4px 0 var(--primary-blue);" 
                    onclick="openRDMenu()">OUTRO NÍVEL</button>
                
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:22px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4;">SAIR</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
