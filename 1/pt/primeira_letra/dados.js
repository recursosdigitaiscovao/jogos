const JOGO_CONFIG = {
    nomeJogo: "LETRA INICIAL",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/", // Onde estão as imagens dos objetos/animais
    caminhoIcons: "../../../icons/",
    
    pontuacao: {
        acertoNivel1: 100,
        acertoNivel2: 150,
        erro: 20
    },

    textos: {
        tituloPagina: "Pequenos Leitores - Letra Inicial",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Qual é a primeira letra da palavra?"
    },

    relatorios: [
        { min: 1000, titulo: "BRILHANTE!", img: "taca_ouro.png" },
        { min: 600, titulo: "MUITO BEM!", img: "taca_prata.png" },
        { min: 0, titulo: "BOM TRABALHO!", img: "taca_bronze.png" }
    ],

    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },

    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },

    categorias: {
        cat1: {
            nome: "Animais", 
            imgCapa: "cat_animais.png",
            rondas: [
                { palavra: "GATO", img: "gato.png", opcoes: ["G", "P", "B", "M"] },
                { palavra: "PATO", img: "pato.png", opcoes: ["P", "T", "D", "B"] },
                { palavra: "LEÃO", img: "leao.png", opcoes: ["L", "M", "N", "J"] },
                { palavra: "MACACO", img: "macaco.png", opcoes: ["M", "W", "N", "B"] },
                { palavra: "ZEBRA", img: "zebra.png", opcoes: ["Z", "S", "X", "V"] },
                { palavra: "VACA", img: "vaca.png", opcoes: ["V", "F", "U", "B"] },
                { palavra: "COELHO", img: "coelho.png", opcoes: ["C", "Q", "K", "G"] },
                { palavra: "BALEIA", img: "baleia.png", opcoes: ["B", "P", "D", "R"] },
                { palavra: "SAPO", img: "sapo.png", opcoes: ["S", "C", "Z", "F"] },
                { palavra: "RATO", img: "rato.png", opcoes: ["R", "P", "B", "M"] }
            ]
        },
        cat2: {
            nome: "Frutas", 
            imgCapa: "cat_frutas.png",
            rondas: [
                { palavra: "BANANA", img: "banana.png", opcoes: ["B", "D", "P", "M"] },
                { palavra: "MAÇÃ", img: "maca.png", opcoes: ["M", "N", "A", "U"] },
                { palavra: "UVA", img: "uva.png", opcoes: ["U", "V", "O", "A"] },
                { palavra: "PERA", img: "pera.png", opcoes: ["P", "B", "T", "F"] },
                { palavra: "LARANJA", img: "laranja.png", opcoes: ["L", "I", "H", "U"] },
                { palavra: "MORANGO", img: "morango.png", opcoes: ["M", "W", "N", "V"] },
                { palavra: "ANANÁS", img: "ananas.png", opcoes: ["A", "E", "O", "I"] },
                { palavra: "LIMÃO", img: "limao.png", opcoes: ["L", "T", "D", "N"] },
                { palavra: "CEREJA", img: "cereja.png", opcoes: ["C", "S", "K", "G"] },
                { palavra: "FIGO", img: "figo.png", opcoes: ["F", "V", "T", "P"] }
            ]
        }
    }
};
