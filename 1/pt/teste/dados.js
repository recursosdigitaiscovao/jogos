const JOGO_CONFIG = {
    // 1. Configurações de Identidade
    nomeJogo: "SOPA DE LETRAS",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    
    // 2. Textos Dinâmicos
    textos: {
        tituloPagina: "Pequenos Leitores - Sopa de Letras",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Encontra o nome das imagens na sopa de letras!",
        iconIntro: "fas fa-search" // Ícone que aparece na apresentação
    },

    // 3. Sons
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },

    // 4. Menu Navegação
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },

    // 5. Conteúdo (Exemplo Sopa de Letras)
    categorias: {
        animais: {
            nome: "Animais",
            imgCapa: "animaisdomesticos/gato.png",
            itens: [
                { nome: "VACA", img: "animaisdomesticos/vaca.png" },
                { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "CÃO", img: "animaisdomesticos/cao.png" },
                { nome: "PERU", img: "animaisdomesticos/peru.png" }
            ]
        }
    },

    // 6. Fim de Jogo
    relatorios: [
        { min: 1000, titulo: "BRILHANTE!", img: "taca_1.png" },
        { min: 500, titulo: "MUITO BEM!", img: "taca_2.png" },
        { min: 0, titulo: "BOM TRABALHO!", img: "taca_4.png" }
    ]
};
