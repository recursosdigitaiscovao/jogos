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

    // Configurar Lâmpada de Ajuda
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent"; timerBadge.style.padding = "0";
    }
    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtiva = key;
    if(document.getElementById('intro-instr')) 
        document.getElementById('intro-instr').innerText = JOGO_CATEGORIAS[key].descricao;
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <style>
            .tut-area { display: flex; flex-direction: column; align-items: center; gap: 15px; }
            .tut-box { padding: 15px; border: 2px dashed #ccc; border-radius: 15px; background: white; font-weight: 800; color: #555; }
            .tut-gap { display: inline-block; width: 60px; height: 20px; background: #eee; border-radius: 5px; vertical-align: middle; border-bottom: 3px solid #ddd; }
            .tut-hand { font-size: 35px; animation: handTap 3s infinite; }
            @keyframes handTap { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px) scale(0.9); } }
        </style>
        <div class="tut-area">
            <div class="tut-box">O Sol brilha no <div class="tut-gap"></div></div>
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

function renderizarEcraAlimentacao() {} // Não usado neste jogo

function renderizarTexto() {
    const container = document.getElementById('game-main-content');
    textoAtualObj = JOGO_CATEGORIAS[categoriaAtiva].textos[rondaAtual];
    
    // Substituir [[n]] por elementos span interativos
    let fraseProcessada = textoAtualObj.frase;
    textoAtualObj.lacunas.forEach((lac, index) => {
        const spanGap = `<span class="gap-box" id="gap-${index}" onclick="abrirDropdown(event, ${index})">...</span>`;
        fraseProcessada = fraseProcessada.replace(`[[${index}]]`, spanGap);
    });

    container.innerHTML = `
        <style>
            .text-game-wrap { width: 98%; height: 98%; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
            .text-card { 
                background: white; padding: 40px; border-radius: 40px; 
                border: 3px dashed #cbd5e0; position: relative;
                font-size: clamp(1.2rem, 4vh, 2rem); line-height: 1.8;
                color: #2d3748; font-weight: 700; text-align: left;
                width: 100%; max-width: 800px;
            }
            .gap-box { 
                display: inline-flex; align-items: center; justify-content: center;
                min-width: 120px; height: 1.4em; background: #edf2f7; 
                border-radius: 12px; border-bottom: 4px solid #cbd5e0;
                margin: 0 5px; cursor: pointer; color: #a0aec0; transition: 0.2s;
                padding: 0 15px; vertical-align: middle;
            }
            .gap-box.filled { color: var(--primary-blue); border-bottom-color: var(--primary-blue); background: #ebf8ff; }
            .gap-box.correct-gap { color: #48bb78; border-bottom-color: #48bb78; background: #f0fff4; }

            /* Dropdown Estilizado */
            #dropdown-options {
                position: absolute; display: none; z-index: 5000;
                background: white; border-radius: 20px; padding: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                grid-template-columns: 1fr 1fr; gap: 8px;
                min-width: 280px; border: 2px solid var(--primary-blue);
            }
            .opt-btn {
                background: #f8fafc; border: 2px solid #e2e8f0; padding: 12px;
                border-radius: 15px; cursor: pointer; font-weight: 900;
                color: #4a5568; font-size: 1rem; text-align: center;
                transition: 0.2s;
            }
            .opt-btn:hover { background: #ebf8ff; border-color: var(--primary-blue); }

            @media (max-width: 600px) {
                .text-card { padding: 20px; font-size: 1.1rem; }
                .gap-box { min-width: 80px; }
                #dropdown-options { min-width: 200px; }
            }
        </style>

        <div class="text-game-wrap">
            <div class="text-card">
                ${fraseProcessada}
            </div>
        </div>
        <div id="dropdown-options"></div>
    `;
}

function abrirDropdown(event, lacunaIndex) {
    if (!jogoAtivo) return;
    const dropdown = document.getElementById('dropdown-options');
    const gap = event.target;
    const lacunaData = textoAtualObj.lacunas[lacunaIndex];

    // Criar lista de 4 opções (1 certa + 3 erradas)
    let opcoes = [lacunaData.certa, ...lacunaData.erradas].sort(() => 0.5 - Math.random());

    dropdown.innerHTML = opcoes.map(opt => `
        <div class="opt-btn" onclick="selecionarOpcao(${lacunaIndex}, '${opt}')">${opt}</div>
    `).join('');

    // Posicionar o dropdown perto da lacuna
    const rect = gap.getBoundingClientRect();
    const containerRect = document.getElementById('game-main-content').getBoundingClientRect();
    
    dropdown.style.display = 'grid';
    dropdown.style.left = (rect.left - containerRect.left) + 'px';
    dropdown.style.top = (rect.bottom - containerRect.top + 5) + 'px';

    // Ajuste se sair do ecrã à direita
    if (rect.left + 280 > window.innerWidth) {
        dropdown.style.left = (rect.right - containerRect.left - 280) + 'px';
    }
}

window.selecionarOpcao = function(index, valor) {
    const dropdown = document.getElementById('dropdown-options');
    dropdown.style.display = 'none';
    
    const gap = document.getElementById(`gap-${index}`);
    const lacunaData = textoAtualObj.lacunas[index];

    gap.innerText = valor;
    gap.classList.add('filled');

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
            gap.classList.remove('filled');
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
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudasUtilizadas++;
    
    // Encontrar a primeira lacuna não preenchida
    const gaps = document.querySelectorAll('.gap-box:not(.correct-gap)');
    if (gaps.length > 0) {
        const firstGapId = gaps[0].id;
        const index = parseInt(firstGapId.split('-')[1]);
        const correta = textoAtualObj.lacunas[index].certa;
        
        selecionarOpcao(index, correta);
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
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center;">${rank.titulo}</h1>
                <div style="display:flex; gap:15px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05);"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:25px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button class="btn-redo" style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button class="btn-other" style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 12px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
