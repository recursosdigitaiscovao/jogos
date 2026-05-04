// === DEFINIÇÃO DAS DIFICULDADES: FORMAS GEOMÉTRICAS ===
const JOGO_CATEGORIAS = {
    "Nível 1": {
        nome: "Formas: Mesma Cor",
        imgCapa: "cnivel1.png", 
        coresMisturadas: false, // No nível 1, todos os objetos da ronda têm a mesma cor
        quantidade: 8 // Quantidade de formas no ecrã
    },
    "Nível 2": {
        nome: "Formas: Cores Misturadas",
        imgCapa: "cnivel2.png",
        coresMisturadas: true, // No nível 2, as cores são aleatórias
        quantidade: 12
    }
};

// Auxiliar para a lógica do jogo
const BIBLIOTECA_FORMAS = {
    "formas": ["circulo", "hexagono", "pentagono", "quadrado", "retangulo", "triangulo"],
    "cores": ["a", "l", "v", "vd"], // azul, laranja, vermelho, verde
    "nomes": {
        "circulo": "Círculos",
        "hexagono": "Hexágonos",
        "pentagono": "Pentágonos",
        "quadrado": "Quadrados",
        "retangulo": "Retângulos",
        "triangulo": "Triângulos"
    }
};
