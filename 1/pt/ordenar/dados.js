const JOGO_CONFIG = {
    caminhoImg: "../../../img/",         
    caminhoIcons: "../../../icons/",     
    iconesMenu: { pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" }
};

const JOGO_ORDEM_DATA = {
    categorias: {
        consec: { id: 'consec', nome: '1. Letras Consecutivas', titulo: 'Sequência Alfabética' },
        aleat: { id: 'aleat', nome: '2. Letras Alternadas', titulo: 'Letras Misturadas' },
        mesma: { id: 'mesma', nome: '3. Mesma Letra Inicial', titulo: 'Dicionário Mágico' },
        variadas: { id: 'variadas', nome: '4. Palavras Variadas', titulo: 'Ordem Geral' }
    },
    bancoMesma: {
        C: ["Cama", "Carro", "Casa", "Copo", "Cebola", "Coelho"],
        M: ["Mala", "Maçã", "Mesa", "Meia", "Milho", "Mola"],
        B: ["Bala", "Bota", "Bico", "Bule", "Bolo", "Balão"],
        P: ["Pato", "Pera", "Pipa", "Pudim", "Porta", "Peixe"],
        A: ["Abacate", "Abacaxi", "Abelha", "Agulha", "Anel", "Anta"]
    },
    bancoGeral: ["Abelha", "Bola", "Cachorro", "Dado", "Elefante", "Foca", "Gato", "Jacaré", "Leão", "Macaco", "Navio", "Ovo", "Pato", "Queijo", "Rato", "Sapo", "Tigre", "Uva", "Vaca", "Zebra"]
};
