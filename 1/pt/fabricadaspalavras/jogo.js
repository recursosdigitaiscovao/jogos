let listaPalavrasRonda = [];
let indicePalavraAtiva = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 
let silabaCorreta = "";
let indiceSilabaFaltante = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Bem-vindo à Fábrica! Lê a palavra e descobre qual é a sílaba que falta.";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:1.2rem; text-transform:uppercase;">Como Jogar</div>
            <div style="border:4px solid var(--primary-blue); border-radius:25px; padding:30px; background:white; text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.1); width:220px;">
                <div style="font-size:1.8rem; font-weight:900; letter-spacing:5px; color:var(--text-grey);">
                    PA - <span style="border-bottom:4px solid var(--primary-blue); color:transparent;">TO</span>
                </div>
            </div>
            <div id="tut-hand" style="font-size:45px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px) scale(0.9); } } </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    listaPalavrasRonda = [...config.palavras].sort(() => Math.random() - 0.5).slice(0, 10);
    
    indicePalavraAtiva = 0;
    acertos = 0;
    erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    
    iniciarCronometro();
    mostrarPalavra();
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

function mostrarPalavra() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const palavraObj = listaPalavrasRonda[indicePalavraAtiva];
    
    document.getElementById('round-val').innerText = `${indicePalavraAtiva + 1} / ${listaPalavrasRonda.length}`;

    // Escolher aleatoriamente qual sílaba vai faltar
    indiceSilabaFaltante = Math.floor(Math.random() * palavraObj.silabas.length);
    silabaCorreta = palavraObj.silabas[indiceSilabaFaltante];

    let htmlPalavra = "";
    palavraObj.silabas.forEach((s, i) => {
        if (i === indiceSilabaFaltante) {
            htmlPalavra += `<span class="syl-slot" id="target-slot"></span>`;
        } else {
            htmlPalavra += `<span class="syl-text">${s}</span>`;
        }
        if (i < palavraObj.silabas.length - 1) htmlPalavra += " - ";
    });

    // Gerar opções de sílabas
    const todasSilabas = ["BA", "CA", "PA", "TO", "SA", "LA", "ME", "BO", "NE", "DA", "RE", "VA", "CO", "MA", "LI"];
    let opcoes = [silabaCorreta];
    while(opcoes.length < 6) {
        let r = todasSilabas[Math.floor(Math.random() * todasSilabas.length)];
        if(!opcoes.includes(r)) opcoes.push(r);
    }
    opcoes.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; padding:15px; box-sizing:border-box; gap:20px; }
            
            .factory-card { 
                background:white; border:4px solid var(--primary-blue); border-radius:30px; 
                width:100%; max-width:500px; padding: 60px 20px;
                display:flex; align-items:center; justify-content:center;
                box-shadow: 0 15px 35px rgba(0,0,0,0.08);
                animation: popCard 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .word-display { 
                font-weight:900; font-size: 2.8rem; font-family: 'Fredoka', sans-serif; 
                color: var(--text-grey); display:flex; align-items:center; gap:10px;
            }
            
            .syl-slot { 
                display:inline-block; min-width:90px; height: 65px;
                border-bottom: 6px solid var(--primary-blue); 
                color: var(--primary-blue); margin: 0 5px; text-align:center;
            }

            .keyboard-grid { 
                display:grid; grid-template-columns: repeat(3, 1fr); 
                gap:12px; width:100%; max-width:500px; margin-top:auto; padding-bottom:20px; 
            }
            
            .syl-key { 
                background:white; border:2px solid #e2e8f0; border-radius:15px; padding:18px; 
                font-weight:900; font-size:1.4rem; cursor:pointer; box-shadow:0 6px 0 #cbd5e1; 
                text-align:center; transition:0.1s; color: var(--text-grey);
            }
            .syl-key:active { transform:translateY(3px); box-shadow:0 2px 0 #cbd5e1; }
            
            @keyframes popCard { from { transform: scale(0.9); opacity:0; } to { transform: scale(1); opacity:1; } }
            @keyframes shake { 0%, 100% { transform:translateX(0); } 25% { transform:translateX(-10px); } 75% { transform:translateX(10px); } }

            @media (max-width: 480px) {
                .factory-card { padding: 40px 10px; }
                .word-display { font-size: 1.8rem; }
                .syl-slot { min-width: 65px; height: 45px; border-bottom-width: 4px; }
                .syl-key { padding: 15px; font-size: 1.2rem; }
            }
        </style>

        <div class="game-wrapper">
            <div style="background:var(--primary-blue); color:white; padding:5px 20px; border-radius:20px; font-weight:900; font-size:0.8rem; text-transform:uppercase;">${config.nome}</div>

            <div class="factory-card" id="active-card">
                <div class="word-display">${htmlPalavra}</div>
            </div>

            <div class="keyboard-grid">
                ${opcoes.map(s => `<button class="syl-key" onclick="verificarSílaba('${s}', this)">${s}</button>`).join('')}
            </div>
        </div>
    `;
}

function verificarSílaba(escolha, btn) {
    const card = document.getElementById('active-card');
    const slot = document.getElementById('target-slot');

    if (escolha === silabaCorreta) {
        somAcerto.play();
        slot.innerText = escolha;
        slot.style.borderBottomColor = "#10b981";
        slot.style.color = "#10b981";
        
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        
        document.querySelectorAll('.syl-key').forEach(b => b.style.pointerEvents = 'none');

        setTimeout(() => {
            if (indicePalavraAtiva < listaPalavrasRonda.length - 1) {
                indicePalavraAtiva++;
                mostrarPalavra();
            } else {
                finalizarJogo();
            }
        }, 1000);
    } else {
        erros++;
        document.getElementById('miss-val').innerText = erros;
        somErro.play();
        btn.style.borderColor = "#ef4444";
        btn.style.color = "#ef4444";
        card.style.animation = "none";
        setTimeout(() => card.style.animation = "shake 0.3s", 10);
        setTimeout(() => {
            btn.style.borderColor = "#e2e8f0";
            btn.style.color = "var(--text-grey)";
        }, 600);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo);
    somVitoria.play();
    const perc = (acertos / listaPalavrasRonda.length) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:15px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${acertos}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${tempo}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; max-width:280px;">
                <button style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark); text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:14px; border-radius:20px; font-weight:900; font-size:16px; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue); text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:20px; font-weight:900; font-size:16px; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
