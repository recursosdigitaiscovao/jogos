// === DEFINIÇÃO DAS CATEGORIAS: A FÁBRICA DE PALAVRAS (DICIONÁRIO AMPLIADO) ===
const JOGO_CATEGORIAS = {
    "Nível 1": {
        nome: "Estação: 2 Sílabas",
        slots: 2, 
        target: 5, 
        imgCapa: "cnivel1.png",
        // 12 Sílabas de Alta Frequência
        bank: ["BA", "CA", "DA", "LA", "MA", "PA", "RA", "SA", "TA", "BO", "CO", "DO"],
        // Dicionário de Reconhecimento (Todas as combinações válidas em PT)
        valid: [
            "BALA", "BALO", "BANA", "BATA", "BOBA", "BOBO", "BOCA", "BODA", "BODE", "BODO", "BOLA", "BOLO", "BORA", "BOTA", "BOTO",
            "CABO", "CACA", "CACO", "CADA", "CALA", "CALO", "CAMA", "CANA", "CAPA", "CAPO", "CARA", "CARO", "CASA", "CASO", "CATA", "CATO", "COCA", "COCO", "COLA", "COLO", "COMA", "COMO", "COPA", "COPO", "CORA", "CORO", "COTA", "COTO",
            "DADA", "DADO", "DALA", "DAMA", "DANA", "DANO", "DATA", "DOCA", "DOMA", "DOMO", "DONA", "DONO", "DORA", "DOSA", "DOTA",
            "LAMA", "LATA", "LADO", "LOBO", "LOCA", "LOCO", "LODO", "LONA", "LOTA", "LOTO",
            "MALA", "MANA", "MANO", "MAPA", "MATA", "MATO", "MOCA", "MOCO", "MODA", "MODO", "MOLA", "MORA", "MORO", "MOTA", "MOTO",
            "PACA", "PACO", "PALA", "PANA", "PANO", "PAPA", "PAPO", "PARA", "PARO", "PATA", "PATO", "PODA", "POLA", "POLO", "POMA", "POMO", "POPA", "PORA", "POSA", "POTA",
            "RACA", "RADA", "RALA", "RALO", "RAMA", "RAMO", "RAPA", "RAPO", "RARA", "RARO", "RASA", "RASO", "RATA", "RATO", "ROCA", "RODA", "RODO", "ROLA", "ROLO", "ROMA", "ROSA", "ROTA", "ROTO",
            "SACA", "SACO", "SADA", "SALA", "SANA", "SAPA", "SAPO", "SARA", "SOCA", "SOCO", "SODA", "SOLA", "SOLO", "SOMA", "SONO", "SOPA", "SORO", "SOTA",
            "TACA", "TACO", "TALA", "TALO", "TAMA", "TAPA", "TAPO", "TARA", "TATO", "TOCA", "TOCO", "TODA", "TODO", "TOLA", "TOLO", "TOMA", "TOMO", "TONA", "TOPA", "TOPO", "TORA", "TORO", "TOSA", "TOTA"
        ]
    },
    "Nível 2": {
        nome: "Estação: 3 Sílabas",
        slots: 3,
        target: 5,
        imgCapa: "cnivel2.png",
        // 12 Sílabas estratégicas para 3 sílabas
        bank: ["BA", "CA", "DA", "LA", "MA", "PA", "RA", "TA", "NE", "JA", "MI", "CO"],
        // Palavras de 3 sílabas possíveis com este banco
        valid: [
            "ABADA", "ABADE", "ABAFADA", "ACALADA", "ALADA", "ALADO", "AMADA", "AMADO", "APARADA", "ARADA", "ARADO",
            "BABADA", "BABADO", "BACADA", "BALADA", "BANANA", "BARADA", "BATATA", "BICADA", "BOCADA", "CABANA", "CAJADO", "CALADA", "CALADO", "CAMADA", "CANELA", "CANETA", "CARADA", "CASACA", "CATADA", "CATADO", "CAVALO", "COMIDA", "COMETA", "CORADA", "CORADO",
            "DAMADA", "DANADA", "DANADO", "DATADA", "DATADO", "ERRADA", "ERRADO", "FALADA", "FALADO", "JACADA", "JANELA", "JOGADA", "MAMADA", "MAMADO", "MANADA", "MIMADA", "MIMADO", "MORADA", "MORADO",
            "PACATA", "PACATO", "PACADA", "PALADA", "PANELA", "PARADA", "PARADO", "PATATA", "PECADA", "PENADA", "PENADO", "PIRATA", "PIPOCA", "RECOMA", "RETA-DA", "SACADA", "SALADA", "SALATA", "SAPATO", "TAMPADA", "TAPADA", "TAPADO"
        ]
    }
};
