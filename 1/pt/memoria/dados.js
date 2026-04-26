const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "portugues",  
    nomeJogo: "JOGO DE MEMÓRIA"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", intro: "Encontra o par: a imagem e a palavra correta!", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", intro: "Consegues memorizar onde estão os pares de imagens e nomes?", rodape: "&copy; Pequenos Leitores" }
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
        virar: "https://cdn.pixabay.com/audio/2022/03/15/audio_731454522a.mp3" // som de virar carta
    },
    
    // Configuração de Níveis pedida
    niveis: {
        1: { nome: "Fácil", cartas: 6, pares: 3, rondas: 10 },
        2: { nome: "Médio", cartas: 8, pares: 4, rondas: 10 },
        3: { nome: "Difícil", cartas: 12, pares: 6, rondas: 10 }
    },

    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },
    
    categorias: {
        animais: {
            nome: "Animais", pastaImg: "animais", 
            itens: [
                { nome: "BURRO", img: "burro.png" }, { nome: "CABRA", img: "cabra.png" }, { nome: "CÃO", img: "cao.png" }, 
                { nome: "CAVALO", img: "cavalo.png" }, { nome: "COELHO", img: "coelho.png" }, { nome: "GALINHA", img: "galinha.png" }, 
                { nome: "GALO", img: "galo.png" }, { nome: "GATO", img: "gato.png" }, { nome: "OVELHA", img: "ovelha.png" }, 
                { nome: "PATO", img: "pato.png" }, { nome: "PERU", img: "peru.png" }, { nome: "PORCO", img: "porco.png" }, 
                { nome: "LEÃO", img: "leao.png" }, { nome: "ZEBRA", img: "zebra.png" }, { nome: "MACACO", img: "macaco.png" }
            ]
        },
        frutos: {
            nome: "Frutos", pastaImg: "frutas",
            itens: [
                { nome: "AMORA", img: "amora.png" }, { nome: "ANANÁS", img: "ananas.png" }, { nome: "BANANA", img: "banana.png" }, 
                { nome: "CEREJA", img: "cereja.png" }, { nome: "FIGO", img: "figo.png" }, { nome: "GOIABA", img: "goiaba.png" }, 
                { nome: "KIWI", img: "kiwi.png" }, { nome: "LARANJA", img: "laranja.png" }, { nome: "LIMÃO", img: "limao.png" }, 
                { nome: "MAÇÃ", img: "maca.png" }, { nome: "MORANGO", img: "morango.png" }, { nome: "PERA", img: "pera.png" }
            ]
        },
        objetos: {
            nome: "Objetos", pastaImg: "objetos",
            itens: [
                { nome: "ANEL", img: "anel.png" }, { nome: "BALDE", img: "balde.png" }, { nome: "BOLA", img: "bola.png" }, 
                { nome: "BONECA", img: "boneca.png" }, { nome: "CARRINHO", img: "carrinho.png" }, { nome: "CESTO", img: "cesto.png" }, 
                { nome: "COLHER", img: "colher.png" }, { nome: "COPO", img: "copo.png" }, { nome: "DADO", img: "dado.png" }, 
                { nome: "ÓCULOS", img: "oculos.png" }, { nome: "PANELA", img: "panela.png" }, { nome: "VELA", img: "vela.png" }
            ]
        },
        material: {
            nome: "Material Escolar", pastaImg: "materialescolar",
            itens: [
                { nome: "AFIA", img: "afia.png" }, { nome: "BORRACHA", img: "borracha.png" }, { nome: "CADERNO", img: "caderno.png" }, 
                { nome: "CANETA", img: "caneta.png" }, { nome: "COLA", img: "cola.png" }, { nome: "ESTOJO", img: "estojo.png" }, 
                { nome: "FOLHA", img: "folha.png" }, { nome: "LÁPIS", img: "lapis.png" }, { nome: "LIVRO", img: "livro.png" }, 
                { nome: "MOCHILA", img: "mochila.png" }, { nome: "RÉGUA", img: "regua.png" }, { nome: "TESOURA", img: "tesoura.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque da memória!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Bom esforço!", img: "taca_3.png" },
        { min: 0, max: 49, titulo: "Continua a praticar!", img: "taca_4.png" }
    ]
};
