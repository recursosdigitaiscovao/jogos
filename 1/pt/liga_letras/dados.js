const JOGO_CONFIG = {
    nomeJogo: "LIGA LETRAS",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    
    pontuacao: {
        acertoNivel1: 100, 
        acertoNivel2: 150, 
        erro: 20            
    },

    textos: {
        tituloPagina: "Pequenos Leitores - Liga Letras",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Clica nas letras pela ordem correta para formar a palavra!"
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
                { nome: "VACA", img: "animaisdomesticos/vaca.png" },
                { nome: "RATO", img: "animaisselvagens/rato.png" },
                { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png" },
                { nome: "LEÃO", img: "animaisselvagens/leao.png" },
                { nome: "FOCA", img: "animaisselvagens/foca.png" },
                { nome: "GALO", img: "animaisdomesticos/galo.png" }
            ]
        },
        frutos: {
            nome: "Frutos",
            imgCapa: "frutas/morango.png",
            itens: [
                { nome: "BANANA", img: "frutas/banana.png" },
                { nome: "MAÇÃ", img: "frutas/maca.png" },
                { nome: "UVAS", img: "frutas/uvas.png" },
                { nome: "PERA", img: "frutas/pera.png" },
                { nome: "FIGO", img: "frutas/figo.png" },
                { nome: "KIWI", img: "frutas/kiwi.png" },
                { nome: "LIMÃO", img: "frutas/limao.png" },
                { nome: "MELÃO", img: "frutas/melao.png" }
            ]
        },
        numeros: {
            nome: "Números",
            imgCapa: "numeros/cinco.png",
            itens: [
                { nome: "ZERO", img: "numeros/zero.png" },
                { nome: "UM", img: "numeros/um.png" },
                { nome: "DOIS", img: "numeros/dois.png" },
                { nome: "TRÊS", img: "numeros/tres.png" },
                { nome: "QUATRO", img: "numeros/quatro.png" },
                { nome: "CINCO", img: "numeros/cinco.png" },
                { nome: "SEIS", img: "numeros/seis.png" },
                { nome: "SETE", img: "numeros/sete.png" }
            ]
        }
    },

    relatorios: [
        { min: 1000, titulo: "BRILHANTE!", img: "taca_1.png" },
        { min: 700, titulo: "MUITO BEM!", img: "taca_2.png" },
        { min: 400, titulo: "BOM TRABALHO!", img: "taca_3.png" },
        { min: 0, titulo: "TENTA OUTRA VEZ!", img: "taca_4.png" }
    ]
};
