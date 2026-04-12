const JOGO_CONFIG = {
    caminhoImg: "../../../img/",         
    caminhoIcons: "../../../icons/",     
    caminhoCat: "../../../img/cat/",     
    iconesMenu: { pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" }
};

const JOGO_ORDEM_DATA = {
    categorias: {
        letras: { 
            nome: 'Letras do Alfabeto', 
            img: 'cat_letras.png', 
            niveis: [ { n: 1, qtd: 4, tipo: 'seq', titulo: '4 Letras' } ] 
        },
        mesma: { 
            nome: 'Mesma Letra Inicial', 
            img: 'cat_mesma.png', 
            niveis: [ { n: 1, qtd: 4, tipo: 'mesma', titulo: 'Dicionário' } ] 
        }
    },
    bancoMesma: {
        C: ["Cama", "Carro", "Casa", "Copo", "Cebola", "Coelho"],
        M: ["Mala", "Maçã", "Mesa", "Mola", "Muro", "Moeda"],
        B: ["Bala", "Bota", "Bico", "Bule", "Bolo", "Balao"],
        P: ["Pato", "Pera", "Pipa", "Pudim", "Porta", "Peixe"]
    }
};
