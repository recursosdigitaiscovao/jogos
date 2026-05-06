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
    return "Lê os nomes dos números e liga-os corretamente!";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; gap:15px; align-items:center; position:relative;">
            <div style="padding:10px; background:white; border:3px solid #45cfa8; border-radius:10px; font-weight:900; color:#2BA886;">4</div>
            <div id="tut-hand" style="position:absolute; font-size:35px; animation: moveTut 3s infinite; z-index:10;">☝️</div>
            <div style="padding:10px; background:white; border:3px solid #45cfa8; border-radius:10px; font-weight:900; color:#2BA886;">quatro</div>
        </div>
        <style> @keyframes moveTut { 0%, 100% { transform: translate(0, 10px); } 50% { transform: translate(50px, 10px); } } </style>
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
    while(numeros.size < 4) { // Fixado em 4 pares
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
            .game-wrapper { 
                display:flex; flex-direction:column; width:100%; height:100%; 
                align-items:center; justify-content: flex-start;
                padding: 10px 10px 15px; box-sizing: border-box; position: relative; 
            }
            
            .category-label {
                background: white; color: #2BA886; padding: 8px 25px; border-radius: 40px; 
                font-weight: 900; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.2px;
                border: 3px solid #2BA886; box-shadow: 0 4px 10px rgba(43,168,134,0.15); 
                margin-bottom: 10px; flex-shrink: 0;
            }

            .match-grid {
                flex: 1; width: 100%; max-width: 650px; display: grid; 
                grid-template-columns: 1fr 1.8fr; 
                gap: 25px; /* MAIOR ESPAÇO ENTRE AS DUAS COLUNAS */
                align-items: center; align-content: center;
            }

            .match-column { 
                display: flex; flex-direction: column; 
                gap: 15px; /* MAIOR ESPAÇO VERTICAL ENTRE CARTÕES */
            }

            .card-btn {
                background: linear-gradient(145deg, #ffffff, #f0fdfa);
                border: 2px solid #e2e8f0; border-bottom: 5px solid #cbd5e1;
                padding: clamp(12px, 3vh, 25px); /* MAIOR PADDING INTERNO */
                border-radius: 20px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                text-align: center; font-weight: 900; color: #334155;
                font-size: clamp(1.1rem, 4vw, 1.6rem); transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
            }

            /* ESTADO SELECIONADO */
            .card-btn.selected { 
                border-color: #45cfa8; background: #e8f9f4; color: #2BA886; 
                transform: scale(1.05); box-shadow: 0 10px 20px rgba(69,207,168,0.25);
                border-bottom-width: 3px; margin-top: 2px;
            }

            /* ACERTO (CARIMBO VERDE CLARO) */
            .card-btn.matched { 
                background: #dcfce7 !important; border-color: #22c55e !important; color: #166534 !important; 
                box-shadow: 0 3px 0 #22c55e !important; cursor: default;
                animation: popSuccess 0.4s forwards; transform: scale(0.98);
            }

            @keyframes popSuccess { 0% { transform: scale(0.98); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }

            /* ERRO */
            .card-btn.error { border-color: #ff5e5e; background: #fee2e2; animation: shake 0.4s; }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }

            .particle {
                position: absolute; width: 7px; height: 7px; background: #22c55e; border-radius: 50%;
                pointer-events: none; z-index: 100; animation: pOut 0.7s ease-out forwards;
            }
            @keyframes pOut { from { transform: scale(1); opacity: 1; } to { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; } }

            @media (max-width: 480px) {
                .match-grid { gap: 15px; } /* Ajuste mobile */
                .match-column { gap: 12px; }
                .card-btn { padding: 15px 5px; font-size: 1rem; border-radius: 15px; }
            }
        </style>

        <div class="game-wrapper" id="game-area">
            <div class="category-label">${config.nome}</div>

            <div class="match-grid">
                <div class="match-column">
                    ${paresAtuais.numeros.map(item => `
                        <div class="card-btn" data-val="${item.val}" data-tipo="${item.tipo}" onclick="tentarMatch(this)">
                            ${item.txt}
                        </div>
                    `).join('')}
                </div>
                <div class="match-column">
                    ${paresAtuais.palavras.map(item => `
                        <div class="card-btn" data-val="${item.val}" data-tipo="${item.tipo}" onclick="tentarMatch(this)">
                            ${item.txt}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function criarParticulas(x, y) {
    const area = document.getElementById('game-area');
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`);
        p.style.setProperty('--y', `${(Math.random() - 0.5) * 100}px`);
        p.style.left = `${x}px`; p.style.top = `${y}px`;
        area.appendChild(p);
        setTimeout(() => p.remove(), 700);
    }
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
        const r1 = el.getBoundingClientRect();
        const r2 = itemSelecionado.el.getBoundingClientRect();
        criarParticulas(r1.left + r1.width/2, r1.top + r1.height/2);
        criarParticulas(r2.left + r2.width/2, r2.top + r2.height/2);

        el.classList.add('matched');
        itemSelecionado.el.classList.remove('selected');
        itemSelecionado.el.classList.add('matched');
        itemSelecionado = null;
        paresResolvidos++;
        
        if (paresResolvidos === 4) {
            somAcerto.play();
            acertos++;
            document.getElementById('hits-val').innerText = acertos;
            setTimeout(() => { indicePergunta++; proximaRonda(); }, 1200);
        }
    } else {
        // ERRO
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
        el.classList.add('error');
        itemSelecionado.el.classList.add('error');
        const prev = itemSelecionado.el;
        itemSelecionado = null;
        setTimeout(() => {
            el.classList.remove('error', 'selected');
            prev.classList.remove('error', 'selected');
        }, 500);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:110px; margin-bottom:15px; filter: drop-shadow(0 8px 15px rgba(43,168,134,0.3));">
            <h2 style="color:#2BA886; font-weight:900; font-size:1.8rem; margin-bottom:15px; text-align:center;">${rel.titulo}</h2>
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4;">
                    <span style="display:block; font-size:26px; font-weight:900; color:#2BA886;">${acertos}/10</span>
                    <span style="font-size:10px; color:#88a; text-transform:uppercase; font-weight:800;">Acertos</span>
                </div>
                <div style="background:white; border-radius:20px; padding:15px; flex:1; text-align:center; border:2px solid #e8f9f4;">
                    <span style="display:block; font-size:26px; font-weight:900; color:#2BA886;">${tempo}</span>
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
