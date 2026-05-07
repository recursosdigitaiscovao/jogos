// === DEFINIÇÃO DAS CATEGORIAS: COMPLETAR PALAVRAS ===
const JOGO_CATEGORIAS = {
    "Nível 1": {
        nome: "Faltam as Vogais",
        imgCapa: "cnivel1.png",
        tipoLacuna: "vogais", // Regra: Esconde A, E, I, O, U...
        palavras: [
            { termo: "PATO", img: "animaisdomesticos/pato.png" },
            { termo: "BOLA", img: "materialescolar/bola.png" }, // Exemplo, assume que existe
            { termo: "GATO", img: "animaisdomesticos/gato.png" },
            { termo: "MACA", img: "frutas/maca.png" }
        ]
    },
    "Nível 2": {
        nome: "Faltam as Consoantes",
        imgCapa: "cnivel2.png",
        tipoLacuna: "consoantes", // Regra: Esconde P, T, V, C...
        palavras: [
            { termo: "VACA", img: "animaisdomesticos/vaca.png" },
            { termo: "COLA", img: "materialescolar/cola.png" },
            { termo: "LIVRO", img: "materialescolar/livro.png" },
            { termo: "PERA", img: "frutas/pera.png" }
        ]
    },
    "Nível 3": {
        nome: "Vogais e Consoantes",
        imgCapa: "cnivel3.png",
        tipoLacuna: "mista", // Regra: Esconde letras alternadas
        palavras: [
            { termo: "CAVALO", img: "animaisdomesticos/cavalo.png" },
            { termo: "ESTOJO", img: "materialescolar/estojo.png" },
            { termo: "BANANA", img: "frutas/banana.png" },
            { termo: "MOCHILA", img: "materialescolar/mochila.png" }
        ]
    }
};
