const JOGO_CATEGORIAS = {
    nivel1: {
        nome: "Nível 1",
        descricao: "Alimenta o monstrinho apenas com frutas VERMELHAS!",
        imgCapa: "frutas/maca.png", // Imagem de exemplo na tua pasta
        targetProp: "vermelho",
        itens: [
            { id: 1, type: "vermelho", icon: "🍎" },
            { id: 2, type: "vermelho", icon: "🍓" },
            { id: 3, type: "amarelo", icon: "🍌" },
            { id: 4, type: "verde", icon: "🍏" }
        ]
    },
    nivel2: {
        nome: "Nível 2",
        descricao: "O monstrinho quer comer apenas DOCES saborosos!",
        imgCapa: "objetos/doce.png",
        targetProp: "doce",
        items: [
            { id: 5, type: "doce", icon: "🍩" },
            { id: 6, type: "saudavel", icon: "🥦" },
            { id: 7, type: "doce", icon: "🍦" },
            { id: 8, type: "saudavel", icon: "Carne" }
        ]
    },
    nivel3: {
        nome: "Nível 3",
        descricao: "O monstrinho quer comer apenas ANIMAIS!",
        imgCapa: "animais/leao.png",
        targetProp: "animal",
        items: [
            { id: 9, type: "animal", icon: "🐸" },
            { id: 10, type: "veiculo", icon: "🚗" },
            { id: 11, type: "animal", icon: "🐱" },
            { id: 12, type: "veiculo", icon: "✈️" }
        ]
    }
};
