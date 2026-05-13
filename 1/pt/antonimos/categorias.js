// === CONFIGURAÇÃO DE DESAFIOS (ANTÓNIMOS) ===
const DESAFIOS_ANTONIMOS = {
    nivel1: [
        { pergunta: "ALTO", opcoes: ["BAIXO", "GRANDE", "LARGO", "PESADO"], resposta: "BAIXO" },
        { pergunta: "QUENTE", opcoes: ["FRIO", "DOCE", "MOLE", "MAGRO"], resposta: "FRIO" },
        { pergunta: "ABERTO", opcoes: ["FECHADO", "LONGE", "LIMPO", "NOVO"], resposta: "FECHADO" },
        { pergunta: "DENTRO", opcoes: ["FORA", "BAIXO", "PERTO", "CURTO"], resposta: "FORA" },
        { pergunta: "GRANDE", opcoes: ["PEQUENO", "ALTO", "CHEIO", "FORTE"], resposta: "PEQUENO" },
        { pergunta: "DIA", opcoes: ["NOITE", "SOL", "TARDE", "CLARO"], resposta: "NOITE" },
        { pergunta: "ALEGRE", opcoes: ["TRISTE", "FORTE", "CALMO", "MAU"], resposta: "TRISTE" },
        { pergunta: "LIMPO", opcoes: ["SUJO", "NOVO", "BOM", "DURO"], resposta: "SUJO" },
        { pergunta: "RÁPIDO", opcoes: ["LENTO", "FORTE", "MAGRO", "ALTO"], resposta: "LENTO" },
        { pergunta: "BONITO", opcoes: ["FEIO", "VELHO", "MAU", "TRISTE"], resposta: "FEIO" }
    ],
    nivel2: [
        { pergunta: "PESADO", opcoes: ["LEVE", "CURTO", "FRACO", "MOLE"], resposta: "LEVE" },
        { pergunta: "CHEIO", opcoes: ["VAZIO", "POUCO", "NADA", "CURTO"], resposta: "VAZIO" },
        { pergunta: "MAGRO", opcoes: ["GORDO", "ALTO", "FORTE", "BAIXO"], resposta: "GORDO" },
        { pergunta: "MUITO", opcoes: ["POUCO", "NADA", "BASTANTE", "MUITO"], resposta: "POUCO" },
        { pergunta: "CLARO", opcoes: ["ESCURO", "BRANCO", "PRETO", "AZUL"], resposta: "ESCURO" },
        { pergunta: "COMPRIDO", opcoes: ["CURTO", "PEQUENO", "BAIXO", "MAGRO"], resposta: "CURTO" },
        { pergunta: "MOLE", opcoes: ["DURO", "FORTE", "SECO", "QUENTE"], resposta: "DURO" },
        { pergunta: "NOVO", opcoes: ["VELHO", "USADO", "ANTIGO", "BOM"], resposta: "VELHO" },
        { pergunta: "FÁCIL", opcoes: ["DIFÍCIL", "LENTO", "MAU", "COMPRIDO"], resposta: "DIFÍCIL" },
        { pergunta: "SECO", opcoes: ["MOLHADO", "FRIO", "LIMPO", "MOLE"], resposta: "MOLHADO" }
    ]
};

// === DEFINIÇÃO DAS CATEGORIAS PARA O MENU RD ===
const JOGO_CATEGORIAS = {
    "Nível 1": { 
        nome: "Antónimos Simples", 
        target: 10, 
        desafios: DESAFIOS_ANTONIMOS.nivel1,
        imgCapa: "cnivel1.png" 
    },
    "Nível 2": { 
        nome: "Mais Opostos!", 
        target: 10, 
        desafios: DESAFIOS_ANTONIMOS.nivel2,
        imgCapa: "cnivel2.png" 
    }
};
