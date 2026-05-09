// === DEFINIÇÃO DAS CATEGORIAS: A FÁBRICA DE PALAVRAS ===
const JOGO_CATEGORIAS = {
    "Nível 1": {
        nome: "Estação de 2 Sílabas",
        imgCapa: "cnivel1.png",
        target: 5, // Meta de palavras para vencer
        bank: ["GA", "TO", "LO", "BO", "CA", "MA", "VA", "PA", "LA", "ME"],
        valid: ["GATO", "LOBO", "GALO", "BOLO", "VACA", "PAPA", "PATO", "CAMA", "BOCA", "MALA", "MACA", "LAMA", "BOTA", "VALA", "VAGA", "MESA"]
    },
    "Nível 2": {
        nome: "Estação Mista",
        imgCapa: "cnivel2.png",
        target: 5,
        bank: ["PI", "CO", "NE", "LA", "JA", "SA", "BA", "TA", "RE", "CA", "PA"],
        valid: ["PIPA", "COLA", "NELA", "SALA", "BALA", "TELA", "RETA", "PICO", "COPO", "BATA", "SACO", "BICO", "JANELA", "PANELA", "CANETA", "SAPATO", "BONECA", "CANECA", "PATA"]
    },
    "Nível 3": {
        nome: "Engenharia de Palavras",
        imgCapa: "cnivel3.png",
        target: 6,
        bank: ["DE", "DO", "FA", "DA", "ME", "SA", "RA", "TO", "LI", "XO", "PE", "TE"],
        valid: ["DEDO", "FADA", "MESA", "RATO", "LIXO", "DADO", "MEDO", "FAMA", "RETA", "DATA", "RETE", "TELA", "TAPETE", "SAPATO", "DOCE"]
    }
};
