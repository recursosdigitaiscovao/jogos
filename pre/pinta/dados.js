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
    // No jogo de colorir, as categorias agora representam os níveis
    categorias: {
        nivel1: {
            nome: "Nível 1 (3x3)",
            tamanho: 3,
            caminho: "../../img/niveis/", // Apenas para manter a estrutura
            lista: ["nivel1.png"]
        },
        nivel2: {
            nome: "Nível 2 (4x4)",
            tamanho: 4,
            caminho: "../../img/niveis/",
            lista: ["nivel2.png"]
        },
        nivel3: {
            nome: "Nível 3 (5x5)",
            tamanho: 5,
            caminho: "../../img/niveis/",
            lista: ["nivel3.png"]
        }
    },
    coresPaleta: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF9800", "#795548", "#000000"],
    relatorio: {
        titulo: "Boa! Grelha Completa!",
        pontosTotal: "Pontos:",
        tempoTotal: "Tempo:"
    }
};
