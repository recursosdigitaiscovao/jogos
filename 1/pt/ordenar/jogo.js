let itensAtuais = [];
let indiceAtual = 0;
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

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="display:flex; gap:10px;">
                <div style="width:40px; height:50px; background:white; border:2px solid #5ba4e5; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#5ba4e5; animation: bounce 2s infinite;">A</div>
                <div style="width:40px; height:50px; background:white; border:2px solid #5ba4e5; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#5ba4e5; animation: bounce 2s infinite 0.2s;">B</div>
                <div style="width:40px; height:50px; background:white; border:2px solid #5ba4e5; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#5ba4e5; animation: bounce 2s infinite 0.4s;">C</div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-align:center;">ORDENA OS CARTÕES!</p>
        </div>
        <style>@keyframes bounce { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }</style>`;
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    iniciarTimer(); 
    proximaRodada(); 
};

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoInicio = Date.now();
    intervaloTimer = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        document.getElementById('timer-val').innerText = `${Math.floor(decorrido/60).toString().padStart(2,'0')}:${(decorrido%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    
    proximoIndiceAlvo = 0;
    
    // DEFINIÇÃO DOS NÍVEIS (Quantidade de cartas)
    let qtdCartas = 3; // Nível 1
    if (indiceAtual >= 3) qtdCartas = 4; // Nível 2
    if (indiceAtual >= 7) qtdCartas = 5; // Nível 3

    // Pegar cartas aleatórias
    let disponiveis = [...JOGO_CONFIG.categorias[CONFIG_MESTRE.area].itens].sort(() => Math.random() - 0.5);
    cartasDaRodada = disponiveis.slice(0, qtdCartas);
    
    // Definir a ordem correta alfabética
    ordemCorreta = [...cartasDaRodada].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));

    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;
    montarInterface();
}

function montarInterface() {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 650;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 10px 0;">
            
            <!-- PRATELEIRA DE DESTINO -->
            <div id="target-slots" style="display:flex; gap:8px; justify-content:center; width:100%; flex-wrap:nowrap;">
                ${ordemCorreta.map((_, i) => `
                    <div class="slot" id="slot-${i}" style="
                        width:${isMobile ? '60px' : '90px'}; 
                        height:${isMobile ? '80px' : '110px'}; 
                        border:3px dashed #cbd9e6; border-radius:15px; 
                        display:flex; flex-direction:column; align-items:center; justify-content:center;
                        position:relative;
                    ">
                        <span style="position:absolute; bottom:5px; font-size:10px; color:#cbd9e6; font-weight:900;">${i+1}º</span>
                    </div>
                `).join('')}
            </div>

            <!-- CARTÕES PARA ORGANIZAR -->
            <div id="source-pool" style="display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:120px;">
                ${cartasDaRodada.sort(() => Math.random() - 0.5).map((item, i) => `
                    <div class="word-card" onclick="clicarCarta(this, '${item.nome}')" id="card-${i}" style="
                        width:${isMobile ? '65px' : '95px'}; 
                        background:white; border:3px solid var(--primary-blue); 
                        border-radius:15px; padding:5px; cursor:pointer;
                        box-shadow:0 5px 0 var(--primary-dark);
                        transition: 0.3s; display:flex; flex-direction:column; align-items:center;
                    ">
                        <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:80%; height:auto; pointer-events:none;">
                        <span style="font-size:${isMobile ? '10px' : '12px'}; font-weight:900; color:var(--primary-blue); text-align:center;">${item.nome}</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function clicarCarta(el, nome) {
    const alvo = ordemCorreta[proximoIndiceAlvo];

    if (nome === alvo.nome) {
        // ACERTO
        somAcerto.play();
        const slot = document.getElementById(`slot-${proximoIndiceAlvo}`);
        
        // Mover visualmente
        el.style.pointerEvents = "none";
        el.style.opacity = "0";
        el.style.transform = "scale(0.5)";
        
        // Criar cópia no slot
        slot.innerHTML = `
            <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: popIn 0.3s forwards;">
                <img src="${JOGO_CONFIG.caminhoImg}${alvo.img}" style="width:70%;">
                <span style="font-size:9px; font-weight:900; color:var(--primary-blue);">${alvo.nome}</span>
            </div>
        `;
        slot.style.border = "3px solid #7ed321";
        slot.style.background = "#f2faf0";

        proximoIndiceAlvo++;

        // Verificar se terminou a ronda
        if (proximoIndiceAlvo === ordemCorreta.length) {
            acertos++;
            document.getElementById('hits-val').innerText = acertos;
            setTimeout(() => {
                indiceAtual++;
                proximaRodada();
            }, 1000);
        }
    } else {
        // ERRO
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        el.style.animation = "shake 0.4s";
        setTimeout(() => el.style.animation = "", 400);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}

// Estilos extras para animação
const style = document.createElement('style');
style.innerHTML = `
    @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
`;
document.head.appendChild(style);
