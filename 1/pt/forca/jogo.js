let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let palavraSecreta = "";
let letrasDescobertas = [];
let vidas = 6;
const coresBaloes = ['#FF5E5E', '#FFBD59', '#7ED321', '#5BA4E5', '#A55EEA', '#F368E0'];

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somPop = new Audio(JOGO_CONFIG.sons.pop);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%;">
            <div style="display:flex; gap:8px;">
                ${coresBaloes.map(c => `<div style="width:20px; height:25px; background:${c}; border-radius:50% 50% 50% 50% / 40% 40% 60% 60%; animation: float 3s infinite ease-in-out;"></div>`).join('')}
            </div>
            <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 8px 15px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px; object-fit:contain;">
            </div>
            <p style="font-weight:900; color:var(--primary-blue);">SALVA OS BALÕES!</p>
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
    const isMobile = window.innerWidth < 650;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 5px 0;">
            
            <!-- BALÕES -->
            <div id="balloons-area" style="display:flex; gap:12px; height:60px; align-items:flex-end;">
                ${coresBaloes.map((cor, i) => `
                    <div id="balao-${i}" style="width:30px; height:38px; background:${cor}; border-radius:50% 50% 50% 50% / 40% 40% 60% 60%; position:relative; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                        <div style="position:absolute; bottom:-12px; left:50%; width:1px; height:12px; background:#bdc3c7;"></div>
                    </div>
                `).join('')}
            </div>

            <!-- IMAGEM -->
            <div style="background:white; padding:10px; border-radius:25px; box-shadow:0 6px 20px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile ? '90px' : '160px'}; max-width:180px; object-fit:contain;">
            </div>

            <!-- PALAVRA -->
            <div id="word-display" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; padding: 10px 0;">
                ${palavraSecreta.split('').map((letra, i) => `
                    <div class="char-slot" style="width:${isMobile ? '24px' : '35px'}; height:${isMobile ? '35px' : '45px'}; border-bottom:4px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:${isMobile ? '20px' : '28px'}; font-weight:900; color:var(--primary-blue);">
                        ${letrasDescobertas.includes(norm(letra)) || letra === " " ? letra : ""}
                    </div>
                `).join('')}
            </div>

            <!-- TECLADO -->
            <div id="keyboard" style="display: grid; grid-template-columns: repeat(${isMobile ? 7 : 9}, 1fr); gap: 5px; width: 100%; max-width: 500px; padding: 0 5px 10px;">
                ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => `
                    <button class="key-btn" onclick="checkKey('${l}', this)" style="aspect-ratio:1; background:white; border:2px solid #cbd9e6; border-radius:8px; font-weight:900; font-size:${isMobile ? '14px' : '18px'}; color:#5d7082; cursor:pointer; box-shadow:0 3px 0 #cbd9e6; transition: 0.1s;">${l}</button>
                `).join('')}
            </div>
        </div>`;
}

function norm(l) {
    return l.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function checkKey(l, btn) {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.style.opacity = "0.3";
    btn.style.boxShadow = "none";
    btn.style.transform = "translateY(3px)";

    const letraNorm = norm(l);
    const letrasNaPalavra = palavraSecreta.split('').map(char => norm(char));

    if (letrasNaPalavra.includes(letraNorm)) {
        letrasDescobertas.push(letraNorm);
        somAcerto.play();
        btn.style.background = "#7ed321";
        btn.style.color = "white";
        btn.style.borderColor = "#7ed321";
        updateWord();
    } else {
        vidas--;
        somPop.play();
        btn.style.background = "#ff5e5e";
        btn.style.color = "white";
        btn.style.borderColor = "#ff5e5e";
        const balao = document.getElementById(`balao-${vidas}`);
        if(balao) { balao.style.transform = "scale(0)"; balao.style.opacity = "0"; }
        
        if (vidas <= 0) finalizeRound(false);
    }
}

function updateWord() {
    const slots = document.querySelectorAll('.char-slot');
    let win = true;
    palavraSecreta.split('').forEach((l, i) => {
        if (letrasDescobertas.includes(norm(l))) slots[i].innerText = l;
        else if (l !== " ") win = false;
    });
    if (win) finalizeRound(true);
}

function finalizeRound(win) {
    document.getElementById('keyboard').style.pointerEvents = "none";
    if (win) {
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        somVitoria.play();
    } else {
        erros++;
        document.getElementById('miss-val').innerText = erros;
        somErro.play();
        // Revela a palavra a vermelho
        const slots = document.querySelectorAll('.char-slot');
        palavraSecreta.split('').forEach((l, i) => {
            slots[i].innerText = l;
            if (!letrasDescobertas.includes(norm(l))) slots[i].style.color = "#ff5e5e";
        });
    }

    setTimeout(() => {
        indiceAtual++;
        proximaRodada();
    }, 2000);
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
