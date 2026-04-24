/**
 * MOTOR DE JOGO: ORDENAR SÍLABAS
 * Suporte Híbrido: Clique ou Arraste
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let segundos = 0;
let cronometro = null;
let intervalAnim = null;
let categoriaAtiva = "";

let respostaSyllables = []; // Armazena a ordem atual do aluno

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

// 2. ANIMAÇÃO DA INTRODUÇÃO (Efeito visual de juntar partes)
window.atualizarAnimacao = function(cat) {
    const container = document.getElementById('intro-animation-container');
    if (intervalAnim) clearInterval(intervalAnim);
    
    container.innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div style="background:white; padding:10px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:80px; object-fit:contain;">
            </div>
            <div id="anim-word-box" style="display:flex; gap:5px; min-height:40px;">
                ${cat.exemplo.split('-').map(s => `<span class="anim-syll" style="background:var(--primary-blue); color:white; padding:5px 10px; border-radius:8px; font-weight:900; opacity:0; transform:translateY(10px); transition:0.4s;">${s}</span>`).join('')}
            </div>
        </div>
    `;

    const elements = document.querySelectorAll('.anim-syll');
    let step = 0;
    function rodarCiclo() {
        elements.forEach(el => { el.style.opacity = "0"; el.style.transform = "translateY(10px)"; });
        step = 0;
        let animTimer = setInterval(() => {
            if(step < elements.length) {
                elements[step].style.opacity = "1";
                elements[step].style.transform = "translateY(0)";
                step++;
            } else { clearInterval(animTimer); }
        }, 400);
    }
    rodarCiclo();
    intervalAnim = setInterval(rodarCiclo, 3000);
};

// 3. LÓGICA DO JOGO
window.initGame = function() {
    if (cronometro) clearInterval(cronometro);
    indiceQuestao = 0; acertos = 0; erros = 0; segundos = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('timer-val').innerText = "00:00";
    if (itensAtuais.length === 0) window.selecionarCategoria(categoriaAtiva);
    iniciarCronometro();
    montarQuestao();
};

function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    if (!item) return;

    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / ${itensAtuais.length}`;
    
    // Preparar Sílabas Baralhadas
    respostaSyllables = [];
    let baralhadas = [...item.silabas].sort(() => Math.random() - 0.5);

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:15px; animation: fadeIn 0.4s;">
            <h2 style="font-size:24px; color:var(--primary-blue); font-weight:900; text-transform:uppercase;">${item.nome}</h2>
            
            <div style="background:white; padding:15px; border-radius:20px; box-shadow:0 8px 20px rgba(0,0,0,0.06);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:120px; object-fit:contain;">
            </div>

            <!-- Zona de Depósito (Slots vazios) -->
            <div id="drop-zone" style="display:flex; gap:10px; min-height:55px; padding:10px; background:#f8f9fa; border:2px dashed #cbd9e6; border-radius:15px; width:100%; justify-content:center;">
                ${item.silabas.map((_, i) => `<div class="slot" data-index="${i}" ondrop="drop(event)" ondragover="allowDrop(event)" style="width:60px; height:45px; background:#fff; border-radius:10px; border:2px solid #eee; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:18px;"></div>`).join('')}
            </div>

            <!-- Sílabas para clicar/arrastar -->
            <div id="syllables-pool" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
                ${baralhadas.map((s, i) => `
                    <div id="syll-${i}" draggable="true" ondragstart="drag(event)" onclick="handleSyllableClick(this)" data-val="${s}" 
                         style="background:white; padding:12px 20px; border-radius:12px; font-weight:900; color:var(--text-grey); cursor:pointer; box-shadow:0 4px 0 #ddd; border:1px solid #eee; font-size:18px; user-select:none;">
                         ${s}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 4. FUNÇÕES HÍBRIDAS (DRAG & CLICK)
window.allowDrop = function(ev) { ev.preventDefault(); };

window.drag = function(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
};

window.drop = function(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let dragEl = document.getElementById(data);
    let targetSlot = ev.target.closest('.slot');

    if (targetSlot && targetSlot.innerText === "") {
        targetSlot.innerText = dragEl.innerText;
        dragEl.style.visibility = "hidden";
        checkCompleto();
    }
};

window.handleSyllableClick = function(el) {
    // Encontra o primeiro slot vazio
    const slots = document.querySelectorAll('.slot');
    for (let slot of slots) {
        if (slot.innerText === "") {
            slot.innerText = el.innerText;
            el.style.visibility = "hidden";
            checkCompleto();
            break;
        }
    }
};

function checkCompleto() {
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
        validarSequencia(tentativa);
    }
}

function validarSequencia(tentativa) {
    const correta = itensAtuais[indiceQuestao].silabas;
    const isCorrect = tentativa.join('') === correta.join('');
    
    // Bloquear novas interações
    document.querySelectorAll('#syllables-pool div').forEach(d => d.onclick = null);

    if (isCorrect) {
        acertos++; document.getElementById('hits-val').innerText = acertos;
        document.querySelectorAll('.slot').forEach(s => s.style.background = "var(--highlight-green)");
        document.querySelectorAll('.slot').forEach(s => s.style.color = "white");
        tocarSom('acerto');
    } else {
        erros++; document.getElementById('miss-val').innerText = erros;
        document.querySelectorAll('.slot').forEach(s => s.style.background = "var(--error-red)");
        document.querySelectorAll('.slot').forEach(s => s.style.color = "white");
        tocarSom('erro');
        // Mostrar a correção nos slots após um brevíssimo tempo
        setTimeout(() => {
            document.querySelectorAll('.slot').forEach((s, i) => {
                s.innerText = correta[i];
                s.style.background = "var(--highlight-green)";
            });
        }, 400);
    }

    setTimeout(() => {
        if (indiceQuestao < itensAtuais.length - 1) {
            indiceQuestao++; montarQuestao();
        } else {
            finalizarJogo();
        }
    }, 1200);
}

// 5. FUNÇÕES DE SUPORTE
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

const style = document.createElement('style');
style.id = 'game-animations';
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.slot { transition: background 0.3s, color 0.3s; }`;
document.head.appendChild(style);
