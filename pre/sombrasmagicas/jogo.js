let perguntas = [];
let indicePergunta = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTempo;
let categoriaAtual = "animais";

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

// === 1. INICIALIZAÇÃO E TUTORIAL ===
window.startLogic = function() {
    selecionarCategoria(categoriaAtual);
    criarAnimacaoTutorial();
};

window.gerarIntroJogo = function() {
    return "Olha para a sombra e escolhe o desenho correto!";
};

function selecionarCategoria(key) {
    categoriaAtual = key;
    const cat = JOGO_CATEGORIAS[key];
    perguntas = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
}

function criarAnimacaoTutorial() {
    const container = document.getElementById('intro-animation-container');
    if(!container) return;
    const itemTut = JOGO_CATEGORIAS.animais.itens[0];
    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:20px;">
            <div style="height:100px; width:100px; background:#f5f5f5; border-radius:20px; display:flex; align-items:center; justify-content:center; border:2px solid #eee;">
                <img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="height:70px; width:auto; filter:brightness(0); opacity:0.3; object-fit:contain;">
            </div>
            <div style="display:flex; gap:12px; justify-content:center;">
                <div style="height:60px; width:60px; background:white; border:2px solid #eee; border-radius:12px;"></div>
                <div style="height:60px; width:60px; background:white; border:2px solid var(--primary-blue); border-radius:12px; display:flex; align-items:center; justify-content:center; position:relative;">
                    <img src="${JOGO_CONFIG.caminhoImg}${itemTut.img}" style="height:40px; width:auto; object-fit:contain;">
                    <div style="position:absolute; font-size:45px; bottom:-35px; right:-25px; animation: tapH 2s infinite; z-index:10;">☝️</div>
                </div>
                <div style="height:60px; width:60px; background:white; border:2px solid #eee; border-radius:12px;"></div>
            </div>
        </div>
        <style>@keyframes tapH { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-8px,-12px) scale(1.1); } }</style>
    `;
}

// === 2. LÓGICA DO JOGO ===
window.initGame = function() {
    indicePergunta = 0; acertos = 0; erros = 0;
    document.getElementById('hits-val').innerText = "0";
    document.getElementById('miss-val').innerText = "0";
    iniciarCronometro();
    mostrarPergunta();
};

function iniciarCronometro() {
    tempoInicio = Date.now();
    clearInterval(intervaloTempo);
    intervaloTempo = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        const min = Math.floor(decorrido / 60).toString().padStart(2, '0');
        const seg = (decorrido % 60).toString().padStart(2, '0');
        document.getElementById('timer-val').innerText = `${min}:${seg}`;
    }, 1000);
}

function mostrarPergunta() {
    const container = document.getElementById('game-main-content');
    const pergunta = perguntas[indicePergunta];
    document.getElementById('round-val').innerText = `${indicePergunta + 1} / ${perguntas.length}`;

    let erradas = JOGO_CATEGORIAS[categoriaAtual].itens.filter(i => i.img !== pergunta.img).sort(() => Math.random() - 0.5).slice(0, 2);
    let opcoes = [pergunta, ...erradas].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <style>
            .game-wrapper { 
                display: flex; flex-direction: column; 
                width: 100%; height: 100%; 
                align-items: center; 
                padding-top: 30px; padding-bottom: 30px; /* Margens padrão */
                box-sizing: border-box; overflow: hidden;
            }
            .shadow-zone { 
                flex: 1; display: flex; align-items: center; justify-content: center; 
                width: 100%; min-height: 0; 
                background: rgba(255,255,255,0.4); border-radius: 30px; 
            }
            .shadow-img { 
                height: 80%; width: auto; max-width: 85%; 
                object-fit: contain; 
                filter: brightness(0); opacity: 0.8; transition: 0.5s; 
            }
            .spacer { height: 35px; flex-shrink: 0; }
            
            .options-row { 
                display: flex; justify-content: center; gap: 15px; 
                width: 100%; flex-shrink: 0;
            }
            .card-opt { 
                background: white; border: 3px solid #eee; border-radius: 20px; 
                height: 90px; width: 90px; /* Base Mobile */
                display: flex; align-items: center; justify-content: center; 
                cursor: pointer; transition: 0.2s; box-shadow: 0 5px 0 #ddd; 
                padding: 12px; box-sizing: border-box; flex-shrink: 0;
            }
            .card-opt img { height: 100%; width: auto; max-width: 100%; object-fit: contain; }
            .is-correct { background: #e8f9e8 !important; border-color: #7ed321 !important; box-shadow: 0 5px 0 #5ea31a !important; }
            .is-wrong { background: #fff1f1 !important; border-color: #ff5e5e !important; box-shadow: 0 5px 0 #d13d3d !important; }
            
            /* AJUSTE PC: Equilíbrio entre Sombra e Opções */
            @media (min-width: 800px) {
                .shadow-img { height: 65%; } /* Sombra um pouco menor no PC */
                .card-opt { height: 140px; width: 140px; border-width: 4px; } /* Opções maiores no PC */
                .spacer { height: 40px; }
            }

            @media (orientation: landscape) and (max-height: 500px) {
                .game-wrapper { flex-direction: row; padding: 15px; gap: 20px; justify-content: center; }
                .shadow-zone { height: 100%; width: 100%; margin-bottom: 0; }
                .options-row { flex-direction: column; width: auto; height: 100%; gap: 10px; }
                .card-opt { height: 65px; width: 65px; }
                .spacer { display: none; }
            }
        </style>
        <div class="game-wrapper">
            <div class="shadow-zone"><img src="${JOGO_CONFIG.caminhoImg}${pergunta.img}" class="shadow-img" id="target-obj"></div>
            <div class="spacer"></div>
            <div class="options-row">
                ${opcoes.map(opt => `<div class="card-opt" onclick="validar(this, ${opt.img === pergunta.img})"><img src="${JOGO_CONFIG.caminhoImg}${opt.img}"></div>`).join('')}
            </div>
        </div>
    `;
}

