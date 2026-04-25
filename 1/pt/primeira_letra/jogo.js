let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let pecaSendoArrastada = null;
let touchStartX, touchStartY; // Para detetar se foi clique ou arrasto no mobile

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DA INTRO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px;">
            <div style="display:flex; align-items:center; gap:8px; font-size:30px; font-weight:900; color:var(--primary-blue);">
                <div style="width:45px; height:55px; border:3px dashed var(--primary-blue); border-radius:10px; position:relative;">
                    <div style="width:45px; height:55px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; position:absolute; top:-3px; left:-3px; animation: demoIn 2s infinite;">${cat.exemplo[0]}</div>
                </div>
                <span>${cat.exemplo.substring(1)}</span>
            </div>
        </div>
        <style>@keyframes demoIn { 0%, 20% { transform: translateY(30px); opacity: 0; } 50%, 80% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(0); opacity: 0; } }</style>`;
};

window.initGame = function() { indiceAtual = 0; acertos = 0; erros = 0; iniciarTimer(); proximaRodada(); };

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
    const correta = item.nome[0];
    const resto = item.nome.substring(1);
    
    // AJUSTE DINÂMICO DE FONTE: Se o resto da palavra for grande, encolhemos a letra
    let fontSizePalavra = isMobile ? (resto.length > 8 ? '28px' : '38px') : '55px';

    const opcoes = [correta, ...("ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÃÕÇ".replace(correta,"").split("").sort(()=>.5-Math.random()).slice(0,3))].sort(()=>.5-Math.random());

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-around; padding:5px 0;">
            <div style="background:white; padding:12px; border-radius:25px; box-shadow: 0 6px 15px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile?'130px':'210px'}; max-width:80vw; object-fit:contain;">
            </div>

            <div style="display:flex; align-items:center; gap:10px; margin: 10px 0; width:100%; justify-content:center;">
                <div id="target-letter" class="slot" ondrop="drop(event)" ondragover="allowDrop(event)" 
                     style="width:60px; height:75px; border:4px dashed #cbd9e6; border-radius:15px; display:flex; align-items:center; justify-content:center; font-size:40px; font-weight:900; color:var(--primary-blue); flex-shrink:0;"></div>
                <div style="font-size:${fontSizePalavra}; font-weight:900; color:#445; letter-spacing:2px; white-space:nowrap; overflow:hidden;">${resto}</div>
            </div>

            <div id="options-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; width:100%; max-width:400px; padding: 0 10px;"></div>
        </div>`;

    opcoes.forEach(l => document.getElementById('options-grid').appendChild(criarBotaoLetra(l, correta)));
}

function criarBotaoLetra(letra, correta) {
    const div = document.createElement('div');
    div.className = 'silaba-btn';
    div.innerText = letra;
    div.draggable = true;
    div.id = 'L-' + Math.random().toString(36).substr(2, 5);

    Object.assign(div.style, {
        height: '75px', background: 'white', color: 'var(--primary-blue)',
        border: '3px solid var(--primary-blue)', borderRadius: '15px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900',
        cursor: 'grab', boxShadow: '0 5px 0 var(--primary-dark)', userSelect: 'none', touchAction: 'none'
    });

    // --- EVENTOS MOBILE (Toque + Arrastar) ---
    div.ontouchstart = function(e) {
        const t = e.touches[0];
        touchStartX = t.clientX; touchStartY = t.clientY;
        pecaSendoArrastada = this;
        const r = this.getBoundingClientRect();
        this.dataset.ox = t.clientX - r.left;
        this.dataset.oy = t.clientY - r.top;
        this.style.zIndex = "1000";
    };

    div.ontouchmove = function(e) {
        if(!pecaSendoArrastada) return;
        const t = e.touches[0];
        this.style.position = 'fixed';
        this.style.pointerEvents = 'none';
        this.style.left = (t.clientX - this.dataset.ox) + 'px';
        this.style.top = (t.clientY - this.dataset.oy) + 'px';
    };

    div.ontouchend = function(e) {
        if(!pecaSendoArrastada) return;
        const t = e.changedTouches[0];
        const dist = Math.hypot(t.clientX - touchStartX, t.clientY - touchStartY);
        
        this.style.pointerEvents = 'auto';
        const elemAbaixo = document.elementFromPoint(t.clientX, t.clientY);
        const slot = elemAbaixo ? elemAbaixo.closest('.slot') : null;

        // Se moveu pouco (menos de 10px), tratamos como clique
        if (dist < 10) {
            verificar(letra, correta);
        } else if (slot) {
            verificar(letra, correta);
        }

        this.style.position = 'relative';
        this.style.left = '0'; this.style.top = '0';
        pecaSendoArrastada = null;
    };

    // --- EVENTOS PC (Clique + Drag nativo) ---
    div.onclick = function(e) {
        if (e.pointerType === 'touch') return; // Evita duplicar no mobile
        verificar(letra, correta);
    };

    div.ondragstart = function(e) {
        pecaSendoArrastada = this;
        e.dataTransfer.setData("text", letra);
    };

    return div;
}

function verificar(escolhida, correta) {
    const slot = document.getElementById('target-letter');
    if (slot.innerText !== "") return; // Evita cliques múltiplos durante a animação

    document.getElementById('game-main-content').style.pointerEvents = 'none';
    slot.innerText = escolhida;
    slot.style.borderStyle = 'solid';
    
    const acerto = escolhida === correta;
    const cor = acerto ? '#7ed321' : '#ff5e5e';
    
    slot.style.backgroundColor = cor;
    slot.style.borderColor = cor;
    slot.style.color = 'white';

    if(acerto) { acertos++; somAcerto.play(); } else { erros++; somErro.play(); }
    
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;

    setTimeout(() => {
        document.getElementById('game-main-content').style.pointerEvents = 'all';
        indiceAtual++;
        proximaRodada();
    }, 1200);
}

// LOGICA DRAG PC
window.allowDrop = (e) => e.preventDefault();
window.drop = function(e) {
    e.preventDefault();
    const letra = e.dataTransfer.getData("text");
    const correta = itensAtuais[indiceAtual].nome[0];
    verificar(letra, correta);
};

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
