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
            img: "animaisdomesticos/silabas_1.png",
            tipo: "contar",
            // ADICIONE MAIS PALAVRAS AQUI
            itens: [
                { nome: "VACA", img: "animaisdomesticos/vaca.png", divisao: "VA-CA" },
                { nome: "GATO", img: "animaisdomesticos/gato.png", divisao: "GA-TO" },
                { nome: "BANANA", img: "frutas/banana.png", divisao: "BA-NA-NA" },
                { nome: "MOCHILA", img: "materialescolar/mochila.png", divisao: "MO-CHI-LA" },
                { nome: "TESOURA", img: "materialescolar/tesoura.png", divisao: "TE-SOU-RA" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png", divisao: "CA-VA-LO" },
                { nome: "OVELHA", img: "animaisdomesticos/ovelha.png", divisao: "O-VE-LHA" },
                { nome: "PERU", img: "animaisdomesticos/peru.png", divisao: "PE-RU" },
                { nome: "PATO", img: "animaisdomesticos/pato.png", divisao: "PA-TO" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png", divisao: "CO-E-LHO" },
                { nome: "CABRA", img: "animaisdomesticos/cabra.png", divisao: "CA-BRA" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png", divisao: "CÃO" },
                { nome: "CEREJA", img: "frutas/cereja.png", divisao: "CE-RE-JA" },
                { nome: "LARANJA", img: "frutas/laranja.png", divisao: "LA-RAN-JA" },
                { nome: "PAPAIA", img: "frutas/papaia.png", divisao: "PA-PAI-A" },
                { nome: "MACACO", img: "animais/macaco.png", divisao: "MA-CA-CO" } // Exemplo de nova palavra
            ]
        },
        ordenar: {
            nome: "Ordenar Sílabas",
            img: "animaisdomesticos/silabas_2.png",
            tipo: "ordenar",
            // ADICIONE MAIS PALAVRAS AQUI
            itens: [
                { nome: "VACA", img: "animaisdomesticos/vaca.png", divisao: "VA-CA" },
                { nome: "GATO", img: "animaisdomesticos/gato.png", divisao: "GA-TO" },
                { nome: "BANANA", img: "frutas/banana.png", divisao: "BA-NA-NA" },
                { nome: "MOCHILA", img: "materialescolar/mochila.png", divisao: "MO-CHI-LA" },
                { nome: "TESOURA", img: "materialescolar/tesoura.png", divisao: "TE-SOU-RA" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png", divisao: "CA-VA-LO" },
                { nome: "OVELHA", img: "animaisdomesticos/ovelha.png", divisao: "O-VE-LHA" },
                { nome: "PERU", img: "animaisdomesticos/peru.png", divisao: "PE-RU" },
                { nome: "PATO", img: "animaisdomesticos/pato.png", divisao: "PA-TO" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png", divisao: "CO-E-LHO" },
                { nome: "CABRA", img: "animaisdomesticos/cabra.png", divisao: "CA-BRA" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png", divisao: "CÃO" },
                { nome: "CEREJA", img: "frutas/cereja.png", divisao: "CE-RE-JA" },
                { nome: "LARANJA", img: "frutas/laranja.png", divisao: "LA-RAN-JA" },
                { nome: "PAPAIA", img: "frutas/papaia.png", divisao: "PA-PAI-A" }
            ]
        }
    },
    relatorio: {
        titulo: "MUITO BEM!",
        pontosTotal: "Acertaste:",
        tempoTotal: "Tempo:"
    }
};
