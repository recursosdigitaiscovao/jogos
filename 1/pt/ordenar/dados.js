const JOGO_CONFIG = {
    caminhoImg: "../../../img/",         
    caminhoIcons: "../../../icons/",     
    caminhoCat: "../../../imgcategorias",     

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
        letras: { 
            id: 'letras',
            nome: 'Letras do Alfabeto', 
            img: 'cat_letras.png', 
            titulo: 'As Letras Soltas'
        },
        mesma: { 
            id: 'mesma',
            nome: 'Mesma Letra Inicial', 
            img: 'cat_mesma.png', 
            titulo: 'Dicionário Mágico'
        }
    },
    bancoMesma: {
        C: ["Cama", "Carro", "Casa", "Copo", "Cebola", "Coelho"],
        M: ["Mala", "Maçã", "Mesa", "Meia", "Milho", "Mola"],
        B: ["Bala", "Bota", "Bico", "Bule", "Bolo", "Balao"],
        P: ["Pato", "Pera", "Pipa", "Pudim", "Porta", "Peixe"],
        A: ["Abacate", "Abacaxi", "Abelha", "Agulha", "Anel", "Anta"]
    }
};
