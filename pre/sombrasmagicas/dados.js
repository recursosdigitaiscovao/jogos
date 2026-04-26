// === CONFIGURAÇÃO MESTRE ===
const CONFIG_MESTRE = {
    ano: "pre",        
    area: "pre",  
    nomeJogo: "SOMBRAS MÁGICAS"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" },
    "matematica": { corPagina: "#e8f9f4", corPrimaria: "#45cfa8", corEscura: "#2BA886", corTexto: "#45cfa8", voltarMobile: "voltar_vr.png" },
    "estudo": { corPagina: "#EAE2E5", corPrimaria: "#994D4D", corEscura: "#6C3737", corTexto: "#994D4D", voltarMobile: "voltar_cs.png" },
    "pre": { corPagina: "#FFF5F7", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "pre": { 
        "pre": { 
            t1: "SOMBRAS", 
            t2: "MÁGICAS", 
            sub: "Perceção Visual | Pré-Escolar", 
            intro: "Consegues encontrar a sombra correta? Arrasta as 6 imagens para os seus pares!", 
            rodape: "&copy; Pequenos Curiosos" 
        } 
    }
};

const JOGO_CONFIG = {
    linkVoltar: "../",
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",    
    caminhoIcons: "../../../icons/", 
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },
    categorias: {
        domesticos: {
            nome: "Animais Domésticos",
            totalRondas: 10,
            itensPorRonda: 6,
            imgCapa: "animaisdomesticos/vaca.png",
            itens: [
                { id: 1, img: "animaisdomesticos/burro.png" }, { id: 2, img: "animaisdomesticos/cabra.png" },
                { id: 3, img: "animaisdomesticos/cao.png" }, { id: 4, img: "animaisdomesticos/cavalo.png" },
                { id: 5, img: "animaisdomesticos/coelho.png" }, { id: 6, img: "animaisdomesticos/galinha.png" },
                { id: 7, img: "animaisdomesticos/galo.png" }, { id: 8, img: "animaisdomesticos/gato.png" },
                { id: 9, img: "animaisdomesticos/ovelha.png" }, { id: 10, img: "animaisdomesticos/pato.png" },
                { id: 11, img: "animaisdomesticos/peru.png" }, { id: 12, img: "animaisdomesticos/porco.png" },
                { id: 13, img: "animaisdomesticos/vaca.png" }
            ]
        },
        selvagens: {
            nome: "Animais Selvagens",
            totalRondas: 10,
            itensPorRonda: 6,
            imgCapa: "animaisselvagens/leao.png",
            itens: [
                { id: 101, img: "animaisselvagens/abelha.png" }, { id: 102, img: "animaisselvagens/abutre.png" },
                { id: 103, img: "animaisselvagens/aguia.png" }, { id: 104, img: "animaisselvagens/aranha.png" },
                { id: 105, img: "animaisselvagens/avestruz.png" }, { id: 106, img: "animaisselvagens/baleia.png" },
                { id: 107, img: "animaisselvagens/borboleta.png" }, { id: 108, img: "animaisselvagens/canguru.png" },
                { id: 109, img: "animaisselvagens/caracol.png" }, { id: 110, img: "animaisselvagens/carangueijo.png" },
                { id: 111, img: "animaisselvagens/coala.png" }, { id: 112, img: "animaisselvagens/crocodilo.png" },
                { id: 113, img: "animaisselvagens/elefante.png" }, { id: 114, img: "animaisselvagens/foca.png" },
                { id: 115, img: "animaisselvagens/formiga.png" }, { id: 116, img: "animaisselvagens/girafa.png" },
                { id: 117, img: "animaisselvagens/gorila.png" }, { id: 118, img: "animaisselvagens/hiena.png" },
                { id: 119, img: "animaisselvagens/hipopotamo.png" }, { id: 120, img: "animaisselvagens/leao.png" },
                { id: 121, img: "animaisselvagens/lobo.png" }, { id: 122, img: "animaisselvagens/macaco.png" },
                { id: 123, img: "animaisselvagens/morcego.png" }, { id: 124, img: "animaisselvagens/panda.png" },
                { id: 125, img: "animaisselvagens/papagaio.png" }, { id: 126, img: "animaisselvagens/peixe.png" },
                { id: 127, img: "animaisselvagens/polvo.png" }, { id: 128, img: "animaisselvagens/pombo.png" },
                { id: 129, img: "animaisselvagens/raia.png" }, { id: 130, img: "animaisselvagens/raposa.png" },
                { id: 131, img: "animaisselvagens/rato.png" }, { id: 132, img: "animaisselvagens/rinosseronte.png" },
                { id: 133, img: "animaisselvagens/tartaruga.png" }, { id: 134, img: "animaisselvagens/texugo.png" },
                { id: 135, img: "animaisselvagens/tigre.png" }, { id: 136, img: "animaisselvagens/tubarao.png" },
                { id: 137, img: "animaisselvagens/tucano.png" }, { id: 138, img: "animaisselvagens/urso.png" },
                { id: 139, img: "animaisselvagens/zebra.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um mestre das sombras!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a tentar!", img: "taca_4.png" }
    ]
};
