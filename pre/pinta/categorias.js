// === DEFINIÇÃO DOS NÍVEIS (ITENS) ===
const JOGO_CATEGORIAS = {
    "pintura": {
        nome: "Pinta Igual",
        imgCapa: "nivel1.png",
        itens: [
            { 
                tamanho: 3, 
                imgModelo: "nivel1.png",
                padrao: [
                    4, 3, 4,
                    3, 2, 1,
                    1, 1, 1
                ]
            },
            { 
                tamanho: 4, 
                imgModelo: "nivel2.png",
                padrao: [
                    0, 3, 3, 0,
                    3, 3, 3, 3,
                    0, 3, 3, 0,
                    0, 3, 3, 0
                ]
            },
            { 
                tamanho: 5, 
                imgModelo: "nivel3.png",
                padrao: [
                    0, 0, 2, 0, 0,
                    0, 2, 4, 2, 0,
                    2, 4, 4, 4, 2,
                    0, 2, 4, 2, 0,
                    0, 0, 2, 0, 0
                ]
            }
        ]
    }
};
