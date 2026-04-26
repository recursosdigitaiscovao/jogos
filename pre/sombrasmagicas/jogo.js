let categoriaAtiva, itensAtuais, itemCorreto, rodadaAtual, acertos, erros, tempoInicio, cronometroInterval;
const somAcerto = new Audio(JOGO_CONFIG.sons.acerto);
const somErro = new Audio(JOGO_CONFIG.sons.erro);
const somVitoria = new Audio(JOGO_CONFIG.sons.vitoria);

window.selecionarCategoria = (key) => {
    categoriaAtiva = JOGO_CONFIG.categorias[key];
    itensAtuais = [...categoriaAtiva.itens].sort(() => Math.random() - 0.5);
};

window.initGame = () => {
    rodadaAtual = 1; acertos = 0; erros = 0; tempoInicio = new Date();
    iniciarCronometro(); proximaRodada();
};

function proximaRodada() {
    const totalRodadas = 10;
    if (rodadaAtual > totalRodadas) { finalizarJogo(); return; }
    
    atualizarStatusBar(totalRodadas);
    const container = document.getElementById('game-main-content');
    container.innerHTML = '';
    itemCorreto = itensAtuais[rodadaAtual - 1];

    let opcoes = [itemCorreto];
    let outros = categoriaAtiva.itens.filter(i => i.nome !== itemCorreto.nome).sort(() => Math.random() - 0.5);
    opcoes.push(outros[0], outros[1]);
    opcoes.sort(() => Math.random() - 0.5);

    // Layout Centrado Vertical e Horizontal
    const wrapper = document.createElement('div');
    wrapper.style.cssText = "display:flex; flex-direction:column; align-items:center; justify-content:center; gap:25px; width:100%; height:100%; text-align:center;";

    const p = document.createElement('p');
    p.innerText = "QUAL É A IMAGEM QUE CORRESPONDE À SOMBRA?";
    p.style.cssText = "font-weight:900; color:var(--primary-blue); font-size:1rem; margin:0; text-transform:uppercase;";

    // Sombra (Altura Fixa: 120px)
    const sombraDiv = document.createElement('div');
    sombraDiv.style.cssText = "background:rgba(255,255,255,0.7); padding:30px; border-radius:40px; border:4px dashed var(--primary-blue); display:flex; align-items:center; justify-content:center; width:200px; height:200px;";
    const imgSombra = document.createElement('img');
    imgSombra.src = JOGO_CONFIG.caminhoImg + itemCorreto.img;
    imgSombra.style.cssText = "height:120px; width:auto; filter:brightness(0); object-fit:contain;";
    sombraDiv.appendChild(imgSombra);

    // Opções (Altura Fixa: 70px)
    const opcoesDiv = document.createElement('div');
    opcoesDiv.style.cssText = "display:flex; gap:15px; justify-content:center; width:100%; flex-wrap:nowrap;";

    opcoes.forEach(item => {
        const btn = document.createElement('div');
        btn.style.cssText = "background:white; border:3px solid #eee; border-radius:20px; padding:12px; cursor:pointer; width:120px; display:flex; flex-direction:column; align-items:center; justify-content:center; transition:0.2s; box-shadow:0 4px 10px rgba(0,0,0,0.05);";
        
        const img = document.createElement('img');
        img.src = JOGO_CONFIG.caminhoImg + item.img;
        img.style.cssText = "height:70px; width:auto; object-fit:contain; margin-bottom:8px;";
        
        const span = document.createElement('span');
        span.innerText = item.nome;
        span.style.cssText = "font-weight:900; font-size:10px; color:var(--text-grey);";

        btn.append(img, span);
        btn.onclick = () => {
            const all = opcoesDiv.querySelectorAll('div');
            all.forEach(b => b.style.pointerEvents = 'none');
            if(item.nome === itemCorreto.nome) {
                acertos++; somAcerto.play(); btn.style.borderColor = "var(--highlight-green)"; btn.style.background = "#f0fff0";
            } else {
                erros++; somErro.play(); btn.style.borderColor = "var(--error-red)"; btn.style.background = "#fff0f0";
                all.forEach(b => { if(b.innerText.includes(itemCorreto.nome)) b.style.borderColor = "var(--highlight-green)"; });
            }
            setTimeout(() => { rodadaAtual++; proximaRodada(); }, 1500);
        };
        opcoesDiv.appendChild(btn);
    });

    wrapper.append(p, sombraDiv, opcoesDiv);
    container.appendChild(wrapper);
}

function atualizarStatusBar(tot) {
    document.getElementById('round-val').innerText = `${rodadaAtual} / ${tot}`;
    document.getElementById('hits-val').innerText = acertos;
    document.getElementById('miss-val').innerText = erros;
}

function iniciarCronometro() {
    if(cronometroInterval) clearInterval(cronometroInterval);
    cronometroInterval = setInterval(() => {
        let diff = Math.floor((new Date() - tempoInicio)/1000);
        let m = Math.floor(diff/60).toString().padStart(2,'0');
        let s = (diff%60).toString().padStart(2,'0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function finalizarJogo() {
    clearInterval(cronometroInterval); somVitoria.play();
    window.mostrarResultados(acertos, document.getElementById('timer-val').innerText);
}
