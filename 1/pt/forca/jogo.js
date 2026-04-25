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

// 1. ANIMAÇÃO DE INTRODUÇÃO MELHORADA
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    nomeCatAtual = cat.nome;
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; width:100%; position:relative; height:200px; justify-content:center;">
            <!-- Balões de Exemplo -->
            <div style="display:flex; gap:8px; position:absolute; top:10px;">
                <div id="demo-bal-1" style="width:15px; height:20px; background:#FF5E5E; border-radius:50%; transition:0.3s;"></div>
                <div style="width:15px; height:20px; background:#7ED321; border-radius:50%;"></div>
                <div style="width:15px; height:20px; background:#5BA4E5; border-radius:50%;"></div>
            </div>
            
            <!-- Palavra de Exemplo -->
            <div style="display:flex; gap:10px; margin-top:20px;">
                <div id="demo-slot-1" style="width:30px; height:40px; border-bottom:4px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:24px;"></div>
                <div style="width:30px; height:40px; border-bottom:4px solid #cbd9e6;"></div>
            </div>

            <!-- Mini Teclado -->
            <div style="display:flex; gap:10px;">
                <div id="demo-key-1" style="width:40px; height:40px; background:white; border:2px solid #cbd9e6; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#5d7082;">A</div>
                <div id="demo-key-2" style="width:40px; height:40px; background:white; border:2px solid #cbd9e6; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#5d7082;">X</div>
            </div>

            <!-- Mão Animada -->
            <div id="demo-hand" style="position:absolute; bottom:10px; right:20px; font-size:35px; transition: 1.2s cubic-bezier(0.45, 0.05, 0.55, 0.95); z-index:10;">👆</div>
            
            <p style="font-weight:900; color:var(--primary-blue); text-transform:uppercase; margin-top:10px;">Salva os balões!</p>
        </div>
    `;

    const hand = document.getElementById('demo-hand');
    const key1 = document.getElementById('demo-key-1');
    const key2 = document.getElementById('demo-key-2');
    const slot = document.getElementById('demo-slot-1');
    const bal = document.getElementById('demo-bal-1');

    function runAnimation() {
        if(!hand) return;
        // Passo 1: Escolhe a certa
        hand.style.transform = "translate(-120px, -60px)";
        setTimeout(() => {
            key1.style.background = "#7ed321"; key1.style.color = "white"; somAcerto.play();
            slot.innerText = "A";
            // Passo 2: Escolhe a errada
            setTimeout(() => {
                hand.style.transform = "translate(-70px, -60px)";
                setTimeout(() => {
                    key2.style.background = "#ff5e5e"; key2.style.color = "white"; somPop.play();
                    bal.style.transform = "scale(0)"; bal.style.opacity = "0";
                    // Reset para repetir
                    setTimeout(() => {
                        if(!hand) return;
                        hand.style.transform = "translate(0,0)";
                        key1.style.background = "white"; key1.style.color = "#5d7082";
                        key2.style.background = "white"; key2.style.color = "#5d7082";
                        slot.innerText = "";
                        bal.style.transform = "scale(1)"; bal.style.opacity = "1";
                        setTimeout(runAnimation, 1000);
                    }, 1500);
                }, 1200);
            }, 1000);
        }, 1200);
    }
    setTimeout(runAnimation, 500);
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

    // Definição das linhas do teclado para 5 linhas no mobile
    const tecladoMobile = ["ABCDE", "FGHIJ", "KLMNO", "PQRST", "UVWXYZ"];
    const tecladoPC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 10px 0;">
            
            <div style="background:var(--primary-blue); color:white; padding:5px 25px; border-radius:30px; font-weight:900; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow: 0 4px 0 var(--primary-dark);">
                ${nomeCatAtual}
            </div>

            <!-- ÁREA DOS BALÕES -->
            <div id="balloons-row" style="display:flex; gap:12px; height:60px; align-items:flex-end;">
                ${coresBaloes.map((cor, i) => `
                    <div id="bal-${i}" style="width:30px; height:38px; background:${cor}; border-radius:50% 50% 50% 50% / 40% 40% 60% 60%; position:relative; transition: 0.4s; box-shadow: inset -3px -3px 0 rgba(0,0,0,0.15);">
                        <div style="position:absolute; bottom:-12px; left:50%; width:1px; height:12px; background:#bdc3c7;"></div>
                    </div>
                `).join('')}
            </div>

            <!-- PALAVRA -->
            <div id="word-display" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; padding: 20px 0;">
                ${palavraSecreta.split('').map((letra) => `
                    <div class="letter-slot" style="width:${isMobile ? '26px' : '40px'}; height:${isMobile ? '38px' : '55px'}; border-bottom:5px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:${isMobile ? '22px' : '34px'}; font-weight:900; color:var(--primary-blue);">
                        ${letrasDescobertas.includes(normalizar(letra)) || letra === " " || letra === "-" ? letra : ""}
                    </div>
                `).join('')}
            </div>

            <!-- TECLADO REESTRUTURADO -->
            <div id="keyboard" style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 550px; padding: 0 10px 15px;">
                ${isMobile ? 
                    tecladoMobile.map(row => `
                        <div style="display:flex; gap:8px; justify-content:center;">
                            ${row.split('').map(l => btnHtml(l, true)).join('')}
                        </div>
                    `).join('') 
                    : 
                    `<div style="display:grid; grid-template-columns: repeat(9, 1fr); gap:6px;">
                        ${tecladoPC.map(l => btnHtml(l, false)).join('')}
                    </div>`
                }
            </div>
        </div>`;
}

function btnHtml(l, isMobile) {
    return `<button class="key-btn" onclick="pressionarLetra('${l}', this)" style="
        flex: 1; min-width: ${isMobile ? '45px' : 'auto'}; height: ${isMobile ? '48px' : '50px'}; 
        background:white; border:2px solid #cbd9e6; border-radius:12px; 
        font-weight:900; font-size:${isMobile ? '18px' : '20px'}; color:#5d7082; 
        cursor:pointer; box-shadow:0 4px 0 #cbd9e6; transition: 0.1s;
    ">${l}</button>`;
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
        btn.style.background = "#7ed321"; btn.style.color = "white"; btn.style.borderColor = "#7ed321";
        atualizarPalavra();
    } else {
        vidas--;
        somPop.play();
        btn.style.background = "#ff5e5e"; btn.style.color = "white"; btn.style.borderColor = "#ff5e5e";
        const balao = document.getElementById(`bal-${vidas}`);
        if(balao) {
            balao.style.transform = "scale(0) translateY(-30px)";
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
