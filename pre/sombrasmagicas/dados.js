// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre",  
    nomeJogo: "SOMBRAS MÁGICAS"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { 
        "pre": { 
            t1: "SOMBRAS", 
            t2: "MÁGICAS", 
            sub: "Perceção Visual | Pré-Escolar", 
            intro: "Consegues encontrar a sombra correta? Arrasta cada imagem para o seu par!", 
            rodape: "&copy; Pequenos Curiosos" 
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
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },
    categorias: {
        animais: {
            nome: "Animais",
            totalRondas: 5, // Quantas vezes o jogo muda as imagens
            itensPorRonda: 3, // Quantas sombras aparecem de cada vez
            imgCapa: "animaisselvagens/leao.png",
            itens: [
                { id: 1, img: "animaisselvagens/abelha.png" },
                { id: 2, img: "animaisselvagens/elefante.png" },
                { id: 3, img: "animaisselvagens/leao.png" },
                { id: 4, img: "animaisselvagens/macaco.png" },
                { id: 5, img: "animaisselvagens/girafa.png" },
                { id: 6, img: "animaisselvagens/zebra.png" },
                { id: 7, img: "animaisselvagens/hipopotamo.png" }
            ]
        },
        frutos: {
            nome: "Frutos",
            totalRondas: 5,
            itensPorRonda: 3,
            imgCapa: "frutas/maca.png",
            itens: [
                { id: 10, img: "frutas/morango.png" },
                { id: 11, img: "frutas/banana.png" },
                { id: 12, img: "frutas/maca.png" },
                { id: 13, img: "frutas/pera.png" },
                { id: 14, img: "frutas/uva.png" },
                { id: 15, img: "frutas/laranja.png" }
            ]
        },
        brinquedos: {
            nome: "Brinquedos",
            totalRondas: 5,
            itensPorRonda: 3,
            imgCapa: "objetos/bola.png",
            itens: [
                { id: 20, img: "objetos/bola.png" },
                { id: 21, img: "objetos/boneca.png" },
                { id: 22, img: "objetos/carrinho.png" },
                { id: 23, img: "objetos/ursinho.png" },
                { id: 24, img: "objetos/comboio.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque das sombras!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a praticar!", img: "taca_4.png" }
    ]
};
