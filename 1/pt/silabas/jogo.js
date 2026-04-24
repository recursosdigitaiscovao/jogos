/**
 * MOTOR DE JOGO: ORDENAR SÍLABAS (VERSÃO MOBILE OK + REMOVER SÍLABA)
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let segundos = 0;
let cronometro = null;
let categoriaAtiva = "";

// 1. INICIALIZAÇÃO
window.startLogic = function() {
    categoriaAtiva = Object.keys(JOGO_CONFIG.categorias)[0];
    window.selecionarCategoria(categoriaAtiva);
};

window.selecionarCategoria = function(chave) {
    if (!JOGO_CONFIG.categorias[chave]) return;
    categoriaAtiva = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    // Sorteia 10 imagens da categoria
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    window.atualizarAnimacao(cat);
};

window.atualizarAnimacao = function(cat) {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:100px; object-fit:contain;">
            <div style="font-size:24px; font-weight:900; color:var(--primary-blue); letter-spacing:2px;">${cat.exemplo}</div>
        </div>
    `;
};

// 2. INÍCIO DO JOGO
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
    
    // Baralhar sílabas
    let baralhadas = [...item.silabas].sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px; animation: fadeIn 0.4s;">
            
            <!-- Imagem limpa sem molduras extras -->
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:150px; object-fit:contain; margin-bottom:10px;">

            <!-- Slots de Destino -->
            <div id="drop-zone" style="display:flex; gap:12px; justify-content:center; width:100%;">
                ${item.silabas.map((_, i) => `
                    <div class="slot" onclick="removerSilabaDoSlot(this)" data-correct="${item.silabas[i]}"></div>
                `).join('')}
            </div>

            <!-- Piscina de Sílabas -->
            <div id="syllables-pool" style="display:flex; gap:15px; flex-wrap:wrap; justify-content:center; padding:10px;">
                ${baralhadas.map((s, i) => `
                    <div class="syll-card" onclick="colocarNoSlot(this)" data-val="${s}">${s}</div>
                `).join('')}
            </div>
        </div>
    `;
}

// 3. MOVIMENTAÇÃO (CLICK/TAP)
window.colocarNoSlot = function(el) {
    const slots = document.querySelectorAll('.slot');
    // Encontra o primeiro slot vazio
    for (let slot of slots) {
        if (slot.innerText === "") {
            slot.innerText = el.innerText;
            slot.classList.add('filled');
            el.style.opacity = "0.3";
            el.style.pointerEvents = "none";
            el.setAttribute('data-target-slot', Array.from(slots).indexOf(slot));
            checkFimDaPalavra();
            break;
        }
    }
};

window.removerSilabaDoSlot = function(slot) {
    if (slot.innerText === "") return;

    const textoARemover = slot.innerText;
    slot.innerText = "";
    slot.classList.remove('filled');

    // Reativar a sílaba correspondente na "piscina"
    const cards = document.querySelectorAll('.syll-card');
    for (let card of cards) {
        if (card.innerText === textoARemover && card.style.opacity === "0.3") {
            card.style.opacity = "1";
            card.style.pointerEvents = "auto";
            break;
        }
    }
};

function checkFimDaPalavra() {
    const slots = document.querySelectorAll('.slot');
    let preenchidos = 0;
    let tentativa = [];

    slots.forEach(s => {
        if(s.innerText !== "") {
            preenchidos++;
            tentativa.push(s.innerText);
        }
    });

    if (preenchidos === itensAtuais[indiceQuestao].silabas.length) {
        validarResposta(tentativa);
    }
}

function validarResposta(tentativa) {
    const correta = itensAtuais[indiceQuestao].silabas;
    const slots = document.querySelectorAll('.slot');
    const cards = document.querySelectorAll('.syll-card');
    
    // Bloquear cliques durante a correção
    slots.forEach(s => s.style.pointerEvents = 'none');
    cards.forEach(c => c.style.pointerEvents = 'none');

    const isCorrect = tentativa.join('') === correta.join('');

    if (isCorrect) {
        acertos++; document.getElementById('hits-val').innerText = acertos;
        slots.forEach(s => s.style.background = "var(--highlight-green)");
        slots.forEach(s => s.style.color = "white");
        tocarSom('acerto');
    } else {
        erros++; document.getElementById('miss-val').innerText = erros;
        slots.forEach(s => s.style.background = "var(--error-red)");
        slots.forEach(s => s.style.color = "white");
        tocarSom('erro');
        
        // Mostrar correção após meio segundo
        setTimeout(() => {
            slots.forEach((s, i) => {
                s.innerText = correta[i];
                s.style.background = "var(--highlight-green)";
            });
        }, 600);
    }

    setTimeout(() => {
        if (indiceQuestao < itensAtuais.length - 1) {
            indiceQuestao++; montarQuestao();
        } else {
            finalizarJogo();
        }
    }, 1500);
}

// 4. AUXILIARES
function finalizarJogo() {
    if (cronometro) clearInterval(cronometro);
    tocarSom('vitoria');
    if (window.mostrarResultados) {
        window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
    }
}

function iniciarCronometro() {
    cronometro = setInterval(() => {
        segundos++;
        let m = Math.floor(segundos / 60).toString().padStart(2, '0');
        let s = (segundos % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function tocarSom(tipo) {
    const url = JOGO_CONFIG.sons[tipo];
    if (url) { new Audio(url).play().catch(e => {}); }
}

if (!document.getElementById('game-animations')) {
    const style = document.createElement('style');
    style.id = 'game-animations';
    style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(style);
}
