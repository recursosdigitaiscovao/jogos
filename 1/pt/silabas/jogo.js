let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let pecaSendoArrastada = null;
let idCounter = 0;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() {
    selecionarCategoria('animais'); 
};

// ANIMAÇÃO DA INTRO
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    const containerIntro = document.getElementById('intro-animation-container');
    const silabasEx = cat.exemplo.split('-'); 

    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px; margin-bottom:5px;">
            <div style="display:flex; gap:5px; position:relative; min-height:100px;">
                ${silabasEx.map((s, i) => `
                    <div style="display:flex; flex-direction:column; align-items:center; gap:40px;">
                        <div style="width:40px; height:40px; border:2px dashed #5ba4e5; border-radius:8px;"></div>
                        <div class="demo-sil" style="
                            width:40px; height:40px; background:white; border:2px solid #5ba4e5; 
                            color:#5ba4e5; border-radius:8px; display:flex; align-items:center; 
                            justify-content:center; font-weight:900; font-size:12px;
                            animation: demoMoveAll 3s infinite ${i * 0.3}s;
                        ">${s}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <style>
            @keyframes demoMoveAll {
                0%, 20% { transform: translateY(0); opacity: 1; }
                50%, 80% { transform: translateY(-85px); opacity: 1; }
                90%, 100% { transform: translateY(-85px); opacity: 0; }
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
    
    // LÓGICA DE TAMANHO DINÂMICO
    // No mobile, se tivermos muitas sílabas, reduzimos o tamanho para caberem na linha
    let silSize = isMobile ? 65 : 80; 
    const numSilabas = item.silabas.length;
    
    if (isMobile && numSilabas > 3) {
        // Reduz gradualmente: 4 sílabas ~ 58px, 5 sílabas ~ 50px, 6 sílabas ~ 45px
        silSize = Math.max(45, 230 / numSilabas); 
    }
    
    const fontSize = (silSize * 0.4) + "px"; // Fonte proporcional ao tamanho da peça

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 5px 0;">
            
            <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; width: 100%;">
                <div style="background:white; padding:12px; border-radius:25px; box-shadow: 0 6px 15px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">
                    <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile ? '140px' : '220px'}; max-width:85vw; object-fit:contain;">
                </div>
            </div>

            <!-- Lacunas (Slots) - nowrap para garantir a mesma linha -->
            <div id="target-slots" style="display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:nowrap; width:100%; padding: 15px 0;">
                ${item.silabas.map(() => `<div class="slot" ondrop="drop(event)" ondragover="allowDrop(event)" style="width:${silSize}px; height:${silSize}px; border:3px dashed #cbd9e6; border-radius:12px; display:flex; flex-shrink:0;"></div>`).join('')}
            </div>

            <!-- Peças Disponíveis -->
            <div id="source-pool" style="display:flex; gap:8px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:${silSize}px; padding-bottom: 10px;">
            </div>
        </div>
    `;

    const pool = document.getElementById('source-pool');
    [...item.silabas].sort(() => Math.random() - 0.5).forEach((sil) => {
        const div = criarPeca(sil, silSize, fontSize);
        pool.appendChild(div);
    });
}

function criarPeca(texto, size, fontSize) {
    const div = document.createElement('div');
    div.className = 'silaba-btn';
    div.innerText = texto;
    div.id = `sil-${idCounter++}`;
    div.draggable = true;
    
    Object.assign(div.style, {
        width: size + 'px', height: size + 'px', background: 'white', color: 'var(--primary-blue)',
        border: '3px solid var(--primary-blue)', borderRadius: '12px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: fontSize, fontWeight: '900',
        cursor: 'grab', boxShadow: '0 4px 0 var(--primary-dark)', userSelect: 'none',
        touchAction: 'none', position: 'relative', zIndex: '10', flexShrink: '0'
    });

    // EVENTOS TOUCH (Mobile)
    div.ontouchstart = function(e) {
        e.preventDefault(); e.stopPropagation();
        pecaSendoArrastada = this;
        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        this.dataset.offsetX = touch.clientX - rect.left;
        this.dataset.offsetY = touch.clientY - rect.top;
        this.style.zIndex = "1000";
    };

    div.ontouchmove = function(e) {
        if (!pecaSendoArrastada) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.style.position = 'fixed';
        this.style.pointerEvents = 'none';
        this.style.left = (touch.clientX - this.dataset.offsetX) + 'px';
        this.style.top = (touch.clientY - this.dataset.offsetY) + 'px';
    };

    div.ontouchend = function(e) {
        if (!pecaSendoArrastada) return;
        e.preventDefault();
        this.style.pointerEvents = 'auto';
        const touch = e.changedTouches[0];
        const elemAbaixo = document.elementFromPoint(touch.clientX, touch.clientY);
        const slot = elemAbaixo ? elemAbaixo.closest('.slot') : null;

        this.style.position = 'relative';
        this.style.left = '0'; this.style.top = '0'; this.style.zIndex = '10';

        if (slot && slot.children.length === 0) {
            slot.appendChild(this);
        } else {
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

    // EVENTO PC (Mouse)
    div.ondragstart = (e) => { 
        e.dataTransfer.setData("text/plain", e.target.id);
        pecaSendoArrastada = div;
    };

    div.onclick = function(e) {
        if (e.pointerType === 'touch') return;
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

// DRAG & DROP PC
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
