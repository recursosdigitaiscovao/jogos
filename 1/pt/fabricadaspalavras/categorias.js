// === DICIONÁRIO MESTRE GLOBAL (ESTRITAMENTE PT-PT) ===
const DICIONARIO_MESTRE = [
    // 2 SÍLABAS (Dissílabos Simples)
    "BOLA", "BOLO", "BOTA", "BOCA", "BODE", "CASA", "CAMA", "CADA", "CABO", "COLA", 
    "COPA", "COMA", "DADO", "DATA", "DAMA", "DEDO", "DOCE", "FADA", "FACA", "FAMA", 
    "FOGO", "FOTO", "GATO", "GALA", "GALO", "GOLA", "GOTA", "LAMA", "LATA", "LADO", 
    "LOBO", "MALA", "MANA", "MANO", "MAPA", "MATA", "MATO", "MEDO", "MESA", "MIMO", 
    "MOTA", "PATA", "PATO", "PAPA", "PARA", "PERA", "PENA", "PICO", "PIPA", "RALA", 
    "RATA", "RATO", "RODA", "RODO", "ROCA", "ROMA", "ROSA", "ROTA", "SACA", "SACO", 
    "SALA", "SAPO", "SETA", "SELO", "SOPA", "SORO", "TACA", "TACO", "TALA", "TALO", 
    "TAMA", "TAPA", "TAPO", "TARA", "TATO", "TOCA", "TODO", "TODA", "TOMA", "VACA", 
    "VALA", "VAGA", "VELA", "VILA", "VOTO", "BIFE", "BULE", "CAFÉ", "COPO", "FIGO", 
    "GELO", "JOGO", "JACA", "LIXO", "LUXO", "MODA", "NOVE", "REDE", "RETA", "TELA", 
    "XALE", "CÃO", "PIÃO", "SUMO",

    // 3 SÍLABAS (Trissílabos Simples)
    "MACACO", "BATATA", "BANANA", "JANELA", "PANELA", "CANELA", "CANETA", "CAJADO", 
    "CAMADA", "COMIDA", "COMETA", "CORADA", "BALADA", "CAVALO", "BONECA", "PIPOCA", 
    "SALADA", "SAPATO", "SACADA", "PELADA", "PETECA", "AMADO", "APARADA", "FALADA", 
    "MAMADA", "MANADA", "PIRATA", "RECADA", "TAMPADA", "TAPADA", "GELADO", "FIVELA", 
    "TOMADA", "VACADA", "LAVADA", "MELADO", "PACATO", "PAGODE"
];

const JOGO_CATEGORIAS = {
    "Nível 1": {
        nome: "Fábrica: 2 Sílabas",
        slots: 2, 
        target: 10,
        pool: DICIONARIO_MESTRE.filter(w => w.length <= 5), 
        extras: ["BA","CA","DA","LA","MA","PA","RA","SA","TA","VA","BO","CO","DO","FO","GO","MO","NO","PO","RO","SO","TO"]
    },
    "Nível 2": {
        nome: "Fábrica: 3 Sílabas",
        slots: 3, 
        target: 10,
        pool: DICIONARIO_MESTRE.filter(w => w.length > 5),
        extras: ["BA","CA","DA","LA","MA","PA","RA","TA","VA","NE","JA","MI","CO","PI","PO","RE","TE","DE","BO","LI"]
    }
};
