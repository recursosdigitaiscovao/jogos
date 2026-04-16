const JOGO_CONFIG = {
    // Títulos e Textos da Página
    textos: {
        tituloLinha1: "Pequenos",
        tituloLinha2: "Matemáticos",
        subtitulo: "Matemática | 1º Ano",
        intro: "Explora os números e aprende a contar!",
        rodape: "&copy; 2024 Pequenos Matemáticos - Recursos Educativos"
    },

    // Caminhos das Pastas (Ajusta se necessário)
    caminhoIconsMenu: "../../icons/",  // Pasta de ícones geral (dois níveis acima)
    caminhoIconsJogos: "iconjogos/",    // Pasta de capas dos jogos (na mesma pasta do index)

    // Nomes dos ficheiros de ícones do Menu
    iconesMenu: {
        home: "home.png",
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png",
        voltar: "voltar.png"
    },

    // Links para onde as opções do menu levam
    links: {
        home: "../../index.html", 
        pre: "../pre/index.html",
        ano1: "index.html",
        ano2: "../ano2/index.html",
        ano3: "../ano3/index.html",
        ano4: "../ano4/index.html"
    },
    
    // Lista de Jogos que vão aparecer no centro
    listaJogos: [
        { nome: "Contar os Números", icon: "conta.png", link: "conta/index.html" },
        { nome: "Formas Geométricas", icon: "formas.png", link: "formas/index.html" },
        { nome: "Somas Divertidas", icon: "soma.png", link: "soma/index.html" },
        { nome: "Subtração", icon: "subtrair.png", link: "subtrair/index.html" },
        { nome: "Liga os Pontos", icon: "liga.png", link: "liga/index.html" },
        { nome: "Compara Números", icon: "compara.png", link: "compara/index.html" },
        { nome: "Sequências", icon: "sequencias.png", link: "sequencias/index.html" },
        { nome: "Par ou Ímpar", icon: "parouimpar.png", link: "parouimpar/index.html" },
        { nome: "As Dezenas", icon: "dezenas.png", link: "dezenas/index.html" }
    ]
};
