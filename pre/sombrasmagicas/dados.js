// === 1. CONFIGURAÇÃO ATIVA ===
const CONFIG_MESTRE = {
    ano: "pre",        // pre, ano1, ano2, ano3, ano4
    area: "pre",  // pre, portugues, matematica, estudo
    nomeJogo: "SOMBRAS MÁGICAS"
};

// === 2. TEMAS POR ÁREA (Cores e Ícones) ===
const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", voltarMobile: "voltar_vr.png" },
    "estudo":     { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", voltarMobile: "voltar_cs.png" },
    "pre":        { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", voltarMobile: "voltar_rs.png" }
};

// === 3. CONTEÚDO POR ANO E ÁREA (Títulos e Textos) ===
const BIBLIOTECA_CONTEUDO = {
    "pre": {
        "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Pré-Escolar" }
    },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano" },
        "matematica": { t1: "PEQUENOS", t2: "MATEMÁTICOS", sub: "Matemática | 1º Ano" },
        "estudo": { t1: "PEQUENOS", t2: "EXPLORADORES", sub: "Estudo do Meio | 1º Ano" }
    },
    "ano2": {
        "portugues": { t1: "JOVENS", t2: "LEITORES", sub: "Português | 2º Ano" },
        "matematica": { t1: "JOVENS", t2: "MATEMÁTICOS", sub: "Matemática | 2º Ano" },
        "estudo": { t1: "JOVENS", t2: "EXPLORADORES", sub: "Estudo do Meio | 2º Ano" }
    },
    "ano3": {
        "portugues": { t1: "SUPER", t2: "LEITORES", sub: "Português | 3º Ano" },
        "matematica": { t1: "SUPER", t2: "MATEMÁTICOS", sub: "Matemática | 3º Ano" },
        "estudo": { t1: "SUPER", t2: "EXPLORADORES", sub: "Estudo do Meio | 3º Ano" }
    },
    "ano4": {
        "portugues": { t1: "MESTRES", t2: "LEITORES", sub: "Português | 4º Ano" },
        "matematica": { t1: "MESTRES", t2: "MATEMÁTICOS", sub: "Matemática | 4º Ano" },
        "estudo": { t1: "MESTRES", t2: "EXPLORADORES", sub: "Estudo do Meio | 4º Ano" }
    }
};

// === 4. CONFIGURAÇÕES GERAIS ===
const JOGO_CONFIG = {
    linkVoltar: "../",
    textoVoltar: "VOLTAR",
    caminhoImg: "../../img/",    
    caminhoIcons: "../../icons/", 
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a tentar!", img: "taca_4.png" }
    ],
    categorias: {} 
};
