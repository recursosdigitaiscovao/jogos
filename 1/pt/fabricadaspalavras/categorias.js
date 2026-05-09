// === CONFIGURAÇÃO DE DESAFIOS (SETS DE SÍLABAS) ===
const DESAFIOS_FABRICA = {
    nivel1: [
        { bank: ["MA", "CA", "RA", "TO"], slots: 2 }, // Ex: MACA, CAMA, RATO, TOCA, MATO, CATO, CARA, TOMA
        { bank: ["PA", "TA", "LA", "BA"], slots: 2 }, // Ex: PATA, PALA, TAPA, TALA, LAPA, LATA, BALA, BATA
        { bank: ["SA", "LA", "MA", "DA"], slots: 2 }, // Ex: SALA, LAMA, MALA, MAMA, DAMA
        { bank: ["BO", "CO", "LO", "TA"], slots: 2 }, // Ex: BOLO, BOTA, COLO, COTA, LOBO, TOLO, TOTA
        { bank: ["CA", "SA", "PA", "DA"], slots: 2 }, // Ex: CASA, CAPA, CADA, SACA
        { bank: ["VA", "CA", "LA", "TA"], slots: 2 }, // Ex: VACA, VALA, CAVA, CATA, LAVA, LACA, LATA, TACA, TALA
        { bank: ["RO", "DA", "MA", "TA"], slots: 2 }, // Ex: RODA, ROMA, ROTA, DAMA, DATA, MATA
        { bank: ["FA", "DA", "CA", "PA"], slots: 2 }, // Ex: FADA, FACA, CADA, CAPA, DADA
        { bank: ["GA", "TO", "LO", "RO"], slots: 2 }, // Ex: GATO, GALO, TOLO, LOTO, RATO, ROLO
        { bank: ["PI", "PA", "CO", "LO"], slots: 2 }  // Ex: PIPA, PICO, COPA, COLO
    ],
    nivel2: [
        { bank: ["CA", "NE", "TA", "LA", "JA"], slots: 3 }, // Ex: CANETA, CANELA, JANELA
        { bank: ["BA", "TA", "DA", "NA", "MA"], slots: 3 }, // Ex: BATATA, BANANA, CAMADA
        { bank: ["PI", "PO", "CA", "MA", "DA"], slots: 3 }, // Ex: PIPOCA, CAMADA, PACADA
        { bank: ["SA", "PA", "TO", "LA", "DA"], slots: 3 }, // Ex: SAPATO, SALADA, SACADA
        { bank: ["CO", "MI", "DA", "RE", "TA"], slots: 3 }, // Ex: COMIDA, COMETA, RECADA
        { bank: ["MA", "CA", "CO", "LA", "DO"], slots: 3 }, // Ex: MACACO, CALADO, MELADO
        { bank: ["CA", "VA", "LO", "PA", "TA"], slots: 3 }, // Ex: CAVALO, PATATA, PACATA
        { bank: ["BO", "NE", "CA", "LA", "RE"], slots: 3 }, // Ex: BONECA, CANELA, RECOMA
        { bank: ["ES", "TO", "JO", "DA", "DO"], slots: 3 }, // Ex: ESTOJO, DITADO, DATADA
        { bank: ["GA", "LA", "DO", "GE", "RE"], slots: 3 }  // Ex: GELADO, GALADO, REGADA
    ]
};

const JOGO_CATEGORIAS = {
    "Nível 1": { nome: "Puzzle: 2 Sílabas", target: 10, desafios: DESAFIOS_FABRICA.nivel1 },
    "Nível 2": { nome: "Puzzle: 3 Sílabas", target: 10, desafios: DESAFIOS_FABRICA.nivel2 }
};

// Dicionário de validação PT-PT
const DICIONARIO_MESTRE = ["BOLA","BOLO","BOTA","BOCA","BODE","CASA","CAMA","CADA","CABO","COLA","COPA","COMA","DADO","DATA","DAMA","DEDO","DOCE","FADA","FACA","FAMA","FOGO","FOTO","GATO","GALA","GALO","GOLA","GOTA","LAMA","LATA","LADO","LOBO","MALA","MANA","MANO","MAPA","MATA","MATO","MEDO","MESA","MIMO","MOTA","PATA","PATO","PAPA","PARA","PERA","PENA","PICO","PIPA","RALA","RATA","RATO","RODA","RODO","ROCA","ROMA","ROSA","ROTA","SACA","SACO","SALA","SAPO","SETA","SELO","SOPA","SORO","TACA","TACO","TALA","TALO","TAMA","TAPA","TAPO","TARA","TATO","TOCA","TODO","TODA","TOMA","VACA","VALA","VAGA","VELA","VILA","VOTO","BIFE","BULE","CAFÉ","COPO","FIGO","GELO","JOGO","JACA","LIXO","LUXO","MODA","NOVE","REDE","RETA","TELA","SUMO","MACACO","BATATA","BANANA","JANELA","PANELA","CANELA","CANETA","CAJADO","CAMADA","COMIDA","COMETA","CORADA","BALADA","CAVALO","BONECA","PIPOCA","SALADA","SAPATO","SACADA","PELADA","PETECA","AMADO","APARADA","FALADA","MAMADA","MANADA","PIRATA","RECADA","TAMPADA","TAPADA","GELADO","FIVELA","TOMADA","VACADA","LAVADA","MELADO","PACATO","PAGODE","CATO","TOTA","RECA","PACA"];
