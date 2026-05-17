const JOGO_CATEGORIAS = {
    saudavel: {
        nome: "Comida Saudável",
        descricao: "Alimenta o monstrinho apenas com alimentos SAUDÁVEIS!",
        imgCapa: "comida/maca.png",
        // Alvos: agua, alface, banana, broculos, cenoura, couve, ervilhas, figo, kiwi, laranja, maca, morango, pera
        alvos: [
            'agua.png', 'alface.png', 'banana.png', 'broculos.png', 'cenoura.png', 
            'couve.png', 'ervilhas.png', 'figo.png', 'kiwi.png', 'laranja.png', 
            'maca.png', 'morango.png', 'pera.png'
        ],
        // Distrações: Doces e Refrigerantes
        distracoes: [
            'bolo.png', 'chocolate.png', 'chupa.png', 'cocacola.png', 'doce.png', 
            'goma.png', 'goma1.png', 'queque.png', 'rebucado.png', 'rebucado1.png', 'soda.png'
        ]
    },
    doces: {
        nome: "Doces",
        descricao: "O monstrinho hoje só quer comer DOCES e GULOSEIMAS!",
        imgCapa: "comida/chocolate.png",
        // Alvos: bolo, chocolate, chupa, cocacola, doce, goma, goma1, queque, rebucado, rebucado1, soda
        alvos: [
            'bolo.png', 'chocolate.png', 'chupa.png', 'cocacola.png', 'doce.png', 
            'goma.png', 'goma1.png', 'queque.png', 'rebucado.png', 'rebucado1.png', 'soda.png'
        ],
        // Distrações: Saudáveis
        distracoes: [
            'agua.png', 'alface.png', 'banana.png', 'broculos.png', 'cenoura.png', 
            'couve.png', 'ervilhas.png', 'figo.png', 'kiwi.png', 'laranja.png', 
            'maca.png', 'morango.png', 'pera.png'
        ]
    }
};
