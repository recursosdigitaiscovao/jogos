const JOGO_CONFIG = {
    nomeJogo: "LIGAR ANTÓNIMOS",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    
    pontuacao: {
        acerto: 150, 
        erro: 50            
    },

    textos: {
        tituloPagina: "Pequenos Leitores - Antónimos",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Liga cada palavra ao seu antónimo (contrário)!"
    },

    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },

    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },

    categorias: {
        cat1: {
            nome: "Antónimos 1",
            imgCapa: "cat_antonimos1.png", // Podes usar um ícone genérico
            pares: [
                { a: "ALTO", b: "BAIXO" },
                { a: "GRANDE", b: "PEQUENO" },
                { a: "QUENTE", b: "FRIO" },
                { a: "NOITE", b: "DIA" },
                { a: "BOM", b: "MAU" }
            ]
        },
        cat2: {
            nome: "Antónimos 2",
            imgCapa: "cat_antonimos2.png",
            pares: [
                { a: "NOVO", b: "VELHO" },
                { a: "ABERTO", b: "FECHADO" },
                { a: "DENTRO", b: "FORA" },
                { a: "DOCE", b: "AMARGO" },
                { a: "RÁPIDO", b: "LENTO" }
            ]
        },
        cat3: {
            nome: "Antónimos 3",
            imgCapa: "cat_antonimos3.png",
            pares: [
                { a: "ALEGRE", b: "TRISTE" },
                { a: "SUJO", b: "LIMPO" },
                { a: "CHEIO", b: "VAZIO" },
                { a: "GORDINHO", b: "MAGRINHO" },
                { a: "BONITO", b: "FEIO" }
            ]
        }
    },

    relatorios: [
        { min: 1200, titulo: "BRILHANTE!", img: "taca_1.png" },
        { min: 800, titulo: "MUITO BEM!", img: "taca_2.png" },
        { min: 400, titulo: "BOM TRABALHO!", img: "taca_3.png" },
        { min: 0, titulo: "TENTA OUTRA VEZ!", img: "taca_4.png" }
    ]
};
