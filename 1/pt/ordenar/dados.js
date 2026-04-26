const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "portugues",  
    nomeJogo: "ORDEM ALFABÉTICA"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", intro: "Ordena os cartões pelo alfabeto!", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", intro: "Clica ou arrasta os cartões seguindo a ordem do alfabeto!", rodape: "&copy; Pequenos Leitores" }
    }
};

const JOGO_CONFIG = {
    linkVoltar: "../",
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",    
    caminhoIcons: "../../../icons/", 
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },
    categorias: {
        consecutivas: {
            nome: "Letras Consecutivas", exemplo: "A-B-C-D", exemploImg: "letras/letra_a.png", imgCapa: "letras/letra_a.png",
            itens: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => ({ nome: l, img: `letras/letra_${l.toLowerCase()}.png` }))
        },
        letras_mistas: {
            nome: "Letras Mistas", exemplo: "A-D-R-Y", exemploImg: "letras/letra_m.png", imgCapa: "letras/letra_m.png",
            itens: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => ({ nome: l, img: `letras/letra_${l.toLowerCase()}.png` }))
        },
        mesma_inicial: {
            nome: "Mesma Inicial", exemplo: "Amora-Anel", exemploImg: "frutas/amora.png", imgCapa: "frutas/amora.png",
            itens: [
                { nome: "ABELHA", img: "animaisselvagens/abelha.png" }, { nome: "ÁGUIA", img: "animaisselvagens/aguia.png" }, { nome: "ARANHA", img: "animaisselvagens/aranha.png" }, { nome: "AFIA", img: "materialescolar/afia.png" }, { nome: "ANEL", img: "objetos/anel.png" }, { nome: "AMORA", img: "frutas/amora.png" }, { nome: "ANANÁS", img: "frutas/ananas.png" }, { nome: "AVESTRUZ", img: "animaisselvagens/avestruz.png" },
                { nome: "BANANA", img: "frutas/banana.png" }, { nome: "BALEIA", img: "animaisselvagens/baleia.png" }, { nome: "BURRO", img: "animaisdomesticos/burro.png" }, { nome: "BALDE", img: "objetos/balde.png" }, { nome: "BOLA", img: "objetos/bola.png" }, { nome: "BONECA", img: "objetos/boneca.png" }, { nome: "BORRACHA", img: "materialescolar/borracha.png" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" }, { nome: "COELHO", img: "animaisdomesticos/coelho.png" }, { nome: "CADERNO", img: "materialescolar/caderno.png" }, { nome: "CANETA", img: "materialescolar/caneta.png" }, { nome: "CAPA", img: "materialescolar/capa.png" }, { nome: "CEREJA", img: "frutas/cereja.png" }, { nome: "CESTO", img: "objetos/cesto.png" }, { nome: "COLHER", img: "objetos/colher.png" }, { nome: "COPO", img: "objetos/copo.png" }
            ]
        },
        palavras_mistas: {
            nome: "Palavras Mistas", exemplo: "Anel-Kiwi-Régua", exemploImg: "objetos/anel.png", imgCapa: "objetos/anel.png",
            itens: [
                { nome: "ANEL", img: "objetos/anel.png" }, { nome: "BURRO", img: "animaisdomesticos/burro.png" }, { nome: "CABRA", img: "animaisdomesticos/cabra.png" }, { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" }, { nome: "COELHO", img: "animaisdomesticos/coelho.png" }, { nome: "DADO", img: "objetos/dado.png" }, { nome: "ESCOVA", img: "objetos/escova.png" }, { nome: "FOCA", img: "animaisdomesticos/foca.png" }, { nome: "GATO", img: "animaisdomesticos/gato.png" }, { nome: "ISQUEIRO", img: "objetos/isqueiro.png" }, { nome: "KIWI", img: "frutas/kiwi.png" }, { nome: "LEÃO", img: "animaisselvagens/leao.png" }, { nome: "MAÇÃ", img: "frutas/maca.png" }, { nome: "OVELHA", img: "animaisdomesticos/ovelha.png" }, { nome: "PANDA", img: "animaisselvagens/panda.png" }, { nome: "RÉGUA", img: "materialescolar/regua.png" }, { nome: "TIGRE", img: "animaisselvagens/tigre.png" }, { nome: "UVA", img: "frutas/uva.png" }, { nome: "VELA", img: "objetos/vela.png" }, { nome: "ZEBRA", img: "animaisselvagens/zebra.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque do alfabeto!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};
