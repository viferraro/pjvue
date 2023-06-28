var express = require('express');
var router = express.Router();

const config = require('../config/config.js');
const models = require('../model/models.js');

// endpoint para recuperar as listas paginadas
router.get('/', async function(req, res) {
    var page = req.query.page || 1;
    var itemsPerPage = req.query.itemsPage || 5;

    var db = await models.connect();
    var queryCount = db.Lista.find({});
    var totalItems = await queryCount.count();

    var queryList = db.Lista
        .find({})
        .limit(itemsPerPage)
        .skip(itemsPerPage * (page - 1));   
    
    var items = await queryList.exec();
    res.json({ items, totalItems });  
});

// endpoint para recuperar uma lista
router.get('/:id', async function(req, res) {
    var db = await models.connect();
    var lista = await db.Quadro.Lista.findById(req.params.id);
    res.json(lista);
});

// endpoint para criar uma lista
router.post('/', async function(req, res) {
    var db = await models.connect();
    var titulo = req.body.titulo;
    var idQuadro = req.headers.quadro;

    var quadro = await db.Quadro.findById(idQuadro);

    var lista = new db.Lista({
        titulo: titulo
    });

    quadro.listas.push(lista);
    await quadro.save();

    await lista.save();

    return res.json({ message: 'Lista criada com sucesso com o id ' + lista._id + ' !' });
});

// endpoint para atualizar uma lista
router.put('/:id', async function(req, res) {
    var db = await models.connect();
    var lista = await db.Quadro.Lista.findById(req.params.id);

    if (!lista) {
        res.json({ message: 'Lista não encontrada!' });
        return;
    }

    lista.titulo = req.body.titulo;
    lista.save();

    return res.json({ message: 'Lista atualizada com sucesso!' });
});

// endpoint para deletar uma lista
router.delete('/:id', async function(req, res) {
    var db = await models.connect();
    var lista = await db.Quadro.Lista.findById(req.params.id);

    if (!lista) {
        res.json({ message: 'Lista não encontrada!' });
        return;
    }

    await lista.remove();

    return res.json({ message: 'Lista deletada com sucesso!' });
});

module.exports = router;