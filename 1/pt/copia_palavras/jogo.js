let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('letrasenumeros'); };

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px;">
            </div>
            <div style="font-weight:900; color:var(--primary-blue); font-size:24px;">NOVE</div>
            <div style="width:140px; height:35px; border:3px solid #cbd9e6; border-radius:10px; background:white; position:relative; display:flex; align-items:center; justify-content:center;">
                <span style="font-size:12px; color:#aaa; animation: typeAnim 2s infinite;">ESCREVE AQUI...</span>
            </div>
        </div>
        <style>@keyframes typeAnim { 0% { opacity:0; } 50% { opacity:1; } 100% { opacity:0; } }</style>`;
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
        document.getElementById('timer-val').innerText = `${Math.floor(decorrido/60).toString().padStart(2,'0')}:${(decorrido%60).toString().padStart(2,'0')}`;
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

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly; padding: 10px 0;">
            
            <!-- Imagem Central -->
            <div style="background:white; padding:15px; border-radius:25px; box-shadow:0 8px 25px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile ? '120px' : '180px'}; max-width:80vw; object-fit:contain;">
            </div>

            <!-- Modelo da Palavra -->
            <div id="word-model" style="font-size:45px; font-weight:900; color:var(--primary-blue); text-transform:uppercase; letter-spacing:4px; text-shadow: 2px 2px 0px rgba(0,0,0,0.05);">
                ${item.nome}
            </div>

            <!-- Campo de Escrita -->
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <input type="text" id="input-escreve" placeholder="ESCREVE AQUI..." 
                    autocomplete="off" autocapitalize="characters" spellcheck="false"
                    style="width:85%; max-width:400px; height:65px; border:4px solid #cbd9e6; border-radius:20px; background:white; text-align:center; font-size:28px; font-weight:900; color:#5d7082; outline:none; transition:0.3s; box-shadow: inset 0 4px 8px rgba(0,0,0,0.02);">
            </div>
        </div>`;

    const input = document.getElementById('input-escreve');
    
    // Focar automaticamente
    setTimeout(() => input.focus(), 100);

    // Validar enquanto escreve
    input.addEventListener('input', (e) => {
        const valor = e.target.value.toUpperCase();
        if (valor === item.nome.toUpperCase()) {
            validarResposta(true);
        }
    });

    // Se pressionar Enter (opcional para feedback manual)
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const valor = e.target.value.toUpperCase();
            validarResposta(valor === item.nome.toUpperCase());
        }
    });
}

function validarResposta(acerto) {
    const input = document.getElementById('input-escreve');
    document.getElementById('game-main-content').style.pointerEvents = 'none';

    if (acerto) {
        acertos++;
        somAcerto.play();
        input.style.borderColor = "#7ed321";
        input.style.color = "#7ed321";
        input.style.background = "#f2faf0";
    } else {
        erros++;
        somErro.play();
        input.style.borderColor = "#ff5e5e";
        input.style.animation = "shake 0.4s";
    }

    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;

    setTimeout(() => {
        document.getElementById('game-main-content').style.pointerEvents = 'all';
        if (acerto) {
            indiceAtual++;
            proximaRodada();
        } else {
            input.value = "";
            input.style.borderColor = "#cbd9e6";
            input.style.color = "#5d7082";
            input.style.background = "white";
            input.focus();
        }
    }, 1200);
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
