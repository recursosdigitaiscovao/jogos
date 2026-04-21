const JOGO_CONFIG = {
    nomeJogo: "ORDENAR SÍLABAS",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    
    // SISTEMA DE PONTOS DEFINIDO AQUI
    pontuacao: {
        acertoNivel1: 100, 
        acertoNivel2: 100, 
        erro: 50            
    },

    textos: {
        tituloPagina: "Pequenos Leitores - Ordenar Sílabas",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Ordena as sílabas para formar a palavra!"
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
                { nome: "VACA", silabas: ["VA", "CA"], img: "animaisdomesticos/vaca.png" },
                { nome: "RATO", silabas: ["RA", "TO"], img: "animaisselvagens/rato.png" },
                { nome: "LEÃO", silabas: ["LE", "ÃO"], img: "animaisselvagens/leao.png" },
                { nome: "GATO", silabas: ["GA", "TO"], img: "animaisdomesticos/gato.png" },
                { nome: "POMBO", silabas: ["POM", "BO"], img: "animaisselvagens/pombo.png" },
                { nome: "PATO", silabas: ["PA", "TO"], img: "animaisdomesticos/pato.png" },
                { nome: "GALO", silabas: ["GA", "LO"], img: "animaisdomesticos/galo.png" },
                { nome: "URSO", silabas: ["UR", "SO"], img: "animaisselvagens/urso.png" },
                { nome: "FOCA", silabas: ["FO", "CA"], img: "animaisselvagens/foca.png" },
                { nome: "MACACO", silabas: ["MA", "CA", "CO"], img: "animaisselvagens/macaco.png" },
                { nome: "CAVALO", silabas: ["CA", "VA", "LO"], img: "animaisdomesticos/cavalo.png" },
                { nome: "GALINHA", silabas: ["GA", "LI", "NHA"], img: "animaisdomesticos/galinha.png" },
                { nome: "COELHO", silabas: ["CO", "E", "LHO"], img: "animaisdomesticos/coelho.png" }
            ]
        },
        objetos: {
            nome: "Objetos",
            imgCapa: "objetos/vassoura.png",
            itens: [
                { nome: "VASSOURA", silabas: ["VAS", "SOU", "RA"], img: "objetos/vassoura.png" },
                { nome: "GARFO", silabas: ["GAR", "FO"], img: "objetos/garfo.png" },
                { nome: "PINCEL", silabas: ["PIN", "CEL"], img: "objetos/pincel.png" },
                { nome: "ESCOVA", silabas: ["ES", "CO", "VA"], img: "objetos/escova.png" },
                { nome: "GARRAFA", silabas: ["GA", "RRA", "FA"], img: "objetos/garrafa.png" },
                { nome: "COPO", silabas: ["CO", "PO"], img: "objetos/copo.png" },
                { nome: "BALDE", silabas: ["BAL", "DE"], img: "objetos/balde.png" },
                { nome: "ÓCULOS", silabas: ["Ó", "CU", "LOS"], img: "objetos/oculos.png" },
                { nome: "CESTO", silabas: ["CES", "TO"], img: "objetos/cesto.png" },
                { nome: "COLHER", silabas: ["CO", "LHER"], img: "objetos/colher.png" }
            ]
        },
        frutos: {
            nome: "Frutos",
            imgCapa: "frutas/morango.png",
            itens: [
                { nome: "BANANA", silabas: ["BA", "NA", "NA"], img: "frutas/banana.png" },
                { nome: "CEREJA", silabas: ["CE", "RE", "JA"], img: "frutas/cereja.png" },
                { nome: "UVAS", silabas: ["U", "VAS"], img: "frutas/uvas.png" },
                { nome: "MORANGO", silabas: ["MO", "RAN", "GO"], img: "frutas/morango.png" },
                { nome: "MELANCIA", silabas: ["ME", "LAN", "CI", "A"], img: "frutas/melancia.png" },
                { nome: "LARANJA", silabas: ["LA", "RAN", "JA"], img: "frutas/laranja.png" },
                { nome: "PAPAIA", silabas: ["PA", "PAI", "A"], img: "frutas/papaia.png" },
                { nome: "MAÇÃ", silabas: ["MA", "ÇÃ"], img: "frutas/maca.png" },
                { nome: "AMORA", silabas: ["A", "MO", "RA"], img: "frutas/amora.png" },
                { nome: "MELÃO", silabas: ["ME", "LÃO"], img: "frutas/melao.png" },
                { nome: "MARACUJÁ", silabas: ["MA", "RA", "CU", "JÁ"], img: "frutas/maracuja.png" },
                { nome: "LIMÃO", silabas: ["LI", "MÃO"], img: "frutas/limao.png" },
                { nome: "GOIABA", silabas: ["GOI", "A", "BA"], img: "frutas/goiaba.png" },
                { nome: "FIGO", silabas: ["FI", "GO"], img: "frutas/figo.png" },
                { nome: "DIÓSPIRO", silabas: ["DI", "ÓS", "PI", "RO"], img: "frutas/diospiro.png" },
                { nome: "CASTANHA", silabas: ["CAS", "TA", "NHA"], img: "frutas/castanha.png" },
                { nome: "ROMÃ", silabas: ["RO", "MÃ"], img: "frutas/roma.png" }
            ]
        },
        material: {
            nome: "Material Escolar",
            imgCapa: "materialescolar/afia.png",
            itens: [
                { nome: "MOCHILA", silabas: ["MO", "CHI", "LA"], img: "materialescolar/mochila.png" },
                { nome: "TESOURA", silabas: ["TE", "SOU", "RA"], img: "materialescolar/tesoura.png" },
                { nome: "LÁPIS", silabas: ["LÁ", "PIS"], img: "materialescolar/lapis.png" },
                { nome: "LIVRO", silabas: ["LI", "VRO"], img: "materialescolar/livro.png" },
                { nome: "AFIA", silabas: ["A", "FI", "A"], img: "materialescolar/afia.png" },
                { nome: "CANETA", silabas: ["CA", "NE", "TA"], img: "materialescolar/caneta.png" },
                { nome: "RÉGUA", silabas: ["RÉ", "GUA"], img: "materialescolar/regua.png" },
                { nome: "BORRACHA", silabas: ["BOR", "RA", "CHA"], img: "materialescolar/borracha.png" },
                { nome: "COLA", silabas: ["CO", "LA"], img: "materialescolar/cola.png" },
                { nome: "ESTOJO", silabas: ["ES", "TO", "JO"], img: "materialescolar/estojo.png" }
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
