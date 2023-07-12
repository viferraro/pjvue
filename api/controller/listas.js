var express = require('express');
var router = express.Router();

const config = require('../config/config.js');
const models = require('../model/models.js');

// endpoint para recuperar as listas paginadas 
router.get('/', async function(req, res) {
    var page = req.query.page || 1;
    var itemsPerPage = req.query.itemsPage || 5;
    var idQuadro = req.query.idQuadro;

    var db = await models.connect();

    var quadro = await db.Quadro.findById(idQuadro);

    var queryCount = db.Lista.find({ _id: { $in: quadro.listas } });
    var totalItems = await queryCount.count();

    var queryList = db.Lista
        .find({ _id: { $in: quadro.listas }})
        .limit(itemsPerPage)
        .skip(itemsPerPage * (page - 1));   
    
    var listas = await queryList.exec();
    var cards = [];

    var totalCards = 0;

    listas.forEach(function(item) {
        totalCards = Math.max(item.cards.length, totalCards);

        cards.push( {
            idLista: item._id,
            cards: item.cards
        });
    });

    res.json({ items: listas, totalItems, cards: cards, totalCards: totalCards });  
});

// endpoint para recuperar uma lista
router.get('/:id', async function(req, res) {
    var db = await models.connect();
    var lista = await db.Lista.findById(req.params.id);
    res.json(lista);
});

// endpoint para criar uma lista
router.post('/', async function(req, res) {
    var db = await models.connect();
    var titulo = req.body.titulo;
    var idQuadro = req.body.idQuadro;

    var quadro = await db.Quadro.findById(idQuadro);

    var lista = new db.Lista({
        idQuadro: idQuadro,
        titulo: titulo
    });

    try {
        quadro.listas.push(lista);
    } catch (error) {
        console.log(error);
        res.json({ message: 'Erro ao criar lista!' +  error });
        return;
    }

    await quadro.save();

    await lista.save();

    return res.json({ message: 'Lista criada com sucesso com o id ' + lista._id + ' !' });
});

// endpoint para atualizar uma lista
router.put('/:id', async function(req, res) {
    var db = await models.connect();
    var lista = await db.Lista.findById(req.params.id);    
    var tituloNovo = req.body.titulo;
    console.log("🚀 ~ file: listas.js:82 ~ router.put ~ tituloNovo:", tituloNovo)

    if (!lista) {
        res.json({ message: 'Lista não encontrada!' });
        return;
    }

    lista.titulo = tituloNovo !== "" ? tituloNovo : lista.titulo;
    lista.save();

    return res.json({ message: 'Lista atualizada com sucesso!' });
});

// endpoint para atualizar um card em uma lista
router.put('/:id/card', async function(req, res) {
    var db = await models.connect();
    var lista = await db.Lista.findById(req.params.id);    
    var cardNovo = findCardIndexById(lista, req.body._id);
    console.log("🚀 ~ file: listas.js:103 ~ router.put ~ lista:", lista)
    console.log("🚀 ~ file: listas.js:111 ~ router.put ~ req.body:", req.body)

    if (!lista) {
        res.json({ message: 'Lista não encontrada!' });
        return;
    }
    
    if (cardNovo == -1) {
        lista.cards.push({
            conteudo: req.body.conteudo,
            dtCriacao: req.body.dtCriacao,
            dtUltimaEdicao: Date.now()
        });
    }
    else {
        lista.cards[cardNovo].conteudo = req.body.conteudo || lista.cards[cardNovo].conteudo;
        lista.cards[cardNovo].dtUltimaEdicao = Date.now();
    }

    lista.save();

    return res.json({ message: 'Lista atualizada com sucesso!' });
});

// endpoint para deletar uma lista
router.delete('/:id', async function(req, res) {
    var db = await models.connect();
    var lista = await db.Lista.findById(req.params.id);

    if (!lista) {
        res.json({ message: 'Lista não encontrada!' });
        return;
    }

    await lista.deleteOne();

    return res.json({ message: 'Lista deletada com sucesso!' });
});


// endpoint para deletar um card de uma lista
router.delete('/:id/card/:idCard', async function(req, res) {
    var db = await models.connect();
    var lista = await db.Lista.findById(req.params.id);
    var idCard = req.params.idCard;

    if (!lista) {
        res.json({ message: 'Lista não encontrada!' });
        return;
    }

    console.log("🚀 ~ file: listas.js:155 ~ router.delete ~ idCard:", idCard)
    var novaLista = lista.cards.filter(card => {
        return card._id != idCard;
    });

    lista.cards = novaLista;

    lista.save();

    return res.json({ message: 'Card deletado com sucesso!' });
});


// FUNÇÕES AUXILIARES

// função para encontrar o índice de um card dentro de uma lista pelo _id
function findCardIndexById(lista, idCard) {
    for (var i = 0; i < lista.cards.length; i++) {
        if (lista.cards[i]._id == idCard) {
            return i;
        }
    }
    return -1;
}

module.exports = router;