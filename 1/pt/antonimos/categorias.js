// === CONFIGURAÇÃO DE DESAFIOS (SETS DE SÍLABAS) ===
const DESAFIOS_FABRICA = {
    nivel1: [
        { bank: ["SO", "PA", "TA", "MA"], slots: 2 }, // PATA, SOPA, SOMA, MAPA, MATA, TAPA
        { bank: ["BA", "TA", "LA", "PA"], slots: 2 }, // PATA, PALA, TAPA, TALA, LAPA, LATA, BALA, BATA
        { bank: ["MA", "SA", "DA", "LA"], slots: 2 }, // SALA, LAMA, MALA, MAMA, DAMA
        { bank: ["CO", "LO", "TA", "BO"], slots: 2 }, // BOLO, BOTA, COLO, COTA, LOBO, TOLO, TOTA
        { bank: ["SA", "DA", "CA", "PA"], slots: 2 }, // CASA, CAPA, CADA, SACA
        { bank: ["VA", "TA", "LA", "CA"], slots: 2 }, // VACA, VALA, CAVA, CATA, LAVA, LACA, LATA, TACA, TALA
        { bank: ["MA", "RO", "DA", "TA"], slots: 2 }, // RODA, ROMA, ROTA, DAMA, DATA, MATA
        { bank: ["DA", "FA", "PA", "CA"], slots: 2 }, // FADA, FACA, CADA, CAPA, DADA
        { bank: ["GA", "RO", "TO", "LO"], slots: 2 }, // GATO, GALO, TOLO, LOTO, RATO, ROLO
        { bank: ["CO", "PI", "PA", "LO"], slots: 2 }  // PIPA, PICO, COPA, COLO
    ],
    nivel2: [
        { bank: ["NE", "JA", "TA", "LA", "PA"], slots: 3 }, // JANELA, PANELA
        { bank: ["CO", "MA", "LA", "DO", "CA"], slots: 3 }, // MACACO, CALADO, COLADO
        { bank: ["MA", "TA", "CA", "DA", "BA"], slots: 3 }, // BATATA, CAMADA, MACACA
        { bank: ["RE", "NE", "TA", "BO", "CA"], slots: 3 }, // BONECA, CARETA, CANETA
        { bank: ["TE", "SA", "PA", "PE", "TO"], slots: 3 }, // SAPATO, TAPETE
        { bank: ["VA", "DA", "LO", "CA", "TA"], slots: 3 }, // CAVALO, PATADA
        { bank: ["CA", "CO", "MI", "DA", "MA"], slots: 3 }, // COMIDA, CAMADA, MACACO
        { bank: ["DO", "GE", "LA", "GA", "RE"], slots: 3 }, // GELADO, REGADO
        { bank: ["VE", "CA", "LA", "FI", "DA"], slots: 3 }, // FIVELA, CALADA
        { bank: ["PO", "CA", "DA", "PI", "CO"], slots: 3 }  // PIPOCA, PICADA
    ]
};

const JOGO_CATEGORIAS = {
    "Nível 1": { 
        nome: "Puzzle: 2 Sílabas", 
        target: 10, 
        desafios: DESAFIOS_FABRICA.nivel1,
        imgCapa: "cnivel1.png" // Ícone para o Nível 1
    },
    "Nível 2": { 
        nome: "Puzzle: 3 Sílabas", 
        target: 10, 
        desafios: DESAFIOS_FABRICA.nivel2,
        imgCapa: "cnivel2.png" // Ícone para o Nível 2
    }
};

// Dicionário de validação PT-PT
const DICIONARIO_MESTRE = [
    // --- Nível 1 ---
    "PATA", "SOPA", "SOMA", "MAPA", "MATA", "TAPA",
    "PALA", "TALA", "LAPA", "LATA", "BALA", "BATA",
    "SALA", "LAMA", "MALA", "MAMA", "DAMA",
    "BOLO", "BOTA", "COLO", "COTA", "LOBO", "TOLO", "TOTA",
    "CASA", "CAPA", "CADA", "SACA",
    "VACA", "VALA", "CAVA", "CATA", "LAVA", "LACA", "TACA",
    "RODA", "ROMA", "ROTA", "DATA",
    "FADA", "FACA", "DADA", "PACA",
    "GATO", "GALO", "LOTO", "ROLO", "RATO",
    "PIPA", "PICO", "COPA", "COLO",
    "VALE", "LEVA", "FITA", "FILA", "GATA", "GALA", "NETA",
    "DEDO", "MEDE", "MEDO", "MESA", "COPO", "COA", "LUA", "BODA", "RAMO", "RASA", "RATA", "MOTA", "SARA", "SATA", "TARA",

    // --- Nível 2 ---
    "JANELA", "PANELA",
    "MACACO", "CALADO", "COLADO",
    "BATATA", "BANANA", "CAMADA", "MACACA",
    "BONECA", "CARETA", "CANETA",
    "SAPATO", "TAPETE",
    "CAVALO", "PATADA",
    "COMIDA",
    "GELADO", "REGADO",
    "FIVELA", "CALADA",
    "PIPOCA", "PICADA"
];
