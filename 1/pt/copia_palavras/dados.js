const JOGO_CONFIG = {
    caminhoImg: "../../../img/",         // Caminho base para as imagens
    caminhoIcons: "../../../icons/",     // Caminho para ícones do sistema
    caminhoCat: "../../../img/letras/",  // Pasta das imagens das categorias (letras)
    iconesMenu: { 
        pre: "iconpre.png", 
        ano1: "icon1.png", 
        ano2: "icon2.png", 
        ano3: "icon3.png", 
        ano4: "icon4.png" 
    },
    categorias: {
        A: { nome: "Letra A", img: "letra_a.png", itens: [
            { palavra: "AVIÃO", img: "transportes/aviao.png" }, 
            { palavra: "ABELHA", img: "animaisselvagens/abelha.png" }, 
            { palavra: "ANEL", img: "objetos/anel.png" }, 
            { palavra: "ARANHA", img: "animaisselvagens/aranha.png" }, 
            { palavra: "ÁRVORE", img: "natureza/arvore.png" }
        ]},
        B: { nome: "Letra B", img: "letra_b.png", itens: [
            { palavra: "BOLA", img: "objetos/bola.png" }, 
            { palavra: "BONECA", img: "objetos/boneca.png" }, 
            { palavra: "BALEIA", img: "animais_selvagens/baleia.png" }, 
            { palavra: "BANANA", img: "frutos/banana.png" }, 
            { palavra: "BARCO", img: "transportes/barco.png" }
        ]},
        C: { nome: "Letra C", img: "letra_c.png", itens: [
            { palavra: "CASA", img: "objetos/casa.png" }, 
            { palavra: "CARRO", img: "transportes/carro.png" }, 
            { palavra: "CAVALO", img: "animais_domesticos/cavalo.png" }, 
            { palavra: "COELHO", img: "animais_domesticos/coelho.png" }, 
            { palavra: "CADERNO", img: "materialescolar/caderno.png" }
        ]},
        D: { nome: "Letra D", img: "letra_d.png", itens: [
            { palavra: "DADO", img: "objetos/dado.png" }, 
            { palavra: "DEDO", img: "corpo/dedo.png" }, 
            { palavra: "DOCE", img: "comida/doce.png" }, 
            { palavra: "DENTE", img: "corpo/dente.png" }, 
            { palavra: "DRAGÃO", img: "fantasia/dragao.png" }
        ]}
        // Podes acrescentar E, F, G... aqui em baixo seguindo o mesmo padrão
    },
    relatorio: { 
        titulo: "MUITO BEM!", 
        pontosTotal: "Pontos Totais:", 
        tempoTotal: "Tempo Total:" 
    }
};
