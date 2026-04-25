let itensAtuais = [];
let indiceAtual = 0;
let acertos = 0;
let erros = 0;
let tempoInicio;
let intervaloTimer;
let selecaoAtual = []; 
let isDragging = false;
let pointerMoved = false;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.startLogic = function() { selecionarCategoria('animais'); };

// ANIMAÇÃO DE INTRODUÇÃO DINÂMICA
window.selecionarCategoria = function(key) {
    const cat = JOGO_CONFIG.categorias[key];
    itensAtuais = [...cat.itens].sort(() => Math.random() - 0.5).slice(0, 10);
    const containerIntro = document.getElementById('intro-animation-container');
    const letrasEx = cat.exemplo.split('');
    
    containerIntro.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:15px; position:relative; width:100%;">
            <div style="position:relative; width:150px; height:150px; display:flex; align-items:center; justify-content:center;">
                <img src="${JOGO_CONFIG.caminhoImg}${cat.exemploImg}" style="height:60px; z-index:5;">
                <svg id="intro-svg" style="position:absolute; width:100%; height:100%; pointer-events:none;"></svg>
                ${letrasEx.map((l, i) => {
                    const ang = (i * (360/letrasEx.length)) * (Math.PI/180);
                    const x = Math.cos(ang) * 60; const y = Math.sin(ang) * 60;
                    return `<div class="intro-letter" style="position:absolute; transform:translate(${x}px, ${y}px); width:30px; height:30px; background:white; border:2px solid var(--primary-blue); border-radius:50%; font-size:14px; display:flex; align-items:center; justify-content:center; color:var(--primary-blue); font-weight:900;">${l}</div>`;
                }).join('')}
                <div id="intro-cursor" style="position:absolute; width:12px; height:12px; background:var(--highlight-green); border-radius:50%; z-index:10; box-shadow:0 0 10px white;"></div>
            </div>
            <p style="font-weight:900; color:var(--primary-blue); text-align:center; font-size:14px;">LIGA AS LETRAS POR ORDEM!</p>
        </div>
    `;

    const cursor = document.getElementById('intro-cursor');
    const svg = document.getElementById('intro-svg');
    let points = [];
    letrasEx.forEach((_, i) => {
        const ang = (i * (360/letrasEx.length)) * (Math.PI/180);
        points.push({ x: 75 + Math.cos(ang) * 60, y: 75 + Math.sin(ang) * 60 });
    });

    let step = 0;
    function animateIntro() {
        if (!document.getElementById('intro-cursor')) return;
        const p = points[step % points.length];
        cursor.style.transition = "0.6s ease-in-out";
        cursor.style.left = (p.x - 6) + "px";
        cursor.style.top = (p.y - 6) + "px";
        if (step % points.length === 0) svg.innerHTML = "";
        if (step % points.length > 0) {
            const prev = points[(step % points.length) - 1];
            svg.innerHTML += `<line x1="${prev.x}" y1="${prev.y}" x2="${p.x}" y2="${p.y}" stroke="var(--primary-blue)" stroke-width="2" stroke-opacity="0.4" />`;
        }
        step++;
        setTimeout(animateIntro, 800);
    }
    animateIntro();
};

window.initGame = function() { 
    indiceAtual = 0; acertos = 0; erros = 0; 
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
    iniciarTimer(); 
    proximaRodada(); 
};

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
    selecaoAtual = [];
    document.getElementById('round-val').innerText = `${indiceAtual + 1} / ${itensAtuais.length}`;
    montarInterface(itensAtuais[indiceAtual]);
}

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 600;
    const letrasOriginais = item.nome.split('');
    const letrasWheel = [...letrasOriginais].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; user-select:none; touch-action:none;">
            <div id="word-display" style="display:flex; gap:8px; margin-top:10px; min-height:55px; align-items:center;">
                ${letrasOriginais.map((_, i) => `<div class="char-box" id="char-${i}" style="width:32px; height:48px; border-bottom:4px solid #cbd9e6; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; color:var(--primary-blue);"></div>`).join('')}
            </div>

            <div id="wheel-container" style="position:relative; width:${isMobile?'260px':'330px'}; height:${isMobile?'260px':'330px'}; display:flex; align-items:center; justify-content:center;">
                <div style="width:${isMobile?'95px':'130px'}; height:${isMobile?'95px':'130px'}; background:white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 25px rgba(0,0,0,0.1); z-index:5;">
                    <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-width:80%; max-height:80%; object-fit:contain;">
                </div>
                <!-- SVG PARA LINHA DISCRETA -->
                <svg id="conn-svg" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:3; overflow:visible;"></svg>
                
                ${letrasWheel.map((letra, i) => {
                    const angle = (i * (360 / letrasWheel.length)) * (Math.PI / 180);
                    const radius = isMobile ? 100 : 125;
                    const x = Math.cos(angle) * radius; const y = Math.sin(angle) * radius;
                    return `<div class="wheel-letter" data-letra="${letra}" data-id="${i}" style="position:absolute; transform:translate(${x}px, ${y}px); width:52px; height:52px; background:white; border:3px solid var(--primary-blue); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:900; color:var(--primary-blue); cursor:pointer; box-shadow:0 4px 0 var(--primary-dark); z-index:10;">${letra}</div>`;
                }).join('')}
            </div>
            <div style="height:10px;"></div>
        </div>`;

    setupInteractions();
}

