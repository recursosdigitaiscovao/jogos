let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;

let cartasDaRodada = [];
let ordemCorreta = [];
let slotsEstado = [null, null, null, null]; 

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('consecutivas'); };

// 1. ANIMAÇÃO DE INTRODUÇÃO (Simula o encaixe de uma carta)
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    if (!cat) return;
    CONFIG_MESTRE.area = key;

    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; position:relative; height:200px; justify-content:center; overflow:hidden;">
            <!-- Slot de cima -->
            <div style="width:60px; height:80px; border:2px dashed var(--primary-blue); border-radius:10px; background:rgba(255,255,255,0.3); position:absolute; top:10px;"></div>
            
            <!-- Carta de baixo -->
            <div id="demo-card" style="width:60px; height:80px; background:white; border:3px solid var(--primary-blue); border-radius:10px; position:absolute; bottom:10px; display:flex; align-items:center; justify-content:center; font-weight:900; color:var(--primary-blue); font-size:24px; z-index:5;">A</div>
            
            <!-- Mão -->
            <div id="demo-hand" style="position:absolute; bottom:5px; right:30%; font-size:35px; transition: 1.5s cubic-bezier(0.45, 0.05, 0.55, 0.95); z-index:10;">👆</div>
            
            <p style="position:absolute; bottom:0; font-weight:900; color:var(--primary-blue); font-size:12px;">${cat.nome.toUpperCase()}</p>
        </div>
    `;

    const hand = document.getElementById('demo-hand');
    const card = document.getElementById('demo-card');

    function runIntro() {
        if(!hand) return;
        hand.style.transform = "translate(0, 0)";
        card.style.transform = "translate(0, 0)";
        card.style.opacity = "1";

        setTimeout(() => {
            if(!hand) return;
            // Mover mão e carta para cima
            hand.style.transform = "translate(-20px, -90px)";
            card.style.transform = "translate(0, -100px)";
            setTimeout(() => {
                card.style.borderColor = "#7ed321";
                setTimeout(runIntro, 1000); // Repetir
            }, 1500);
        }, 800);
    }
    runIntro();
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
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
    if (indiceAtual >= 10) { finalizarJogo(); return; }
    slotsEstado = [null, null, null, null];
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / 10`;

    const catAtiva = CONFIG_MESTRE.area;
    const pool = [...JOGO_CONFIG.categorias[catAtiva].itens];

    if (catAtiva === 'consecutivas') {
        let start = Math.floor(Math.random() * (pool.length - 3));
        cartasDaRodada = pool.slice(start, start + 4);
    } else {
        cartasDaRodada = pool.sort(() => Math.random() - 0.5).slice(0, 4);
    }
    
    ordemCorreta = [...cartasDaRodada].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
    montarInterface();
}

