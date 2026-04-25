let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let palavraSecreta = "";
let letrasDescobertas = [];
let vidas = 6;
let categoriaAtivaNome = "";
const coresBaloes = ['#FF5E5E', '#FFBD59', '#7ED321', '#5BA4E5', '#A55EEA', '#F368E0'];

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somPop = new Audio(JOGO_CONFIG.sons.pop);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { 
    selecionarCategoria('animais'); 
};

// 1. ANIMAÇÃO DE INTRODUÇÃO REALISTA (Simula o clique e a descoberta)
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;

    categoriaAtivaNome = cat.nome;
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; position:relative;">
            <!-- Balões mini -->
            <div style="display:flex; gap:5px;">
                ${coresBaloes.slice(0,3).map(c => `<div style="width:15px; height:20px; background:${c}; border-radius:50%; opacity:0.6;"></div>`).join('')}
            </div>
            
            <!-- Palavra Simulada -->
            <div style="display:flex; gap:10px;">
                <div style="width:30px; height:40px; border-bottom:3px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:900; color:var(--primary-blue);" id="demo-char"></div>
                <div style="width:30px; height:40px; border-bottom:3px solid #cbd9e6;"></div>
                <div style="width:30px; height:40px; border-bottom:3px solid #cbd9e6;"></div>
            </div>

            <!-- Teclado Simulado -->
            <div style="display:grid; grid-template-columns: repeat(3, 35px); gap:5px;">
                <div id="demo-key" style="width:35px; height:35px; background:white; border:2px solid #cbd9e6; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#5d7082;">A</div>
                <div style="width:35px; height:35px; background:white; border:2px solid #cbd9e6; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#5d7082; opacity:0.5;">B</div>
                <div style="width:35px; height:35px; background:white; border:2px solid #cbd9e6; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#5d7082; opacity:0.5;">C</div>
            </div>

            <!-- Cursor/Mão -->
            <div id="demo-hand" style="position:absolute; bottom:20px; right:20px; font-size:30px; transition: 1s ease-in-out;">👆</div>
            
            <p style="font-weight:900; color:var(--primary-blue); text-transform:uppercase;">Adivinha as letras!</p>
        </div>
    `;

    // Lógica da Animação
    const hand = document.getElementById('demo-hand');
    const key = document.getElementById('demo-key');
    const char = document.getElementById('demo-char');

    setTimeout(() => {
        if(!hand) return;
        hand.style.transform = "translate(-110px, -60px)"; // Move para a tecla A
        setTimeout(() => {
            key.style.background = "#7ed321";
            key.style.color = "white";
            char.innerText = "A";
            char.style.borderBottomColor = "#7ed321";
        }, 1000);
    }, 500);
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
    vidas = 6;
    palavraSecreta = itensAtuais[indiceAtual].nome.toUpperCase();
    letrasDescobertas = [];
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface();
}

function montarInterface() {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 650;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 10px 0;">
            
            <!-- NOME DA CATEGORIA -->
            <div style="background:var(--primary-blue); color:white; padding:6px 25px; border-radius:30px; font-weight:900; font-size:16px; text-transform:uppercase; letter-spacing:2px; box-shadow: 0 4px 0 var(--primary-dark);">
                ${categoriaAtivaNome}
            </div>

            <!-- BALÕES -->
            <div id="balloons-row" style="display:flex; gap:12px; height:70px; align-items:flex-end; margin-top:10px;">
                ${coresBaloes.map((cor, i) => `
                    <div id="bal-${i}" style="width:34px; height:44px; background:${cor}; border-radius:50% 50% 50% 50% / 40% 40% 60% 60%; position:relative; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: inset -4px -4px 0 rgba(0,0,0,0.15);">
                        <div style="position:absolute; bottom:-12px; left:50%; width:1px; height:12px; background:#bdc3c7;"></div>
                    </div>
                `).join('')}
            </div>

            <!-- PALAVRA -->
            <div id="word-display" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; padding: 30px 0;">
                ${palavraSecreta.split('').map((letra, i) => `
                    <div class="letter-slot" style="width:${isMobile ? '24px' : '40px'}; height:${isMobile ? '35px' : '55px'}; border-bottom:5px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:${isMobile ? '22px' : '36px'}; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">
                        ${letrasDescobertas.includes(normalizar(letra)) || letra === " " ? letra : ""}
                    </div>
                `).join('')}
            </div>

            <!-- TECLADO -->
            <div id="keyboard" style="display: grid; grid-template-columns: repeat(${isMobile ? 7 : 9}, 1fr); gap: 6px; width: 100%; max-width: 550px; padding: 0 5px 15px;">
                ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => `
                    <button class="key-btn" onclick="pressionarLetra('${l}', this)" style="aspect-ratio:1; background:white; border:2px solid #cbd9e6; border-radius:10px; font-weight:900; font-size:${isMobile ? '16px' : '22px'}; color:#5d7082; cursor:pointer; box-shadow:0 4px 0 #cbd9e6; transition: 0.1s;">${l}</button>
                `).join('')}
            </div>
        </div>`;
}

function normalizar(l) {
    return l.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function pressionarLetra(letra, btn) {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.style.opacity = "0.2";
    btn.style.boxShadow = "none";
    btn.style.transform = "translateY(4px)";

    const letraNorm = normalizar(letra);
    const letrasNaPalavra = palavraSecreta.split('').map(char => normalizar(char));

    if (letrasNaPalavra.includes(letraNorm)) {
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
        const balao = document.getElementById(`bal-${vidas}`);
        if(balao) {
            balao.style.transform = "scale(0) rotate(20deg)";
            balao.style.opacity = "0";
        }
        if (vidas <= 0) finalizarRonda(false);
    }
}

function atualizarPalavra() {
    const slots = document.querySelectorAll('.letter-slot');
    let ganhou = true;
    palavraSecreta.split('').forEach((letra, i) => {
        if (letrasDescobertas.includes(normalizar(letra))) {
            slots[i].innerText = letra;
        } else if (letra !== " ") {
            ganhou = false;
        }
    });
    if (ganhou) finalizarRonda(true);
}

function finalizarRonda(venceu) {
    document.getElementById('keyboard').style.pointerEvents = "none";
    if (venceu) {
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        somVitoria.play();
    } else {
        erros++;
        document.getElementById('miss-val').innerText = erros;
        somErro.play();
        const slots = document.querySelectorAll('.letter-slot');
        palavraSecreta.split('').forEach((l, i) => {
            if (slots[i].innerText === "") {
                slots[i].innerText = l;
                slots[i].style.color = "#ff5e5e";
            }
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
