const JOGO_CONFIG = {
    nomeJogo: "SOPA DE LETRAS",
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
        tituloPagina: "Pequenos Leitores - Sopa de Letras",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Encontra o nome das imagens na sopa de letras!"
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
                { nome: "RATO", img: "animaisdomesselvagens/rato.png" },
                { nome: "LEÃO", img: "animaisdomesselvagens/leao.png" },
                { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "POMBO", img: "animaisdomesselvagens/pombo.png" },
                { nome: "ELEFANTE", img: "animaisdomesselvagens/elefante.png" },
                { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "ÁGUIA", img: "animaisdomesselvagens/aguia.png" },
                { nome: "GALO", img: "animaisdomesticos/galo.png" },
                { nome: "URSO", img: "animaisdomesselvagens/urso.png" },
                { nome: "PERU", img: "animaisdomesticos/peru.png" },
                { nome: "GORILA", img: "animaisdomesselvagens/gorila.png" },
                { nome: "FOCA", img: "animaisdomesselvagens/foca.png" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png" },
                { nome: "MACACO", img: "animaisdomesselvagens/macaco.png" },
                { nome: "RAIA", img: "animaisdomesselvagens/raia.png" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" },
                { nome: "TUBARÃO", img: "animaisdomesselvagens/tubarao.png" },
                { nome: "BURRO", img: "animaisdomesticos/burro.png" },
                { nome: "PAPAGAIO", img: "animaisdomesselvagens/papagaio.png" },
                { nome: "GALINHA", img: "animaisdomesticos/galinha.png" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png" }
            ]
        },
          objeros: {
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
                { nome: "PÁ", img: "objetos/pa.png" },
                { nome: "ÓCULOS", img: "objetos/oculos.png" },
                { nome: "CESTO", img: "objetos/cesto.png" },
                { nome: "DEDAL", img: "objetos/dedal.png" },
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
                { nome: "MAÇÃ", img: "frutas/maca.png" }
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
        { min: 1200, titulo: "BRILHANTE!", img: "taca_1.png" },
        { min: 800, titulo: "MUITO BEM!", img: "taca_2.png" },
        { min: 500, titulo: "BOM TRABALHO!", img: "taca_3.png" },
        { min: 0, titulo: "TENTA OUTRA VEZ!", img: "taca_4.png" }
    ]
};
