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
    // Configuração específica para o labirinto
    labirinto: {
        caminho: "../../img/labirinto/",
        categorias: {
            cao: {
                nome: "Cão",
                sprite: "l_cao.png",
                objetivo: "l_comida_cao.png",
                parede: "l_parede_cao.png"
            },
            gato: {
                nome: "Gato",
                sprite: "l_gato.png",
                objetivo: "l_comida_gato.png",
                parede: "l_parede_gato.png"
            },
            passaro: {
                nome: "Pássaro",
                sprite: "l_passaro.png",
                objetivo: "l_comida_passaro.png",
                parede: "l_parede_passaro.png"
            }
        }
    },
    relatorio: {
        titulo: "Parabéns!",
        pontosTotal: "Pontos:",
        tempoTotal: "Tempo:"
    }
};
