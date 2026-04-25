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

window.startLogic = function() { 
    selecionarCategoria('consecutivas'); 
};

// ANIMAÇÃO DE INTRODUÇÃO DINÂMICA
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    
    CONFIG_MESTRE.area = key;
    
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:75px; object-fit:contain;">
            </div>
            <div style="display:flex; gap:8px;">
                <div class="demo-card" style="width:38px; height:48px; background:white; border:2px solid var(--primary-blue); border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); animation: bounce 2s infinite;">1º</div>
                <div class="demo-card" style="width:38px; height:48px; background:white; border:2px solid var(--primary-blue); border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); animation: bounce 2s infinite 0.2s;">2º</div>
                <div class="demo-card" style="width:38px; height:48px; background:white; border:2px solid var(--primary-blue); border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); animation: bounce 2s infinite 0.4s;">3º</div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-transform:uppercase; letter-spacing:1px;">${cat.nome}</p>
        </div>
        <style>
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
            @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        </style>`;
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
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

function proximaRodada() {
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    proximoIndiceAlvo = 0;
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;

    // Selecionar 4 itens aleatórios da categoria ativa
    let pool = [...JOGO_CONFIG.categorias[CONFIG_MESTRE.area].itens];
    cartasDaRodada = pool.sort(() => Math.random() - 0.5).slice(0, 4);
    
    // Definir ordem alfabética (respeitando acentos do Português)
    ordemCorreta = [...cartasDaRodada].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));

    montarInterface();
}

function montarInterface() {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 650;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly; padding: 10px 0;">
            
            <!-- ÁREA DE CHEGADA (SLOTS) -->
            <div id="target-shelf" style="display:flex; gap:10px; justify-content:center; width:100%; flex-wrap:nowrap;">
                ${ordemCorreta.map((_, i) => `
                    <div class="slot" id="slot-${i}" style="
                        width:${isMobile ? '72px' : '110px'}; 
                        height:${isMobile ? '95px' : '140px'}; 
                        border:3px dashed #cbd9e6; border-radius:20px; 
                        background: rgba(255,255,255,0.4);
                        display:flex; flex-direction:column; align-items:center; justify-content:center;
                        position:relative;
                    ">
                        <span style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${i+1}º</span>
                    </div>
                `).join('')}
            </div>

            <!-- ÁREA DE ESCOLHA (CARTÕES) -->
            <div id="source-pile" style="display:flex; gap:12px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:150px;">
                ${[...cartasDaRodada].sort(() => Math.random() - 0.5).map((item, i) => `
                    <div class="alphabet-card" onclick="checkOrder(this, '${item.nome}')" style="
                        width:${isMobile ? '75px' : '115px'}; 
                        background:white; border:3px solid var(--primary-blue); 
                        border-radius:20px; padding:10px; cursor:pointer;
                        box-shadow:0 6px 0 var(--primary-dark);
                        transition: 0.2s; display:flex; flex-direction:column; align-items:center;
                    ">
                        <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; height:${isMobile ? '55px' : '85px'}; object-fit:contain; pointer-events:none;">
                        <span style="font-size:${isMobile ? '10px' : '14px'}; font-weight:900; color:var(--primary-blue); text-align:center; margin-top:6px; text-transform:uppercase; letter-spacing:1px;">${item.nome}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.checkOrder = function(el, nomeClicado) {
    const alvo = ordemCorreta[proximoIndiceAlvo];

    if (nomeClicado === alvo.nome) {
        // ACERTO
        somAcerto.play();
        const slot = document.getElementById(`slot-${proximoIndiceAlvo}`);
        
        // Efeito visual de saída
        el.style.pointerEvents = "none";
        el.style.opacity = "0";
        el.style.transform = "scale(0.5) translateY(-50px)";
        
        // Colocar no slot
        slot.style.border = "3px solid #7ed321";
        slot.style.background = "white";
        slot.innerHTML = `
            <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: popIn 0.4s forwards;">
                <img src="${JOGO_CONFIG.caminhoImg}${alvo.img}" style="width:85%; max-height:75%; object-fit:contain;">
                <span style="font-size:10px; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${alvo.nome}</span>
            </div>
        `;

        proximoIndiceAlvo++;

        // Terminou a ronda?
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
