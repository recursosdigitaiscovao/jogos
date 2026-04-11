const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    iconesMenu: { pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    categorias: {
        animais: {
            nome: "Animais Domésticos", img: "animaisdomesticos/vaca.png",
            itens: [
                { letras: "CÃO", palavras: ["CÃO"] },
                { letras: "GATO", palavras: ["GATO"] },
                { letras: "PATO", palavras: ["PATO"] },
                { letras: "PERU", palavras: ["PERU"] },
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
            nome: "Material Escolar", img: "materialescolar/afia.png",
            itens: [
                { letras: "AFIA", palavras: ["AFIA"] },
                { letras: "LÁPIS", palavras: ["LÁPIS"] },
                { letras: "RÉGUA", palavras: ["RÉGUA"] },
                { letras: "COLA", palavras: ["COLA"] },
                { letras: "LIVRO", palavras: ["LIVRO"] }
            ]
        },
        selvagens: {
            nome: "Animais Selvagens", img: "animaisdomesticos/silabas_1.png",
            itens: [
                { letras: "LEÃO", palavras: ["LEÃO"] },
                { letras: "TIGRE", palavras: ["TIGRE"] },
                { letras: "ZEBRA", palavras: ["ZEBRA"] },
                { letras: "GIRAFA", palavras: ["GIRAFA"] },
                { letras: "COBRA", palavras: ["COBRA"] }
            ]
        },
        paises: {
            nome: "Países", img: "rd.png",
            itens: [
                { letras: "PORTUGAL", palavras: ["PORTUGAL"] },
                { letras: "BRASIL", palavras: ["BRASIL"] },
                { letras: "ANGOLA", palavras: ["ANGOLA"] },
                { letras: "FRANÇA", palavras: ["FRANÇA"] },
                { letras: "ITÁLIA", palavras: ["ITÁLIA"] }
            ]
        },
        transportes: {
            nome: "Transportes", img: "materialescolar/mochila.png",
            itens: [
                { letras: "AVIÃO", palavras: ["AVIÃO"] },
                { letras: "BARCO", palavras: ["BARCO"] },
                { letras: "CARRO", palavras: ["CARRO"] },
                { letras: "MOTO", palavras: ["MOTO"] },
                { letras: "TREM", palavras: ["TREM"] }
            ]
        }
    },
    relatorio: { titulo: "MUITO BEM!", pontosTotal: "Palavras:", tempoTotal: "Tempo:" }
};
