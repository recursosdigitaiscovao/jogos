const JOGO_CONFIG = {
    nomeJogo: "FOGUETÃO DAS RIMAS",
    linkVoltar: "../", 
    textoVoltar: "VOLTAR",
    caminhoImg: "../../../img/",
    caminhoIcons: "../../../icons/",
    
    pontuacao: { acerto: 100, erro: 30 },
    textos: {
        instrucao: "Recolhe os asteroides que rimam com a palavra do foguetão!",
        rodape: "&copy; Pequenos Leitores - Recursos Educativos"
    },
    sons: {
        acerto: "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3",
        erro: "https://cdn.pixabay.com/audio/2022/03/10/audio_c330c67761.mp3",
        vitoria: "https://cdn.pixabay.com/audio/2024/02/07/audio_293963428f.mp3"
    },
    iconesMenu: { home: "home.png", pre: "iconpre.png", ano1: "icon1.png", ano2: "icon2.png", ano3: "icon3.png", ano4: "icon4.png" },
    links: { home: "/jogos", pre: "/jogos/pre", ano1: "/jogos/1", ano2: "/jogos/2", ano3: "/jogos/3", ano4: "/jogos/4" },

    categorias: {
        cat1: {
            nome: "Sons Simples (A-O-E)",
            niveis: {
                facil: [
                    { alvo: "GATO", rimas: ["RATO", "PATO"], dist: ["BOLA", "CASA"] },
                    { alvo: "MÃO", rimas: ["CÃO", "PÃO"], dist: ["LUA", "PEIXE"] },
                    { alvo: "SOL", rimas: ["GOL", "ROL"], dist: ["MAR", "REI"] },
                    { alvo: "REI", rimas: ["LEI", "PAI"], dist: ["MÃE", "SOL"] },
                    { alvo: "CASA", rimas: ["ASA", "BRASA"], dist: ["FOGO", "GELO"] },
                    // Subnível 2
                    { alvo: "BOLA", rimas: ["COLA", "MOLA"], dist: ["DADO", "BOLO"] },
                    { alvo: "FOGO", rimas: ["JOGO", "LOGO"], dist: ["ÁGUA", "TERRA"] },
                    { alvo: "PÉ", rimas: ["CAFÉ", "CHULÉ"], dist: ["MÃO", "DEDO"] },
                    { alvo: "BOLO", rimas: ["ROLO", "COLO"], dist: ["DOCE", "BALA"] },
                    { alvo: "LUA", rimas: ["RUA", "TUA"], dist: ["SOL", "CÉU"] }
                ],
                normal: [
                    { alvo: "PATO", rimas: ["SAPATO", "PRATO"], dist: ["COPO", "FACA"] },
                    { alvo: "BALÃO", rimas: ["AVIÃO", "SABÃO"], dist: ["CARRO", "MOTO"] },
                    { alvo: "JANELA", rimas: ["PANELA", "CANELA"], dist: ["PORTA", "MESA"] },
                    { alvo: "GELADO", rimas: ["DADO", "CADEADO"], dist: ["QUENTE", "FRIO"] },
                    { alvo: "SAPO", rimas: ["TRAPO", "GUAPO"], dist: ["RÃ", "LAGO"] },
                    // Subnível 2
                    { alvo: "MARTELO", rimas: ["AMARELO", "COLO"], dist: ["PREGO", "MADEIRA"] },
                    { alvo: "ESPELHO", rimas: ["COELHO", "VERMELHO"], dist: ["VIDRO", "CARA"] },
                    { alvo: "COVE", rimas: ["NOVE", "CHOVE"], dist: ["DEZ", "SOL"] },
                    { alvo: "MALETA", rimas: ["CANETA", "GAVETA"], dist: ["LÁPIS", "LIVRO"] },
                    { alvo: "CHAVE", rimas: ["AVE", "NAVE"], dist: ["PORTA", "CÉU"] }
                ],
                dificil: [
                    { alvo: "CAMIÃO", rimas: ["TELEVISÃO", "CORAÇÃO"], dist: ["ESTRADA", "AMOR"] },
                    { alvo: "BORBOLETA", rimas: ["TROMBETA", "PLANETA"], dist: ["ASAS", "FLOR"] },
                    { alvo: "ESCORREGA", rimas: ["PEGA", "REGA"], dist: ["PARQUE", "BRINCAR"] },
                    { alvo: "DINHEIRO", rimas: ["BANDEIRO", "CHEIRO"], dist: ["MOEDA", "BANCO"] },
                    { alvo: "BICICLETA", rimas: ["RECEITA", "GAZETA"], dist: ["RODAS", "PEDAL"] },
                    // Subnível 2
                    { alvo: "TESOURA", rimas: ["VASSOURA", "CENOURA"], dist: ["PAPEL", "CORTAR"] },
                    { alvo: "CHAMPÔ", rimas: ["AVÔ", "TAMBÓ"], dist: ["BANHO", "SABÃO"] },
                    { alvo: "CARACOL", rimas: ["GIRASSOL", "LENÇOL"], dist: ["CASCA", "CAMA"] },
                    { alvo: "MOCHILA", rimas: ["ARGILA", "FILA"], dist: ["ESCOLA", "PESO"] },
                    { alvo: "ESCURO", rimas: ["MURO", "FURO"], dist: ["LUZ", "NOITE"] }
                ]
            }
        },
        cat2: {
            nome: "Natureza e Animais",
            niveis: {
                facil: [
                    { alvo: "LEÃO", rimas: ["PEÃO", "MÃO"], dist: ["REI", "SELVA"] },
                    { alvo: "FLOR", rimas: ["COR", "DOR"], dist: ["JARDIM", "PLANTA"] },
                    { alvo: "MAR", rimas: ["DAR", "LAR"], dist: ["AREIA", "PEIXE"] },
                    { alvo: "CÉU", rimas: ["VÉU", "RÉU"], dist: ["AZUL", "NUVEM"] },
                    { alvo: "MEL", rimas: ["ANEL", "PAPEL"], dist: ["DOCE", "ABELHA"] },
                    // Subnível 2
                    { alvo: "RÃ", rimas: ["LÃ", "IRMÃ"], dist: ["SAPO", "VERDE"] },
                    { alvo: "BOI", rimas: ["FOI", "MOI"], dist: ["VACA", "LEITE"] },
                    { alvo: "PAI", rimas: ["VAI", "SAI"], dist: ["MÃE", "FILHO"] },
                    { alvo: "RIO", rimas: ["FRIO", "FIO"], dist: ["ÁGUA", "PEIXE"] },
                    { alvo: "AR", rimas: ["PAR", "LUAR"], dist: ["VENTO", "RESPIRAR"] }
                ],
                normal: [
                    { alvo: "GIRAFA", rimas: ["GARRAFA", "RIFA"], dist: ["PESCOÇO", "ALTO"] },
                    { alvo: "BALEIA", rimas: ["SEREIA", "AREIA"], dist: ["OCEANO", "PEIXE"] },
                    { alvo: "COELHO", rimas: ["JOELHO", "CONSELHO"], dist: ["CENOURA", "ORELHA"] },
                    { alvo: "MAC ACO", rimas: ["CASACO", "BURACO"], dist: ["BANANA", "ÁRVORE"] },
                    { alvo: "FORMIGA", rimas: ["BARRIGA", "AMIGA"], dist: ["DOCE", "PEQUENO"] },
                    // Subnível 2
                    { alvo: "ESTRELA", rimas: ["CADELA", "AMARELA"], dist: ["CÉU", "NOITE"] },
                    { alvo: "OVELHA", rimas: ["ORELHA", "ABELHA"], dist: ["LÃ", "CAMPO"] },
                    { alvo: "GALINHA", rimas: ["RAINHA", "LINHA"], dist: ["OVO", "MILHO"] },
                    { alvo: "ARANHA", rimas: ["MONTANHA", "BANHA"], dist: ["TEIA", "BICHOS"] },
                    { alvo: "PÁSSARO", rimas: ["PÁSSARO", "AMPARO"], dist: ["VOAR", "ASAS"] }
                ],
                dificil: [
                    { alvo: "GAFANHOTO", rimas: ["CANHOTO", "PILOTO"], dist: ["VERDE", "SALTAR"] },
                    { alvo: "TARTARUGA", rimas: ["VERRUGA", "FUGA"], dist: ["CASCA", "LENTO"] },
                    { alvo: "PIRILAMP O", rimas: ["CAMPO", "GRAMPO"], dist: ["LUZ", "NOITE"] },
                    { alvo: "ESCORPIÃO", rimas: ["GAVIÃO", "PIÃO"], dist: ["VENENO", "DESERTO"] },
                    { alvo: "CAMALEÃO", rimas: ["BALÃO", "CHÃO"], dist: ["CORES", "LÍNGUA"] },
                    // Subnível 2
                    { alvo: "ESQUILO", rimas: ["QUILO", "ASILO"], dist: ["NOZ", "CAUDA"] },
                    { alvo: "HIPOPÓTAM O", rimas: ["RAMO", "AMO"], dist: ["ÁGUA", "PESADO"] },
                    { alvo: "DINOSSAUR O", rimas: ["OURO", "LOURO"], dist: ["FÓSSIL", "GRANDE"] },
                    { alvo: "PAPAGAIO", rimas: ["RAIO", "MAIO"], dist: ["FALAR", "CORES"] },
                    { alvo: "CROCODILO", rimas: ["ESTILO", "QUILO"], dist: ["DENTES", "RIO"] }
                ]
            }
        },
        cat3: {
            nome: "Escola e Objetos",
            niveis: {
                facil: [
                    { alvo: "GIZ", rimas: ["NARIZ", "FELIZ"], dist: ["QUADRO", "LOUZA"] },
                    { alvo: "COLA", rimas: ["MOLA", "ESCOLA"], dist: ["PAPEL", "CORTAR"] },
                    { alvo: "MESA", rimas: ["PRESA", "SURPRESA"], dist: ["CADEIRA", "SALA"] },
                    { alvo: "COR", rimas: ["AMOR", "VALOR"], dist: ["LÁPIS", "PINTAR"] },
                    { alvo: "SALA", rimas: ["MALA", "FALA"], dist: ["AULA", "ALUNO"] },
                    // Subnível 2
                    { alvo: "LIVRO", rimas: ["ESCRITO", "BONITO"], dist: ["LER", "PÁGINA"] },
                    { alvo: "BANCO", rimas: ["BRANCO", "MANCO"], dist: ["SENTAR", "PÁTIO"] },
                    { alvo: "RECORTE", rimas: ["SORTE", "FORTE"], dist: ["TESOURA", "PAPEL"] },
                    { alvo: "CADEIRA", rimas: ["MADEIRA", "BANDEIRA"], dist: ["ASSENTO", "MESA"] },
                    { alvo: "QUADRO", rimas: ["TEATRO", "QUATRO"], dist: ["GIZ", "LOUZA"] }
                ],
                normal: [
                    { alvo: "CADERNO", rimas: ["TERNO", "INVERNO"], dist: ["ESCREVER", "FOLHA"] },
                    { alvo: "ESTOJO", rimas: ["RELOJO", "MOJO"], dist: ["LÁPIS", "CANETA"] },
                    { alvo: "CANETA", rimas: ["MALETA", "POETA"], dist: ["TINTA", "PAPEL"] },
                    { alvo: "MUSEU", rimas: ["CEU", "TEU"], dist: ["ARTE", "ANTIGO"] },
                    { alvo: "PÁTIO", rimas: ["RÁDIO", "LÁBIO"], dist: ["RECREIO", "JOGAR"] },
                    // Subnível 2
                    { alvo: "GAVETA", rimas: ["MALETA", "CORNETA"], dist: ["ARMÁRIO", "ABRIR"] },
                    { alvo: "CORTINA", rimas: ["MENINA", "BOCINA"], dist: ["JANELA", "SALA"] },
                    { alvo: "TAPETE", rimas: ["SORVETE", "FOGUETE"], dist: ["CHÃO", "CASA"] },
                    { alvo: "MOCHILA", rimas: ["ARGILA", "VILA"], dist: ["ESCOLA", "PESO"] },
                    { alvo: "TESOURA", rimas: ["CENOURA", "LOURA"], dist: ["CORTAR", "PAPEL"] }
                ],
                dificil: [
                    { alvo: "BIBLIOTECA", rimas: ["BONECA", "SONECA"], dist: ["LIVRO", "SILÊNCIO"] },
                    { alvo: "PROFESSORA", rimas: ["VASSOURA", "CENOURA"], dist: ["ENSINAR", "ESCOLA"] },
                    { alvo: "CALCULADORA", rimas: ["AMORA", "HORA"], dist: ["NÚMEROS", "MATEMÁTICA"] },
                    { alvo: "DICIONÁRIO", rimas: ["CALENDÁRIO", "HORÁRIO"], dist: ["PALAVRA", "SIGNIFICADO"] },
                    { alvo: "ALFABETO", rimas: ["CORETO", "TETO"], dist: ["LETRAS", "LER"] },
                    // Subnível 2
                    { alvo: "APONTADOR", rimas: ["TRABALHADOR", "CALOR"], dist: ["LÁPIS", "AFIA"] },
                    { alvo: "ESTUDANTE", rimas: ["ELEFANTE", "GIGANTE"], dist: ["ALUNO", "APRENDER"] },
                    { alvo: "APAGADOR", rimas: ["VENDEDOR", "DOR"], dist: ["QUADRO", "LIMPAR"] },
                    { alvo: "RECREIO", { rimas: ["CHEIO", "MEIO"], dist: ["BRINCAR", "ESCOLA"] } },
                    { alvo: "CAMPUS", rimas: ["PAMPAS", "TAMPAS"], dist: ["ESCOLA", "GRANDE"] }
                ]
            }
        }
    },

    relatorios: [
        { min: 1000, titulo: "COMANDANTE SUPREMO!", img: "taca_1.png" },
        { min: 700, titulo: "PILOTO ESPACIAL!", img: "taca_2.png" },
        { min: 400, titulo: "CADETE DO ESPAÇO!", img: "taca_3.png" },
