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
    // NÍVEL 2: VERDADEIRO OU FALSO
    nivel2: [
        { par: ["PESADO", "LEVE"], resposta: true },    // Certo
        { par: ["PESADO", "GRANDE"], resposta: false }, // Errado
        { par: ["MAGRO", "GORDO"], resposta: true },     // Certo
        { par: ["MAGRO", "ALTO"], resposta: false },    // Errado
        { par: ["CHEIO", "VAZIO"], resposta: true },     // Certo
        { par: ["CHEIO", "MUITO"], resposta: false },    // Errado
        { par: ["COMPRIDO", "CURTO"], resposta: true },  // Certo
        { par: ["COMPRIDO", "LARGO"], resposta: false }, // Errado
        { par: ["SECO", "MOLHADO"], resposta: true },    // Certo
        { par: ["SECO", "LIMPO"], resposta: false }     // Errado
    ]
};

const JOGO_CATEGORIAS = {
    "Nível 1": { 
        nome: "Escolha Múltipla", 
        tipo: "multipla",
        target: 10, 
        desafios: DESAFIOS_ANTONIMOS.nivel1,
        imgCapa: "cnivel1.png" 
    },
    "Nível 2": { 
        nome: "Certo ou Errado?", 
        tipo: "v_f",
        target: 10, 
        desafios: DESAFIOS_ANTONIMOS.nivel2,
        imgCapa: "cnivel2.png" 
    }
};
