const JOGO_CATEGORIAS = {
    nivel1: {
        nome: "Animais",
        descricao: "Clica nas lacunas e escolhe a palavra correta sobre os Animais!",
        imgCapa: "animaisdomesticos/cao.png",
        textos: [
            { frase: "O cão é o melhor amigo do [[0]]. Ele gosta muito de roer [[1]].", lacunas: [{ certa: "homem", erradas: ["gato", "carro", "balão"] }, { certa: "ossos", erradas: ["pedras", "frutas", "pão"] }] },
            { frase: "O leão é o rei da [[0]]. Ele tem uma grande [[1]].", lacunas: [{ certa: "selva", erradas: ["quinta", "cidade", "água"] }, { certa: "juba", erradas: ["tromba", "cauda", "asa"] }] },
            { frase: "O elefante usa a sua [[0]] para beber água. Ele é muito [[1]].", lacunas: [{ certa: "tromba", erradas: ["orelha", "perna", "língua"] }, { certa: "pesado", erradas: ["leve", "pequeno", "voador"] }] },
            { frase: "A girafa tem o pescoço muito [[0]]. Ela come as folhas das [[1]].", lacunas: [{ certa: "comprido", erradas: ["curto", "baixo", "largo"] }, { certa: "árvores", erradas: ["nuvens", "casas", "rochas"] }] },
            { frase: "O tubarão vive no [[0]]. Ele tem dentes muito [[1]].", lacunas: [{ certa: "oceano", erradas: ["rio", "deserto", "bosque"] }, { certa: "afiados", erradas: ["moles", "doces", "azuis"] }] },
            { frase: "A vaca dá-nos o [[0]]. Ela gosta de comer a [[1]] do campo.", lacunas: [{ certa: "leite", erradas: ["sumo", "café", "chá"] }, { certa: "erva", erradas: ["carne", "areia", "chocolate"] }] },
            { frase: "O gato faz [[0]]. Ele gosta muito de caçar [[1]].", lacunas: [{ certa: "miau", erradas: ["au-au", "piu-piu", "cocorocó"] }, { certa: "ratos", erradas: ["cães", "leões", "ursos"] }] },
            { frase: "A galinha põe [[0]]. O seu corpo está coberto de [[1]].", lacunas: [{ certa: "ovos", erradas: ["maçãs", "pedras", "flores"] }, { certa: "penas", erradas: ["pelos", "escamas", "folhas"] }] },
            { frase: "O macaco gosta de comer [[0]]. Ele salta entre os [[1]].", lacunas: [{ certa: "bananas", erradas: ["sopas", "pizas", "queijo"] }, { certa: "galhos", erradas: ["carros", "telhados", "rios"] }] },
            { frase: "O sapo dá grandes [[0]]. Ele vive perto do [[1]].", lacunas: [{ certa: "saltos", erradas: ["beijos", "gritos", "abraços"] }, { certa: "lago", erradas: ["fogo", "céu", "estrada"] }] },
            { frase: "O coelho tem orelhas [[0]]. Ele gosta de comer [[1]].", lacunas: [{ certa: "compridas", erradas: ["curtas", "azuis", "redondas"] }, { certa: "cenouras", erradas: ["chocolates", "pastilhas", "peixe"] }] },
            { frase: "O peixe respira debaixo da [[0]]. Ele usa as [[1]] para nadar.", lacunas: [{ certa: "água", erradas: ["terra", "areia", "nuvem"] }, { certa: "barbatanas", erradas: ["asas", "mãos", "pernas"] }] },
            { frase: "A tartaruga anda muito [[0]]. Ela tem uma [[1]] muito dura.", lacunas: [{ certa: "devagar", erradas: ["depressa", "a voar", "a saltar"] }, { certa: "carapaça", erradas: ["pele", "roupa", "caixa"] }] },
            { frase: "A abelha faz o [[0]]. Ela voa de flor em [[1]].", lacunas: [{ certa: "mel", erradas: ["leite", "azeite", "queijo"] }, { certa: "flor", erradas: ["pedra", "casa", "nuvem"] }] },
            { frase: "O lobo vive na [[0]]. Ele faz um som chamado [[1]].", lacunas: [{ certa: "floresta", erradas: ["piscina", "escola", "loja"] }, { certa: "uivo", erradas: ["miado", "latido", "canto"] }] },
            { frase: "O porco vive na [[0]]. Ele gosta de rebolar na [[1]].", lacunas: [{ certa: "quinta", erradas: ["nuvem", "lua", "estrada"] }, { certa: "lama", erradas: ["neve", "tinta", "água"] }] },
            { frase: "O urso gosta de comer [[0]]. No inverno, ele gosta de [[1]].", lacunas: [{ certa: "peixe", erradas: ["pizas", "bolos", "balões"] }, { certa: "dormir", erradas: ["correr", "nadar", "dançar"] }] },
            { frase: "O cavalo é um animal muito [[0]]. O homem pode andar no seu [[1]].", lacunas: [{ certa: "veloz", erradas: ["lento", "pequeno", "voador"] }, { certa: "dorso", erradas: ["chifre", "bico", "asa"] }] },
            { frase: "O pintainho nasce do [[0]]. Ele faz o som [[1]].", lacunas: [{ certa: "ovo", erradas: ["leite", "mato", "mar"] }, { certa: "piu-piu", erradas: ["au-au", "miau", "béé"] }] },
            { frase: "O jacaré vive no [[0]]. Ele tem uma boca muito [[1]].", lacunas: [{ certa: "rio", erradas: ["céu", "deserto", "espaço"] }, { certa: "grande", erradas: ["pequena", "doce", "mole"] }] }
        ]
    },
    nivel2: {
        nome: "Plantas",
        descricao: "Completa os textos sobre o mundo das Plantas!",
        imgCapa: "comida/alface.png",
        textos: [
            { frase: "As plantas precisam de água e [[0]]. Elas crescem na [[1]].", lacunas: [{ certa: "luz", erradas: ["fogo", "neve", "noite"] }, { certa: "terra", erradas: ["mesa", "estrada", "nuvem"] }] },
            { frase: "O girassol vira-se para o [[0]]. Ele tem pétalas [[1]].", lacunas: [{ certa: "Sol", erradas: ["mar", "vento", "frio"] }, { certa: "amarelas", erradas: ["azuis", "pretas", "cinzentas"] }] },
            { frase: "As folhas costumam ser [[0]]. Algumas plantas dão [[1]] coloridas.", lacunas: [{ certa: "verdes", erradas: ["roxas", "quadradas", "quentes"] }, { certa: "flores", erradas: ["pedras", "moedas", "livros"] }] },
            { frase: "O cacto vive no [[0]]. Ele guarda muita [[1]] lá dentro.", lacunas: [{ certa: "deserto", erradas: ["rio", "polo norte", "supermercado"] }, { certa: "água", erradas: ["areia", "comida", "terra"] }] },
            { frase: "As árvores de fruto dão laranjas e [[0]]. No outono, as folhas [[1]].", lacunas: [{ certa: "maçãs", erradas: ["ovos", "brinquedos", "sapatos"] }, { certa: "caem", erradas: ["voam", "cantam", "dançar"] }] },
            { frase: "A raiz segura a planta na [[0]]. O caule leva a água às [[1]].", lacunas: [{ certa: "terra", erradas: ["água", "nuvem", "lua"] }, { certa: "folhas", erradas: ["raízes", "pedras", "casas"] }] },
            { frase: "As sementes precisam de ser [[0]]. Depois de algum tempo, elas [[1]].", lacunas: [{ certa: "sembreadas", erradas: ["comidas", "pintadas", "lavadas"] }, { certa: "germinam", erradas: ["fogem", "explodem", "derretem"] }] },
            { frase: "A roseira tem flores chamadas [[0]]. Ela também tem [[1]] que pica.", lacunas: [{ certa: "rosas", erradas: ["margaridas", "tulipas", "pinhas"] }, { certa: "espinhos", erradas: ["pelos", "penas", "dedos"] }] },
            { frase: "A laranjeira dá [[0]]. É uma árvore de [[1]].", lacunas: [{ certa: "laranjas", erradas: ["bananas", "maçãs", "uvas"] }, { certa: "fruto", erradas: ["metal", "vidro", "brinquedos"] }] },
            { frase: "As árvores limpam o nosso [[0]]. Devemos proteger a [[1]].", lacunas: [{ certa: "ar", erradas: ["chão", "rio", "mar"] }, { certa: "natureza", erradas: ["televisão", "estrada", "parede"] }] },
            { frase: "O tronco da árvore é feito de [[0]]. A sua parte de cima é a [[1]].", lacunas: [{ certa: "madeira", erradas: ["ferro", "gelo", "papel"] }, { certa: "copa", erradas: ["cave", "raiz", "porta"] }] },
            { frase: "As plantas bebem água pelas [[0]]. O Sol dá-lhes [[1]].", lacunas: [{ certa: "raízes", erradas: ["mãos", "folhas", "frutas"] }, { certa: "energia", erradas: ["frio", "sono", "chuva"] }] },
            { frase: "A macieira dá a [[0]]. No outono as folhas ficam [[1]].", lacunas: [{ certa: "maçã", erradas: ["banana", "pera", "uva"] }, { certa: "amarelas", erradas: ["azuis", "roxas", "pretas"] }] },
            { frase: "O pinheiro dá as [[0]]. Ele mantém as folhas no [[1]].", lacunas: [{ certa: "pinhas", erradas: ["maçãs", "uvas", "flores"] }, { certa: "inverno", erradas: ["mar", "fogo", "céu"] }] },
            { frase: "As plantas dão-nos o [[0]]. Sem elas não podíamos [[1]].", lacunas: [{ certa: "oxigénio", erradas: ["leite", "ouro", "gelo"] }, { certa: "respirar", erradas: ["nadar", "voar", "correr"] }] },
            { frase: "Existem plantas medicinais para fazer [[0]]. Elas ajudam na nossa [[1]].", lacunas: [{ certa: "chá", erradas: ["sumo", "pão", "bolo"] }, { certa: "saúde", erradas: ["escola", "carro", "casa"] }] },
            { frase: "A relva do estádio é muito [[0]]. Ela precisa de ser [[1]].", lacunas: [{ certa: "verde", erradas: ["azul", "vermelha", "preta"] }, { certa: "regada", erradas: ["pintada", "comida", "queimada"] }] },
            { frase: "Os musgos crescem em sítios [[0]]. Eles gostam da [[1]].", lacunas: [{ certa: "húmidos", erradas: ["secos", "quentes", "altos"] }, { certa: "sombra", erradas: ["praia", "areia", "fogo"] }] },
            { frase: "As algas vivem no [[0]]. Elas são plantas [[1]].", lacunas: [{ certa: "mar", erradas: ["deserto", "telhado", "céu"] }, { certa: "aquáticas", erradas: ["terrestres", "voadoras", "secas"] }] },
            { frase: "A cortiça vem do [[0]]. É uma árvore muito [[1]].", lacunas: [{ certa: "sobreiro", erradas: ["pinheiro", "macieira", "oliveira"] }, { certa: "importante", erradas: ["pequena", "doce", "baixa"] }] }
        ]
    }
};