function setupInteractions() {
    const letters = document.querySelectorAll('.wheel-letter');
    const container = document.getElementById('wheel-container');

    const startAction = (el, e) => {
        e.preventDefault();
        isDragging = true;
        pointerMoved = false;
        handleSelection(el);
    };

    letters.forEach(el => {
        el.onmousedown = (e) => startAction(el, e);
        el.ontouchstart = (e) => startAction(el, e);
        el.onmouseenter = () => { if(isDragging) { pointerMoved = true; handleSelection(el); } };
    });

    container.ontouchmove = (e) => {
        if(!isDragging) return;
        pointerMoved = true;
        const t = e.touches[0];
        const target = document.elementFromPoint(t.clientX, t.clientY);
        if(target && target.classList.contains('wheel-letter')) handleSelection(target);
    };

    const endAction = () => {
        if(!isDragging) return;
        const correta = itensAtuais[indiceAtual].nome;
        if (pointerMoved || selecaoAtual.length === correta.length) {
            validarFinal();
        }
        isDragging = false;
    };

    window.onmouseup = endAction;
    window.ontouchend = endAction;
}

function handleSelection(el) {
    const id = el.getAttribute('data-id');
    const letra = el.getAttribute('data-letra');

    // DESFAZER (UNDO) ao clicar na última selecionada (apenas modo clique)
    if (selecaoAtual.length > 0 && selecaoAtual[selecaoAtual.length - 1].id === id && !pointerMoved && !isDragging) {
        const last = selecaoAtual.pop();
        el.style.background = "white";
        el.style.color = "var(--primary-blue)";
        atualizarUI();
        return;
    }

    if (selecaoAtual.find(s => s.id === id)) return;

    // Obter coordenadas centrais relativas ao container da roda
    const rect = el.getBoundingClientRect();
    const parentRect = document.getElementById('wheel-container').getBoundingClientRect();
    
    selecaoAtual.push({ 
        letra, id, 
        x: (rect.left + rect.width / 2) - parentRect.left,
        y: (rect.top + rect.height / 2) - parentRect.top
    });
    
    el.style.background = "var(--primary-blue)";
    el.style.color = "white";
    atualizarUI();

    // Validação automática por clique
    const correta = itensAtuais[indiceAtual].nome;
    if (!pointerMoved && !isDragging && selecaoAtual.length === correta.length) {
        validarFinal();
    }
}

function atualizarUI() {
    // Atualiza traços no topo
    document.querySelectorAll('.char-box').forEach((box, i) => {
        box.innerText = selecaoAtual[i] ? selecaoAtual[i].letra : "";
    });

    // Atualiza Linhas SVG
    const svg = document.getElementById('conn-svg');
    if (!svg) return;
    
    let lineHTML = "";
    for (let i = 0; i < selecaoAtual.length - 1; i++) {
        const p1 = selecaoAtual[i];
        const p2 = selecaoAtual[i+1];
        lineHTML += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="var(--primary-blue)" stroke-width="3" stroke-opacity="0.4" stroke-linecap="round" />`;
    }
    svg.innerHTML = lineHTML;
}

function validarFinal() {
    if (selecaoAtual.length === 0) return;
    const formada = selecaoAtual.map(s => s.letra).join('');
    const correta = itensAtuais[indiceAtual].nome;

    if (formada === correta) {
        acertoFeedback();
    } else {
        if (formada.length >= correta.length || pointerMoved) {
            erros++;
            somErro.play();
            document.getElementById('miss-val').innerText = erros;
            resetRodada();
        }
    }
}

function acertoFeedback() {
    document.getElementById('game-main-content').style.pointerEvents = 'none';
    const cor = '#7ed321';
    
    document.querySelectorAll('.char-box').forEach(b => { if(b.innerText !== "") { b.style.color = cor; b.style.borderColor = cor; } });
    
    // Deixa a linha forte no acerto
    document.querySelectorAll('#conn-svg line').forEach(l => {
        l.setAttribute("stroke", cor);
        l.setAttribute("stroke-opacity", "1");
        l.setAttribute("stroke-width", "5");
    });

    selecaoAtual.forEach(s => {
        const el = document.querySelector(`[data-id="${s.id}"]`);
        if(el) { el.style.background = cor; el.style.borderColor = cor; }
    });

    acertos++;
    somAcerto.play();
    document.getElementById('hits-val').innerText = acertos;

    setTimeout(() => {
        document.getElementById('game-main-content').style.pointerEvents = 'all';
        indiceAtual++;
        proximaRodada();
    }, 1200);
}

function resetRodada() {
    selecaoAtual = [];
    document.querySelectorAll('.char-box').forEach(b => { b.innerText = ""; b.style.color = "var(--primary-blue)"; b.style.borderColor = "#cbd9e6"; });
    document.querySelectorAll('.wheel-letter').forEach(l => { l.style.background = "white"; l.style.color = "var(--primary-blue)"; });
    const svg = document.getElementById('conn-svg');
    if(svg) svg.innerHTML = "";
}

function finalizarJogo() {
    clearInterval(intervaloTimer);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
