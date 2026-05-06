let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 
let paresAtuais = [];
let itemSelecionado = null; // Guarda o primeiro clique (id e tipo)
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
    return "Lê os nomes e liga-os aos números corretos. Consegues encontrar todos os pares?";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div class="tut-link-box">
            <div class="tut-card">5</div>
            <div class="tut-line"></div>
            <div class="tut-card">cinco</div>
            <div class="tut-hand">☝️</div>
        </div>
        <style>
            .tut-link-box { display: flex; align-items: center; gap: 20px; position: relative; }
            .tut-card { padding: 10px 20px; background: white; border: 2px solid #3b82f6; border-radius: 10px; font-weight: 900; color: #1e3a8a; }
            .tut-line { width: 40px; height: 4px; background: #22c55e; border-radius: 2px; }
            .tut-hand { position: absolute; font-size: 30px; animation: linkTap 3s infinite; }
            @keyframes linkTap { 0%, 100% { transform: translate(10px, 20px); } 50% { transform: translate(80px, 20px); } }
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
    paresAtuais = [];
    
    // Gerar números únicos para a ronda
    let numeros = new Set();
    while(numeros.size < config.paresPorRonda) {
        numeros.add(Math.floor(Math.random() * (config.max - config.min + 1)) + config.min);
    }
    
    const arrNumeros = [...numeros];
    const listaNumeros = arrNumeros.map(n => ({ val: n, txt: n.toString(), tipo: 'num' }));
    const listaPalavras = arrNumeros.map(n => ({ val: n, txt: numeroParaExtenso(n), tipo: 'txt' }));

    // Baralhar as listas separadamente
    paresAtuais = {
        numeros: listaNumeros.sort(() => Math.random() - 0.5),
        palavras: listaPalavras.sort(() => Math.random() - 0.5)
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
                background: #ffffff; color: #0369a1; padding: 8px 25px; border-radius: 20px; 
                font-weight: 900; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px;
                border: 4px solid #0369a1; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }

            .match-container {
                flex: 1; width: 100%; max-width: 600px; display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; align-content: center;
            }

            .column { display: flex; flex-direction: column; gap: 12px; }

            .match-card {
                background: white; border: 3px solid #e2e8f0; border-bottom: 6px solid #e2e8f0;
                padding: clamp(10px, 3vh, 20px); border-radius: 18px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                text-align: center; font-weight: 900; color: #1e3a8a;
                font-size: clamp(1.1rem, 4vw, 1.8rem); transition: all 0.2s;
                user-select: none;
            }

            .match-card.selected { border-color: #3b82f6; background: #eff6ff; transform: scale(1.05); }
            .match-card.matched { border-color: #22c55e; border-bottom-width: 3px; background: #f0fdf4; color: #166534; cursor: default; opacity: 0.8; }
            .match-card.error { animation: shakeError 0.4s; border-color: #ef4444; }

            @keyframes shakeError { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

            @media (max-width: 480px) {
                .match-container { gap: 10px; }
                .match-card { padding: 12px 5px; font-size: 1rem; border-radius: 12px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-label">${config.nome}</div>

            <div class="match-container">
                <div class="column">
                    ${paresAtuais.numeros.map(item => `
                        <div class="match-card" data-val="${item.val}" data-tipo="${item.tipo}" onclick="tentarLigar(this)">
                            ${item.txt}
                        </div>
                    `).join('')}
                </div>
                <div class="column">
                    ${paresAtuais.palavras.map(item => `
                        <div class="match-card" data-val="${item.val}" data-tipo="${item.tipo}" onclick="tentarLigar(this)">
                            ${item.txt}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function tentarLigar(el) {
    if (el.classList.contains('matched') || el.classList.contains('selected')) return;

    const val = parseInt(el.getAttribute('data-val'));
    const tipo = el.getAttribute('data-tipo');

    // Primeiro clique
    if (!itemSelecionado) {
        itemSelecionado = { val, tipo, el };
        el.classList.add('selected');
        return;
    }

    // Segundo clique no mesmo tipo (ex: clicou em dois números) -> Troca a seleção
    if (itemSelecionado.tipo === tipo) {
        itemSelecionado.el.classList.remove('selected');
        itemSelecionado = { val, tipo, el };
        el.classList.add('selected');
        return;
    }

    // Tentativa de Par
    if (itemSelecionado.val === val) {
        // ACERTO
        el.classList.add('matched');
        itemSelecionado.el.classList.remove('selected');
        itemSelecionado.el.classList.add('matched');
        itemSelecionado = null;
        paresResolvidos++;
        
        // Verifica se completou a ronda
        const totalPares = JOGO_CATEGORIAS[categoriaAtual].paresPorRonda;
        if (paresResolvidos === totalPares) {
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
        
        const tempEl = itemSelecionado.el;
        itemSelecionado = null;
        
        setTimeout(() => {
            el.classList.remove('error', 'selected');
            tempEl.classList.remove('error', 'selected');
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
                <button style="padding:16px; border-radius:22px; font-weight:900; background:var(--primary-blue); color:white; border:none; cursor:pointer; box-shadow:0 6px 0 var(--primary-dark);" onclick="location.reload()">Jogar de Novo</button>
                <button style="padding:14px; border-radius:22px; font-weight:900; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); cursor:pointer; box-shadow:0 6px 0 var(--primary-blue);" onclick="openRDMenu()">Outro Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="padding:16px; border-radius:22px; font-weight:900; background:#dce4ee; color:#5d7082; border:none; text-align:center; text-decoration:none; box-shadow:0 6px 0 #b8c5d4;">Sair</a>
            </div>
        </div>
    `;
    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
