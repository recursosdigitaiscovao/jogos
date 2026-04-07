const JOGO_CONFIG = {
    caminhoIcons: "../../icons/", 
    caminhoImg: "../../img/",
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },
    categorias: {
        nivel1: { 
            nome: "Nível 1 (3x3)", 
            tamanho: 3, 
            img: "nivel1.png" // Imagem que aparecerá no menu RD
        },
        nivel2: { 
            nome: "Nível 2 (4x4)", 
            tamanho: 4, 
            img: "nivel2.png" 
        },
        nivel3: { 
            nome: "Nível 3 (5x5)", 
            tamanho: 5, 
            img: "nivel3.png" 
        }
    },
    coresPaleta: ["#ff4757", "#2ed573", "#1e90ff", "#ffa502", "#ffffff"],
    relatorio: {
        titulo: "Fim do Jogo!",
        pontosTotal: "Pontos:",
        tempoTotal: "Tempo:"
    }
};