function validar(el, acerto) {
    document.querySelectorAll('.card-opt').forEach(c => c.style.pointerEvents = 'none');
    const obj = document.getElementById('target-obj');
    if (acerto) {
        acertos++; somAcerto.play(); el.classList.add('is-correct');
        obj.style.filter = "none"; obj.style.opacity = "1";
        document.getElementById('hits-val').innerText = acertos;
    } else {
        erros++; somErro.play(); el.classList.add('is-wrong');
        document.getElementById('miss-val').innerText = erros;
    }
    setTimeout(() => {
        indicePergunta++;
        if (indicePergunta < perguntas.length) mostrarPergunta();
        else finalizarJogo();
    }, 1500);
}

// === 3. FINALIZAÇÃO E RESULTADOS ===
function finalizarJogo() {
    clearInterval(intervaloTempo); somVitoria.play();
    const totalP = perguntas.length;
    const perc = (acertos / totalP) * 100;
    const rel = JOGO_CONFIG.relatorios.find(r => perc >= r.min && perc <= r.max);
    const tempoFinal = document.getElementById('timer-val').innerText;
    const resScreen = document.getElementById('scr-result');

    resScreen.className = "screen screen-box active"; 

    // REMOVIDO PADDING DE 50PX - Conteúdo ocupa o espaço natural
    resScreen.innerHTML = `
        <style>
            .res-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; box-sizing: border-box; }
            .res-btn-group-final { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 320px; }
            .res-stats-final { display: flex; gap: 12px; width: 100%; max-width: 320px; margin: 15px 0 20px; }
            .res-btn { padding: 15px; border-radius: 18px; font-weight: 900; font-size: 15px; cursor: pointer; border: none; text-align: center; text-decoration: none; text-transform: uppercase; }
            .res-btn-p { background: var(--primary-blue); color: white; box-shadow: 0 5px 0 var(--primary-dark); }
            .res-btn-o { background: white; color: var(--primary-blue); border: 3px solid var(--primary-blue); box-shadow: 0 5px 0 var(--primary-blue); padding: 12px; }
            .res-btn-m { background: #dce4ee; color: #5d7082; box-shadow: 0 5px 0 #b8c5d4; }
            .res-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }
        </style>
        <div class="res-inner">
            <img src="${JOGO_CONFIG.caminhoIcons}${rel.img}" style="height:120px; width:auto; margin-bottom:10px; object-fit:contain;">
            <h2 style="color: var(--primary-blue); font-weight:900; font-size:1.7rem; margin-bottom:10px; text-align:center;">${rel.titulo}</h2>
            
            <div class="res-stats-final">
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${acertos} / ${totalP}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Acertos</span>
                </div>
                <div class="res-stat-card" style="background:white; border-radius:15px; padding:10px; flex:1; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.05); border:1px solid #f0f0f0;">
                    <span style="display:block; font-size:22px; font-weight:900; color:var(--primary-blue);">${tempoFinal}</span>
                    <span style="font-size:10px; font-weight:800; color:#88a; text-transform:uppercase;">Tempo</span>
                </div>
            </div>

            <div class="res-btn-group-final">
                <button class="res-btn res-btn-p" onclick="location.reload()">Jogar de Novo</button>
                <button class="res-btn res-btn-o" onclick="openRDMenu()">Outro Tema / Nível</button>
                <a href="${JOGO_CONFIG.linkVoltar}" class="res-btn res-btn-m">Escolher outro jogo</a>
            </div>
        </div>
    `;

    document.querySelectorAll('.screen').forEach(s => { if(s.id !== 'scr-result') s.classList.remove('active'); });
    document.getElementById('status-bar').style.display = 'none';
}
