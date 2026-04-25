let itensAtuais = []; // Itens da categoria selecionada
let indiceAtual = 0;   // Ronda atual (0 a 9)
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let cartasDaRodada = [];
let ordemCorreta = [];
let proximoIndiceAlvo = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// 1. INICIALIZAÇÃO (Chamado pelo template ao carregar)
window.startLogic = function() {
    selecionarCategoria('animais'); 
};

// 2. SELEÇÃO DE CATEGORIA E ANIMAÇÃO DA INTRO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    
    CONFIG_MESTRE.area = key; // Atualiza a área ativa no config mestre
    itensAtuais = [...cat.itens];
    
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="display:flex; gap:10px;">
                <div class="demo-card" style="width:45px; height:55px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); animation: bounce 2s infinite;">A</div>
                <div class="demo-card" style="width:45px; height:55px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); animation: bounce 2s infinite 0.2s;">B</div>
                <div class="demo-card" style="width:45px; height:55px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); animation: bounce 2s infinite 0.4s;">C</div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-transform:uppercase; letter-spacing:1px;">Ordena por ordem Alfabética!</p>
        </div>
        <style>
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
            @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        </style>`;
};

// 3. INICIAR O JOGO (Chamado ao clicar em JOGAR)
window.initGame = function() {
    indiceAtual = 0;
    acertos = 0;
    erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarTimer();
    proximaRodada();
};

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoInicio = Date.now();
    intervaloTimer = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const m = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const s = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

// 4. LÓGICA DA RODADA E NÍVEIS
function proximaRodada() {
    if (indiceAtual >= 10) {
        finalizarJogo();
        return;
    }

    proximoIndiceAlvo = 0;
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;

    // Determinar dificuldade (Quantidade de cartas)
    let qtd = 3; 
    if (indiceAtual >= 3) qtd = 4;
    if (indiceAtual >= 7) qtd = 5;

    // Selecionar itens aleatórios da categoria
    let embaralhados = [...JOGO_CONFIG.categorias[CONFIG_MESTRE.area].itens].sort(() => Math.random() - 0.5);
    cartasDaRodada = embaralhados.slice(0, qtd);

    // Definir a ordem correta (Alfabeto Português)
    ordemCorreta = [...cartasDaRodada].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));

    montarInterface();
}

function montarInterface() {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 650;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly; padding: 10px 0;">
            
            <!-- ESPAÇOS VAZIOS (PRATELEIRA) -->
            <div id="shelf" style="display:flex; gap:8px; justify-content:center; width:100%; flex-wrap:nowrap;">
                ${ordemCorreta.map((_, i) => `
                    <div class="target-slot" id="slot-${i}" style="
                        width:${isMobile ? '62px' : '90px'}; 
                        height:${isMobile ? '85px' : '120px'}; 
                        border:3px dashed #cbd9e6; border-radius:15px; 
                        background: rgba(255,255,255,0.3);
                        display:flex; flex-direction:column; align-items:center; justify-content:center;
                        position:relative;
                    ">
                        <span style="position:absolute; top:2px; font-size:10px; color:#cbd9e6; font-weight:900;">${i+1}º</span>
                    </div>
                `).join('')}
            </div>

            <!-- CARTÕES DISPONÍVEIS (BARALHADOS) -->
            <div id="card-pile" style="display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:130px;">
                ${[...cartasDaRodada].sort(() => Math.random() - 0.5).map((item, i) => `
                    <div class="game-card-item" onclick="verificarEscolha(this, '${item.nome}')" style="
                        width:${isMobile ? '65px' : '95px'}; 
                        background:white; border:3px solid var(--primary-blue); 
                        border-radius:15px; padding:6px; cursor:pointer;
                        box-shadow:0 5px 0 var(--primary-dark);
                        transition: 0.2s; display:flex; flex-direction:column; align-items:center;
                    ">
                        <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; height:${isMobile ? '45px' : '65px'}; object-fit:contain; pointer-events:none;">
                        <span style="font-size:${isMobile ? '10px' : '13px'}; font-weight:900; color:var(--primary-blue); text-align:center; margin-top:4px;">${item.nome}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 5. LÓGICA DE INTERAÇÃO
window.verificarEscolha = function(el, nomeEscolhido) {
    const cartaAlvo = ordemCorreta[proximoIndiceAlvo];

    if (nomeEscolhido === cartaAlvo.nome) {
        // ACERTOU
        somAcerto.play();
        const slot = document.getElementById(`slot-${proximoIndiceAlvo}`);
        
        // Efeito de sumir da pilha
        el.style.pointerEvents = "none";
        el.style.opacity = "0";
        el.style.transform = "scale(0.5) translateY(-50px)";
        
        // Aparecer no slot
        slot.style.border = "3px solid #7ed321";
        slot.style.background = "white";
        slot.innerHTML = `
            <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <img src="${JOGO_CONFIG.caminhoImg}${cartaAlvo.img}" style="width:80%; max-height:60%; object-fit:contain;">
                <span style="font-size:10px; font-weight:900; color:var(--primary-blue);">${cartaAlvo.nome}</span>
            </div>
        `;

        proximoIndiceAlvo++;

        // Verificar se completou a rodada
        if (proximoIndiceAlvo === ordemCorreta.length) {
            acertos++;
            document.getElementById('hits-val').innerText = acertos;
            document.getElementById('shelf').style.pointerEvents = "none";
            
            setTimeout(() => {
                indiceAtual++;
                proximaRodada();
            }, 1000);
        }
    } else {
        // ERROU
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        
        // Efeito visual de erro
        el.style.animation = "shake 0.4s ease-in-out";
        el.style.borderColor = "#ff5e5e";
        setTimeout(() => {
            el.style.animation = "";
            el.style.borderColor = "var(--primary-blue)";
        }, 400);
    }
};

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
