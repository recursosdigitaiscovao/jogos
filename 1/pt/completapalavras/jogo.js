let perguntas = [];
let indicePalavraAtiva = 0;
let palavrasConcluidas = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// Auxiliar para identificar vogais (incluindo acentuadas e nasais)
function eVogal(letra) {
    return "AEIOUÃÕÁÉÍÓÚÂÊÔ".includes(letra.toUpperCase());
}

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Completa as palavras com as letras que faltam! Presta atenção ao nível.";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:1.2rem; text-transform:uppercase;">COMO JOGAR</div>
            <div style="border:4px solid var(--primary-blue); border-radius:20px; padding:20px; background:white; text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.1); width:200px;">
                <div style="font-size:3.5rem; margin-bottom:10px;">🐱</div>
                <div style="font-family:monospace; font-size:1.8rem; font-weight:900; letter-spacing:8px; color:var(--text-grey);">
                    G<span style="border-bottom:4px solid var(--primary-blue); color:transparent;">A</span>T<span style="border-bottom:4px solid var(--primary-blue); color:transparent;">O</span>
                </div>
            </div>
            <div id="tut-hand" style="font-size:45px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> 
            @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px) scale(0.9); } } 
        </style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePalavraAtiva = 0;
    palavrasConcluidas = 0;
    acertos = 0;
    erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    montarCenario();
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

