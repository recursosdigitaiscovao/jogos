let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let palavraSecreta = "";
let letrasDescobertas = [];
let vidas = 6;
const coresBaloes = ['#ff5e5e', '#ffbd59', '#7ed321', '#5ba4e5', '#a55eea', '#f368e0'];

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somPop = new Audio(JOGO_CONFIG.sons.pop || "https://cdn.pixabay.com/audio/2022/03/15/audio_731454522a.mp3");
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="display:flex; gap:5px; margin-bottom:10px;">
                ${coresBaloes.map(cor => `<div style="width:20px; height:25px; background:${cor}; border-radius:50% 50% 50% 50% / 40% 40% 60% 60%; animation: float 3s infinite ease-in-out;"></div>`).join('')}
            </div>
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:60px;">
            </div>
            <p style="font-weight:900; color:var(--primary-blue); font-size:16px;">ADIVINHA A PALAVRA!</p>
        </div>
        <style>@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }</style>`;
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
    vidas = 6;
    const item = itensAtuais[indiceAtual];
    palavraSecreta = item.nome.toUpperCase();
    letrasDescobertas = [];
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(item);
}

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 600;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 5px 0;">
            
            <!-- ÁREA DOS BALÕES -->
            <div id="balloons-container" style="display:flex; gap:10px; height:60px; align-items:flex-end;">
                ${coresBaloes.map((cor, i) => `
                    <div class="balloon" id="bal-${i}" style="
                        width:30px; height:38px; background:${cor}; 
                        border-radius:50% 50% 50% 50% / 40% 40% 60% 60%; 
                        position:relative; transition:0.3s;
                        box-shadow: inset -3px -3px 0 rgba(0,0,0,0.1);
                    ">
                        <div style="position:absolute; bottom:-10px; left:50%; width:1px; height:10px; background:#aaa;"></div>
                    </div>
                `).join('')}
            </div>

            <!-- IMAGEM -->
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 8px 15px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile ? '90px' : '150px'}; max-width:150px; object-fit:contain;">
            </div>

            <!-- PALAVRA (LACUNAS) -->
            <div id="word-display" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
                ${palavraSecreta.split('').map((letra, i) => `
                    <div class="letter-slot" style="
                        width:${isMobile ? '25px' : '35px'}; 
                        height:${isMobile ? '35px' : '45px'}; 
                        border-bottom:4px solid #cbd9e6; 
                        display:flex; align-items:center; justify-content:center; 
                        font-size:${isMobile ? '20px' : '28px'}; font-weight:900; color:var(--primary-blue);
                    ">
                        ${letrasDescobertas.includes(normalizarLetra(letra)) ? letra : ''}
                    </div>
                `).join('')}
            </div>

            <!-- TECLADO -->
            <div id="keyboard" style="
                display: grid; 
                grid-template-columns: repeat(${isMobile ? 7 : 9}, 1fr); 
                gap: 5px; 
                width: 95%; 
                max-width: 500px;
                padding-bottom: 10px;
            ">
                ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => `
                    <button class="key-btn" onclick="tentarLetra('${l}', this)" style="
                        aspect-ratio: 1; 
                        background: white; 
                        border: 2px solid #cbd9e6; 
                        border-radius: 8px; 
                        font-weight: 900; 
                        font-size: ${isMobile ? '14px' : '18px'}; 
                        color: #5d7082; 
                        cursor: pointer;
                        box-shadow: 0 3px 0 #cbd9e6;
                        transition: 0.1s;
                    ">${l}</button>
                `).join('')}
            </div>
        </div>`;
}

function normalizarLetra(l) {
    return l.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function tentarLetra(letra, btn) {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.style.opacity = "0.4";
    btn.style.boxShadow = "none";
    btn.style.transform = "translateY(3px)";

    const letraNorm = normalizarLetra(letra);
    let acertou = false;

    // Verificar se a letra existe na palavra (considerando acentos)
    const letrasNaPalavra = palavraSecreta.split('').map(l => normalizarLetra(l));
    
    if (letrasNaPalavra.includes(letraNorm)) {
        acertou = true;
        letrasDescobertas.push(letraNorm);
        somAcerto.play();
        btn.style.background = "#7ed321";
        btn.style.color = "white";
        btn.style.borderColor = "#7ed321";
        atualizarPalavra();
    } else {
        vidas--;
        somPop.play();
        btn.style.background = "#ff5e5e";
        btn.style.color = "white";
        btn.style.borderColor = "#ff5e5e";
        rebentarBalao();
        if (vidas <= 0) {
            finalizarRodada(false);
        }
    }
}

function atualizarPalavra() {
    const slots = document.querySelectorAll('.letter-slot');
    let ganhou = true;

    palavraSecreta.split('').forEach((letra, i) => {
        if (letrasDescobertas.includes(normalizarLetra(letra))) {
            slots[i].innerText = letra;
        } else {
            ganhou = false;
        }
    });

    if (ganhou) {
        finalizarRodada(true);
    }
}

function rebentarBalao() {
    // Rebentar do último para o primeiro
    const balao = document.getElementById(`bal-${vidas}`);
    if (balao) {
        balao.style.transform = "scale(0)";
        balao.style.opacity = "0";
    }
}

function finalizarRodada(venceu) {
    document.getElementById('keyboard').style.pointerEvents = "none";
    
    if (venceu) {
        acertos++;
        somAcerto.play();
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        // Mostrar a palavra correta
        const slots = document.querySelectorAll('.letter-slot');
        palavraSecreta.split('').forEach((l, i) => {
            slots[i].innerText = l;
            slots[i].style.color = "#ff5e5e";
        });
    }

    setTimeout(() => {
        indiceAtual++;
        proximaRodada();
    }, 1500);
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
