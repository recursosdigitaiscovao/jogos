const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    caminhoCat: "../../../imgcategorias/", // Pasta das categorias corrigida
    iconesMenu: { 
        pre: "iconpre.png", 
        ano1: "icon1.png", 
        ano2: "icon2.png", 
        ano3: "icon3.png", 
        ano4: "icon4.png" 
    },
    categorias: {
        animais: {
            nome: "Animais Domésticos", 
            img: "gato.png",
            itens: [
                { letras: "CÃO", palavras: ["CÃO"] },
                { letras: "GATO", palavras: ["GATO"] },
                { letras: "PATO", palavras: ["PATO"] },
                { letras: "PERU", palavras: ["PERU"] },
                { letras: "VACA", palavras: ["VACA"] },
                { letras: "COELHO", palavras: ["COELHO"] },
                { letras: "CABRA", palavras: ["CABRA"] },
                { letras: "PORCO", palavras: ["PORCO"] },
                { letras: "OVELHA", palavras: ["OVELHA"] },
                { letras: "GALO", palavras: ["GALO"] },
                { letras: "GALINHA", palavras: ["GALINHA"] },
                { letras: "BURRO", palavras: ["BURRO"] },
                { letras: "CAVALO", palavras: ["CAVALO"] },
                { letras: "RATO", palavras: ["RATO"] },
                { letras: "PEIXE", palavras: ["PEIXE"] },
                { letras: "POMBO", palavras: ["POMBO"] },
                { letras: "CANÁRIO", palavras: ["CANÁRIO"] },
                { letras: "HAMSTER", palavras: ["HAMSTER"] },
                { letras: "PÔNEI", palavras: ["PÔNEI"] },
                { letras: "CÁGADO", palavras: ["CÁGADO"] }
            ]
        },
        frutos: {
            nome: "Frutos", 
            img: "pera.png",
            itens: [
                { letras: "MAÇÃ", palavras: ["MAÇÃ"] },
                { letras: "PÊRA", palavras: ["PÊRA"] },
                { letras: "UVA", palavras: ["UVA"] },
                { letras: "FIGO", palavras: ["FIGO"] },
                { letras: "MELÃO", palavras: ["MELÃO"] },
                { letras: "BANANA", palavras: ["BANANA"] },
                { letras: "LARANJA", palavras: ["LARANJA"] },
                { letras: "MORANGO", palavras: ["MORANGO"] },
                { letras: "CEREJA", palavras: ["CEREJA"] },
                { letras: "ANANÁS", palavras: ["ANANÁS"] },
                { letras: "LIMÃO", palavras: ["LIMÃO"] },
                { letras: "PÊSSEGO", palavras: ["PÊSSEGO"] },
                { letras: "AMEIXA", palavras: ["AMEIXA"] },
                { letras: "KIWI", palavras: ["KIWI"] },
                { letras: "MANGA", palavras: ["MANGA"] },
                { letras: "PAPAIA", palavras: ["PAPAIA"] },
                { letras: "MELANCIA", palavras: ["MELANCIA"] },
                { letras: "AMORA", palavras: ["AMORA"] },
                { letras: "FRAMBOESA", palavras: ["FRAMBOESA"] },
                { letras: "ROMÃ", palavras: ["ROMÃ"] }
            ]
        },
        material: {
            nome: "Material Escolar", 
            img: "estojo.png",
            itens: [
                { letras: "AFIA", palavras: ["AFIA"] },
                { letras: "LÁPIS", palavras: ["LÁPIS"] },
                { letras: "RÉGUA", palavras: ["RÉGUA"] },
                { letras: "COLA", palavras: ["COLA"] },
                { letras: "LIVRO", palavras: ["LIVRO"] },
                { letras: "CADERNO", palavras: ["CADERNO"] },
                { letras: "MOCHILA", palavras: ["MOCHILA"] },
                { letras: "TESOURA", palavras: ["TESOURA"] },
                { letras: "BORRACHA", palavras: ["BORRACHA"] },
                { letras: "ESTOJO", palavras: ["ESTOJO"] },
                { letras: "CANETA", palavras: ["CANETA"] },
                { letras: "MARCADOR", palavras: ["MARCADOR"] },
                { letras: "QUADRO", palavras: ["QUADRO"] },
                { letras: "GIZ", palavras: ["GIZ"] },
                { letras: "PINCEL", palavras: ["PINCEL"] },
                { letras: "PASTA", palavras: ["PASTA"] },
                { letras: "TINTA", palavras: ["TINTA"] },
                { letras: "MAPA", palavras: ["MAPA"] },
                { letras: "AGRAFADOR", palavras: ["AGRAFADOR"] },
                { letras: "COMPASSO", palavras: ["COMPASSO"] }
            ]
        },
        selvagens: {
            nome: "Animais Selvagens", 
            img: "leao.png",
            itens: [
                { letras: "LEÃO", palavras: ["LEÃO"] },
                { letras: "TIGRE", palavras: ["TIGRE"] },
                { letras: "ZEBRA", palavras: ["ZEBRA"] },
                { letras: "GIRAFA", palavras: ["GIRAFA"] },
                { letras: "COBRA", palavras: ["COBRA"] },
                { letras: "ELEFANTE", palavras: ["ELEFANTE"] },
                { letras: "MACACO", palavras: ["MACACO"] },
                { letras: "URSO", palavras: ["URSO"] },
                { letras: "LOBO", palavras: ["LOBO"] },
                { letras: "RAPOSA", palavras: ["RAPOSA"] },
                { letras: "ÁGUIA", palavras: ["ÁGUIA"] },
                { letras: "BALEIA", palavras: ["BALEIA"] },
                { letras: "TUBARÃO", palavras: ["TUBARÃO"] },
                { letras: "JACARÉ", palavras: ["JACARÉ"] },
                { letras: "ESQUILO", palavras: ["ESQUILO"] },
                { letras: "VEADO", palavras: ["VEADO"] },
                { letras: "CANGURU", palavras: ["CANGURU"] },
                { letras: "MORCEGO", palavras: ["MORCEGO"] }
            ]
        },
        paises: {
            nome: "Países", 
            img: "paises.png",
            itens: [
                { letras: "PORTUGAL", palavras: ["PORTUGAL"] },
                { letras: "ESPANHA", palavras: ["ESPANHA"] },
                { letras: "FRANÇA", palavras: ["FRANÇA"] },
                { letras: "ITÁLIA", palavras: ["ITÁLIA"] },
                { letras: "BRASIL", palavras: ["BRASIL"] },
                { letras: "ANGOLA", palavras: ["ANGOLA"] },
                { letras: "ALEMANHA", palavras: ["ALEMANHA"] },
                { letras: "BÉLGICA", palavras: ["BÉLGICA"] },
                { letras: "GRÉCIA", palavras: ["GRÉCIA"] },
                { letras: "CHINA", palavras: ["CHINA"] },
                { letras: "JAPÃO", palavras: ["JAPÃO"] },
                { letras: "MÉXICO", palavras: ["MÉXICO"] },
                { letras: "CANADÁ", palavras: ["CANADÁ"] },
                { letras: "EGIPTO", palavras: ["EGIPTO"] },
                { letras: "MARROCOS", palavras: ["MARROCOS"] },
                { letras: "SUÍÇA", palavras: ["SUÍÇA"] },
                { letras: "TIMOR", palavras: ["TIMOR"] },
                { letras: "GUINÉ", palavras: ["GUINÉ"] }
            ]
        },
        transportes: {
            nome: "Transportes", 
            img: "transportes.png",
            itens: [
                { letras: "AVIÃO", palavras: ["AVIÃO"] },
                { letras: "BARCO", palavras: ["BARCO"] },
                { letras: "CARRO", palavras: ["CARRO"] },
                { letras: "MOTA", palavras: ["MOTA"] },
                { letras: "COMBOIO", palavras: ["COMBOIO"] },
                { letras: "AUTOCARRO", palavras: ["AUTOCARRO"] },
                { letras: "METRO", palavras: ["METRO"] },
                { letras: "ELÉTRICO", palavras: ["ELÉTRICO"] },
                { letras: "BICICLETA", palavras: ["BICICLETA"] },
                { letras: "CAMIÃO", palavras: ["CAMIÃO"] },
                { letras: "NAVIO", palavras: ["NAVIO"] },
                { letras: "FOGUETE", palavras: ["FOGUETE"] },
                { letras: "TRATOR", palavras: ["TRATOR"] },
                { letras: "TÁXI", palavras: ["TÁXI"] },
                { letras: "CANOA", palavras: ["CANOA"] },
                { letras: "BALÃO", palavras: ["BALÃO"] },
                { letras: "SUBMARINO", palavras: ["SUBMARINO"] }
            ]
        }
    },
    relatorio: { 
        titulo: "MUITO BEM!", 
        pontosTotal: "Pontos Totais:", 
        tempoTotal: "Tempo Total:" 
    }
};
