let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let cortesAtivos = []; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="background:white; padding:15px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:80px;">
            </div>
            <div style="display:flex; align-items:center; gap:5px; font-size:30px; font-weight:900; color:#445;">
                G A <div style="width:4px; height:40px; background:var(--primary-blue); animation: blink 1s infinite;"></div> T O
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-align:center;">CORTA AS SÍLABAS!</p>
        </div>
        <style>@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }</style>`;
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
    cortesAtivos = [];
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(itensAtuais[indiceAtual]);
}

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const letras = item.nome.split('');
    const numLetras = letras.length;
    const isMobile = window.innerWidth < 600;

    // --- LÓGICA DE TAMANHO EQUILIBRADO ---
    // Em vez de variar muito, usamos degraus de tamanho
    let fontSize = isMobile ? 42 : 55;
    if (numLetras > 8) fontSize = isMobile ? 32 : 45;
    if (numLetras > 10) fontSize = isMobile ? 26 : 38;

    // Largura da zona de toque entre letras (mínimo de 20px para ser clicável)
    const gapWidth = Math.max(isMobile ? 18 : 25, fontSize * 0.4);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 5px 0;">
            
            <!-- Imagem: Reduzida no mobile para sobrar espaço -->
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; min-height: 100px;">
                <div style="background:white; padding:10px; border-radius:25px; box-shadow:0 6px 20px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                    <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile ? '110px' : '180px'}; max-width:75vw; object-fit:contain;">
                </div>
            </div>

            <!-- Contentor da Palavra: Ocupa quase toda a largura para evitar quebras -->
            <div style="background:white; padding:${isMobile ? '12px 8px' : '20px 30px'}; border-radius:25px; box-shadow:0 10px 30px rgba(0,0,0,0.06); width: 98%; max-width: 900px; margin: 10px 0; display:flex; justify-content:center;">
                <div style="display:flex; align-items:center; justify-content:center; flex-wrap: nowrap;">
                    ${letras.map((letra, i) => {
                        let html = `<div style="font-size:${fontSize}px; font-weight:900; color:#3d4a59; min-width:${fontSize * 0.7}px; text-align:center; user-select:none;">${letra}</div>`;
                        
                        if (i < numLetras - 1) {
                            html += `
                                <div class="cut-zone" onclick="toggleCorte(${i+1})" 
                                     style="width:${gapWidth}px; height:${fontSize * 1.3}px; cursor:pointer; display:flex; align-items:center; justify-content:center; position:relative; z-index:10;">
                                    <div class="cut-line" id="line-${i+1}" style="width:4px; height:80%; background:#f0f4f8; border-radius:2px; transition:0.2s;"></div>
                                </div>
                            `;
                        }
                        return html;
                    }).join('')}
                </div>
            </div>

            <!-- Botão Pronto -->
            <div style="padding-bottom: 5px; width: 100%; display: flex; justify-content: center;">
                <button class="btn-jogar-stretch" onclick="validarFinal()" 
                        style="max-width:200px; height:50px; background:var(--primary-blue); box-shadow: 0 5px 0 var(--primary-dark); font-size:17px; border-radius:18px;">
                    PRONTO!
                </button>
            </div>
        </div>`;
}

function toggleCorte(index) {
    const line = document.getElementById(`line-${index}`);
    if (!line) return;

    const pos = cortesAtivos.indexOf(index);
    
    if (pos === -1) {
        cortesAtivos.push(index);
        line.style.background = "var(--primary-blue)";
        line.style.height = "100%";
        line.style.width = "6px";
    } else {
        cortesAtivos.splice(pos, 1);
        line.style.background = "#f0f4f8";
        line.style.height = "80%";
        line.style.width = "4px";
    }
}

function validarFinal() {
    const item = itensAtuais[indiceAtual];
    const corretaCortes = [];
    let acumulado = 0;

    for (let i = 0; i < item.silabas.length - 1; i++) {
        acumulado += item.silabas[i].length;
        corretaCortes.push(acumulado);
    }

    const cortesUsuario = [...cortesAtivos].sort((a, b) => a - b);
    const cortesCertos = [...corretaCortes].sort((a, b) => a - b);

    const acerto = JSON.stringify(cortesUsuario) === JSON.stringify(cortesCertos);

    document.getElementById('game-main-content').style.pointerEvents = 'none';

    if (acerto) {
        acertos++;
        somAcerto.play();
        feedbackVisual("#7ed321");
    } else {
        erros++;
        somErro.play();
        feedbackVisual("#ff5e5e");
    }

    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;

    setTimeout(() => {
        document.getElementById('game-main-content').style.pointerEvents = 'all';
        if (acerto) {
            indiceAtual++;
            proximaRodada();
        } else {
            resetTentativa();
        }
    }, 1200);
}

function feedbackVisual(cor) {
    cortesAtivos.forEach(idx => {
        const line = document.getElementById(`line-${idx}`);
        if(line) {
            line.style.background = cor;
        }
    });
}

function resetTentativa() {
    cortesAtivos = [];
    document.querySelectorAll('.cut-line').forEach(line => {
        line.style.background = "#f0f4f8";
        line.style.height = "80%";
        line.style.width = "4px";
    });
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
