const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    iconesMenu: { pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    categorias: {
        animais: {
            nome: "Animais", img: "animaisdomesticos/vaca.png",
            itens: [
                { letras: "CÃO", palavras: ["CÃO"] },
                { letras: "GATO", palavras: ["GATO"] },
                { letras: "LEÃO", palavras: ["LEÃO"] },
                { letras: "PATO", palavras: ["PATO"] },
                { letras: "VACA", palavras: ["VACA"] }
            ]
        },
        frutos: {
            nome: "Frutos", img: "frutas/banana.png",
            itens: [
                { letras: "MAÇÃ", palavras: ["MAÇÃ"] },
                { letras: "PÊRA", palavras: ["PÊRA"] },
                { letras: "UVA", palavras: ["UVA"] },
                { letras: "FIGO", palavras: ["FIGO"] },
                { letras: "MELÃO", palavras: ["MELÃO"] }
            ]
        },
        material: {
            nome: "Material", img: "materialescolar/afia.png",
            itens: [
                { letras: "AFIA", palavras: ["AFIA"] },
                { letras: "LÁPIS", palavras: ["LÁPIS"] },
                { letras: "RÉGUA", palavras: ["RÉGUA"] },
                { letras: "COLA", palavras: ["COLA"] },
                { letras: "LIVRO", palavras: ["LIVRO"] }
            ]
        }
    },
    relatorio: { titulo: "MUITO BEM!", pontosTotal: "Acertos:", tempoTotal: "Tempo:" }
};
