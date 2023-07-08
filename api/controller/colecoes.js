var express = require('express');
var router = express.Router();

const config = require('../config/config.js');
const models = require('../model/models.js');
const auth = require('../auth/auth.js');

// endpoint para recuperar as colecoes paginadas
router.get('/', async function(req, res) {

    var claims = getClaims(req, res);
    console.log("🚀 ~ file: colecoes.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var page = req.query.page || 1;
    var itemsPerPage = req.query.itemsPage || 5;
    var filter = req.query.filter || '';

    var db = await models.connect();
    const regex = new RegExp(filter, "i");

    var usuario = await db.Usuario.findOne({ email: claims.email });

    var queryList = db.Colecao
        .find({ _id: { $in: usuario.colecoes } })
        .limit(itemsPerPage)
        .skip(itemsPerPage * (page-1));

    if (req.query.sortField) {
        var sortField = req.query.sortField || '';
        var sortDesc = (req.query.sortDesc == "true") ? "descending" : "ascending";
        queryList = queryList.sort([[sortField, sortDesc]]);
    }

    var colecoes = await queryList.exec();
    res.json({ colecoes });
});


// endpoint para recuperar uma colecao
router.get('/:id', async function(req, res) {

    if (!getClaims(req, res)) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var db = await models.connect();
    var colecao = await db.Colecao.findById(req.params.id);
    res.json(colecao);
});

// endpoint para criar uma colecao
router.post('/', async function(req, res) {

    var claims = getClaims(req, res);
    console.log("🚀 ~ file: colecoes.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var db = await models.connect();
    var titulo = req.body.titulo;
    var corFundo = req.body.corFundo || "#4071ad";
    var corTexto = req.body.corTexto || "#000000";

    var colecao = new db.Colecao({
        titulo: titulo,
        corFundo: corFundo,
        corTexto: corTexto,
    });

    // Adiciona a colecao ao usuario
    var usuario = await db.Usuario.findOne({ email: claims.email });
    usuario.colecoes.push(colecao);
    await usuario.save();

    await colecao.save();

    return res.json({ message: 'Colecao criada com sucesso com o id ' + colecao._id + ' !' });

});

// endpoint para atualizar uma colecao
router.put('/:id', async function(req, res) {

    if (!getClaims(req, res)) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var db = await models.connect();
    var colecao = await db.Colecao.findById(req.params.id);

    if (!colecao) {
        res.json({ message: 'Colecao não encontrada!' });
        return;
    }

    colecao.titulo = req.body.titulo || colecao.titulo;

    await colecao.save();

    res.json({ message: 'Colecao atualizado com sucesso!' });
});

// endpoint para deletar uma colecao
router.delete('/:id', async function(req, res) {

    if (!getClaims(req, res)) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var db = await models.connect();
    var colecao = await db.Colecao.findById(req.params.id);

    if (!colecao) {
        res.json({ message: 'Colecao não encontrada!' });
        return;
    }

    await colecao.deleteOne();

    res.json({ message: 'Colecao removida com sucesso!' });
});




//  FUNÇÕES AUXILIARES
// Função para validar o token de acesso
function getClaims(req, res) {

    var claims = auth.verifyToken(req, res);

    if (!claims) {
        return null;
    }

    return claims;
};

module.exports = router;