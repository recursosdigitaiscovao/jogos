const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    caminhoSom: "", 
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },
    iconesMenu: {
        home: "home.png",
        pre: "iconpre.png",
        ano1: "icon1.png",
        ano2: "icon2.png",
        ano3: "icon3.png",
        ano4: "icon4.png"
    },
    links: {
        home: "/jogos", 
        pre: "/jogos/pre",
        ano1: "/jogos/1",
        ano2: "/jogos/2",
        ano3: "/jogos/3",
        ano4: "/jogos/4"
    },
    categorias: {
        letra_a: {
            nome: "Letra A",
            imgCapa: "letras/letra_a.png",
            itens: [
                { nome: "AFIA", img: "materialescolar/afia.png" },
                { nome: "ANANÁS", img: "frutas/ananas.png" },
                { nome: "AMEIXA", img: "frutas/ameixa.png" },
                { nome: "AMORA", img: "frutas/amora.png" },
                { nome: "ANGOLA", img: "paises/angola.png" },
                { nome: "ALEMANHA", img: "paises/alemanha.png" },
                { nome: "AVIÃO", img: "transportes/aviao.png" },
                { nome: "AUTOCARRO", img: "transportes/autocarro.png" },
                { nome: "ÁGUIA", img: "animaisselvagens/aguia.png" },
                { nome: "AGRAFADOR", img: "materialescolar/agrafador.png" }
            ]
        },
        letra_b: {
            nome: "Letra B",
            imgCapa: "letras/letra_b.png",
            itens: [
                { nome: "BANANA", img: "frutas/banana.png" },
                { nome: "BORRACHA", img: "materialescolar/borracha.png" },
                { nome: "BALEIA", img: "animaisselvagens/baleia.png" },
                { nome: "BRASIL", img: "paises/brasil.png" },
                { nome: "BÉLGICA", img: "paises/belgica.png" },
                { nome: "BARCO", img: "transportes/barco.png" },
                { nome: "BICICLETA", img: "transportes/bicicleta.png" },
                { nome: "BALÃO", img: "transportes/balao.png" },
                { nome: "BURRO", img: "animaisdomesticos/burro.png" }
            ]
        },
        letra_c: {
            nome: "Letra C",
            imgCapa: "letras/letra_c.png",
            itens: [
                { nome: "CÃO", img: "animaisdomesticos/cao.png" },
                { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" },
                { nome: "COELHO", img: "animaisdomesticos/coelho.png" },
                { nome: "CABRA", img: "animaisdomesticos/cabra.png" },
                { nome: "CEREJA", img: "frutas/cereja.png" },
                { nome: "COLA", img: "materialescolar/cola.png" },
                { nome: "CADERNO", img: "materialescolar/caderno.png" },
                { nome: "CANETA", img: "materialescolar/caneta.png" },
                { nome: "COBRA", img: "animaisselvagens/cobra.png" },
                { nome: "CANGURU", img: "animaisselvagens/canguru.png" },
                { nome: "CHINA", img: "paises/china.png" },
                { nome: "CANADÁ", img: "paises/canada.png" },
                { nome: "CARRO", img: "transportes/carro.png" },
                { nome: "COMBOIO", img: "transportes/comboio.png" },
                { nome: "CAMIÃO", img: "transportes/camiao.png" },
                { nome: "CANOA", img: "transportes/canoa.png" },
                { nome: "COMPASSO", img: "materialescolar/compasso.png" }
            ]
        },
        letra_e: {
            nome: "Letra E",
            imgCapa: "letras/letra_e.png",
            itens: [
                { nome: "ESTOJO", img: "materialescolar/estojo.png" },
                { nome: "ELEFANTE", img: "animaisselvagens/elefante.png" },
                { nome: "ESQUILO", img: "animaisselvagens/esquilo.png" },
                { nome: "ESPANHA", img: "paises/espanha.png" },
                { nome: "EGIPTO", img: "paises/egipto.png" },
                { nome: "ELÉTRICO", img: "transportes/eletrico.png" }
            ]
        },
        letra_f: {
            nome: "Letra F",
            imgCapa: "letras/letra_f.png",
            itens: [
                { nome: "FIGO", img: "frutas/figo.png" },
                { nome: "FRAMBOESA", img: "frutas/framboesa.png" },
                { nome: "FRANÇA", img: "paises/franca.png" },
                { nome: "FOGUETE", img: "transportes/foguete.png" }
            ]
        },
        letra_g: {
            nome: "Letra G",
            imgCapa: "letras/letra_g.png",
            itens: [
                { nome: "GATO", img: "animaisdomesticos/gato.png" },
                { nome: "GALO", img: "animaisdomesticos/galo.png" },
                { nome: "GALINHA", img: "animaisdomesticos/galinha.png" },
                { nome: "GIRAFA", img: "animaisselvagens/girafa.png" },
                { nome: "GIZ", img: "materialescolar/giz.png" },
                { nome: "GRÉCIA", img: "paises/grecia.png" },
                { nome: "GUINÉ", img: "paises/guine.png" }
            ]
        },
        letra_l: {
            nome: "Letra L",
            imgCapa: "letras/letra_l.png",
            itens: [
                { nome: "LARANJA", img: "frutas/laranja.png" },
                { nome: "LIMÃO", img: "frutas/limao.png" },
                { nome: "LÁPIS", img: "materialescolar/lapis.png" },
                { nome: "LIVRO", img: "materialescolar/livro.png" },
                { nome: "LEÃO", img: "animaisselvagens/leao.png" },
                { nome: "LOBO", img: "animaisselvagens/lobo.png" }
            ]
        },
        letra_m: {
            nome: "Letra M",
            imgCapa: "letras/letra_m.png",
            itens: [
                { nome: "MAÇÃ", img: "frutas/maca.png" },
                { nome: "MELÃO", img: "frutas/melao.png" },
                { nome: "MORANGO", img: "frutas/morango.png" },
                { nome: "MANGA", img: "frutas/manga.png" },
                { nome: "MELANCIA", img: "frutas/melancia.png" },
                { nome: "MOCHILA", img: "materialescolar/mochila.png" },
                { nome: "MARCADOR", img: "materialescolar/marcador.png" },
                { nome: "MAPA", img: "materialescolar/mapa.png" },
                { nome: "MACACO", img: "animaisselvagens/macaco.png" },
                { nome: "MORCEGO", img: "animaisselvagens/morcego.png" },
                { nome: "MÉXICO", img: "paises/mexico.png" },
                { nome: "MARROCOS", img: "paises/marrocos.png" },
                { nome: "METRO", img: "transportes/metro.png" },
                { nome: "MOTA", img: "transportes/mota.png" }
            ]
        },
        letra_p: {
            nome: "Letra P",
            imgCapa: "letras/letra_p.png",
            itens: [
                { nome: "PATO", img: "animaisdomesticos/pato.png" },
                { nome: "PERU", img: "animaisdomesticos/peru.png" },
                { nome: "PORCO", img: "animaisdomesticos/porco.png" },
                { nome: "PEIXE", img: "animaisdomesticos/peixe.png" },
                { nome: "POMBO", img: "animaisdomesticos/pombo.png" },
                { nome: "PÔNEI", img: "animaisdomesticos/ponei.png" },
                { nome: "PÊRA", img: "frutas/pera.png" },
                { nome: "PAPAIA", img: "frutas/papaia.png" },
                { nome: "PÊSSEGO", img: "frutas/pessego.png" },
                { nome: "PASTA", img: "materialescolar/pasta.png" },
                { nome: "PINCEL", img: "materialescolar/pincel.png" },
                { nome: "PORTUGAL", img: "paises/portugal.png" }
            ]
        },
        letra_t: {
            nome: "Letra T",
            imgCapa: "letras/letra_t.png",
            itens: [
                { nome: "TESOURA", img: "materialescolar/tesoura.png" },
                { nome: "TINTA", img: "materialescolar/tinta.png" },
                { nome: "TIGRE", img: "animaisselvagens/tigre.png" },
                { nome: "TUBARÃO", img: "animaisselvagens/tubarao.png" },
                { nome: "TIMOR", img: "paises/timor.png" },
                { nome: "TRATOR", img: "transportes/trator.png" },
                { nome: "TÁXI", img: "transportes/taxi.png" }
            ]
        }
    },
    relatorios: [
        { min: 900, titulo: "BRILHANTE!", msg: "És um verdadeiro mestre das palavras!" },
        { min: 700, titulo: "MUITO BEM!", msg: "Excelente prestação!" },
        { min: 400, titulo: "BOM TRABALHO!", msg: "Estás quase lá, continua a praticar!" },
        { min: 0, titulo: "FOI POR POUCO!", msg: "Tenta outra vez para melhorares!" }
    ]
};
