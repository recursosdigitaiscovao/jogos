// === DEFINIÇÃO DAS CATEGORIAS E ITENS ===
const JOGO_CATEGORIAS = {
    animais: {
        nome: "Animais", exemplo: "E-LE-FAN-TE", exemploImg: "animaisselvagens/elefante.png", total: 4, imgCapa: "animaisselvagens/leao.png",
        itens: [
            { nome: "ABELHA", silabas: 3, img: "animaisselvagens/abelha.png" },
            { nome: "ÁGUIA", silabas: 3, img: "animaisselvagens/aguia.png" },
            { nome: "ARANHA", silabas: 3, img: "animaisselvagens/aranha.png" },
            { nome: "BALEIA", silabas: 3, img: "animaisselvagens/baleia.png" },
            { nome: "CANGURU", silabas: 3, img: "animaisselvagens/canguru.png" },
            { nome: "CARANGUEIJO", silabas: 4, img: "animaisselvagens/carangueijo.png" },
            { nome: "COALA", silabas: 3, img: "animaisselvagens/coala.png" },
            { nome: "CROCODILO", silabas: 4, img: "animaisselvagens/crocodilo.png" },
            { nome: "ELEFANTE", silabas: 4, img: "animaisselvagens/elefante.png" },
            { nome: "FOCA", silabas: 2, img: "animaisselvagens/foca.png" },
            { nome: "GORILA", silabas: 3, img: "animaisselvagens/gorila.png" },
            { nome: "LEÃO", silabas: 2, img: "animaisselvagens/leao.png" },
            { nome: "MACACO", silabas: 3, img: "animaisselvagens/macaco.png" },
            { nome: "PAPAGAIO", silabas: 4, img: "animaisselvagens/papagaio.png" }
        ]
    },
    frutos: {
        nome: "Frutos", exemplo: "MO-RAN-GO", exemploImg: "frutas/morango.png", total: 3, imgCapa: "frutas/maca.png",
        itens: [
            { nome: "AMORA", silabas: 3, img: "frutas/amora.png" },
            { nome: "ANANÁS", silabas: 3, img: "frutas/ananas.png" },
            { nome: "BANANA", silabas: 3, img: "frutas/banana.png" },
            { nome: "CASTANHA", silabas: 3, img: "frutas/castanha.png" },
            { nome: "CEREJA", silabas: 3, img: "frutas/cereja.png" },
            { nome: "DIÓSPIRO", silabas: 3, img: "frutas/diospiro.png" },
            { nome: "FIGO", silabas: 2, img: "frutas/figo.png" },
            { nome: "GOIABA", silabas: 3, img: "frutas/goiaba.png" },
            { nome: "KIWI", silabas: 2, img: "frutas/kiwi.png" },
            { nome: "LARANJA", silabas: 3, img: "frutas/laranja.png" },
            { nome: "LIMÃO", silabas: 2, img: "frutas/limao.png" },
            { nome: "MAÇÃ", silabas: 2, img: "frutas/maca.png" },
            { nome: "MARACUJÁ", silabas: 4, img: "frutas/maracuja.png" },
            { nome: "MELANCIA", silabas: 4, img: "frutas/melancia.png" },
            { nome: "MELÃO", silabas: 2, img: "frutas/melao.png" },
            { nome: "MORANGO", silabas: 3, img: "frutas/morango.png" }
        ]
    },
    objetos: {
        nome: "Objetos", exemplo: "BO-NE-CA", exemploImg: "objetos/boneca.png", total: 3, imgCapa: "objetos/bola.png",
        itens: [
            { nome: "BALDE", silabas: 2, img: "objetos/balde.png" },
            { nome: "BOLA", silabas: 2, img: "objetos/bola.png" },
            { nome: "BONECA", silabas: 3, img: "objetos/boneca.png" },
            { nome: "CARRINHO", silabas: 3, img: "objetos/carrinho.png" },
            { nome: "CESTO", silabas: 2, img: "objetos/cesto.png" },
            { nome: "COLHER", silabas: 2, img: "objetos/colher.png" },
            { nome: "COPO", silabas: 2, img: "objetos/copo.png" },
            { nome: "DADO", silabas: 2, img: "objetos/dado.png" },
            { nome: "DEDAL", silabas: 2, img: "objetos/dedal.png" },
            { nome: "DRAGÃO", silabas: 2, img: "objetos/dragao.png" },
            { nome: "ESCOVA", silabas: 3, img: "objetos/escova.png" },
            { nome: "GARFO", silabas: 2, img: "objetos/garfo.png" },
            { nome: "GARRAFA", silabas: 3, img: "objetos/garrafa.png" },
            { nome: "ISQUEIRO", silabas: 3, img: "objetos/isqueiro.png" },
            { nome: "ÓCULOS", silabas: 3, img: "objetos/oculos.png" }
        ]
    },
    material: {
        nome: "Material Escolar", exemplo: "MO-CHI-LA", exemploImg: "materialescolar/mochila.png", total: 3, imgCapa: "materialescolar/estojo.png",
        itens: [
            { nome: "AFIA", silabas: 2, img: "materialescolar/afia.png" },
            { nome: "BORRACHA", silabas: 3, img: "materialescolar/borracha.png" },
            { nome: "CADERNO", silabas: 3, img: "materialescolar/caderno.png" },
            { nome: "CANETA", silabas: 3, img: "materialescolar/caneta.png" },
            { nome: "CAPA", silabas: 2, img: "materialescolar/capa.png" },
            { nome: "COLA", silabas: 2, img: "materialescolar/cola.png" },
            { nome: "ESQUADRO", silabas: 3, img: "materialescolar/esquadro.png" },
            { nome: "ESTOJO", silabas: 3, img: "materialescolar/estojo.png" },
            { nome: "FOLHA", silabas: 2, img: "materialescolar/folha.png" },
            { nome: "LÁPIS", silabas: 2, img: "materialescolar/lapis.png" },
            { nome: "LIVRO", silabas: 2, img: "materialescolar/livro.png" },
            { nome: "MOCHILA", silabas: 3, img: "materialescolar/mochila.png" },
            { nome: "PINCEL", silabas: 2, img: "materialescolar/pincel.png" },
            { nome: "RÉGUA", silabas: 2, img: "materialescolar/regua.png" },
            { nome: "TESOURA", silabas: 3, img: "materialescolar/tesoura.png" }
        ]
    }
};
