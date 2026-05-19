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
    const timerBadge = document.querySelector('.badge-timer');
    if (timerBadge) {
        timerBadge.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}lampada.png" style="height:30px; width:30px; cursor:pointer;" onclick="usarAjuda()">`;
        timerBadge.style.background = "transparent"; timerBadge.style.padding = "0";
    }
    abrirLivroRegras();
};

function abrirLivroRegras() {
    const container = document.getElementById('intro-animation-container');
    container.innerHTML = `
        <style>
            .magic-book { background: #fff; border: 8px solid #8B4513; border-radius: 15px; padding: 20px; width: 95%; max-width: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); position: relative; }
            .rule-page { display: none; animation: fadeIn 0.5s; text-align: center; }
            .rule-page.active { display: block; }
            .rule-icon { font-size: 40px; margin-bottom: 10px; display: block; }
            .rule-title { color: #8B4513; font-weight: 900; font-size: 1.2rem; margin-bottom: 10px; text-transform: uppercase; }
            .rule-text { color: #5d7082; font-size: 0.95rem; font-weight: 700; line-height: 1.4; }
            .book-nav { display: flex; justify-content: center; gap: 10px; margin-top: 15px; }
            .dot { width: 12px; height: 12px; background: #ddd; border-radius: 50%; cursor: pointer; }
            .dot.active { background: var(--primary-blue); }
            .audio-rule { background: #ff9800; border: none; color: white; padding: 5px 15px; border-radius: 20px; cursor: pointer; font-weight: 900; margin-top: 10px; }
        </style>
        <div class="magic-book">
            <div class="rule-page active" id="p1">
                <span class="rule-icon">📖</span>
                <p class="rule-title">O que é uma sílaba?</p>
                <p class="rule-text">Sílaba é cada pedacinho de som que dizemos de uma só vez. <br> Exemplo: <b>BO-NE-CA</b> (3 batidas de palmas!)</p>
                <button class="audio-rule" onclick="falar('Sílaba é cada pedacinho de som que dizemos de uma só vez. Como bo ne ca!')">👂 OUVIR</button>
            </div>
            <div class="rule-page" id="p2">
                <span class="rule-icon">✂️</span>
                <p class="rule-title">Os Gémeos Separam-se!</p>
                <p class="rule-text">O <b>RR</b> e o <b>SS</b> não podem ficar juntos na mesma sílaba. Eles "brigam"! <br> Correto: <b>CAR-RO</b></p>
                <button class="audio-rule" onclick="falar('O erra erra e o essa essa separam-se sempre. Um fica de cada lado!')">👂 OUVIR</button>
            </div>
            <div class="rule-page" id="p3">
                <span class="rule-icon">🤝</span>
                <p class="rule-title">Amigos Inseparáveis!</p>
                <p class="rule-text">O <b>CH</b>, <b>LH</b> e <b>NH</b> são melhores amigos. Nunca os separes! <br> Correto: <b>CHU-VA</b></p>
                <button class="audio-rule" onclick="falar('O cê agá, o éle agá e o ene agá ficam sempre de mãos dadas na mesma sílaba!')">👂 OUVIR</button>
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
    document.getElementById('intro-instr').innerText = cat.descricao;
    perguntas = [...cat.itens].sort(() => 0.5 - Math.random()).slice(0, 10);
};

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    acertos = 0; erros = 0; ajudasUtilizadas = 0; indicePergunta = 0; jogoAtivo = true;
    mostrarPergunta();
};

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const item = perguntas[indicePergunta];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / 10`;

    container.innerHTML = `
        <style>
            .syllable-wrapper { width: 98%; height: 98%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; }
            .word-card { background: white; padding: 20px 50px; border-radius: 30px; border: 4px solid var(--primary-blue); font-size: 2.5rem; font-weight: 900; color: #333; letter-spacing: 5px; box-shadow: 0 10px 0 #eee; }
            .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; max-width: 600px; }
            .option-btn { background: white; border: 3px solid #eee; padding: 20px; border-radius: 20px; font-size: 1.4rem; font-weight: 900; color: var(--primary-blue); cursor: pointer; transition: 0.2s; box-shadow: 0 5px 0 #ddd; text-align: center; }
            .option-btn:hover { background: #f8fbff; border-color: var(--primary-blue); }
            .option-btn.correct { background: #7ed321 !important; color: white !important; border-color: #5ea31a !important; }
            .option-btn.wrong { background: #ff5e5e !important; color: white !important; border-color: #d13d3d !important; }
            @media (max-width: 600px) { .word-card { font-size: 1.8rem; padding: 15px 30px; } .option-btn { font-size: 1.1rem; padding: 15px; } }
        </style>
        <div class="syllable-wrapper">
            <div style="font-weight: 900; color: #88a; text-transform: uppercase;">Como se divide a palavra?</div>
            <div class="word-card">${item.palavra}</div>
            <div class="options-grid">
                ${item.opcoes.map(opt => `<div class="option-btn" onclick="verificarDivisao(this, '${opt}')">${opt}</div>`).join('')}
            </div>
        </div>
    `;
}

