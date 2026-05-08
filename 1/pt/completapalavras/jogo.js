let listaPalavrasRonda = [];
let indicePalavraAtiva = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;

let categoriaAtual = "Nível 1"; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

function eVogal(letra) {
    return "AEIOUÃÕÁÉÍÓÚÂÊÔ".includes(letra.toUpperCase());
}

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Completa a palavra que aparece no ecrã! Descobre as letras que faltam.";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="font-weight:900; color:var(--primary-blue); font-size:1.2rem; text-transform:uppercase;">COMO JOGAR</div>
            <div style="border:4px solid var(--primary-blue); border-radius:20px; padding:20px; background:white; text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.1); width:180px;">
                <div style="font-size:3rem; margin-bottom:10px;">🐮</div>
                <div style="font-family:monospace; font-size:1.5rem; font-weight:900; letter-spacing:6px; color:var(--text-grey);">
                    V<span style="border-bottom:4px solid var(--primary-blue); color:transparent;">A</span>C<span style="border-bottom:4px solid var(--primary-blue); color:transparent;">A</span>
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
    // Embaralhar e pegar no máximo 10 palavras para a ronda
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

    let htmlPalavra = "";
    for(let l=0; l < palavraObj.termo.length; l++) {
        const char = palavraObj.termo[l];
        let deveEsconder = false;

        if (config.tipoLacuna === "vogais") deveEsconder = eVogal(char);
        else if (config.tipoLacuna === "consoantes") deveEsconder = !eVogal(char) && char !== " ";
        else deveEsconder = (l % 2 !== 0);

        if (deveEsconder) htmlPalavra += `<span class="letter-slot" id="slot-${l}"></span>`;
        else htmlPalavra += char;
    }

    container.innerHTML = `
        <style>
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; padding:15px; box-sizing:border-box; gap:20px; }
            
            .word-card-solo { 
                background:white; border:4px solid var(--primary-blue); border-radius:30px; 
                width:100%; max-width:400px; overflow:hidden; transition: 0.5s;
                display:flex; flex-direction:column; box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                animation: popCard 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes popCard { from { transform: scale(0.8); opacity:0; } to { transform: scale(1); opacity:1; } }

            .card-img-solo { height: 180px; display:flex; align-items:center; justify-content:center; background:#f8fafc; padding:20px; }
            .card-img-solo img { max-height: 100%; max-width: 100%; object-fit: contain; }
            
            .card-txt-solo { 
                padding: 25px 10px; text-align:center; font-weight:900; 
                font-size: 2.2rem; font-family: 'Fredoka', sans-serif; 
                letter-spacing: 5px; color: var(--text-grey); border-top: 3px solid #f1f5f9;
            }
            
            .letter-slot { 
                display:inline-block; width:35px; border-bottom: 5px solid var(--primary-blue); 
                color: var(--primary-blue); margin: 0 4px; min-height: 45px; vertical-align: middle; 
            }
            
            .keyboard-area { display:flex; flex-wrap:wrap; justify-content:center; gap:6px; width:100%; max-width:700px; margin-top:auto; padding-bottom:10px; }
            .key-btn { 
                background:white; border:2px solid #e2e8f0; border-radius:12px; padding:15px; 
                font-weight:900; font-size:1.2rem; cursor:pointer; box-shadow:0 4px 0 #cbd5e1; 
                flex: 1 1 50px; min-width: 50px; text-align:center; transition:0.1s; 
            }
            .key-btn:active { transform:translateY(2px); box-shadow:0 2px 0 #cbd5e1; }
            
            @media (max-width: 480px) {
                .card-img-solo { height: 130px; }
                .card-txt-solo { font-size: 1.5rem; letter-spacing: 3px; padding: 15px 5px; }
                .letter-slot { width: 22px; border-bottom-width: 3px; min-height: 30px; }
                .key-btn { padding: 10px; font-size: 1rem; flex: 1 1 40px; min-width: 40px; }
            }
        </style>

        <div class="game-wrapper">
            <div style="background:var(--primary-blue); color:white; padding:5px 20px; border-radius:20px; font-weight:900; font-size:0.8rem;">${config.nome}</div>

            <div class="word-card-solo" id="active-card">
                <div class="card-img-solo">
                    <img src="${JOGO_CONFIG.caminhoImg}${palavraObj.img}">
                </div>
                <div class="card-txt-solo">${htmlPalavra}</div>
            </div>

            <div class="keyboard-area">
                ${"ABCDEFGHIJKLM NOPQRSTUVWXYZÃÕÁÉ".split("").map(letra => {
                    if(letra === " ") return '<div style="width:100%; height:0"></div>';
                    return `<button class="key-btn" onclick="digitarLetra('${letra}')">${letra}</button>`;
                }).join('')}
            </div>
        </div>
    `;
}

function digitarLetra(letra) {
    const palavraObj = listaPalavrasRonda[indicePalavraAtiva];
    const slots = document.querySelectorAll('.letter-slot');
    
    let preencheu = false;

    for (let slot of slots) {
        if (slot.innerText === "") {
            const indexNoTermo = parseInt(slot.id.split('-')[1]);
            const charCorreto = palavraObj.termo[indexNoTermo];

            if (charCorreto === letra) {
                slot.innerText = letra;
                slot.style.borderBottomColor = "#10b981";
                slot.style.color = "#10b981";
                preencheu = true;
                somAcerto.play();
            } else {
                erros++;
                document.getElementById('miss-val').innerText = erros;
                somErro.play();
                slot.style.borderBottomColor = "#ef4444";
                document.getElementById('active-card').style.animation = "none";
                setTimeout(() => document.getElementById('active-card').style.animation = "shakeError 0.3s", 10);
                setTimeout(() => slot.style.borderBottomColor = "var(--primary-blue)", 500);
            }
            break; 
        }
    }

    // Verificar se terminou a palavra
    const vazios = Array.from(slots).filter(s => s.innerText === "");
    if (vazios.length === 0 && preencheu) {
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        
        setTimeout(() => {
            if (indicePalavraAtiva < listaPalavrasRonda.length - 1) {
                indicePalavraAtiva++;
                mostrarPalavra();
            } else {
                finalizarJogo();
            }
        }, 800);
    }
}

// Estilo de shake para erro
const style = document.createElement('style');
style.innerHTML = `@keyframes shakeError { 0%, 100% { transform:translateX(0); } 25% { transform:translateX(-10px); } 75% { transform:translateX(10px); } }`;
document.head.appendChild(style);

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
