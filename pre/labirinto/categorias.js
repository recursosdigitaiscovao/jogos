// === DEFINIÇÃO DAS CATEGORIAS DO LABIRINTO ===
const JOGO_CATEGORIAS = {
    "natureza": {
        nome: "Jardim da Abelha",
        imgCapa: "animaisselvagens/abelha.png",
        personagem: "animaisselvagens/abelha.png",
        objetivo: "natureza/flor.png",
        obstaculo: "natureza/arvore.png", // AQUI: Imagem das paredes para este tema
        itens: [
            { 
                tamanho: 5, 
                mapa: [
                    [0, 0, 1, 0, 0],
                    [1, 0, 1, 0, 1],
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 0, 1, 0] 
                ],
                inicio: [0, 0], // x, y
                fim: [4, 4]
            },
            { 
                tamanho: 5, 
                mapa: [
                    [0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0],
                    [1, 1, 0, 1, 0],
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 0] 
                ],
                inicio: [0, 0],
                fim: [4, 0]
            }
        ]
    },
    "quinta": {
        nome: "Caminho do Rato",
        imgCapa: "animaisselvagens/rato.png",
        personagem: "animaisselvagens/rato.png",
        objetivo: "comida/queijo.png",
        obstaculo: "objetos/cesto.png", // Paredes de cestos para o rato
        itens: [
            { 
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
                fim: [2, 4]
            }
        ]
    }
};
