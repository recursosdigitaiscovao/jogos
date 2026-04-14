const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    iconesMenu: {
        home: "home.png",
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },
    // Mantendo a tua estrutura de caminhos exata
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
            img: "animaisdomesticos/vaca.png",
            itens: [
                { nome: "VACA", img: "animaisdomesticos/vaca.png" },
                { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "PERU", img: "animaisdomesticos/peru.png" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png" }
            ]
        }
    },
            frutos: {
            nome: "Frutos",
            img: "frutas/banana.png",
            itens: [
                { nome: "BANANA", img: "frutas/banana.png" },
                { nome: "CEREJA", img: "frutas/cereja.png" },
                { nome: "BANANA", img: "frutas/banana.png" },
                { nome: "UVAS", img: "frutas/uvas.png" },
                { nome: "MORANGO", img: "frutas/morango.png" },
                { nome: "LARANJA", img: "frutas/banana.png" }, // Reutilizando imagem do seu config
                { nome: "PAPAIA", img: "frutas/papaia.png" },
                { nome: "MACÃ", img: "frutas/maca.png" } // Adicionado para completar 5
            ]
        },
            material: {
            nome: "Material Escolar",
            img: "materialescolar/afia.png",
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
    relatorio: {
        titulo: "MUITO BEM!",
        pontosTotal: "Encontraste:",
        tempoTotal: "Tempo:"
    }
};
