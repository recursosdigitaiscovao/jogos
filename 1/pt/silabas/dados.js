const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },
    categorias: {
        contar: {
            nome: "Quantas Sílabas?",
            img: "frutas/maca.png", // Ícone Categoria 1
            tipo: "contar",
            itens: [
                { nome: "MACACO", img: "animaisdomesticos/macaco.png", divisao: "MA-CA-CO" },
                { nome: "VACA", img: "animaisdomesticos/vaca.png", divisao: "VA-CA" },
                { nome: "PATO", img: "animaisdomesticos/pato.png", divisao: "PA-TO" },
                { nome: "BANANA", img: "frutas/banana.png", divisao: "BA-NA-NA" },
                { nome: "MOCHILA", img: "materialescolar/mochila.png", divisao: "MO-CHI-LA" }
            ]
        },
        ordenar: {
            nome: "Ordena as Sílabas",
            img: "animaisdomesticos/cao.png", // Ícone Categoria 2
            tipo: "ordenar",
            itens: [
                { nome: "PORCO", img: "animaisdomesticos/porco.png", divisao: "POR-CO" },
                { nome: "CARRO", img: "carro.png", divisao: "CAR-RO" },
                { nome: "MASSA", img: "massa.png", divisao: "MAS-SA" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png", divisao: "CA-VA-LO" },
                { nome: "GALINHA", img: "animaisdomesticos/galinha.png", divisao: "GA-LI-NHA" },
                { nome: "MORANGO", img: "frutas/morango.png", divisao: "MO-RAN-GO" }
            ]
        }
    },
    relatorio: {
        titulo: "Muito Bem!",
        pontosTotal: "Acertaste:",
        tempoTotal: "Tempo:"
    }
};
