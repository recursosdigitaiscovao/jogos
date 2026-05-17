const JOGO_CATEGORIAS = {
    saudavel: {
        nome: "Comida Saudável",
        descricao: "Alimenta o monstrinho apenas com alimentos SAUDÁVEIS!",
        imgCapa: "comida/alface.png",
        tipoAlvo: "bom",
        // Alvos: Alface, Bróculos, Cenoura, Couve, Ervilhas, Queijo
        alvos: ['alface.png', 'broculos.png', 'cenoura.png', 'couve.png', 'ervilhas.png', 'queijo.png'],
        // Distrações: Doces
        distracoes: ['bolo.png', 'chocolate.png', 'chupa.png', 'doce.png', 'goma.png', 'goma1.png', 'queque.png', 'rebucado.png', 'rebucado1.png']
    },
    doces: {
        nome: "Doces",
        descricao: "O monstrinho hoje só quer comer DOCES e GULOSEIMAS!",
        imgCapa: "comida/doce.png",
        tipoAlvo: "doce",
        // Alvos: Bolo, Chocolate, Chupa, Doce, Gomas, Queque, Rebuçados
        alvos: ['bolo.png', 'chocolate.png', 'chupa.png', 'doce.png', 'goma.png', 'goma1.png', 'queque.png', 'rebucado.png', 'rebucado1.png'],
        // Distrações: Saudáveis
        distracoes: ['alface.png', 'broculos.png', 'cenoura.png', 'couve.png', 'ervilhas.png', 'queijo.png']
    }
};
