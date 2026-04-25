const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "portugues",  
    nomeJogo: "JOGO DOS BALÕES"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", intro: "Descobre a palavra antes que os balões acabem!", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", intro: "Clica nas letras para adivinhar a palavra!", rodape: "&copy; Pequenos Leitores" }
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
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3",
        pop: "https://cdn.pixabay.com/audio/2022/03/15/audio_731454522a.mp3"
    },
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },
    categorias: {
        animais: {
            nome: "Animais", exemplo: "GATO", exemploImg: "animaisdomesticos/gato.png", imgCapa: "animaisselvagens/leao.png",
            itens: [
                { nome: "BURRO", img: "animaisdomesticos/burro.png" }, { nome: "CABRA", img: "animaisdomesticos/cabra.png" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png" }, { nome: "GALINHA", img: "animaisdomesticos/galinha.png" },
                { nome: "GALO", img: "animaisdomesticos/galo.png" }, { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "OVELHA", img: "animaisdomesticos/ovelha.png" }, { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "PERU", img: "animaisdomesticos/peru.png" }, { nome: "PORCO", img: "animaisdomesticos/porco.png" },
                { nome: "LEÃO", img: "animaisselvagens/leao.png" }, { nome: "ZEBRA", img: "animaisselvagens/zebra.png" },
                { nome: "MACACO", img: "animaisselvagens/macaco.png" }, { nome: "PANDA", img: "animaisselvagens/panda.png" }
            ]
        },
        frutos: {
            nome: "Frutos", exemplo: "BANANA", exemploImg: "frutas/banana.png", imgCapa: "frutas/maca.png",
            itens: [
                { nome: "AMORA", img: "frutas/amora.png" }, { nome: "BANANA", img: "frutas/banana.png" },
                { nome: "CEREJA", img: "frutas/cereja.png" }, { nome: "FIGO", img: "frutas/figo.png" },
                { nome: "KIWI", img: "frutas/kiwi.png" }, { nome: "LARANJA", img: "frutas/laranja.png" },
                { nome: "LIMÃO", img: "frutas/limao.png" }, { nome: "MAÇÃ", img: "frutas/maca.png" },
                { nome: "MELÃO", img: "frutas/melao.png" }, { nome: "MORANGO", img: "frutas/morango.png" }
            ]
        },
        objetos: {
            nome: "Objetos", exemplo: "BOLA", exemploImg: "objetos/bola.png", imgCapa: "objetos/bola.png",
            itens: [
                { nome: "ANEL", img: "objetos/anel.png" }, { nome: "BALDE", img: "objetos/balde.png" },
                { nome: "BOLA", img: "objetos/bola.png" }, { nome: "BONECA", img: "objetos/boneca.png" },
                { nome: "CESTO", img: "objetos/cesto.png" }, { nome: "COPO", img: "objetos/copo.png" },
                { nome: "DADO", img: "objetos/dado.png" }, { nome: "ÓCULOS", img: "objetos/oculos.png" },
                { nome: "VELA", img: "objetos/vela.png" }
            ]
        },
        material: {
            nome: "Material Escolar", exemplo: "LÁPIS", exemploImg: "materialescolar/lapis.png", imgCapa: "materialescolar/estojo.png",
            itens: [
                { nome: "AFIA", img: "materialescolar/afia.png" }, { nome: "COLA", img: "materialescolar/cola.png" },
                { nome: "ESTOJO", img: "materialescolar/estojo.png" }, { nome: "FOLHA", img: "materialescolar/folha.png" },
                { nome: "LÁPIS", img: "materialescolar/lapis.png" }, { nome: "LIVRO", img: "materialescolar/livro.png" },
                { nome: "MOCHILA", img: "materialescolar/mochila.png" }, { nome: "RÉGUA", img: "materialescolar/regua.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_3.png" },
        { min: 0, max: 49, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};
