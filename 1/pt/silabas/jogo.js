/**
 * MOTOR DE JOGO: ORDENAR SÍLABAS
 * Versão: Cartões Proporcionais + Animação Real Sequencial
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let segundos = 0;
let cronometro = null;
let intervalAnim = null;
let categoriaAtiva = "";
let activeDrag = null;
let startX, startY;

window.startLogic = function() {
    categoriaAtiva = Object.keys(JOGO_CONFIG.categorias)[0];
    window.selecionarCategoria(categoriaAtiva);
};

window.selecionarCategoria = function(chave) {
    if (intervalAnim) { clearInterval(intervalAnim); intervalAnim = null; }
    if (!JOGO_CONFIG.categorias[chave]) return;
    categoriaAtiva = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    window.atualizarAnimacao(cat);
};

// --- ANIMAÇÃO REALISTA (Move todas as sílabas uma a uma) ---
window.atualizarAnimacao = function(cat) {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    if (intervalAnim) clearInterval(intervalAnim);

    const partes = cat.exemplo.split('-');
    
    container.innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; position:relative; width:100%; padding:10px;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:90px; object-fit:contain;">
            
            <div id="anim-slots-row" style="display:flex; gap:8px;">
                ${partes.map((_, i) => `<div id="aslot-${i}" class="slot" style="width:45px; height:35px; border-width:1px; cursor:default;"></div>`).join('')}
            </div>

            <div id="anim-pool" style="display:flex; gap:8px;">
                ${partes.map((s, i) => `<div id="acard-${i}" class="syll-card" style="padding:5px 12px; font-size:0.9rem; cursor:default;">${s}</div>`).join('')}
            </div>
            
            <i id="anim-hand" class="fas fa-mouse-pointer" style="position:absolute; color:var(--error-red); font-size:22px; bottom:10px; right:20%; transition:0.6s ease-in-out; opacity:0; z-index:10; pointer-events:none;"></i>
        </div>
    `;

    const hand = document.getElementById('anim-hand');

    async function rodarSequencia() {
        if (!hand) return;
        
        // Reset Total
        for(let i=0; i<partes.length; i++) {
            const c = document.getElementById(`acard-${i}`);
            const s = document.getElementById(`aslot-${i}`);
            if(c) { c.style.opacity = "1"; c.style.transform = "translate(0,0)"; }
            if(s) { s.innerHTML = ""; s.style.background = "white"; }
        }
        hand.style.opacity = "0";
        hand.style.transform = "translate(0, 0)";

        await new Promise(r => setTimeout(r, 800));

        // Mover cada sílaba
        for(let i=0; i<partes.length; i++) {
            const card = document.getElementById(`acard-${i}`);
            const slot = document.getElementById(`aslot-${i}`);
            if(!card || !slot) break;

            const cRect = card.getBoundingClientRect();
            const sRect = slot.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Mão vai até à carta
            hand.style.opacity = "1";
            hand.style.left = (cRect.left - containerRect.left + 20) + "px";
            hand.style.top = (cRect.top - containerRect.top + 10) + "px";

            await new Promise(r => setTimeout(r, 600));

            // Move carta e mão para o slot
            const moveX = sRect.left - cRect.left;
            const moveY = sRect.top - cRect.top;

            card.style.transition = "0.6s ease-in-out";
            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            hand.style.left = (sRect.left - containerRect.left + 20) + "px";
            hand.style.top = (sRect.top - containerRect.top + 10) + "px";

            await new Promise(r => setTimeout(r, 700));

            // Fixa no slot e esconde card original
            card.style.opacity = "0";
            slot.innerHTML = `<span style="font-size:0.9rem;">${partes[i]}</span>`;
            slot.style.background = "#f0f7ff";
        }

        await new Promise(r => setTimeout(r, 1500));
        rodarSequencia(); // Reinicia
    }

    rodarSequencia();
};

// --- LÓGICA DO JOGO ---
window.initGame = function() {
    if (cronometro) clearInterval(cronometro);
    indiceQuestao = 0; acertos = 0; erros = 0; segundos = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('timer-val').innerText = "00:00";
    iniciarCronometro();
    montarQuestao();
};

function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    if (!item) return;

    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / ${itensAtuais.length}`;
    let baralhadas = [...item.silabas].sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px; animation: fadeIn 0.4s; position:relative;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:140px; object-fit:contain;">

            <div id="slots-container" style="display:flex; gap:10px; justify-content:center; width:100%;">
                ${item.silabas.map((_, i) => `<div class="slot" data-slot-index="${i}"></div>`).join('')}
            </div>

            <div id="syllables-pool" style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; min-height:60px; width:100%;">
                ${baralhadas.map((s, i) => `
                    <div class="syll-card" 
                         onpointerdown="startDrag(event)" 
                         onclick="handleFastClick(this)"
                         style="touch-action: none;">${s}</div>
                `).join('')}
            </div>
        </div>
    `;
}

// SISTEMA DE ARRASTAR
window.startDrag = function(e) {
    const el = e.target.closest('.syll-card');
    if (!el || el.style.opacity === "0.3") return;
    
    activeDrag = el;
    el.style.zIndex = "1000";
    el.style.transition = "none";
    
    startX = e.clientX || e.touches[0].clientX;
    startY = e.clientY || e.touches[0].clientY;
    
    document.onpointermove = doDrag;
    document.onpointerup = stopDrag;
};

function doDrag(e) {
    if (!activeDrag) return;
    const currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const currentY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    const x = currentX - startX;
    const y = currentY - startY;
    activeDrag.style.transform = `translate(${x}px, ${y}px)`;
}

function stopDrag(e) {
    if (!activeDrag) return;
    
    const rect = activeDrag.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dropped = false;
    const slots = document.querySelectorAll('.slot');
    
    slots.forEach(slot => {
        const sRect = slot.getBoundingClientRect();
        if (centerX > sRect.left && centerX < sRect.right && centerY > sRect.top && centerY < sRect.bottom) {
            if (slot.innerText === "") {
                moverParaSlot(activeDrag, slot);
                dropped = true;
            }
        }
    });

    if (!dropped) {
        activeDrag.style.transition = "0.3s";
        activeDrag.style.transform = "translate(0, 0)";
    }
    
    activeDrag.style.zIndex = "1";
    activeDrag = null;
    document.onpointermove = null;
    document.onpointerup = null;
}

window.handleFastClick = function(el) {
    if (el.style.opacity === "0.3") return;
    const slots = document.querySelectorAll('.slot');
    for (let slot of slots) {
        if (slot.innerText === "") {
            moverParaSlot(el, slot);
            break;
        }
    }
};

function moverParaSlot(card, slot) {
    slot.innerText = card.innerText;
    slot.classList.add('filled');
    card.style.opacity = "0.3";
    card.style.pointerEvents = "none";
    card.style.transform = "translate(0, 0)";
    checkFim();
}

// REMOVER DO SLOT (UNDO)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('slot') && e.target.innerText !== "") {
        const texto = e.target.innerText;
        e.target.innerText = "";
        e.target.classList.remove('filled');
        e.target.style.background = "white";

        const cards = document.querySelectorAll('.syll-card');
        for (let c of cards) {
            if (c.innerText === texto && c.style.opacity === "0.3") {
                c.style.opacity = "1";
                c.style.pointerEvents = "auto";
                break;
            }
        }
    }
});

function checkFim() {
    const slots = document.querySelectorAll('.slot');
    let preenchidos = Array.from(slots).filter(s => s.innerText !== "");
    if (preenchidos.length === itensAtuais[indiceQuestao].silabas.length) {
        validarSequencia(preenchidos.map(s => s.innerText));
    }
}

function validarSequencia(tentativa) {
    const correta = itensAtuais[indiceQuestao].silabas;
    const isCorrect = tentativa.join('') === correta.join('');
    const slots = document.querySelectorAll('.slot');

    if (isCorrect) {
        acertos++; document.getElementById('hits-val').innerText = acertos;
        slots.forEach(s => { s.style.background = "var(--highlight-green)"; s.style.color = "white"; s.style.borderColor = "transparent"; });
        tocarSom('acerto');
    } else {
        erros++; document.getElementById('miss-val').innerText = erros;
        slots.forEach(s => { s.style.background = "var(--error-red)"; s.style.color = "white"; s.style.borderColor = "transparent"; });
        tocarSom('erro');
        setTimeout(() => {
            slots.forEach((s, i) => {
                s.innerText = correta[i];
                s.style.background = "var(--highlight-green)";
            });
        }, 500);
    }

    setTimeout(() => {
        if (indiceQuestao < itensAtuais.length - 1) {
            indiceQuestao++; montarQuestao();
        } else {
            finalizar();
        }
    }, 1500);
}

function finalizar() {
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

function tocarSom(t) { if (JOGO_CONFIG.sons[t]) new Audio(JOGO_CONFIG.sons[t]).play().catch(e=>{}); }
