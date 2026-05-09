// === MÉTODO DAS 28 PALAVRAS: ESTRUTURA DE DESAFIOS ===
const DESAFIOS_FABRICA = {
    nivel1: [
        // Sílabas baralhadas nos "bank" para incentivar a leitura
        { bank: ["NO", "NA", "ME", "NI"], slots: 3 },       // MENINA, MENINO
        { bank: ["TO", "GA", "PA", "SA"], slots: 3 },       // SAPATO, SAPO, PATO
        { bank: ["CA", "MA", "BO", "NE"], slots: 3 },       // BONECA, BOCA, CAMA
        { bank: ["RA", "VE", "LA", "MA"], slots: 2 },       // MALA, VELA, LAMA
        { bank: ["DE", "RE", "DO", "DA"], slots: 2 },       // DADO, REDE, DEDO
        { bank: ["E", "RE", "XE", "PEI"], slots: 2 },       // PEIXE, REI
        { bank: ["LHO", "LA", "E", "CO"], slots: 3 },       // COELHO, COLA
        { bank: ["LO", "TA", "VA", "CA"], slots: 3 },       // CAVALO, COLA, VALA
        { bank: ["LA", "PA", "JA", "NE"], slots: 3 },       // JANELA, PANELA
        { bank: ["CA", "DO", "PO", "PI"], slots: 3 }        // PIPOCA, PICO, DOCA
    ],
    nivel2: [
        // Trissílabos e combinações mais complexas
        { bank: ["FA", "TA", "GI", "PA", "RA"], slots: 3 }, // GIRAFA
        { bank: ["NHA", "BA", "GA", "TA", "LI"], slots: 3 },// GALINHA
        { bank: ["DI", "MA", "CRO", "LO", "CO"], slots: 4 },// CROCODILO
        { bank: ["JO", "BO", "ES", "CA", "TO"], slots: 3 }, // ESTOJO
        { bank: ["LA", "MA", "MO", "TA", "CHI"], slots: 3 },// MOCHILA
        { bank: ["RA", "RO", "TE", "SA", "SOU"], slots: 3 },// TESOURA
        { bank: ["TE", "GA", "FO", "TA", "GUE"], slots: 3 },// FOGUETE
        { bank: ["A", "MA", "BA", "RE", "LEI"], slots: 3 }, // BALEIA
        { bank: ["SA", "DA", "LI", "VRO", "CA"], slots: 2 },// LIVRO
        { bank: ["NO", "MA", "CA", "PA", "DER"], slots: 3 } // CADERNO
    ]
};

const JOGO_CATEGORIAS = {
    "Nível 1": { 
        nome: "Palavras-Chave (2 e 3 Sílabas)", 
        target: 10, 
        desafios: DESAFIOS_FABRICA.nivel1 
    },
    "Nível 2": { 
        nome: "Desafios da Quinta (Até 4 Sílabas)", 
        target: 10, 
        desafios: DESAFIOS_FABRICA.nivel2 
    }
};

// DICIONÁRIO MESTRE (PT-PT)
const DICIONARIO_MESTRE = [
    // Palavras-Mestre
    "MENINA", "MENINO", "SAPATO", "GATO", "BONECA", "MALA", "VELA", "DADO", "REDE", "PEIXE", 
    "COELHO", "CAVALO", "JANELA", "PANELA", "PIPOCA", "GIRAFA", "GALINHA", "CROCODILO", 
    "ESTOJO", "MOCHILA", "TESOURA", "FOGUETE", "BALEIA", "LIVRO", "CADERNO", "ESCOLA",

    // Derivadas do Nível 1
    "NINA", "NINO", "MANA", "MANO", "NONO", "SAPO", "PATO", "TAPA", "TOGA", "GAGO", 
    "BOCA", "CANECA", "CABO", "CAMA", "MAMA", "LAMA", "VALA", "RALA", "VERA", "DEDO", 
    "DADA", "RODO", "REI", "EIXO", "COLA", "HELO", "TALA", "CALA", "NELA", "PALA", 
    "JACA", "PICO", "COPA", "DOCA", "BOTA", "BOLO", "BALA", "BATA", "RATO", "RODA",

    // Derivadas do Nível 2
    "FATA", "RATA", "PARA", "PAGA", "GALA", "BANHA", "LINHA", "LAMA", "DILO", "TOCA", 
    "BOJO", "MATA", "MOLA", "CHILA", "ROSA", "ROUPA", "FOGO", "GUETO", "TETA", "LEIA", 
    "MARE", "MEIA", "CASA", "CADA", "SALA", "LIRA", "CANO", "MAPA", "NADA", "DANO"
];
