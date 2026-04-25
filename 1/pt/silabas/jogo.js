// ... (resto do código igual ao anterior)

function montarInterface(item) {
    const container = document.getElementById('game-main-content');
    const isMobile = window.innerWidth < 600;
    
    // Tamanhos ajustados para caberem na mesma linha
    const silSize = isMobile ? '58px' : '72px'; 
    const imgH = isMobile ? '130px' : '200px';
    const fontSize = isMobile ? '20px' : '26px';

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%; justify-content: space-between; padding: 5px 0;">
            <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; width: 100%;">
                <div style="background:white; padding:12px; border-radius:25px; box-shadow: 0 6px 15px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">
                    <img src="${JOGO_CONFIG.caminhoImg}${item.img}" style="max-height:${imgH}; max-width:85vw; object-fit:contain;">
                </div>
            </div>

            <div id="target-slots" style="display:flex; gap:8px; justify-content:center; align-items:center; flex-wrap:nowrap; width:100%; padding: 15px 0;">
                ${item.silabas.map(() => `<div class="slot" ondrop="drop(event)" ondragover="allowDrop(event)" style="width:${silSize}; height:${silSize}; border:3px dashed #cbd9e6; border-radius:15px; display:flex; flex-shrink:0;"></div>`).join('')}
            </div>

            <div id="source-pool" style="display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; width:100%; min-height:${silSize}; padding-bottom: 10px;">
            </div>
        </div>
    `;

    const pool = document.getElementById('source-pool');
    [...item.silabas].sort(() => Math.random() - 0.5).forEach((sil) => {
        const div = criarPeca(sil, silSize, fontSize);
        pool.appendChild(div);
    });
}

function criarPeca(texto, size, fSize) {
    const div = document.createElement('div');
    div.className = 'silaba-btn';
    div.innerText = texto;
    div.id = `sil-${idCounter++}`; 
    div.draggable = true;
    
    Object.assign(div.style, {
        width: size, height: size, background: 'white', color: 'var(--primary-blue)',
        border: '3px solid var(--primary-blue)', borderRadius: '15px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: fSize, fontWeight: '900',
        cursor: 'grab', boxShadow: '0 5px 0 var(--primary-dark)', userSelect: 'none',
        touchAction: 'none', position: 'relative', zIndex: '10', flexShrink: '0'
    });

// ... (resto das funções handleTouch e validar continuam exatamente iguais)
