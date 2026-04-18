const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    caminhoSom: "", 
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
    categorias: {
        animais: {
            nome: "Animais",
            imgCapa: "animaisdomesticos/gato.png",
            itens: [
                { nome: "VACA", img: "animaisdomesticos/vaca.png" },
                { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "PERU", img: "animaisdomesticos/peru.png" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png" }
            ]
        },
        frutos: {
            nome: "Frutos",
            imgCapa: "frutas/morango.png",
            itens: [
                { nome: "BANANA", img: "frutas/banana.png" },
                { nome: "CEREJA", img: "frutas/cereja.png" },
                { nome: "UVAS", img: "frutas/uvas.png" },
                { nome: "MORANGO", img: "frutas/morango.png" },
                { nome: "LARANJA", img: "frutas/laranja.png" },
                { nome: "PAPAIA", img: "frutas/papaia.png" },
                { nome: "MAÇÃ", img: "frutas/maca.png" }
            ]
        },
        material: {
            nome: "Material Escolar",
            imgCapa: "materialescolar/afia.png",
            itens: [
                { nome: "MOCHILA", img: "materialescolar/mochila.png" },
                { nome: "TESOURA", img: "materialescolar/tesoura.png" },
                { nome: "LÁPIS", img: "materialescolar/lapis.png" },
                { nome: "LIVRO", img: "materialescolar/livro.png" },
                { nome: "CAPA", img: "materialescolar/capa.png" },
                { nome: "AFIA", img: "materialescolar/afia.png" },
                { nome: "COLA", img: "materialescolar/cola.png" },
                { nome: "FOLHA", img: "materialescolar/folha.png" },
                { nome: "ESTOJO", img: "materialescolar/estojo.png" }
            ]
        }
    },
    relatorios: [
        { min: 900, titulo: "BRILHANTE!", msg: "És um verdadeiro mestre das palavras!", img: "taca_1.png" },
        { min: 700, titulo: "MUITO BEM!", msg: "Excelente prestação!", img: "taca_2.png" },
        { min: 500, titulo: "BOM TRABALHO!", msg: "Estás quase lá, continua a praticar!", img: "taca_3.png" },
        { min: 0, titulo: "NÃO FOI DESTA!", msg: "Tenta outra vez para melhorares!", img: "taca_4.png" }
    ]
};
