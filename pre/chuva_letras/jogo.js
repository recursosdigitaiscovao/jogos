let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let indicePergunta = 0; // Usado aqui como contador de letras capturadas
let jogoAtivo = false;
let ajudaDisponivel = true;
let categoriaAtual = "maiusculas";
let letrasNoEcra = [];
let spawnInterval;
let gameLoopInterval;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO ===
window.startLogic = function() {
    if (!categoriaAtual) categoriaAtual = "maiusculas";
    
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = JOGO_CATEGORIAS[categoriaAtual].descricao;

    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent";
        timerBadge.style.padding = "0";
    }

    renderTutorialAnimation();
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    if(document.getElementById('intro-instr')) 
        document.getElementById('intro-instr').innerText = JOGO_CATEGORIAS[key].descricao;
    renderTutorialAnimation();
};

function renderTutorialAnimation() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const isUpper = JOGO_CATEGORIAS[categoriaAtual].tipo === "upper";
    
    container.innerHTML = `
        <style>
            .tut-box { position:relative; width:150px; height:150px; background:#f8fafc; border:2px dashed var(--primary-blue); border-radius:20px; overflow:hidden; }
            .tut-letter { position:absolute; left:50%; transform:translateX(-50%); font-size:40px; font-weight:900; color:var(--primary-blue); animation: fallTut 3s infinite linear; }
            .tut-hand { position:absolute; font-size:35px; bottom:20px; left:60%; animation: tapTut 3s infinite; }
            @keyframes fallTut { 0% { top:-50px; } 60% { top:60px; } 100% { top:60px; opacity:0; } }
            @keyframes tapTut { 0%, 50% { transform:scale(1); opacity:0; } 60% { transform:scale(0.8); opacity:1; } 100% { opacity:0; } }
        </style>
        <div class="tut-box">
            <div class="tut-letter">${isUpper ? 'A' : 'a'}</div>
            <div class="tut-hand">☝️</div>
        </div>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0; indicePergunta = 0;
    letrasNoEcra = [];
    jogoAtivo = true;
    
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('round-val').innerText = "0 / 10";

    renderEstruturaJogo();
    
    // Iniciar fluxos
    spawnInterval = setInterval(spawnLetra, 1500);
    gameLoopInterval = setInterval(atualizarLetras, 50);

    // Ouvir teclado real
    window.addEventListener('keydown', lidarTeclado);
};

function renderEstruturaJogo() {
    const container = document.getElementById('game-main-content');
    container.innerHTML = `
        <style>
            .rain-container { 
                width: 98%; height: 98%; position: relative; 
                background: #f0f4f8; border-radius: 20px; overflow: hidden;
                display: flex; flex-direction: column;
            }
            #sky { flex: 1; position: relative; width: 100%; }
            .falling-letter { 
                position: absolute; font-size: clamp(30px, 8vmin, 50px); 
                font-weight: 900; color: var(--primary-blue); 
                cursor: pointer; user-select: none; transition: transform 0.1s;
                background: white; width: 60px; height: 60px; 
                display: flex; align-items: center; justify-content: center;
                border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .virtual-keyboard { 
                height: 80px; width: 100%; background: white; 
                display: flex; align-items: center; justify-content: center; 
                gap: 5px; padding: 5px; overflow-x: auto; border-top: 2px solid #ddd;
            }
            .key-btn { 
                min-width: 40px; height: 50px; background: white; border: 2px solid #eee; 
                border-radius: 10px; font-weight: 900; font-size: 18px; color: #5d7082;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; box-shadow: 0 3px 0 #ddd;
            }
            .key-btn:active { transform: translateY(2px); box-shadow: none; }
        </style>
        <div class="rain-container">
            <div id="sky"></div>
            <div class="virtual-keyboard" id="v-keyboard">
                <!-- Teclado gerado dinamicamente com as letras que estão a cair ou alfabeto -->
            </div>
        </div>
    `;
    gerarTeclado();
}

function gerarTeclado() {
    const kb = document.getElementById('v-keyboard');
    const alfabeto = JOGO_CATEGORIAS[categoriaAtual].letras;
    // Para não encher muito, vamos mostrar apenas 10 letras aleatórias que mudam ou o alfabeto completo scrollable
    kb.innerHTML = alfabeto.map(l => `<div class="key-btn" onclick="verificarLetra('${l}')">${l}</div>`).join('');
}

function spawnLetra() {
    if (!jogoAtivo) return;
    const sky = document.getElementById('sky');
    const letrasPossiveis = JOGO_CATEGORIAS[categoriaAtual].letras;
    const char = letrasPossiveis[Math.floor(Math.random() * letrasPossiveis.length)];
    
    const div = document.createElement('div');
    div.className = 'falling-letter';
    div.innerText = char;
    div.style.left = Math.random() * (sky.clientWidth - 60) + "px";
    div.style.top = "-70px";
    
    const id = Date.now();
    const letraObj = { id, char, element: div, top: -70 };
    
    div.onclick = () => verificarLetra(char);
    
    sky.appendChild(div);
    letrasNoEcra.push(letraObj);
}

function atualizarLetras() {
    if (!jogoAtivo) return;
    const skyHeight = document.getElementById('sky').clientHeight;
    
    letrasNoEcra.forEach((letra, index) => {
        letra.top += 2; // Velocidade da queda
        letra.element.style.top = letra.top + "px";
        
        if (letra.top > skyHeight) {
            // Perdeu a letra
            somErro.play();
            erros++;
            document.getElementById('miss-val').innerText = erros;
            letra.element.remove();
            letrasNoEcra.splice(index, 1);
        }
    });
}

function lidarTeclado(e) {
    if (!jogoAtivo) return;
    verificarLetra(e.key);
}

function verificarLetra(charDigitado) {
    if (!jogoAtivo) return;
    
    // Encontrar a letra correspondente mais baixa no ecrã
    const index = letrasNoEcra.findIndex(l => l.char === charDigitado);
    
    if (index !== -1) {
        const letra = letrasNoEcra[index];
        somAcerto.play();
        acertos++;
        indicePergunta++;
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('round-val').innerText = `${indicePergunta} / 10`;
        
        letra.element.style.background = "#7ed321";
        letra.element.style.color = "white";
        letra.element.style.transform = "scale(0)";
        
        setTimeout(() => letra.element.remove(), 200);
        letrasNoEcra.splice(index, 1);
        
        if (indicePergunta >= 10) {
            setTimeout(finalizarJogo, 500);
        }
    }
}

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel || letrasNoEcra.length === 0) return;
    
    ajudaDisponivel = false;
    ajudasUtilizadas++;
    
    // Encontra a letra mais baixa e "resolve-a"
    let maisBaixa = letrasNoEcra.reduce((prev, curr) => (prev.top > curr.top) ? prev : curr);
    verificarLetra(maisBaixa.char);
    
    setTimeout(() => { ajudaDisponivel = true; }, 2000);
};

// === 3. FINALIZAÇÃO E RESULTADOS ===
function finalizarJogo() {
    jogoAtivo = false;
    clearInterval(spawnInterval);
    clearInterval(gameLoopInterval);
    window.removeEventListener('keydown', lidarTeclado);
    somVitoria.play();

    const perc = (acertos / (acertos + erros || 1)) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px;">
            <style>
                .res-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 450px; }
                .res-trophy { height: 110px; margin-bottom: 10px; object-fit: contain; }
                .res-msg { color: var(--primary-blue); font-weight: 900; font-size: 2.2rem; margin-bottom: 25px; text-align: center; line-height: 1; }
                .res-stats-row { display: flex; gap: 15px; margin-bottom: 30px; width: 100%; justify-content: center; }
                .stat-box { background: white; border-radius: 25px; width: 105px; height: 105px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .stat-val { font-size: 1.8rem; font-weight: 900; margin-bottom: 2px; }
                .stat-lab { font-size: 0.65rem; font-weight: 900; color: #88a; text-transform: uppercase; }
                .res-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 320px; }
                .btn-res { height: 60px; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 15px; font-weight: 900; font-size: 1.1rem; text-decoration: none; cursor: pointer; transition: 0.2s; border: none; }
                .btn-redo { background: var(--primary-blue); color: white; box-shadow: 0 6px 0 var(--primary-dark); }
                .btn-redo:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--primary-dark); }
                .btn-outline { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); }
                .btn-exit { background: #e2e8f0; color: #64748b; }
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
