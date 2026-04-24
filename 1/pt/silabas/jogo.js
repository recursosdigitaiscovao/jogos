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

// Inicialização
window.startLogic = function() {
    selecionarCategoria('animais'); 
};

// Selecionar Categoria e Gerar Exemplo na Intro
window.selecionarCategoria = function(key) {
    categoriaAtiva = key;
    const cat = JOGO_CONFIG.categorias[key];
    const todosItens = [...cat.itens];
    itensAtuais = todosItens.sort(() => Math.random() - 0.5).slice(0, 10);
    
    // Criar animação de exemplo na intro
    const containerIntro = document.getElementById('intro-animation-container');
    const silabasEx = cat.exemplo.split('-');
    
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px; transform: scale(0.9);">
            <div style="background:white; padding:8px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:80px; width:auto; border-radius:10px;">
            </div>
            <div style="display:flex; gap:5px;">
                ${silabasEx.map(s => `
                    <div style="width:45px; height:40px; background:white; border:2px solid var(--primary-blue); color:var(--primary-blue); border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; box-shadow:0 3px 0 var(--primary-dark); animation: bounce 2s infinite ease-in-out;">
                        ${s}
                    </div>
                `).join('')}
            </div>
        </div>
        <style>
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
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
    const isMobile = window.innerHeight < 600 || window.innerWidth < 600;
    const imgH = isMobile ? '100px' : '140px';
    const silSize = isMobile ? '50px' : '65px';
    const fontSize = isMobile ? '16px' : '22px';

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-around; padding: 5px;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:1.2rem; text-transform:uppercase;">${item.nome}</h2>
            
            <div style="background:white; padding:10px; border-radius:20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:${imgH}; width:auto; border-radius:15px; object-fit:contain;">
            </div>

            <div id="target-slots" style="display:flex; gap:8px; min-height:60px; justify-content:center; align-items:center; flex-wrap:wrap;">
                ${item.silabas.map((_, i) => `<div class="slot" ondrop="drop(event)" ondragover="allowDrop(event)" style="width:${silSize}; height:${silSize}; border:2px dashed #cbd9e6; border-radius:12px; display:flex; align-items:center; justify-content:center;"></div>`).join('')}
            </div>

            <div id="source-pool" style="display:flex; gap:8px; justify-content:center; align-items:center; flex-wrap:wrap; min-height:70px; width:100%;">
                <!-- Sílabas entram aqui -->
            </div>
        </div>
    `;

    const silabasBaralhadas = [...item.silabas].sort(() => Math.random() - 0.5);
    const pool = document.getElementById('source-pool');

    silabasBaralhadas.forEach((sil, i) => {
        const div = document.createElement('div');
        div.className = 'silaba-btn';
        div.innerText = sil;
        div.id = 'sil-' + i;
        div.draggable = true;
        
        Object.assign(div.style, {
            width: silSize, height: silSize, background: 'white', color: 'var(--primary-blue)',
            border: '3px solid var(--primary-blue)', borderRadius: '12px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: fontSize, fontWeight: '900',
            cursor: 'pointer', boxShadow: '0 4px 0 var(--primary-dark)', userSelect: 'none'
        });

        // Eventos para PC (Drag & Drop)
        div.ondragstart = (e) => { e.dataTransfer.setData("text/plain", e.target.id); };
        
        // Evento para Clique/Touch
        div.onclick = () => {
            if (div.parentElement.id === 'source-pool') {
                const slots = document.querySelectorAll('.slot');
                for (let s of slots) if (s.children.length === 0) { s.appendChild(div); break; }
            } else {
                document.getElementById('source-pool').appendChild(div);
            }
            validar();
        };
        pool.appendChild(div);
    });
}

// Funções de Arrastar para PC
window.allowDrop = function(e) { e.preventDefault(); };
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
            document.getElementById('hits-val').innerText = acertos;
            pintarSilabas('#7ed321');
        } else {
            erros++; somErro.play();
            document.getElementById('miss-val').innerText = erros;
            pintarSilabas('#ff5e5e');
        }

        setTimeout(() => {
            document.getElementById('game-main-content').style.pointerEvents = 'all';
            indiceAtual++;
            proximaRodada();
        }, 1200);
    }
}

function pintarSilabas(cor) {
    document.querySelectorAll('.slot .silaba-btn').forEach(s => {
        s.style.backgroundColor = cor;
        s.style.borderColor = cor;
        s.style.color = 'white';
        s.style.boxShadow = 'none';
    });
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
