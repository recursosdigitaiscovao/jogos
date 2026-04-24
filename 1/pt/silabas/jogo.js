// VARIÁVEIS GLOBAIS DO ESTADO DO JOGO
let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let categoriaAtiva = 'animais';
let silabasUsuario = []; // Armazena a ordem que o usuário colocou

// SONS
const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// INICIALIZAÇÃO
window.startLogic = function() {
    selecionarCategoria('animais'); // Categoria inicial padrão
};

function selecionarCategoria(key) {
    categoriaAtiva = key;
    const todosItens = [...JOGO_CONFIG.categorias[key].itens];
    // Embaralha e pega apenas 10 para a rodada
    itensAtuais = todosItens.sort(() => Math.random() - 0.5).slice(0, 10);
    resetarPontuacao();
}

function resetarPontuacao() {
    indiceAtual = 0;
    acertos = 0;
    erros = 0;
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
}

// INICIAR O JOGO (Chamado pelo botão JOGAR no HTML)
window.initGame = function() {
    resetarPontuacao();
    proximaRodada();
    iniciarTimer();
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

// LÓGICA DA RODADA
function proximaRodada() {
    if (indiceAtual >= itensAtuais.length) {
        finalizarJogo();
        return;
    }

    silabasUsuario = [];
    const item = itensAtuais[indiceAtual];
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    
    montarInterfaceJogo(item);
}

function montarInterfaceJogo(item) {
    const container = document.getElementById('game-main-content');
    
    // HTML Estrutural
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px;">
            <h2 style="color:var(--primary-blue); font-weight:900; font-size:24px; text-transform:uppercase; letter-spacing:2px;">${item.nome}</h2>
            
            <div style="background:white; padding:10px; border-radius:20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:180px; width:auto; border-radius:15px;">
            </div>

            <!-- Espaços para as sílabas (ZONA DE DEPÓSITO) -->
            <div id="target-slots" style="display:flex; gap:10px; min-height:60px; justify-content:center; align-items:center; flex-wrap:wrap; padding:10px; width:100%;">
                ${item.silabas.map((_, i) => `<div class="slot" data-index="${i}" ondrop="drop(event)" ondragover="allowDrop(event)" style="width:70px; height:60px; border:3px dashed #cbd9e6; border-radius:12px; display:flex; align-items:center; justify-content:center;"></div>`).join('')}
            </div>

            <!-- Sílabas desordenadas (ZONA DE ORIGEM) -->
            <div id="source-pool" style="display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; min-height:80px; padding:10px; background:rgba(255,255,255,0.4); border-radius:20px; width:100%;">
                <!-- As sílabas entram aqui -->
            </div>
        </div>
    `;

    // Embaralhar as sílabas para o usuário
    const silabasEmbaralhadas = [...item.silabas].sort(() => Math.random() - 0.5);
    const pool = document.getElementById('source-pool');

    silabasEmbaralhadas.forEach((sil, i) => {
        const el = criarSilabaElemento(sil, i);
        pool.appendChild(el);
    });
}

function criarSilabaElemento(texto, id) {
    const div = document.createElement('div');
    div.className = 'silaba-btn';
    div.innerText = texto;
    div.draggable = true;
    div.id = "sil-" + id + "-" + Math.random().toString(36).substr(2, 5);
    
    // Estilo da Sílaba
    Object.assign(div.style, {
        background: 'var(--white)',
        color: 'var(--primary-blue)',
        border: '3px solid var(--primary-blue)',
        borderRadius: '12px',
        width: '70px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '900',
        cursor: 'pointer',
        boxShadow: '0 4px 0 var(--primary-dark)',
        userSelect: 'none',
        transition: 'transform 0.1s'
    });

    // Eventos de clique (Touch e Mouse)
    div.onclick = () => clicarSilaba(div);
    
    // Eventos de Arrastar
    div.ondragstart = (e) => {
        e.dataTransfer.setData("text", e.target.id);
        div.style.opacity = "0.5";
    };
    div.ondragend = () => div.style.opacity = "1";

    return div;
}

// LÓGICA DE MOVIMENTAÇÃO
function clicarSilaba(el) {
    const parent = el.parentElement;
    
    if (parent.id === 'source-pool') {
        // Mover para o primeiro slot vazio
        const slots = document.querySelectorAll('.slot');
        for (let slot of slots) {
            if (slot.children.length === 0) {
                moverParaSlot(el, slot);
                break;
            }
        }
    } else {
        // Estava num slot, volta para o pool
        document.getElementById('source-pool').appendChild(el);
        validarCompletude();
    }
}

function moverParaSlot(el, slot) {
    slot.appendChild(el);
    validarCompletude();
}

// ARRASTAR E SOLTAR (DRAG & DROP)
window.allowDrop = function(e) { e.preventDefault(); };

window.drop = function(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const el = document.getElementById(data);
    const target = e.target.closest('.slot');
    
    if (target && target.children.length === 0) {
        moverParaSlot(el, target);
    }
};

function validarCompletude() {
    const slots = document.querySelectorAll('.slot');
    const totalSlots = slots.length;
    let preenchidos = 0;
    let palavraMontada = [];

    slots.forEach(slot => {
        if (slot.children.length > 0) {
            preenchidos++;
            palavraMontada.push(slot.children[0].innerText);
        }
    });

    if (preenchidos === totalSlots) {
        verificarResposta(palavraMontada.join(''));
    }
}

function verificarResposta(resposta) {
    const itemCorreto = itensAtuais[indiceAtual];
    const palavraCorreta = itemCorreto.silabas.join('');
    
    // Bloqueia cliques para evitar erros durante a transição
    document.getElementById('game-main-content').style.pointerEvents = 'none';

    if (resposta === palavraCorreta) {
        acertos++;
        somAcerto.play();
        document.getElementById('hits-val').innerText = acertos;
        destacarSlots('acerto');
    } else {
        erros++;
        somErro.play();
        document.getElementById('miss-val').innerText = erros;
        destacarSlots('erro');
    }

    setTimeout(() => {
        document.getElementById('game-main-content').style.pointerEvents = 'all';
        indiceAtual++;
        proximaRodada();
    }, 1500);
}

function destacarSlots(tipo) {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(s => {
        s.style.transition = '0.3s';
        s.style.background = tipo === 'acerto' ? '#d4edda' : '#f8d7da';
        s.style.borderColor = tipo === 'acerto' ? '#28a745' : '#dc3545';
    });
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    const tempoFinal = document.getElementById('timer-val').innerText;
    window.mostrarResultados(acertos, tempoFinal);
}
