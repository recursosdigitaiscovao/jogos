const JOGO_CONFIG = {
    // Títulos e Textos da Página
    textos: {
        tituloLinha1: "Pequenos",
        tituloLinha2: "Leitores",
        subtitulo: "Português | 1º Ano",
        intro: "O que vamos aprender hoje?",
        rodape: "Recursos Digitais Covão"
    },

    // Caminhos (ajusta conforme a tua pasta)
    caminhoIconsMenu: "../../icons/",
    caminhoIconsJogos: "iconjogos/",

    // Ícones do Menu/Interface
    iconesMenu: {
        home: "home.png",
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png",
        voltar: "voltar.png"
    },

    // Links da Sidebar
    links: {
        home: "/jogos", 
        pre: "/jogos/pre",
        ano1: "/jogos/1",
        ano2: "/jogos/2",
        ano3: "/jogos/3",
        ano4: "/jogos/4"
    },
    
    // Lista de Jogos (Aqui defines o que aparece nos 3 cards centrais)
    // Cores automáticas: 1º Azul, 2º Verde, 3º Vermelho
    listaJogos: [
        { nome: "Português", icon: "pt.png", link: "pt/" },
        { nome: "Matemática", icon: "mat.png", link: "mat/" },
        { nome: "Estudo do Meio", icon: "em.png", link: "em/" },
    ]
};
