const JOGO_CONFIG = {
    caminhoImg: "../../../img/",         
    caminhoIcons: "../../../icons/",     
    caminhoCat: "../../../img/cat/",     

    iconesMenu: { 
        pre: "iconpre.png", 
        ano1: "icon1.png", 
        ano2: "icon2.png", 
        ano3: "icon3.png", 
        ano4: "icon4.png" 
    },
    
    relatorio: {
        pontosTotal: "Livros Ordenados:",
        tempoTotal: "Tempo na Biblioteca:"
    }
};

const JOGO_ORDEM_DATA = {
    categorias: {
        letras: { 
            nome: 'Páginas Soltas (Letras)', 
            img: 'cat_letras.png', 
            niveis: [ 
                { n: 1, qtd: 6, tipo: 'seq', titulo: 'Letras Seguidas' }, 
                { n: 2, qtd: 6, tipo: 'alt', titulo: 'Letras Saltadas' } 
            ] 
        },
        mesma: { 
            nome: 'Secções do Dicionário', 
            img: 'cat_mesma.png', 
            niveis: [ 
                { n: 1, qtd: 6, tipo: 'mesma', titulo: 'Mesma Letra Inicial' }
            ] 
        },
        mix: { 
            nome: 'Biblioteca em Caos', 
            img: 'cat_mix.png', 
            niveis: [ 
                { n: 1, qtd: 6, tipo: 'mix', titulo: 'Desafio Total' } 
            ] 
        }
    },
    // Banco focado em palavras com a mesma inicial para a Categoria 2
    bancoMesma: {
        C: ["Cama", "Caneta", "Carro", "Casa", "Cavalo", "Copo", "Cebola", "Coelho"],
        M: ["Mala", "Maçã", "Mesa", "Meia", "Milho", "Mola", "Muro", "Moeda"],
        B: ["Bala", "Baleia", "Barco", "Batom", "Bexiga", "Bico", "Bolo", "Bule"],
        P: ["Papa", "Pato", "Pena", "Pera", "Pipa", "Poço", "Pulo", "Pudim"],
        A: ["Abacate", "Abacaxi", "Abelha", "Agulha", "Anel", "Anta", "Aranha", "Avião"]
    },
    bancoGeral: ["Zebra", "Dado", "Foca", "Gato", "Hipopótamo", "Ilha", "Joaninha", "Lua", "Nuvem", "Ovelha", "Rato", "Sapo", "Tatu", "Uva", "Vaca"]
};
