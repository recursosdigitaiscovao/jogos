// dados.js
const JOGO_CONFIG = {
    caminhoIcons: "../../../icons/", 
    caminhoImg: "../../../img/",     
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },
    veiculos: {
        trator: "trator.png",
        reboque: "reboque.png",
        fardo: "fardo.png",    // A palha que aparece nos reboques
        dezena: "barra.png",   // Ícone do botão +10
        unidade: "cubo.png",   // Ícone do botão +1
        borracha: "borracha.png" // Imagem para o botão de limpar
    },
    niveis: {
        1: {
            titulo: "Nível 1",
            instrucao: "Carrega o trator com o número indicado:",
            tipo: "carregar" 
        },
        2: {
            titulo: "Nível 2",
            instrucao: "Quantos fardos de palha leva o trator?",
            tipo: "identificar" 
        },
        3: {
            titulo: "Nível 3",
            instrucao: "Carrega o trator seguindo as ordens:",
            tipo: "ordens" 
        }
    },
    terminologia: {
        dezenaSingular: "dezena",
        dezenaPlural: "dezenas",
        unidadeSingular: "unidade",
        unidadePlural: "unidades",
        conjuncao: "e"
    },
    mensagens: {
        excelente: "Incrível! És um mestre das dezenas! 🌟",
        bom: "Muito bem! Estás no bom caminho! 👍",
        tenta: "Bom esforço! Continua a praticar! 💪"
    },
    relatorio: {
        titulo: "Relatório de Colheita",
        pontosTotal: "Total de Pontos:",
        tempoTotal: "Tempo Total:",
        labelNivel: "Nível",
        labelCertas: "Certas:",
        labelErradas: "Erradas:"
    }
};
