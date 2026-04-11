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
    categorias: {
        animais: {
            nome: "Animais",
            img: "animaisdomesticos/vaca.png",
            itens: [
                { nome: "VACA", img: "animaisdomesticos/vaca.png" },
                { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "PERU", img: "animaisdomesticos/peru.png" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png" }
            ]
        },
        frutos: {
            nome: "Frutos",
            img: "frutas/banana.png",
            itens: [
                { nome: "BANANA", img: "frutas/banana.png" },
                { nome: "CEREJA", img: "frutas/cereja.png" },
                { nome: "LARANJA", img: "frutas/banana.png" }, // Reutilizando imagem do seu config
                { nome: "PAPAIA", img: "frutas/papaia.png" },
                { nome: "MACA", img: "frutas/cereja.png" } // Adicionado para completar 5
            ]
        },
        material: {
            nome: "Material Escolar",
            img: "materialescolar/mochila.png",
            itens: [
                { nome: "MOCHILA", img: "materialescolar/mochila.png" },
                { nome: "TESOURA", img: "materialescolar/tesoura.png" },
                { nome: "LAPIS", img: "materialescolar/mochila.png" },
                { nome: "LIVRO", img: "materialescolar/mochila.png" },
                { nome: "REGUA", img: "materialescolar/tesoura.png" }
            ]
        }
    },
    relatorio: {
        titulo: "MUITO BEM!",
        pontosTotal: "Encontraste:",
        tempoTotal: "Tempo:"
    }
};
