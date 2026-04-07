const JOGO_CONFIG = {
    caminhoIcons: "../../icons/", 
    caminhoImg: "../../img/", // O rd.png será buscado aqui
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },
    // Níveis definidos como categorias para aproveitar o menu RD
    categorias: {
        nivel1: { nome: "Nível 1 (3x3)", tamanho: 3 },
        nivel2: { nome: "Nível 2 (4x4)", tamanho: 4 },
        nivel3: { nome: "Nível 3 (5x5)", tamanho: 5 }
    },
    coresJogo: ["#ff4757", "#2ed573", "#1e90ff", "#ffa502", "#ffffff"], // Vermelho, Verde, Azul, Laranja, Branco
    relatorio: {
        titulo: "Excelente Trabalho!",
        pontosTotal: "Pontos:",
        tempoTotal: "Tempo:"
    }
};
