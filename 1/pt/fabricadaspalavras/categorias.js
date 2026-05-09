// === CONFIGURAÇÃO DE DESAFIOS (SETS DE SÍLABAS) ===
const DESAFIOS_FABRICA = {
    nivel1: [
        { bank: ["TO", "MA", "RA", "CA"], slots: 2 }, // Ex: MACA, CAMA, RATO, TOCA, MATO, CATO, CARA, TOMA
        { bank: ["LA", "PA", "TA", "BA"], slots: 2 }, // Ex: PATA, PALA, TAPA, TALA, LAPA, LATA, BALA, BATA
        { bank: ["DA", "LA", "SA", "MA"], slots: 2 }, // Ex: SALA, LAMA, MALA, MAMA, DAMA
        { bank: ["CO", "TA", "LO", "BO"], slots: 2 }, // Ex: BOLO, BOTA, COLO, COTA, LOBO, TOLO, TOTA
        { bank: ["PA", "DA", "SA", "CA"], slots: 2 }, // Ex: CASA, CAPA, CADA, SACA
        { bank: ["LA", "VA", "TA", "CA"], slots: 2 }, // Ex: VACA, VALA, CAVA, CATA, LAVA, LACA, LATA, TACA, TALA
        { bank: ["TA", "RO", "MA", "DA"], slots: 2 }, // Ex: RODA, ROMA, ROTA, DAMA, DATA, MATA
        { bank: ["CA", "DA", "PA", "FA"], slots: 2 }, // Ex: FADA, FACA, CADA, CAPA, DADA
        { bank: ["LO", "GA", "RO", "TO"], slots: 2 }, // Ex: GATO, GALO, TOLO, LOTO, RATO, ROLO
        { bank: ["CO", "PI", "LO", "PA"], slots: 2 }  // Ex: PIPA, PICO, COPA, COLO
    ],
    nivel2: [
        { bank: ["LA", "CA", "JA", "NE", "TA"], slots: 3 }, // CANETA, CANELA, JANELA
        { bank: ["DA", "BA", "MA", "TA", "NA"], slots: 3 }, // BATATA, BANANA, CAMADA
        { bank: ["CA", "PO", "DA", "PI", "MA"], slots: 3 }, // PIPOCA, CAMADA, PACADA
        { bank: ["TO", "SA", "DA", "PA", "LA"], slots: 3 }, // SAPATO, SALADA, SACADA
        { bank: ["RE", "DA", "CO", "TA", "MI"], slots: 3 }, // COMIDA, COMETA, RECADA
        { bank: ["DO", "MA", "LA", "CO", "CA"], slots: 3 }, // MACACO, CALADO, MELADO
        { bank: ["LO", "CA", "TA", "VA", "PA"], slots: 3 }, // CAVALO, PATATA, PACATA
        { bank: ["CA", "BO", "RE", "NE", "LA"], slots: 3 }, // BONECA, CANELA, RECOMA
        { bank: ["TO", "DO", "ES", "DA", "JO"], slots: 3 }, // ESTOJO, DITADO, DATADA
        { bank: ["RE", "LA", "GE", "DO", "GA"], slots: 3 }  // GELADO, GALADO, REGADA
    ]
};

const JOGO_CATEGORIAS = {
    "Nível 1": { nome: "Puzzle: 2 Sílabas", target: 5, desafios: DESAFIOS_FABRICA.nivel1 },
    "Nível 2": { nome: "Puzzle: 3 Sílabas", target: 5, desafios: DESAFIOS_FABRICA.nivel2 }
};

// Dicionário de validação PT-PT (Baseado nos teus exemplos)
const DICIONARIO_MESTRE = [
    // Palavras Nível 1
    "MACA", "CAMA", "RATO", "TOCA", "MATO", "CATO", "CARA", "TOMA",
    "PATA", "PALA", "TAPA", "TALA", "LAPA", "LATA", "BALA", "BATA",
    "SALA", "LAMA", "MALA", "MAMA", "DAMA",
    "BOLO", "BOTA", "COLO", "COTA", "LOBO", "TOLO", "TOTA",
    "CASA", "CAPA", "CADA", "SACA",
    "VACA", "VALA", "CAVA", "CATA", "LAVA", "LACA", "TACA",
    "RODA", "ROMA", "ROTA", "DATA", "MATA",
    "FADA", "FACA", "DADA", "PACA",
    "GATO", "GALO", "LOTO", "ROLO",
    "PIPA", "PICO", "COPA", "COLO",
    
    // Palavras Nível 2
    "CANETA", "CANELA", "JANELA",
    "BATATA", "BANANA", "CAMADA",
    "PIPOCA", "PACADA",
    "SAPATO", "SALADA", "SACADA",
    "COMIDA", "COMETA", "RECADA",
    "MACACO", "CALADO", "MELADO",
    "CAVALO", "PATATA", "PACATA",
    "BONECA", "RECOMA",
    "ESTOJO", "DITADO", "DATADA",
    "GELADO", "GALADO", "REGADA"
];
