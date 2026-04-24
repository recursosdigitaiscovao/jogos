let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let segundos = 0;
let cronometro = null;
let categoriaAtiva = Object.keys(JOGO_CONFIG.categorias)[0];

window.startLogic = function() {
    window.selecionarCategoria(categoriaAtiva);
};

window.selecionarCategoria = function(chave) {
    categoriaAtiva = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    
    // Atualiza animação da intro
    const container = document.getElementById('intro-animation-container');
    container.innerHTML = `
        <div style="text-align:center;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:100px; margin-bottom:10px;">
            <div style="font-size:24px; font-weight:900; color:var(--primary-blue);">${cat.exemplo}</div>
        </div>
    `;
};

window.initGame = function() {
    indiceQuestao = 0; acertos = 0; segundos = 0;
    document.getElementById('hits-val').innerText = "0";
    iniciarCronometro();
    montarQuestao();
};

function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / 10`;

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; animation: fadeIn 0.4s;">
            <div style="background:white; padding:20px; border-radius:25px; box-shadow:0 10px 20px rgba(0,0,0,0.05); margin-bottom:20px;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:150px; object-fit:contain;">
            </div>
            <h2 style="font-size:35px; color:var(--primary-blue); font-weight:900; margin-bottom:25px;">${item.nome}</h2>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; width:100%; max-width:400px;">
                ${[1, 2, 3, 4].map(n => `<button class="btn-jogar-stretch" onclick="validarResposta(this, ${n})">${n}</button>`).join('')}
            </div>
        </div>
    `;
}

window.validarResposta = function(btn, num) {
    const correta = itensAtuais[indiceQuestao].silabas;
    const botoes = document.querySelectorAll('#game-main-content button');
    botoes.forEach(b => b.style.pointerEvents = 'none');

    if (num === correta) {
        acertos++; document.getElementById('hits-val').innerText = acertos;
        btn.style.background = "var(--highlight-green)";
        new Audio(JOGO_CONFIG.sons.acerto).play();
    } else {
        btn.style.background = "var(--error-red)";
        new Audio(JOGO_CONFIG.sons.erro).play();
        botoes[correta - 1].style.border = "4px solid var(--highlight-green)";
    }

    setTimeout(() => {
        if (indiceQuestao < 9) { indiceQuestao++; montarQuestao(); } 
        else { finalizarJogo(); }
    }, 800);
};

function finalizarJogo() {
    clearInterval(cronometro);
    new Audio(JOGO_CONFIG.sons.vitoria).play();
    const feedback = JOGO_CONFIG.relatorios.find(p => acertos >= p.min && acertos <= p.max);
    document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + feedback.img;
    document.getElementById('res-tit').innerText = feedback.titulo;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('scr-result').classList.add('active');
    document.getElementById('status-bar').style.display = 'none';
}

function iniciarCronometro() {
    if (cronometro) clearInterval(cronometro);
    cronometro = setInterval(() => {
        segundos++;
        let m = Math.floor(segundos / 60).toString().padStart(2, '0');
        let s = (segundos % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}
