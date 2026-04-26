let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let cartasDaRodada = [];
let ordemCorreta = [];
let slotsEstado = [null, null, null, null, null]; 
let totalCartasNivel = 4;

// Variáveis para Drag & Drop no Telemóvel
let activeTouchCard = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria(CONFIG_MESTRE.area); };

// ANIMAÇÃO DE INTRODUÇÃO (TUTORIAL REAL)
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="position:relative; width:100%; height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; transform:scale(0.9);">
            <div style="display:flex; gap:10px; margin-bottom:50px;">
                <div id="demo-slot" style="width:45px; height:60px; border:2px dashed var(--primary-blue); border-radius:10px; background:rgba(255,255,255,0.2);"></div>
                <div style="width:45px; height:60px; border:2px dashed var(--primary-blue); border-radius:10px; opacity:0.3;"></div>
            </div>
            <div style="display:flex; gap:15px;">
                <div id="demo-card" style="width:45px; height:60px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); z-index:5;">A</div>
                <div style="width:45px; height:60px; background:white; border:3px solid var(--primary-blue); border-radius:10px; opacity:0.3;"></div>
            </div>
            <div id="demo-hand" style="position:absolute; bottom:10px; right:20%; font-size:35px; z-index:10;">👆</div>
        </div>
        <style>
            @keyframes tutHand { 0% { transform: translate(0,0); } 30% { transform: translate(-75px, -15px); } 60% { transform: translate(-75px, -110px); } 80% { transform: translate(-75px, -110px); } 100% { transform: translate(0,0); } }
            @keyframes tutCard { 0%, 30% { transform: translate(0,0); opacity:1; } 60%, 80% { transform: translate(0, -95px); border-color:#7ed321; opacity:1; } 90%, 100% { opacity:0; } }
            #demo-hand { animation: tutHand 3s infinite ease-in-out; }
            #demo-card { animation: tutCard 3s infinite ease-in-out; }
            @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        </style>
    `;
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    totalCartasNivel = JOGO_CONFIG.niveis_regra.find(n => n.id === CONFIG_MESTRE.nivel).cartas;
    iniciarTimer(); proximaRodada(); 
};

function iniciarTimer() {
    clearInterval(intervaloTimer); tempoInicio = Date.now();
    intervaloTimer = setInterval(() => {
        const d = Math.floor((Date.now() - tempoInicio) / 1000);
        document.getElementById('timer-val').innerText = `${Math.floor(d/60).toString().padStart(2,'0')}:${(d%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    slotsEstado = Array(totalCartasNivel).fill(null);
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;

    const pool = [...JOGO_CONFIG.categorias[CONFIG_MESTRE.area].itens];
    if (CONFIG_MESTRE.area === 'consecutivas') {
        let start = Math.floor(Math.random() * (pool.length - (totalCartasNivel - 1)));
        cartasDaRodada = pool.slice(start, start + totalCartasNivel);
    } else if (CONFIG_MESTRE.area === 'mesma_inicial') {
        const grupos = {};
        pool.forEach(it => { const l = it.nome[0]; if(!grupos[l]) grupos[l] = []; grupos[l].push(it); });
        const validas = Object.keys(grupos).filter(l => grupos[l].length >= totalCartasNivel);
        const sorteada = validas[Math.floor(Math.random() * validas.length)] || Object.keys(grupos)[0];
        cartasDaRodada = grupos[sorteada].sort(() => Math.random() - 0.5).slice(0, totalCartasNivel);
    } else {
        cartasDaRodada = pool.sort(() => Math.random() - 0.5).slice(0, totalCartasNivel);
    }
    
    ordemCorreta = [...cartasDaRodada].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
    montarInterface();
}

function montarInterface() {
    const container = document.getElementById('game-main-content');
    const isLand = window.innerWidth > window.innerHeight;
    const isMob = window.innerWidth < 650;
    
    // Regras de Grelha baseadas no pedido
    let cols = 3;
    if(!isLand) { // Portrait
        if(totalCartasNivel === 3) cols = 3;
        if(totalCartasNivel === 4) cols = 3; // 3+3+2 logic via flex-wrap
        if(totalCartasNivel === 5) cols = 3;
    } else { // Landscape
        if(totalCartasNivel === 3) cols = 3;
        if(totalCartasNivel === 4) cols = 4;
        if(totalCartasNivel === 5) cols = 4;
    }

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly; padding: 5px 0; touch-action: none;">
            <div id="shelf" style="display:flex; gap:8px; justify-content:center; width:100%; flex-wrap:wrap; max-width:800px;">
                ${slotsEstado.map((_, i) => `
                    <div class="slot" id="slot-${i}" ondrop="drop(event, ${i})" ondragover="allowDrop(event)" onclick="removerDoSlot(${i})" style="
                        width:${isMob ? '65px' : '100px'}; height:${isMob ? '85px' : '130px'}; 
                        border:3px dashed #cbd9e6; border-radius:18px; background:rgba(255,255,255,0.4);
                        display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer;">
                        <span style="position:absolute; top:4px; font-size:10px; color:#cbd9e6; font-weight:900;">${i+1}º</span>
                    </div>`).join('')}
            </div>
            <div id="pile" style="display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:120px;">
                ${[...cartasDaRodada].sort(() => Math.random() - 0.5).map((item) => `
                    <div class="card" id="card-${item.nome}" draggable="true" ondragstart="drag(event, '${item.nome}')" onclick="clicarNaCarta('${item.nome}')"
                         ontouchstart="handleTouchStart(event, '${item.nome}')" ontouchmove="handleTouchMove(event)" ontouchend="handleTouchEnd(event)"
                         style="width:${isMob ? '70px' : '110px'}; background:white; border:3px solid var(--primary-blue); border-radius:18px; padding:8px; cursor:grab; box-shadow:0 6px 0 var(--primary-dark); display:flex; flex-direction:column; align-items:center; transition: transform 0.1s;">
                        <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; height:${isMob ? '45px' : '80px'}; object-fit:contain; pointer-events:none;">
                        <span style="font-size:${isMob ? '9px' : '13px'}; font-weight:900; color:var(--primary-blue); text-align:center; margin-top:4px; text-transform:uppercase;">${item.nome}</span>
                    </div>`).join('')}
            </div>
        </div>
    `;
}

// ARRASTAR MOBILE
window.handleTouchStart = (e, nome) => {
    activeTouchCard = document.getElementById(`card-${nome}`);
    const t = e.touches[0]; const r = activeTouchCard.getBoundingClientRect();
    touchOffsetX = t.clientX - r.left; touchOffsetY = t.clientY - r.top;
    activeTouchCard.style.transition = "none"; activeTouchCard.style.zIndex = "1000";
};
window.handleTouchMove = (e) => {
    if (!activeTouchCard) return; e.preventDefault();
    const t = e.touches[0]; activeTouchCard.style.position = "fixed";
    activeTouchCard.style.left = (t.clientX - touchOffsetX) + "px"; activeTouchCard.style.top = (t.clientY - touchOffsetY) + "px";
};
window.handleTouchEnd = (e) => {
    if (!activeTouchCard) return;
    activeTouchCard.style.display = "none"; 
    const t = e.changedTouches[0]; const target = document.elementFromPoint(t.clientX, t.clientY);
    activeTouchCard.style.display = "flex"; 
    const slot = target ? target.closest('.slot') : null;
    const nome = activeTouchCard.id.replace("card-", "");
    if (slot) moverParaSlot(nome, parseInt(slot.id.replace("slot-", "")));
    activeTouchCard.style.position = "relative"; activeTouchCard.style.left = "0"; activeTouchCard.style.top = "0"; activeTouchCard.style.zIndex = "100"; activeTouchCard = null;
};

// INTERAÇÃO GERAL
window.allowDrop = (e) => e.preventDefault();
window.drag = (e, nome) => e.dataTransfer.setData("text", nome);
window.drop = (e, slotIdx) => { e.preventDefault(); moverParaSlot(e.dataTransfer.getData("text"), slotIdx); };
window.clicarNaCarta = (nome) => { const idx = slotsEstado.indexOf(null); if(idx !== -1) moverParaSlot(nome, idx); };
window.removerDoSlot = (idx) => {
    const carta = slotsEstado[idx];
    if (carta) {
        const cardEl = document.getElementById(`card-${carta.nome}`);
        const slotEl = document.getElementById(`slot-${idx}`);
        cardEl.style.opacity = "1"; cardEl.style.pointerEvents = "auto";
        slotsEstado[idx] = null;
        slotEl.style.background = "rgba(255,255,255,0.4)"; slotEl.style.border = "3px dashed #cbd9e6";
        slotEl.innerHTML = `<span style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${idx+1}º</span>`;
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
    slotEl.style.background = "white"; slotEl.style.border = "3px solid var(--primary-blue)";
    slotEl.innerHTML = `<div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: popIn 0.3s forwards;"><img src="${JOGO_CONFIG.caminhoImg}${dados.img}" style="width:85%; max-height:75%; object-fit:contain;"><span style="font-size:9px; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${dados.nome}</span></div>`;
    if (!slotsEstado.includes(null)) setTimeout(validarSequencia, 600);
}

function validarSequencia() {
    let err = 0;
    slotsEstado.forEach((c, i) => {
        const sEl = document.getElementById(`slot-${i}`);
        if (c.nome === ordemCorreta[i].nome) sEl.style.borderColor = "#7ed321";
        else { err++; devolverComErro(i, c.nome); }
    });
    if (err === 0) {
        somAcerto.play(); acertos++; document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indiceAtual++; proximaRodada(); }, 1200);
    } else { somErro.play(); erros++; document.getElementById('miss-val').innerText = erros; }
}

function devolverComErro(sIdx, nome) {
    const sEl = document.getElementById(`slot-${sIdx}`);
    const cEl = document.getElementById(`card-${nome}`);
    sEl.style.borderColor = "#ff5e5e"; sEl.style.animation = "shake 0.4s";
    setTimeout(() => {
        slotsEstado[sIdx] = null; sEl.style.animation = ""; sEl.style.background = "rgba(255,255,255,0.4)";
        sEl.style.border = "3px dashed #cbd9e6"; sEl.innerHTML = `<span style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${sIdx+1}º</span>`;
        cEl.style.opacity = "1"; cEl.style.pointerEvents = "auto";
    }, 800);
}

function finalizarJogo() {
    clearInterval(intervaloTimer); somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
