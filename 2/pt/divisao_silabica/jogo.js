let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let ajudasUtilizadas = 0;
let jogoAtivo = false;
let ajudaDisponivel = true;
let categoriaAtual = "simples";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO E LIVRO MÁGICO ===
window.startLogic = function() {
    if (!categoriaAtual) categoriaAtual = "simples";
    carregarPerguntas(categoriaAtual);

    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent"; timerBadge.style.padding = "0";
    }

    abrirLivroRegras();
};

function carregarPerguntas(key) {
    const cat = JOGO_CATEGORIAS[key];
    // Sorteia 10 das 20+ palavras disponíveis
    perguntas = [...cat.itens].sort(() => 0.5 - Math.random()).slice(0, 10);
}

function abrirLivroRegras() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    container.innerHTML = `
        <style>
            .magic-book { background: #fff; border: 6px solid var(--primary-blue); border-radius: 25px; padding: 20px; width: 95%; max-width: 480px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); position: relative; }
            .rule-page { display: none; text-align: center; }
            .rule-page.active { display: block; animation: fadeIn 0.4s; }
            .rule-icon { font-size: 50px; display: block; margin-bottom: 10px; }
            .rule-title { color: var(--primary-dark); font-weight: 900; font-size: 1.3rem; margin-bottom: 10px; text-transform: uppercase; }
            .rule-text { color: #5d7082; font-size: 1rem; font-weight: 700; line-height: 1.4; margin-bottom: 15px; }
            .book-nav { display: flex; justify-content: center; gap: 10px; margin-top: 15px; }
            .dot { width: 12px; height: 12px; background: #eee; border-radius: 50%; cursor: pointer; border: 2px solid #ddd; }
            .dot.active { background: var(--primary-blue); border-color: var(--primary-dark); }
            .audio-btn-rule { background: #ff9800; border: none; color: white; padding: 8px 20px; border-radius: 25px; cursor: pointer; font-weight: 900; box-shadow: 0 4px 0 #e65100; }
        </style>
        <div class="magic-book">
            <div class="rule-page active" id="p1">
                <span class="rule-icon">🗣️</span>
                <p class="rule-title">O que são sílabas?</p>
                <p class="rule-text">São os pedacinhos de som que dizemos de uma vez. <br> <b>BO-NE-CA</b> tem 3 sílabas!</p>
                <button class="audio-btn-rule" onclick="falar('Sílaba é cada pedacinho de som. Como bo ne ca. Três sons!')">👂 OUVIR</button>
            </div>
            <div class="rule-page" id="p2">
                <span class="rule-icon">🤝</span>
                <p class="rule-title">O RR e o SS juntos!</p>
                <p class="rule-text">Neste jogo, o <b>RR</b> e o <b>SS</b> ficam sempre na mesma sílaba. <br> Exemplo: <b>CA-RRO</b></p>
                <button class="audio-btn-rule" onclick="falar('O erra erra e o essa essa ficam sempre de mãos dadas na mesma sílaba. Ca rro!')">👂 OUVIR</button>
            </div>
            <div class="rule-page" id="p3">
                <span class="rule-icon">🤝</span>
                <p class="rule-title">CH, LH e NH juntos!</p>
                <p class="rule-text">Estes amigos nunca se separam. <br> Ficam sempre juntos: <b>CHU-VA</b></p>
                <button class="audio-btn-rule" onclick="falar('O cê agá, o éle agá e o ene agá nunca se separam. Ficam sempre juntos!')">👂 OUVIR</button>
            </div>
            <div class="book-nav">
                <div class="dot active" onclick="irParaPagina(1)"></div>
                <div class="dot" onclick="irParaPagina(2)"></div>
                <div class="dot" onclick="irParaPagina(3)"></div>
            </div>
        </div>
    `;
}

window.irParaPagina = function(n) {
    document.querySelectorAll('.rule-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    document.getElementById('p' + n).classList.add('active');
    document.querySelectorAll('.dot')[n-1].classList.add('active');
};

window.falar = function(texto) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-PT';
    window.speechSynthesis.speak(msg);
};

