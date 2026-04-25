let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { 
    selecionarCategoria('letrasenumeros'); 
};

// ANIMAÇÃO DE INTRODUÇÃO DINÂMICA
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;

    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    const fontSizeIntro = cat.exemplo.length > 8 ? '18px' : '24px';

    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%;">
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 8px 15px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:85px; max-width:120px; object-fit:contain;">
            </div>
            <div style="font-weight:900; color:var(--primary-blue); font-size:${fontSizeIntro}; text-transform:uppercase; letter-spacing:2px;">
                ${cat.exemplo}
            </div>
            <div style="width:170px; height:42px; border:3px solid #cbd9e6; border-radius:12px; background:white; display:flex; align-items:center; justify-content:center; position:relative;">
                <span style="font-size:12px; color:#abbcd1; font-weight:800; animation: blinkIntro 1.5s infinite;">ESCREVE AQUI...</span>
            </div>
        </div>
        <style>
            @keyframes blinkIntro { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        </style>`;
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    iniciarTimer(); 
    proximaRodada(); 
};

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoInicio = Date.now();
    intervaloTimer = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const mins = Math.floor(decorrido/60).toString().padStart(2,'0');
        const secs = (decorrido%60).toString().padStart(2,'0');
        document.getElementById('timer-val').innerText = `${mins}:${secs}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= itensAtuais.length) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(itensAtuais[indiceAtual]);
}

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 600;
    const modelo = item.nome.toUpperCase();

    let fontSizeModelo = isMobile ? '40px' : '55px';
    if (modelo.length > 8) fontSizeModelo = isMobile ? '30px' : '45px';
    if (modelo.length > 11) fontSizeModelo = isMobile ? '24px' : '35px';

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly; padding: 5px 0;">
            <div style="background:white; padding:12px; border-radius:25px; box-shadow:0 6px 15px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile ? '120px' : '190px'}; max-width:80vw; object-fit:contain;">
            </div>

            <div id="word-model" style="font-size:${fontSizeModelo}; font-weight:900; color:var(--primary-blue); text-transform:uppercase; letter-spacing:4px; text-align:center; width:95%; user-select:none;">
                ${modelo}
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <input type="text" id="input-copy" placeholder="ESCREVE AQUI..." 
                    autocomplete="off" autocapitalize="characters" spellcheck="false"
                    style="width:85%; max-width:400px; height:60px; border:4px solid #cbd9e6; border-radius:20px; background:white; text-align:center; font-size:26px; font-weight:900; color:#5d7082; outline:none; transition:0.2s; box-shadow: inset 0 3px 6px rgba(0,0,0,0.02);">
                <p id="feedback-hint" style="font-size:10px; color:#bbcada; font-weight:800; text-transform:uppercase;">Copia a palavra acima</p>
            </div>
        </div>`;

    const input = document.getElementById('input-copy');
    setTimeout(() => input.focus(), 400);

    // VALIDAÇÃO EM TEMPO REAL
    input.addEventListener('input', (e) => {
        const digitado = e.target.value.toUpperCase();
        
        // Verifica se o que foi escrito até agora bate com o início do modelo
        const parteModelo = modelo.substring(0, digitado.length);

        if (digitado === "") {
            // Neutro
            input.style.borderColor = "#cbd9e6";
            input.style.color = "#5d7082";
            input.style.background = "white";
        } else if (digitado === modelo) {
            // ACERTO TOTAL
            validarRespostaFinal(true);
        } else if (digitado !== parteModelo) {
            // ERRO NO CARACTERE ATUAL
            input.style.borderColor = "#ff5e5e";
            input.style.color = "#ff5e5e";
            input.style.background = "#fffafa";
            // Tocar som de erro apenas uma vez se quiser (opcional)
        } else {
            // Está a escrever corretamente mas ainda não terminou
            input.style.borderColor = "var(--primary-blue)";
            input.style.color = "#5d7082";
            input.style.background = "white";
        }
    });
}

function validarRespostaFinal(acerto) {
    const input = document.getElementById('input-copy');
    const container = document.getElementById('game-main-content');
    
    container.style.pointerEvents = 'none';

    if (acerto) {
        acertos++;
        somAcerto.play();
        input.style.borderColor = "#7ed321";
        input.style.color = "#7ed321";
        input.style.background = "#f4fcf2";
        document.getElementById('hits-val').innerText = acertos;

        setTimeout(() => {
            container.style.pointerEvents = 'all';
            indiceAtual++;
            proximaRodada();
        }, 1200);
    }
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
