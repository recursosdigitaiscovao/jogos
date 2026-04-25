let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let palavraSecreta = "";
let letrasDescobertas = [];
let vidas = 6;
let nomeCatAtual = "";
const coresBaloes = ['#FF5E5E', '#FFBD59', '#7ED321', '#5BA4E5', '#A55EEA', '#F368E0'];

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somPop = new Audio(JOGO_CONFIG.sons.pop);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// 1. ANIMAÇÃO DE INTRODUÇÃO REALISTA
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    nomeCatAtual = cat.nome;
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; position:relative; overflow:hidden; height:180px;">
            <div style="display:flex; gap:5px; margin-bottom:5px;">
                <div id="demo-bal-1" style="width:12px; height:16px; background:#FF5E5E; border-radius:50%;"></div>
                <div style="width:12px; height:16px; background:#7ED321; border-radius:50%;"></div>
            </div>
            <div style="display:flex; gap:8px; margin-bottom:10px;">
                <div id="demo-slot-1" style="width:25px; height:35px; border-bottom:3px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:20px;"></div>
                <div style="width:25px; height:35px; border-bottom:3px solid #cbd9e6;"></div>
            </div>
            <div style="display:grid; grid-template-columns: repeat(3, 30px); gap:5px;">
                <div id="demo-key-ok" style="width:30px; height:30px; background:white; border:2px solid #cbd9e6; border-radius:5px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:12px;">A</div>
                <div id="demo-key-no" style="width:30px; height:30px; background:white; border:2px solid #cbd9e6; border-radius:5px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:12px;">X</div>
                <div style="width:30px; height:30px; background:white; border:2px solid #cbd9e6; border-radius:5px; opacity:0.3;"></div>
            </div>
            <div id="demo-hand" style="position:absolute; bottom:10px; right:10px; font-size:24px; transition: 1s ease-in-out; z-index:10;">👆</div>
            <p style="font-weight:900; color:var(--primary-blue); font-size:12px;">ADIVINHA AS LETRAS E SALVA OS BALÕES!</p>
        </div>
    `;

    const hand = document.getElementById('demo-hand');
    const keyOk = document.getElementById('demo-key-ok');
    const keyNo = document.getElementById('demo-key-no');
    const slot = document.getElementById('demo-slot-1');
    const bal = document.getElementById('demo-bal-1');

    setTimeout(() => {
        if(!hand) return;
        // Passo 1: Clicar na certa
        hand.style.transform = "translate(-90px, -55px)";
        setTimeout(() => {
            keyOk.style.background = "#7ed321"; keyOk.style.color = "white";
            slot.innerText = "A";
            // Passo 2: Clicar na errada
        setTimeout(() => {
            hand.style.transform = "translate(-55px, -55px)";
            setTimeout(() => {
                keyNo.style.background = "#ff5e5e"; keyNo.style.color = "white";
                bal.style.transform = "scale(0)"; bal.style.opacity = "0";
            }, 800);
        }, 1000);
        }, 800);
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
        document.getElementById('timer-val').innerText = `${Math.floor(decorrido/60).toString().padStart(2,'0')}:${(decorrido%60).toString().padStart(2,'0')}`;
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
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 5px 0;">
            
            <div style="background:var(--primary-blue); color:white; padding:4px 20px; border-radius:30px; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">
                ${nomeCatAtual}
            </div>

            <!-- BALÕES -->
            <div id="balloons-area" style="display:flex; gap:8px; height:50px; align-items:flex-end;">
                ${coresBaloes.map((cor, i) => `
                    <div id="bal-${i}" style="width:25px; height:32px; background:${cor}; border-radius:50% 50% 50% 50% / 40% 40% 60% 60%; position:relative; transition: 0.4s; box-shadow: inset -2px -2px 0 rgba(0,0,0,0.1);">
                        <div style="position:absolute; bottom:-10px; left:50%; width:1px; height:10px; background:#bdc3c7;"></div>
                    </div>
                `).join('')}
            </div>

            <!-- PALAVRA -->
            <div id="word-display" style="display:flex; gap:6px; flex-wrap:wrap; justify-content:center; padding: 15px 0;">
                ${palavraSecreta.split('').map((letra) => `
                    <div class="letter-slot" style="width:${isMobile ? '22px' : '35px'}; height:${isMobile ? '35px' : '48px'}; border-bottom:4px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:${isMobile ? '18px' : '28px'}; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">
                        ${(letrasDescobertas.includes(norm(letra)) || letra === " " || letra === "-") ? letra : ""}
                    </div>
                `).join('')}
            </div>

            <!-- TECLADO -->
            <div id="keyboard" style="display: grid; grid-template-columns: repeat(${isMobile ? 7 : 9}, 1fr); gap: 4px; width: 100%; max-width: 500px; padding: 0 5px 10px;">
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
        btn.style.background = "#7ed321"; btn.style.color = "white"; btn.style.borderColor = "#7ed321";
        updateWord();
    } else {
        vidas--;
        somPop.play();
        btn.style.background = "#ff5e5e"; btn.style.color = "white"; btn.style.borderColor = "#ff5e5e";
        const balao = document.getElementById(`bal-${vidas}`);
        if(balao) { balao.style.transform = "scale(0) translateY(-20px)"; balao.style.opacity = "0"; }
        if (vidas <= 0) finishRound(false);
    }
}

function updateWord() {
    const slots = document.querySelectorAll('.letter-slot');
    let win = true;
    palavraSecreta.split('').forEach((l, i) => {
        if (letrasDescobertas.includes(norm(l)) || l === " " || l === "-") slots[i].innerText = l;
        else win = false;
    });
    if (win) finishRound(true);
}

function finishRound(win) {
    document.getElementById('keyboard').style.pointerEvents = "none";
    if (win) {
        acertos++; document.getElementById('hits-val').innerText = acertos;
        somVitoria.play();
    } else {
        erros++; document.getElementById('miss-val').innerText = erros;
        somErro.play();
        const slots = document.querySelectorAll('.letter-slot');
        palavraSecreta.split('').forEach((l, i) => {
            if (slots[i].innerText === "") { slots[i].innerText = l; slots[i].style.color = "#ff5e5e"; }
        });
    }
    setTimeout(() => { indiceAtual++; proximaRodada(); }, 2000);
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
