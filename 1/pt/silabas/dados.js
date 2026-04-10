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
            nome: "Contar Sílabas",
            img: "vaca.png",
            tipo: "contar",
            itens: [
                { nome: "VACA", img: "animaisdomesticos/vaca.png", divisao: "VA-CA" },
                { nome: "GATO", img: "animaisdomesticos/gato.png", divisao: "GA-TO" },
                { nome: "BANANA", img: "frutas/banana.png", divisao: "BA-NA-NA" },
                { nome: "MOCHILA", img: "materialescolar/mochila.png", divisao: "MO-CHI-LA" },
                { nome: "TESOURA", img: "materialescolar/tesoura.png", divisao: "TE-SOU-RA" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png", divisao: "CA-VA-LO" }
            ]
        },
        ordenar: {
            nome: "Ordenar Sílabas",
            img: "caneta.png",
            tipo: "ordenar",
            itens: [
                { nome: "PORCO", img: "animaisdomesticos/porco.png", divisao: "POR-CO" },
                { nome: "BURRO", img: "animaisdomesticos/burro.png", divisao: "BU-RRO" },
                { nome: "BORRACHA", img: "materialescolar/borracha.png", divisao: "BO-RRA-CHA" },
                { nome: "GALINHA", img: "animaisdomesticos/galinha.png", divisao: "GA-LI-NHA" },
                { nome: "MORANGO", img: "frutas/morango.png", divisao: "MO-RAN-GO" },
                { nome: "CANETA", img: "materialescolar/caneta.png", divisao: "CA-NE-TA" }
            ]
        }
    },
    relatorio: {
        titulo: "Muito Bem!",
        pontosTotal: "Acertaste:",
        tempoTotal: "Tempo:"
    }
};
