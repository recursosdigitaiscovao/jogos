const JOGO_CATEGORIAS = {
    "nivel1": {
        nome: "Nível 1",
        imgCapa: "cnivel1.png",
        titulo: "Explorador Iniciante",
        descricao: "Encontra os animais domésticos na quinta!",
        totalRondas: 10,
        // Configuração específica do conteúdo
        pastaAlvos: "animaisdomesticos/",
        pastaDistracoes: "animaisselvagens/",
        alvos: ['cao.png', 'gato.png', 'vaca.png', 'porco.png', 'ovelha.png', 'galinha.png', 'cavalo.png', 'cabra.png'],
        distracoes: ['leao.png', 'tigre.png', 'elefante.png', 'girafa.png', 'lobo.png', 'raposa.png'],
        quantidadeDistracoes: 4 // Menos animais para ser mais fácil
    },
    "nivel2": {
        nome: "Nível 2",
        imgCapa: "cnivel2.png",
        titulo: "Mestre da Selva",
        descricao: "Cuidado! A selva está muito concorrida!",
        totalRondas: 10,
        // Configuração específica do conteúdo
        pastaAlvos: "animaisdomesticos/",
        pastaDistracoes: "animaisselvagens/",
        alvos: ['cao.png', 'gato.png', 'vaca.png', 'porco.png', 'ovelha.png', 'galinha.png', 'cavalo.png', 'cabra.png'],
        distracoes: ['leao.png', 'tigre.png', 'elefante.png', 'girafa.png', 'lobo.png', 'raposa.png', 'cobra.png', 'jacare.png', 'urso.png', 'zebra.png'],
        quantidadeDistracoes: 10 // Mais distrações para dificultar
    }
};
