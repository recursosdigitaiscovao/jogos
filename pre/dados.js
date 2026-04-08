const JOGO_CONFIG = {
    // Caminho para os icons do menu (sobe dois níveis para jogos/icons/)
    caminhoIconsMenu: "../../icons/",
    
    // Caminho para os icons dos jogos (dentro da pasta local iconjogos/)
    caminhoIconsJogos: "iconjogos/",

    // Nomes dos ficheiros de ícones do menu/sidebar (conforme solicitado)
    iconesMenu: {
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },

    // Lista de jogos atualizada com os novos ficheiros
    listaJogos: [
        { nome: "Encontra o Par", icon: "encontraopar.png", link: "encontraopar/" },
        { nome: "Monstro Comilão", icon: "mostrocomilao.png", link: "mostrocomilao/" },
        { nome: "Pintar", icon: "pinta.png", link: "pinta/" },
        { nome: "Sem Par", icon: "sem_par.png", link: "sem_par/" },
        { nome: "Sombras Mágicas", icon: "sombrasmagicas.png", link: "sombrasmagicas/" }
    ]
};
