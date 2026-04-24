/**
 * LÓGICA DO JOGO: CONTAR SÍLABAS
 * VERSÃO CORRIGIDA: LIMPEZA TOTAL DE MEMÓRIA
 */

let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let segundos = 0;
let cronometro = null;
let intervalAnim = null;
let categoriaAtiva = "";

// 1. INICIALIZAÇÃO (Chamada apenas uma vez no load)
window.startLogic = function() {
    // Define categoria inicial a partir do primeiro tema do dados.js
    categoriaAtiva = Object.keys(JOGO_CONFIG.categorias)[0];
    window.selecionarCategoria(categoriaAtiva);
};

// 2. ESCOLHA DE CATEGORIA (Limpa animações anteriores)
window.selecionarCategoria = function(chave) {
    // Parar animação anterior se existir
    if (intervalAnim) {
        clearInterval(intervalAnim);
        intervalAnim = null;
    }

    if (!JOGO_CONFIG.categorias[chave]) return;
    
    categoriaAtiva = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    
    // Gerar nova lista de 10 itens aleatórios
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    // Iniciar animação da intro específica desta categoria
    window.atualizarAnimacao(cat);
};

// 3. ANIMAÇÃO DA INTRODUÇÃO (Mãozinha clicando no exemplo)
window.atualizarAnimacao = function(cat) {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div style="background:white; padding:10px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:80px; object-fit:contain;">
            </div>
            <div style="font-size:22px; font-weight:900; color:var(--primary-blue); background:white; padding:5px 15px; border-radius:10px;">
                ${cat.exemplo}
            </div>
            <div style="display:flex; gap:8px; position:relative; margin-top:5px;">
                ${[1, 2, 3, 4].map(n => `<div id="anim-btn-${n}" style="width:35px; height:35px; background:#eee; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900;">${n}</div>`).join('')}
                <i id="anim-hand" class="fas fa-mouse-pointer" style="position:absolute; color:var(--error-red); font-size:25px; bottom:-15px; right:0; transition:0.8s ease-in-out; opacity:0; z-index:10;"></i>
            </div>
        </div>
    `;

    const hand = document.getElementById('anim-hand');
    const targetBtn = document.getElementById(`anim-btn-${cat.total}`);

    function rodarCiclo() {
        if (!hand || !targetBtn) return;
        // Reset visual
        hand.style.opacity = "0";
        hand.style.transform = "translate(0, 0)";
        targetBtn.style.background = "#eee";
        targetBtn.style.color = "black";

        setTimeout(() => {
            if (!hand) return;
            hand.style.opacity = "1";
            hand.style.transform = "translate(-120px, -20px)";
            
            setTimeout(() => {
                if (!targetBtn) return;
                targetBtn.style.background = "var(--primary-blue)";
                targetBtn.style.color = "white";
                targetBtn.style.transform = "scale(1.1)";
                setTimeout(() => { if(targetBtn) targetBtn.style.transform = "scale(1)"; }, 200);
            }, 800);
        }, 500);
    }

    rodarCiclo();
    intervalAnim = setInterval(rodarCiclo, 3000);
};

// 4. INÍCIO DO JOGO (Reset absoluto de variáveis e cronómetro)
window.initGame = function() {
    // Parar TUDO o que possa estar a correr
    if (cronometro) clearInterval(cronometro);
    if (intervalAnim) clearInterval(intervalAnim);
    
    // Reset de variáveis lógicas
    indiceQuestao = 0;
    acertos = 0;
    erros = 0;
    segundos = 0;
    
    // Reset da Interface
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('timer-val').innerText = "00:00";
    
    // Iniciar Cronómetro e Questões
    iniciarCronometro();
    montarQuestao();
};

function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    
    if (!item) {
        console.error("Erro: Item não encontrado na posição", indiceQuestao);
        return;
    }

    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / 10`;

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; animation: fadeIn 0.4s;">
            <div style="background:white; padding:15px; border-radius:20px; box-shadow:0 8px 20px rgba(0,0,0,0.06); margin-bottom:15px;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:140px; object-fit:contain;">
            </div>
            <h2 style="font-size:32px; color:var(--primary-blue); font-weight:900; margin-bottom:20px; text-transform:uppercase;">${item.nome}</h2>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; width:100%; max-width:320px;">
                ${[1, 2, 3, 4].map(n => `<button class="btn-jogar-stretch" onclick="validarResposta(this, ${n})">${n}</button>`).join('')}
            </div>
        </div>
    `;
}

window.validarResposta = function(btn, numEscolhido) {
    const correta = itensAtuais[indiceQuestao].silabas;
    const botoes = document.querySelectorAll('#game-main-content button');
    
    // Bloquear cliques extras para evitar erros de transição
    botoes.forEach(b => b.style.pointerEvents = 'none');

    if (numEscolhido === correta) {
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        btn.style.background = "var(--highlight-green)";
        tocarSom('acerto');
    } else {
        erros++;
        document.getElementById('miss-val').innerText = erros;
        btn.style.background = "var(--error-red)";
        tocarSom('erro');
        // Mostrar a correta com borda
        if (botoes[correta - 1]) {
            botoes[correta - 1].style.border = "4px solid var(--highlight-green)";
        }
    }

    // Esperar um pouco e passar para a próxima ou fim
    setTimeout(() => {
        if (indiceQuestao < 9) {
            indiceQuestao++;
            montarQuestao();
        } else {
            finalizarJogo();
        }
    }, 700);
};

function finalizarJogo() {
    if (cronometro) clearInterval(cronometro);
    tocarSom('vitoria');
    
    if (window.mostrarResultados) {
        window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
    }
}

function iniciarCronometro() {
    // Garantia dupla de limpeza
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
    if (url) {
        const audio = new Audio(url);
        audio.play().catch(e => console.warn("Som bloqueado pelo browser"));
    }
}

// Injetar animação CSS global se não existir
if (!document.getElementById('game-animations')) {
    const style = document.createElement('style');
    style.id = 'game-animations';
    style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(style);
}
