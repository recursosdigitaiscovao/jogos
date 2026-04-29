// === CATEGORIAS PARA O INTRUSO ===
const JOGO_CATEGORIAS = {
    "geral": {
        nome: "Mistura Divertida",
        imgCapa: "objetos/bola.png",
        // O jogo vai cruzar dados entre Animais, Frutos, Objetos e Material Escolar
        grupos: ["animais", "frutos", "objetos", "material"]
    }
};

// Dados de suporte (os mesmos que já tens no teu projeto)
const DADOS_GRUPOS = {
    animais: [
        { img: "animaisselvagens/abelha.png" }, { img: "animaisselvagens/aguia.png" },
        { img: "animaisselvagens/elefante.png" }, { img: "animaisselvagens/leao.png" },
        { img: "animaisselvagens/macaco.png" }, { img: "animaisselvagens/girafa.png" }
    ],
    frutos: [
        { img: "frutas/amora.png" }, { img: "frutas/ananas.png" },
        { img: "frutas/banana.png" }, { img: "frutas/cereja.png" },
        { img: "frutas/laranja.png" }, { img: "frutas/maca.png" }
    ],
    objetos: [
        { img: "objetos/balde.png" }, { img: "objetos/bola.png" },
        { img: "objetos/boneca.png" }, { img: "objetos/carrinho.png" },
        { img: "objetos/copo.png" }, { img: "objetos/dado.png" }
    ],
    material: [
        { img: "materialescolar/afia.png" }, { img: "materialescolar/borracha.png" },
        { img: "materialescolar/caderno.png" }, { img: "materialescolar/lapis.png" },
        { img: "materialescolar/mochila.png" }, { img: "materialescolar/tesoura.png" }
    ]
};
