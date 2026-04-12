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
            { palavra: "BOLA", img: "brinquedos/bola.png" }, 
            { palavra: "BONECA", img: "brinquedos/boneca.png" }, 
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
        ]},
        E: { nome: "Letra E", img: "letra_e.png", itens: [
            { palavra: "ESTRELA", img: "espaço/estrela.png" }, 
            { palavra: "ESCOVA", img: "objetos/escova.png" }, 
            { palavra: "ELEFANTE", img: "animais_selvagens/elefante.png" }, 
            { palavra: "ESQUILO", img: "animais_selvagens/esquilo.png" }, 
            { palavra: "ESCADA", img: "objetos/escada.png" }
        ]},
        F: { nome: "Letra F", img: "letra_f.png", itens: [
            { palavra: "FOCA", img: "animais_selvagens/foca.png" }, 
            { palavra: "FADA", img: "fantasia/fada.png" }, 
            { palavra: "FOGO", img: "elementos/fogo.png" }, 
            { palavra: "FLOR", img: "natureza/flor.png" }, 
            { palavra: "FACA", img: "objetos/faca.png" }
        ]},
        G: { nome: "Letra G", img: "letra_g.png", itens: [
            { palavra: "GATO", img: "animais_domesticos/gato.png" }, 
            { palavra: "GALO", img: "animais_domesticos/galo.png" }, 
            { palavra: "GIRAFA", img: "animais_selvagens/girafa.png" }, 
            { palavra: "GARFO", img: "objetos/garfo.png" }, 
            { palavra: "GELO", img: "elementos/gelo.png" }
        ]},
        H: { nome: "Letra H", img: "letra_h.png", itens: [
            { palavra: "HARPA", img: "objetos/harpa.png" }, 
            { palavra: "HIENA", img: "animais_selvagens/hiena.png" }, 
            { palavra: "HÉLICE", img: "objetos/helice.png" }, 
            { palavra: "HORTA", img: "natureza/horta.png" }, 
            { palavra: "HOTEL", img: "objetos/hotel.png" }
        ]},
        I: { nome: "Letra I", img: "letra_i.png", itens: [
            { palavra: "ILHA", img: "natureza/ilha.png" }, 
            { palavra: "IGREJA", img: "objetos/igreja.png" }, 
            { palavra: "ÍMAN", img: "objetos/iman.png" }, 
            { palavra: "ÍNDIO", img: "pessoas/indio.png" }, 
            { palavra: "IOIÔ", img: "brinquedos/ioio.png" }
        ]},
        J: { nome: "Letra J", img: "letra_j.png", itens: [
            { palavra: "JANELA", img: "objetos/janela.png" }, 
            { palavra: "JACARÉ", img: "animais_selvagens/jacare.png" }, 
            { palavra: "JIPE", img: "transportes/jipe.png" }, 
            { palavra: "JARRA", img: "objetos/jarra.png" }, 
            { palavra: "JOANINHA", img: "insetos/joaninha.png" }
        ]},
        K: { nome: "Letra K", img: "letra_k.png", itens: [
            { palavra: "KIWI", img: "frutos/kiwi.png" }, 
            { palavra: "KART", img: "transportes/kart.png" }, 
            { palavra: "KARATE", img: "desporto/karate.png" }, 
            { palavra: "KOALA", img: "animais_selvagens/koala.png" }, 
            { palavra: "KILO", img: "objetos/kilo.png" }
        ]},
        L: { nome: "Letra L", img: "letra_l.png", itens: [
            { palavra: "LEÃO", img: "animais_selvagens/leao.png" }, 
            { palavra: "LÁPIS", img: "materialescolar/lapis.png" }, 
            { palavra: "LUA", img: "espaço/lua.png" }, 
            { palavra: "LIVRO", img: "materialescolar/livro.png" }, 
            { palavra: "LUVA", img: "objetos/luva.png" }
        ]},
        M: { nome: "Letra M", img: "letra_m.png", itens: [
            { palavra: "MACACO", img: "animais_selvagens/macaco.png" }, 
            { palavra: "MAÇÃ", img: "frutos/maca.png" }, 
            { palavra: "MESA", img: "objetos/mesa.png" }, 
            { palavra: "MOTA", img: "transportes/mota.png" }, 
            { palavra: "MÃO", img: "corpo/mao.png" }
        ]},
        N: { nome: "Letra N", img: "letra_n.png", itens: [
            { palavra: "NAVIO", img: "transportes/navio.png" }, 
            { palavra: "NUVEM", img: "natureza/nuvem.png" }, 
            { palavra: "NINHO", img: "natureza/ninho.png" }, 
            { palavra: "NARIZ", img: "corpo/nariz.png" }, 
            { palavra: "NOVELO", img: "objetos/novelo.png" }
        ]},
        O: { nome: "Letra O", img: "letra_o.png", itens: [
            { palavra: "OLHO", img: "corpo/olho.png" }, 
            { palavra: "OVO", img: "comida/ovo.png" }, 
            { palavra: "OVELHA", img: "animais_domesticos/ovelha.png" }, 
            { palavra: "ÓCULOS", img: "objetos/oculos.png" }, 
            { palavra: "ONDA", img: "natureza/onda.png" }
        ]},
        P: { nome: "Letra P", img: "letra_p.png", itens: [
            { palavra: "PATO", img: "animais_domesticos/pato.png" }, 
            { palavra: "PÃO", img: "comida/pao.png" }, 
            { palavra: "PEIXE", img: "animais_selvagens/peixe.png" }, 
            { palavra: "PORCO", img: "animais_domesticos/porco.png" }, 
            { palavra: "PORTA", img: "objetos/porta.png" }
        ]},
        Q: { nome: "Letra Q", img: "letra_q.png", itens: [
            { palavra: "QUEIJO", img: "comida/queijo.png" }, 
            { palavra: "QUADRO", img: "objetos/quadro.png" }, 
            { palavra: "QUATRO", img: "numeros/quatro.png" }, 
            { palavra: "QUINTAL", img: "natureza/quintal.png" }, 
            { palavra: "QUENTE", img: "elementos/quente.png" }
        ]},
        R: { nome: "Letra R", img: "letra_r.png", itens: [
            { palavra: "RATO", img: "animais_domesticos/rato.png" }, 
            { palavra: "REI", img: "pessoas/rei.png" }, 
            { palavra: "RIO", img: "natureza/rio.png" }, 
            { palavra: "RODA", img: "objetos/roda.png" },
            { palavra: "RELÓGIO", img: "objetos/relogio.png" }
        ]},
        S: { nome: "Letra S", img: "letra_s.png", itens: [
            { palavra: "SOL", img: "espaço/sol.png" }, 
            { palavra: "SAPO", img: "animais_selvagens/sapo.png" }, 
            { palavra: "SOPA", img: "comida/sopa.png" }, 
            { palavra: "SINO", img: "objetos/sino.png" }, 
            { palavra: "SOFÁ", img: "objetos/sofa.png" }
        ]},
        T: { nome: "Letra T", img: "letra_t.png", itens: [
            { palavra: "TIGRE", img: "animais_selvagens/tigre.png" }, 
            { palavra: "COMBOIO", img: "transportes/comboio.png" }, 
            { palavra: "TOMATE", img: "legumes/tomate.png" }, 
            { palavra: "TESOURA", img: "materialescolar/tesoura.png" }, 
            { palavra: "TAMBOR", img: "objetos/tambor.png" }
        ]},
        U: { nome: "Letra U", img: "letra_u.png", itens: [
            { palavra: "UVA", img: "frutos/uva.png" }, 
            { palavra: "URSO", img: "animais_selvagens/urso.png" }, 
            { palavra: "UNHA", img: "corpo/unha.png" }, 
            { palavra: "UNICÓRNIO", img: "fantasia/unicornio.png" }, 
            { palavra: "UM", img: "numeros/um.png" }
        ]},
        V: { nome: "Letra V", img: "letra_v.png", itens: [
            { palavra: "VACA", img: "animais_domesticos/vaca.png" }, 
            { palavra: "VELA", img: "objetos/vela.png" }, 
            { palavra: "VASO", img: "objetos/vaso.png" }, 
            { palavra: "VIOLÃO", img: "objetos/violao.png" }, 
            { palavra: "VULCÃO", img: "natureza/vulcao.png" }
        ]},
        W: { nome: "Letra W", img: "letra_w.png", itens: [
            { palavra: "WAFER", img: "comida/wafer.png" }, 
            { palavra: "WEBCAM", img: "objetos/webcam.png" }, 
            { palavra: "WIFI", img: "objetos/wifi.png" }, 
            { palavra: "WAFFLE", img: "comida/waffle.png" }, 
            { palavra: "WALKMAN", img: "objetos/walkman.png" }
        ]},
        X: { nome: "Letra X", img: "letra_x.png", itens: [
            { palavra: "XÍCARA", img: "objetos/xicara.png" }, 
            { palavra: "XALE", img: "objetos/xale.png" }, 
            { palavra: "XADREZ", img: "objetos/xadrez.png" }, 
            { palavra: "XAROPE", img: "saude/xarope.png" }, 
            { palavra: "XILOFONE", img: "objetos/xilofone.png" }
        ]},
        Y: { nome: "Letra Y", img: "letra_y.png", itens: [
            { palavra: "YOGA", img: "desporto/yoga.png" }, 
            { palavra: "YAKISOBA", img: "comida/yakisoba.png" }, 
            { palavra: "YEN", img: "objetos/yen.png" }, 
            { palavra: "YETI", img: "fantasia/yeti.png" }, 
            { palavra: "YACHT", img: "transportes/yacht.png" }
        ]},
        Z: { nome: "Letra Z", img: "letra_z.png", itens: [
            { palavra: "ZEBRA", img: "animais_selvagens/zebra.png" }, 
            { palavra: "ZERO", img: "numeros/zero.png" }, 
            { palavra: "ZÍPER", img: "objetos/ziper.png" }, 
            { palavra: "ZANGÃO", img: "insetos/zangao.png" }, 
            { palavra: "ZOOLÓGICO", img: "objetos/zoologico.png" }
        ]}
    },
    relatorio: { 
        titulo: "MUITO BEM!", 
        pontosTotal: "Pontos Totais:", 
        tempoTotal: "Tempo Total:" 
    }
};
