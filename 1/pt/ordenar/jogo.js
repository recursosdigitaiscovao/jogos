let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let cartasDaRodada = [];
let ordemCorreta = [];
let slotsEstado = [null, null, null, null]; // Guarda qual carta está em cada slot

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { 
    selecionarCategoria('consecutivas'); 
};

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    CONFIG_MESTRE.area = key;
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px; object-fit:contain;">
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${cat.nome}</p>
            <div style="display:flex; gap:10px; font-size:24px; font-weight:900; color:var(--primary-blue);">
                <span style="animation: bounce 2s infinite;">A</span>
                <span style="animation: bounce 2s infinite 0.2s;">B</span>
                <span style="animation: bounce 2s infinite 0.4s;">C</span>
            </div>
        </div>
        <style>
            @keyframes bounce { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
            @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
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
    slotsEstado = [null, null, null, null];
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;

    // Selecionar 4 itens
    let pool = [...JOGO_CONFIG.categorias[CONFIG_MESTRE.area].itens].sort(() => Math.random() - 0.5);
    cartasDaRodada = pool.slice(0, 4);
    
    // Ordem correta rigorosa (português)
    ordemCorreta = [...cartasDaRodada].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));

    montarInterface();
}

function montarInterface() {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 650;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly; padding: 10px 0;">
            
            <!-- SLOTS (DESTINO) -->
            <div id="shelf" style="display:flex; gap:10px; justify-content:center; width:100%; flex-wrap:nowrap;">
                ${[0,1,2,3].map(i => `
                    <div class="slot" id="slot-${i}" ondrop="drop(event, ${i})" ondragover="allowDrop(event)" onclick="removerDoSlot(${i})" style="
                        width:${isMobile ? '72px' : '110px'}; 
                        height:${isMobile ? '95px' : '140px'}; 
                        border:3px dashed #cbd9e6; border-radius:20px; 
                        background: rgba(255,255,255,0.4);
                        display:flex; align-items:center; justify-content:center;
                        position:relative; cursor:pointer;
                    ">
                        <span id="label-${i}" style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${i+1}º</span>
                    </div>
                `).join('')}
            </div>

            <!-- PILHA DE CARTAS (ORIGEM) -->
            <div id="pile" style="display:flex; gap:12px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:150px;">
                ${cartasDaRodada.sort(() => Math.random() - 0.5).map((item, i) => `
                    <div class="card" id="card-${i}" draggable="true" ondragstart="drag(event, ${i})" onclick="clicarNaCarta(${i})" style="
                        width:${isMobile ? '75px' : '115px'}; 
                        background:white; border:3px solid var(--primary-blue); 
                        border-radius:20px; padding:10px; cursor:grab;
                        box-shadow:0 6px 0 var(--primary-dark);
                        display:flex; flex-direction:column; align-items:center; transition: 0.2s;
                    ">
                        <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; height:${isMobile ? '55px' : '85px'}; object-fit:contain; pointer-events:none;">
                        <span style="font-size:${isMobile ? '10px' : '14px'}; font-weight:900; color:var(--primary-blue); text-align:center; margin-top:5px; text-transform:uppercase;">${item.nome}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// LOGICA DRAG & DROP (PC)
window.allowDrop = (e) => e.preventDefault();
window.drag = (e, index) => { e.dataTransfer.setData("text", index); };
window.drop = (e, slotIdx) => {
    e.preventDefault();
    const cardIdx = e.dataTransfer.getData("text");
    moverParaSlot(cardIdx, slotIdx);
};

// LOGICA CLIQUE
window.clicarNaCarta = (cardIdx) => {
    const firstEmpty = slotsEstado.indexOf(null);
    if (firstEmpty !== -1) moverParaSlot(cardIdx, firstEmpty);
};

window.removerDoSlot = (slotIdx) => {
    const carta = slotsEstado[slotIdx];
    if (carta) {
        const cardEl = document.getElementById(`card-${carta.originalIdx}`);
        const slotEl = document.getElementById(`slot-${slotIdx}`);
        
        // Devolve à pilha
        cardEl.style.opacity = "1";
        cardEl.style.pointerEvents = "auto";
        cardEl.style.transform = "scale(1)";
        
        // Limpa slot
        slotsEstado[slotIdx] = null;
        slotEl.style.background = "rgba(255,255,255,0.4)";
        slotEl.style.border = "3px dashed #cbd9e6";
        slotEl.innerHTML = `<span style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${slotIdx+1}º</span>`;
    }
};

function moverParaSlot(cardIdx, slotIdx) {
    if (slotsEstado[slotIdx] !== null) return; // Slot ocupado

    const cardEl = document.getElementById(`card-${cardIdx}`);
    const slotEl = document.getElementById(`slot-${slotIdx}`);
    const dados = cartasDaRodada[cardIdx];

    // Esconde na pilha
    cardEl.style.opacity = "0";
    cardEl.style.pointerEvents = "none";
    cardEl.style.transform = "scale(0.5)";

    // Guarda no estado
    slotsEstado[slotIdx] = { ...dados, originalIdx: cardIdx };

    // Mostra no slot
    slotEl.style.background = "white";
    slotEl.style.border = "3px solid var(--primary-blue)";
    slotEl.innerHTML = `
        <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: popIn 0.3s forwards;">
            <img src="${JOGO_CONFIG.caminhoImg}${dados.img}" style="width:85%; max-height:75%; object-fit:contain;">
            <span style="font-size:10px; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${dados.nome}</span>
        </div>
    `;

    // Se todos preenchidos, valida
    if (!slotsEstado.includes(null)) {
        setTimeout(validarSequencia, 500);
    }
}

function validarSequencia() {
    let errosNestaRonda = 0;
    
    slotsEstado.forEach((carta, i) => {
        const correta = ordemCorreta[i];
        const slotEl = document.getElementById(`slot-${i}`);

        if (carta.nome === correta.nome) {
            slotEl.style.borderColor = "#7ed321";
        } else {
            errosNestaRonda++;
            devolverComErro(i, carta.originalIdx);
        }
    });

    if (errosNestaRonda === 0) {
        somAcerto.play();
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indiceAtual++; proximaRodada(); }, 1200);
    } else {
        somErro.play();
        erros++;
        document.getElementById('miss-val').innerText = erros;
    }
}

function devolverComErro(slotIdx, cardOriginalIdx) {
    const slotEl = document.getElementById(`slot-${slotIdx}`);
    const cardEl = document.getElementById(`card-${cardOriginalIdx}`);

    slotEl.style.borderColor = "#ff5e5e";
    slotEl.style.animation = "shake 0.4s";

    setTimeout(() => {
        slotsEstado[slotIdx] = null;
        slotEl.style.animation = "";
        slotEl.style.background = "rgba(255,255,255,0.4)";
        slotEl.style.border = "3px dashed #cbd9e6";
        slotEl.innerHTML = `<span style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${slotIdx+1}º</span>`;
        
        cardEl.style.opacity = "1";
        cardEl.style.pointerEvents = "auto";
        cardEl.style.transform = "scale(1)";
    }, 800);
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    const tempoFinal = document.getElementById('timer-val').innerText;
    window.mostrarResultados(acertos, tempoFinal);
}
