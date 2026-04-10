const JOGO_CONFIG = {
    caminhoIcons: "../../icons/", 
    caminhoImg: "../../img/",
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },
    labirinto: {
        caminho: "../../img/labirinto/",
        obstaculos: ["pedra.png", "buraco.png"],
        categorias: {
            cao: { 
                nome: "Cão", sprite: "l_cao.png", objetivo: "l_comida_cao.png", 
                corLabirinto: "#3498db" // Azul para o cão
            },
            gato: { 
                nome: "Gato", sprite: "l_gato.png", objetivo: "l_comida_gato.png", 
                corLabirinto: "#e67e22" // Laranja para o gato
            },
            passaro: { 
                nome: "Pássaro", sprite: "l_passaro.png", objetivo: "l_comida_passaro.png", 
                corLabirinto: "#27ae60" // Verde para o pássaro
            }
        }
    },
    relatorio: {
        titulo: "Missão Cumprida!",
        pontosTotal: "Pontos:",
        tempoTotal: "Tempo:"
    }
};
