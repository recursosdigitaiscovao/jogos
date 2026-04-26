const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "portugues",  
    nomeJogo: "JOGO DA MEMÓRIA"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", intro: "Encontra os pares de cartas!", rodape: "&copy; Pequenos Curiosos" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", intro: "Encontra os pares de cartas!", rodape: "&copy; Pequenos Leitores" }
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
    niveis: {
        1: { nome: "Nível 1", cartas: 6, colunas: 3 },
        2: { nome: "Nível 2", cartas: 8, colunas: 4 },
        3: { nome: "Nível 3", cartas: 12, colunas: 4 }
    },
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },
    categorias: {
        animais: {
            nome: "Animais", imgCapa: "animaisdomesticos/cao.png",
            itens: [
                { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "GATO", img: "animaisdomesticos/gato.png" }, { nome: "COELHO", img: "animaisdomesticos/coelho.png" }, { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" }, { nome: "BALEIA", img: "animaisselvagens/baleia.png" }, { nome: "LEÃO", img: "animaisselvagens/leao.png" }, { nome: "PANDA", img: "animaisselvagens/panda.png" }, { nome: "ZEBRA", img: "animaisselvagens/zebra.png" }
            ]
        },
        frutas: {
            nome: "Frutas", imgCapa: "frutas/maca.png",
            itens: [
                { nome: "MAÇÃ", img: "frutas/maca.png" }, { nome: "BANANA", img: "frutas/banana.png" }, { nome: "UVA", img: "frutas/uva.png" }, { nome: "CEREJA", img: "frutas/cereja.png" }, { nome: "ANANÁS", img: "frutas/ananas.png" }, { nome: "AMORA", img: "frutas/amora.png" }, { nome: "KIWI", img: "frutas/kiwi.png" }, { nome: "PERA", img: "frutas/pera.png" }
            ]
        },
        escola: {
            nome: "Escolar", imgCapa: "materialescolar/borracha.png",
            itens: [
                { nome: "BORRACHA", img: "materialescolar/borracha.png" }, { nome: "CADERNO", img: "materialescolar/caderno.png" }, { nome: "CANETA", img: "materialescolar/caneta.png" }, { nome: "LÁPIS", img: "materialescolar/lapis.png" }, { nome: "RÉGUA", img: "materialescolar/regua.png" }, { nome: "AFIA", img: "materialescolar/afia.png" }, { nome: "TESOURA", img: "materialescolar/tesoura.png" }, { nome: "MOCHILA", img: "materialescolar/mochila.png" }
            ]
        },
        letras: {
            nome: "Letras", imgCapa: "letras/letra_a.png",
            itens: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(l => ({ nome: l, img: `letras/letra_${l.toLowerCase()}.png` }))
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 0, max: 69, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};
