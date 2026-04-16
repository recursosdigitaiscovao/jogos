const JOGO_CONFIG = {
    // Títulos e Textos da Página
    textos: {
        tituloLinha1: "Pequenos",
        tituloLinha2: "Matemáticos",
        subtitulo: "Matemática | 1º Ano",
        intro: "Explora os números e aprende a contar!",
        rodape: "&copy; Pequenos Matemáticos - Recursos Educativos"
    },

    // Caminhos
    caminhoIconsMenu: "../../icons/",
    caminhoIconsJogos: "iconjogos/",

    // Ícones
    iconesMenu: {
        home: "home.png",
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png",
        voltar: "voltar.png"
    },

    // Links do Menu
    links: {
        home: "/jogos", 
        pre: "/jogos/pre",
        ano1: "/jogos/1",
        ano2: "/jogos/2",
        ano3: "/jogos/3",
        ano4: "/jogos/4"
    },
    
    // Lista de Jogos
    listaJogos: [
        { nome: "Contar os Números", icon: "conta.png", link: "conta/" },
        { nome: "Formas Geométricas", icon: "formas.png", link: "formas/" },
        { nome: "Somas Divertidas", icon: "soma.png", link: "soma/" },
        { nome: "Subtração", icon: "subtrair.png", link: "subtrair/" },
        { nome: "Liga os Pontos", icon: "liga.png", link: "liga/" },
        { nome: "Compara Números", icon: "compara.png", link: "compara/" },
        { nome: "Sequências", icon: "sequencias.png", link: "sequencias/" },
        { nome: "Par ou Ímpar", icon: "parouimpar.png", link: "parouimpar/" },
        { nome: "As Dezenas", icon: "dezenas.png", link: "dezenas/" }
    ]
};
