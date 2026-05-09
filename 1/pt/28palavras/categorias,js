// === MÉTODO DAS 28 PALAVRAS: ESTRUTURA DE DESAFIOS ===
const DESAFIOS_FABRICA = {
    nivel1: [
        // Cada desafio foca numa palavra-mestre do método e nas suas derivações
        { bank: ["ME", "NI", "NA", "NO"], slots: 3 },       // Palavras-Mestre: MENINA, MENINO (Derivadas: NINA, NINO, MANA, NONO)
        { bank: ["SA", "PA", "TO", "GA"], slots: 3 },       // Palavra-Mestre: SAPATO (Derivadas: SAPO, PATO, TAPA, GATO, TOGA)
        { bank: ["BO", "NE", "CA", "MA"], slots: 3 },       // Palavra-Mestre: BONECA (Derivadas: BOCA, CANECA, BONÉ, CAMA, MAMA)
        { bank: ["MA", "LA", "VE", "RA"], slots: 2 },       // Palavra-Mestre: MALA, VELA (Derivadas: LAMA, VALA, RALA, MAMA, VERA)
        { bank: ["DA", "DO", "RE", "DE"], slots: 2 },       // Palavra-Mestre: DADO, REDE (Derivadas: DEDO, DADA, DEDÉ, RODO)
        { bank: ["PE", "IX", "E", "RE"], slots: 2 },        // Palavra-Mestre: PEIXE (Derivadas: PEPE, REI, EIXO)
        { bank: ["CO", "EL", "HO", "LA"], slots: 3 },       // Palavra-Mestre: COELHO (Derivadas: COLA, HELO, ECHO)
        { bank: ["CA", "VA", "LO", "TA"], slots: 3 },       // Palavra-Mestre: CAVALO (Derivadas: COLA, VALA, TALA, CALA)
        { bank: ["JA", "NE", "LA", "PA"], slots: 3 },       // Palavra-Mestre: JANELA (Derivadas: PANELA, NELA, PALA, JACA)
        { bank: ["PI", "PO", "CA", "DO"], slots: 3 }        // Palavra-Mestre: PIPOCA (Derivadas: PICO, COPA, DOCA, DADO)
    ],
    nivel2: [
        // Trissílabos e combinações mais complexas das 28 palavras
        { bank: ["GI", "RA", "FA", "TA", "PA"], slots: 3 }, // Palavra-Mestre: GIRAFA (Derivadas: FATA, RATA, PARA, PAGA)
        { bank: ["GA", "LI", "NHA", "BA", "TA"], slots: 3 },// Palavra-Mestre: GALINHA (Derivadas: GALA, BANHA, BATA, LINHA)
        { bank: ["CO", "COR", "DI", "LO", "MA"], slots: 4 },// Palavra-Mestre: CROCODILO (Derivadas: COLO, LAMA, DILO)
        { bank: ["ES", "TO", "JO", "BO", "CA"], slots: 3 }, // Palavra-Mestre: ESTOJO (Derivadas: BOCA, TOCA, BOJO)
        { bank: ["MO", "CHI", "LA", "MA", "TA"], slots: 3 },// Palavra-Mestre: MOCHILA (Derivadas: MALA, MATA, MOLA, CHILA)
        { bank: ["TE", "SOU", "RA", "RO", "SA"], slots: 3 },// Palavra-Mestre: TESOURA (Derivadas: RATA, ROSA, ROUPA, SOU)
        { bank: ["FO", "GUE", "TE", "GA", "TA"], slots: 3 },// Palavra-Mestre: FOGUETE (Derivadas: FOGO, GATA, GUETO, TETA)
        { bank: ["BA", "LE", "IA", "MA", "RE"], slots: 3 }, // Palavra-Mestre: BALEIA (Derivadas: BALA, LEIA, MARE, MEIA)
        { bank: ["LI", "VRO", "CA", "SA", "DA"], slots: 2 },// Palavra-Mestre: LIVRO (Derivadas: CASA, CADA, SALA, LIRA)
        { bank: ["CA", "DER", "NO", "MA", "PA"], slots: 3 } // Palavra-Mestre: CADERNO (Derivadas: CANO, MAPA, NADA, DANO)
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

// DICIONÁRIO MESTRE (PT-PT) baseado nas 28 palavras e suas combinações
const DICIONARIO_MESTRE = [
    // Palavras-Mestre
    "MENINA", "MENINO", "SAPATO", "GATO", "BONECA", "MALA", "VELA", "DADO", "REDE", "PEIXE", 
    "COELHO", "CAVALO", "JANELA", "PANELA", "PIPOCA", "GIRAFA", "GALINHA", "CROCODILO", 
    "ESTOJO", "MOCHILA", "TESOURA", "FOGUETE", "BALEIA", "LIVRO", "CADERNO", "ESCOLA",

    // Derivadas do Nível 1 (2 e 3 sílabas)
    "NINA", "NINO", "MANA", "MANO", "NONO", "SAPO", "PATO", "TAPA", "TOGA", "GAGO", 
    "BOCA", "CANECA", "CABO", "CAMA", "MAMA", "LAMA", "VALA", "RALA", "VERA", "DEDO", 
    "DADA", "RODO", "REI", "EIXO", "COLA", "HELO", "TALA", "CALA", "NELA", "PALA", 
    "JACA", "PICO", "COPA", "DOCA", "BOTA", "BOLO", "BALA", "BATA", "RATO", "RODA",

    // Derivadas do Nível 2 (Combinações mais ricas)
    "FATA", "RATA", "PARA", "PAGA", "GALA", "BANHA", "LINHA", "LAMA", "DILO", "TOCA", 
    "BOJO", "MATA", "MOLA", "CHILA", "ROSA", "ROUPA", "FOGO", "GUETO", "TETA", "LEIA", 
    "MARE", "MEIA", "CASA", "CADA", "SALA", "LIRA", "CANO", "MAPA", "NADA", "DANO"
];
