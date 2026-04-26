let categoriaAtiva, itensAtuais, itemCorreto, rodadaAtual, acertos, tempoInicio, cronometroInterval;
const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.selecionarCategoria = (key) => {
    categoriaAtiva = JOGO_CONFIG.categorias[key];
    itensAtuais = [...categoriaAtiva.itens].sort(() => Math.random() - 0.5);
    rodadaAtual = 1;
};

window.initGame = () => {
    acertos = 0; rodadaAtual = 1; tempoInicio = new Date();
    iniciarCronometro();
    proximaRodada();
};

function proximaRodada() {
    const totalRodadas = 10;
    if (rodadaAtual > totalRodadas) { finalizarJogo(); return; }
    
    document.getElementById('round-val').innerText = `${rodadaAtual} / ${totalRodadas}`;
    document.getElementById('hits-val').innerText = acertos;
    
    const container = document.getElementById('game-main-content');
    container.innerHTML = '';
    itemCorreto = itensAtuais[rodadaAtual - 1];

    // Criar Wrapper que se ajusta ao tamanho do card
    const wrapper = document.createElement('div');
    wrapper.style.cssText = "display:flex; flex-direction:column; align-items:center; justify-content:space-evenly; width:100%; height:100%; padding:10px;";

    // 1. Título do Jogo (Ocupa pouco espaço)
    const title = document.createElement('h3');
    title.innerText = "COLOQUE A IMAGEM NA SOMBRA";
    title.style.cssText = "color:var(--primary-blue); font-size:clamp(14px, 3vh, 18px); font-weight:900;";

    // 2. Alvo da Sombra (Escala conforme a altura disponível)
    const shadowBox = document.createElement('div');
    shadowBox.id = "drop-zone";
    shadowBox.className = "drop-target";
    shadowBox.style.cssText = "background:#f9f9f9; border:3px dashed var(--primary-blue); border-radius:25px; width:clamp(140px, 25vh, 200px); height:clamp(140px, 25vh, 200px); display:flex; align-items:center; justify-content:center; transition:0.3s; position:relative;";

    const shadowImg = document.createElement('img');
    shadowImg.src = JOGO_CONFIG.caminhoImg + itemCorreto.img;
    shadowImg.style.cssText = "max-height:80%; max-width:80%; filter:brightness(0); pointer-events:none; transition:0.3s;";
    shadowBox.appendChild(shadowImg);

    // 3. Opções de Resposta
    const optionsBox = document.createElement('div');
    optionsBox.style.cssText = "display:flex; gap:10px; justify-content:center; width:100%; flex-wrap:wrap;";

    // Gerar 3 opções (Correta + 2 aleatórias)
    let pool = categoriaAtiva.itens.filter(i => i.nome !== itemCorreto.nome).sort(() => Math.random() - 0.5);
    let choices = [itemCorreto, pool[0], pool[1]].sort(() => Math.random() - 0.5);

    choices.forEach(item => {
        const card = document.createElement('div');
        card.className = "choice-card";
        card.draggable = true;
        card.style.cssText = "background:white; border:2px solid #eee; border-radius:15px; width:clamp(100px, 15vw, 130px); padding:10px; cursor:grab; display:flex; flex-direction:column; align-items:center; box-shadow:0 4px 8px rgba(0,0,0,0.05); transition:0.2s;";
        
        const img = document.createElement('img');
        img.src = JOGO_CONFIG.caminhoImg + item.img;
        img.style.cssText = "max-height:60px; max-width:80%; pointer-events:none; margin-bottom:5px;";
        
        const name = document.createElement('span');
        name.innerText = item.nome;
        name.style.cssText = "font-size:10px; font-weight:900; color:var(--text-grey);";

        card.append(img, name);

        // --- Eventos de Drag & Clique ---
        card.ondragstart = (e) => {
            e.dataTransfer.setData("text", item.nome);
            card.classList.add('dragging');
        };
        card.ondragend = () => card.classList.remove('dragging');
        card.onclick = () => checkMatch(item.nome, card);

        optionsBox.appendChild(card);
    });

    // --- Eventos de Drop ---
    shadowBox.ondragover = (e) => { e.preventDefault(); shadowBox.classList.add('hover'); };
    shadowBox.ondragleave = () => shadowBox.classList.remove('hover');
    shadowBox.ondrop = (e) => {
        e.preventDefault();
        shadowBox.classList.remove('hover');
        checkMatch(e.dataTransfer.getData("text"));
    };

    wrapper.append(title, shadowBox, optionsBox);
    container.appendChild(wrapper);
}

function checkMatch(selectedName, element) {
    const isCorrect = (selectedName === itemCorreto.nome);
    const dropZone = document.getElementById('drop-zone');
    const allCards = document.querySelectorAll('.choice-card');

    // Desativar interações
    allCards.forEach(c => c.style.pointerEvents = 'none');

    if (isCorrect) {
        acertos++;
        somAcerto.play();
        dropZone.style.background = "#e7f9e7";
        dropZone.style.borderColor = "var(--highlight-green)";
        dropZone.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${itemCorreto.img}" style="max-height:80%; animation: bounceIn 0.5s;">`;
    } else {
        somErro.play();
        if(element) element.style.borderColor = "var(--error-red)";
        dropZone.style.borderColor = "var(--error-red)";
        // Mostrar o correto
        allCards.forEach(c => {
            if(c.innerText.includes(itemCorreto.nome)) c.style.borderColor = "var(--highlight-green)";
        });
    }

    setTimeout(() => {
        rodadaAtual++;
        proximaRodada();
    }, 1500);
}

function iniciarCronometro() {
    if(cronometroInterval) clearInterval(cronometroInterval);
    cronometroInterval = setInterval(() => {
        let diff = Math.floor((new Date() - tempoInicio)/1000);
        document.getElementById('timer-val').innerText = `${Math.floor(diff/60).toString().padStart(2,'0')}:${(diff%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function finalizarJogo() {
    clearInterval(cronometroInterval);
    somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
