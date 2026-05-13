let categoriaAtual = "Nível 1";
let indiceDesafio = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;
let jogoAtivo = false;

window.startLogic = function() {
    const introContainer = document.getElementById('intro-animation-container');
    const config = JOGO_CONFIG.categorias[categoriaAtual];
    
    introContainer.innerHTML = `
        <div style="text-align:center;">
            <div style="font-size: 80px; margin-bottom: 10px;">🤔 ↔️ 😄</div>
            <h2 style="color: var(--primary-blue); font-size: 24px;">${config.nome}</h2>
            <p style="color: var(--text-grey); margin-top: 10px;">Encontra o contrário das palavras!</p>
        </div>
    `;
    
    // Reset de placar na UI
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    document.getElementById('timer-val').innerText = "00:00";
};

window.gerarIntroJogo = function() {
    return "Clica na palavra que significa o oposto da que vês no ecrã!";
};

window.selecionarCategoria = function(id) {
    categoriaAtual = id;
};

window.initGame = function() {
    acertos = 0;
    erros = 0;
    indiceDesafio = 0;
    jogoAtivo = true;
    
    atualizarStatus();
    iniciarCronometro();
    proximoDesafio();
};

function iniciarCronometro() {
    if(intervaloTempo) clearInterval(intervaloTempo);
    tempoInicio = Date.now();
    intervaloTempo = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const mins = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const segs = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${mins}:${segs}`;
    }, 1000);
}

function proximoDesafio() {
    const gameBox = document.getElementById('game-main-content');
    const dados = JOGO_CONFIG.categorias[categoriaAtual].desafios[indiceDesafio];
    
    if (!dados) {
        finalizarJogo();
        return;
    }

    // Atualizar Barra de Progresso
    document.getElementById('round-val').innerText = `${indiceDesafio + 1} / ${JOGO_CONFIG.categorias[categoriaAtual].target}`;

    gameBox.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; gap:20px; padding: 20px;">
            <div style="background: var(--bg-page); padding: 20px; border-radius: 20px; width: 100%; text-align:center; border: 2px solid var(--primary-blue);">
                <div style="font-size: 50px;">${dados.icon}</div>
                <div style="font-size: 32px; font-weight: 900; color: var(--primary-dark);">${dados.pergunta}</div>
                <div style="color: var(--text-grey); font-weight: 700; margin-top: 5px;">QUAL É O ANTÓNIMO?</div>
            </div>
            
            <div id="options-grid" style="display:grid; grid-template-columns: 1fr; gap: 12px; width: 100%;">
                ${dados.opcoes.map(opt => `
                    <button class="btn-option" onclick="verificarResposta('${opt}')" 
                        style="padding: 15px; font-size: 20px; font-weight: 800; border-radius: 15px; border: 3px solid #eee; background: white; cursor: pointer; transition: 0.2s; color: var(--text-grey);">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

window.verificarResposta = function(escolha) {
    if (!jogoAtivo) return;
    
    const dados = JOGO_CONFIG.categorias[categoriaAtual].desafios[indiceDesafio];
    const botoes = document.querySelectorAll('.btn-option');
    
    if (escolha === dados.resposta) {
        tocarSom('acerto');
        acertos++;
        document.getElementById('hits-val').innerText = acertos;
        destacarBotao(escolha, true);
    } else {
        tocarSom('erro');
        erros++;
        document.getElementById('miss-val').innerText = erros;
        destacarBotao(escolha, false);
        destacarBotao(dados.resposta, true); // Mostra a correta
    }

    jogoAtivo = false;
    setTimeout(() => {
        indiceDesafio++;
        jogoAtivo = true;
        proximoDesafio();
    }, 1500);
};

function destacarBotao(texto, correto) {
    const botoes = document.querySelectorAll('.btn-option');
    botoes.forEach(b => {
        if (b.innerText.trim() === texto) {
            b.style.backgroundColor = correto ? "#7ed321" : "#ff5e5e";
            b.style.color = "white";
            b.style.borderColor = "transparent";
            if(correto) b.style.transform = "scale(1.05)";
        }
    });
}

function finalizarJogo() {
    clearInterval(intervaloTempo);
    tocarSom('vitoria');
    
    const total = JOGO_CONFIG.categorias[categoriaAtual].target;
    const percentagem = Math.round((acertos / total) * 100);
    
    let relatorio = JOGO_CONFIG.relatorios.find(r => percentagem >= r.min && percentagem <= r.max);
    
    const scrResult = document.getElementById('scr-result');
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    scrResult.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    scrResult.innerHTML = `
        <div class="screen-box" style="padding: 30px; text-align:center;">
            <img src="${JOGO_CONFIG.caminhoImg}${relatorio.img}" style="height: 150px; margin-bottom: 20px;">
            <h2 style="font-size: 28px; color: var(--primary-blue); font-weight: 900;">${relatorio.titulo}</h2>
            <p style="font-size: 18px; color: var(--text-grey); margin: 15px 0;">Acertaste ${acertos} de ${total} desafios!</p>
            
            <div style="display:flex; gap:10px; width:100%; margin-top: 20px;">
                <button class="btn-jogar-stretch" onclick="goToIntro()">REPETIR</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="btn-jogar-stretch" style="background:#88a; box-shadow: 0 6px 0 #668;">SAIR</a>
            </div>
        </div>
    `;
}

function atualizarStatus() {
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
}

function tocarSom(tipo) {
    const audio = new Audio(JOGO_CONFIG.sons[tipo]);
    audio.play().catch(e => console.log("Erro som:", e));
}
