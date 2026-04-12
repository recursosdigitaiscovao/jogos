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
    },
    
    relatorio: {
        pontosTotal: "Pontos:",
        tempoTotal: "Tempo:"
    }
};

const JOGO_ORDEM_DATA = {
    categorias: {
        letras: { 
            nome: 'Letras do Alfabeto', 
            img: 'cat_letras.png', 
            niveis: [ 
                { n: 1, qtd: 6, tipo: 'seq', titulo: 'O Armário das Letras' }, 
                { n: 2, qtd: 6, tipo: 'alt', titulo: 'Letras Saltadas' } 
            ] 
        },
        mesma: { 
            nome: 'Mesma Letra Inicial', 
            img: 'cat_mesma.png', 
            niveis: [ { n: 1, qtd: 6, tipo: 'mesma', titulo: 'Dicionário Mágico' } ] 
        }
    },
    bancoMesma: {
        C: ["Cama", "Caneta", "Carro", "Casa", "Cavalo", "Copo"],
        M: ["Mala", "Maçã", "Mesa", "Meia", "Milho", "Mola"]
    }
};
