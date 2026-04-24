// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "portugues",  // Opções: "portugues", "matematica", "estudo", "pre"
    nomeJogo: "CONTAR SÍLABAS"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "Pequenos", t2: "Curiosos", sub: "Atividades | Pré-Escolar", intro: "Brinca com os números e as cores!", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", intro: "Clica no número que corresponde à quantidade de sílabas!", rodape: "&copy; Pequenos Leitores" },
        "matematica": { t1: "PEQUENOS", t2: "MATEMÁTICOS", sub: "Matemática | 1º Ano", intro: "Explora os números e diverte-te!", rodape: "&copy; Pequenos Matemáticos" },
        "estudo": { t1: "PEQUENOS", t2: "EXPLORADORES", sub: "Estudo do Meio | 1º Ano", intro: "Explora o mundo à tua volta!", rodape: "&copy; Pequenos Exploradores" }
    },
    "ano2": {
        "portugues": { t1: "JOVENS", t2: "LEITORES", sub: "Português | 2º Ano", intro: "Explora as palavras e a leitura!", rodape: "&copy; Jovens Leitores" },
        "matematica": { t1: "JOVENS", t2: "MATEMÁTICOS", sub: "Matemática | 2º Ano", intro: "Diverte-te com os cálculos!", rodape: "&copy; Jovens Matemáticos" },
        "estudo": { t1: "JOVENS", t2: "INVESTIGADORES", sub: "Estudo do Meio | 2º Ano", intro: "Investiga o mundo!", rodape: "&copy; Jovens Investigadores" }
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
        animais: {
            nome: "Animais", exemplo: "CA-VA-LO", exemploImg: "animaisdomesticos/cavalo.png", total: 3, imgCapa: "animaisdomesticos/gato.png",
            itens: [
                { nome: "VACA", silabas: 2, img: "animaisdomesticos/vaca.png" },
                { nome: "GATO", silabas: 2, img: "animaisdomesticos/gato.png" },
                { nome: "PATO", silabas: 2, img: "animaisdomesticos/pato.png" },
                { nome: "PERU", silabas: 2, img: "animaisdomesticos/peru.png" },
                { nome: "CÃO", silabas: 1, img: "animaisdomesticos/cao.png" },
                { nome: "CAVALO", silabas: 3, img: "animaisdomesticos/cavalo.png" },
                { nome: "BURRO", silabas: 2, img: "animaisdomesticos/burro.png" },
                { nome: "GALINHA", silabas: 3, img: "animaisdomesticos/galinha.png" },
                { nome: "COELHO", silabas: 3, img: "animaisdomesticos/coelho.png" },
                { nome: "PORCO", silabas: 2, img: "animaisdomesticos/porco.png" }
            ]
        },
        frutos: {
            nome: "Frutos", exemplo: "MA-ÇÃ", exemploImg: "frutas/maca.png", total: 2, imgCapa: "frutas/morango.png",
            itens: [
                { nome: "BANANA", silabas: 3, img: "frutas/banana.png" },
                { nome: "CEREJA", silabas: 3, img: "frutas/cereja.png" },
                { nome: "UVAS", silabas: 2, img: "frutas/uvas.png" },
                { nome: "MORANGO", silabas: 3, img: "frutas/morango.png" },
                { nome: "MELANCIA", silabas: 4, img: "frutas/melancia.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};