window.verificarDivisao = function(el, escolhida) {
    if (!jogoAtivo) return;
    const correta = perguntas[indicePergunta].divisao;
    jogoAtivo = false;

    if (escolhida === correta) {
        acertos++; somAcerto.play(); el.classList.add('correct');
    } else {
        erros++; somErro.play(); el.classList.add('wrong');
        document.querySelectorAll('.option-btn').forEach(btn => {
            if(btn.innerText === correta) btn.classList.add('correct');
        });
    }

    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < 10) { jogoAtivo = true; mostrarPergunta(); }
        else { finalizarJogo(); }
    }, 1500);
};

window.usarAjuda = function() {
    if (!jogoAtivo || !ajudaDisponivel) return;
    ajudaDisponivel = false; ajudasUtilizadas++;
    const correta = perguntas[indicePergunta].divisao;
    document.querySelectorAll('.option-btn').forEach(btn => {
        if(btn.innerText === correta) {
            btn.style.borderColor = "#ff9800"; btn.style.background = "#fff5e6";
            setTimeout(() => { btn.style.borderColor = "#eee"; btn.style.background = "white"; ajudaDisponivel = true; }, 1500);
        }
    });
};

// === 3. ECRÃ DE RESULTADOS (PADRÃOCraque) ===
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
                <img src="${JOGO_CONFIG.caminhoImg}${rank.img}" style="width:130px; display:block; margin: 0 auto 10px;">
                <h1 style="color:var(--primary-blue); font-weight:900; font-size:2.2rem; margin:15px 0; text-align:center; line-height:1;">${rank.titulo}</h1>
                <div style="display:flex; gap:12px; margin-bottom:30px; width:100%; justify-content:center;">
                    <div style="background:white; border-radius:20px; width:105px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05);"><span style="font-size:1.8rem; font-weight:900; color:#7ed321;">${acertos}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Certos</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);"><span style="font-size:1.8rem; font-weight:900; color:#ff5e5e;">${erros}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Errados</span></div>
                    <div style="background:white; border-radius:20px; width:100px; height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 20px rgba(0,0,0,0.05);"><span style="font-size:1.8rem; font-weight:900; color:#ff9f43;">${ajudasUtilizadas}</span><span style="font-size:0.65rem; font-weight:900; color:#88a; text-transform:uppercase;">Ajudas</span></div>
                </div>
                <button style="height:60px; border-radius:30px; font-size:1.2rem; width:100%; max-width:320px; background:var(--primary-blue); color:white; border:none; box-shadow:0 6px 0 var(--primary-dark); font-weight:900; cursor:pointer;" onclick="location.reload()"><i class="fas fa-redo"></i> JOGAR DE NOVO</button>
                <button style="height:60px; border-radius:30px; font-size:1.1rem; background:white; color:var(--primary-blue); border:3px solid var(--primary-blue); margin: 12px 0; width:100%; max-width:320px; font-weight:900; cursor:pointer;" onclick="openRDMenu()"><i class="fas fa-chart-line"></i> OUTRO NÍVEL</button>
                <a href="${JOGO_CONFIG.linkVoltar}" style="height:60px; border-radius:30px; font-size:1.1rem; background:#e2e8f0; color:#64748b; text-decoration:none; display:flex; align-items:center; justify-content:center; width:100%; max-width:320px; font-weight:900;"><i class="fas fa-sign-out-alt"></i> SAIR</a>
            </div>
        </div>
    `;
}
