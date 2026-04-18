const JOGO_CONFIG = {
    textos: {
        tituloLinha1: "Mundo",
        tituloLinha2: "dos jogos",
        subtitulo: "Atividades | Pré e 1º Ciclo",
        intro: "Escolhe o teu ano e diverte-te!",
        rodape: "&copy; Mundo do Jogos - Recursos Educativos"
    },
    caminhoIconsMenu: "../icons/", 
    caminhoIconsJogos: "../icons/", 
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
        home: "/jogos", 
        pre: "/jogos/pre",
        ano1: "/jogos/1",
        ano2: "/jogos/2",
        ano3: "/jogos/3",
        ano4: "/jogos/4"
    },
    temaCores: {
        rosa: { borda: "#5ba4e5", fundo: "#E691A7" },
        laranja: { borda: "#58bc8c", fundo: "#E6A75A" },
        verde: { borda: "#8b4513", fundo: "#45CFA8 },
        azul: { borda: "#8b4513", fundo: "#5EA2E6" },
        roxo: { borda: "#8b4513", fundo: "#8A81E6" }
    },
    listaJogos: [
        { nome: "Pré-Escolar", icon: "pt.png", link: "pt/", tema: "rosa" },
        { nome: "1º Ano", icon: "mat.png", link: "mat/", tema: "laranja" },
        { nome: "2º Ano", icon: "em.png", link: "em/", tema: "verde" },
        { nome: "3º ano", icon: "em.png", link: "em/", tema: "azul" },
        { nome: "4º Ano", icon: "em.png", link: "em/", tema: "roxo" },
    ]
};
