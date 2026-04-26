// === VARIÁVEIS DE CONTROLO DO JOGO ===
let categoriaAtiva = null;
let itensAtuais = [];
let itemCorreto = null;
let rodadaAtual = 1;
let totalRodadas = 10;
let acertos = 0;
let erros = 0;
let tempoInicio = null;
let cronometroInterval = null;

// === SONS ===
const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

/**
 * Seleciona a categoria e prepara a lista de itens
 */
window.selecionarCategoria = function(key) {
    categoriaAtiva = JOGO_CONFIG.categorias[key];
    // Baralha os itens da categoria e seleciona os primeiros para o jogo
    itensAtuais = [...categoriaAtiva.itens].sort(() => Math.random() - 0.5);
    // Ajusta o total de rodadas se a categoria tiver menos itens que o padrão
    totalRodadas = Math.min(10, itensAtuais.length);
};

/**
 * Inicia o estado global do jogo
 */
window.initGame = function() {
    rodadaAtual = 1;
    acertos = 0;
    erros = 0;
    tempoInicio = new Date();
    
    atualizarStatusBar();
    iniciarCronometro();
    proximaRodada();
};

/**
 * Gera uma nova rodada: 1 sombra e 3 opções de imagens
 */
function proximaRodada() {
    if (rodadaAtual > totalRodadas) {
        finalizarJogo();
        return;
    }

    atualizarStatusBar();
    const container = document.getElementById('game-main-content');
    container.innerHTML = ''; // Limpa o ecrã

    // 1. Escolhe o item correto desta rodada (sequencial da lista baralhada)
    itemCorreto = itensAtuais[rodadaAtual - 1];

    // 2. Cria as opções (o correto + 2 errados aleatórios)
    let opcoes = [itemCorreto];
    let outrosItens = categoriaAtiva.itens.filter(i => i.nome !== itemCorreto.nome);
    outrosItens.sort(() => Math.random() - 0.5);
    opcoes.push(outrosItens[0], outrosItens[1]);
    
    // Baralha as opções para o correto não estar sempre no mesmo sítio
    opcoes.sort(() => Math.random() - 0.5);

    // 3. Cria a Estrutura Visual
    const gameWrapper = document.createElement('div');
    gameWrapper.style.cssText = "display:flex; flex-direction:column; align-items:center; gap:30px; width:100%;";

    // Área da Sombra (Alvo)
    const sombraDiv = document.createElement('div');
    sombraDiv.innerHTML = `
        <p style="color:var(--primary-blue); font-weight:900; margin-bottom:10px; font-size:1.2rem;">DE QUEM É ESTA SOMBRA?</p>
        <div style="background:#f0f0f0; padding:20px; border-radius:50%; border:5px solid var(--primary-blue); width:180px; height:180px; display:flex; align-items:center; justify-content:center;">
            <img src="${JOGO_CONFIG.caminhoImg}${itemCorreto.img}" 
                 style="width:120px; filter: brightness(0); pointer-events:none; user-select:none;">
        </div>
    `;
    sombraDiv.style.textAlign = "center";

    // Área das Opções (Imagens Coloridas)
    const opcoesDiv = document.createElement('div');
    opcoesDiv.style.cssText = "display:flex; gap:15px; flex-wrap:wrap; justify-content:center; width:100%;";

    opcoes.forEach(item => {
        const btn = document.createElement('div');
        btn.style.cssText = "background:white; border:3px solid #eee; border-radius:20px; padding:15px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; align-items:center; gap:10px; width:130px; box-shadow:0 4px 10px rgba(0,0,0,0.05);";
        
        btn.innerHTML = `
            <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:80px; pointer-events:none;">
            <span style="font-weight:900; font-size:12px; color:var(--text-grey);">${item.nome}</span>
        `;

        btn.onclick = () => validarEscolha(item.nome, btn);
        opcoesDiv.appendChild(btn);
    });

    gameWrapper.appendChild(sombraDiv);
    gameWrapper.appendChild(opcoesDiv);
    container.appendChild(gameWrapper);
}

/**
 * Valida se o utilizador clicou na imagem certa
 */
function validarEscolha(nomeEscolhido, elementoClicado) {
    // Bloqueia cliques múltiplos
    const botoes = document.querySelectorAll('#game-main-content div[style*="cursor: pointer"]');
    botoes.forEach(b => b.style.pointerEvents = 'none');

    if (nomeEscolhido === itemCorreto.nome) {
        acertos++;
        somAcerto.play();
        elementoClicado.style.borderColor = "var(--highlight-green)";
        elementoClicado.style.background = "#e7f9e7";
    } else {
        erros++;
        somErro.play();
        elementoClicado.style.borderColor = "var(--error-red)";
        elementoClicado.style.background = "#ffeaea";
        
        // Mostra qual era o correto
        botoes.forEach(b => {
            if (b.innerText.includes(itemCorreto.nome)) {
                b.style.borderColor = "var(--highlight-green)";
            }
        });
    }

    // Aguarda um pouco e vai para a próxima
    setTimeout(() => {
        rodadaAtual++;
        proximaRodada();
    }, 1500);
}

/**
 * Atualiza os números na barra de status superior
 */
function atualizarStatusBar() {
    document.getElementById('round-val').innerText = `${rodadaAtual} / ${totalRodadas}`;
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
}

/**
 * Cronómetro simples
 */
function iniciarCronometro() {
    if (cronometroInterval) clearInterval(cronometroInterval);
    cronometroInterval = setInterval(() => {
        const agora = new Date();
        const diff = Math.floor((agora - tempoInicio) / 1000);
        const min = Math.floor(diff / 60).toString().padStart(2, '0');
        const seg = (diff % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${min}:${seg}`;
    }, 1000);
}

/**
 * Para o jogo e envia os resultados para o ecrã final do index.html
 */
function finalizarJogo() {
    clearInterval(cronometroInterval);
    somVitoria.play();
    const tempoFinal = document.getElementById('timer-val').innerText;
    
    if (window.mostrarResultados) {
        window.mostrarResultados(acertos, tempoFinal);
    }
}

// Inicia a UI do index.html
window.startLogic = function() {
    console.log("Lógica das Sombras Mágicas Carregada.");
};
