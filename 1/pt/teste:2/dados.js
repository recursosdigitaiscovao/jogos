const JOGO_CONFIG = {
    nomeJogo: "CONTAR SÍLABAS", 
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",    // Onde está o rd.png e fotos das categorias
    caminhoIcons: "../../../icons/", // Onde estão as taças e ícones de navegação
    caminhoSom: "", 
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },
    textos: {
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        instrucao: "Clica no número que corresponde à quantidade de sílabas da palavra!",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos"
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
    categorias: {
        animais: {
            nome: "Animais",
            imgCapa: "animaisdomesticos/gato.png",
            itens: [
                { nome: "VACA", silabas: 2, img: "animaisdomesticos/vaca.png" },
                { nome: "GATO", silabas: 2, img: "animaisdomesticos/gato.png" },
                { nome: "PATO", silabas: 2, img: "animaisdomesticos/pato.png" },
                { nome: "PERU", silabas: 2, img: "animaisdomesticos/peru.png" },
                { nome: "CÃO", silabas: 1, img: "animaisdomesticos/cao.png" },
                { nome: "CAVALO", silabas: 3, img: "animaisdomesticos/cavalo.png" },
                { nome: "BURRO", silabas: 2, img: "animaisdomesticos/burro.png" },
                { nome: "GALINHA", silabas: 3, img: "animaisdomesticos/galinha.png" },
                { nome: "COELHO", silabas: 3, img: "animaisdomesticos/coelho.png" }
            ]
        },
        frutos: {
            nome: "Frutos",
            imgCapa: "frutas/morango.png",
            itens: [
                { nome: "BANANA", silabas: 3, img: "frutas/banana.png" },
                { nome: "CEREJA", silabas: 3, img: "frutas/cereja.png" },
                { nome: "UVAS", silabas: 2, img: "frutas/uvas.png" },
                { nome: "MORANGO", silabas: 3, img: "frutas/morango.png" },
                { nome: "MELANCIA", silabas: 4, img: "frutas/melancia.png" },
                { nome: "LARANJA", silabas: 3, img: "frutas/laranja.png" },
                { nome: "PAPAIA", silabas: 3, img: "frutas/papaia.png" },
                { nome: "MAÇÃ", silabas: 2, img: "frutas/maca.png" }
            ]
        },
        material: {
            nome: "Material Escolar",
            imgCapa: "materialescolar/afia.png",
            itens: [
                { nome: "MOCHILA", silabas: 3, img: "materialescolar/mochila.png" },
                { nome: "TESOURA", silabas: 3, img: "materialescolar/tesoura.png" },
                { nome: "LÁPIS", silabas: 2, img: "materialescolar/lapis.png" },
                { nome: "LIVRO", silabas: 2, img: "materialescolar/livro.png" },
                { nome: "AFIA", silabas: 2, img: "materialescolar/afia.png" },
                { nome: "CANETA", silabas: 3, img: "materialescolar/caneta.png" },
                { nome: "RÉGUA", silabas: 3, img: "materialescolar/regua.png" },
                { nome: "BORRACHA", silabas: 3, img: "materialescolar/borracha.png" },
                { nome: "COLA", silabas: 2, img: "materialescolar/cola.png" },
                { nome: "ESTOJO", silabas: 3, img: "materialescolar/estojo.png" }
            ]
        }
    },
    relatorios: [
        { min: 9, max: 10, titulo: "És um craque!", img: "taca_1.png" },
        { min: 7, max: 8, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 5, max: 6, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 4, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};
