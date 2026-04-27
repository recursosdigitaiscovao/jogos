// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre",  
    nomeJogo: "CONTAR SÍLABAS"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { 
        corPagina: "#e9f0f8",    // Fundo da página
        corPrimaria: "#5ba4e5",  // Azul principal
        corEscura: "#3d7db8",    // Azul escuro (sombras/hover)
        corTexto: "#5d7082",     // Cor do texto
        voltarMobile: "voltar_az.png" 
    },
    "matematica": { 
        corPagina: "#e8f9f4",    // Verde água
        corPrimaria: "#45cfa8",  // Verde principal
        corEscura: "#2BA886",    // Verde escuro
        corTexto: "#45cfa8",
        voltarMobile: "voltar_vr.png"
    },
    "estudo": { 
        corPagina: "#EAE2E5",    // Castanho/Cinza claro
        corPrimaria: "#994D4D",  // Castanho principal
        corEscura: "#6C3737",    // Castanho escuro
        corTexto: "#994D4D",
        voltarMobile: "voltar_cs.png"
    },
    "pre": { 
        corPagina: "#FFF5F7",    // Rosa claro
        corPrimaria: "#E691A7",  // Rosa principal
        corEscura: "#D54267",    // Rosa escuro
        corTexto: "#E691A7",
        voltarMobile: "voltar_rs.png"
    }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": {
        "pre": { 
            t1: "PEQUENOS", 
            t2: "CURIOSOS", 
            sub: "Atividades | Pré-Escolar", 
            intro: "Brinca com os números e as cores!", 
            rodape: "&copy; Pequenos Curiosos" 
        }
    },
    "ano1": {
        "portugues": { 
            t1: "PEQUENOS", 
            t2: "LEITORES", 
            sub: "Português | 1º Ano", 
            intro: "Clica no número que corresponde à quantidade de sílabas!", 
            rodape: "&copy; Pequenos Leitores" 
        },
        "matematica": { 
            t1: "PEQUENOS", 
            t2: "MATEMÁTICOS", 
            sub: "Matemática | 1º Ano", 
            intro: "Explora os números e diverte-te!", 
            rodape: "&copy; Pequenos Matemáticos" 
        },
        "estudo": { 
            t1: "PEQUENOS", 
            t2: "EXPLORADORES", 
            sub: "Estudo do Meio | 1º Ano", 
            intro: "Explora o mundo à tua volta!", 
            rodape: "&copy; Pequenos Exploradores" 
        }
    },
    "ano2": {
        "portugues": { 
            t1: "JOVENS", 
            t2: "LEITORES", 
            sub: "Português | 2º Ano", 
            intro: "Explora as palavras e a leitura!", 
            rodape: "&copy; Jovens Leitores" 
        },
        "matematica": { 
            t1: "JOVENS", 
            t2: "MATEMÁTICOS", 
            sub: "Matemática | 2º Ano", 
            intro: "Diverte-te com os cálculos!", 
            rodape: "&copy; Jovens Matemáticos" 
        },
        "estudo": { 
            t1: "JOVENS", 
            t2: "INVESTIGADORES", 
            sub: "Estudo do Meio | 2º Ano", 
            intro: "Investiga o mundo!", 
            rodape: "&copy; Jovens Investigadores" 
        }
    },
    "ano3": {
        "portugues": { 
            t1: "MESTRES", 
            t2: "DA LÍNGUA", 
            sub: "Português | 3º Ano", 
            intro: "Explora a gramática e a escrita!", 
            rodape: "&copy; Mestres da Língua" 
        },
        "matematica": { 
            t1: "MESTRES", 
            t2: "DO CÁLCULO", 
            sub: "Matemática | 3º Ano", 
            intro: "Resolve desafios matemáticos!", 
            rodape: "&copy; Mestres do Cálculo" 
        },
        "estudo": { 
            t1: "GRANDES", 
            t2: "CIENTISTAS", 
            sub: "Estudo do Meio | 3º Ano", 
            intro: "Descobre a ciência e a história!", 
            rodape: "&copy; Grandes Cientistas" 
        }
    },
    "ano4": {
        "portugues": { 
            t1: "GURU", 
            t2: "DAS LETRAS", 
            sub: "Português | 4º Ano", 
            intro: "Aperfeiçoa a tua leitura e escrita!", 
            rodape: "&copy; Guru das Letras" 
        },
        "matematica": { 
            t1: "GURU", 
            t2: "DOS NÚMEROS", 
            sub: "Matemática | 4º Ano", 
            intro: "Domina os números e a geometria!", 
            rodape: "&copy; Guru dos Números" 
        },
        "estudo": { 
            t1: "GURU", 
            t2: "DO MUNDO", 
            sub: "Estudo do Meio | 4º Ano", 
            intro: "Investiga o mundo e a sociedade!", 
            rodape: "&copy; Guru do Mundo" 
        }
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
        { 
            min: 90, max: 100, 
            titulo: "És um craque!", 
            img: "taca_1.png" 
        },
        { 
            min: 70, max: 89, 
            titulo: "Muito bem!", 
            img: "taca_2.png" 
        },
        { 
            min: 50, max: 69, 
            titulo: "Estás quase lá!", 
            img: "taca_2.png" 
        },
        { 
            min: 0, max: 49, 
            titulo: "Continua a tentar!", 
            img: "taca_4.png" 
        }
    ]
};
