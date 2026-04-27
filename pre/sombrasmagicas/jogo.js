let categoriaAtiva, itensAtuais, itemCorreto, rodadaAtual, acertos, tempoInicio, cronometroInterval;
const totalRodadas = 10;

const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.iniciarLogicaJogo = () => {
    const defaultCat = Object.keys(JOGO_CONFIG.categorias)[0];
    window.selecionarCategoria(defaultCat);
    window.comecarJogo(); 
};

window.selecionarCategoria = (key) => {
    categoriaAtiva = JOGO_CONFIG.categorias[key];
    itensAtuais = [...categoriaAtiva.itens].sort(() => Math.random() - 0.5);
};

window.comecarJogo = () => {
    clearInterval(cronometroInterval);
    acertos = 0; rodadaAtual = 1; tempoInicio = new Date();
    iniciarCronometro(); 
    proximaRodada();
};

function proximaRodada() {
    if (rodadaAtual > totalRodadas) { finalizarJogo(); return; }
    document.getElementById('round-val').innerText = `${rodadaAtual} / ${totalRodadas}`;
    
    const containerSombras = document.getElementById('alvos-sombras');
    const containerPecas = document.getElementById('pecas-coloridas');
    containerSombras.innerHTML = ''; containerPecas.innerHTML = '';

    itemCorreto = itensAtuais[(rodadaAtual - 1) % itensAtuais.length];

    const sombra = document.createElement('div');
    sombra.className = 'shadow-target';
    sombra.id = "alvo-final";
    sombra.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${itemCorreto.img}" style="filter: brightness(0); width:80%;">`;
    containerSombras.appendChild(sombra);

    let pool = categoriaAtiva.itens.filter(i => i.nome !== itemCorreto.nome).sort(() => Math.random() - 0.5);
    let opcoes = [itemCorreto, pool[0], pool[1]].sort(() => Math.random() - 0.5);

    opcoes.forEach(item => {
        const peca = document.createElement('div');
        peca.className = 'draggable';
        peca.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="width:100%; pointer-events:none;">`;
        
        peca.onpointerdown = (e) => { peca.setPointerCapture(e.pointerId); peca.isDragging = false; };
        peca.onpointermove = (e) => { 
            if(e.buttons > 0) {
                peca.isDragging = true;
                peca.style.position = 'fixed'; peca.style.zIndex = '1000';
                peca.style.left = (e.clientX - 45) + 'px'; peca.style.top = (e.clientY - 45) + 'px';
            }
        };
        peca.onpointerup = (e) => {
            peca.releasePointerCapture(e.pointerId); peca.style.position = 'static';
            const alvo = document.getElementById('alvo-final').getBoundingClientRect();
            const hit = (e.clientX > alvo.left && e.clientX < alvo.right && e.clientY > alvo.top && e.clientY < alvo.bottom);
            if (hit || !peca.isDragging) validarEscolha(item.nome, peca);
        };
        containerPecas.appendChild(peca);
    });
}

function validarEscolha(nome, el) {
    const alvo = document.getElementById('alvo-final');
    document.getElementById('pecas-coloridas').style.pointerEvents = 'none';
    if (nome === itemCorreto.nome) {
        acertos++; somAcerto.play();
        alvo.style.background = "#e7f9e7";
        alvo.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${itemCorreto.img}" style="width:80%;">`;
    } else {
        somErro.play();
        alvo.style.borderColor = "var(--error-red)";
    }
    setTimeout(() => { 
        document.getElementById('pecas-coloridas').style.pointerEvents = 'auto';
        rodadaAtual++; proximaRodada(); 
    }, 1200);
}

function iniciarCronometro() {
    cronometroInterval = setInterval(() => {
        let diff = Math.floor((new Date() - tempoInicio) / 1000);
        document.getElementById('timer-val').innerText = `${Math.floor(diff/60).toString().padStart(2,'0')}:${(diff%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function finalizarJogo() {
    clearInterval(cronometroInterval); somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText, totalRodadas);
}
