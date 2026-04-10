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
    labirinto: {
        caminho: "../../img/labirinto/",
        categorias: {
            cao: { nome: "Cão", sprite: "l_cao.png", objetivo: "l_comida_cao.png", corParede: "#e691a7" },
            gato: { nome: "Gato", sprite: "l_gato.png", objetivo: "l_comida_gato.png", corParede: "#d47a92" },
            passaro: { nome: "Pássaro", sprite: "l_passaro.png", objetivo: "l_comida_passaro.png", corParede: "#8db596" }
        }
    },
    relatorio: {
        titulo: "Exploração Concluída!",
        pontosTotal: "Pontos:",
        tempoTotal: "Tempo:"
    }
};
