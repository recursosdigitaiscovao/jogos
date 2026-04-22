// Objeto principal que controla o estado do jogo
const JogoControlador = {
    
    init() {
        console.log("Jogo Inicializado...");
        this.renderizarTemplateBase();
        this.renderizarMenuCategorias();
    },

    // Preenche os textos e botões do template (Header, Footer e Nav)
    renderizarTemplateBase() {
        // Textos do Header
        document.getElementById('txt-titulo1').innerText = JOGO_CONFIG.textos.tituloLinha1;
        document.getElementById('txt-titulo2').innerText = JOGO_CONFIG.textos.tituloLinha2;
        document.getElementById('txt-subtitulo').innerText = JOGO_CONFIG.textos.subtitulo;
        
        // Rodapé
        document.getElementById('txt-rodape').innerHTML = JOGO_CONFIG.textos.rodape;

        // Botão Voltar
        const btnVoltar = document.getElementById('btn-voltar');
        btnVoltar.innerText = JOGO_CONFIG.textoVoltar;
        btnVoltar.onclick = () => window.location.href = JOGO_CONFIG.linkVoltar;

        // Gerar Ícones do Menu Superior (Home, Ano 1, 2, etc)
        const navContainer = document.getElementById('container-nav-icons');
        navContainer.innerHTML = ""; // Limpar

        // Mapeamos os ícones aos links correspondentes
        const menus = [
            { id: 'home', img: JOGO_CONFIG.iconesMenu.home, link: JOGO_CONFIG.links.home },
            { id: 'pre', img: JOGO_CONFIG.iconesMenu.pre, link: JOGO_CONFIG.links.pre },
            { id: 'ano1', img: JOGO_CONFIG.iconesMenu.ano1, link: JOGO_CONFIG.links.ano1 },
            { id: 'ano2', img: JOGO_CONFIG.iconesMenu.ano2, link: JOGO_CONFIG.links.ano2 },
            { id: 'ano3', img: JOGO_CONFIG.iconesMenu.ano3, link: JOGO_CONFIG.links.ano3 },
            { id: 'ano4', img: JOGO_CONFIG.iconesMenu.ano4, link: JOGO_CONFIG.links.ano4 }
        ];

        menus.forEach(item => {
            const a = document.createElement('a');
            a.href = item.link;
            a.innerHTML = `<img src="${JOGO_CONFIG.caminhoIcons}${item.img}" alt="${item.id}" class="nav-icon-img">`;
            navContainer.appendChild(a);
        });
    },

    // Desenha as categorias (Animais, Frutos, etc) no meio do ecrã
    renderizarMenuCategorias() {
        const ecra = document.getElementById('ecra-jogo');
        let html = `<div class="grid-categorias">`;

        // Percorre as categorias que definiu nos dados.js
        for (let chave in JOGO_CONFIG.categorias) {
            const cat = JOGO_CONFIG.categorias[chave];
            html += `
                <div class="card-categoria" onclick="JogoControlador.iniciarJogo('${chave}')">
                    <div class="card-img-wrapper">
                        <img src="${JOGO_CONFIG.caminhoImg}${cat.imgCapa}" alt="${cat.nome}">
                    </div>
                    <div class="card-titulo">${cat.nome.toUpperCase()}</div>
                </div>
            `;
        }

        html += `</div>`;
        ecra.innerHTML = html;
        
        // Esconder botão voltar quando estiver no menu principal
        document.getElementById('btn-voltar').style.visibility = 'hidden';
    },

    iniciarJogo(categoriaChave) {
        console.log("Iniciando categoria: " + categoriaChave);
        document.getElementById('btn-voltar').style.visibility = 'visible';
        document.getElementById('btn-voltar').onclick = () => this.renderizarMenuCategorias();
        
        const cat = JOGO_CONFIG.categorias[categoriaChave];
        
        // Espaço reservado para a lógica de jogo que faremos a seguir
        document.getElementById('ecra-jogo').innerHTML = `
            <div class="jogo-ativo">
                <h2>A jogar: ${cat.nome}</h2>
                <p>Aqui aparecerão os itens e as sílabas...</p>
                <button onclick="JogoControlador.renderizarMenuCategorias()">SAIR</button>
            </div>
        `;
    }
};

// Quando o browser terminar de carregar, inicia tudo
window.onload = () => JogoControlador.init();
