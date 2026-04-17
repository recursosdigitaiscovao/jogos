const JOGO_CONFIG = {
    // Títulos e Textos da Página
    textos: {
        tituloLinha1: "Pequenos",
        tituloLinha2: "Curiosos",
        subtitulo: "Atividades | Pré-Escolar",
        intro: "Brinca com os números, as cores e as formas!",
        rodape: "&copy; Pequenos Curiosos - Recursos Educativos"
    },

    // Caminhos
    caminhoIconsMenu: "../icons/",
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
        { nome: "O meu par?", icon: "encontraopar.png", link: "encontraopar/" },
        { nome: "Monstro Comilão", icon: "monstrocomilao.png", link: "monstrocomilao/" },
        { nome: "Colorir", icon: "pinta.png", link: "pinta/" },
        { nome: "Não tenho par!", icon: "sem_par.png", link: "sem_par/" },
        { nome: "Sombras Mágicas", icon: "sombrasmagicas.png", link: "sombrasmagicas/" },
        { nome: "Labirinto", icon: "labirinto.png", link: "labirinto/" },
        { nome: "Chuva de Letras", icon: "chuva_letras.png", link: "chuva_letras/" }
    ]
};
