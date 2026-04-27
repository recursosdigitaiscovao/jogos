// === VARIÁVEIS DE ESTADO DO JOGO ===
let categoriaAtiva, itensAtuais, itemCorreto, rodadaAtual, acertos;
let tempoInicio, cronometroInterval;
let totalRodadas = 10;

// Sons
const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === INICIALIZAÇÃO ===

// Esta função corre mal o index.html carrega
window.iniciarLogicaJogo = () => {
    // Seleciona a primeira categoria por defeito se não houver uma ativa
    if (!categoriaAtiva) {
        const primeiraCat = Object.keys(JOGO_CONFIG.categorias)[0];
        window.selecionarCategoria(primeiraCat);
    }
};

window.selecionarCategoria = (key) => {
    categoriaAtiva = JOGO_CONFIG.categorias[key];
    // Baralha os itens da categoria
    itensAtuais = [...categoriaAtiva.itens].sort(() => Math.random() - 0.5);
    
    // Atualiza o ecrã de Intro com o exemplo da categoria
    const imgExemplo = document.getElementById('img-exemplo-intro');
    if (imgExemplo) {
        imgExemplo.src = JOGO_CONFIG.caminhoImg + categoriaAtiva.exemploImg;
        // Aplica um filtro de sombra para a explicação
        imgExemplo.style.filter = "brightness(0)";
    }
    document.getElementById('intro-instr').innerText = `Observa a sombra e descobre qual é o(a) ${categoriaAtiva.exemplo}!`;
};

// Chamada pelo botão "JOGAR" no index.html
window.comecarJogo = () => {
    acertos = 0;
    rodadaAtual = 1;
    tempoInicio = new Date();
    
    iniciarCronometro();
    proximaRodada();
};

// === LÓGICA DAS RODADAS ===

function proximaRodada() {
    if (rodadaAtual > totalRodadas || rodadaAtual > itensAtuais.length) {
        finalizarJogo();
        return;
    }

    // Atualiza UI da barra de status
    document.getElementById('round-val').innerText = `${rodadaAtual} / ${totalRodadas}`;
    
    const containerSombras = document.getElementById('alvos-sombras');
    const containerPecas = document.getElementById('pecas-coloridas');
    
    containerSombras.innerHTML = '';
    containerPecas.innerHTML = '';

    // Define o item desta rodada
    itemCorreto = itensAtuais[rodadaAtual - 1];

    // Cria a Sombra (Alvo)
    const sombraDiv = document.createElement('div');
    sombraDiv.className = 'shadow-target';
    sombraDiv.id = "alvo-final";
    sombraDiv.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${itemCorreto.img}" style="filter: brightness(0);">`;
    containerSombras.appendChild(sombraDiv);

    // Cria as Opções (Baralhadas)
    let pool = categoriaAtiva.itens.filter(i => i.nome !== itemCorreto.nome).sort(() => Math.random() - 0.5);
    let opcoes = [itemCorreto, pool[0], pool[1]].sort(() => Math.random() - 0.5);

    opcoes.forEach(item => {
        const peca = document.createElement('div');
        peca.className = 'draggable';
        peca.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; pointer-events:none;">`;
        
        // --- SISTEMA HÍBRIDO (CLIQUE OU ARRASTAR) ---
        let isDragging = false;
        let startX, startY;

        peca.onpointerdown = (e) => {
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            peca.setPointerCapture(e.pointerId);
            peca.style.zIndex = "1000";
        };

        peca.onpointermove = (e) => {
            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                isDragging = true;
                // Move a peça suavemente com o ponteiro
                const rect = peca.getBoundingClientRect();
                peca.style.position = 'fixed';
                peca.style.left = (e.clientX - rect.width / 2) + 'px';
                peca.style.top = (e.clientY - rect.height / 2) + 'px';
            }
        };

        peca.onpointerup = (e) => {
            peca.releasePointerCapture(e.pointerId);
            peca.style.position = 'static';
            peca.style.zIndex = "1";

            // Verifica se soltou em cima do alvo
            const alvo = document.getElementById('alvo-final');
            const rectAlvo = alvo.getBoundingClientRect();
            const overAlvo = (
                e.clientX > rectAlvo.left && e.clientX < rectAlvo.right &&
                e.clientY > rectAlvo.top && e.clientY < rectAlvo.bottom
            );

            if (overAlvo || !isDragging) {
                // Se soltou no alvo OU se foi apenas um clique
                validarEscolha(item.nome, peca);
            }
        };

        containerPecas.appendChild(peca);
    });
}

// === VALIDAÇÃO E FEEDBACK ===

function validarEscolha(nomeEscolhido, elementoPeca) {
    const alvo = document.getElementById('alvo-final');
    // Bloqueia cliques extras
    document.getElementById('pecas-coloridas').style.pointerEvents = 'none';

    if (nomeEscolhido === itemCorreto.nome) {
        acertos++;
        somAcerto.play();
        
        // Feedback Visual Positivo
        alvo.style.background = "#e7f9e7";
        alvo.style.borderColor = "var(--highlight-green)";
        alvo.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${itemCorreto.img}" style="width:80%; transform: scale(1.1); transition: 0.3s;">`;
        
        if(elementoPeca) elementoPeca.style.visibility = 'hidden';
    } else {
        somErro.play();
        // Feedback Visual Negativo
        alvo.style.borderColor = "var(--error-red)";
        if(elementoPeca) {
            elementoPeca.style.border = "3px solid var(--error-red)";
            elementoPeca.style.borderRadius = "15px";
        }
    }

    // Aguarda e passa à próxima
    setTimeout(() => {
        document.getElementById('pecas-coloridas').style.pointerEvents = 'auto';
        rodadaAtual++;
        proximaRodada();
    }, 1500);
}

// === UTILITÁRIOS ===

function iniciarCronometro() {
    if (cronometroInterval) clearInterval(cronometroInterval);
    cronometroInterval = setInterval(() => {
        let diff = Math.floor((new Date() - tempoInicio) / 1000);
        let m = Math.floor(diff / 60).toString().padStart(2, '0');
        let s = (diff % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function finalizarJogo() {
    clearInterval(cronometroInterval);
    somVitoria.play();
    
    const tempoFinal = document.getElementById('timer-val').innerText;
    // Chama a função global que está no index.html
    window.mostrarResultados(acertos, tempoFinal, totalRodadas);
}
