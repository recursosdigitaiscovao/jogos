/**
 * LÓGICA DO JOGO: CONTAR SÍLABAS
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let cronometro = null;
let segundos = 0;

window.startLogic = function() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;
    container.innerHTML = `<div style="text-align:center; color:var(--primary-blue); font-weight:900;">Animação Tutorial a carregar...</div>`;
};

window.selecionarCategoria = function(chave) {
    const cat = JOGO_CONFIG.categorias[chave];
    // Garante que selecionamos exatamente 10 itens aleatórios
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    reiniciarJogo();
};

window.initGame = function() {
    if (itensAtuais.length === 0) {
        window.selecionarCategoria(Object.keys(JOGO_CONFIG.categorias)[0]);
    } else {
        reiniciarJogo();
    }
};

function reiniciarJogo() {
    indiceQuestao = 0;
    acertos = 0;
    erros = 0;
    segundos = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('timer-val').innerText = "00:00";
    iniciarCronometro();
    montarQuestao();
}

function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    
    // Atualiza o contador de rounds (ex: 1 / 10)
    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / 10`;

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:150px; margin-bottom:15px; object-fit:contain;">
            <h2 style="font-size:32px; color:var(--primary-blue); font-weight:900; margin-bottom:20px;">${item.nome}</h2>
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
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        btn.style.background = "var(--highlight-green)";
    } else {
        erros++;
        document.getElementById('miss-val').innerText = erros;
        btn.style.background = "var(--error-red)";
    }

    setTimeout(() => {
        if (indiceQuestao < 9) { // Vai até à questão 10 (índice 9)
            indiceQuestao++;
            montarQuestao();
        } else {
            clearInterval(cronometro);
            window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
        }
    }, 600);
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
