// =============================================================
// ESTRUTURA DO JOGO - NÃO ALTERAR NOMES DAS CHAVES (KEYS)
// =============================================================

// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre",  
    nomeJogo: "CONTAR SÍLABAS"
};

// === BIBLIOTECA DE ESTILOS (Agora com suporte a Header e Container) ===
const BIBLIOTECA_TEMAS = {
    "portugues": { 
        corPagina: "#e9f0f8", 
        corHeader: "#ffffff",    // Cor do fundo do topo
        corContainer: "#ffffff", // Cor da bolha central do jogo
        corPrimaria: "#5ba4e5", 
        corEscura: "#3d7db8", 
        corTexto: "#5d7082", 
        voltarMobile: "voltar_az.png" 
    },
    "matematica": { 
        corPagina: "#e8f9f4", 
        corHeader: "#ffffff", 
        corContainer: "#ffffff",
        corPrimaria: "#45cfa8", 
        corEscura: "#2BA886", 
        corTexto: "#45cfa8", 
        voltarMobile: "voltar_vr.png" 
    },
    "estudo": { 
        corPagina: "#EAE2E5", 
        corHeader: "#ffffff", 
        corContainer: "#ffffff",
        corPrimaria: "#994D4D", 
        corEscura: "#6C3737", 
        corTexto: "#994D4D", 
        voltarMobile: "voltar_cs.png" 
    },
    "pre": { 
        corPagina: "#FFF5F7", 
        corHeader: "#ffffff", 
        corContainer: "#ffffff",
        corPrimaria: "#E691A7", 
        corEscura: "#D54267", 
        corTexto: "#E691A7", 
        voltarMobile: "voltar_rs.png" 
    }
};

