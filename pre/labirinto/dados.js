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
    // Nova estrutura para o Labirinto
    labirinto: {
        caminho: "../../img/labirinto/",
        categorias: {
            cao: {
                nome: "Cão",
                player: "l_cao.png",
                food: "l_comida_cao.png",
                wall: "l_parede_cao.png"
            },
            gato: {
                nome: "Gato",
                player: "l_gato.png",
                food: "l_comida_gato.png",
                wall: "l_parede_gato.png"
            },
            passaro: {
                nome: "Pássaro",
                player: "l_passaro.png",
                food: "l_comida_passaro.png",
                wall: "l_parede_passaro.png"
            }
        }
    },
    relatorio: {
        titulo: "Exploração Concluída!",
        pontosTotal: "Pontos:",
        tempoTotal: "Tempo:"
    }
};
