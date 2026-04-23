const JOGO_CONFIG = {
    areaAtiva: "matematica", 
    anoAtivo: "ano3",      
    
    textos: {
        tituloLinha1: "Pequenos",
        intro: "Brinca com os números, as cores e as formas!",
        rodape: "&copy; Pequenos Curiosos - Recursos Educativos"
    },
    
    // Ajusta os caminhos se necessário (subir pastas)
    caminhoIconsMenu: "../../icons/", 
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
        home: "/jogos", 
        pre: "/jogos/pre", 
        ano1: "/jogos/1", 
        ano2: "/jogos/2", 
        ano3: "/jogos/3", 
        ano4: "/jogos/4"
    },
    
    listaJogos: [
        { nome: "Descobre as Cores", icon: "cores.png", link: "cores/" },
        { nome: "Puzzle Animal", icon: "puzzle.png", link: "puzzle/" },
        { nome: "Onde está o par?", icon: "memoria.png", link: "memoria/" }
    ]
};
