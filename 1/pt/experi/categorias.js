const JOGO_CATEGORIAS = {
    nivel1: {
        nome: "Animais",
        descricao: "Clica nas lacunas e escolhe a palavra correta sobre os Animais!",
        imgCapa: "animaisdomesticos/cao.png",
        textos: [
            {
                frase: "O cão é o melhor amigo do [[0]]. Ele gosta muito de roer [[1]].",
                lacunas: [
                    { certa: "homem", erradas: ["gato", "carro", "balão"] },
                    { certa: "ossos", erradas: ["pedras", "frutas", "folhas"] }
                ]
            },
            {
                frase: "O leão é conhecido como o rei da [[0]]. Ele tem uma grande [[1]].",
                lacunas: [
                    { certa: "selva", erradas: ["quinta", "cidade", "casa"] },
                    { certa: "juba", erradas: ["tromba", "cauda", "asa"] }
                ]
            },
            {
                frase: "O elefante usa a sua [[0]] para beber água. Ele é um animal muito [[1]].",
                lacunas: [
                    { certa: "tromba", erradas: ["orelha", "perna", "língua"] },
                    { certa: "pesado", erradas: ["leve", "pequeno", "voador"] }
                ]
            },
            {
                frase: "A girafa tem um pescoço muito [[0]]. Ela come as folhas das [[1]].",
                lacunas: [
                    { certa: "comprido", erradas: ["curto", "baixo", "largo"] },
                    { certa: "árvores", erradas: ["nuvens", "casas", "rochas"] }
                ]
            },
            {
                frase: "O tubarão vive no [[0]]. Ele tem dentes muito [[1]].",
                lacunas: [
                    { certa: "oceano", erradas: ["rio", "deserto", "bosque"] },
                    { certa: "afiados", erradas: ["moles", "doces", "azuis"] }
                ]
            }
        ]
    },
    nivel2: {
        nome: "Plantas",
        descricao: "Completa os textos sobre o mundo das Plantas!",
        imgCapa: "comida/alface.png",
        textos: [
            {
                frase: "Para crescer, a planta precisa de água e [[0]]. As raízes ficam debaixo da [[1]].",
                lacunas: [
                    { certa: "luz", erradas: ["fogo", "neve", "noite"] },
                    { certa: "terra", erradas: ["mesa", "estrada", "nuvem"] }
                ]
            },
            {
                frase: "O girassol vira-se sempre para o [[0]]. Ele tem pétalas [[1]].",
                lacunas: [
                    { certa: "sol", erradas: ["mar", "vento", "frio"] },
                    { certa: "amarelas", erradas: ["azuis", "pretas", "cinzentas"] }
                ]
            },
            {
                frase: "As folhas das plantas costumam ser [[0]]. Algumas plantas dão [[1]] coloridas.",
                lacunas: [
                    { certa: "verdes", erradas: ["roxas", "quadradas", "quentes"] },
                    { certa: "flores", erradas: ["pedras", "moedas", "livros"] }
                ]
            },
            {
                frase: "O cacto vive no [[0]]. Ele guarda muita [[1]] lá dentro.",
                lacunas: [
                    { certa: "deserto", erradas: ["rio", "polo norte", "supermercado"] },
                    { certa: "água", erradas: ["areia", "comida", "terra"] }
                ]
            },
            {
                frase: "As árvores de fruto dão laranjas e [[0]]. No outono, as folhas costumam [[1]].",
                lacunas: [
                    { certa: "maçãs", erradas: ["ovos", "brinquedos", "sapatos"] },
                    { certa: "cair", erradas: ["voar", "cantar", "dançar"] }
                ]
            }
        ]
    }
};
