const JOGO_CONFIG = {
    nomeJogo: "FOGUETÃO DAS RIMAS",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    pontuacao: { acerto: 100, erro: 30 },
    textos: {
        instrucao: "Apanha os asteroides que rimam com a palavra do foguetão!",
        rodape: "&copy; Pequenos Leitores"
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
            nome: "Missão: Sons em -ÃO e -AR",
            niveis: {
                facil: [
                    { alvo: "CÃO", rimas: ["PÃO", "MÃO"], dist: ["SOL", "BOLA"] },
                    { alvo: "MAR", rimas: ["DAR", "BAR"], dist: ["LUA", "CASA"] },
                    { alvo: "AVIÃO", rimas: ["BALÃO", "SABÃO"], dist: ["CARRO", "RUA"] },
                    { alvo: "CANTAR", rimas: ["SALTAR", "DANÇAR"], dist: ["PÉ", "MÃO"] },
                    { alvo: "LEÃO", rimas: ["PEÃO", "FEIJÃO"], dist: ["REI", "SELVA"] },
                    { alvo: "OLHAR", rimas: ["FALAR", "ANDAR"], dist: ["OLHO", "VER"] },
                    { alvo: "BOTÃO", rimas: ["CARTÃO", "CHÃO"], dist: ["ROUPA", "DEDO"] },
                    { alvo: "VOAR", rimas: ["LUAR", "ESTAR"], dist: ["ASA", "CÉU"] },
                    { alvo: "LIMÃO", rimas: ["MAMÃO", "CORAÇÃO"], dist: ["DOCE", "AZEDO"] },
                    { alvo: "PAR", rimas: ["MAR", "DAR"], dist: ["UM", "DOIS"] }
                ],
                normal: [ /* Pode adicionar mais aqui seguindo a mesma estrutura */ ],
                dificil: [ /* Pode adicionar mais aqui seguindo a mesma estrutura */ ]
            }
        },
        cat2: {
            nome: "Missão: Sons em -OLA e -ATO",
            niveis: {
                facil: [
                    { alvo: "BOLA", rimas: ["COLA", "MOLA"], dist: ["DADO", "JOGO"] },
                    { alvo: "GATO", rimas: ["RATO", "PATO"], dist: ["CÃO", "PEIXE"] },
                    { alvo: "ESCOLA", rimas: ["SACOLA", "SOLA"], dist: ["LIVRO", "ALUNO"] },
                    { alvo: "SAPATO", rimas: ["PRATO", "FATO"], dist: ["PÉ", "MEIA"] },
                    { alvo: "GOLA", rimas: ["VIOLA", "ANGOLA"], dist: ["CAMISA", "PESCOÇO"] },
                    { alvo: "MATO", rimas: ["JATO", "RATO"], dist: ["ÁRVORE", "VERDE"] },
                    { alvo: "COLA", rimas: ["BOLA", "MOLA"], dist: ["PAPEL", "LÁPIS"] },
                    { alvo: "PATO", rimas: ["GATO", "SAPATO"], dist: ["ASA", "BICO"] },
                    { alvo: "MOLA", rimas: ["COLA", "SOLA"], dist: ["FERRO", "SALTAR"] },
                    { alvo: "PRATO", rimas: ["FATO", "GATO"], dist: ["SOPA", "GARFO"] }
                ],
                normal: [], dificil: []
            }
        }
    },
    relatorios: [
        { min: 800, titulo: "COMANDANTE!", img: "taca_1.png" },
        { min: 0, titulo: "CADETE!", img: "taca_2.png" }
    ]
};
