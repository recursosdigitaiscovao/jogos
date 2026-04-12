const JOGO_CONFIG = {
    caminhoImg: "../../../img/",         // Caminho para imagens gerais (ex: rd.png)
    caminhoIcons: "../../../icons/",     // Caminho para ícones do sistema
    caminhoCat: "../../../imgategorias/",     // Caminho para imagens das categorias

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
            nome: 'Letras do Alfabeto', 
            img: 'cat_letras.png', 
            niveis: [ 
                { n: 1, qtd: 6, tipo: 'seq', titulo: 'Letras Seguidas' }, 
                { n: 2, qtd: 6, tipo: 'alt', titulo: 'Letras Saltadas' } 
            ] 
        },
        mesma: { 
            nome: 'Mesma Letra Inicial', 
            img: 'cat_mesma.png', 
            niveis: [ 
                { n: 1, qtd: 6, tipo: 'mesma', titulo: '6 Palavras' }, 
                { n: 2, qtd: 9, tipo: 'mesma', titulo: '9 Palavras' } 
            ] 
        },
        mix: { 
            nome: 'Tudo Misturado', 
            img: 'cat_mix.png', 
            niveis: [ 
                { n: 1, qtd: 6, tipo: 'mix', titulo: '6 Palavras' }, 
                { n: 2, qtd: 9, tipo: 'mix', titulo: '9 Palavras' } 
            ] 
        }
    },

    banco: {
        A: ["Abelha", "Abacaxi", "Anel", "Aranha", "Avião", "Alface", "Anta", "Amora", "Agulha", "Avestruz"],
        B: ["Baleia", "Bola", "Boneca", "Bota", "Banana", "Bigode", "Barco", "Biscoito", "Bule", "Bexiga"],
        C: ["Cachorro", "Cama", "Caneta", "Carro", "Casa", "Cavalo", "Cebola", "Cenoura", "Coelho", "Cabide"],
        D: ["Dado", "Dedo", "Dente", "Dominó", "Doce", "Dinossauro", "Diamante", "Degrau"],
        E: ["Esquilo", "Escola", "Escova", "Estrela", "Elefante", "Espelho", "Esmalte", "Escada"],
        F: ["Foca", "Faca", "Fada", "Feijão", "Foguete", "Folha", "Formiga", "Fivela"],
        G: ["Gato", "Galo", "Goiaba", "Girafa", "Gelo", "Gaveta", "Gaita", "Galinha"],
        H: ["Hipopótamo", "Hiena", "Hélice", "Harpa", "Horta", "Hotel", "Homem"],
        I: ["Igreja", "Ioiô", "Ilha", "Ímã", "Iguana", "Inverno", "Iogurte"],
        J: ["Joaninha", "Jacaré", "Janela", "Jipe", "Jabuti", "Jaca", "Jarro", "Jogo"],
        L: ["Leão", "Lápis", "Leite", "Limão", "Livro", "Lobo", "Lua", "Luva"],
        M: ["Macaco", "Maçã", "Mala", "Meia", "Milho", "Mola", "Muro", "Morango"],
        N: ["Navio", "Nuvem", "Ninho", "Noite", "Novelo", "Nariz", "Natal"],
        O: ["Olho", "Ovo", "Ovelha", "Onça", "Orelha", "Ônibus", "Ouro", "Osso"],
        P: ["Pato", "Peixe", "Pera", "Pipa", "Porco", "Pudim", "Porta", "Pena"],
        Q: ["Queijo", "Quadro", "Quiabo", "Quati", "Queixo", "Quinta"],
        R: ["Rato", "Rede", "Relógio", "Roda", "Rua", "Régua", "Raposa"],
        S: ["Sapo", "Selo", "Sino", "Sofa", "Suco", "Sereia", "Sacola"],
        T: ["Tatu", "Teia", "Tigre", "Tomate", "Trem", "Tucano", "Tubarão", "Teclado"],
        U: ["Uva", "Urubu", "Urso", "Umbigo", "Unha"],
        V: ["Vaca", "Vela", "Vinho", "Violão", "Vovó", "Vaso", "Vagalume"],
        Z: ["Zebra", "Zangão", "Zíper", "Zebu", "Zero"]
    }
};
