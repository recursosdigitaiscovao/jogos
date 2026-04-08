const JOGO_CONFIG = {
    // Caminho para os icons do menu (sobe dois níveis para jogos/icons/)
    caminhoIconsMenu: "../../icons/",
    
    // Caminho para os icons dos jogos (dentro da pasta local iconjogos/)
    caminhoIconsJogos: "iconjogos/",

    // Nomes dos ficheiros de ícones do menu/sidebar (conforme solicitado)
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },

    // Lista de jogos - O sistema vai criar os cards sozinho
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
