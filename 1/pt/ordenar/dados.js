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
    categorias: {
        cat1: {
            nome: "4 Letras Consecutivas", 
            img: "cat1.png",
            rondas: [
                { itens: ["A", "B", "C", "D"] },
                { itens: ["E", "F", "G", "H"] },
                { itens: ["I", "J", "K", "L"] },
                { itens: ["M", "N", "O", "P"] },
                { itens: ["Q", "R", "S", "T"] }
            ]
        },
        cat2: {
            nome: "4 Letras Alternadas", 
            img: "cat2.png",
            rondas: [
                { itens: ["A", "X", "M", "E"] },
                { itens: ["B", "L", "O", "V"] },
                { itens: ["C", "G", "Z", "Q"] },
                { itens: ["D", "H", "K", "W"] },
                { itens: ["P", "Y", "U", "S"] }
            ]
        },
        cat3: {
            nome: "Mesma Letra Inicial", 
            img: "cat3.png",
            rondas: [
                { itens: ["AMORA", "ANANÁS", "ANEL", "AVENTAL"] },
                { itens: ["BOLA", "BOLO", "BONECA", "BOTA"] },
                { itens: ["CASA", "CAVALO", "COELHO", "COPO"] },
                { itens: ["DADO", "DEDO", "DENTE", "DOCE"] },
                { itens: ["GATO", "GAVETA", "GELO", "GIRAFA"] }
            ]
        },
        cat4: {
            nome: "Palavras Mistas", 
            img: "cat4.png",
            rondas: [
                { itens: ["CÃO", "GATO", "PATO", "RATO"] },
                { itens: ["SOL", "LUA", "MAR", "CÉU"] },
                { itens: ["UM", "DOIS", "TRÊS", "QUATRO"] },
                { itens: ["MÃE", "PAI", "AVÓ", "AVÔ"] },
                { itens: ["AZUL", "ROSA", "VERDE", "VERMELHO"] }
            ]
        }
    }
};
