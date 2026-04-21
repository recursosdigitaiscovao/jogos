const JOGO_CONFIG = {
    nomeJogo: "CORTA-SÍLABAS",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    
    pontuacao: {
        acerto: 100, 
        erro: 50            
    },

    textos: {
        tituloPagina: "Pequenos Leitores - Corta-Sílabas",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Clica entre as letras para separar as sílabas!"
    },

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
            imgCapa: "animaisdomesticos/gato.png",
            itens: [
                { nome: "GATO", silabas: ["GA", "TO"], img: "animaisdomesticos/gato.png" },
                { nome: "VACA", silabas: ["VA", "CA"], img: "animaisdomesticos/vaca.png" },
                { nome: "PATO", silabas: ["PA", "TO"], img: "animaisdomesticos/pato.png" },
                { nome: "OVELHA", silabas: ["O", "VE", "LHA"], img: "animaisdomesticos/ovelha.png" },
                { nome: "CAVALO", silabas: ["CA", "VA", "LO"], img: "animaisdomesticos/cavalo.png" },
                { nome: "MACACO", silabas: ["MA", "CA", "CO"], img: "animaisselvagens/macaco.png" },
                { nome: "CROCODILO", silabas: ["CRO", "CO", "DI", "LO"], img: "animaisselvagens/crocodilo.png" },
                { nome: "GIRAFA", silabas: ["GI", "RA", "FA"], img: "animaisselvagens/girafa.png" },
                { nome: "TUBARÃO", silabas: ["TU", "BA", "RÃO"], img: "animaisselvagens/tubarao.png" },
                { nome: "COELHO", silabas: ["CO", "E", "LHO"], img: "animaisdomesticos/coelho.png" },
                { nome: "GALINHA", silabas: ["GA", "LI", "NHA"], img: "animaisdomesticos/galinha.png" },
                { nome: "BURRO", silabas: ["BU", "RRO"], img: "animaisdomesticos/burro.png" },
                { nome: "POMBO", silabas: ["POM", "BO"], img: "animaisselvagens/pombo.png" }
            ]
        },
        frutos: {
            nome: "Frutos",
            imgCapa: "frutas/morango.png",
            itens: [
                { nome: "MAÇÃ", silabas: ["MA", "ÇÃ"], img: "frutas/maca.png" },
                { nome: "UVAS", silabas: ["U", "VAS"], img: "frutas/uvas.png" },
                { nome: "BANANA", silabas: ["BA", "NA", "NA"], img: "frutas/banana.png" },
                { nome: "MORANGO", silabas: ["MO", "RAN", "GO"], img: "frutas/morango.png" },
                { nome: "CEREJA", silabas: ["CE", "RE", "JA"], img: "frutas/cereja.png" },
                { nome: "LIMÃO", silabas: ["LI", "MÃO"], img: "frutas/limao.png" },
                { nome: "LARANJA", silabas: ["LA", "RAN", "JA"], img: "frutas/laranja.png" },
                { nome: "CASTANHA", silabas: ["CAS", "TA", "NHA"], img: "frutas/castanha.png" },
                { nome: "MELANCIA", silabas: ["ME", "LAN", "CI", "A"], img: "frutas/melancia.png" },
                { nome: "MARACUJÁ", silabas: ["MA", "RA", "CU", "JÁ"], img: "frutas/maracuja.png" },
                { nome: "AMORA", silabas: ["A", "MO", "RA"], img: "frutas/amora.png" }
            ]
        },
        objetos: {
            nome: "Objetos",
            imgCapa: "objetos/carrinho.png",
            itens: [
                { nome: "VASSOURA", silabas: ["VA", "SSOU", "RA"], img: "objetos/vassoura.png" },
                { nome: "CHAVE", silabas: ["CHA", "VE"], img: "objetos/chave.png" },
                { nome: "CARRINHO", silabas: ["CA", "RRI", "NHO"], img: "objetos/carrinho.png" },
                { nome: "GARRAFA", silabas: ["GA", "RRA", "FA"], img: "objetos/garrafa.png" },
                { nome: "CESTO", silabas: ["CES", "TO"], img: "objetos/cesto.png" },
                { nome: "SAPATO", silabas: ["SA", "PA", "TO"], img: "objetos/sapato.png" },
                { nome: "ESCOVA", silabas: ["ES", "CO", "VA"], img: "objetos/escova.png" },
                { nome: "CANETA", silabas: ["CA", "NE", "TA"], img: "materialescolar/caneta.png" },
                { nome: "BORRACHA", silabas: ["BO", "RRA", "CHA"], img: "materialescolar/borracha.png" },
                { nome: "MOCHILA", silabas: ["MO", "CHI", "LA"], img: "materialescolar/mochila.png" },
                { nome: "PANELA", silabas: ["PA", "NE", "LA"], img: "objetos/panela.png" },
                { nome: "COPO", silabas: ["CO", "PO"], img: "objetos/copo.png" },
                { nome: "COLHER", silabas: ["CO", "LHER"], img: "objetos/colher.png" }
            ]
        }
    },

    relatorios: [
        { min: 1000, titulo: "BRILHANTE!", img: "taca_1.png" },
        { min: 750, titulo: "MUITO BEM!", img: "taca_2.png" },
        { min: 500, titulo: "BOM TRABALHO!", img: "taca_3.png" },
        { min: 0, titulo: "TENTA OUTRA VEZ!", img: "taca_4.png" }
    ]
};
