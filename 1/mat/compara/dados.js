// dados.js
const JOGO_CONFIG = {
    // Caminhos para as pastas
    caminhoIcons: "../../../icons/", 
    caminhoImg: "../../../img/",     

    // Ícones usados no Menu e na Barra de Navegação
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },

    // Lista de números para o Nível 2 (Símbolos) e Jogo de Ligar
    // Nota: Os nomes das imagens seguem o padrão da tua imagem: zero.png, um.png, etc.
    numeros: [
        { valor: 0, palavra: "ZERO", imagem: "zero.png" },
        { valor: 1, palavra: "UM", imagem: "um.png" },
        { valor: 2, palavra: "DOIS", imagem: "dois.png" },
        { valor: 3, palavra: "TRÊS", imagem: "tres.png" },
        { valor: 4, palavra: "QUATRO", imagem: "quatro.png" },
        { valor: 5, palavra: "CINCO", imagem: "cinco.png" },
        { valor: 6, palavra: "SEIS", imagem: "seis.png" },
        { valor: 7, palavra: "SETE", imagem: "sete.png" },
        { valor: 8, palavra: "OITO", imagem: "oito.png" },
        { valor: 9, palavra: "NOVE", imagem: "nove.png" },
        { valor: 10, palavra: "DEZ", imagem: "dez.png" }
    ],

    // Lista de frutas para o Nível 1 (Comparação de quantidades)
    frutas: [
        "ananas.png", 
        "banana.png", 
        "cereja.png", 
        "kiwi.png", 
        "laranja.png", 
        "maca.png", 
        "melancia.png", 
        "morango.png", 
        "papaia.png", 
        "pera.png", 
        "uvas.png"
    ],

    // Mensagens de feedback final
    mensagens: {
        excelente: "Incrível! És um mestre da matemática! 🌟",
        bom: "Muito bem! Estás no bom caminho! 👍",
        tenta: "Bom esforço! Continua a praticar! 💪"
    }
};
