const JOGO_CONFIG = {
    nomeJogo: "LIGAR ANTÓNIMOS",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    
    pontuacao: {
        acerto: 100, 
        erro: 30            
    },

    textos: {
        tituloPagina: "Pequenos Leitores - Antónimos",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Liga cada palavra ao seu antónimo!"
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
            nome: "Antónimos Comuns",
            imgCapa: "cat_antonimos1.png",
            // 10 rondas de 3 pares cada (Total 30 pares)
            rondas: [
                { pares: [{ a: "ALTO", b: "BAIXO" }, { a: "BOM", b: "MAU" }, { a: "DIA", b: "NOITE" }] },
                { pares: [{ a: "GRANDE", b: "PEQUENO" }, { a: "QUENTE", b: "FRIO" }, { a: "NOVO", b: "VELHO" }] },
                { pares: [{ a: "DENTRO", b: "FORA" }, { a: "ABERTO", b: "FECHADO" }, { a: "CHEIO", b: "VAZIO" }] },
                { pares: [{ a: "DOCE", b: "AMARGO" }, { a: "SUJO", b: "LIMPO" }, { a: "RÁPIDO", b: "LENTO" }] },
                { pares: [{ a: "ALEGRE", b: "TRISTE" }, { a: "FORTE", b: "FRACO" }, { a: "BONITO", b: "FEIO" }] },
                // Nível 2
                { pares: [{ a: "CLARO", b: "ESCURO" }, { a: "CURTO", b: "COMPRIDO" }, { a: "MACIO", b: "DURO" }] },
                { pares: [{ a: "FINO", b: "GROSSO" }, { a: "POUCO", b: "MUITO" }, { a: "CEDO", b: "TARDE" }] },
                { pares: [{ a: "PESADO", b: "LEVE" }, { a: "GORDO", b: "MAGRO" }, { a: "VIVO", b: "MORTO" }] },
                { pares: [{ a: "FÁCIL", b: "DIFÍCIL" }, { a: "PRIMEIRO", b: "ÚLTIMO" }, { a: "LIGAR", b: "DESLIGAR" }] },
                { pares: [{ a: "SUBIR", b: "DESCER" }, { a: "GANHAR", b: "PERDER" }, { a: "RIR", b: "CHORAR" }] }
            ]
        }
    },

    relatorios: [
        { min: 900, titulo: "BRILHANTE!", img: "taca_1.png" },
        { min: 600, titulo: "MUITO BEM!", img: "taca_2.png" },
        { min: 300, titulo: "BOM TRABALHO!", img: "taca_3.png" },
        { min: 0, titulo: "TENTA OUTRA VEZ!", img: "taca_4.png" }
    ]
};
