let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let palavraSecreta = "";
let letrasDescobertas = [];
let vidas = 6;
let nomeCategoriaAtual = "";
const coresBaloes = ['#FF5E5E', '#FFBD59', '#7ED321', '#5BA4E5', '#A55EEA', '#F368E0'];

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somPop = new Audio(JOGO_CONFIG.sons.pop);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { 
    selecionarCategoria('animais'); 
};

window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;

    nomeCategoriaAtual = cat.nome;
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    const containerIntro = document.getElementById('intro-animation-container');
    if (containerIntro) {
        containerIntro.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%; position:relative;">
                <div style="display:flex; gap:6px;">
                    ${coresBaloes.slice(0,4).map(c => `<div style="width:15px; height:20px; background:${c}; border-radius:50%; opacity:0.6;"></div>`).join('')}
                </div>
                <div style="background:white; padding:10px; border-radius:20px; box-shadow:0 8px 15px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                    <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px; object-fit:contain;">
                </div>
                <div id="demo-hand" style="position:absolute; bottom:10px; right:30px; font-size:30px; transition: 1s ease-in-out; z-index:10;">👆</div>
                <p style="font-weight:900; color:var(--primary-blue); text-transform:uppercase; font-size:14px;">TEMA: ${cat.nome}</p>
            </div>
        `;

        const hand = document.getElementById('demo-hand');
        if (hand) {
            setTimeout(() => { hand.style.transform = "translate(-50px, -30px)"; }, 500);
        }
    }
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
            
            <div style="background:var(--primary-blue); color:white; padding:5px 25px; border-radius:30px; font-weight:900; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow: 0 4px 0 var(--primary-dark);">
                ${nomeCategoriaAtual}
            </div>

            <div id="balloons-row" style="display:flex; gap:10px; height:60px; align-items:flex-end; margin-top:10px;">
                ${coresBaloes.map((cor, i) => `
                    <div id="bal-${i}" style="width:30px; height:38px; background:${cor}; border-radius:50% 50% 50% 50% / 40% 40% 60% 60%; position:relative; transition: 0.4s; box-shadow: inset -3px -3px 0 rgba(0,0,0,0.1);">
                        <div style="position:absolute; bottom:-12px; left:50%; width:1px; height:12px; background:#bdc3c7;"></div>
                    </div>
                `).join('')}
            </div>

            <div id="word-display" style="display:flex; gap:6px; flex-wrap:wrap; justify-content:center; padding: 25px 0;">
                ${palavraSecreta.split('').map((letra) => `
                    <div class="letter-slot" style="width:${isMobile ? '22px' : '36px'}; height:${isMobile ? '35px' : '50px'}; border-bottom:4px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:${isMobile ? '18px' : '30px'}; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">
                        ${letrasDescobertas.includes(normalizar(letra)) || letra === " " || letra === "-" ? letra : ""}
                    </div>
                `).join('')}
            </div>

            <div id="keyboard" style="display: grid; grid-template-columns: repeat(${isMobile ? 7 : 9}, 1fr); gap: 5px; width: 100%; max-width: 550px; padding: 0 5px 10px;">
                ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => `
                    <button class="key-btn" onclick="pressionarLetra('${l}', this)" style="aspect-ratio:1; background:white; border:2px solid #cbd9e6; border-radius:8px; font-weight:900; font-size:${isMobile ? '14px' : '18px'}; color:#5d7082; cursor:pointer; box-shadow:0 4px 0 #cbd9e6; transition: 0.1s;">${l}</button>
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
    btn.style.transform = "translateY(3px)";

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
            balao.style.transform = "scale(0) translateY(-20px)";
            balao.style.opacity = "0";
        }
        if (vidas <= 0) finalizarRonda(false);
    }
}

function atualizarPalavra() {
    const slots = document.querySelectorAll('.letter-slot');
    let ganhou = true;
    palavraSecreta.split('').forEach((letra, i) => {
        const lNorm = normalizar(letra);
        if (letrasDescobertas.includes(lNorm) || letra === " " || letra === "-") {
            slots[i].innerText = letra;
        } else {
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
