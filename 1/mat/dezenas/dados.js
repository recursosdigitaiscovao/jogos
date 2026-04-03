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
        unidade: "cubo.png"    // Ícone do botão +1
    },
    // Configurações de cada nível
    niveis: {
        1: {
            titulo: "Nível 1 - Representação",
            instrucao: "Carrega o trator com o número indicado:",
            tipo: "carregar" // O aluno clica nos botões para encher o trator
        },
        2: {
            titulo: "Nível 2 - Identificação",
            instrucao: "Quantos fardos de palha leva o trator?",
            tipo: "identificar" // O trator vem cheio e o aluno escolhe o número
        },
        3: {
            titulo: "Nível 3 - Ordens",
            instrucao: "Carrega o trator seguindo as ordens:",
            tipo: "ordens" // Aparece "X dezenas e Y unidades"
        }
    },
    // Escrita das ordens para o Nível 3
    terminologia: {
        dezenaSingular: "dezena",
        dezenaPlural: "dezenas",
        unidadeSingular: "unidade",
        unidadePlural: "unidades",
        conjuncao: "e"
    },
    // Mensagens do Popup Final
    mensagens: {
        excelente: "Incrível! És um verdadeiro mestre do campo! 🌟",
        bom: "Muito bem! Fizeste uma excelente colheita! 👍",
        tenta: "Bom esforço! Continua a praticar para seres um mestre! 💪"
    },
    // Textos do Relatório Final (Popup)
    relatorio: {
        titulo: "Relatório de Colheita",
        pontuacao: "Pontuação Total:",
        certas: "Certas",
        erradas: "Erradas",
        tempo: "Tempo Total:"
    }
};
