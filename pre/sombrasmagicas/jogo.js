let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let categoriaAtual = "animais";
let jogoAtivo = false;
let ajudaDisponivel = true;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    const primeiraCat = Object.keys(JOGO_CATEGORIAS)[0];
    if (!categoriaAtual) categoriaAtual = primeiraCat;
    
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = JOGO_CATEGORIAS[categoriaAtual].descricao || "Olha para a sombra e escolhe o desenho correto!";

    // Configurar botão da Lâmpada (Tamanho 30px, sem cronómetro)
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer; display:block;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
    }

    selecionarCategoria(categoriaAtual);
    criarAnimacaoTutorial();
};

function selecionarCategoria(key) {
    categoriaAtual = key;
    const cat = JOGO_CATEGORIAS[key];
    perguntas = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
}

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itemTut = JOGO_CATEGORIAS.animais.itens[0];
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:20px;">
            <div style="height:100px; width:100px; background:#f5f5f5; border-radius:20px; display:flex; align-items:center; justify-content:center; border:2px solid #eee;">
                <img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="height:70px; width:auto; filter:brightness(0); opacity:0.3; object-fit:contain;">
            </div>
            <div style="display:flex; gap:12px; justify-content:center;">
                <div style="height:60px; width:60px; background:white; border:2px solid #eee; border-radius:12px;"></div>
                <div style="height:60px; width:60px; background:white; border:2px solid var(--primary-blue); border-radius:12px; display:flex; align-items:center; justify-content:center; position:relative;">
                    <img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="height:40px; width:auto; object-fit:contain;">
                    <div style="position:absolute; font-size:45px; bottom:-35px; right:-25px; animation: tapH 2s infinite; z-index:10;">☝️</div>
                </div>
                <div style="height:60px; width:60px; background:white; border:2px solid #eee; border-radius:12px;"></div>
            </div>
        </div>
        <style>@keyframes tapH { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-8px,-12px) scale(1.1); } }</style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0; ajudasUtilizadas = 0; jogoAtivo = true;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    mostrarPergunta();
};

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const pergunta = perguntas[indicePergunta];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    let erradas = JOGO_CATEGORIAS[categoriaAtual].itens.filter(i => i.img !== pergunta.img).sort(() => Math.random() - 0.5).slice(0, 2);
    let opcoes = [pergunta, ...erradas].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; padding: 20px; box-sizing: border-box; overflow: hidden; }
            .shadow-zone { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; min-height: 0; background: rgba(255,255,255,0.4); border-radius: 30px; }
            .shadow-img { height: 80%; width: auto; max-width: 85%; object-fit: contain; filter: brightness(0); opacity: 0.8; transition: 0.4s; }
            .options-row { display: flex; justify-content: center; gap: 15px; width: 100%; flex-shrink: 0; margin-top: 20px; }
            .card-opt { background: white; border: 3px solid #eee; border-radius: 20px; height: 100px; width: 100px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 5px 0 #ddd; padding: 12px; }
            .card-opt img { height: 100%; width: auto; max-width: 100%; object-fit: contain; }
            .is-correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 5px 0 #5ea31a !important; }
            .is-wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 5px 0 #d13d3d !important; }
            
            @media (min-width: 800px) { .card-opt { height: 150px; width: 140px; } }
            @media (max-width: 500px) { .card-opt { height: 80px; width: 80px; } .shadow-img { height: 60%; } }
        </style>
        <div class="game-wrapper">
            <div class="shadow-zone"><img src="${JOGO_CONFIG.caminhoImg}${pergunta.img}" class="shadow-img" id="target-obj"></div>
            <div class="options-row">
                ${opcoes.map(opt => `<div class="card-opt" onclick="validar(this, ${opt.img === pergunta.img})"><img src="${JOGO_CONFIG.caminhoImg}${opt.img}"></div>`).join('')}
            </div>
        </div>
    `;
}

function usarAjuda() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    
    ajudaDisponivel = false;
    ajudasUtilizadas++;
    const obj = document.getElementById('target-obj');
    
    if (obj) {
        obj.style.filter = "none";
        obj.style.opacity = "1";
        setTimeout(() => {
            if (jogoAtivo) {
                obj.style.filter = "brightness(0)";
                obj.style.opacity = "0.8";
            }
            setTimeout(() => ajudaDisponivel = true, 2000);
        }, 1200);
    }
}

function validar(el, acerto) {
    if (!jogoAtivo) return;
    document.querySelectorAll('.card-opt').forEach(c => c.style.pointerEvents = 'none');
    const obj = document.getElementById('target-obj');
    
    if (acerto) {
        acertos++; somAcerto.play(); el.classList.add('is-correct');
        obj.style.filter = "none"; obj.style.opacity = "1";
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play(); el.classList.add('is-wrong');
        document.getElementById('miss-val').innerText = erros;
    }

    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < 10) mostrarPergunta();
        else finalizarJogo();
    }, 1500);
}

// === 3. FINALIZAÇÃO E RESULTADOS ===
function finalizarJogo() {
    jogoAtivo = false;
    somVitoria.play();
    
    const perc = (acertos / 10) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <style>
                .res-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 450px; }
                .res-trophy { height: 120px; margin-bottom: 10px; object-fit: contain; }
                .res-msg { color: var(--primary-blue); font-weight: 900; font-size: 2.2rem; margin-bottom: 25px; text-align: center; line-height: 1; }
                .res-stats-row { display: flex; gap: 12px; margin-bottom: 30px; width: 100%; justify-content: center; }
                .stat-box { background: white; border-radius: 25px; width: 105px; height: 105px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .stat-val { font-size: 1.8rem; font-weight: 900; margin-bottom: 2px; }
                .stat-lab { font-size: 0.65rem; font-weight: 900; color: #88a; text-transform: uppercase; letter-spacing: 0.5px; }
                .res-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 320px; }
                .btn-res { height: 60px; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; font-weight: 900; font-size: 1.1rem; text-decoration: none; cursor: pointer; transition: 0.2s; border: none; }
                .btn-redo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
                .btn-redo:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }
                .btn-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); }
                .btn-exit { background: #e2e8f0; color: #64748b; }
                @media (max-width: 500px) { .res-msg { font-size: 1.8rem; } .stat-box { width: 90px; height: 90px; } .btn-res { height: 50px; font-size: 1rem; } }
            </style>
            
            <div class="res-container">
                <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" class="res-trophy">
                <h1 class="res-msg">${rel.titulo}</h1>
                <div class="res-stats-row">
                    <div class="stat-box"><span class="stat-val" style="color: #7ed321;">${acertos}</span><span class="stat-lab">Certos</span></div>
                    <div class="stat-box"><span class="stat-val" style="color: #ff5e5e;">${erros}</span><span class="stat-lab">Errados</span></div>
                    <div class="stat-box"><span class="stat-val" style="color: #ff9f43;">${ajudasUtilizadas}</span><span class="stat-lab">Ajudas</span></div>
                </div>
                <div class="res-actions">
                    <button class="btn-res btn-redo" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                    <button class="btn-res btn-outline" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                    <a href="${JOGO_CONFIG.linkVoltar}" class="btn-res btn-exit"><i class="fas fa-sign-out-alt"></i> SAIR</a>
                </div>
            </div>
        </div>
    `;
}

window.gerarIntroJogo = function() { 
    return JOGO_CATEGORIAS[categoriaAtual].descricao || "Olha para a sombra e escolhe o desenho correto!"; 
};
