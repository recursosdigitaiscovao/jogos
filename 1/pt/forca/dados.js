const JOGO_CONFIG = {
    nomeJogo: "FORCA DOS BALÕES",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    
    pontuacao: {
        vitoria: 100, 
        derrota: 50
    },

    textos: {
        tituloPagina: "Pequenos Leitores - Forca dos Balões",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Adivinha a palavra para salvar o boneco!"
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
            nome: "Animais", imgCapa: "animaisdomesticos/cao.png",
            itens: [
                { letras: "CÃO" }, { letras: "GATO" }, { letras: "PATO" }, { letras: "PERU" },
                { letras: "VACA" }, { letras: "COELHO" }, { letras: "CABRA" }, { letras: "PORCO" },
                { letras: "OVELHA" }, { letras: "GALO" }, { letras: "GALINHA" }, { letras: "BURRO" },
                { letras: "CAVALO" }, { letras: "RATO" }, { letras: "PEIXE" }, { letras: "POMBO" }
            ]
        },
        frutos: {
            nome: "Frutos", imgCapa: "frutas/maca.png",
            itens: [
                { letras: "MAÇÃ" }, { letras: "PÊRA" }, { letras: "UVA" }, { letras: "FIGO" },
                { letras: "MELÃO" }, { letras: "BANANA" }, { letras: "LARANJA" }, { letras: "MORANGO" },
                { letras: "CEREJA" }, { letras: "ANANÁS" }, { letras: "LIMÃO" }, { letras: "PÊSSEGO" }
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
