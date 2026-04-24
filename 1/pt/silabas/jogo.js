/**
 * MOTOR DE JOGO: ORDENAR SÍLABAS 
 * VERSÃO DEFINITIVA: ARRASTAR + CLICAR + DESFAZER
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let segundos = 0;
let cronometro = null;
let intervalAnim = null;
let categoriaAtiva = "";

// Variáveis de Interação
let draggingEl = null;
let offset = { x: 0, y: 0 };
let isMoved = false;
let isValidating = false;

// 1. INICIALIZAÇÃO
window.startLogic = function() {
    categoriaAtiva = Object.keys(JOGO_CONFIG.categorias)[0];
    window.selecionarCategoria(categoriaAtiva);
};

window.selecionarCategoria = function(chave) {
    if (intervalAnim) clearInterval(intervalAnim);
    if (!JOGO_CONFIG.categorias[chave]) return;
    categoriaAtiva = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    window.atualizarAnimacao(cat);
};

// ANIMAÇÃO REALISTA SEQUENCIAL
window.atualizarAnimacao = function(cat) {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const partes = Array.isArray(cat.silabas) ? cat.silabas : cat.exemplo.split('-');
    
    container.innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; position:relative; width:100%; padding:10px;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:80px; object-fit:contain;">
            <div id="anim-slots" style="display:flex; gap:8px;">
                ${partes.map((_, i) => `<div id="aslot-${i}" class="slot" style="width:40px; height:35px; cursor:default;"></div>`).join('')}
            </div>
            <div id="anim-cards" style="display:flex; gap:8px;">
                ${partes.map((s, i) => `<div id="acard-${i}" class="syll-card" style="padding:5px 12px; font-size:0.9rem; cursor:default;">${s}</div>`).join('')}
            </div>
            <i id="anim-hand" class="fas fa-mouse-pointer" style="position:absolute; color:var(--error-red); font-size:22px; bottom:10px; right:20%; transition:0.6s; opacity:0; z-index:50;"></i>
        </div>
    `;

    const hand = document.getElementById('anim-hand');
    async function rodarSequencia() {
        if (!hand) return;
        partes.forEach((_, i) => {
            const c = document.getElementById(`acard-${i}`); const s = document.getElementById(`aslot-${i}`);
            if(c) { c.style.opacity = "1"; c.style.transform = "translate(0,0)"; }
            if(s) { s.innerHTML = ""; s.style.background = "white"; }
        });
        hand.style.opacity = "0"; 
        await new Promise(r => setTimeout(r, 1000));

        for(let i=0; i<partes.length; i++) {
            const card = document.getElementById(`acard-${i}`);
            const slot = document.getElementById(`aslot-${i}`);
            if(!card || !slot) break;
            const cR = card.getBoundingClientRect(); const sR = slot.getBoundingClientRect(); const contR = container.getBoundingClientRect();
            
            hand.style.opacity = "1";
            hand.style.left = (cR.left - contR.left + 20) + "px"; hand.style.top = (cR.top - contR.top + 10) + "px";
            await new Promise(r => setTimeout(r, 600));

            card.style.transition = "0.6s";
            card.style.transform = `translate(${sR.left - cR.left}px, ${sR.top - cR.top}px)`;
            hand.style.left = (sR.left - contR.left + 20) + "px"; hand.style.top = (sR.top - contR.top + 10) + "px";
            
            await new Promise(r => setTimeout(r, 700));
            card.style.opacity = "0"; slot.innerText = partes[i]; slot.style.background = "#eee";
        }
        await new Promise(r => setTimeout(r, 2000));
        if (container.offsetParent) rodarSequencia();
    }
    rodarSequencia();
};

window.initGame = function() {
    if (cronometro) clearInterval(cronometro);
    indiceQuestao = 0; acertos = 0; erros = 0; segundos = 0; isValidating = false;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('timer-val').innerText = "00:00";
    window.selecionarCategoria(categoriaAtiva);
    iniciarCronometro();
    montarQuestao();
};

function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    if (!item) return;

    isValidating = false;
    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / ${itensAtuais.length}`;
    let baralhadas = [...item.silabas].sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px; animation: fadeIn 0.4s;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:150px; object-fit:contain; pointer-events:none;">
            <div id="slots-container" style="display:flex; gap:12px; justify-content:center; width:100%;">
                ${item.silabas.map(() => `<div class="slot" onpointerdown="removerSyll(this)"></div>`).join('')}
            </div>
            <div id="pool" style="display:flex; gap:15px; flex-wrap:wrap; justify-content:center; min-height:80px; width:100%;">
                ${baralhadas.map(s => `<div class="syll-card" onpointerdown="iniciarPonteiro(event)">${s}</div>`).join('')}
            </div>
        </div>
    `;
}

function iniciarPonteiro(e) {
    if (isValidating) return;
    const card = e.target.closest('.syll-card');
    if (!card || card.style.opacity === "0.3") return;

    draggingEl = card;
    isMoved = false;
    draggingEl.style.zIndex = "1000";
    draggingEl.style.transition = "none";

    const rect = draggingEl.getBoundingClientRect();
    offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    document.addEventListener('pointermove', moverPonteiro);
    document.addEventListener('pointerup', pararPonteiro);
    draggingEl.setPointerCapture(e.pointerId);
}

function moverPonteiro(e) {
    if (!draggingEl) return;
    const container = document.getElementById('game-main-content');
    const cRect = container.getBoundingClientRect();
    
    // Detetar se houve movimento real (>10px)
    if (Math.abs(e.clientX - (draggingEl.getBoundingClientRect().left + offset.x)) > 10) isMoved = true;

    draggingEl.style.position = "absolute";
    draggingEl.style.left = (e.clientX - cRect.left - offset.x) + "px";
    draggingEl.style.top = (e.clientY - cRect.top - offset.y) + "px";
}

function pararPonteiro(e) {
    if (!draggingEl) return;
    document.removeEventListener('pointermove', moverPonteiro);
    document.removeEventListener('pointerup', pararPonteiro);

    // Se não moveu quase nada, tratar como CLIQUE
    if (!isMoved && draggingEl.style.position !== "absolute") {
        autoMoverParaSlot(draggingEl);
    } else {
        // Tratar como ARRASTO
        const target = document.elementFromPoint(e.clientX, e.clientY);
        const slot = target ? target.closest('.slot') : null;

        if (slot && slot.innerText === "") {
            colocarNoSlot(draggingEl, slot);
        } else {
            draggingEl.style.position = "static";
            draggingEl.style.transform = "none";
        }
    }
    
    if (draggingEl) draggingEl.style.zIndex = "10";
    draggingEl = null;
}

function autoMoverParaSlot(card) {
    const slots = document.querySelectorAll('.slot');
    for (let slot of slots) {
        if (slot.innerText === "") { colocarNoSlot(card, slot); break; }
    }
}

function colocarNoSlot(card, slot) {
    slot.innerText = card.innerText;
    slot.classList.add('filled');
    card.style.opacity = "0.3";
    card.style.pointerEvents = "none";
    card.style.position = "static";
    card.style.transform = "none";
    verificarFim();
}

window.removerSyll = function(slot) {
    if (isValidating || slot.innerText === "") return;
    const texto = slot.innerText;
    slot.innerText = "";
    slot.classList.remove('filled');
    const cards = document.querySelectorAll('.syll-card');
    for (let c of cards) {
        if (c.innerText === texto && c.style.opacity === "0.3") {
            c.style.opacity = "1"; c.style.pointerEvents = "auto"; break;
        }
    }
};

function verificarFim() {
    const slots = document.querySelectorAll('.slot');
    const full = Array.from(slots).filter(s => s.innerText !== "");
    if (full.length === itensAtuais[indiceQuestao].silabas.length) {
        isValidating = true;
        validarResposta(full.map(s => s.innerText));
    }
}

function validarResposta(tentativa) {
    const correta = itensAtuais[indiceQuestao].silabas;
    const slots = document.querySelectorAll('.slot');
    
    if (tentativa.join('') === correta.join('')) {
        acertos++; document.getElementById('hits-val').innerText = acertos;
        slots.forEach(s => { s.style.background = "var(--highlight-green)"; s.style.color = "white"; s.style.borderColor = "transparent"; });
        tocarSom('acerto');
    } else {
        erros++; document.getElementById('miss-val').innerText = erros;
        slots.forEach(s => { s.style.background = "var(--error-red)"; s.style.color = "white"; });
        tocarSom('erro');
        setTimeout(() => { slots.forEach((s, i) => { if(correta[i]) { s.innerText = correta[i]; s.style.background = "var(--highlight-green)"; } }); }, 600);
    }
    setTimeout(() => { if (indiceQuestao < itensAtuais.length - 1) { indiceQuestao++; montarQuestao(); } else finalizarJogo(); }, 2000);
}

function finalizarJogo() {
    if (cronometro) clearInterval(cronometro);
    tocarSom('vitoria');
    if (window.mostrarResultados) window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}

function iniciarCronometro() {
    cronometro = setInterval(() => {
        segundos++;
        let m = Math.floor(segundos / 60).toString().padStart(2, '0');
        let s = (segundos % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function tocarSom(t) { if (JOGO_CONFIG.sons[t]) new Audio(JOGO_CONFIG.sons[t]).play().catch(()=>{}); }
const style = document.createElement('style');
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
