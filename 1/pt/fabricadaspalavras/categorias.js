// === DEFINIÇÃO DAS CATEGORIAS: A FÁBRICA DE PALAVRAS ===
const JOGO_CATEGORIAS = {
    "Nível 1": {
        nome: "Estação: 2 Peças",
        slots: 2, // Define que o aluno deve usar 2 sílabas
        target: 8, 
        bank: ["BA", "CA", "DA", "GA", "LA", "MA", "PA", "RA", "SA", "TA", "TO", "BO", "LO", "DE", "ME"],
        valid: ["BALA", "BOLO", "BOTA", "BOCA", "CAMA", "CASA", "CADA", "CABO", "COLA", "DADO", "DATA", "DAMA", "DEDO", "DOCE", "GATO", "GALA", "GALO", "LAMA", "LATA", "LADO", "LOBO", "MALA", "MATA", "MATO", "MEDO", "MESA", "MOTA", "PATA", "PATO", "PAPA", "PARA", "PERA", "PENA", "RALA", "RATA", "RATO", "RODA", "RODO", "ROSA", "SACA", "SALA", "SAPO", "SETA", "SELO", "SOPA", "TACA", "TALA", "TATO", "TELA", "TOGA", "TOMA"]
    },
    "Nível 2": {
        nome: "Estação: 3 Peças",
        slots: 3, // Define que o aluno deve usar 3 sílabas
        target: 6,
        bank: ["PI", "PO", "CA", "NE", "LA", "JA", "SA", "BA", "TA", "RE", "CO", "MI", "DA", "MA", "PA"],
        valid: ["PIPOCA", "PANELA", "PACATA", "CANETA", "CANELA", "CAJADO", "CAMADA", "COMIDA", "COMETA", "CORADA", "JANELA", "SACOLA", "SALADA", "SAPATO", "SACADA", "BATATA", "BANANA", "BALADA"]
    }
};
