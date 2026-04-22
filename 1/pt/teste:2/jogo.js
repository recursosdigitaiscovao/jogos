/**
 * LÓGICA DO JOGO: CONTAR SÍLABAS
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let cronometro = null;
let segundos = 0;
let categoriaAtiva = 'animais';
let intervalAnim = null;

// 1. Inicia a animação da categoria inicial mal carrega
window.startLogic = function() {
    window.atualizarAnimacao(categoriaAtiva);
};

// 2. Muda a animação quando o utilizador escolhe categoria no Menu RD
window.selecionarCategoria = function(chave) {
    categoriaAtiva = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    // Atualiza a animação no ecrã inicial imediatamente
    window.atualizarAnimacao(chave);
};

window.atualizarAnimacao = function(chave) {
    const container = document.getElementById('intro-animation-container');
    const cat = JOGO_CONFIG.categorias[chave];
    if (!container || !cat) return;

    if (intervalAnim) clearInterval(intervalAnim);

    // Renderiza a estrutura da animação imediatamente
    container.innerHTML = `
        <div style="text-align:center; animation: fadeIn 0.5s;">
            <div style="font-size:28px; font-weight:900; letter-spacing:8px; color:var(--primary-blue); margin-bottom:15px; background:white; padding:10px 20px; border-radius:15px; box-shadow:0 5px 15px rgba(0,0,0,0.05);">
                ${cat.exemplo}
            </div>
            <div style="display:flex; gap:10px; justify-content:center; position:relative;">
                ${[1, 2, 3, 4].map(n => `
                    <div id="anim-btn-${n}" style="width:45px; height:45px; background:#eee; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:20px; transition:0.3s;">${n}</div>
                `).join('')}
                <i id="anim-hand" class="fas fa-mouse-pointer" style="position:absolute; color:var(--error-red); font-size:30px; bottom:-20px; right:0; transition:0.8s ease-in-out; opacity:0;"></i>
            </div>
        </div>
    `;

    // Inicia o ciclo da animação
    const hand = document.getElementById('anim-hand');
    const targetBtn = document.getElementById(`anim-btn-${cat.total}`);

    function rodarCiclo() {
        if (!hand || !targetBtn) return;
        // Reset
        hand.style.opacity = "0";
        hand.style.transform = "translate(0, 0)";
        targetBtn.style.background = "#eee";
        targetBtn.style.color = "black";

        setTimeout(() => {
            hand.style.opacity = "1";
            const rect = targetBtn.getBoundingClientRect();
            const contRect = container.getBoundingClientRect();
            const targetX = (rect.left - contRect.left) + 10;
            const targetY = (rect.top - contRect.top) - 50;
            
            hand.style.transform = `translate(${targetX - 160}px, ${targetY + 20}px)`;
            
            setTimeout(() => {
                targetBtn.style.background = "var(--primary-blue)";
                targetBtn.style.color = "white";
                targetBtn.style.transform = "scale(1.1)";
                setTimeout(() => targetBtn.style.transform = "scale(1)", 200);
            }, 800);
        }, 500);
    }

    rodarCiclo();
    intervalAnim = setInterval(rodarCiclo, 3000);
};

window.initGame = function() {
    if (itensAtuais.length === 0) {
        window.selecionarCategoria(categoriaAtiva);
    }
    indiceQuestao = 0; acertos = 0; erros = 0; segundos = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    montarQuestao();
};

function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / 10`;

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; animation: fadeIn 0.4s;">
            <div style="background:white; padding:15px; border-radius:20px; box-shadow:0 8px 20px rgba(0,0,0,0.06); margin-bottom:15px;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:140px; object-fit:contain;">
            </div>
            <h2 style="font-size:32px; color:var(--primary-blue); font-weight:900; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;">${item.nome}</h2>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; width:100%; max-width:320px;">
                ${[1, 2, 3, 4].map(num => `
                    <button class="btn-jogar-stretch" onclick="validarResposta(this, ${num})">${num}</button>
                `).join('')}
            </div>
        </div>
    `;
}

window.validarResposta = function(btn, numEscolhido) {
    const correta = itensAtuais[indiceQuestao].silabas;
    const botoes = document.querySelectorAll('#game-main-content button');
    botoes.forEach(b => b.style.pointerEvents = 'none');

    if (numEscolhido === correta) {
        acertos++; document.getElementById('hits-val').innerText = acertos;
        btn.style.background = "var(--highlight-green)";
        tocarSom('acerto');
    } else {
        erros++; document.getElementById('miss-val').innerText = erros;
        btn.style.background = "var(--error-red)";
        tocarSom('erro');
        botoes[correta - 1].style.border = "4px solid var(--highlight-green)";
    }

    setTimeout(() => {
        if (indiceQuestao < 9) {
            indiceQuestao++; montarQuestao();
        } else {
            clearInterval(cronometro);
            tocarSom('vitoria');
            window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
        }
    }, 700);
};

function iniciarCronometro() {
    if (cronometro) clearInterval(cronometro);
    cronometro = setInterval(() => {
        segundos++;
        let m = Math.floor(segundos / 60).toString().padStart(2, '0');
        let s = (segundos % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function tocarSom(tipo) {
    const url = JOGO_CONFIG.sons[tipo];
    if (url) { const a = new Audio(url); a.play().catch(e => {}); }
}

const style = document.createElement('style');
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
