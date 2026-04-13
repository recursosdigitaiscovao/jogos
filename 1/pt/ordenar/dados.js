const JOGO_CONFIG = {
    caminhoImg: "../../../img/",         
    caminhoIcons: "../../../icons/",     
    caminhoCat: "../../../imgcategorias/",     
    iconesMenu: { 
        pre: "iconpre.png", 
        ano1: "icon1.png", 
        ano2: "icon2.png", 
        ano3: "icon3.png", 
        ano4: "icon4.png" 
    }
};

const JOGO_ORDEM_DATA = {
    categorias: {
        letras_consec: { id: 'letras_consec', nome: 'Letras (Consecutivas)', titulo: 'Siga o Alfabeto' },
        letras_aleat: { id: 'letras_aleat', nome: 'Letras (Aleatórias)', titulo: 'Letras Misturadas' },
        mesma_inicial: { id: 'mesma_inicial', nome: 'Mesma Letra Inicial', titulo: 'Dicionário Mágico' },
        palavras_geral: { id: 'palavras_geral', nome: 'Palavras Variadas', titulo: 'Ordem das Coisas' }
    },
    bancoMesma: {
        C: ["Cama", "Carro", "Casa", "Copo", "Cebola", "Coelho"],
        M: ["Mala", "Maçã", "Mesa", "Meia", "Milho", "Mola"],
        B: ["Bala", "Bota", "Bico", "Bule", "Bolo", "Balão"],
        P: ["Pato", "Pera", "Pipa", "Pudim", "Porta", "Peixe"],
        A: ["Abacate", "Abacaxi", "Abelha", "Agulha", "Anel", "Anta"]
    },
    bancoGeral: [
        "Abelha", "Bola", "Cachorro", "Dado", "Elefante", "Foca", "Gato", "Hipopótamo", 
        "Ilha", "Jacaré", "Ketchup", "Leão", "Macaco", "Navio", "Ovo", "Pato", 
        "Queijo", "Rato", "Sapo", "Tigre", "Uva", "Vaca", "Waffle", "Xícara", "Zebra"
    ]
};
};
