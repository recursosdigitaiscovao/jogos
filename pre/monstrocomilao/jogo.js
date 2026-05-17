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

// === 1. FUNÇÃO DE VOZ (TEXT-TO-SPEECH) ===
function falarInstrucao() {
    if ('speechSynthesis' in window) {
        // Para qualquer fala anterior
        window.speechSynthesis.cancel();
        
        const texto = JOGO_CATEGORIAS[categoriaAtiva].descricao;
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-PT';
        msg.rate = 0.85; // Velocidade um pouco mais lenta para crianças
        msg.pitch = 1.1; // Tom levemente mais agudo/amigável
        
        window.speechSynthesis.speak(msg);
    }
}

// === 2. INICIALIZAÇÃO ===
window.startLogic = function() {
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = JOGO_CATEGORIAS[categoriaAtiva].descricao;

    // Configurar botão da Lâmpada (Ajuda) na Barra de Status
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

// === 3. MOTOR DO JOGO ===
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
    
    // Fala a instrução automaticamente no início da primeira ronda
    if(rondaAtual === 1) {
        setTimeout(falarInstrucao, 500);
    }
}

function renderizarEcraAlimentacao() {
    const container = document.getElementById('game-main-content');
    const config = JOGO_CATEGORIAS[categoriaAtiva];
    
    const alvo = config.alvos[Math.floor(Math.random() * config.alvos.length)];
    const outras = [...config.distracoes].sort(() => 0.5 - Math.random()).slice(0, 3);
    const opcoesRonda = [
        { img: alvo, status: 'correto' },
        ...outras.map(d => ({ img: d, status: 'errado' }))
    ].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <style>
            .monster-wrap { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 5px; }
            
            /* Cartão de Instrução com botão de som */
            .instr-box { 
                background: white; padding: 10px 25px; border-radius: 20px; 
                font-weight: 900; color: #5d7082; border: 3px solid var(--primary-blue); 
                display: flex; align-items: center; gap: 15px; margin-bottom: 5px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }
            .btn-som { 
                background: #ff9800; border: none; width: 40px; height: 40px; 
                border-radius: 50%; color: white; cursor: pointer; 
                box-shadow: 0 4px 0 #e65100; display: flex; align-items: center; justify-content: center;
            }
            .btn-som:active { transform: translateY(2px); box-shadow: none; }

            .game-stage { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; gap: 30px; flex-wrap: wrap; }
            
            .monster { width: clamp(160px, 32vh, 230px); height: clamp(160px, 32vh, 230px); background: #9c27b0; border-radius: 50% 50% 42% 42%; position: relative; box-shadow: 0 12px 0 #4a148c; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: 0.3s; }
            .monster-mouth { width: 40%; height: 22%; background: #210329; border: 4px solid #ffeb3b; border-radius: 10px 10px 60px 60px; transition: 0.2s; margin-top: 15px; }
            .monster.open .monster-mouth { height: 40%; }
            .monster.happy { background: #4caf50; box-shadow: 0 12px 0 #1b5e20; transform: scale(1.05); }
            .monster.sad { background: #e53935; box-shadow: 0 12px 0 #b71c1c; }

            .food-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .food-card { width: clamp(85px, 14vh, 110px); height: clamp(85px, 14vh, 110px); background: white; border: 3px solid #f0f4f8; border-radius: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 0 #d0d8de; padding: 10px; transition: 0.2s; }
            .food-card img { max-height: 85%; max-width: 85%; object-fit: contain; }
            
            .flying { position: fixed !important; z-index: 999; pointer-events: none; transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); transform: scale(0.2) rotate(360deg); opacity: 0; }
        </style>

        <div class="monster-wrap">
            <div class="instr-box">
                <button class="btn-som" onclick="falarInstrucao()"><i class="fas fa-volume-up"></i></button>
                <span>${config.descricao}</span>
            </div>
            
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
                c.style.borderColor = "#f0f4f8";
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
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin-bottom:25px; text-align:center; line-height:1;">${rel.titulo}</h1>

                <div style="display:flex; gap:15px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        <span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span>
                        <span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span>
                    </div>
                    <div style="background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        <span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span>
                        <span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span>
                    </div>
                    <div style="background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        <span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span>
                        <span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:320px;">
                    <button class="btn-jogar-stretch" style="height:60px; border-radius:30px; font-size:1.1rem;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                    <button class="btn-jogar-stretch" style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); box-shadow:none;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                    <a href="${JOGO_CONFIG.linkVoltar}" class="btn-jogar-stretch" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; box-shadow:none;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
                </div>
            </div>
        </div>
    `;
}
