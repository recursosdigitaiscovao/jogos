// === CATEGORIAS DE DIFICULDADE (MENU RD) ===
const JOGO_CATEGORIAS = {
    "facil": {
        nome: "Nível Fácil",
        imgCapa: "objetos/bola.png",
        totalItens: 4,
        colunas: 2
    },
    "medio": {
        nome: "Nível Médio",
        imgCapa: "frutas/laranja.png",
        totalItens: 6,
        colunas: 3
    },
    "dificil": {
        nome: "Nível Difícil",
        imgCapa: "animaisselvagens/leao.png",
        totalItens: 8,
        colunas: 4
    }
};

// Base de dados consolidada para o sorteio lógico
const BANCO_DE_DADOS = {
    animais: [
        "animaisselvagens/abelha.png", "animaisselvagens/aguia.png", "animaisselvagens/aranha.png",
        "animaisselvagens/baleia.png", "animaisselvagens/canguru.png", "animaisselvagens/elefante.png",
        "animaisselvagens/foca.png", "animaisselvagens/leao.png", "animaisselvagens/macaco.png"
    ],
    frutos: [
        "frutas/amora.png", "frutas/ananas.png", "frutas/banana.png", "frutas/cereja.png",
        "frutas/laranja.png", "frutas/limao.png", "frutas/maca.png", "frutas/morango.png"
    ],
    objetos: [
        "objetos/balde.png", "objetos/bola.png", "objetos/boneca.png", "objetos/carrinho.png",
        "objetos/copo.png", "objetos/dado.png", "objetos/escova.png", "objetos/garrafa.png"
    ],
    material: [
        "materialescolar/afia.png", "materialescolar/borracha.png", "materialescolar/caderno.png",
        "materialescolar/cola.png", "materialescolar/estojo.png", "materialescolar/lapis.png",
        "materialescolar/mochila.png", "materialescolar/tesoura.png"
    ]
};
