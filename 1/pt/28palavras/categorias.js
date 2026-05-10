// === MÉTODO DAS 28 PALAVRAS E DICIONÁRIO PT-PT ===
const DICIONARIO_GLOBAL = [
    "MALA", "LAMA", "CAMA", "CASA", "PATA", "PATO", "MAPA", "MATA", "MATO", "TAPA", "TATO", "TOCA", "RATO", "RATA", "RODA", "ROMA", "SALA", "SACA", "SACO", "VACA", "VALA", "VELA", "BOLA", "BOLO", "BOTA", "BOCA", "COLA", "COPO", "DADO", "DEDO", "FADA", "FACA", "FOGO", "GATO", "GALO", "GOLA", "LUVA", "LATA", "NETO", "NOVE", "PENA", "PIPA", "PICO", "REDE", "ROSA", "SINO", "SELO", "SOPA", "TATU", "TELA", "XALE", "ZEBRA", "ZERO", "CÃO", "PIÃO", "SUMO", "MOTA", "GELADO", "MACACO", "JANELA", "PANELA", "BATATA", "BANANA", "CAVALO", "BONECA", "PIPOCA", "SALADA", "SAPATO", "SACADA", "PELADA", "PETECA", "CAMADA", "CANELA", "CANETA", "COMIDA", "COMETA", "ESTOJO", "MOCHILA", "TESOURA", "FOGUETE", "BALEIA", "LIVRO", "CADERNO"
];

const JOGO_CATEGORIAS = {
    "Nível 1": { 
        nome: "Fábrica: 2 Sílabas", 
        slots: 2, 
        target: 10,
        // Sílabas comuns em Portugal para preencher o banco de 4
        extras: ["BA","CA","DA","LA","MA","PA","RA","SA","TA","VA","BO","CO","DO","FO","GO","MO","NO","PO","RO","SO","TO"]
    },
    "Nível 2": { 
        nome: "Fábrica: 3 Sílabas", 
        slots: 3, 
        target: 10,
        extras: ["BA","CA","DA","LA","MA","PA","RA","TA","VA","NE","JA","MI","CO","PI","PO","RE","TE","DE","BO","LI"]
    }
};
