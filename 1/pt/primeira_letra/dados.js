const JOGO_CONFIG = {
    nomeJogo: "LETRA INICIAL",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    
    pontuacao: {
        acertoNivel1: 100, 
        acertoNivel2: 100, 
        erro: 50            
    },

    textos: {
        tituloPagina: "Pequenos Leitores - Letra Inicial",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Qual é a primeira letra da palavra?"
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
                { nome: "LEÃO", img: "animaisselvagens/leao.png" },
                { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "POMBO", img: "animaisselvagens/pombo.png" },
                { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "GALO", img: "animaisdomesticos/galo.png" },
                { nome: "URSO", img: "animaisselvagens/urso.png" },
                { nome: "FOCA", img: "animaisselvagens/foca.png" },
                { nome: "MACACO", img: "animaisselvagens/macaco.png" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" },
                { nome: "GALINHA", img: "animaisdomesticos/galinha.png" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png" }
            ]
        },
        objetos: {
            nome: "Objetos",
            imgCapa: "objetos/vassoura.png",
            itens: [
                { nome: "VASSOURA", img: "objetos/vassoura.png" },
                { nome: "GARFO", img: "objetos/garfo.png" },
                { nome: "PINCEL", img: "objetos/pincel.png" },
                { nome: "ESCOVA", img: "objetos/escova.png" },
                { nome: "GARRAFA", img: "objetos/garrafa.png" },
                { nome: "COPO", img: "objetos/copo.png" },
                { nome: "BALDE", img: "objetos/balde.png" },
                { nome: "ÓCULOS", img: "objetos/oculos.png" },
                { nome: "CESTO", img: "objetos/cesto.png" },
                { nome: "COLHER", img: "objetos/colher.png" }
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
                { nome: "MELANCIA", img: "frutas/melancia.png" },
                { nome: "LARANJA", img: "frutas/laranja.png" },
                { nome: "PAPAIA", img: "frutas/papaia.png" },
                { nome: "MAÇÃ", img: "frutas/maca.png" },
                { nome: "AMORA", img: "frutas/amora.png" },
                { nome: "MELÃO", img: "frutas/melao.png" },
                { nome: "MARACUJÁ", img: "frutas/maracuja.png" },
                { nome: "LIMÃO", img: "frutas/limao.png" },
                { nome: "GOIABA", img: "frutas/goiaba.png" },
                { nome: "FIGO", img: "frutas/figo.png" },
                { nome: "DIÓSPIRO", img: "frutas/diospiro.png" },
                { nome: "CASTANHA", img: "frutas/castanha.png" },
                { nome: "ROMÃ", img: "frutas/roma.png" }
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
                { nome: "AFIA", img: "materialescolar/afia.png" },
                { nome: "CANETA", img: "materialescolar/caneta.png" },
                { nome: "RÉGUA", img: "materialescolar/regua.png" },
                { nome: "BORRACHA", img: "materialescolar/borracha.png" },
                { nome: "COLA", img: "materialescolar/cola.png" },
                { nome: "ESTOJO", img: "materialescolar/estojo.png" }
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
