const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "portugues",  
    nomeJogo: "CORTAR SÍLABAS"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", intro: "Clica entre as letras para separar as sílabas!", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", intro: "Clica entre as letras para separar as sílabas das palavras!", rodape: "&copy; Pequenos Leitores" }
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
            nome: "Animais", exemplo: "GATO", exemploImg: "animaisdomesticos/gato.png", imgCapa: "animaisselvagens/leao.png",
            itens: [
                { nome: "BURRO", silabas: ["BU", "RRO"], img: "animaisdomesticos/burro.png" },
                { nome: "CABRA", silabas: ["CA", "BRA"], img: "animaisdomesticos/cabra.png" },
                { nome: "CÃO", silabas: ["CÃO"], img: "animaisdomesticos/cao.png" },
                { nome: "CAVALO", silabas: ["CA", "VA", "LO"], img: "animaisdomesticos/cavalo.png" },
                { nome: "COELHO", silabas: ["CO", "E", "LHO"], img: "animaisdomesticos/coelho.png" },
                { nome: "GALINHA", silabas: ["GA", "LI", "NHA"], img: "animaisdomesticos/galinha.png" },
                { nome: "GALO", silabas: ["GA", "LO"], img: "animaisdomesticos/galo.png" },
                { nome: "GATO", silabas: ["GA", "TO"], img: "animaisdomesticos/gato.png" },
                { nome: "OVELHA", silabas: ["O", "VE", "LHA"], img: "animaisdomesticos/ovelha.png" },
                { nome: "PATO", silabas: ["PA", "TO"], img: "animaisdomesticos/pato.png" },
                { nome: "PERU", silabas: ["PE", "RU"], img: "animaisdomesticos/peru.png" },
                { nome: "PORCO", silabas: ["POR", "CO"], img: "animaisdomesticos/porco.png" },
                { nome: "LEÃO", silabas: ["LE", "ÃO"], img: "animaisselvagens/leao.png" },
                { nome: "ZEBRA", silabas: ["ZE", "BRA"], img: "animaisselvagens/zebra.png" },
                { nome: "MACACO", silabas: ["MA", "CA", "CO"], img: "animaisselvagens/macaco.png" },
                { nome: "PANDA", silabas: ["PAN", "DA"], img: "animaisselvagens/panda.png" },
                { nome: "TIGRE", silabas: ["TI", "GRE"], img: "animaisselvagens/tigre.png" },
                { nome: "ELEFANTE", silabas: ["E", "LE", "FAN", "TE"], img: "animaisselvagens/elefante.png" }
            ]
        },
        frutos: {
            nome: "Frutos", exemplo: "BANANA", exemploImg: "frutas/banana.png", imgCapa: "frutas/maca.png",
            itens: [
                { nome: "AMORA", silabas: ["A", "MO", "RA"], img: "frutas/amora.png" },
                { nome: "ANANÁS", silabas: ["A", "NA", "NÁS"], img: "frutas/ananas.png" },
                { nome: "BANANA", silabas: ["BA", "NA", "NA"], img: "frutas/banana.png" },
                { nome: "CASTANHA", silabas: ["CAS", "TA", "NHA"], img: "frutas/castanha.png" },
                { nome: "CEREJA", silabas: ["CE", "RE", "JA"], img: "frutas/cereja.png" },
                { nome: "DIÓSPIRO", silabas: ["DI", "ÓS", "PI", "RO"], img: "frutas/diospiro.png" },
                { nome: "FIGO", silabas: ["FI", "GO"], img: "frutas/figo.png" },
                { nome: "GOIABA", silabas: ["GOI", "A", "BA"], img: "frutas/goiaba.png" },
                { nome: "KIWI", silabas: ["KI", "WI"], img: "frutas/kiwi.png" },
                { nome: "LARANJA", silabas: ["LA", "RAN", "JA"], img: "frutas/laranja.png" },
                { nome: "LIMÃO", silabas: ["LI", "MÃO"], img: "frutas/limao.png" },
                { nome: "MAÇÃ", silabas: ["MA", "ÇÃ"], img: "frutas/maca.png" },
                { nome: "MARACUJÁ", silabas: ["MA", "RA", "CU", "JÁ"], img: "frutas/maracuja.png" },
                { nome: "MELANCIA", silabas: ["ME", "LAN", "CI", "A"], img: "frutas/melancia.png" },
                { nome: "MELÃO", silabas: ["ME", "LÃO"], img: "frutas/melao.png" },
                { nome: "MORANGO", silabas: ["MO", "RAN", "GO"], img: "frutas/morango.png" },
                { nome: "PAPAIA", silabas: ["PA", "PAI", "A"], img: "frutas/papaia.png" },
                { nome: "PERA", silabas: ["PE", "RA"], img: "frutas/pera.png" },
                { nome: "ROMÃ", silabas: ["RO", "MÃ"], img: "frutas/roma.png" },
                { nome: "UVAS", silabas: ["U", "VAS"], img: "frutas/uvas.png" }
            ]
        },
        objetos: {
            nome: "Objetos", exemplo: "BONECA", exemploImg: "objetos/boneca.png", imgCapa: "objetos/bola.png",
            itens: [
                { nome: "ANEL", silabas: ["A", "NEL"], img: "objetos/anel.png" },
                { nome: "BALDE", silabas: ["BAL", "DE"], img: "objetos/balde.png" },
                { nome: "BOLA", silabas: ["BO", "LA"], img: "objetos/bola.png" },
                { nome: "BONECA", silabas: ["BO", "NE", "CA"], img: "objetos/boneca.png" },
                { nome: "CARRINHO", silabas: ["CA", "RRI", "NHO"], img: "objetos/carrinho.png" },
                { nome: "CESTO", silabas: ["CES", "TO"], img: "objetos/cesto.png" },
                { nome: "COLHER", silabas: ["CO", "LHER"], img: "objetos/colher.png" },
                { nome: "COPO", silabas: ["CO", "PO"], img: "objetos/copo.png" },
                { nome: "DADO", silabas: ["DA", "DO"], img: "objetos/dado.png" },
                { nome: "DEDAL", silabas: ["DE", "DAL"], img: "objetos/dedal.png" },
                { nome: "DRAGÃO", silabas: ["DRA", "GÃO"], img: "objetos/dragao.png" },
                { nome: "ESCOVA", silabas: ["ES", "CO", "VA"], img: "objetos/escova.png" },
                { nome: "GARFO", silabas: ["GAR", "FO"], img: "objetos/garfo.png" },
                { nome: "GARRAFA", silabas: ["GA", "RRA", "FA"], img: "objetos/garrafa.png" },
                { nome: "ISQUEIRO", silabas: ["IS", "QUEI", "RO"], img: "objetos/isqueiro.png" },
                { nome: "ÓCULOS", silabas: ["Ó", "CU", "LOS"], img: "objetos/oculos.png" },
                { nome: "PÁ", silabas: ["PÁ"], img: "objetos/pa.png" },
                { nome: "PANELA", silabas: ["PA", "NE", "LA"], img: "objetos/panela.png" },
                { nome: "PINCEL", silabas: ["PIN", "CEL"], img: "objetos/pincel.png" },
                { nome: "VASSOURA", silabas: ["VAS", "SOU", "RA"], img: "objetos/vassoura.png" },
                { nome: "VELA", silabas: ["VE", "LA"], img: "objetos/vela.png" }
            ]
        },
        material: {
            nome: "Material Escolar", exemplo: "MOCHILA", exemploImg: "materialescolar/mochila.png", imgCapa: "materialescolar/estojo.png",
            itens: [
                { nome: "AFIA", silabas: ["A", "FI", "A"], img: "materialescolar/afia.png" },
                { nome: "BORRACHA", silabas: ["BO", "RRA", "CHA"], img: "materialescolar/borracha.png" },
                { nome: "CADERNO", silabas: ["CA", "DER", "NO"], img: "materialescolar/caderno.png" },
                { nome: "CANETA", silabas: ["CA", "NE", "TA"], img: "materialescolar/caneta.png" },
                { nome: "CAPA", silabas: ["CA", "PA"], img: "materialescolar/capa.png" },
                { nome: "COLA", silabas: ["CO", "LA"], img: "materialescolar/cola.png" },
                { nome: "ESQUADRO", silabas: ["ES", "QUA", "DRO"], img: "materialescolar/esquadro.png" },
                { nome: "ESTOJO", silabas: ["ES", "TO", "JO"], img: "materialescolar/estojo.png" },
                { nome: "FOLHA", silabas: ["FO", "LHA"], img: "materialescolar/folha.png" },
                { nome: "LÁPIS", silabas: ["LÁ", "PIS"], img: "materialescolar/lapis.png" },
                { nome: "LIVRO", silabas: ["LI", "VRO"], img: "materialescolar/livro.png" },
                { nome: "MOCHILA", silabas: ["MO", "CHI", "LA"], img: "materialescolar/mochila.png" },
                { nome: "PINCEL", silabas: ["PIN", "CEL"], img: "materialescolar/pincel.png" },
                { nome: "RÉGUA", silabas: ["RÉ", "GUA"], img: "materialescolar/regua.png" },
                { nome: "TESOURA", silabas: ["TE", "SOU", "RA"], img: "materialescolar/tesoura.png" }
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
