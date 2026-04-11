const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    iconesMenu: { pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    categorias: {
        animais: {
            nome: "Animais", img: "animaisdomesticos/vaca.png",
            itens: [
                { letras: "CAO", palavras: ["CAO"] },
                { letras: "PATO", palavras: ["PATO"] },
                { letras: "GATO", palavras: ["GATO"] },
                { letras: "PERU", palavras: ["PERU"] },
                { letras: "VACA", palavras: ["VACA"] }
            ]
        },
        frutos: {
            nome: "Frutos", img: "frutas/banana.png",
            itens: [
                { letras: "MACA", palavras: ["MACA"] },
                { letras: "PERA", palavras: ["PERA"] },
                { letras: "UVA", palavras: ["UVA"] },
                { letras: "FIGO", palavras: ["FIGO"] },
                { letras: "KIWI", palavras: ["KIWI"] }
            ]
        },
        material: {
            nome: "Material", img: "materialescolar/afia.png",
            itens: [
                { letras: "AFIA", palavras: ["AFIA"] },
                { letras: "COLA", palavras: ["COLA"] },
                { letras: "LIVRO", palavras: ["LIVRO"] },
                { letras: "GIZ", palavras: ["GIZ"] },
                { letras: "MAPA", palavras: ["MAPA"] }
            ]
        }
    },
    relatorio: { titulo: "MUITO BEM!", pontosTotal: "Palavras:", tempoTotal: "Tempo:" }
};
