// === DEFINIÇÃO DOS NÍVEIS (PADRÕES DAS IMAGENS PNG) ===
const JOGO_CATEGORIAS = {
    niveis: {
        nome: "Pinta Igual",
        imgCapa: "nivel1.png",
        itens: [
            { 
                nivel: 1, 
                tamanho: 3, 
                imgModelo: "nivel1.png",
                // Representação exata das cores da imagem nivel1.png
                padrao: [
                    4, 3, 4,
                    3, 2, 1,
                    1, 1, 1
                ]
            },
            { 
                nivel: 2, 
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
                nivel: 3, 
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