function montarInterface() {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 650;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-evenly; padding: 10px 0;">
            <div id="shelf" style="display:flex; gap:10px; justify-content:center; width:100%;">
                ${[0,1,2,3].map(i => `
                    <div class="slot" id="slot-${i}" ondrop="drop(event, ${i})" ondragover="allowDrop(event)" onclick="removerDoSlot(${i})" style="
                        width:${isMobile ? '72px' : '110px'}; height:${isMobile ? '95px' : '140px'}; 
                        border:3px dashed #cbd9e6; border-radius:20px; background:rgba(255,255,255,0.4);
                        display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer;">
                        <span id="label-${i}" style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${i+1}º</span>
                    </div>`).join('')}
            </div>

            <div id="pile" style="display:flex; gap:12px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:150px;">
                ${[...cartasDaRodada].sort(() => Math.random() - 0.5).map((item) => `
                    <div class="card" id="card-${item.nome}" draggable="true" ondragstart="drag(event, '${item.nome}')" onclick="clicarNaCarta('${item.nome}')" style="
                        width:${isMobile ? '75px' : '115px'}; background:white; border:3px solid var(--primary-blue); 
                        border-radius:20px; padding:10px; cursor:grab; box-shadow:0 6px 0 var(--primary-dark);
                        display:flex; flex-direction:column; align-items:center; transition: 0.2s;">
                        <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; height:${isMobile ? '55px' : '85px'}; object-fit:contain; pointer-events:none;">
                        <span style="font-size:${isMobile ? '10px' : '14px'}; font-weight:900; color:var(--primary-blue); text-align:center; margin-top:5px; text-transform:uppercase;">${item.nome}</span>
                    </div>`).join('')}
            </div>
        </div>
    `;
}

window.allowDrop = (e) => e.preventDefault();
window.drag = (e, nome) => { e.dataTransfer.setData("text", nome); };
window.drop = (e, slotIdx) => { e.preventDefault(); moverParaSlot(e.dataTransfer.getData("text"), slotIdx); };

window.clicarNaCarta = (nome) => {
    const firstEmpty = slotsEstado.indexOf(null);
    if (firstEmpty !== -1) moverParaSlot(nome, firstEmpty);
};

window.removerDoSlot = (slotIdx) => {
    const carta = slotsEstado[slotIdx];
    if (carta) {
        const cardEl = document.getElementById(`card-${carta.nome}`);
        const slotEl = document.getElementById(`slot-${slotIdx}`);
        cardEl.style.opacity = "1"; cardEl.style.pointerEvents = "auto"; cardEl.style.transform = "scale(1)";
        slotsEstado[slotIdx] = null;
        slotEl.style.background = "rgba(255,255,255,0.4)"; slotEl.style.border = "3px dashed #cbd9e6";
        slotEl.innerHTML = `<span style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${slotIdx+1}º</span>`;
    }
};

function moverParaSlot(nome, slotIdx) {
    if (slotsEstado[slotIdx] !== null) return;
    const cardEl = document.getElementById(`card-${nome}`);
    const slotEl = document.getElementById(`slot-${slotIdx}`);
    const dados = cartasDaRodada.find(c => c.nome === nome);
    cardEl.style.opacity = "0"; cardEl.style.pointerEvents = "none"; cardEl.style.transform = "scale(0.5)";
    slotsEstado[slotIdx] = dados;
    slotEl.style.background = "white"; slotEl.style.border = "3px solid var(--primary-blue)";
    slotEl.innerHTML = `
        <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; animation: popIn 0.3s forwards;">
            <img src="${JOGO_CONFIG.caminhoImg}${dados.img}" style="width:85%; max-height:75%; object-fit:contain;">
            <span style="font-size:10px; font-weight:900; color:var(--primary-blue); text-transform:uppercase;">${dados.nome}</span>
        </div>`;
    if (!slotsEstado.includes(null)) setTimeout(validarSequencia, 500);
}

function validarSequencia() {
    let errosRonda = 0;
    slotsEstado.forEach((carta, i) => {
        const slotEl = document.getElementById(`slot-${i}`);
        if (carta.nome === ordemCorreta[i].nome) slotEl.style.borderColor = "#7ed321";
        else { errosRonda++; devolverComErro(i, carta.nome); }
    });
    if (errosRonda === 0) {
        somAcerto.play(); acertos++; document.getElementById('hits-val').innerText = acertos;
        setTimeout(() => { indiceAtual++; proximaRodada(); }, 1200);
    } else { somErro.play(); erros++; document.getElementById('miss-val').innerText = erros; }
}

function devolverComErro(slotIdx, nome) {
    const slotEl = document.getElementById(`slot-${slotIdx}`);
    const cardEl = document.getElementById(`card-${nome}`);
    slotEl.style.borderColor = "#ff5e5e"; slotEl.style.animation = "shake 0.4s";
    setTimeout(() => {
        slotsEstado[slotIdx] = null;
        slotEl.style.animation = ""; slotEl.style.background = "rgba(255,255,255,0.4)";
        slotEl.style.border = "3px dashed #cbd9e6";
        slotEl.innerHTML = `<span style="position:absolute; top:4px; font-size:11px; color:#cbd9e6; font-weight:900;">${slotIdx+1}º</span>`;
        cardEl.style.opacity = "1"; cardEl.style.pointerEvents = "auto"; cardEl.style.transform = "scale(1)";
    }, 800);
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
