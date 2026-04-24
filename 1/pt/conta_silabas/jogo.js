let itensAtuais = [];
let indiceQuestao = 0;
let acertos = 0;
let erros = 0;
let segundos = 0;
let cronometro = null;
let categoriaAtiva = 'animais';
let intervalAnim = null;

window.startLogic = function() {
    window.atualizarAnimacao(categoriaAtiva);
};

window.selecionarCategoria = function(chave) {
    categoriaAtiva = chave;
    const cat = JOGO_CONFIG.categorias[chave];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    window.atualizarAnimacao(chave);
};

window.atualizarAnimacao = function(chave) {
    const container = document.getElementById('intro-animation-container');
    const cat = JOGO_CONFIG.categorias[chave];
    if (intervalAnim) clearInterval(intervalAnim);

    container.innerHTML = `
        <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div style="background:white; padding:10px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:80px;">
            </div>
            <div style="font-size:22px; font-weight:900; letter-spacing:4px; color:var(--primary-blue); background:white; padding:5px 15px; border-radius:10px;">
                ${cat.exemplo}
            </div>
            <div style="display:flex; gap:8px; position:relative;">
                ${[1, 2, 3, 4].map(n => `<div id="anim-btn-${n}" style="width:35px; height:35px; background:#eee; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900;">${n}</div>`).join('')}
                <i id="anim-hand" class="fas fa-mouse-pointer" style="position:absolute; color:var(--error-red); font-size:25px; bottom:-15px; right:0; transition:0.8s ease-in-out; opacity:0;"></i>
            </div>
        </div>
    `;

    const hand = document.getElementById('anim-hand');
    const targetBtn = document.getElementById(`anim-btn-${cat.total}`);

    function rodarCiclo() {
        if (!hand || !targetBtn) return;
        hand.style.opacity = "0"; hand.style.transform = "translate(0, 0)";
        targetBtn.style.background = "#eee"; targetBtn.style.color = "black";
        setTimeout(() => {
            hand.style.opacity = "1"; hand.style.transform = "translate(-120px, -20px)";
            setTimeout(() => {
                targetBtn.style.background = "var(--primary-blue)"; targetBtn.style.color = "white";
                targetBtn.style.transform = "scale(1.1)"; setTimeout(() => targetBtn.style.transform = "scale(1)", 200);
            }, 800);
        }, 500);
    }
    rodarCiclo(); intervalAnim = setInterval(rodarCiclo, 3000);
};

window.initGame = function() {
    indiceQuestao = 0; acertos = 0; erros = 0; segundos = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    montarQuestao();
};

function montarQuestao() {
    const area = document.getElementById('game-main-content');
    const item = itensAtuais[indiceQuestao];
    document.getElementById('round-val').innerText = `${indiceQuestao + 1} / 10`;

    area.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
            <div style="background:white; padding:15px; border-radius:20px; box-shadow:0 8px 20px rgba(0,0,0,0.06); margin-bottom:15px;">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="height:130px;">
            </div>
            <h2 style="font-size:32px; color:var(--primary-blue); font-weight:900; margin-bottom:20px;">${item.nome}</h2>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; width:100%; max-width:320px;">
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
        erros++; document.getElementById('miss-val').innerText = erros;
        btn.style.background = "var(--error-red)";
        new Audio(JOGO_CONFIG.sons.erro).play();
        botoes[correta - 1].style.border = "4px solid var(--highlight-green)";
    }

    setTimeout(() => {
        if (indiceQuestao < 9) { indiceQuestao++; montarQuestao(); } 
        else {
            clearInterval(cronometro);
            const feedback = JOGO_CONFIG.relatorios.find(p => acertos >= p.min && acertos <= p.max);
            document.getElementById('res-taca').src = JOGO_CONFIG.caminhoIcons + feedback.img;
            document.getElementById('res-tit').innerText = feedback.titulo;
            document.getElementById('res-pts').innerText = acertos;
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById('scr-result').classList.add('active');
            document.getElementById('status-bar').style.display = 'none';
            new Audio(JOGO_CONFIG.sons.vitoria).play();
        }
    }, 700);
};

function iniciarCronometro() {
    if (cronometro) clearInterval(cronometro);
    cronometro = setInterval(() => {
        segundos++;
        let m = Math.floor(segundos / 60).toString().padStart(2, '0');
        let s = (segundos % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}
