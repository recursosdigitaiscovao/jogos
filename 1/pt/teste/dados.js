const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },
    // Nova estrutura de links centralizada
    links: {
        pre: "../pre",
        ano1: "../1",
        ano2: "/2",
        ano3: "/3",
        ano4: "/4"
    },
    categorias: {
        animais: {
            nome: "Animais",
            img: "animaisdomesticos/vaca.png",
            itens: [
                { nome: "VACA", img: "animaisdomesticos/vaca.png" },
                { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "PERU", img: "animaisdomesticos/peru.png" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png" }
            ]
        }
    },
    relatorio: {
        titulo: "MUITO BEM!",
        pontosTotal: "Encontraste:",
        tempoTotal: "Tempo:"
    }
};
