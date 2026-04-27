// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre",  
    nomeJogo: "SOMBRAS MÁGICAS"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corHeader: "#ffffff", corContainer: "#ffffff", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corHeader: "#ffffff", corContainer: "#ffffff", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corHeader: "#ffffff", corContainer: "#ffffff", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corHeader: "#ffffff", corContainer: "#ffffff", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" } },
    "ano1": {
        "portugues": { t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", rodape: "&copy; Pequenos Leitores - Recursos Educativos" },
        "matematica": { t1: "PEQUENOS", t2: "MATEMÁTICOS", sub: "Matemática | 1º Ano", rodape: "&copy; Pequenos Matemáticos - Recursos Educativos" },
        "estudo": { t1: "PEQUENOS", t2: "EXPLORADORES", sub: "Estudo do Meio | 1º Ano", rodape: "&copy; Pequenos Exploradores - Recursos Educativos" }
    },
    "ano2": {
        "portugues": { t1: "JOVENS", t2: "LEITORES", sub: "Português | 2º Ano", rodape: "&copy; Jovens Leitores - Recursos Educativos" },
        "matematica": { t1: "JOVENS", t2: "MATEMÁTICOS", sub: "Matemática | 2º Ano", rodape: "&copy; Jovens Matemáticos - Recursos Educativos" },
        "estudo": { t1: "JOVENS", t2: "EXPLORADORES", sub: "Estudo do Meio | 2º Ano", rodape: "&copy; Jovens Investigadores - Recursos Educativos" }
    },
    "ano3": {
        "portugues": { t1: "SUPER", t2: "LEITORES", sub: "Português | 3º Ano", rodape: "&copy; Super Leitores - Recursos Educativos" },
        "matematica": { t1: "SUPER", t2: "MATEMÁTICOS", sub: "Matemática | 3º Ano", rodape: "&copy; Super Matemáticos - Recursos Educativos" },
        "estudo": { t1: "SUPER", t2: "EXPLORADORES", sub: "Estudo do Meio | 3º Ano", rodape: "&copy; Super Exploradores - Recursos Educativos" }
    },
    "ano4": {
        "portugues": { t1: "MESTRES", t2: "LEITORES", sub: "Português | 4º Ano", rodape: "&copy; Mestres Leitores - Recursos Educativos" },
        "matematica": { t1: "MESTRES", t2: "MATEMÁTICOS", sub: "Matemática | 4º Ano", rodape: "&copy; Mestres Matemáticos - Recursos Educativos" },
        "estudo": { t1: "MESTRES", t2: "EXPLORADORES", sub: "Estudo do Meio | 4º Ano", rodape: "&copy; Mestres Exploradores - Recursos Educativos" }
    }
};

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
    categorias: {} // Ficará vazio e será preenchido pelo categorias.js
};