// === BIBLIOTECA de TEXTOS (Conforme o teu modelo, sem intros) ===
const BIBLIOTECA_CONTEUDO = {
    "pre": { 
        "pre": { t1: "PEQUENOS", t2: "CURIOSOS", sub: "Atividades | Pré-Escolar", rodape: "&copy; Pequenos Curiosos - Recursos Educativos" } 
    },
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

// === CONFIGURAÇÃO DO JOGO (CONTEÚDO NÃO EDITÁVEL) ===
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

   // === CONFIGURAÇÃO DAS CATEGORIAS (ADAPTADAS PARA CORRESPONDÊNCIA DE SOMBRAS) ===
    
    categorias: {
        animais: {
            nome: "Sombras: Animais", 
            exemplo: "LEÃO", 
            exemploImg: "animaisselvagens/leao.png", 
            total: 14, 
            imgCapa: "animaisselvagens/leao.png",
            itens: [
                { nome: "ABELHA", silabas: 1, img: "animaisselvagens/abelha.png" },
                { nome: "ÁGUIA", silabas: 1, img: "animaisselvagens/aguia.png" },
                { nome: "ARANHA", silabas: 1, img: "animaisselvagens/aranha.png" },
                { nome: "BALEIA", silabas: 1, img: "animaisselvagens/baleia.png" },
                { nome: "CANGURU", silabas: 1, img: "animaisselvagens/canguru.png" },
                { nome: "CARANGUEIJO", silabas: 1, img: "animaisselvagens/carangueijo.png" },
                { nome: "COALA", silabas: 1, img: "animaisselvagens/coala.png" },
                { nome: "CROCODILO", silabas: 1, img: "animaisselvagens/crocodilo.png" },
                { nome: "ELEFANTE", silabas: 1, img: "animaisselvagens/elefante.png" },
                { nome: "FOCA", silabas: 1, img: "animaisselvagens/foca.png" },
                { nome: "GORILA", silabas: 1, img: "animaisselvagens/gorila.png" },
                { nome: "LEÃO", silabas: 1, img: "animaisselvagens/leao.png" },
                { nome: "MACACO", silabas: 1, img: "animaisselvagens/macaco.png" },
                { nome: "PAPAGAIO", silabas: 1, img: "animaisselvagens/papagaio.png" }
            ]
        },
        frutos: {
            nome: "Sombras: Frutos", 
            exemplo: "MORANGO", 
            exemploImg: "frutas/morango.png", 
            total: 16, 
            imgCapa: "frutas/maca.png",
            itens: [
                { nome: "AMORA", silabas: 1, img: "frutas/amora.png" },
                { nome: "ANANÁS", silabas: 1, img: "frutas/ananas.png" },
                { nome: "BANANA", silabas: 1, img: "frutas/banana.png" },
                { nome: "CASTANHA", silabas: 1, img: "frutas/castanha.png" },
                { nome: "CEREJA", silabas: 1, img: "frutas/cereja.png" },
                { nome: "DIÓSPIRO", silabas: 1, img: "frutas/diospiro.png" },
                { nome: "FIGO", silabas: 1, img: "frutas/figo.png" },
                { nome: "GOIABA", silabas: 1, img: "frutas/goiaba.png" },
                { nome: "KIWI", silabas: 1, img: "frutas/kiwi.png" },
                { nome: "LARANJA", silabas: 1, img: "frutas/laranja.png" },
                { nome: "LIMÃO", silabas: 1, img: "frutas/limao.png" },
                { nome: "MAÇÃ", silabas: 1, img: "frutas/maca.png" },
                { nome: "MARACUJÁ", silabas: 1, img: "frutas/maracuja.png" },
                { nome: "MELANCIA", silabas: 1, img: "frutas/melancia.png" },
                { nome: "MELÃO", silabas: 1, img: "frutas/melao.png" },
                { nome: "MORANGO", silabas: 1, img: "frutas/morango.png" }
            ]
        },
        objetos: {
            nome: "Sombras: Objetos", 
            exemplo: "BOLA", 
            exemploImg: "objetos/bola.png", 
            total: 15, 
            imgCapa: "objetos/bola.png",
            itens: [
                { nome: "BALDE", silabas: 1, img: "objetos/balde.png" },
                { nome: "BOLA", silabas: 1, img: "objetos/bola.png" },
                { nome: "BONECA", silabas: 1, img: "objetos/boneca.png" },
                { nome: "CARRINHO", silabas: 1, img: "objetos/carrinho.png" },
                { nome: "CESTO", silabas: 1, img: "objetos/cesto.png" },
                { nome: "COLHER", silabas: 1, img: "objetos/colher.png" },
                { nome: "COPO", silabas: 1, img: "objetos/copo.png" },
                { nome: "DADO", silabas: 1, img: "objetos/dado.png" },
                { nome: "DEDAL", silabas: 1, img: "objetos/dedal.png" },
                { nome: "DRAGÃO", silabas: 1, img: "objetos/dragao.png" },
                { nome: "ESCOVA", silabas: 1, img: "objetos/escova.png" },
                { nome: "GARFO", silabas: 1, img: "objetos/garfo.png" },
                { nome: "GARRAFA", silabas: 1, img: "objetos/garrafa.png" },
                { nome: "ISQUEIRO", silabas: 1, img: "objetos/isqueiro.png" },
                { nome: "ÓCULOS", silabas: 1, img: "objetos/oculos.png" }
            ]
        },
        material: {
            nome: "Sombras: Material", 
            exemplo: "MOCHILA", 
            exemploImg: "materialescolar/mochila.png", 
            total: 15, 
            imgCapa: "materialescolar/estojo.png",
            itens: [
                { nome: "AFIA", silabas: 1, img: "materialescolar/afia.png" },
                { nome: "BORRACHA", silabas: 1, img: "materialescolar/borracha.png" },
                { nome: "CADERNO", silabas: 1, img: "materialescolar/caderno.png" },
                { nome: "CANETA", silabas: 1, img: "materialescolar/caneta.png" },
                { nome: "CAPA", silabas: 1, img: "materialescolar/capa.png" },
                { nome: "COLA", silabas: 1, img: "materialescolar/cola.png" },
                { nome: "ESQUADRO", silabas: 1, img: "materialescolar/esquadro.png" },
                { nome: "ESTOJO", silabas: 1, img: "materialescolar/estojo.png" },
                { nome: "FOLHA", silabas: 1, img: "materialescolar/folha.png" },
                { nome: "LÁPIS", silabas: 1, img: "materialescolar/lapis.png" },
                { nome: "LIVRO", silabas: 1, img: "materialescolar/livro.png" },
                { nome: "MOCHILA", silabas: 1, img: "materialescolar/mochila.png" },
                { nome: "PINCEL", silabas: 1, img: "materialescolar/pincel.png" },
                { nome: "RÉGUA", silabas: 1, img: "materialescolar/regua.png" },
                { nome: "TESOURA", silabas: 1, img: "materialescolar/tesoura.png" }
            ]
        }
    }
};

    // === CONFIGURAÇÃO DO RELATÓRIO (CONTEÚDO NÃO EDITÁVEL) ===
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};