window.selecionarCategoria = function(key) {
    categoriaAtual = key;
    const cat = JOGO_CATEGORIAS[key];
    const introInstr = document.getElementById('intro-instr');
    if(introInstr) introInstr.innerText = cat.descricao;
    carregarPerguntas(key);
};

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    if (perguntas.length === 0) carregarPerguntas(categoriaAtual);
    acertos = 0; erros = 0; ajudasUtilizadas = 0; indicePergunta = 0; jogoAtivo = true;
    mostrarPergunta();
};

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const item = perguntas[indicePergunta];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .syllable-play { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; padding: 10px; }
            .main-word { background: white; padding: 25px 60px; border-radius: 40px; border: 5px solid var(--primary-blue); font-size: 3rem; font-weight: 900; color: #333; letter-spacing: 4px; box-shadow: 0 10px 0 #eee; }
            .grid-opts { display: grid; grid-template-columns: 1fr; gap: 12px; width: 100%; max-width: 500px; }
            .btn-opt { background: white; border: 3px solid #f0f4f8; padding: 18px; border-radius: 20px; font-size: 1.5rem; font-weight: 900; color: var(--primary-blue); cursor: pointer; transition: 0.2s; box-shadow: 0 5px 0 #d0d8de; text-align: center; }
            .btn-opt:hover { border-color: var(--primary-blue); background: #f8fbff; }
            .btn-opt.correct { background: #7ed321 !important; color: white !important; border-color: #5ea31a !important; box-shadow: 0 5px 0 #5ea31a !important; }
            .btn-opt.wrong { background: #ff5e5e !important; color: white !important; border-color: #d13d3d !important; box-shadow: 0 5px 0 #d13d3d !important; }
            @media (max-width: 600px) { .main-word { font-size: 2.2rem; padding: 15px 30px; } .btn-opt { font-size: 1.2rem; } }
        </style>
        <div class="syllable-play">
            <div style="font-weight: 900; color: #88a; text-transform: uppercase;">Como dividimos esta palavra?</div>
            <div class="main-word">${item.palavra}</div>
            <div class="grid-opts">
                ${item.opcoes.map(opt => `<div class="btn-opt" onclick="validar(this, '${opt}')">${opt}</div>`).join('')}
            </div>
        </div>
    `;
}

window.validar = function(el, escolhida) {
    if (!jogoAtivo) return;
    const correta = perguntas[indicePergunta].divisao;
    jogoAtivo = false;
    document.querySelectorAll('.btn-opt').forEach(b => b.style.pointerEvents = 'none');

    if (escolhida === correta) {
        acertos++; somAcerto.play(); el.classList.add('correct');
    } else {
        erros++; somErro.play(); el.classList.add('wrong');
        document.querySelectorAll('.btn-opt').forEach(btn => {
            if(btn.innerText === correta) btn.classList.add('correct');
        });
    }

    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < 10) { jogoAtivo = true; mostrarPergunta(); }
        else { finalizarJogo(); }
    }, 1800);
};

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const correta = perguntas[indicePergunta].divisao;
    document.querySelectorAll('.btn-opt').forEach(btn => {
        if(btn.innerText === correta) {
            btn.style.borderColor = "#ff9800"; btn.style.background = "#fff5e6";
            setTimeout(() => { btn.style.borderColor = "#f0f4f8"; btn.style.background = "white"; ajudaDisponivel = true; }, 1500);
        }
    });
};

function finalizarJogo() {
    somVitoria.play();
    const perc = Math.round((acertos / 10) * 100);
    let rank = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    
    document.getElementById('scr-game').classList.remove('active');
    const resScreen = document.getElementById('scr-result');
    resScreen.classList.add('active');
    document.getElementById('status-bar').style.display = 'none';

    resScreen.innerHTML = `
        <div class="screen-box" style="justify-content: center; padding: 20px; display: flex !important;">
            <div style="display:flex; flex-direction:column; align-items:center; width:100%; max-width:450px; margin:auto;">
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px; margin-bottom:10px; display:block; margin-left:auto; margin-right:auto;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center; line-height:1;">${rank.titulo}</h1>
                <div style="display:flex; gap:15px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:25px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border:1px solid #f0f0f0;"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 12px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
