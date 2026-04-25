let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let pecaSendoArrastada = null;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px;">
            <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:70px;">
            <div style="display:flex; align-items:center; gap:10px; font-size:35px; font-weight:900; color:var(--primary-blue);">
                <div style="width:50px; height:60px; border:3px dashed var(--primary-blue); border-radius:10px; position:relative;">
                    <div style="width:50px; height:60px; background:white; border:3px solid var(--primary-blue); border-radius:10px; display:flex; align-items:center; justify-content:center; position:absolute; top:-3px; left:-3px; animation: demoIn 2s infinite;">${cat.exemplo[0]}</div>
                </div>
                <span>${cat.exemplo.substring(1)}</span>
            </div>
        </div>
        <style>@keyframes demoIn { 0%, 20% { transform: translateY(40px); opacity: 0; } 50%, 80% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(0); opacity: 0; } }</style>`;
};

window.initGame = function() { indiceAtual = 0; acertos = 0; erros = 0; iniciarTimer(); proximaRodada(); };

function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoInicio = Date.now();
    intervaloTimer = setInterval(() => {
        const decorrido = Math.floor((Date.now() - tempoInicio) / 1000);
        document.getElementById('timer-val').innerText = `${Math.floor(decorrido/60).toString().padStart(2,'0')}:${(decorrido%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function proximaRodada() {
    if (indiceAtual >= itensAtuais.length) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(itensAtuais[indiceAtual]);
}

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 600;
    const correta = item.nome[0];
    const opcoes = [correta, ...("ABCDEFGHIJKLMNOPQRSTUVWXYZ".replace(correta,"").split("").sort(()=>.5-Math.random()).slice(0,3))].sort(()=>.5-Math.random());

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-around; padding:10px 0;">
            <div style="background:white; padding:15px; border-radius:30px; box-shadow: 0 6px 15px rgba(0,0,0,0.06);">
                <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${isMobile?'130px':'200px'}; max-width:80vw; object-fit:contain;">
            </div>
            <div style="display:flex; align-items:center; gap:10px; margin: 15px 0;">
                <div id="target-letter" class="slot" ondrop="drop(event)" ondragover="allowDrop(event)" style="width:65px; height:75px; border:4px dashed #cbd9e6; border-radius:15px; display:flex; align-items:center; justify-content:center; font-size:45px; font-weight:900; color:var(--primary-blue);"></div>
                <div style="font-size:${isMobile?'35px':'55px'}; font-weight:900; color:#445; letter-spacing:3px;">${item.nome.substring(1)}</div>
            </div>
            <div id="options-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; width:100%; max-width:400px;"></div>
        </div>`;

    opcoes.forEach(l => document.getElementById('options-grid').appendChild(criarBotaoLetra(l, correta)));
}

function criarBotaoLetra(letra, correta) {
    const div = document.createElement('div');
    div.className = 'silaba-btn'; div.innerText = letra; div.draggable = true; div.id = 'L-'+Math.random();
    Object.assign(div.style, { height: '75px', background: 'white', color: 'var(--primary-blue)', border: '3px solid var(--primary-blue)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px', fontWeight: '900', cursor: 'grab', boxShadow: '0 5px 0 var(--primary-dark)', touchAction: 'none' });

    div.ontouchstart = function(e) { e.preventDefault(); pecaSendoArrastada = this; const t = e.touches[0]; const r = this.getBoundingClientRect(); this.dataset.ox = t.clientX - r.left; this.dataset.oy = t.clientY - r.top; this.style.zIndex="1000"; };
    div.ontouchmove = function(e) { if(!pecaSendoArrastada) return; e.preventDefault(); const t = e.touches[0]; this.style.position='fixed'; this.style.pointerEvents='none'; this.style.left=(t.clientX-this.dataset.ox)+'px'; this.style.top=(t.clientY-this.dataset.oy)+'px'; };
    div.ontouchend = function(e) { if(!pecaSendoArrastada) return; this.style.pointerEvents='auto'; const t = e.changedTouches[0]; const slot = document.elementFromPoint(t.clientX, t.clientY)?.closest('.slot'); if(slot) verificar(letra, correta); this.style.position='relative'; this.style.left='0'; this.style.top='0'; pecaSendoArrastada=null; };
    div.onclick = () => verificar(letra, correta);
    return div;
}

function verificar(escolhida, correta) {
    const slot = document.getElementById('target-letter');
    document.getElementById('game-main-content').style.pointerEvents = 'none';
    slot.innerText = escolhida;
    const acerto = escolhida === correta;
    slot.style.backgroundColor = acerto ? '#7ed321' : '#ff5e5e';
    slot.style.borderColor = acerto ? '#7ed321' : '#ff5e5e';
    slot.style.color = 'white';
    if(acerto) { acertos++; somAcerto.play(); } else { erros++; somErro.play(); }
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    setTimeout(() => { document.getElementById('game-main-content').style.pointerEvents = 'all'; indiceAtual++; proximaRodada(); }, 1200);
}

window.allowDrop = e => e.preventDefault();
window.drop = e => { e.preventDefault(); verificar(pecaSendoArrastada.innerText, itensAtuais[indiceAtual].nome[0]); };

function finalizarJogo() { clearInterval(intervaloTimer); somVitoria.play(); window.mostrarResultados(acertos, document.getElementById('timer-val').innerText); }
