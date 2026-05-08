// === DEFINIÇÃO DAS CATEGORIAS: COMPLETAR PALAVRAS ===
const JOGO_CATEGORIAS = {
    "Nível 1": {
        nome: "Vogais",
        imgCapa: "cnivel1.png",
        tipoLacuna: "vogais", // Esconde A, E, I, O, U...
        palavras: [
            // Animais Domésticos
            { termo: "PATO", img: "animaisdomesticos/pato.png" },
            { termo: "GATO", img: "animaisdomesticos/gato.png" },
            { termo: "CÃO", img: "animaisdomesticos/cao.png" },
            { termo: "VACA", img: "animaisdomesticos/vaca.png" },
            { termo: "GALO", img: "animaisdomesticos/galo.png" },
            { termo: "PERU", img: "animaisdomesticos/peru.png" },
            // Frutas
            { termo: "MAÇÃ", img: "frutas/maca.png" },
            { termo: "PERA", img: "frutas/pera.png" },
            { termo: "FIGO", img: "frutas/figo.png" },
            { termo: "KIWI", img: "frutas/kiwi.png" },
            // Material Escolar
            { termo: "COLA", img: "materialescolar/cola.png" },
            { termo: "AFIA", img: "materialescolar/afia.png" },
            { termo: "CAPA", img: "materialescolar/capa.png" }
        ]
    },
    "Nível 2": {
        nome: "Consoantes",
        imgCapa: "cnivel2.png",
        tipoLacuna: "consoantes", // Esconde P, T, V, C...
        palavras: [
            // Animais Domésticos
            { termo: "PORCO", img: "animaisdomesticos/porco.png" },
            { termo: "CABRA", img: "animaisdomesticos/cabra.png" },
            { termo: "BURRO", img: "animaisdomesticos/burro.png" },
            { termo: "COELHO", img: "animaisdomesticos/coelho.png" },
            // Animais Selvagens
            { termo: "LEÃO", img: "animaisselvagens/leao.png" },
            { termo: "LOBO", img: "animaisselvagens/lobo.png" },
            { termo: "FOCA", img: "animaisselvagens/foca.png" },
            { termo: "ZBRA", img: "animaisselvagens/zebra.png" }, // Se existir zebra, senão:
            { termo: "PANDA", img: "animaisselvagens/panda.png" },
            // Frutas
            { termo: "BANANA", img: "frutas/banana.png" },
            { termo: "LIMÃO", img: "frutas/limao.png" },
            { termo: "AMORA", img: "frutas/amora.png" },
            // Material Escolar
            { termo: "LIVRO", img: "materialescolar/livro.png" },
            { termo: "LÁPIS", img: "materialescolar/lapis.png" },
            { termo: "FOLHA", img: "materialescolar/folha.png" }
        ]
    },
    "Nível 3": {
        nome: "Vogais e Consoantes",
        imgCapa: "cnivel3.png",
        tipoLacuna: "mista", // Esconde letras alternadas
        palavras: [
            // Animais Selvagens (Palavras Longas)
            { termo: "GIRAFA", img: "animaisselvagens/girafa.png" },
            { termo: "MACACO", img: "animaisselvagens/macaco.png" },
            { termo: "ELEFANTE", img: "animaisselvagens/elefante.png" },
            { termo: "GORILA", img: "animaisselvagens/gorila.png" },
            { termo: "TUBARÃO", img: "animaisselvagens/tubarao.png" },
            { termo: "HIPOPÓTAMO", img: "animaisselvagens/hipopotamo.png" },
            { termo: "CROCODILO", img: "animaisselvagens/crocodilo.png" },
            { termo: "PAPAGAIO", img: "animaisselvagens/papagaio.png" },
            // Frutas
            { termo: "MELANCIA", img: "frutas/melancia.png" },
            { termo: "MARACUJÁ", img: "frutas/maracuja.png" },
            { termo: "MORANGO", img: "frutas/morango.png" },
            { termo: "DIÓSPIRO", img: "frutas/diospiro.png" },
            // Material Escolar
            { termo: "MOCHILA", img: "materialescolar/mochila.png" },
            { termo: "ESTOJO", img: "materialescolar/estojo.png" },
            { termo: "CADERNO", img: "materialescolar/caderno.png" },
            { termo: "TESOURA", img: "materialescolar/tesoura.png" },
            { termo: "ESQUADRO", img: "materialescolar/esquadro.png" },
            { termo: "BORRACHA", img: "materialescolar/borracha.png" }
        ]
    }
};
