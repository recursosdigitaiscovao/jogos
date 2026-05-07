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

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual || !JOGO_CATEGORIAS[categoriaAtual]) categoriaAtual = "Nível 1";
    setTimeout(criarAnimacaoTutorial, 100);
};

window.gerarIntroJogo = function() {
    return "Observa a imagem e descobre as letras que faltam para completar a palavra!";
};

window.selecionarCategoria = function(key) { categoriaAtual = key; };

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px;">
            <div style="border:3px solid #5ba4e5; border-radius:15px; padding:10px; background:white; text-align:center;">
                <div style="font-size:3rem;">🦆</div>
                <div style="font-family:monospace; font-size:1.5rem; font-weight:bold; letter-spacing:5px;">P<span style="border-bottom:3px solid #5ba4e5; color:transparent;">A</span>T<span style="border-bottom:3px solid #5ba4e5; color:transparent;">O</span></div>
            </div>
            <div id="tut-hand" style="font-size:35px; animation: tapH 2s infinite;">☝️</div>
        </div>
        <style> @keyframes tapH { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-15px); } } </style>
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
            .game-wrapper { display:flex; flex-direction:column; width:100%; height:100%; align-items:center; padding:10px; box-sizing:border-box; gap:15px; }
            .grid-palavras { display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; width:100%; max-width:600px; }
            .card-palavra { background:white; border:3px solid #cbd5e1; border-radius:15px; overflow:hidden; transition: 0.3s; position:relative; }
            .card-palavra.active { border-color: var(--primary-blue); box-shadow: 0 0 15px rgba(91, 164, 229, 0.4); transform: scale(1.02); z-index:10; }
            .card-palavra.completed { opacity: 0.6; background: #f8fafc; border-color: #94a3b8; }
            
            .card-img { height: 80px; display:flex; align-items:center; justify-content:center; background:#f1f5f9; padding:5px; }
            .card-img img { max-height: 100%; max-width: 100%; object-fit: contain; }
            
            .card-txt { border-top: 2px solid #e2e8f0; padding: 10px 5px; text-align:center; font-weight:900; font-size:1.2rem; font-family: 'Fredoka', sans-serif; letter-spacing: 2px; color: var(--text-grey); }
            .slot { display:inline-block; width:18px; border-bottom: 3px solid var(--primary-blue); color: var(--primary-blue); margin: 0 1px; min-height: 24px; }
            
            .teclado { display:flex; flex-wrap:wrap; justify-content:center; gap:6px; width:100%; max-width:600px; margin-top:auto; padding-bottom:10px; }
            .key { background:white; border:2px solid #e2e8f0; border-radius:10px; padding:12px; font-weight:900; font-size:1.1rem; cursor:pointer; box-shadow:0 4px 0 #cbd5e1; flex: 1 1 40px; min-width: 40px; text-align:center; }
            .key:active { transform:translateY(2px); box-shadow:0 2px 0 #cbd5e1; }
            
            @media (max-width: 480px) {
                .grid-palavras { grid-template-columns: repeat(2, 1fr); }
                .key { padding: 8px; font-size: 0.9rem; flex: 1 1 35px; }
            }
        </style>

        <div class="game-wrapper">
            <div class="grid-palavras">
                ${config.palavras.map((p, i) => {
                    let display = "";
                    for(let l=0; l < p.termo.length; l++) {
                        if (l === 0 || l === p.termo.length - 1) display += p.termo[l];
                        else display += `<span class="slot" id="slot-${i}-${l}"></span>`;
                    }
                    return `
                        <div class="card-palavra ${i === 0 ? 'active' : ''}" id="card-${i}">
                            <div class="card-img"><img src="${JOGO_CONFIG.caminhoImg}${config.pasta}${p.img}"></div>
                            <div class="card-txt">${display}</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="teclado">
                ${"ABCDEFGHIJKLM NOPQRSTUVWXYZÃÕÉÁ".split("").map(letra => {
                    if(letra === " ") return '<div style="width:100%; height:0"></div>';
                    return `<button class="key" onclick="digitar('${letra}')">${letra}</button>`;
                }).join('')}
            </div>
        </div>
    `;
}

function digitar(letra) {
    const config = JOGO_CATEGORIAS[categoriaAtual];
    const palavraObj = config.palavras[indicePalavraAtiva];
    const slots = document.querySelectorAll(`#card-${indicePalavraAtiva} .slot`);
    
    let preencheu = false;

    // Encontrar o próximo slot vazio
    for (let slot of slots) {
        if (slot.innerText === "") {
            const indexNaPalavra = parseInt(slot.id.split('-')[2]);
            const letraCorreta = palavraObj.termo[indexNaPalavra];

            if (letraCorreta === letra) {
                slot.innerText = letra;
                slot.style.borderBottomColor = "#10b981";
                preencheu = true;
                somAcerto.play();
            } else {
                erros++;
                document.getElementById('miss-val').innerText = erros;
                somErro.play();
                slot.style.borderBottomColor = "#ef4444";
                setTimeout(() => { if(slot.innerText === "") slot.style.borderBottomColor = "var(--primary-blue)"; }, 500);
            }
            break; 
        }
    }

    // Verificar se o cartão atual foi todo preenchido
    const slotsVazios = Array.from(slots).filter(s => s.innerText === "");
    if (slotsVazios.length === 0 && preencheu) {
        const card = document.getElementById(`card-${indicePalavraAtiva}`);
        card.classList.remove('active');
        card.classList.add('completed');
        
        palavrasConcluidas++;
        acertos++; // Contamos o cartão como um acerto geral para o relatório final
        document.getElementById('hits-val').innerText = acertos;

        if (palavrasConcluidas < config.palavras.length) {
            indicePalavraAtiva++;
            document.getElementById(`card-${indicePalavraAtiva}`).classList.add('active');
            document.getElementById('round-val').innerText = `${palavrasConcluidas + 1} / ${config.palavras.length}`;
        } else {
            setTimeout(finalizar, 800);
        }
    }
}

function finalizar() {
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
                    <span style="display:block; font-size:24px; font-weight:900; color:var(--primary-blue);">${palavrasConcluidas} / ${config.palavras.length}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Concluídas</span>
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
