const JOGO_CONFIG = {
    // Títulos e Textos da Página
    textos: {
        tituloLinha1: "Jovens",
        tituloLinha2: "Leitores",
        subtitulo: "Português | 2º Ano",
        intro: "Explora as palavras, as frases e diverte-te a ler!",
        rodape: "&copy; Jovens Leitores - Recursos Educativos"
    },

    // Caminhos (Ajustado para a pasta 'icons')
    caminhoIconsMenu: "icons/", 
    caminhoIconsJogos: "icons/", 

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
    
    // Lista de Jogos (Certifica-te que estes ficheiros .png existem na pasta icons/)
    listaJogos: [
        { nome: "Português", icon: "pt.png", link: "pt/" },
        { nome: "Matemática", icon: "mat.png", link: "mat/" },
        { nome: "Estudo do Meio", icon: "em.png", link: "em/" }
    ]
};
