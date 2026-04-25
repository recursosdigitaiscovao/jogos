const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "portugues",  
    nomeJogo: "JOGO DA FORCA"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", intro: "Adivinha a palavra antes que os balões rebentem!", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", intro: "Escolhe as letras para salvar os balões!", rodape: "&copy; Pequenos Leitores" }
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
                { nome: "BURRO" }, { nome: "CABRA" }, { nome: "CÃO" }, { nome: "CAVALO" },
                { nome: "COELHO" }, { nome: "GALINHA" }, { nome: "GALO" }, { nome: "GATO" },
                { nome: "OVELHA" }, { nome: "PATO" }, { nome: "PERU" }, { nome: "PORCO" },
                { nome: "LEÃO" }, { nome: "ZEBRA" }, { nome: "MACACO" }, { nome: "PANDA" },
                { nome: "TIGRE" }, { nome: "ELEFANTE" }, { nome: "ABELHA" }, { nome: "ÁGUIA" },
                { nome: "ARANHA" }, { nome: "BALEIA" }, { nome: "CANGURU" }, { nome: "COALA" },
                { nome: "CROCODILO" }, { nome: "FOCA" }, { nome: "GORILA" }, { nome: "PAPAGAIO" }
            ]
        },
        frutos: {
            nome: "Frutos", exemplo: "BANANA", exemploImg: "frutas/banana.png", imgCapa: "frutas/maca.png",
            itens: [
                { nome: "AMORA" }, { nome: "ANANÁS" }, { nome: "BANANA" }, { nome: "CASTANHA" },
                { nome: "CEREJA" }, { nome: "DIÓSPIRO" }, { nome: "FIGO" }, { nome: "GOIABA" },
                { nome: "KIWI" }, { nome: "LARANJA" }, { nome: "LIMÃO" }, { nome: "MAÇÃ" },
                { nome: "MARACUJÁ" }, { nome: "MELANCIA" }, { nome: "MELÃO" }, { nome: "MORANGO" },
                { nome: "PAPAIA" }, { nome: "PERA" }, { nome: "ROMÃ" }, { nome: "UVAS" }
            ]
        },
        objetos: {
            nome: "Objetos", exemplo: "BONECA", exemploImg: "objetos/boneca.png", imgCapa: "objetos/bola.png",
            itens: [
                { nome: "ANEL" }, { nome: "BALDE" }, { nome: "BOLA" }, { nome: "BONECA" },
                { nome: "CARRINHO" }, { nome: "CESTO" }, { nome: "COLHER" }, { nome: "COPO" },
                { nome: "DADO" }, { nome: "DEDAL" }, { nome: "DRAGÃO" }, { nome: "ESCOVA" },
                { nome: "GARFO" }, { nome: "GARRAFA" }, { nome: "ISQUEIRO" }, { nome: "ÓCULOS" },
                { nome: "PÁ" }, { nome: "PANELA" }, { nome: "PINCEL" }, { nome: "VASSOURA" },
                { nome: "VELA" }
            ]
        },
        material: {
            nome: "Material Escolar", exemplo: "MOCHILA", exemploImg: "materialescolar/mochila.png", imgCapa: "materialescolar/estojo.png",
            itens: [
                { nome: "AFIA" }, { nome: "BORRACHA" }, { nome: "CADERNO" }, { nome: "CANETA" },
                { nome: "CAPA" }, { nome: "COLA" }, { nome: "ESQUADRO" }, { nome: "ESTOJO" },
                { nome: "FOLHA" }, { nome: "LÁPIS" }, { nome: "LIVRO" }, { nome: "MOCHILA" },
                { nome: "PINCEL" }, { nome: "RÉGUA" }, { nome: "TESOURA" }
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