function montarCenario() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtual];
    document.getElementById('round-val').innerText = `${palavrasConcluidas + 1} / ${config.palavras.length}`;

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; padding:10px; box-sizing:border-box; gap:10px; }
            
            .category-tag { background:white; color:var(--primary-blue); padding:5px 20px; border-radius:30px; font-weight:900; font-size:0.8rem; border:2px solid var(--primary-blue); text-transform:uppercase; margin-bottom:5px; }

            .grid-container { display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; width:100%; max-width:650px; flex: 1; align-content: center; }
            
            .word-card { background:white; border:3px solid #cbd5e1; border-radius:20px; overflow:hidden; transition: 0.3s; position:relative; display:flex; flex-direction:column; }
            .word-card.active { border-color: var(--primary-blue); box-shadow: 0 0 20px rgba(91, 164, 229, 0.3); transform: scale(1.03); z-index:10; }
            .word-card.completed { opacity: 0.6; background: #f8fafc; border-color: #94a3b8; }
            
            .card-header { height: 90px; display:flex; align-items:center; justify-content:center; background:#f1f5f9; padding:10px; }
            .card-header img { max-height: 100%; max-width: 100%; object-fit: contain; }
            
            .card-body { border-top: 2px solid #e2e8f0; padding: 12px 5px; text-align:center; font-weight:900; font-size:1.4rem; font-family: 'Fredoka', sans-serif; letter-spacing: 3px; color: var(--text-grey); background:white; }
            
            .letter-slot { display:inline-block; width:22px; border-bottom: 4px solid var(--primary-blue); color: var(--primary-blue); margin: 0 2px; min-height: 30px; vertical-align: middle; }
            
            .keyboard-area { display:flex; flex-wrap:wrap; justify-content:center; gap:5px; width:100%; max-width:700px; padding: 10px 0; margin-top:auto; }
            .key-btn { background:white; border:2px solid #e2e8f0; border-radius:12px; padding:14px; font-weight:900; font-size:1.1rem; cursor:pointer; box-shadow:0 4px 0 #cbd5e1; flex: 1 1 45px; min-width: 45px; text-align:center; transition:0.1s; }
            .key-btn:active { transform:translateY(2px); box-shadow:0 2px 0 #cbd5e1; }
            
            @media (max-width: 480px) {
                .grid-container { gap: 8px; }
                .card-header { height: 70px; }
                .card-body { font-size: 1.1rem; letter-spacing: 2px; }
                .letter-slot { width: 16px; }
                .key-btn { padding: 10px; font-size: 0.9rem; flex: 1 1 38px; min-width: 38px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="category-tag">${config.nome}</div>

            <div class="grid-container">
                ${config.palavras.map((p, i) => {
                    let htmlPalavra = "";
                    const termo = p.termo;
                    
                    for(let l=0; l < termo.length; l++) {
                        const char = termo[l];
                        let deveEsconder = false;

                        // Lógica de escuridão baseada na categoria
                        if (config.tipoLacuna === "vogais") {
                            deveEsconder = eVogal(char);
                        } else if (config.tipoLacuna === "consoantes") {
                            deveEsconder = !eVogal(char) && char !== " ";
                        } else {
                            // Mista: esconde posições pares para criar um desafio variado
                            deveEsconder = (l % 2 !== 0);
                        }

                        if (deveEsconder) htmlPalavra += `<span class="letter-slot" id="slot-${i}-${l}"></span>`;
                        else htmlPalavra += char;
                    }
                    
                    return `
                        <div class="word-card ${i === 0 ? 'active' : ''}" id="card-${i}">
                            <div class="card-header"><img src="${JOGO_CONFIG.caminhoImg}${p.img}"></div>
                            <div class="card-body">${htmlPalavra}</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="keyboard-area">
                ${"ABCDEFGHIJKLM NOPQRSTUVWXYZÃÕÁÉ".split("").map(letra => {
                    if(letra === " ") return '<div style="width:100%; height:0"></div>';
                    return `<button class="key-btn" onclick="pressionarTecla('${letra}')">${letra}</button>`;
                }).join('')}
            </div>
        </div>
    `;
}

function pressionarTecla(letra) {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const termoCorreto = config.palavras[indicePalavraAtiva].termo;
    const slots = document.querySelectorAll(`#card-${indicePalavraAtiva} .letter-slot`);
    
    let acertouLetra = false;

    // Procura o primeiro slot vazio no card ativo
    for (let slot of slots) {
        if (slot.innerText === "") {
            const indexNoTermo = parseInt(slot.id.split('-')[2]);
            const charCorreto = termoCorreto[indexNoTermo];

            if (charCorreto === letra) {
                slot.innerText = letra;
                slot.style.borderBottomColor = "#10b981";
                acertouLetra = true;
                somAcerto.play();
            } else {
                erros++;
                document.getElementById('miss-val').innerText = erros;
                somErro.play();
                slot.style.borderBottomColor = "#ef4444";
                // Shake effect simples
                slot.parentElement.style.animation = "shake 0.3s";
                setTimeout(() => { 
                    slot.style.borderBottomColor = "var(--primary-blue)"; 
                    slot.parentElement.style.animation = "";
                }, 400);
            }
            break; 
        }
    }

    // Verifica se completou o card
    const vazios = Array.from(slots).filter(s => s.innerText === "");
    if (vazios.length === 0 && acertouLetra) {
        const card = document.getElementById(`card-${indicePalavraAtiva}`);
        card.classList.remove('active');
        card.classList.add('completed');
        
        palavrasConcluidas++;
        acertos++; // Cada card vale 1 acerto mestre
        document.getElementById('hits-val').innerText = acertos;

        if (palavrasConcluidas < config.palavras.length) {
            indicePalavraAtiva++;
            document.getElementById(`card-${indicePalavraAtiva}`).classList.add('active');
            document.getElementById('round-val').innerText = `${palavrasConcluidas + 1} / ${config.palavras.length}`;
        } else {
            setTimeout(finalizarJogo, 800);
        }
    }
}

function finalizarJogo() {
    clearInterval(intervaloTempo);
    somVitoria.play();
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const rel = JOGO_CONFIG.relatorios.find(r => (acertos * 10) >= r.min && (acertos * 10) <= r.max);
    const tempo = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');
    
    resScreen.className = "screen screen-box active"; 
    resScreen.innerHTML = `
        <div class="res-inner" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:20px; box-sizing:border-box;">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:100px; margin-bottom:15px; object-fit:contain;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.8rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            
            <div class="res-stats" style="display:flex; gap:12px; width:100%; max-width:320px; margin:15px 0;">
                <div style="background:white; border-radius:18px; padding:15px; flex:1; text-align:center; border:1px solid #f0f0f0; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${palavrasConcluidas}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Palavras</span>
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
