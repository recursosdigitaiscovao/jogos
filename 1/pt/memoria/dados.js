const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "animais",  
    nivel: "nivel1", // Armazena o nível escolhido (nivel1, nivel2, nivel3)
    nomeJogo: "JOGO DA MEMÓRIA"
};

const BIBLIOTECA_TEMAS = {
    "animais": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", voltarMobile: "voltar_az.png" },
    "frutos": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", voltarMobile: "voltar_vr.png" },
    "objetos": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "ano1": {
        "animais": { t1: "MEMÓRIA", t2: "ANIMAIS", sub: "Associa Imagem e Palavra", intro: "Escolhe um tema e um nível no menu!" },
        "frutos": { t1: "MEMÓRIA", t2: "FRUTOS", sub: "Associa Imagem e Palavra", intro: "Atenção às imagens e nomes!" },
        "objetos": { t1: "MEMÓRIA", t2: "OBJETOS", sub: "Associa Imagem e Palavra", intro: "Treina a tua leitura!" }
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
    niveis: [
        { id: "nivel1", nome: "Fácil", cartas: 6, pares: 3, icon: "🟢" },
        { id: "nivel2", nome: "Médio", cartas: 8, pares: 4, icon: "🟡" },
        { id: "nivel3", nome: "Difícil", cartas: 12, pares: 6, icon: "🔴" }
    ],
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },
    categorias: {
        animais: {
            nome: "Animais", exemplo: "GATO", imgCapa: "animaisdomesticos/gato.png",
            itens: [
                { nome: "BURRO", img: "animaisdomesticos/burro.png" }, { nome: "CABRA", img: "animaisdomesticos/cabra.png" }, { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" }, { nome: "COELHO", img: "animaisdomesticos/coelho.png" }, { nome: "GALINHA", img: "animaisdomesticos/galinha.png" }, { nome: "GALO", img: "animaisdomesticos/galo.png" }, { nome: "GATO", img: "animaisdomesticos/gato.png" }, { nome: "OVELHA", img: "animaisdomesticos/ovelha.png" }, { nome: "PATO", img: "animaisdomesticos/pato.png" }, { nome: "PERU", img: "animaisdomesticos/peru.png" }, { nome: "PORCO", img: "animaisdomesticos/porco.png" }, { nome: "LEÃO", img: "animaisselvagens/leao.png" }, { nome: "ZEBRA", img: "animaisselvagens/zebra.png" }, { nome: "MACACO", img: "animaisselvagens/macaco.png" }, { nome: "PANDA", img: "animaisselvagens/panda.png" }, { nome: "TIGRE", img: "animaisselvagens/tigre.png" }, { nome: "ELEFANTE", img: "animaisselvagens/elefante.png" }, { nome: "HIENA", img: "animaisselvagens/hiena.png" }, { nome: "COALA", img: "animaisselvagens/coala.png" }, { nome: "ÁGUIA", img: "animaisselvagens/aguia.png" }
            ]
        },
        frutos: {
            nome: "Frutos", exemplo: "BANANA", imgCapa: "frutas/maca.png",
            itens: [
                { nome: "AMORA", img: "frutas/amora.png" }, { nome: "ANANÁS", img: "frutas/ananas.png" }, { nome: "BANANA", img: "frutas/banana.png" }, { nome: "CEREJA", img: "frutas/cereja.png" }, { nome: "FIGO", img: "frutas/figo.png" }, { nome: "KIWI", img: "frutas/kiwi.png" }, { nome: "LARANJA", img: "frutas/laranja.png" }, { nome: "LIMÃO", img: "frutas/limao.png" }, { nome: "MAÇÃ", img: "frutas/maca.png" }, { nome: "MORANGO", img: "frutas/morango.png" }, { nome: "PAPAIA", img: "frutas/papaia.png" }, { nome: "PERA", img: "frutas/pera.png" }, { nome: "ROMÃ", img: "frutas/roma.png" }, { nome: "UVAS", img: "frutas/uvas.png" }, { nome: "MELÃO", img: "frutas/melao.png" }, { nome: "MELANCIA", img: "frutas/melancia.png" }, { nome: "DIÓSPIRO", img: "frutas/diospiro.png" }, { nome: "GOIABA", img: "frutas/goiaba.png" }, { nome: "CASTANHA", img: "frutas/castanha.png" }, { nome: "NOZ", img: "frutas/noz.png" }
            ]
        },
        objetos: {
            nome: "Objetos", exemplo: "BONECA", imgCapa: "objetos/bola.png",
            itens: [
                { nome: "ANEL", img: "objetos/anel.png" }, { nome: "BALDE", img: "objetos/balde.png" }, { nome: "BOLA", img: "objetos/bola.png" }, { nome: "BONECA", img: "objetos/boneca.png" }, { nome: "CARRINHO", img: "objetos/carrinho.png" }, { nome: "CESTO", img: "objetos/cesto.png" }, { nome: "COLHER", img: "objetos/colher.png" }, { nome: "COPO", img: "objetos/copo.png" }, { nome: "DADO", img: "objetos/dado.png" }, { nome: "ÓCULOS", img: "objetos/oculos.png" }, { nome: "PANELA", img: "objetos/panela.png" }, { nome: "VELA", img: "objetos/vela.png" }, { nome: "ESCOVA", img: "objetos/escova.png" }, { nome: "GARFO", img: "objetos/garfo.png" }, { nome: "GARRAFA", img: "objetos/garrafa.png" }, { nome: "ISQUEIRO", img: "objetos/isqueiro.png" }, { nome: "VASSOURA", img: "objetos/vassoura.png" }, { nome: "PINCEL", img: "objetos/pincel.png" }, { nome: "PÁ", img: "objetos/pa.png" }, { nome: "DEDAL", img: "objetos/dedal.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque da memória!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a praticar!", img: "taca_4.png" }
    ]
};
