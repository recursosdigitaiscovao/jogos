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
        trator: "trator1.png",
        reboque: "reboque.png",   // ✅ adicionado (faltava no teu código)
        fardo: "fardo.png",
        dezena: "cubo.png",       // ✅ agora +10 usa cubo
        unidade: "cubo.png",
        borracha: "borracha.png"  // ✅ botão limpar com imagem
    },

    niveis: {
        1: { instrucao: "Carrega o trator com o número indicado." },
        2: { instrucao: "Conta os cubos e escolhe o número correto." }
    },

    mensagens: {
        excelente: "Incrível! És um mestre das dezenas! 🌟",
        bom: "Muito bem! Estás no bom caminho! 👍",
        tenta: "Bom esforço! Continua a praticar! 💪"
    }
};
