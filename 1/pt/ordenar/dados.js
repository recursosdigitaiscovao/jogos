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
            nome: "Letras Consecutivas", 
            img: "cat1.png",
            rondas: [
                { itens: ["A", "B", "C", "D"] },
                { itens: ["E", "F", "G", "H"] },
                { itens: ["L", "M", "N", "O"] },
                { itens: ["P", "Q", "R", "S"] },
                { itens: ["W", "X", "Y", "Z"] }
            ]
        },
        cat2: {
            nome: "Letras Baralhadas", 
            img: "cat2.png",
            rondas: [
                { itens: ["A", "F", "M", "X"] },
                { itens: ["B", "H", "K", "T"] },
                { itens: ["C", "G", "J", "V"] },
                { itens: ["D", "I", "L", "P"] },
                { itens: ["E", "N", "S", "Z"] }
            ]
        },
        cat3: {
            nome: "Mesma Letra Inicial", 
            img: "cat3.png",
            rondas: [
                { itens: ["ABELHA", "ANANÁS", "ANEL", "AVENTAL"] },
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
                { itens: ["AZUL", "ROSA", "VERDE", "VIOLETA"] },
                { itens: ["MÃE", "PAI", "AVÓ", "AVÔ"] },
                { itens: ["SOL", "LUA", "MAR", "CÉU"] },
                { itens: ["UM", "DOIS", "TRÊS", "QUATRO"] }
            ]
        }
    }
};
