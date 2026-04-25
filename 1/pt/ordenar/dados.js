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
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", intro: "Coloca as palavras por ordem alfabética!", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", intro: "Organiza os cartões seguindo a ordem do alfabeto!", rodape: "&copy; Pequenos Leitores" }
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
            nome: "Animais", exemplo: "A-B-C", exemploImg: "animaisdomesticos/gato.png", imgCapa: "animaisselvagens/leao.png",
            itens: [
                { nome: "ABELHA", img: "animaisselvagens/abelha.png" }, { nome: "ÁGUIA", img: "animaisselvagens/aguia.png" }, { nome: "ARANHA", img: "animaisselvagens/aranha.png" }, { nome: "BALEIA", img: "animaisselvagens/baleia.png" }, { nome: "BURRO", img: "animaisdomesticos/burro.png" }, { nome: "CABRA", img: "animaisdomesticos/cabra.png" }, { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" }, { nome: "COELHO", img: "animaisdomesticos/coelho.png" }, { nome: "FOCA", img: "animaisselvagens/foca.png" }, { nome: "GATO", img: "animaisdomesticos/gato.png" }, { nome: "LEÃO", img: "animaisselvagens/leao.png" }, { nome: "MACACO", img: "animaisselvagens/macaco.png" }, { nome: "PANDA", img: "animaisselvagens/panda.png" }, { nome: "TIGRE", img: "animaisselvagens/tigre.png" }, { nome: "ZEBRA", img: "animaisselvagens/zebra.png" }
            ]
        },
        frutos: {
            nome: "Frutos", exemplo: "A-B-C", exemploImg: "frutas/banana.png", imgCapa: "frutas/maca.png",
            itens: [
                { nome: "AMORA", img: "frutas/amora.png" }, { nome: "ANANÁS", img: "frutas/ananas.png" }, { nome: "BANANA", img: "frutas/banana.png" }, { nome: "CEREJA", img: "frutas/cereja.png" }, { nome: "FIGO", img: "frutas/figo.png" }, { nome: "KIWI", img: "frutas/kiwi.png" }, { nome: "LARANJA", img: "frutas/laranja.png" }, { nome: "LIMÃO", img: "frutas/limao.png" }, { nome: "MAÇÃ", img: "frutas/maca.png" }, { nome: "MORANGO", img: "frutas/morango.png" }, { nome: "PAPAIA", img: "frutas/papaia.png" }, { nome: "PERA", img: "frutas/pera.png" }, { nome: "ROMÃ", img: "frutas/roma.png" }, { nome: "UVAS", img: "frutas/uvas.png" }
            ]
        },
        objetos: {
            nome: "Objetos", exemplo: "A-B-C", exemploImg: "objetos/bola.png", imgCapa: "objetos/bola.png",
            itens: [
                { nome: "ANEL", img: "objetos/anel.png" }, { nome: "BALDE", img: "objetos/balde.png" }, { nome: "BOLA", img: "objetos/bola.png" }, { nome: "BONECA", img: "objetos/boneca.png" }, { nome: "CARRINHO", img: "objetos/carrinho.png" }, { nome: "CESTO", img: "objetos/cesto.png" }, { nome: "COPO", img: "objetos/copo.png" }, { nome: "DADO", img: "objetos/dado.png" }, { nome: "ESCOVA", img: "objetos/escova.png" }, { nome: "GARRAFA", img: "objetos/garrafa.png" }, { nome: "ÓCULOS", img: "objetos/oculos.png" }, { nome: "VELA", img: "objetos/vela.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque do alfabeto!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 0, max: 69, titulo: "Continua a praticar!", img: "taca_4.png" }
    ]
};
