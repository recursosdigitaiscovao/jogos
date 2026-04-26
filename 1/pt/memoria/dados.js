const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "portugues",  
    nivel: "nivel1",
    nomeJogo: "ORDEM ALFABÉTICA"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", voltarMobile: "voltar_az.png" },
    "consecutivas": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", voltarMobile: "voltar_az.png" },
    "letras_mistas": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", voltarMobile: "voltar_vr.png" },
    "mesma_inicial": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", voltarMobile: "voltar_rs.png" },
    "palavras_mistas": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", voltarMobile: "voltar_cs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Pré-Escolar", intro: "Ordena os cartões pelo alfabeto!" } },
    "ano1": {
        "portugues": { t1: "ORDEM", t2: "ALFABÉTICA", sub: "Português | 1º Ano", intro: "Ordena os cartões pela ordem correta do alfabeto!" },
        "consecutivas": { t1: "LETRAS", t2: "SEGUIDAS", sub: "Alfabeto | Nível 1", intro: "Organiza as letras que vêm uma a seguir à outra!" },
        "letras_mistas": { t1: "LETRAS", t2: "MISTURADAS", sub: "Alfabeto | Nível 2", intro: "Organiza estas letras na ordem certa do alfabeto!" },
        "mesma_inicial": { t1: "MESMA", t2: "INICIAL", sub: "Alfabeto | Nível 3", intro: "Atenção: todas começam pela mesma letra. Vê a segunda!" },
        "palavras_mistas": { t1: "PALAVRAS", t2: "MISTURADAS", sub: "Alfabeto | Nível 4", intro: "Organiza os cartões seguindo o alfabeto!" }
    }
};

const JOGO_CONFIG = {
    linkVoltar: "../", textoVoltar: "VOLTAR", caminhoImg: "../../../img/", caminhoIcons: "../../../icons/", 
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },
    niveis_regra: [
        { id: "nivel1", nome: "Curto", cartas: 3, icon: "🟢" },
        { id: "nivel2", nome: "Médio", cartas: 4, icon: "🟡" },
        { id: "nivel3", nome: "Longo", cartas: 5, icon: "🔴" }
    ],
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    categorias: {
        consecutivas: {
            nome: "Consecutivas", imgCapa: "letras/letra_a.png",
            itens: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => ({ nome: l, img: `letras/letra_${l.toLowerCase()}.png` }))
        },
        letras_mistas: {
            nome: "Letras Mistas", imgCapa: "letras/letra_m.png",
            itens: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => ({ nome: l, img: `letras/letra_${l.toLowerCase()}.png` }))
        },
        mesma_inicial: {
            nome: "Mesma Inicial", imgCapa: "frutas/amora.png",
            itens: [
                { nome: "ABELHA", img: "animaisselvagens/abelha.png" }, { nome: "ÁGUIA", img: "animaisselvagens/aguia.png" }, { nome: "ARANHA", img: "animaisselvagens/aranha.png" }, { nome: "AFIA", img: "materialescolar/afia.png" }, { nome: "ANEL", img: "objetos/anel.png" }, { nome: "AMORA", img: "frutas/amora.png" }, { nome: "ANANÁS", img: "frutas/ananas.png" }, { nome: "AVESTRUZ", img: "animaisselvagens/avestruz.png" },
                { nome: "BANANA", img: "frutas/banana.png" }, { nome: "BALEIA", img: "animaisselvagens/baleia.png" }, { nome: "BURRO", img: "animaisdomesticos/burro.png" }, { nome: "BALDE", img: "objetos/balde.png" }, { nome: "BOLA", img: "objetos/bola.png" }, { nome: "BONECA", img: "objetos/boneca.png" }, { nome: "BORRACHA", img: "materialescolar/borracha.png" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" }, { nome: "COELHO", img: "animaisdomesticos/coelho.png" }, { nome: "CADERNO", img: "materialescolar/caderno.png" }, { nome: "CANETA", img: "materialescolar/caneta.png" }, { nome: "CAPA", img: "materialescolar/capa.png" }, { nome: "CEREJA", img: "frutas/cereja.png" }, { nome: "COLHER", img: "objetos/colher.png" }
            ]
        },
        palavras_mistas: {
            nome: "Palavras Mistas", imgCapa: "animaisdomesticos/gato.png",
            itens: [
                { nome: "BURRO", img: "animaisdomesticos/burro.png" }, { nome: "CABRA", img: "animaisdomesticos/cabra.png" }, { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "DADO", img: "objetos/dado.png" }, { nome: "FOCA", img: "animaisdomesticos/foca.png" }, { nome: "GATO", img: "animaisdomesticos/gato.png" }, { nome: "HIENA", img: "animaisselvagens/hiena.png" }, { nome: "KIWI", img: "frutas/kiwi.png" }, { nome: "LEÃO", img: "animaisselvagens/leao.png" }, { nome: "MAÇÃ", img: "frutas/maca.png" }, { nome: "OVELHA", img: "animaisdomesticos/ovelha.png" }, { nome: "PANDA", img: "animaisselvagens/panda.png" }, { nome: "RÉGUA", img: "materialescolar/regua.png" }, { nome: "TIGRE", img: "animaisselvagens/tigre.png" }, { nome: "UVA", img: "frutas/uva.png" }, { nome: "ZEBRA", img: "animaisselvagens/zebra.png" }, { nome: "GALO", img: "animaisdomesticos/galo.png" }, { nome: "PATO", img: "animaisdomesticos/pato.png" }, { nome: "PERU", img: "animaisdomesticos/peru.png" }, { nome: "PORCO", img: "animaisdomesticos/porco.png" }, { nome: "NOVE", img: "numeros/nove.png" }, { nome: "CINCO", img: "numeros/cinco.png" }, { nome: "BORRACHA", img: "materialescolar/borracha.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque do alfabeto!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a praticar!", img: "taca_4.png" }
    ]
};
