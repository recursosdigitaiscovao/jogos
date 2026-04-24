let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let categoriaAtiva = 'animais';

// Sons
const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    selecionarCategoria('animais'); 
};

// 1. ANIMAÇÃO DE INTRO COMPLETA (Simula o jogo)
window.selecionarCategoria = function(key) {
    categoriaAtiva = key;
    const cat = JOGO_CONFIG.categorias[key];
    const todosItens = [...cat.itens];
    itensAtuais = todosItens.sort(() => Math.random() - 0.5).slice(0, 10);
    
    const containerIntro = document.getElementById('intro-animation-container');
    const silEx = cat.exemplo.split('-')[0]; // Pega a primeira sílaba para o exemplo

    containerIntro.innerHTML = `
        <div class="demo-box" style="display:flex; flex-direction:column; align-items:center; gap:15px; position:relative; width:200px;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px; width:auto; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1));">
            
            <!-- Espaço alvo -->
            <div style="width:60px; height:55px; border:2px dashed #5ba4e5; border-radius:10px;" id="demo-target"></div>
            
            <!-- Sílaba que se move -->
            <div class="demo-silaba" style="
                width:60px; height:55px; background:white; border:3px solid #5ba4e5; 
                color:#5ba4e5; border-radius:10px; display:flex; align-items:center; 
                justify-content:center; font-weight:900; font-size:18px; 
                position:absolute; bottom:-10px; animation: demoMove 3s infinite;
            ">${silEx}</div>
        </div>
        <style>
            @keyframes demoMove {
                0% { transform: translateY(0); opacity: 1; }
                20% { transform: translateY(0); }
                50% { transform: translateY(-75px); }
                80% { transform: translateY(-75px); opacity: 1; }
                90% { transform: translateY(-75px); opacity: 0; }
                100% { transform: translateY(0); opacity: 0; }
            }
        </style>
    `;
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
        const mins = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const secs = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${mins}:${secs}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= itensAtuais.length) {
        finalizarJogo();
        return;
    }
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(itensAtuais[indiceAtual]);
}

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 600;
    
    // Tamanhos Otimizados
    const silSize = isMobile ? '62px' : '75px'; 
    const imgH = isMobile ? '90px' : '150px';

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 10px 0;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.1rem; text-transform:uppercase;">${item.nome}</h2>
            
            <div style="background:white; padding:8px; border-radius:20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:${imgH}; max-width:80vw; object-fit:contain;">
            </div>

            <div id="target-slots" style="display:flex; gap:8px; min-height:${silSize}; justify-content:center; align-items:center; flex-wrap:wrap; width:100%;">
                ${item.silabas.map(() => `<div class="slot" ondrop="drop(event)" ondragover="allowDrop(event)" style="width:${silSize}; height:${silSize}; border:3px dashed #cbd9e6; border-radius:15px;"></div>`).join('')}
            </div>

            <div id="source-pool" style="display:flex; gap:8px; justify-content:center; align-items:center; flex-wrap:wrap; min-height:${silSize}; width:100%;">
                <!-- Peças entram aqui -->
            </div>
        </div>
    `;

    const pool = document.getElementById('source-pool');
    [...item.silabas].sort(() => Math.random() - 0.5).forEach((sil, i) => {
        const div = criarPeca(sil, i, silSize);
        pool.appendChild(div);
    });
}

function criarPeca(texto, id, size) {
    const div = document.createElement('div');
    div.className = 'silaba-btn';
    div.innerText = texto;
    div.id = 'sil-' + id + Date.now();
    div.draggable = true;
    
    Object.assign(div.style, {
        width: size, height: size, background: 'white', color: 'var(--primary-blue)',
        border: '3px solid var(--primary-blue)', borderRadius: '15px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '900',
        cursor: 'grab', boxShadow: '0 5px 0 var(--primary-dark)', userSelect: 'none',
        touchAction: 'none', position: 'relative', zIndex: '10'
    });

    // EVENTOS PC (Mouse)
    div.ondragstart = (e) => { 
        e.dataTransfer.setData("text/plain", e.target.id);
        div.style.opacity = "0.4";
    };
    div.ondragend = () => div.style.opacity = "1";

    // EVENTOS TELEMÓVEL (Touch)
    div.ontouchstart = handleTouchStart;
    div.ontouchmove = handleTouchMove;
    div.ontouchend = handleTouchEnd;

    // EVENTO CLIQUE (Alternativa rápida)
    div.onclick = () => {
        if (div.parentElement.id === 'source-pool') {
            const slots = document.querySelectorAll('.slot');
            for (let s of slots) if (s.children.length === 0) { s.appendChild(div); break; }
        } else {
            document.getElementById('source-pool').appendChild(div);
        }
        validar();
    };

    return div;
}

// LÓGICA DE ARRASTAR NO TOUCH (TELEMÓVEL)
let touchOffsetX = 0;
let touchOffsetY = 0;

function handleTouchStart(e) {
    const touch = e.touches[0];
    const rect = this.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;
    this.style.zIndex = "1000";
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.style.position = 'fixed';
    this.style.left = (touch.clientX - touchOffsetX) + 'px';
    this.style.top = (touch.clientY - touchOffsetY) + 'px';
}

function handleTouchEnd(e) {
    this.style.display = 'none'; // Esconde temporariamente para achar o que está por baixo
    const touch = e.changedTouches[0];
    const elemAbaixo = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = elemAbaixo ? elemAbaixo.closest('.slot') : null;
    this.style.display = 'flex';
    this.style.position = 'relative';
    this.style.left = '0';
    this.style.top = '0';
    this.style.zIndex = '10';

    if (slot && slot.children.length === 0) {
        slot.appendChild(this);
    } else {
        document.getElementById('source-pool').appendChild(this);
    }
    validar();
}

// LÓGICA DE ARRASTAR NO PC
window.allowDrop = (e) => e.preventDefault();
window.drop = function(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const el = document.getElementById(id);
    const slot = e.target.closest('.slot');
    if (slot && slot.children.length === 0) {
        slot.appendChild(el);
        validar();
    }
};

function validar() {
    const slots = document.querySelectorAll('.slot');
    const preenchidos = Array.from(slots).filter(s => s.children.length > 0);
    
    if (preenchidos.length === slots.length) {
        const resposta = preenchidos.map(s => s.children[0].innerText).join('');
        const correta = itensAtuais[indiceAtual].silabas.join('');
        
        document.getElementById('game-main-content').style.pointerEvents = 'none';

        if (resposta === correta) {
            acertos++; somAcerto.play();
            pintarPecas('#7ed321');
        } else {
            erros++; somErro.play();
            pintarPecas('#ff5e5e');
        }
        document.getElementById('hits-val').innerText = acertos;
        document.getElementById('miss-val').innerText = erros;

        setTimeout(() => {
            document.getElementById('game-main-content').style.pointerEvents = 'all';
            indiceAtual++;
            proximaRodada();
        }, 1200);
    }
}

function pintarPecas(cor) {
    document.querySelectorAll('.slot .silaba-btn').forEach(s => {
        s.style.backgroundColor = cor;
        s.style.borderColor = cor;
        s.style.color = 'white';
        s.style.boxShadow = 'none';
        s.style.transform = 'scale(1.05)';
    });
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
