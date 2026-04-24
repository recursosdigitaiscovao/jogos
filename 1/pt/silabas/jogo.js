/**
 * MOTOR DE JOGO: ORDENAR SÍLABAS 
 * FUNCIONAMENTO: DRAG AND DROP COM CORREÇÃO POR CLIQUE NO SLOT
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let segundos = 0;
let cronometro = null;
let categoriaAtiva = "";

// Variáveis de Drag
let activeCard = null;
let startX = 0, startY = 0;
let originalX = 0, originalY = 0;
let isValidating = false;

window.startLogic = function() {
    categoriaAtiva = Object.keys(JOGO_CONFIG.categorias)[0];
    window.selecionarCategoria(categoriaAtiva);
};

window.selecionarCategoria = function(chave) {
    if (!JOGO_CONFIG.categorias[chave]) return;
    categoriaAtiva = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    window.atualizarAnimacao(cat);
};

window.atualizarAnimacao = function(cat) {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:100px; object-fit:contain;">
            <div style="font-size:24px; font-weight:900; color:var(--primary-blue); margin-top:10px;">${cat.nome.toUpperCase()}</div>
        </div>
    `;
};

window.initGame = function() {
    if (cronometro) clearInterval(cronometro);
    indiceQuestao = 0; acertos = 0; erros = 0; segundos = 0; isValidating = false;
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

    isValidating = false;
    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / ${itensAtuais.length}`;
    
    // Embaralhar as sílabas da palavra
    let pool = [...item.silabas].sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:25px; animation: fadeIn 0.4s;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:140px; object-fit:contain; pointer-events:none;">
            
            <div id="slots-container" style="display:flex; gap:12px; justify-content:center; width:100%;">
                ${item.silabas.map(() => `<div class="slot" onpointerdown="undrop(event)"></div>`).join('')}
            </div>

            <div id="syllable-pool" style="display:flex; gap:15px; flex-wrap:wrap; justify-content:center; min-height:80px; width:100%;">
                ${pool.map(s => `<div class="syll-card" onpointerdown="startDrag(event)">${s}</div>`).join('')}
            </div>
        </div>
    `;
}

// --- LÓGICA DE DRAG AND DROP ---

function startDrag(e) {
    if (isValidating) return;
    const card = e.target.closest('.syll-card');
    if (!card || card.style.opacity === "0.3") return;

    activeCard = card;
    activeCard.classList.add('dragging');
    
    const rect = activeCard.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;

    activeCard.setPointerCapture(e.pointerId);
    activeCard.onpointermove = doDrag;
    activeCard.onpointerup = stopDrag;
}

function doDrag(e) {
    if (!activeCard) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    activeCard.style.transform = `translate(${dx}px, ${dy}px)`;
}

function stopDrag(e) {
    if (!activeCard) return;
    activeCard.classList.remove('dragging');
    activeCard.onpointermove = null;
    activeCard.onpointerup = null;

    // Detetar slot
    activeCard.style.display = "none"; // Temporário para ver o que está por baixo
    const target = document.elementFromPoint(e.clientX, e.clientY);
    activeCard.style.display = "flex";

    const slot = target ? target.closest('.slot') : null;

    if (slot && slot.innerText === "") {
        slot.innerText = activeCard.innerText;
        slot.classList.add('filled');
        activeCard.style.opacity = "0.3";
        activeCard.style.pointerEvents = "none";
        checkEnd();
    }
    
    activeCard.style.transform = "none";
    activeCard = null;
}

// CORREÇÃO: Clique no slot envia a sílaba de volta
window.undrop = function(e) {
    if (isValidating) return;
    const slot = e.target.closest('.slot');
    if (!slot || slot.innerText === "") return;

    const texto = slot.innerText;
    slot.innerText = "";
    slot.classList.remove('filled');

    // Reativar o card correspondente cá em baixo
    const cards = document.querySelectorAll('.syll-card');
    for (let c of cards) {
        if (c.innerText === texto && c.style.opacity === "0.3") {
            c.style.opacity = "1";
            c.style.pointerEvents = "auto";
            break;
        }
    }
};

function checkEnd() {
    const slots = Array.from(document.querySelectorAll('.slot'));
    const preenchidos = slots.filter(s => s.innerText !== "");
    
    if (preenchidos.length === itensAtuais[indiceQuestao].silabas.length) {
        isValidating = true;
        validar(slots.map(s => s.innerText));
    }
}

function validar(tentativa) {
    const correta = itensAtuais[indiceQuestao].silabas;
    const slots = document.querySelectorAll('.slot');
    
    const tStr = tentativa.join('').toUpperCase();
    const cStr = correta.join('').toUpperCase();

    if (tStr === cStr) {
        acertos++; document.getElementById('hits-val').innerText = acertos;
        slots.forEach(s => { s.style.background = "var(--highlight-green)"; s.style.color = "white"; });
        tocarSom('acerto');
    } else {
        erros++; document.getElementById('miss-val').innerText = erros;
        slots.forEach(s => { s.style.background = "var(--error-red)"; s.style.color = "white"; });
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
    }, 1800);
}

function finalizar() {
    clearInterval(cronometro);
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
