var express = require('express');
var router = express.Router();

const config = require('../config/config.js');
const models = require('../model/models.js');

// endpoint para recuperar os quadros paginados
router.get('/quadros', async function(req, res) {
    var page = req.params.page || 1;
    var itemsPerPage = req.params.itemsPerPage || 5;

    var db = await models.connect();
    var queryCount = db.Quadro.find({});
    var totalItems = queryCount.count();

    var queryList = db.Quadro.find({}).limit(itemsPerPage).skip(itemsPerPage * (page - 1));
    var items = queryList.exec();

    res.json({ items: totalItems });
});

// endpoint para recuperar um quadro
router.get('/quadros/:id', async function(req, res) {
    var db = await models.connect();
    var quadro = await db.Quadro.findById(req.params.id);
    res.json(quadro);
});

// endpoint para criar um quadro
router.post('/quadros', async function(req, res) {
    var db = await models.connect();
    var titulo = req.body.titulo;
    var corFundo = req.body.corFundo || "#4071ad";
    var corTexto = req.body.corTexto || "#000000";
    var editavel = req.body.editavel;
    var favorito = req.body.favorito;

    var quadro = new db.Quadro({
        titulo: titulo,
        corFundo: corFundo,
        corTexto: corTexto,
        editavel: editavel,
        favorito: favorito
    });
    await quadro.save();

    return res.json({ message: 'Quadro criado com sucesso com o id ' + quadro._id + ' !' });

});

// endpoint para atualizar um quadro
router.put('/quadros/:id', async function(req, res) {
    var db = await models.connect();
    var quadro = await db.Quadro.findById(req.params.id);

    if (!quadro) {
        res.json({ message: 'Quadro não encontrado!' });
        return;
    }

    quadro.titulo = req.body.titulo;
    quadro.corFundo = req.body.corFundo;
    quadro.corTexto = req.body.corTexto;
    quadro.editavel = req.body.editavel;
    quadro.favorito = req.body.favorito;
    await quadro.save();

    res.json({ message: 'Quadro atualizado com sucesso!' });
});

// endpoint para deletar um quadro
router.delete('/quadros/:id', async function(req, res) {
    var db = await models.connect();
    var quadro = await db.Quadro.findById(req.params.id);

    if (!quadro) {
        res.json({ message: 'Quadro não encontrado!' });
        return;
    }

    await quadro.remove();

    res.json({ message: 'Quadro removido com sucesso!' });
});

module.exports = router;