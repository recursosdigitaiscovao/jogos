const CONFIG_MESTRE = {
    ano: "ano1",        
    area: "portugues",  
    nomeJogo: "ORDEM ALFABÉTICA"
};

const BIBLIOTECA_TEMAS = {
    "portugues": { corPagina: "#e9f0f8", corPrimaria: "#5ba4e5", corEscura: "#3d7db8", corTexto: "#5d7082", voltarMobile: "voltar_az.png" }
};

const BIBLIOTECA_CONTEUDO = {
    "ano1": {
        "portugues": { 
            t1: "ORDEM", t2: "ALFABÉTICA", sub: "Português | 1º Ano", 
            intro: "Clica ou arrasta os cartões seguindo a ordem do alfabeto!", 
            rodape: "&copy; Pequenos Leitores" 
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
        consecutivas: {
            nome: "Letras Consecutivas", exemplo: "A-B-C-D", exemploImg: "letras/letra_a.png", imgCapa: "letras/letra_a.png",
            itens: [
                { nome: "A", img: "letras/letra_a.png" }, { nome: "B", img: "letras/letra_b.png" }, { nome: "C", img: "letras/letra_c.png" }, { nome: "D", img: "letras/letra_d.png" },
                { nome: "E", img: "letras/letra_e.png" }, { nome: "F", img: "letras/letra_f.png" }, { nome: "G", img: "letras/letra_g.png" }, { nome: "H", img: "letras/letra_h.png" },
                { nome: "I", img: "letras/letra_i.png" }, { nome: "J", img: "letras/letra_j.png" }, { nome: "K", img: "letras/letra_k.png" }, { nome: "L", img: "letras/letra_l.png" },
                { nome: "M", img: "letras/letra_m.png" }, { nome: "N", img: "letras/letra_n.png" }, { nome: "O", img: "letras/letra_o.png" }, { nome: "P", img: "letras/letra_p.png" },
                { nome: "Q", img: "letras/letra_q.png" }, { nome: "R", img: "letras/letra_r.png" }, { nome: "S", img: "letras/letra_s.png" }, { nome: "T", img: "letras/letra_t.png" },
                { nome: "U", img: "letras/letra_u.png" }, { nome: "V", img: "letras/letra_v.png" }, { nome: "W", img: "letras/letra_w.png" }, { nome: "X", img: "letras/letra_x.png" },
                { nome: "Y", img: "letras/letra_y.png" }, { nome: "Z", img: "letras/letra_z.png" }
            ]
        },
        letras_mistas: {
            nome: "Letras Mistas", exemplo: "A-G-M-Z", exemploImg: "letras/letra_m.png", imgCapa: "letras/letra_m.png",
            itens: [
                { nome: "A", img: "letras/letra_a.png" }, { nome: "B", img: "letras/letra_b.png" }, { nome: "C", img: "letras/letra_c.png" }, { nome: "D", img: "letras/letra_d.png" },
                { nome: "E", img: "letras/letra_e.png" }, { nome: "F", img: "letras/letra_f.png" }, { nome: "G", img: "letras/letra_g.png" }, { nome: "H", img: "letras/letra_h.png" },
                { nome: "I", img: "letras/letra_i.png" }, { nome: "J", img: "letras/letra_j.png" }, { nome: "K", img: "letras/letra_k.png" }, { nome: "L", img: "letras/letra_l.png" },
                { nome: "M", img: "letras/letra_m.png" }, { nome: "N", img: "letras/letra_n.png" }, { nome: "O", img: "letras/letra_o.png" }, { nome: "P", img: "letras/letra_p.png" },
                { nome: "Q", img: "letras/letra_q.png" }, { nome: "R", img: "letras/letra_r.png" }, { nome: "S", img: "letras/letra_s.png" }, { nome: "T", img: "letras/letra_t.png" },
                { nome: "U", img: "letras/letra_u.png" }, { nome: "V", img: "letras/letra_v.png" }, { nome: "X", img: "letras/letra_x.png" }, { nome: "Z", img: "letras/letra_z.png" }
            ]
        },
        mesma_inicial: {
            nome: "Mesma Inicial", exemplo: "Abelha-Águia", exemploImg: "animaisselvagens/abelha.png", imgCapa: "animaisselvagens/abelha.png",
            itens: [
                // Iniciais em A
                { nome: "ABELHA", img: "animaisselvagens/abelha.png" }, { nome: "ÁGUIA", img: "animaisselvagens/aguia.png" }, { nome: "ARANHA", img: "animaisselvagens/aranha.png" }, { nome: "AFIA", img: "materialescolar/afia.png" }, { nome: "ANEL", img: "objetos/anel.png" }, { nome: "AMORA", img: "frutas/amora.png" }, { nome: "ANANÁS", img: "frutas/ananas.png" }, { nome: "AVESTRUZ", img: "animaisselvagens/avestruz.png" },
                // Iniciais em B
                { nome: "BANANA", img: "frutas/banana.png" }, { nome: "BALEIA", img: "animaisselvagens/baleia.png" }, { nome: "BURRO", img: "animaisdomesticos/burro.png" }, { nome: "BALDE", img: "objetos/balde.png" }, { nome: "BOLA", img: "objetos/bola.png" }, { nome: "BONECA", img: "objetos/boneca.png" }, { nome: "BORRACHA", img: "materialescolar/borracha.png" },
                // Iniciais em C
                { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" }, { nome: "COELHO", img: "animaisdomesticos/coelho.png" }, { nome: "CADERNO", img: "materialescolar/caderno.png" }, { nome: "CANETA", img: "materialescolar/caneta.png" }, { nome: "CAPA", img: "materialescolar/capa.png" }, { nome: "CEREJA", img: "frutas/cereja.png" }, { nome: "CESTO", img: "objetos/cesto.png" }, { nome: "COLHER", img: "objetos/colher.png" }, { nome: "COPO", img: "objetos/copo.png" },
                // Iniciais em G
                { nome: "GALINHA", img: "animaisdomesticos/galinha.png" }, { nome: "GALO", img: "animaisdomesticos/galo.png" }, { nome: "GATO", img: "animaisdomesticos/gato.png" }, { nome: "GORILA", img: "animaisselvagens/gorila.png" }, { nome: "GOIABA", img: "frutas/goiaba.png" }, { nome: "GARFO", img: "objetos/garfo.png" }, { nome: "GARRAFA", img: "objetos/garrafa.png" },
                // Iniciais em P
                { nome: "PATO", img: "animaisdomesticos/pato.png" }, { nome: "PERU", img: "animaisdomesticos/peru.png" }, { nome: "PANDA", img: "animaisselvagens/panda.png" }, { nome: "PAPAIA", img: "frutas/papaia.png" }, { nome: "PERA", img: "frutas/pera.png" }, { nome: "PINCEL", img: "materialescolar/pincel.png" }, { nome: "PANELA", img: "objetos/panela.png" }
            ]
        },
        palavras_mistas: {
            nome: "Palavras Mistas", exemplo: "Cão-Gato-Leão", exemploImg: "animaisdomesticos/burro.png", imgCapa: "animaisdomesticos/burro.png",
            itens: [
                { nome: "BURRO", img: "animaisdomesticos/burro.png" }, { nome: "CABRA", img: "animaisdomesticos/cabra.png" }, { nome: "CÃO", img: "animaisdomesticos/cao.png" }, { nome: "CAVALO", img: "animaisdomesticos/cavalo.png" }, { nome: "COELHO", img: "animaisdomesticos/coelho.png" }, { nome: "GALINHA", img: "animaisdomesticos/galinha.png" }, { nome: "GALO", img: "animaisdomesticos/galo.png" }, { nome: "GATO", img: "animaisdomesticos/gato.png" }, { nome: "OVELHA", img: "animaisdomesticos/ovelha.png" }, { nome: "PATO", img: "animaisdomesticos/pato.png" }, { nome: "PERU", img: "animaisdomesticos/peru.png" }, { nome: "PORCO", img: "animaisdomesticos/porco.png" },
                { nome: "LEÃO", img: "animaisselvagens/leao.png" }, { nome: "ZEBRA", img: "animaisselvagens/zebra.png" }, { nome: "MACACO", img: "animaisselvagens/macaco.png" }, { nome: "PANDA", img: "animaisselvagens/panda.png" }, { nome: "TIGRE", img: "animaisselvagens/tigre.png" }, { nome: "ELEFANTE", img: "animaisselvagens/elefante.png" }, { nome: "ÁGUIA", img: "animaisselvagens/aguia.png" }, { nome: "ARANHA", img: "animaisselvagens/aranha.png" }, { nome: "BALEIA", img: "animaisselvagens/baleia.png" }, { nome: "CANGURU", img: "animaisselvagens/canguru.png" }, { nome: "COALA", img: "animaisselvagens/coala.png" }, { nome: "CROCODILO", img: "animaisselvagens/crocodilo.png" }, { nome: "FOCA", img: "animaisselvagens/foca.png" }, { nome: "GORILA", img: "animaisselvagens/gorila.png" }, { nome: "HIENA", img: "animaisselvagens/hiena.png" }, { nome: "PAPAGAIO", img: "animaisselvagens/papagaio.png" },
                { nome: "AMORA", img: "frutas/amora.png" }, { nome: "ANANÁS", img: "frutas/ananas.png" }, { nome: "BANANA", img: "frutas/banana.png" }, { nome: "CEREJA", img: "frutas/cereja.png" }, { nome: "DIÓSPIRO", img: "frutas/diospiro.png" }, { nome: "FIGO", img: "frutas/figo.png" }, { nome: "GOIABA", img: "frutas/goiaba.png" }, { nome: "KIWI", img: "frutas/kiwi.png" }, { nome: "LARANJA", img: "frutas/laranja.png" }, { nome: "LIMÃO", img: "frutas/limao.png" }, { nome: "MAÇÃ", img: "frutas/maca.png" }, { nome: "MARACUJÁ", img: "frutas/maracuja.png" }, { nome: "MELANCIA", img: "frutas/melancia.png" }, { nome: "MELÃO", img: "frutas/melao.png" }, { nome: "MORANGO", img: "frutas/morango.png" }, { nome: "PAPAIA", img: "frutas/papaia.png" }, { nome: "PERA", img: "frutas/pera.png" }, { nome: "ROMÃ", img: "frutas/roma.png" }, { nome: "UVAS", img: "frutas/uvas.png" },
                { nome: "ANEL", img: "objetos/anel.png" }, { nome: "BALDE", img: "objetos/balde.png" }, { nome: "BOLA", img: "objetos/bola.png" }, { nome: "BONECA", img: "objetos/boneca.png" }, { nome: "CARRINHO", img: "objetos/carrinho.png" }, { nome: "CESTO", img: "objetos/cesto.png" }, { nome: "COLHER", img: "objetos/colher.png" }, { nome: "COPO", img: "objetos/copo.png" }, { nome: "DADO", img: "objetos/dado.png" }, { nome: "DEDAL", img: "objetos/dedal.png" }, { nome: "DRAGÃO", img: "objetos/dragao.png" }, { nome: "ESCOVA", img: "objetos/escova.png" }, { nome: "GARFO", img: "objetos/garfo.png" }, { nome: "GARRAFA", img: "objetos/garrafa.png" }, { nome: "ISQUEIRO", img: "objetos/isqueiro.png" }, { nome: "ÓCULOS", img: "objetos/oculos.png" }, { nome: "PÁ", img: "objetos/pa.png" }, { nome: "PANELA", img: "objetos/panela.png" }, { nome: "PINCEL", img: "objetos/pincel.png" }, { nome: "VASSOURA", img: "objetos/vassoura.png" }, { nome: "VELA", img: "objetos/vela.png" },
                { nome: "AFIA", img: "materialescolar/afia.png" }, { nome: "BORRACHA", img: "materialescolar/borracha.png" }, { nome: "CADERNO", img: "materialescolar/caderno.png" }, { nome: "CANETA", img: "materialescolar/caneta.png" }, { nome: "CAPA", img: "materialescolar/capa.png" }, { nome: "COLA", img: "materialescolar/cola.png" }, { nome: "ESQUADRO", img: "materialescolar/esquadro.png" }, { nome: "ESTOJO", img: "materialescolar/estojo.png" }, { nome: "FOLHA", img: "materialescolar/folha.png" }, { nome: "LÁPIS", img: "materialescolar/lapis.png" }, { nome: "LIVRO", img: "materialescolar/livro.png" }, { nome: "MOCHILA", img: "materialescolar/mochila.png" }, { nome: "RÉGUA", img: "materialescolar/regua.png" }, { nome: "TESOURA", img: "materialescolar/tesoura.png" },
                { nome: "ZERO", img: "numeros/zero.png" }, { nome: "UM", img: "numeros/um.png" }, { nome: "DOIS", img: "numeros/dois.png" }, { nome: "TRÊS", img: "numeros/tres.png" }, { nome: "QUATRO", img: "numeros/quatro.png" }, { nome: "CINCO", img: "numeros/cinco.png" }, { nome: "SEIS", img: "numeros/seis.png" }, { nome: "SETE", img: "numeros/sete.png" }, { nome: "OITO", img: "numeros/oito.png" }, { nome: "NOVE", img: "numeros/nove.png" }, { nome: "DEZ", img: "numeros/dez.png" }
            ]
        }
    },
    relatorios: [
        { min: 90, max: 100, titulo: "És um craque do alfabeto!", img: "taca_1.png" },
        { min: 70, max: 89, titulo: "Muito bem!", img: "taca_2.png" },
        { min: 50, max: 69, titulo: "Estás quase lá!", img: "taca_2.png" },
        { min: 0, max: 49, titulo: "Continua a praticar!", img: "taca_4.png" }
    ]
};
