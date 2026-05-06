let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 
let paresAtuais = [];
let itemSelecionado = null; 
let paresResolvidos = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// Auxiliar: Converter número para extenso (PT-PT)
function numeroParaExtenso(n) {
    const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const especiais = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezasseis', 'dezassete', 'dezoito', 'dezanove'];
    const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa', 'cem'];
    if (n === 0) return 'zero';
    if (n === 100) return 'cem';
    if (n < 10) return unidades[n];
    if (n >= 10 && n < 20) return especiais[n - 10];
    const u = n % 10;
    const d = Math.floor(n / 10);
    return u === 0 ? dezenas[d] : dezenas[d] + ' e ' + unidades[u];
}

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Lê com atenção e liga cada número ao seu nome correto!";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div class="tut-container">
            <div class="tut-item" style="border-color:#45cfa8">7</div>
            <div class="tut-hand">☝️</div>
            <div class="tut-item" style="border-color:#45cfa8">sete</div>
        </div>
        <style>
            .tut-container { display:flex; gap:30px; align-items:center; position:relative; }
            .tut-item { padding:10px 20px; background:white; border:3px solid; border-radius:12px; font-weight:900; color:#2BA886; }
            .tut-hand { position:absolute; font-size:35px; animation: moveH 3s infinite; z-index:5; }
            @keyframes moveH { 0%, 100% { transform: translate(10px, 20px); } 50% { transform: translate(100px, 20px); } }
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
    itemSelecionado = null;
    paresResolvidos = 0;
    
    let numeros = new Set();
    while(numeros.size < config.paresPorRonda) {
        numeros.add(Math.floor(Math.random() * (config.max - config.min + 1)) + config.min);
    }
    
    const arr = [...numeros];
    paresAtuais = {
        numeros: arr.map(n => ({ val: n, txt: n.toString(), tipo: 'num' })).sort(() => Math.random() - 0.5),
        palavras: arr.map(n => ({ val: n, txt: numeroParaExtenso(n), tipo: 'txt' })).sort(() => Math.random() - 0.5)
    };
    mostrarPergunta();
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; justify-content:space-between; padding: 15px 10px; box-sizing: border-box; }
            
            .category-label {
                background: #ffffff; color: #2BA886; padding: 10px 30px; border-radius: 40px; 
                font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px;
                border: 4px solid #2BA886; box-shadow: 0 6px 15px rgba(43,168,134,0.2); margin-bottom: 15px;
            }

            .match-grid {
                flex: 1; width: 100%; max-width: 700px; display: grid; grid-template-columns: 1fr 1.6fr; gap: 15px; align-content: center;
            }

            .match-column { display: flex; flex-direction: column; gap: 10px; }

            .card-btn {
                background: white; border: 3px solid #e2e8f0; border-bottom: 6px solid #cbd5e1;
                padding: clamp(12px, 3vh, 22px); border-radius: 20px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                text-align: center; font-weight: 900; color: #2D3748;
                font-size: clamp(1.1rem, 3.5vw, 1.7rem); transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                animation: slideCard 0.4s backwards;
            }

            @keyframes slideCard { from { opacity:0; transform: translateX(-20px); } to { opacity:1; transform: translateX(0); } }

            /* ESTADO: SELECIONADO */
            .card-btn.selected { 
                border-color: #45cfa8; background: #e8f9f4; color: #2BA886; 
                transform: scale(1.03); box-shadow: 0 0 20px rgba(69,207,168,0.3);
                border-bottom-width: 3px; margin-top: 3px;
            }

            /* ESTADO: CORRETO */
            .card-btn.matched { 
                background: #2BA886; border-color: #1f7a63; color: white; 
                box-shadow: 0 4px 0 #1f7a63; cursor: default;
                animation: bounceMatched 0.5s;
            }
            @keyframes bounceMatched { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }

            /* ESTADO: ERRO */
            .card-btn.error { border-color: #ff5e5e; background: #fff1f1; animation: shake 0.4s; }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }

            @media (max-width: 480px) {
                .match-grid { gap: 10px; }
                .card-btn { padding: 15px 8px; font-size: 1rem; border-radius: 15px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="match-grid">
                <div class="match-column">
                    ${paresAtuais.numeros.map((item, i) => `
                        <div class="card-btn" style="animation-delay: ${i*0.1}s" data-val="${item.val}" data-tipo="${item.tipo}" onclick="tentarMatch(this)">
                            ${item.txt}
                        </div>
                    `).join('')}
                </div>
                <div class="match-column">
                    ${paresAtuais.palavras.map((item, i) => `
                        <div class="card-btn" style="animation-delay: ${(i+2)*0.1}s" data-val="${item.val}" data-tipo="${item.tipo}" onclick="tentarMatch(this)">
                            ${item.txt}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function tentarMatch(el) {
    if (el.classList.contains('matched') || el.classList.contains('selected')) return;

    const val = parseInt(el.getAttribute('data-val'));
    const tipo = el.getAttribute('data-tipo');

    if (!itemSelecionado) {
        itemSelecionado = { val, tipo, el };
        el.classList.add('selected');
        return;
    }

    if (itemSelecionado.tipo === tipo) {
        itemSelecionado.el.classList.remove('selected');
        itemSelecionado = { val, tipo, el };
        el.classList.add('selected');
        return;
    }

    if (itemSelecionado.val === val) {
        // ACERTO
        el.classList.add('matched');
        itemSelecionado.el.classList.remove('selected');
        itemSelecionado.el.classList.add('matched');
        itemSelecionado = null;
        paresResolvidos++;
        
        if (paresResolvidos === JOGO_CATEGORIAS[categoriaAtual].paresPorRonda) {
            somAcerto.play();
            acertos++;
            document.getElementById('hits-val').innerText = acertos;
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 1000);
        }
    } else {
        // ERRO
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        el.classList.add('error');
        itemSelecionado.el.classList.add('error');
        const prevEl = itemSelecionado.el;
        itemSelecionado = null;
        setTimeout(() => {
            el.classList.remove('error', 'selected');
            prevEl.classList.remove('error', 'selected');
        }, 500);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:110px; margin-bottom:15px; filter: drop-shadow(0 8px 15px rgba(43,168,134,0.3));">
            <h2 style="color:#2BA886; font-weight:900; font-size:1.8rem; margin-bottom:15px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <span style="display:block; font-size:26px; font-weight:900; color:#2BA886;">${acertos}/10</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase; font-weight:800;">Acertos</span>
                </div>
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <span style="display:block; font-size:26px; font-weight:900; color:#2BA886;">${tempoFinal}</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase; font-weight:800;">Tempo</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:280px;">
                <button style="padding:18px; border-radius:22px; font-weight:900; background:#45cfa8; color:white; border:none; cursor:pointer; box-shadow:0 6px 0 #2BA886; text-transform:uppercase;" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:15px; border-radius:22px; font-weight:900; background:white; color:#45cfa8; border:3px solid #45cfa8; cursor:pointer; box-shadow:0 6px 0 #45cfa8; text-transform:uppercase;" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:18px; border-radius:22px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4; text-transform:uppercase;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
