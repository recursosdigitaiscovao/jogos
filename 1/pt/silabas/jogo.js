/**
 * MOTOR DE JOGO: ORDENAR SÍLABAS (SISTEMA HÍBRIDO E INDESTRUTÍVEL)
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let segundos = 0;
let cronometro = null;
let intervalAnim = null;
let categoriaAtiva = "";

// Variáveis de Controlo de Arrastar
let draggingEl = null;
let startX = 0, startY = 0;
let isMoving = false;
let isValidating = false;

window.startLogic = function() {
    categoriaAtiva = Object.keys(JOGO_CONFIG.categorias)[0];
    window.selecionarCategoria(categoriaAtiva);
};

window.selecionarCategoria = function(chave) {
    if (intervalAnim) clearInterval(intervalAnim);
    if (!JOGO_CONFIG.categorias[chave]) return;
    categoriaAtiva = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    // Escolhe sempre 10 itens aleatórios da categoria
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    window.atualizarAnimacao(cat);
};

// ANIMAÇÃO REALISTA (Move todas as peças uma a uma)
window.atualizarAnimacao = function(cat) {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    const partes = cat.exemplo.split('-');
    
    container.innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; position:relative; width:100%; padding:10px;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:90px; object-fit:contain;">
            <div style="display:flex; gap:8px;">
                ${partes.map((_, i) => `<div id="aslot-${i}" class="slot" style="width:45px; height:35px; border-width:1px;"></div>`).join('')}
            </div>
            <div style="display:flex; gap:8px;">
                ${partes.map((s, i) => `<div id="acard-${i}" class="syll-card" style="padding:5px 12px; font-size:0.9rem;">${s}</div>`).join('')}
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
            const card = document.getElementById(`acard-${i}`); const slot = document.getElementById(`aslot-${i}`);
            if(!card || !slot) break;
            const cRect = card.getBoundingClientRect(); const sRect = slot.getBoundingClientRect();
            const contRect = container.getBoundingClientRect();
            hand.style.opacity = "1";
            hand.style.left = (cRect.left - contRect.left + 20) + "px"; hand.style.top = (cRect.top - contRect.top + 10) + "px";
            await new Promise(r => setTimeout(r, 600));
            card.style.transition = "0.6s"; card.style.transform = `translate(${sRect.left - cRect.left}px, ${sRect.top - cRect.top}px)`;
            hand.style.left = (sRect.left - contRect.left + 20) + "px"; hand.style.top = (sRect.top - contRect.top + 10) + "px";
            await new Promise(r => setTimeout(r, 700));
            card.style.opacity = "0"; slot.innerHTML = `<span style="font-size:0.8rem;">${partes[i]}</span>`; slot.style.background = "#f0f7ff";
        }
        await new Promise(r => setTimeout(r, 2000));
        if (container.offsetParent !== null) rodarSequencia();
    }
    rodarSequencia();
};

window.initGame = function() {
    if (cronometro) clearInterval(cronometro);
    indiceQuestao = 0; acertos = 0; erros = 0; segundos = 0; isValidating = false;
    document.getElementById('hits-val').innerText = "0"; document.getElementById('miss-val').innerText = "0";
    document.getElementById('timer-val').innerText = "00:00";
    // Sorteia novos itens ao carregar o jogo
    window.selecionarCategoria(categoriaAtiva);
    iniciarCronometro(); montarQuestao();
};

function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    if (!item) return;
    isValidating = false;
    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / ${itensAtuais.length}`;
    let baralhadas = [...item.silabas].sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:25px; animation: fadeIn 0.4s;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:140px; object-fit:contain;">
            <div id="slots-row" style="display:flex; gap:10px; justify-content:center; width:100%;">
                ${item.silabas.map(() => `<div class="slot" onpointerdown="removerSyll(event)"></div>`).join('')}
            </div>
            <div id="pool" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; min-height:60px;">
                ${baralhadas.map(s => `<div class="syll-card" onpointerdown="startInteract(event)">${s}</div>`).join('')}
            </div>
        </div>
    `;
}

// INTERAÇÃO HÍBRIDA (CLICK OU ARRASTO)
function startInteract(e) {
    if (isValidating) return;
    const el = e.target.closest('.syll-card');
    if (!el || el.style.opacity === "0.3") return;

    draggingEl = el; isMoving = false;
    startX = e.clientX || e.touches[0].clientX;
    startY = e.clientY || e.touches[0].clientY;
    el.style.zIndex = "1000"; el.style.transition = "none";

    document.addEventListener('pointermove', moveInteract);
    document.addEventListener('pointerup', stopInteract);
}

function moveInteract(e) {
    if (!draggingEl) return;
    const curX = e.clientX || e.touches[0].clientX;
    const curY = e.clientY || e.touches[0].clientY;
    if (Math.abs(curX - startX) > 10 || Math.abs(curY - startY) > 10) isMoving = true;
    if (isMoving) draggingEl.style.transform = `translate(${curX - startX}px, ${curY - startY}px)`;
}

function stopInteract(e) {
    if (!draggingEl) return;
    document.removeEventListener('pointermove', moveInteract);
    document.removeEventListener('pointerup', stopInteract);

    const curX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : 0);
    const curY = e.clientY || (e.changedTouches ? e.changedTouches[0].clientY : 0);
    
    if (!isMoving) {
        autoMove(draggingEl);
    } else {
        const target = document.elementFromPoint(curX, curY);
        const slot = target ? target.closest('.slot') : null;
        if (slot && slot.innerText === "") place(draggingEl, slot);
        else { draggingEl.style.transition = "0.3s"; draggingEl.style.transform = "translate(0,0)"; }
    }
    draggingEl.style.zIndex = "10"; draggingEl = null;
}

function autoMove(card) {
    const slots = document.querySelectorAll('.slot');
    for (let s of slots) { if (s.innerText === "") { place(card, s); break; } }
}

function place(card, slot) {
    slot.innerText = card.innerText; slot.classList.add('filled');
    card.style.opacity = "0.3"; card.style.pointerEvents = "none";
    card.style.transform = "translate(0,0)"; checkFinish();
}

window.removerSyll = function(e) {
    if (isValidating) return;
    const slot = e.target.closest('.slot');
    if (slot && slot.innerText !== "") {
        const txt = slot.innerText;
        slot.innerText = ""; slot.classList.remove('filled'); slot.style.background = "white";
        const cards = document.querySelectorAll('.syll-card');
        for (let c of cards) { if (c.innerText === txt && c.style.opacity === "0.3") { c.style.opacity = "1"; c.style.pointerEvents = "auto"; break; } }
    }
};

function checkFinish() {
    const slots = document.querySelectorAll('.slot');
    const full = Array.from(slots).filter(s => s.innerText !== "");
    if (full.length === itensAtuais[indiceQuestao].silabas.length) {
        isValidating = true;
        validar(full.map(s => s.innerText));
    }
}

function validar(tentativa) {
    const correta = itensAtuais[indiceQuestao].silabas;
    const slots = document.querySelectorAll('.slot');
    if (tentativa.join('') === correta.join('')) {
        acertos++; document.getElementById('hits-val').innerText = acertos;
        slots.forEach(s => { s.style.background = "var(--highlight-green)"; s.style.color = "white"; });
        tocarSom('acerto');
    } else {
        erros++; document.getElementById('miss-val').innerText = erros;
        slots.forEach(s => { s.style.background = "var(--error-red)"; s.style.color = "white"; });
        tocarSom('erro');
        setTimeout(() => { slots.forEach((s, i) => { if(correta[i]) { s.innerText = correta[i]; s.style.background = "var(--highlight-green)"; } }); }, 600);
    }
    setTimeout(() => { if (indiceQuestao < itensAtuais.length - 1) { indiceQuestao++; montarQuestao(); } else finalizar(); }, 1800);
}

function finalizar() {
    if (cronometro) clearInterval(cronometro); tocarSom('vitoria');
    if (window.mostrarResultados) window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}

function iniciarCronometro() {
    cronometro = setInterval(() => {
        segundos++; let m = Math.floor(segundos / 60).toString().padStart(2, '0');
        let s = (segundos % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function tocarSom(t) { if (JOGO_CONFIG.sons[t]) new Audio(JOGO_CONFIG.sons[t]).play().catch(()=>{}); }

const style = document.createElement('style');
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
