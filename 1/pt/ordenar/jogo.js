let itensAtuais = Array(10).fill({}); 
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let cartasDaRodada = [];
let ordemCorreta = [];
let slotsEstado = [null, null, null, null]; 
let catAtiva = "consecutivas";

// Variáveis para Arrastar no Telemóvel
let activeTouchCard = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('consecutivas'); };

// 1. ANIMAÇÃO DE INTRODUÇÃO PROFISSIONAL (TUTORIAL)
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    catAtiva = key;

    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="position:relative; width:100%; height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden;">
            <!-- Slots -->
            <div style="display:flex; gap:10px; margin-bottom:50px;">
                <div id="demo-slot" style="width:45px; height:60px; border:2px dashed var(--primary-blue); border-radius:10px; background:rgba(255,255,255,0.2);"></div>
                <div style="width:45px; height:60px; border:2px dashed var(--primary-blue); border-radius:10px; opacity:0.3;"></div>
            </div>
            <!-- Cartas -->
            <div style="display:flex; gap:15px;">
                <div id="demo-card" style="width:45px; height:60px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); z-index:5; transition: border-color 0.3s;">A</div>
                <div style="width:45px; height:60px; background:white; border:3px solid var(--primary-blue); border-radius:10px; opacity:0.3;"></div>
            </div>
            <!-- Mão Animada -->
            <div id="demo-hand" style="position:absolute; bottom:10px; right:20%; font-size:35px; z-index:10; pointer-events:none;">👆</div>
            <p style="margin-top:15px; font-weight:900; color:var(--primary-blue); text-transform:uppercase; font-size:13px;">${cat.nome}</p>
        </div>
        <style>
            @keyframes tutorialMove {
                0% { transform: translate(0, 0); }
                30% { transform: translate(-75px, -15px); } /* Pega a carta */
                60% { transform: translate(-75px, -110px); } /* Leva ao slot */
                80% { transform: translate(-75px, -110px); } /* Pausa */
                100% { transform: translate(0, 0); }
            }
            @keyframes cardFollow {
                0%, 30% { transform: translate(0, 0); opacity:1; }
                60%, 80% { transform: translate(0, -95px); border-color:#7ed321; opacity:1; }
                90%, 100% { opacity:0; }
            }
            #demo-hand { animation: tutorialMove 3s infinite ease-in-out; }
            #demo-card { animation: cardFollow 3s infinite ease-in-out; }
            @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        </style>
    `;
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
        document.getElementById('timer-val').innerText = `${Math.floor(decorrido/60).toString().padStart(2,'0')}:${(decorrido%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    slotsEstado = [null, null, null, null];
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;

    const pool = [...JOGO_CONFIG.categorias[catAtiva].itens];

    if (catAtiva === 'consecutivas') {
        let start = Math.floor(Math.random() * (pool.length - 3));
        cartasDaRodada = pool.slice(start, start + 4);
    } else if (catAtiva === 'mesma_inicial') {
        const grupos = {};
        pool.forEach(it => {
            const letra = it.nome.charAt(0).toUpperCase();
            if(!grupos[letra]) grupos[letra] = [];
            grupos[letra].push(it);
        });
        const letrasValidas = Object.keys(grupos).filter(l => grupos[l].length >= 4);
        const letraSorteada = letrasValidas[Math.floor(Math.random() * letrasValidas.length)] || Object.keys(grupos)[0];
        cartasDaRodada = grupos[letraSorteada].sort(() => Math.random() - 0.5).slice(0, 4);
    } else {
        cartasDaRodada = pool.sort(() => Math.random() - 0.5).slice(0, 4);
    }
    
    ordemCorreta = [...cartasDaRodada].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
    montarInterface();
}

function montarInterface() {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 650;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly; padding: 10px 0; touch-action: none;">
            <div id="shelf" style="display:flex; gap:10px; justify-content:center; width:100%;">
                ${[0,1,2,3].map(i => `
                    <div class="slot" id="slot-${i}" ondrop="drop(event, ${i})" ondragover="allowDrop(event)" onclick="removerDoSlot(${i})" style="
                        width:${isMobile ? '75px' : '110px'}; height:${isMobile ? '95px' : '140px'}; 
                        border:3px dashed #cbd9e6; border-radius:20px; background:rgba(255,255,255,0.4);
                        display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer;">
                        <span id="label-${i}" style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${i+1}º</span>
                    </div>`).join('')}
            </div>

            <div id="pile" style="display:flex; gap:12px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:150px;">
                ${[...cartasDaRodada].sort(() => Math.random() - 0.5).map((item) => `
                    <div class="card" id="card-${item.nome}" draggable="true" 
                         ondragstart="drag(event, '${item.nome}')" 
                         onclick="clicarNaCarta('${item.nome}')"
                         ontouchstart="handleTouchStart(event, '${item.nome}')"
                         ontouchmove="handleTouchMove(event)"
                         ontouchend="handleTouchEnd(event)"
                         style="width:${isMobile ? '78px' : '115px'}; background:white; border:3px solid var(--primary-blue); 
                         border-radius:20px; padding:8px; cursor:grab; box-shadow:0 6px 0 var(--primary-dark);
                         display:flex; flex-direction:column; align-items:center; transition: transform 0.1s; z-index:100;">
                        <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; height:${isMobile ? '55px' : '85px'}; object-fit:contain; pointer-events:none;">
                        <span style="font-size:${isMobile ? '9px' : '13px'}; font-weight:900; color:var(--primary-blue); text-align:center; margin-top:5px; text-transform:uppercase;">${item.nome}</span>
                    </div>`).join('')}
            </div>
        </div>
    `;
}

// --- LÓGICA DE ARRASTAR (TOUCH MOBILE) ---
window.handleTouchStart = function(e, nome) {
    activeTouchCard = document.getElementById(`card-${nome}`);
    const touch = e.touches[0];
    const rect = activeTouchCard.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;
    activeTouchCard.style.transition = "none";
    activeTouchCard.style.zIndex = "1000";
};

window.handleTouchMove = function(e) {
    if (!activeTouchCard) return;
    e.preventDefault();
    const touch = e.touches[0];
    activeTouchCard.style.position = "fixed";
    activeTouchCard.style.left = (touch.clientX - touchOffsetX) + "px";
    activeTouchCard.style.top = (touch.clientY - touchOffsetY) + "px";
};

window.handleTouchEnd = function(e) {
    if (!activeTouchCard) return;
    activeTouchCard.style.display = "none"; 
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    activeTouchCard.style.display = "flex"; 

    const slot = dropTarget ? dropTarget.closest('.slot') : null;
    const cardNome = activeTouchCard.id.replace("card-", "");

    if (slot) {
        const slotIdx = parseInt(slot.id.replace("slot-", ""));
        moverParaSlot(cardNome, slotIdx);
    }

    // Reset visual da carta se não ficou no slot
    activeTouchCard.style.position = "relative";
    activeTouchCard.style.left = "0";
    activeTouchCard.style.top = "0";
    activeTouchCard.style.zIndex = "100";
    activeTouchCard = null;
};

// --- LÓGICA DE ARRASTAR (MOUSE PC) ---
window.allowDrop = (e) => e.preventDefault();
window.drag = (e, nome) => { e.dataTransfer.setData("text", nome); };
window.drop = (e, slotIdx) => {
    e.preventDefault();
    moverParaSlot(e.dataTransfer.getData("text"), slotIdx);
};

// --- LÓGICA DE CLIQUE ---
window.clicarNaCarta = (nome) => {
    if (activeTouchCard) return; // Evita conflito touch/click
    const firstEmpty = slotsEstado.indexOf(null);
    if (firstEmpty !== -1) moverParaSlot(nome, firstEmpty);
};

window.removerDoSlot = (slotIdx) => {
    const carta = slotsEstado[slotIdx];
    if (carta) {
        const cardEl = document.getElementById(`card-${carta.nome}`);
        const slotEl = document.getElementById(`slot-${slotIdx}`);
        cardEl.style.opacity = "1"; cardEl.style.pointerEvents = "auto";
        slotsEstado[slotIdx] = null;
        slotEl.style.background = "rgba(255,255,255,0.4)"; slotEl.style.border = "3px dashed #cbd9e6";
        slotEl.innerHTML = `<span style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${slotIdx+1}º</span>`;
    }
};

function moverParaSlot(nome, slotIdx) {
    if (slotsEstado[slotIdx] !== null) return;
    const cardEl = document.getElementById(`card-${nome}`);
    const slotEl = document.getElementById(`slot-${slotIdx}`);
    const dados = cartasDaRodada.find(c => c.nome === nome);
    if(!cardEl || !dados) return;

    cardEl.style.opacity = "0"; cardEl.style.pointerEvents = "none";
    slotsEstado[slotIdx] = dados;

    slotEl.style.background = "white";
    slotEl.style.border = "3px solid var(--primary-blue)";
    slotEl.innerHTML = `
        <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: popIn 0.3s forwards;">
            <img src="${JOGO_CONFIG.caminhoImg}${dados.img}" style="width:85%; max-height:75%; object-fit:contain;">
            <span style="font-size:9px; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${dados.nome}</span>
        </div>`;
    
    if (!slotsEstado.includes(null)) setTimeout(validarSequencia, 600);
}

function validarSequencia() {
    let errosRonda = 0;
    slotsEstado.forEach((carta, i) => {
        if (!carta) return;
        const slotEl = document.getElementById(`slot-${i}`);
        if (carta.nome === ordemCorreta[i].nome) {
            slotEl.style.borderColor = "#7ed321";
        } else {
            errosRonda++;
            devolverComErro(i, carta.nome);
        }
    });

    if (errosRonda === 0) {
        somAcerto.play(); acertos++; 
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indiceAtual++; proximaRodada(); }, 1200);
    } else {
        somErro.play(); erros++; 
        document.getElementById('miss-val').innerText = erros;
    }
}

function devolverComErro(slotIdx, nome) {
    const slotEl = document.getElementById(`slot-${slotIdx}`);
    const cardEl = document.getElementById(`card-${nome}`);
    slotEl.style.borderColor = "#ff5e5e"; slotEl.style.animation = "shake 0.4s";
    setTimeout(() => {
        slotsEstado[slotIdx] = null;
        slotEl.style.animation = ""; slotEl.style.background = "rgba(255,255,255,0.4)";
        slotEl.style.border = "3px dashed #cbd9e6";
        slotEl.innerHTML = `<span style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${slotIdx+1}º</span>`;
        cardEl.style.opacity = "1"; cardEl.style.pointerEvents = "auto";
    }, 800);
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    const tempoFinal = document.getElementById('timer-val').innerText;
    window.mostrarResultados(acertos, tempoFinal);
}
