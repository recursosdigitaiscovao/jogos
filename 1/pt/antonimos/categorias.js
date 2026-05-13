const DESAFIOS_ANTONIMOS = {
    nivel1: [
        { pergunta: "ALTO", opcoes: ["BAIXO", "GRANDE", "LARGO"], resposta: "BAIXO", icon: "📏" },
        { pergunta: "QUENTE", opcoes: ["FRIO", "DOCE", "MOLE"], resposta: "FRIO", icon: "🔥" },
        { pergunta: "ABERTO", opcoes: ["FECHADO", "LONGE", "LIMPO"], resposta: "FECHADO", icon: "🚪" },
        { pergunta: "DENTRO", opcoes: ["FORA", "BAIXO", "PERTO"], resposta: "FORA", icon: "📦" },
        { pergunta: "GRANDE", opcoes: ["PEQUENO", "ALTO", "CHEIO"], resposta: "PEQUENO", icon: "🐘" },
        { pergunta: "DIA", opcoes: ["NOITE", "SOL", "TARDE"], resposta: "NOITE", icon: "☀️" },
        { pergunta: "ALEGRE", opcoes: ["TRISTE", "FORTE", "CALMO"], resposta: "TRISTE", icon: "😊" },
        { pergunta: "LIMPO", opcoes: ["SUJO", "NOVO", "BOM"], resposta: "SUJO", icon: "✨" },
        { pergunta: "RÁPIDO", opcoes: ["LENTO", "FORTE", "MAGRO"], resposta: "LENTO", icon: "🏃" },
        { pergunta: "BONITO", opcoes: ["FEIO", "VELHO", "MAU"], resposta: "FEIO", icon: "🌸" }
    ],
    nivel2: [
        { pergunta: "PESADO", opcoes: ["LEVE", "CURTO", "FRACO"], resposta: "LEVE", icon: "🐘" },
        { pergunta: "CHEIO", opcoes: ["VAZIO", "POUCO", "NADA"], resposta: "VAZIO", icon: "🥛" },
        { pergunta: "MAGRO", opcoes: ["GORDO", "ALTO", "FORTE"], resposta: "GORDO", icon: "🦒" },
        { pergunta: "MUITO", opcoes: ["POUCO", "NADA", "BASTANTE"], resposta: "POUCO", icon: "🍎" },
        { pergunta: "CLARO", opcoes: ["ESCURO", "BRANCO", "PRETO"], resposta: "ESCURO", icon: "💡" },
        { pergunta: "COMPRIDO", opcoes: ["CURTO", "PEQUENO", "BAIXO"], resposta: "CURTO", icon: "🐍" },
        { pergunta: "MOLE", opcoes: ["DURO", "FORTE", "SECO"], resposta: "DURO", icon: "☁️" },
        { pergunta: "NOVO", opcoes: ["VELHO", "USADO", "ANTIGO"], resposta: "VELHO", icon: "🆕" },
        { pergunta: "FÁCIL", opcoes: ["DIFÍCIL", "LENTO", "MAU"], resposta: "DIFÍCIL", icon: "🧩" },
        { pergunta: "SECO", opcoes: ["MOLHADO", "FRIO", "LIMPO"], resposta: "MOLHADO", icon: "⛱️" }
    ]
};

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

const DICIONARIO_MESTRE = ["ALTO", "BAIXO", "QUENTE", "FRIO", "ABERTO", "FECHADO", "DENTRO", "FORA", "GRANDE", "PEQUENO", "DIA", "NOITE", "ALEGRE", "TRISTE", "LIMPO", "SUJO", "RÁPIDO", "LENTO", "BONITO", "FEIO"];
