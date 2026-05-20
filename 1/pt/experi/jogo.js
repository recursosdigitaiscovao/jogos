let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let rondaAtual = 0;
let jogoAtivo = false;
let categoriaAtiva = "nivel1";
let textosSessao = [];
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
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <div style="padding: 15px; border: 2px dashed var(--primary-blue); border-radius: 15px; background: white; font-weight: 800; font-size: 1rem; color: #555;">
                O coelho come <span style="display:inline-block; width:60px; height:15px; background:#edf2f7; border-radius:5px; border-bottom:3px solid #cbd5e0; vertical-align:middle;"></span>
            </div>
            <div style="font-size:35px; animation: handT 3s infinite;">☝️</div>
        </div>
        <style>@keyframes handT { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px) scale(0.9); } }</style>
    `;
}

// === 2. MOTOR DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0; rondaAtual = 0;
    const todos = JOGO_CATEGORIAS[categoriaAtiva].textos;
    textosSessao = [...todos].sort(() => 0.5 - Math.random()).slice(0, 10);
    jogoAtivo = true;
    proximaRonda();
};

function proximaRonda() {
    if (rondaAtual >= textosSessao.length) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${rondaAtual + 1} / 10`;
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    renderizarTexto();
}

function renderizarTexto() {
    const container = document.getElementById('game-main-content');
    textoAtualObj = textosSessao[rondaAtual];
    
    let fraseFinal = textoAtualObj.frase;
    textoAtualObj.lacunas.forEach((lac, idx) => {
        const gap = `<span class="gap-item" id="gap-${idx}" onclick="abrirMenu(${idx})">...</span>`;
        fraseFinal = fraseFinal.replace(`[[${idx}]]`, gap);
    });

    container.innerHTML = `
        <style>
            .game-screen { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 10px; box-sizing: border-box; }
            .content-card { 
                background: white; width: 98%; max-width: 850px; max-height: 95%;
                padding: clamp(15px, 4vh, 40px); border-radius: 35px; 
                border: 4px dashed #cbd5e0; box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                font-size: clamp(1.3rem, 4.5vmin, 2.5rem); line-height: 1.8;
                color: #2d3748; font-weight: 800; text-align: center;
                overflow-y: auto; /* IMPORTANTE PARA MOBILE VERTICAL */
            }
            .gap-item { 
                display: inline-flex; align-items: center; justify-content: center;
                min-width: 130px; background: #f7fafc; padding: 0 15px;
                border-radius: 12px; border-bottom: 5px solid #cbd5e0;
                margin: 5px 8px; cursor: pointer; color: #a0aec0; transition: 0.2s;
            }
            .gap-item.ok { color: #48bb78; border-bottom-color: #48bb78; background: #f0fff4; }

            /* Modal Dropdown Central */
            #pop-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.4); display: none; align-items: center; justify-content: center;
                z-index: 9999; backdrop-filter: blur(3px);
            }
            .pop-menu {
                background: white; width: 90%; max-width: 320px; 
                border-radius: 30px; padding: 20px; border: 5px solid var(--primary-blue);
                display: flex; flex-direction: column; gap: 8px;
                animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            
            .btn-opt {
                background: #f8fafc; border: 2px solid #e2e8f0; padding: 15px;
                border-radius: 18px; cursor: pointer; font-weight: 900;
                color: #4a5568; font-size: 1.2rem; text-align: center;
            }
            .btn-opt:hover { background: #ebf8ff; border-color: var(--primary-blue); }
        </style>

        <div class="game-screen">
            <div class="content-card">
                ${fraseFinal}
            </div>
        </div>

        <div id="pop-overlay" onclick="fecharMenu()">
            <div class="pop-menu" id="pop-content" onclick="event.stopPropagation()"></div>
        </div>
    `;
}

function abrirMenu(idx) {
    if (!jogoAtivo) return;
    const overlay = document.getElementById('pop-overlay');
    const content = document.getElementById('pop-content');
    const lacuna = textoAtualObj.lacunas[idx];

    let opts = [lacuna.certa, ...lacuna.erradas].sort(() => 0.5 - Math.random());

    content.innerHTML = `
        <p style="text-align:center; font-weight:900; color:var(--primary-blue); margin-bottom:5px; text-transform:uppercase; font-size:0.75rem;">Escolhe a palavra:</p>
        ${opts.map(o => `<div class="btn-opt" onclick="escolher(${idx}, '${o}')">${o}</div>`).join('')}
    `;
    overlay.style.display = 'flex';
}

function fecharMenu() { document.getElementById('pop-overlay').style.display = 'none'; }

window.escolher = function(idx, valor) {
    fecharMenu();
    const gap = document.getElementById(`gap-${idx}`);
    const lacuna = textoAtualObj.lacunas[idx];
    gap.innerText = valor;

    if (valor === lacuna.certa) {
        somAcerto.play(); acertos++; gap.classList.add('ok');
        verificarFimTexto();
    } else {
        somErro.play(); erros++;
        gap.style.color = "#f56565"; gap.style.borderBottomColor = "#f56565";
        setTimeout(() => { gap.innerText = "..."; gap.style.color = ""; gap.style.borderBottomColor = ""; }, 1000);
    }
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
}

function verificarFimTexto() {
    const gaps = document.querySelectorAll('.gap-item');
    if (Array.from(gaps).every(g => g.classList.contains('ok'))) {
        jogoAtivo = false;
        setTimeout(() => { rondaAtual++; jogoAtivo = true; proximaRonda(); }, 1200);
    }
}

window.usarAjuda = function() {
    if (!jogoAtivo) return;
    ajudasUtilizadas++;
    const gaps = document.querySelectorAll('.gap-item:not(.ok)');
    if (gaps.length > 0) {
        const idx = parseInt(gaps[0].id.split('-')[1]);
        window.escolher(idx, textoAtualObj.lacunas[idx].certa);
    }
};

function finalizarJogo() {
    jogoAtivo = false; somVitoria.play();
    const perc = Math.round((acertos / (acertos + erros || 1)) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const res = document.getElementById('scr-result');
    res.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    res.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px; display: flex !important;">
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; max-width:450px; margin:auto;">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:120px; margin-bottom:10px;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center;">${rank.titulo}</h1>
                <div style="display:flex; gap:12px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:25px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 10px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
