let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let rondaAtual = 1;
let jogoAtivo = false;
let ajudaDisponivel = true;
let categoriaAtiva = "saudavel";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = JOGO_CATEGORIAS[categoriaAtiva].descricao;

    // Configurar botão da Lâmpada (Ajuda)
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
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
            .tut-monster { width: 100px; height: 100px; background: #9c27b0; border-radius: 50% 50% 40% 40%; position: relative; }
            .tut-mouth { width: 50px; height: 25px; background: #210329; border-radius: 5px 5px 25px 25px; position: absolute; bottom: 15px; left: 25px; border: 2px solid yellow; }
            .tut-food { position: absolute; font-size: 30px; animation: moveFood 3s infinite; }
            @keyframes moveFood { 0% { transform: translate(130px, 40px); } 60% { transform: translate(50px, 65px); opacity:1; } 80%, 100% { transform: translate(50px, 65px); opacity:0; } }
        </style>
        <div style="position:relative; width:220px; height:150px; display:flex; align-items:center; justify-content:center;">
            <div class="tut-monster"><div class="tut-mouth"></div></div>
            <div class="tut-food">🍎</div>
        </div>
    `;
}

// === 2. MOTOR DO JOGO (10 RONDAS) ===
window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0; rondaAtual = 1;
    jogoAtivo = true;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    proximaRonda();
};

function proximaRonda() {
    if (rondaAtual > 10) {
        finalizarJogo();
        return;
    }
    document.getElementById('round-val').innerText = `${rondaAtual} / 10`;
    renderizarEcraAlimentacao();
}

function renderizarEcraAlimentacao() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    
    // Sorteia 1 alimento correto e 3 distrações
    const alvo = config.alvos[Math.floor(Math.random() * config.alvos.length)];
    const outras = [...config.distracoes].sort(() => 0.5 - Math.random()).slice(0, 3);
    const opcoesRonda = [
        { img: alvo, status: 'correto' },
        ...outras.map(d => ({ img: d, status: 'errado' }))
    ].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .monster-wrap { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 10px; }
            .instr-tag { background: white; padding: 8px 20px; border-radius: 20px; font-weight: 900; color: #5d7082; border: 2px solid var(--primary-blue); margin-bottom: 5px; }
            
            .game-stage { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; gap: 30px; flex-wrap: wrap; }
            
            /* O Monstro */
            .monster { width: clamp(160px, 35vh, 240px); height: clamp(160px, 35vh, 240px); background: #9c27b0; border-radius: 50% 50% 42% 42%; position: relative; box-shadow: 0 12px 0 #4a148c; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 0.2s; }
            .monster-mouth { width: 40%; height: 25%; background: #210329; border: 4px solid #ffeb3b; border-radius: 10px 10px 60px 60px; transition: 0.2s; margin-top: 20px; }
            .monster.open .monster-mouth { height: 45%; }
            .monster.happy { background: #4caf50; box-shadow: 0 12px 0 #1b5e20; }
            .monster.sad { background: #e53935; box-shadow: 0 12px 0 #b71c1c; }

            /* Alimentos */
            .food-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .food-card { width: clamp(80px, 15vh, 115px); height: clamp(80px, 15vh, 115px); background: white; border: 3px solid #eee; border-radius: 25px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 0 #ddd; padding: 10px; transition: 0.2s; }
            .food-card img { max-height: 85%; max-width: 85%; object-fit: contain; }
            
            .flying { position: fixed !important; z-index: 999; pointer-events: none; transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); transform: scale(0.2) rotate(360deg); opacity: 0; }
        </style>

        <div class="monster-wrap">
            <div class="instr-tag">${config.descricao}</div>
            <div class="game-stage">
                <div class="monster" id="monster-main">
                    <div style="display:flex; gap:15px;">
                        <div style="width:20px; height:20px; background:white; border-radius:50%; position:relative;"><div style="width:8px; height:8px; background:black; border-radius:50%; position:absolute; top:4px; left:4px;"></div></div>
                        <div style="width:20px; height:20px; background:white; border-radius:50%; position:relative;"><div style="width:8px; height:8px; background:black; border-radius:50%; position:absolute; top:4px; left:4px;"></div></div>
                    </div>
                    <div class="monster-mouth"></div>
                </div>
                <div class="food-grid">
                    ${opcoesRonda.map(opt => `
                        <div class="food-card" data-status="${opt.status}" onclick="darComida(this)">
                            <img src="${JOGO_CONFIG.caminhoImg}comida/${opt.img}">
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function darComida(el) {
    if (!jogoAtivo) return;
    const status = el.getAttribute('data-status');
    const monster = document.getElementById('monster-main');
    const rect = el.getBoundingClientRect();
    const mRect = monster.getBoundingClientRect();

    // Iniciar animação
    el.classList.add('flying');
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    monster.classList.add('open');

    setTimeout(() => {
        el.style.left = (mRect.left + mRect.width / 2 - 20) + "px";
        el.style.top = (mRect.top + mRect.height / 2) + "px";
    }, 10);

    setTimeout(() => {
        monster.classList.remove('open');
        if (status === 'correto') {
            acertos++;
            somAcerto.play();
            monster.classList.add('happy');
            el.remove();
        } else {
            erros++;
            somErro.play();
            monster.classList.add('sad');
            el.classList.remove('flying');
            el.style.position = "static";
        }
        
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('miss-val').innerText = erros;

        setTimeout(() => {
            monster.classList.remove('happy', 'sad');
            rondaAtual++;
            proximaRonda();
        }, 1000);
    }, 600);
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const cards = document.querySelectorAll('.food-card');
    cards.forEach(c => {
        if (c.getAttribute('data-status') === 'correto') {
            c.style.borderColor = "#ff9800";
            c.style.transform = "scale(1.1)";
            setTimeout(() => {
                c.style.borderColor = "#eee";
                c.style.transform = "scale(1)";
                ajudaDisponivel = true;
            }, 1500);
        }
    });
};

function finalizarJogo() {
    jogoAtivo = false;
    somVitoria.play();
    const perc = Math.round((acertos / 10) * 100);
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; max-width:450px;">
                <img src="${JOGO_CONFIG.caminhoImg}${rel.img}" style="height:120px; margin-bottom:10px;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin-bottom:25px; text-align:center;">${rel.titulo}</h1>

                <div style="display:flex; gap:15px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:25px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
                        <span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span>
                        <span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span>
                    </div>
                    <div style="background:white; border-radius:25px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
                        <span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span>
                        <span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span>
                    </div>
                    <div style="background:white; border-radius:25px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
                        <span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span>
                        <span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:320px;">
                    <button class="btn-jogar-stretch" style="height:60px; border-radius:30px; font-size:1.2rem;" onclick="location.reload()">JOGAR DE NOVO</button>
                    <a href="${JOGO_CONFIG.linkVoltar}" class="btn-jogar-stretch" style="height:60px; border-radius:30px; font-size:1.2rem; background:#e2e8f0; color:#64748b; box-shadow:0 6px 0 #cbd5e1;">SAIR</a>
                </div>
            </div>
        </div>
    `;
}
