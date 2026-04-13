const JOGO_CONFIG = {
    caminhoImg: "../../../img/",         
    caminhoIcons: "../../../icons/",     
    caminhoCat: "../../../imgcategorias/",     
    iconesMenu: { pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" }
};

const JOGO_ORDEM_DATA = {
    categorias: {
        letras_n1: { id: 'letras_n1', nome: 'Letras (Consecutivas)', titulo: 'Siga o Alfabeto', tipo: 'letras', nivel: 1 },
        letras_n2: { id: 'letras_n2', nome: 'Letras (Aleatórias)', titulo: 'Letras Soltas', tipo: 'letras', nivel: 2 },
        mesma_letra: { id: 'mesma_letra', nome: 'Mesma Letra Inicial', titulo: 'Dicionário Mágico', tipo: 'mesma' },
        palavras_geral: { id: 'palavras_geral', nome: 'Palavras Variadas', titulo: 'Ordem das Coisas', tipo: 'geral' }
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
