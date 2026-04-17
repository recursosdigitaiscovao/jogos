const JOGO_CONFIG = {
    textos: {
        titulo: "PEQUENOS LEITORES",
        subtitulo: "Português | 1º Ano",
        intro: "O que vamos aprender hoje?",
        rodape: "Recursos Digitais Covão"
    },

    caminhoIconsMenu: "../icons/",
    caminhoIconsJogos: "iconjogos/",

    iconesMenu: {
        home: "home.png",
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png",
        voltar: "voltar.png"
    },

    links: {
        voltar: "../index.html",
        home: "/jogos", 
        pre: "/jogos/pre",
        ano1: "/jogos/1",
        ano2: "/jogos/2",
        ano3: "/jogos/3",
        ano4: "/jogos/4"
    },
    
    // Lista de Jogos com as cores da imagem
    listaJogos: [
        { nome: "Português", icon: "pt.png", link: "pt/", classe: "card-blue" },
        { nome: "Matemática", icon: "mat.png", link: "mat/", classe: "card-green" },
        { nome: "Estudo do Meio", icon: "em.png", link: "em/", classe: "card-red" },
    ]
};
