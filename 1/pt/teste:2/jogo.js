/**
 * LÓGICA DO JOGO: CONTAR SÍLABAS
 * Pequenos Leitores
 */

// Variáveis Globais de Controlo
let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let cronometro = null;
let segundos = 0;
let categoriaChave = 'animais'; // Padrão

/**
 * 1. LOGICA INICIAL (Intro)
 * Mostra uma animação simples de como jogar
 */
window.startLogic = function() {
    const container = document.getElementById('intro-animation-container');
    if (!container) return;

    // Criar uma demo visual simples com CSS
    container.innerHTML = `
        <div class="tutorial-box" style="position:relative; width:220px; height:130px; background:white; border-radius:20px; border:3px dashed #5ba4e5; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden;">
            <span style="font-size:12px; color:#88a; font-weight:900; margin-bottom:5px;">CO-E-LHO</span>
            <div style="display:flex; gap:8px;">
                <div style="width:30px; height:30px; background:#eee; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900;">1</div>
                <div style="width:30px; height:30px; background:#eee; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900;">2</div>
                <div id="tuto-btn" style="width:30px; height:30px; background:var(--primary-blue); color:white; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900;">3</div>
            </div>
            <i class="fas fa-mouse-pointer" id="tuto-hand" style="position:absolute; color:#ff5e5e; font-size:25px; bottom:10px; right:40px; transition: 1s;"></i>
        </div>
    `;

    // Animar a mãozinha
    setInterval(() => {
        const hand = document.getElementById('tuto-hand');
        const btn = document.getElementById('tuto-btn');
        if (hand && btn) {
            hand.style.transform = "translate(-35px, -20px) scale(0.8)";
            setTimeout(() => {
                btn.style.transform = "scale(1.2)";
                setTimeout(() => {
                    btn.style.transform = "scale(1)";
                    hand.style.transform = "translate(0, 0) scale(1)";
                }, 200);
            }, 800);
        }
    }, 2500);
};

/**
 * 2. SELECIONAR CATEGORIA
 */
window.selecionarCategoria = function(chave) {
    categoriaChave = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    
    // Baralhar itens e escolher 10 (ou o máximo disponível)
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    reiniciarJogo();
};

/**
 * 3. INICIAR JOGO
 */
window.initGame = function() {
    // Se não houver itens selecionados (clicou direto em JOGAR), seleciona a primeira categoria
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

/**
 * 4. MONTAR A QUESTÃO
 */
function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    const pathImg = JOGO_CONFIG.caminhoImg;

    // Atualizar Barra de Status
    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / ${itensAtuais.length}`;
    atualizarDots();

    // Injetar HTML do Jogo
    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; animation: fadeIn 0.5s;">
            <div style="background:white; padding:15px; border-radius:25px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); margin-bottom:15px;">
                <img src="${pathImg}${item.img}" style="height:clamp(100px, 25vh, 180px); object-fit:contain;">
            </div>
            
            <h2 style="font-size:clamp(24px, 5vw, 40px); color:var(--primary-blue); font-weight:900; letter-spacing:4px; margin-bottom:20px; text-transform:uppercase;">
                ${item.nome}
            </h2>

            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; width:100%; max-width:400px;">
                ${[1, 2, 3, 4].map(num => `
                    <button class="btn-jogar-stretch" 
                            style="padding:15px; font-size:24px; border-radius:15px;" 
                            onclick="validarResposta(this, ${num})">
                        ${num}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * 5. VALIDAR RESPOSTA
 */
window.validarResposta = function(btn, numEscolhido) {
    // Bloquear outros cliques
    const botoes = document.querySelectorAll('#game-main-content button');
    botoes.forEach(b => b.style.pointerEvents = 'none');

    const respostaCorreta = itensAtuais[indiceQuestao].silabas;

    if (numEscolhido === respostaCorreta) {
        // ACERTO
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        btn.style.background = "var(--highlight-green)";
        btn.style.boxShadow = "0 6px 0 #6ab51c";
        tocarSom('acerto');
    } else {
        // ERRO
        erros++;
        document.getElementById('miss-val').innerText = erros;
        btn.style.background = "var(--error-red)";
        btn.style.boxShadow = "0 6px 0 #e04a4a";
        tocarSom('erro');
        
        // Mostrar o correto brevemente
        botoes[respostaCorreta - 1].style.border = "3px solid var(--highlight-green)";
    }

    // Esperar um pouco e passar à próxima
    setTimeout(() => {
        if (indiceQuestao < itensAtuais.length - 1) {
            indiceQuestao++;
            montarQuestao();
        } else {
            // Final do Jogo
            tocarSom('vitoria');
            finalizar();
        }
    }, 800);
};

/**
 * 6. FINALIZAR
 */
function finalizar() {
    clearInterval(cronometro);
    const tempo = document.getElementById('timer-val').innerText;
    
    // Chama a função global no index.html
    if (window.mostrarResultados) {
        window.mostrarResultados(acertos, tempo);
    }
}

/**
 * UTILITÁRIOS
 */
function iniciarCronometro() {
    if (cronometro) clearInterval(cronometro);
    cronometro = setInterval(() => {
        segundos++;
        let m = Math.floor(segundos / 60).toString().padStart(2, '0');
        let s = (segundos % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function atualizarDots() {
    const container = document.getElementById('dots-container');
    container.innerHTML = '';
    itensAtuais.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'dot' + (i === indiceQuestao ? ' active' : '');
        // Opcional: mostrar se já passou
        if (i < indiceQuestao) d.style.background = "var(--primary-blue)";
        container.appendChild(d);
    });
}

function tocarSom(tipo) {
    const url = JOGO_CONFIG.sons[tipo];
    if (url) {
        const audio = new Audio(url);
        audio.play().catch(e => console.log("Erro som:", e));
    }
}

// Estilo de FadeIn para as questões
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
