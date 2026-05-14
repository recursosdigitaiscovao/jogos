const JOGO_CATEGORIAS = {
    "nivel1": {
        nome: "Nível 1",
        imgCapa: "cnivel1.png",
        titulo: "Explorador de Quintas",
        descricao: "Usa a lanterna para encontrar os animais DOMÉSTICOS!",
        totalRondas: 10,
        tipoAlvo: "domestico",
        pastaAlvos: "animaisdomesticos/",
        pastaDistracoes: "animaisselvagens/",
        // Lista baseada na tua primeira imagem + vaca
        alvos: [
            'burro.png', 'cabra.png', 'cao.png', 'cavalo.png', 'coelho.png', 
            'galinha.png', 'galo.png', 'gato.png', 'ovelha.png', 'pato.png', 
            'peru.png', 'porco.png', 'vaca.png'
        ],
        // Lista baseada na tua segunda imagem
        distracoes: [
            'abelha.png', 'abutre.png', 'aguia.png', 'aranha.png', 'avestruz.png', 
            'baleia.png', 'borboleta.png', 'canguru.png', 'caracol.png', 'caranguejo.png', 
            'coala.png', 'crocodilo.png', 'elefante.png', 'foca.png', 'formiga.png', 
            'girafa.png', 'gorila.png', 'hiena.png', 'hipopotamo.png', 'leao.png', 
            'lobo.png', 'macaco.png', 'morcego.png', 'panda.png', 'papagaio.png', 
            'peixe.png', 'polvo.png', 'pombo.png', 'raia.png', 'raposa.png', 
            'rato.png', 'rinoceronte.png', 'tartaruga.png', 'texugo.png', 'tigre.png', 
            'tubarao.png', 'tucano.png', 'urso.png', 'zebra.png'
        ],
        quantidadeDistracoes: 11 // Total de 12 animais no ecrã
    },
    "nivel2": {
        nome: "Nível 2",
        imgCapa: "cnivel2.png",
        titulo: "Explorador da Selva",
        descricao: "Agora o desafio mudou! Encontra os animais SELVAGENS!",
        totalRondas: 10,
        tipoAlvo: "selvagem",
        pastaAlvos: "animaisselvagens/",
        pastaDistracoes: "animaisdomesticos/",
        // No nível 2, os alvos são os selvagens
        alvos: [
            'abelha.png', 'abutre.png', 'aguia.png', 'aranha.png', 'avestruz.png', 
            'baleia.png', 'borboleta.png', 'canguru.png', 'caracol.png', 'caranguejo.png', 
            'coala.png', 'crocodilo.png', 'elefante.png', 'foca.png', 'formiga.png', 
            'girafa.png', 'gorila.png', 'hiena.png', 'hipopotamo.png', 'leao.png', 
            'lobo.png', 'macaco.png', 'morcego.png', 'panda.png', 'papagaio.png', 
            'peixe.png', 'polvo.png', 'pombo.png', 'raia.png', 'raposa.png', 
            'rato.png', 'rinoceronte.png', 'tartaruga.png', 'texugo.png', 'tigre.png', 
            'tubarao.png', 'tucano.png', 'urso.png', 'zebra.png'
        ],
        // E as distrações são os domésticos
        distracoes: [
            'burro.png', 'cabra.png', 'cao.png', 'cavalo.png', 'coelho.png', 
            'galinha.png', 'galo.png', 'gato.png', 'ovelha.png', 'pato.png', 
            'peru.png', 'porco.png', 'vaca.png'
        ],
        quantidadeDistracoes: 11 // Total de 12 animais no ecrã
    }
};
