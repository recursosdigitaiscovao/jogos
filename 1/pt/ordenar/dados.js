const JOGO_CONFIG = {
    nomeJogo: "ORDEM ALFABÉTICA",
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
        tituloPagina: "Pequenos Leitores - Ordem Alfabética",
        tituloLinha1: "PEQUENOS",
        tituloLinha2: "LEITORES",
        subtitulo: "Português | 1º Ano",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos",
        instrucao: "Ordena os cartões por ordem alfabética!"
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
            nome: "4 Letras Consecutivas", 
            imgCapa: "cat1.png",
            rondas: [
                { itens: ["A", "B", "C", "D"] }, { itens: ["E", "F", "G", "H"] },
                { itens: ["I", "J", "K", "L"] }, { itens: ["M", "N", "O", "P"] },
                { itens: ["Q", "R", "S", "T"] }, { itens: ["U", "V", "W", "X"] },
                { itens: ["C", "D", "E", "F"] }, { itens: ["O", "P", "Q", "R"] },
                { itens: ["G", "H", "I", "J"] }, { itens: ["K", "L", "M", "N"] }
            ]
        },
        cat2: {
            nome: "4 Letras Alternadas", 
            imgCapa: "cat2.png",
            rondas: [
                { itens: ["A", "X", "M", "E"] }, { itens: ["B", "L", "O", "V"] },
                { itens: ["C", "G", "Z", "Q"] }, { itens: ["D", "H", "K", "W"] },
                { itens: ["P", "Y", "U", "S"] }, { itens: ["F", "R", "T", "J"] },
                { itens: ["N", "I", "K", "A"] }, { itens: ["E", "Z", "W", "M"] },
                { itens: ["H", "C", "L", "P"] }, { itens: ["V", "D", "R", "G"] }
            ]
        },
        cat3: {
            nome: "Mesma Letra Inicial", 
            imgCapa: "cat3.png",
            rondas: [
                { itens: ["AMORA", "ANANÁS", "ANEL", "AVENTAL"] }, { itens: ["BOLA", "BOLO", "BONECA", "BOTA"] },
                { itens: ["CASA", "CAVALO", "COELHO", "COPO"] }, { itens: ["DADO", "DEDO", "DENTE", "DOCE"] },
                { itens: ["GATO", "GAVETA", "GELO", "GIRAFA"] }, { itens: ["MALA", "MAPA", "MAÇÃ", "MEIA"] },
                { itens: ["PATO", "PENA", "PIPA", "POVO"] }, { itens: ["RATO", "REDE", "RISO", "RODA"] },
                { itens: ["SELO", "SINO", "SOFÁ", "SUCO"] }, { itens: ["TETO", "TINA", "TOCA", "TUDO"] }
            ]
        },
        cat4: {
            nome: "Palavras Mistas", 
            imgCapa: "cat4.png",
            rondas: [
                { itens: ["CÃO", "GATO", "PATO", "RATO"] }, { itens: ["SOL", "LUA", "MAR", "CÉU"] },
                { itens: ["UM", "DOIS", "TRÊS", "QUATRO"] }, { itens: ["MÃE", "PAI", "AVÓ", "AVÔ"] },
                { itens: ["AZUL", "ROSA", "VERDE", "VERMELHO"] }, { itens: ["BOLA", "DADO", "PEÃO", "URSO"] },
                { itens: ["MAÇÃ", "PERA", "UVA", "FIGO"] }, { itens: ["FARO", "PORTO", "EVORA", "BEJA"] },
                { itens: ["LÁPIS", "COLA", "AFIA", "LIVRO"] }, { itens: ["BOLO", "SUMO", "PÃO", "LEITE"] }
            ]
        }
    }
};
