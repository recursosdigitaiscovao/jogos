const JOGO_CONFIG = {
    // Caminho para os icons do menu (sobe dois níveis para jogos/icons/)
    caminhoIconsMenu: "../../icons/",
    
    // Caminho para os icons dos jogos (dentro da pasta local iconjogos/)
    caminhoIconsJogos: "iconjogos/",

    // Nomes dos ficheiros de ícones do menu/sidebar
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },

    // LISTA DE JOGOS - Para adicionar um jogo novo, basta copiar uma linha e mudar os dados
    listaJogos: [
        { nome: "Conta as Sílabas", icon: "silabas.png", link: "silabas/" },
        { nome: "Forma Palavras", icon: "liga_letras.png", link: "liga_letras/" },
        { nome: "Descobre a Palavra", icon: "forca.png", link: "forca/" },
        { nome: "Sopa de Letras", icon: "sopa_letras.png", link: "sopa_letras/" }
        { nome: "Copia Palavras", icon: "copia_palavras.png", link: "copia_palavras/" }
        // Exemplo de como adicionar um novo:
        // { nome: "Novo Jogo", icon: "novo_icon.png", link: "pasta_do_jogo/" },
    ]
};
