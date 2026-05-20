let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let rondaAtual = 0;
let jogoAtivo = false;
let categoriaAtiva = "nivel1";
let textoAtualObj = null;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    document.getElementById('intro-instr').innerText = config.descricao;

    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent"; timerBadge.style.padding = "0";
    }
    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtiva = key;
    const config = JOGO_CATEGORIAS[key];
    if(document.getElementById('intro-instr')) document.getElementById('intro-instr').innerText = config.descricao;
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <style>
            .tut-area { display: flex; flex-direction: column; align-items: center; gap: 15px; }
            .tut-box { padding: 20px; border: 3px dashed var(--primary-blue); border-radius: 20px; background: white; font-weight: 800; color: #555; font-size: 1.2rem; }
            .tut-gap { display: inline-block; width: 80px; height: 25px; background: #edf2f7; border-radius: 8px; vertical-align: middle; border-bottom: 4px solid #cbd5e0; }
            .tut-hand { font-size: 40px; animation: handTap 3s infinite; }
            @keyframes handTap { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px) scale(0.9); } }
        </style>
        <div class="tut-area">
            <div class="tut-box">O mel é feito pela <div class="tut-gap"></div></div>
            <div class="tut-hand">☝️</div>
        </div>
    `;
}

// === 2. MOTOR DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0; rondaAtual = 0;
    jogoAtivo = true;
    proximaRonda();
};

function proximaRonda() {
    const textos = JOGO_CATEGORIAS[categoriaAtiva].textos;
    if (rondaAtual >= textos.length) { finalizarJogo(); return; }
    
    document.getElementById('round-val').innerText = `${rondaAtual + 1} / ${textos.length}`;
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    
    renderizarTexto();
}

function renderizarTexto() {
    const container = document.getElementById('game-main-content');
    textoAtualObj = JOGO_CATEGORIAS[categoriaAtiva].textos[rondaAtual];
    
    let fraseProcessada = textoAtualObj.frase;
    textoAtualObj.lacunas.forEach((lac, index) => {
        const spanGap = `<span class="gap-box" id="gap-${index}" onclick="abrirDropdownModal(${index})">...</span>`;
        fraseProcessada = fraseProcessada.replace(`[[${index}]]`, spanGap);
    });

    container.innerHTML = `
        <style>
            .text-game-wrap { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 15px; box-sizing: border-box; }
            .text-card { 
                background: white; padding: clamp(20px, 5vh, 50px); border-radius: 40px; 
                border: 4px dashed #cbd5e0; 
                font-size: clamp(1.5rem, 5vh, 2.8rem); line-height: 2;
                color: #2d3748; font-weight: 800; text-align: center;
                width: 98%; max-width: 900px; box-shadow: 0 15px 35px rgba(0,0,0,0.05);
            }
            .gap-box { 
                display: inline-flex; align-items: center; justify-content: center;
                min-width: 150px; background: #f7fafc; 
                border-radius: 15px; border-bottom: 6px solid #cbd5e0;
                margin: 0 10px; cursor: pointer; color: #a0aec0; transition: 0.2s;
                padding: 0 20px; vertical-align: middle;
            }
            .gap-box.correct-gap { color: #48bb78; border-bottom-color: #48bb78; background: #f0fff4; }

            /* Overlay Central para Dropdown */
            #modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.4); display: none; align-items: center; justify-content: center;
                z-index: 9999; backdrop-filter: blur(4px);
            }
            .options-modal {
                background: white; width: 90%; max-width: 350px; 
                border-radius: 30px; padding: 25px; border: 5px solid var(--primary-blue);
                display: flex; flex-direction: column; gap: 12px;
                animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            
            .opt-button {
                background: #f8fafc; border: 2px solid #e2e8f0; padding: 18px;
                border-radius: 20px; cursor: pointer; font-weight: 900;
                color: #4a5568; font-size: 1.3rem; text-align: center;
                transition: 0.2s; box-shadow: 0 4px 0 #e2e8f0;
            }
            .opt-button:hover { background: #ebf8ff; border-color: var(--primary-blue); transform: translateY(-2px); }
            .opt-button:active { transform: translateY(2px); box-shadow: none; }
        </style>

        <div class="text-game-wrap">
            <div class="text-card">
                ${fraseProcessada}
            </div>
        </div>

        <div id="modal-overlay" onclick="fecharModal()">
            <div class="options-modal" id="modal-content" onclick="event.stopPropagation()">
                <!-- Opções verticais aqui -->
            </div>
        </div>
    `;
}

function abrirDropdownModal(lacunaIndex) {
    if (!jogoAtivo) return;
    const overlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const lacunaData = textoAtualObj.lacunas[lacunaIndex];

    let opcoes = [lacunaData.certa, ...lacunaData.erradas].sort(() => 0.5 - Math.random());

    modalContent.innerHTML = `
        <p style="text-align:center; font-weight:900; color:var(--primary-blue); margin-bottom:5px; text-transform:uppercase; font-size:0.8rem;">Escolhe a palavra:</p>
        ${opcoes.map(opt => `
            <div class="opt-button" onclick="selecionarOpcao(${lacunaIndex}, '${opt}')">${opt}</div>
        `).join('')}
    `;

    overlay.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

window.selecionarOpcao = function(index, valor) {
    fecharModal();
    const gap = document.getElementById(`gap-${index}`);
    const lacunaData = textoAtualObj.lacunas[index];

    gap.innerText = valor;

    if (valor === lacunaData.certa) {
        somAcerto.play();
        acertos++;
        gap.classList.add('correct-gap');
        verificarTextoCompleto();
    } else {
        somErro.play();
        erros++;
        gap.style.color = "#f56565";
        gap.style.borderBottomColor = "#f56565";
        setTimeout(() => {
            gap.innerText = "...";
            gap.style.color = ""; gap.style.borderBottomColor = "";
        }, 1000);
    }
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
}

function verificarTextoCompleto() {
    const gaps = document.querySelectorAll('.gap-box');
    const todosCertos = Array.from(gaps).every(g => g.classList.contains('correct-gap'));

    if (todosCertos) {
        jogoAtivo = false;
        setTimeout(() => {
            rondaAtual++;
            jogoAtivo = true;
            proximaRonda();
        }, 1500);
    }
}

window.usarAjuda = function() {
    if (!jogoAtivo) return;
    ajudasUtilizadas++;
    const gaps = document.querySelectorAll('.gap-box:not(.correct-gap)');
    if (gaps.length > 0) {
        const index = parseInt(gaps[0].id.split('-')[1]);
        selecionarOpcao(index, textoAtualObj.lacunas[index].certa);
    }
};

function finalizarJogo() {
    jogoAtivo = false; somVitoria.play();
    const total = acertos + erros;
    const perc = Math.round((acertos / (total || 1)) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px; display: flex !important;">
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; max-width:450px; margin:auto;">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px; margin-bottom:10px;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center; line-height:1;">${rank.titulo}</h1>
                <div style="display:flex; gap:15px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button class="btn-redo" style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button class="btn-other" style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 12px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
