const JOGO_CONFIG = {
    textos: {
        tituloLinha1: "Jovens",
        tituloLinha2: "Leitores",
        subtitulo: "Português | 2º Ano",
        intro: "Explora as palavras, as frases e diverte-te a ler!",
        rodape: "&copy; Jovens Leitores - Recursos Educativos"
    },
    caminhoIconsMenu: "../../icons/",
    caminhoIconsJogos: "iconjogos/",
    iconesMenu: {
        home: "home.png", pre: "iconpre.png", ano1: "icon1.png", 
        ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png", voltar: "voltar.png"
    },
    links: {
        home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", 
        ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4",
        voltar: "../" // Retrocede apenas um nível
    },
    listaJogos: [
        { nome: "jogo1", icon: "1.png", link: "nome1/" },
        { nome: "jogo2", icon: "2.png", link: "nome2/" },
        { nome: "jogo3", icon: "3.png", link: "nome3/" },
        { nome: "jogo4", icon: "4.png", link: "nome4/" },
        { nome: "jogo5", icon: "5.png", link: "nome4/" },
    ]
};
