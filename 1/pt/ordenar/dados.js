const JOGO_CONFIG = {
    caminhoImg: "../../../img/",         
    caminhoIcons: "../../../icons/",     
    caminhoCat: "../../../img/cat/",     

    iconesMenu: { pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    relatorio: { pontosTotal: "Organização:", tempoTotal: "Tempo:" }
};

const JOGO_ORDEM_DATA = {
    categorias: {
        letras: { 
            nome: 'Páginas Soltas (Letras)', 
            img: 'cat_letras.png', 
            niveis: [ 
                { n: 1, qtd: 6, tipo: 'seq', titulo: 'O Armário das Letras' }, 
                { n: 2, qtd: 6, tipo: 'alt', titulo: 'Letras Saltadas' } 
            ] 
        },
        mesma: { 
            nome: 'Secções do Dicionário', 
            img: 'cat_mesma.png', 
            niveis: [ { n: 1, qtd: 6, tipo: 'mesma', titulo: 'Mesma Letra Inicial' } ] 
        }
    },
    bancoMesma: {
        C: ["Cama", "Caneta", "Carro", "Casa", "Cavalo", "Copo"],
        M: ["Mala", "Maçã", "Mesa", "Meia", "Milho", "Mola"]
    }
};
