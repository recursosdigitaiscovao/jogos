// dados.js
const JOGO_CONFIG = {
    // Caminhos de diretoria (Ajustados para jogos/1/mat/formas/)
    caminhoIcons: "../../../icons/",
    caminhoImg: "../../../img/formas/", // Pasta onde estão as figuras geométricas

    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },

    // Definição das Formas e Cores disponíveis
    formas: ["circulo", "quadrado", "triangulo", "retangulo", "pentagono", "hexagono"],
    cores: ["vd", "a", "l", "v"], // vd=verde, a=azul, l=laranja, v=vermelho

    // Traduções para as instruções
    nomesFormas: {
        "circulo": "Círculos",
        "quadrado": "Quadrados",
        "triangulo": "Triângulos",
        "retangulo": "Retângulos",
        "pentagono": "Pentágonos",
        "hexagono": "Hexágonos"
    }
};
