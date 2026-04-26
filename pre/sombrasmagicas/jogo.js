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
    iniciarCronometro(); proximaRodada();
};

function proximaRodada() {
    const totalRodadas = 10;
    if (rodadaAtual > totalRodadas) { finalizarJogo(); return; }
    
    document.getElementById('round-val').innerText = `${rodadaAtual} / ${totalRodadas}`;
    document.getElementById('hits-val').innerText = acertos;
    
    const container = document.getElementById('game-main-content');
    container.innerHTML = '';
    itemCorreto = itensAtuais[rodadaAtual - 1];

    let pool = categoriaAtiva.itens.filter(i => i.nome !== itemCorreto.nome).sort(() => Math.random() - 0.5);
    let opcoes = [itemCorreto, pool[0], pool[1]].sort(() => Math.random() - 0.5);

    const wrapper = document.createElement('div');
    wrapper.style.cssText = "display:flex; flex-direction:column; align-items:center; justify-content:center; gap:25px; width:100%; height:100%;";

    // Zona da Sombra
    const sombraDiv = document.createElement('div');
    sombraDiv.id = "drop-zone";
    sombraDiv.style.cssText = "background:rgba(0,0,0,0.02); padding:25px; border-radius:35px; border:4px dashed var(--primary-blue); display:flex; align-items:center; justify-content:center; width:200px; height:200px; transition:0.3s;";
    
    const imgS = document.createElement('img');
    imgS.src = JOGO_CONFIG.caminhoImg + itemCorreto.img;
    imgS.style.cssText = "height:120px; filter:brightness(0); pointer-events:none;";
    sombraDiv.appendChild(imgS);

    // Eventos Drag
    sombraDiv.ondragover = (e) => { e.preventDefault(); sombraDiv.style.background = "#f0f7ff"; };
    sombraDiv.ondragleave = () => { sombraDiv.style.background = "rgba(0,0,0,0.02)"; };
    sombraDiv.ondrop = (e) => { e.preventDefault(); validarAcao(e.dataTransfer.getData("text")); };

    // Opções
    const opcoesDiv = document.createElement('div');
    opcoesDiv.style.cssText = "display:flex; gap:15px; justify-content:center; width:100%;";

    opcoes.forEach(item => {
        const btn = document.createElement('div');
        btn.draggable = true;
        btn.style.cssText = "background:white; border:3px solid #eee; border-radius:20px; padding:10px; cursor:grab; width:120px; display:flex; flex-direction:column; align-items:center; box-shadow:0 4px 8px rgba(0,0,0,0.05);";
        
        const img = document.createElement('img');
        img.src = JOGO_CONFIG.caminhoImg + item.img;
        img.style.cssText = "height:70px; pointer-events:none; margin-bottom:5px;";
        
        const span = document.createElement('span');
        span.innerText = item.nome;
        span.style.cssText = "font-weight:900; font-size:10px; color:var(--text-grey); pointer-events:none;";

        btn.append(img, span);
        btn.ondragstart = (e) => { e.dataTransfer.setData("text", item.nome); btn.style.opacity = "0.5"; };
        btn.ondragend = () => { btn.style.opacity = "1"; };
        btn.onclick = () => validarAcao(item.nome, btn);

        opcoesDiv.appendChild(btn);
    });

    wrapper.append(sombraDiv, opcoesDiv);
    container.appendChild(wrapper);
}

function validarAcao(nome, el) {
    const dz = document.getElementById('drop-zone');
    document.querySelectorAll('#game-main-content div').forEach(d => d.style.pointerEvents = 'none');

    if (nome === itemCorreto.nome) {
        acertos++; somAcerto.play();
        dz.style.background = "#e7f9e7"; dz.style.borderColor = "var(--highlight-green)";
        dz.innerHTML = `<img src="${JOGO_CONFIG.caminhoImg}${itemCorreto.img}" style="height:120px;">`;
    } else {
        somErro.play();
        if(el) el.style.borderColor = "var(--error-red)";
        dz.style.borderColor = "var(--error-red)";
    }
    setTimeout(() => { rodadaAtual++; proximaRodada(); }, 1500);
}

function iniciarCronometro() {
    if(cronometroInterval) clearInterval(cronometroInterval);
    cronometroInterval = setInterval(() => {
        let diff = Math.floor((new Date() - tempoInicio)/1000);
        document.getElementById('timer-val').innerText = `${Math.floor(diff/60).toString().padStart(2,'0')}:${(diff%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function finalizarJogo() {
    clearInterval(cronometroInterval); somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
