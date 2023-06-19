var express = require('express');
var router = express.Router();

const config = require('../config/config.js');
const models = require('../model/models.js');

// endpoint para recuperar os cards paginados
router.get('/cards', async function(req, res, next) {
    var page = req.params.page || 1;
    var itemsPerPage = req.params.itemsPerPage || 5;

    var db = await models.connect();
    var queryCount = db.Card.find({});
    var totalItems = queryCount.count();

    var queryList = db.Card.find({}).limit(itemsPerPage).skip(itemsPerPage * (page - 1));
    var items = queryList.exec();

    res.json({ items: totalItems });
});

// endpoint para recuperar um card
router.get('/cards/:id', async function(req, res) {
    var db = await models.connect();
    var card = await db.Card.findById(req.params.id);
    res.json(card);
});

// endpoint para criar um card
router.post('/cards', async function(req, res) {
    var db = await models.connect();
    var conteudo = req.body.conteudo;

    var card = new db.Card({
        conteudo: conteudo,
        dtCriacao: new Date(),
        dtUltimaEdicao: new Date()
    });
    await card.save();

    return res.json({ message: 'Card criado com sucesso com o id ' + card._id + ' !' });

});

// endpoint para atualizar um card
router.put('/cards/:id', async function(req, res) {
    var db = await models.connect();
    var card = await db.Card.findById(req.params.id);

    if (!card) {
        res.json({ message: 'Card não encontrado!' });
        return;
    }

    card.conteudo = req.body.conteudo;
    card.dtUltimaEdicao = new Date();
    await card.save();

    res.json({ message: 'Card atualizado com sucesso!' });
});

// endpoint para remover um card
router.delete('/cards/:id', async function(req, res) {
    var db = await models.connect();
    var card = await db.Card.findById(req.params.id);

    if (!card) {
        res.json({ message: 'Card não encontrado!' });
        return;
    }

    await card.remove();

    res.json({ message: 'Card removido com sucesso!' });
});


module.exports = router;
