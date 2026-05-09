// === DICIONÁRIO MESTRE DA FÁBRICA ===
const DICIONARIO_GLOBAL = {
    dissilabos: ["BOLA","BOLO","BOTA","BOCA","BODE","CASA","CAMA","CADA","CABO","COLA","COPA","COMA","DADO","DATA","DAMA","DEDO","DOCE","FADA","FACA","FAMA","FOGO","FOTO","GATO","GALA","GALO","GOLA","GOTA","LAMA","LATA","LADO","LOBO","LOTO","LUAR","MALA","MANA","MANO","MAPA","MATA","MATO","MEDO","MESA","MIMO","MOTA","MOTO","PATA","PATO","PAPA","PARA","PERA","PENA","PICO","PIPA","RALA","RATA","RATO","RODA","RODO","ROCA","ROMA","ROSA","ROTA","SACA","SALA","SAPO","SETA","SELO","SOPA","TACA","TALA","TATO","TELA","TIME","TOGA","TOMA","VACA","VALA","VAGA","VELA","VILA","VOTO"],
    trissilabos: ["MACACO","BATATA","BANANA","JANELA","PANELA","CANELA","CANETA","CAJADO","CAMADA","COMIDA","COMETA","CORADA","BALADA","CAVALO","BONECA","PIPOCA","SALADA","SAPATO","SACADA","PELADA","PETECA","AMADO","APARADA","FALADA","MAMADA","MANADA","PIRATA","RECADA","RECOMA","TAMPADA","TAPADA"]
};

const JOGO_CATEGORIAS = {
    "Nível 1": {
        nome: "Fábrica: 2 Sílabas",
        slots: 2,
        target: 10,
        pool: DICIONARIO_GLOBAL.dissilabos,
        extras: ["BA","CA","DA","LA","MA","PA","RA","SA","TA","VA","BO","CO","DO","FO","GO","MO","NO","PO","RO","SO","TO"]
    },
    "Nível 2": {
        nome: "Fábrica: 3 Sílabas",
        slots: 3,
        target: 10,
        pool: DICIONARIO_GLOBAL.trissilabos,
        extras: ["BA","CA","DA","LA","MA","PA","RA","TA","VA","NE","JA","MI","CO","PI","PO","RE","TE","DE","BO","LI"]
    }
};
