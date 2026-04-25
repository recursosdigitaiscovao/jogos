let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let categoriaAtiva = 'animais';
let pecaSendoArrastada = null; // Referência direta para evitar confusão de IDs

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    selecionarCategoria('animais'); 
};

// 1. ANIMAÇÃO DA INTRO (Todas as letras)
window.selecionarCategoria = function(key) {
    categoriaAtiva = key;
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    const containerIntro = document.getElementById('intro-animation-container');
    const silabasEx = cat.exemplo.split('-'); 

    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:60px; margin-bottom:5px;">
            <div style="display:flex; gap:5px; position:relative; min-height:90px;">
                ${silabasEx.map((s, i) => `
                    <div style="display:flex; flex-direction:column; align-items:center; gap:35px;">
                        <div style="width:42px; height:42px; border:2px dashed #5ba4e5; border-radius:8px;"></div>
                        <div class="demo-sil" style="
                            width:42px; height:42px; background:white; border:2px solid #5ba4e5; 
                            color:#5ba4e5; border-radius:8px; display:flex; align-items:center; 
                            justify-content:center; font-weight:900; font-size:14px;
                            animation: demoMoveAll 3s infinite ${i * 0.3}s;
                        ">${s}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <style>
            @keyframes demoMoveAll {
                0%, 20% { transform: translateY(0); opacity: 1; }
                50%, 80% { transform: translateY(-81px); opacity: 1; }
                90%, 100% { transform: translateY(-81px); opacity: 0; }
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
    const silSize = isMobile ? '65px' : '75px'; 
    const imgH = isMobile ? '100px' : '150px';

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 10px 0;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.1rem; text-transform:uppercase; margin-bottom:5px;">${item.nome}</h2>
            <div style="background:white; padding:8px; border-radius:20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:${imgH}; max-width:80vw; object-fit:contain;">
            </div>
            <div id="target-slots" style="display:flex; gap:8px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; margin: 10px 0;">
                ${item.silabas.map(() => `<div class="slot" ondrop="drop(event)" ondragover="allowDrop(event)" style="width:${silSize}; height:${silSize}; border:3px dashed #cbd9e6; border-radius:15px; display:flex;"></div>`).join('')}
            </div>
            <div id="source-pool" style="display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:${silSize};">
            </div>
        </div>
    `;

    const pool = document.getElementById('source-pool');
    // Criamos as peças com IDs únicos baseados no tempo e index
    [...item.silabas].sort(() => Math.random() - 0.5).forEach((sil, i) => {
        const div = criarPeca(sil, i, silSize);
        pool.appendChild(div);
    });
}

function criarPeca(texto, i, size) {
    const div = document.createElement('div');
    div.className = 'silaba-btn';
    div.innerText = texto;
    div.id = `silaba-item-${i}-${Math.floor(Math.random() * 1000000)}`;
    div.draggable = true;
    
    Object.assign(div.style, {
        width: size, height: size, background: 'white', color: 'var(--primary-blue)',
        border: '3px solid var(--primary-blue)', borderRadius: '15px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900',
        cursor: 'grab', boxShadow: '0 5px 0 var(--primary-dark)', userSelect: 'none',
        touchAction: 'none', position: 'relative', zIndex: '10'
    });

    // EVENTOS MOUSE (PC)
    div.ondragstart = (e) => { 
        e.dataTransfer.setData("text/plain", e.target.id);
        pecaSendoArrastada = div;
    };

    // EVENTOS TOUCH (TELEMÓVEL) - Lógica de precisão
    div.ontouchstart = function(e) {
        pecaSendoArrastada = this; // Identifica exatamente QUAL peça foi tocada
        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        this.dataset.offsetX = touch.clientX - rect.left;
        this.dataset.offsetY = touch.clientY - rect.top;
        this.style.zIndex = "1000";
        this.style.transition = "none";
    };

    div.ontouchmove = function(e) {
        if (!pecaSendoArrastada) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.style.position = 'fixed';
        this.style.pointerEvents = 'none'; // Importante para não bloquear o slot abaixo
        this.style.left = (touch.clientX - this.dataset.offsetX) + 'px';
        this.style.top = (touch.clientY - this.dataset.offsetY) + 'px';
    };

    div.ontouchend = function(e) {
        if (!pecaSendoArrastada) return;
        this.style.pointerEvents = 'auto';
        const touch = e.changedTouches[0];
        const elemAbaixo = document.elementFromPoint(touch.clientX, touch.clientY);
        const slot = elemAbaixo ? elemAbaixo.closest('.slot') : null;

        this.style.position = 'relative';
        this.style.left = '0';
        this.style.top = '0';
        this.style.zIndex = '10';

        if (slot && slot.children.length === 0) {
            slot.appendChild(this);
        } else {
            // Se soltar fora, ou apenas clicar, move para o próximo slot livre
            if (this.parentElement.id === 'source-pool') {
                const slots = document.querySelectorAll('.slot');
                for (let s of slots) if (s.children.length === 0) { s.appendChild(this); break; }
            } else {
                document.getElementById('source-pool').appendChild(this);
            }
        }
        pecaSendoArrastada = null;
        validar();
    };

    // Clique Simples (Fallback)
    div.onclick = function() {
        if (this.style.position === 'fixed') return;
        if (this.parentElement.id === 'source-pool') {
            const slots = document.querySelectorAll('.slot');
            for (let s of slots) if (s.children.length === 0) { s.appendChild(this); break; }
        } else {
            document.getElementById('source-pool').appendChild(this);
        }
        validar();
    };

    return div;
}

// LOGICA PC
window.allowDrop = (e) => e.preventDefault();
window.drop = function(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const el = document.getElementById(id);
    const slot = e.target.closest('.slot');
    if (slot && el && slot.children.length === 0) {
        slot.appendChild(el);
        validar();
    }
};

function validar() {
    const slots = document.querySelectorAll('.slot');
    const pecasNosSlots = Array.from(slots).filter(s => s.children.length > 0);
    
    if (pecasNosSlots.length === slots.length) {
        const resposta = pecasNosSlots.map(s => s.children[0].innerText).join('');
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
        }, 1300);
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
