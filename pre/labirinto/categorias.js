const JOGO_CATEGORIAS = {
    "natureza": {
        nome: "Jardim da Abelha",
        imgCapa: "animaisselvagens/abelha.png",
        personagem: "animaisselvagens/abelha.png",
        objetivo: "natureza/flor.png", // Imagem da flor
        itens: [
            { 
                nivel: 1, 
                tamanho: 5, // Grelha 5x5
                mapa: [
                    [0, 0, 1, 0, 0],
                    [1, 0, 1, 0, 1],
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 0, 1, 0] 
                ],
                inicio: [0, 0], // x, y
                fim: [4, 4]
            }
        ]
    },
    "quinta": {
        nome: "Caminho do Rato",
        imgCapa: "animaisselvagens/rato.png",
        personagem: "animaisselvagens/rato.png",
        objetivo: "comida/queijo.png",
        itens: [
            { 
                nivel: 1, 
                tamanho: 6,
                mapa: [
                    [0, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 0],
                    [1, 1, 0, 0, 0, 0],
                    [0, 0, 1, 1, 1, 1],
                    [0, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 0]
                ],
                inicio: [0, 0],
                fim: [5, 5]
            }
        ]
    }
};
