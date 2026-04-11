const JOGO_CONFIG = {
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    caminhoCat: "../../../img/letras/", // Pasta correta das letras
    iconesMenu: { 
        pre: "iconpre.png", 
        ano1: "icon1.png", 
        ano2: "icon2.png", 
        ano3: "icon3.png", 
        ano4: "icon4.png" 
    },
    categorias: {
        A: { nome: "Letra A", img: "letra_a.png", itens: [
            { palavra: "AVIÃO", img: "aviao.png" }, { palavra: "ABELHA", img: "abelha.png" }, { palavra: "ANEL", img: "anel.png" }, { palavra: "ARANHA", img: "aranha.png" }, { palavra: "ÁRVORE", img: "arvore.png" }
        ]},
        B: { nome: "Letra B", img: "letra_b.png", itens: [
            { palavra: "BOLA", img: "bola.png" }, { palavra: "BONECA", img: "boneca.png" }, { palavra: "BALEIA", img: "baleia.png" }, { palavra: "BANANA", img: "banana.png" }, { palavra: "BARCO", img: "barco.png" }
        ]},
        C: { nome: "Letra C", img: "letra_c.png", itens: [
            { palavra: "CASA", img: "casa.png" }, { palavra: "CARRO", img: "carro.png" }, { palavra: "CAVALO", img: "cavalo.png" }, { palavra: "COELHO", img: "coelho.png" }, { palavra: "CADERNO", img: "caderno.png" }
        ]},
        D: { nome: "Letra D", img: "letra_d.png", itens: [
            { palavra: "DADO", img: "dado.png" }, { palavra: "DEDO", img: "dedo.png" }, { palavra: "DOCE", img: "doce.png" }, { palavra: "DENTE", img: "dente.png" }, { palavra: "DRAGÃO", img: "dragao.png" }
        ]},
        E: { nome: "Letra E", img: "letra_e.png", itens: [
            { palavra: "ESTRELA", img: "estrela.png" }, { palavra: "ESCOVA", img: "escova.png" }, { palavra: "ELEFANTE", img: "elefante.png" }, { palavra: "ESQUILO", img: "esquilo.png" }, { palavra: "ESCADA", img: "escada.png" }
        ]},
        F: { nome: "Letra F", img: "letra_f.png", itens: [
            { palavra: "FOCA", img: "foca.png" }, { palavra: "FADA", img: "fada.png" }, { palavra: "FOGO", img: "fogo.png" }, { palavra: "FLOR", img: "flor.png" }, { palavra: "FACA", img: "faca.png" }
        ]},
        G: { nome: "Letra G", img: "letra_g.png", itens: [
            { palavra: "GATO", img: "gato.png" }, { palavra: "GALO", img: "galo.png" }, { palavra: "GIRAFA", img: "girafa.png" }, { palavra: "GARFO", img: "garfo.png" }, { palavra: "GELO", img: "gelo.png" }
        ]},
        H: { nome: "Letra H", img: "letra_h.png", itens: [
            { palavra: "HARPA", img: "harpa.png" }, { palavra: "HIENA", img: "hiena.png" }, { palavra: "HÉLICE", img: "helice.png" }, { palavra: "HORTA", img: "horta.png" }, { palavra: "HOTEL", img: "hotel.png" }
        ]},
        I: { nome: "Letra I", img: "letra_i.png", itens: [
            { palavra: "ILHA", img: "ilha.png" }, { palavra: "IGREJA", img: "igreja.png" }, { palavra: "ÍMAN", img: "iman.png" }, { palavra: "ÍNDIO", img: "indio.png" }, { palavra: "IOIÔ", img: "ioio.png" }
        ]},
        J: { nome: "Letra J", img: "letra_j.png", itens: [
            { palavra: "JANELA", img: "janela.png" }, { palavra: "JACARÉ", img: "jacare.png" }, { palavra: "JIPE", img: "jipe.png" }, { palavra: "JARRA", img: "jarra.png" }, { palavra: "JOANINHA", img: "joaninha.png" }
        ]},
        K: { nome: "Letra K", img: "letra_k.png", itens: [
            { palavra: "KIWI", img: "kiwi.png" }, { palavra: "KART", img: "kart.png" }, { palavra: "KARATE", img: "karate.png" }, { palavra: "KOALA", img: "koala.png" }, { palavra: "KILO", img: "kilo.png" }
        ]},
        L: { nome: "Letra L", img: "letra_l.png", itens: [
            { palavra: "LEÃO", img: "leao.png" }, { palavra: "LÁPIS", img: "lapis.png" }, { palavra: "LUA", img: "lua.png" }, { palavra: "LIVRO", img: "livro.png" }, { palavra: "LUVA", img: "luva.png" }
        ]},
        M: { nome: "Letra M", img: "letra_m.png", itens: [
            { palavra: "MACACO", img: "macaco.png" }, { palavra: "MAÇÃ", img: "maca.png" }, { palavra: "MESA", img: "mesa.png" }, { palavra: "MOTA", img: "mota.png" }, { palavra: "MÃO", img: "mao.png" }
        ]},
        N: { nome: "Letra N", img: "letra_n.png", itens: [
            { palavra: "NAVIO", img: "navio.png" }, { palavra: "NUVEM", img: "nuvem.png" }, { palavra: "NINHO", img: "ninho.png" }, { palavra: "NARIZ", img: "nariz.png" }, { palavra: "NOVELO", img: "novelo.png" }
        ]},
        O: { nome: "Letra O", img: "letra_o.png", itens: [
            { palavra: "OLHO", img: "olho.png" }, { palavra: "OVO", img: "ovo.png" }, { palavra: "OVELHA", img: "ovelha.png" }, { palavra: "ÓCULOS", img: "oculos.png" }, { palavra: "ONDA", img: "onda.png" }
        ]},
        P: { nome: "Letra P", img: "letra_p.png", itens: [
            { palavra: "PATO", img: "pato.png" }, { palavra: "PÃO", img: "pao.png" }, { palavra: "PEIXE", img: "peixe.png" }, { palavra: "PORCO", img: "porco.png" }, { palavra: "PORTA", img: "porta.png" }
        ]},
        Q: { nome: "Letra Q", img: "letra_q.png", itens: [
            { palavra: "QUEIJO", img: "queijo.png" }, { palavra: "QUADRO", img: "quadro.png" }, { palavra: "QUATRO", img: "quatro.png" }, { palavra: "QUINTAL", img: "quintal.png" }, { palavra: "QUENTE", img: "quente.png" }
        ]},
        R: { nome: "Letra R", img: "letra_r.png", itens: [
            { palavra: "RATO", img: "rato.png" }, { palavra: "REI", img: "rei.png" }, { palavra: "RIO", img: "rio.png" }, { palavra: "RODA", img: "roda.png" }, { palavra: "RELÓGIO", img: "relogio.png" }
        ]},
        S: { nome: "Letra S", img: "letra_s.png", itens: [
            { palavra: "SOL", img: "sol.png" }, { palavra: "SAPO", img: "sapo.png" }, { palavra: "SOPA", img: "sopa.png" }, { palavra: "SINO", img: "sino.png" }, { palavra: "SOFÁ", img: "sofa.png" }
        ]},
        T: { nome: "Letra T", img: "letra_t.png", itens: [
            { palavra: "TIGRE", img: "tigre.png" }, { palavra: "COMBOIO", img: "comboio.png" }, { palavra: "TOMATE", img: "tomate.png" }, { palavra: "TESOURA", img: "tesoura.png" }, { palavra: "TAMBOR", img: "tambor.png" }
        ]},
        U: { nome: "Letra U", img: "letra_u.png", itens: [
            { palavra: "UVA", img: "uva.png" }, { palavra: "URSO", img: "urso.png" }, { palavra: "UNHA", img: "unha.png" }, { palavra: "UNICÓRNIO", img: "unicornio.png" }, { palavra: "UM", img: "um.png" }
        ]},
        V: { nome: "Letra V", img: "letra_v.png", itens: [
            { palavra: "VACA", img: "vaca.png" }, { palavra: "VELA", img: "vela.png" }, { palavra: "VASO", img: "vaso.png" }, { palavra: "VIOLÃO", img: "violao.png" }, { palavra: "VULCÃO", img: "vulcao.png" }
        ]},
        W: { nome: "Letra W", img: "letra_w.png", itens: [
            { palavra: "WAFER", img: "wafer.png" }, { palavra: "WEBCAM", img: "webcam.png" }, { palavra: "WIFI", img: "wifi.png" }, { palavra: "WAFFLE", img: "waffle.png" }, { palavra: "WALKMAN", img: "walkman.png" }
        ]},
        X: { nome: "Letra X", img: "letra_x.png", itens: [
            { palavra: "XÍCARA", img: "xicara.png" }, { palavra: "XALE", img: "xale.png" }, { palavra: "XADREZ", img: "xadrez.png" }, { palavra: "XAROPE", img: "xarope.png" }, { palavra: "XILOFONE", img: "xilofone.png" }
        ]},
        Y: { nome: "Letra Y", img: "letra_y.png", itens: [
            { palavra: "YOGA", img: "yoga.png" }, { palavra: "YAKISOBA", img: "yakisoba.png" }, { palavra: "YEN", img: "yen.png" }, { palavra: "YETI", img: "yeti.png" }, { palavra: "YACHT", img: "yacht.png" }
        ]},
        Z: { nome: "Letra Z", img: "letra_z.png", itens: [
            { palavra: "ZEBRA", img: "zebra.png" }, { palavra: "ZERO", img: "zero.png" }, { palavra: "ZÍPER", img: "ziper.png" }, { palavra: "ZANGÃO", img: "zangao.png" }, { palavra: "ZOOLÓGICO", img: "zoologico.png" }
        ]}
    },
    relatorio: { 
        titulo: "MUITO BEM!", 
        pontosTotal: "Pontos Totais:", 
        tempoTotal: "Tempo Total:" 
    }
};
