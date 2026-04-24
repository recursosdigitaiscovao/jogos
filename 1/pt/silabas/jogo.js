/**
 * MOTOR DE JOGO: ORDENAR SÍLABAS
 * Versão: Arrastar e Soltar (Mobile/PC) + Clique + Desfazer + Animação
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let segundos = 0;
let cronometro = null;
let intervalAnim = null;
let categoriaAtiva = "";

// Variáveis para Arrastar Manual (Pointer Events)
let activeDrag = null;
let startX, startY, initialX, initialY;

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

// 2. ANIMAÇÃO DA INTRODUÇÃO (Mãozinha a arrastar para o sítio certo)
window.atualizarAnimacao = function(cat) {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    if (intervalAnim) clearInterval(intervalAnim);

    const partes = cat.exemplo.split('-');
    
    container.innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:15px; position:relative; width:100%;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:100px; object-fit:contain;">
            
            <!-- Slots exemplo -->
            <div style="display:flex; gap:8px;">
                ${partes.map((_, i) => `<div id="anim-slot-${i}" style="width:50px; height:40px; border:2px dashed #ccc; border-radius:8px; background:white;"></div>`).join('')}
            </div>

            <!-- Sílaba exemplo que se vai mover -->
            <div id="anim-card" style="padding:10px 18px; background:white; border-radius:12px; font-weight:900; box-shadow:0 4px 0 #ddd; border:1px solid #eee; position:relative; z-index:5; color:var(--text-grey);">${partes[0]}</div>
            
            <i id="anim-hand" class="fas fa-mouse-pointer" style="position:absolute; color:var(--error-red); font-size:25px; bottom:20px; right:30%; transition:0.8s ease-in-out; opacity:0; z-index:10;"></i>
        </div>
    `;

    const hand = document.getElementById('anim-hand');
    const card = document.getElementById('anim-card');
    const target = document.getElementById('anim-slot-0');

    function rodarCiclo() {
        if (!hand || !card || !target) return;
        hand.style.opacity = "0"; hand.style.transform = "translate(0, 0)";
        card.style.opacity = "1"; card.style.transform = "translate(0, 0)";
        target.innerHTML = "";

        setTimeout(() => {
            hand.style.opacity = "1";
            hand.style.transform = "translate(-20px, -40px)"; // Sobe até à carta
            
            setTimeout(() => {
                hand.style.transform = "translate(-20px, -110px)"; // Arrastam juntos
                card.style.transform = "translate(0, -70px)";
                
                setTimeout(() => {
                    card.style.opacity = "0";
                    target.innerHTML = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue);">${partes[0]}</div>`;
                    hand.style.opacity = "0";
                }, 800);
            }, 800);
        }, 500);
    }
    rodarCiclo();
    intervalAnim = setInterval(rodarCiclo, 3500);
};

// 3. LÓGICA DO JOGO
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
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:150px; object-fit:contain;">

            <!-- Slots vazios -->
            <div id="slots-container" style="display:flex; gap:12px; justify-content:center; width:100%;">
                ${item.silabas.map((_, i) => `<div class="slot" data-slot-index="${i}" style="pointer-events: auto;"></div>`).join('')}
            </div>

            <!-- Sílabas para interagir -->
            <div id="syllables-pool" style="display:flex; gap:15px; flex-wrap:wrap; justify-content:center; min-height:80px; width:100%;">
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

// 4. SISTEMA DE ARRASTAR (COMPATÍVEL COM DEDO E RATO)
window.startDrag = function(e) {
    const el = e.target.closest('.syll-card');
    if (!el) return;
    
    activeDrag = el;
    el.style.zIndex = "1000";
    el.style.position = "relative";
    
    const rect = el.getBoundingClientRect();
    startX = e.clientX || e.touches[0].clientX;
    startY = e.clientY || e.touches[0].clientY;
    
    document.onpointermove = doDrag;
    document.onpointerup = stopDrag;
};

function doDrag(e) {
    if (!activeDrag) return;
    const x = (e.clientX || e.touches[0].clientX) - startX;
    const y = (e.clientY || e.touches[0].clientY) - startY;
    activeDrag.style.transform = `translate(${x}px, ${y}px)`;
}

function stopDrag(e) {
    if (!activeDrag) return;
    
    const rect = activeDrag.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Detetar se soltou em cima de algum slot
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
        activeDrag.style.transform = "translate(0, 0)";
        activeDrag.style.zIndex = "1";
    }
    
    activeDrag = null;
    document.onpointermove = null;
    document.onpointerup = null;
}

// Caso o utilizador apenas clique (sem arrastar)
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

// FUNÇÃO PARA CLICAR NO SLOT E RETIRAR (DESFAZER)
window.removerSilabaDoSlot = function(slot) {
    // Esta função deve ser chamada pelo index.html via onclick na classe .slot
    // Mas para garantir a funcionalidade, vamos delegar no montarQuestao
};

// Adicionar listener de clique aos slots dinamicamente
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('slot') && e.target.innerText !== "") {
        const texto = e.target.innerText;
        e.target.innerText = "";
        e.target.classList.remove('filled');
        e.target.style.background = "white";

        // Reativar o card na piscina
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
