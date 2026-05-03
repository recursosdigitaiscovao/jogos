const JOGO_CONFIG = {
    areaAtiva: "matematica", // Escolha: "portugues", "matematica", "estudo" ou "pre"
    anoAtivo: "ano1",      // Escolha: "pre", "ano1", "ano2", "ano3", "ano4"
    
    caminhoIconsMenu: "../../icons/", 
    caminhoIconsJogos: "iconjogos/",
    
    iconesMenu: {
        home: "home.png", pre: "iconpre.png", ano1: "icon1.png", 
        ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png", voltar: "voltar.png"
    },
    
    links: {
        home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", 
        ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4"
    },
    
    listaJogos: [
        { nome: "Pesca Números", icon: "pescanumeros.png", link: "pescanumeros/index.html" },
        { nome: "Contar Objetos", icon: "conta.png", link: "conta/index.html" },
        { nome: "Formas Geométricas", icon: "formas.png", link: "formas/index.html" },
        { nome: "Somas Divertidas", icon: "soma.png", link: "soma/index.html" },
        { nome: "Subtração", icon: "subtrair.png", link: "subtrair/index.html" },
        { nome: "Liga os Pontos", icon: "liga.png", link: "liga/index.html" },
        { nome: "Compara Números", icon: "compara.png", link: "compara/index.html" },
        { nome: "Sequências", icon: "sequencias.png", link: "sequencias/index.html" },
        { nome: "Par ou Ímpar", icon: "parouimpar.png", link: "parouimpar/index.html" },
        { nome: "As Dezenas", icon: "dezenas.png", link: "dezenas/index.html" }
        // ... adicione os restantes
    ]
};
