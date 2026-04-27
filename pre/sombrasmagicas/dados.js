// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre",  
    nomeJogo: "CONTAR SÍLABAS"
};

// === DEFINIÇÃO DE CORES POR ÁREA (PADRÃO) ===
const BIBLIOTECA_TEMAS = {
    "portugues": { 
        corPagina: "#e9f0f8",       // Fundo da página
        corHeader: "#f0f7ff",       // Fundo do Header
        corContainer: "#e9f0f8",    // Fundo do Game-Container
        corCard: "#ffffff",         // Fundo do Game-Card
        bordaCard: "none",          // Borda do Game-Card
        sombraCard: "0 15px 35px rgba(176,196,217,0.5)", // Sombra do Card
        corEspacoJogo: "#ffffff",   // Fundo do src-game (Espaço do Jogo)
        bordaEspacoJogo: "3px dashed rgba(91, 164, 229, 0.4)", // Borda do Espaço do Jogo
        corPrimaria: "#5ba4e5",     // Azul principal
        corEscura: "#3d7db8",       // Azul escuro
        corTexto: "#5d7082",        // Cor do texto informativo
        voltarMobile: "voltar_az.png" 
    },
    "matematica": { 
        corPagina: "#e8f9f4",
        corHeader: "#f0fdfa",
        corContainer: "#e8f9f4",
        corCard: "#ffffff",
        bordaCard: "none",
        sombraCard: "0 15px 35px rgba(160,210,190,0.5)",
        corEspacoJogo: "#ffffff",
        bordaEspacoJogo: "3px dashed rgba(69, 207, 168, 0.4)",
        corPrimaria: "#45cfa8",
        corEscura: "#2BA886",
        corTexto: "#45cfa8",
        voltarMobile: "voltar_vr.png"
    },
    "estudo": { 
        corPagina: "#EAE2E5",
        corHeader: "#f7f3f4",
        corContainer: "#EAE2E5",
        corCard: "#ffffff",
        bordaCard: "none",
        sombraCard: "0 15px 35px rgba(180,160,170,0.5)",
        corEspacoJogo: "#ffffff",
        bordaEspacoJogo: "3px dashed rgba(153, 77, 77, 0.4)",
        corPrimaria: "#994D4D",
        corEscura: "#6C3737",
        corTexto: "#994D4D",
        voltarMobile: "voltar_cs.png"
    },
    "pre": { 
        corPagina: "#FFF5F7",
        corHeader: "#fff0f3",
        corContainer: "#FFF5F7",
        corCard: "#ffffff",
        bordaCard: "none",
        sombraCard: "0 15px 35px rgba(230,180,190,0.5)",
        corEspacoJogo: "#ffffff",
        bordaEspacoJogo: "3px dashed rgba(230, 145, 167, 0.4)",
        corPrimaria: "#E691A7",
        corEscura: "#D54267",
        corTexto: "#E691A7",
        voltarMobile: "voltar_rs.png"
    }
};

// === CONTEÚDO E CUSTOMIZAÇÃO POR ANO/ÁREA ===
const BIBLIOTECA_CONTEUDO = {
    "pre": {
        "pre": { 
            t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", 
            rodape: "&copy; Pequenos Curiosos",
            // Podes sobrescrever as cores do tema aqui se quiseres:
            corCard: "#ffffff",
            bordaCard: "4px solid #E691A7"
        }
    },
    "ano1": {
        "portugues": { 
            t1: "PEQUENOS", t2: "LEITORES", sub: "Português | 1º Ano", rodape: "&copy; Pequenos Leitores",
            corEspacoJogo: "#ffffff",
            bordaEspacoJogo: "3px dashed #5ba4e5"
        },
        "matematica": { 
            t1: "PEQUENOS", t2: "MATEMÁTICOS", sub: "Matemática | 1º Ano", rodape: "&copy; Pequenos Matemáticos" 
        },
        "estudo": { 
            t1: "PEQUENOS", t2: "EXPLORADORES", sub: "Estudo do Meio | 1º Ano", rodape: "&copy; Pequenos Exploradores" 
        }
    },
    "ano2": {
        "portugues": { 
            t1: "JOVENS", t2: "LEITORES", sub: "Português | 2º Ano", rodape: "&copy; Jovens Leitores" 
        },
        "matematica": { 
            t1: "JOVENS", t2: "MATEMÁTICOS", sub: "Matemática | 2º Ano", rodape: "&copy; Jovens Matemáticos" 
        },
        "estudo": { 
            t1: "JOVENS", t2: "INVESTIGADORES", sub: "Estudo do Meio | 2º Ano", rodape: "&copy; Jovens Investigadores" 
        }
    },
    "ano3": {
        "portugues": { 
            t1: "MESTRES", t2: "DA LÍNGUA", sub: "Português | 3º Ano", rodape: "&copy; Mestres da Língua" 
        },
        "matematica": { 
            t1: "MESTRES", t2: "DO CÁLCULO", sub: "Matemática | 3º Ano", rodape: "&copy; Mestres do Cálculo" 
        },
        "estudo": { 
            t1: "GRANDES", t2: "CIENTISTAS", sub: "Estudo do Meio | 3º Ano", rodape: "&copy; Grandes Cientistas" 
        }
    },
    "ano4": {
        "portugues": { 
            t1: "GURU", t2: "DAS LETRAS", sub: "Português | 4º Ano", rodape: "&copy; Guru das Letras" 
        },
        "matematica": { 
            t1: "GURU", t2: "DOS NÚMEROS", sub: "Matemática | 4º Ano", rodape: "&copy; Guru dos Números" 
        },
        "estudo": { 
            t1: "GURU", t2: "DO MUNDO", sub: "Estudo do Meio | 4º Ano", rodape: "&copy; Guru do Mundo" 
        }
    }
};

// === CONFIGURAÇÕES GERAIS DO JOGO ===
const JOGO_CONFIG = {
    linkVoltar: "../../",
    textoVoltar: "VOLTAR",
    caminhoImg: "../../img/",    
    caminhoIcons: "../../icons/", 
    
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },

    iconesMenu: { 
        home: "home.png", 
        pre: "iconpre.png", 
        ano1: "icon1.png", 
        ano2: "icon2.png", 
        ano3: "icon3.png", 
        ano4: "icon4.png" 
    },

    links: { 
        home: "/jogos", 
        pre: "/jogos/pre", 
        ano1: "/jogos/1", 
        ano2: "/jogos/2", 
        ano3: "/jogos/3", 
        ano4: "/jogos/4" 
    },
    
    categorias: JOGO_CATEGORIAS,

    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};
