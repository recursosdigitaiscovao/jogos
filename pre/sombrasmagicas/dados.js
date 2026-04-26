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
    "pre": { corPagina: "#FFEAEA", corPrimaria: "#E691A7", corEscura: "#D54267", corTexto: "#E691A7", voltarMobile: "voltar_rs.png" }
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
    caminhoImg: "../../img/",    
    caminhoIcons: "../../icons/", 
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
            totalRondas: 10, itensPorRonda: 6, imgCapa: "animaisdomesticos/vaca.png",
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
            totalRondas: 10, itensPorRonda: 6, imgCapa: "animaisselvagens/leao.png",
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
        },
        frutas: {
            nome: "Frutas",
            totalRondas: 10, itensPorRonda: 6, imgCapa: "frutas/morango.png",
            itens: [
                { id: 201, img: "frutas/amora.png" }, { id: 202, img: "frutas/ananas.png" },
                { id: 203, img: "frutas/banana.png" }, { id: 204, img: "frutas/castanha.png" },
                { id: 205, img: "frutas/cereja.png" }, { id: 206, img: "frutas/diospiro.png" },
                { id: 207, img: "frutas/figo.png" }, { id: 208, img: "frutas/goiaba.png" },
                { id: 209, img: "frutas/kiwi.png" }, { id: 210, img: "frutas/laranja.png" },
                { id: 211, img: "frutas/limao.png" }, { id: 212, img: "frutas/maca.png" },
                { id: 213, img: "frutas/maracuja.png" }, { id: 214, img: "frutas/melancia.png" },
                { id: 215, img: "frutas/melao.png" }, { id: 216, img: "frutas/morango.png" },
                { id: 217, img: "frutas/papaia.png" }, { id: 218, img: "frutas/pera.png" },
                { id: 219, img: "frutas/roma.png" }, { id: 220, img: "frutas/uvas.png" }
            ]
        },
        objetos: {
            nome: "Objetos",
            totalRondas: 10, itensPorRonda: 6, imgCapa: "objetos/carrinho.png",
            itens: [
                // Da pasta objetos/
                { id: 301, img: "objetos/anel.png" }, { id: 302, img: "objetos/balde.png" },
                { id: 303, img: "objetos/bola.png" }, { id: 304, img: "objetos/boneca.png" },
                { id: 305, img: "objetos/carrinho.png" }, { id: 306, img: "objetos/cesto.png" },
                { id: 307, img: "objetos/colher.png" }, { id: 308, img: "objetos/copo.png" },
                { id: 309, img: "objetos/dado.png" }, { id: 310, img: "objetos/dedal.png" },
                { id: 311, img: "objetos/dragao.png" }, { id: 312, img: "objetos/escova.png" },
                { id: 313, img: "objetos/garfo.png" }, { id: 314, img: "objetos/garrafa.png" },
                { id: 315, img: "objetos/isqueiro.png" }, { id: 316, img: "objetos/oculos.png" },
                { id: 317, img: "objetos/pa.png" }, { id: 318, img: "objetos/panela.png" },
                { id: 319, img: "objetos/pincel.png" }, { id: 320, img: "objetos/vassoura.png" },
                { id: 321, img: "objetos/vela.png" },
                // Da pasta materialescolar/
                { id: 322, img: "materialescolar/afia.png" }, { id: 323, img: "materialescolar/borracha.png" },
                { id: 324, img: "materialescolar/caderno.png" }, { id: 325, img: "materialescolar/caneta.png" },
                { id: 326, img: "materialescolar/capa.png" }, { id: 327, img: "materialescolar/cola.png" },
                { id: 328, img: "materialescolar/esquadro.png" }, { id: 329, img: "materialescolar/estojo.png" },
                { id: 330, img: "materialescolar/folha.png" }, { id: 331, img: "materialescolar/lapis.png" },
                { id: 332, img: "materialescolar/livro.png" }, { id: 333, img: "materialescolar/mochila.png" },
                { id: 334, img: "materialescolar/pincel.png" }, { id: 335, img: "materialescolar/regua.png" },
                { id: 336, img: "materialescolar/tesoura.png" }
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
