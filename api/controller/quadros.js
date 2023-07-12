var express = require('express');
var router = express.Router();

const config = require('../config/config.js');
const models = require('../model/models.js');
const auth = require('../auth/auth.js');

// endpoint para recuperar os quadros paginados
router.get('/', async function(req, res) {

    var claims = getClaims(req, res);
    console.log("🚀 ~ file: quadros.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }    

    var db = await models.connect();

    var usuario = await db.Usuario.findOne({ email: claims.email });    

    var queryList = db.Quadro
        .find({ _id: { $in: usuario.quadros } });

    var quadros = await queryList.exec();
    res.json({ quadros });    
});


// endpoint para recuperar um quadro
router.get('/:id', async function(req, res) {

    if (!getClaims(req, res)) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var db = await models.connect();
    var quadro = await db.Quadro.findById(req.params.id);
    res.json(quadro);
});

// endpoint para criar um quadro
router.post('/', async function(req, res) {

    var claims = getClaims(req, res);
    console.log("🚀 ~ file: quadros.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

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
        favorito: favorito,
        acesso: [claims.email]
    });

    // Adiciona o quadro ao usuario
    var usuario = await db.Usuario.findOne({ email: claims.email });
    usuario.quadros.push(quadro);    
    await usuario.save();
    
    await quadro.save();    

    return res.json({ message: 'Quadro criado com sucesso com o id ' + quadro._id + ' !' });

});

// endpoint para atualizar um quadro
router.put('/:id', async function(req, res) {

    if (!getClaims(req, res)) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var db = await models.connect();
    var quadro = await db.Quadro.findById(req.params.id);

    if (!quadro) {
        res.json({ message: 'Quadro não encontrado!' });
        return;
    }

    quadro.titulo = req.body.titulo !== null ? req.body.titulo : quadro.titulo;
    quadro.corFundo = req.body.corFundo !== null ? req.body.corFundo : quadro.corFundo;
    quadro.corTexto = req.body.corTexto !== null ? req.body.corTexto : quadro.corTexto;
    quadro.editavel = req.body.editavel !== null ? req.body.editavel : quadro.editavel;
    quadro.favorito = req.body.favorito !== null ? req.body.favorito : quadro.favorito;
    quadro.listas = req.body.listas || quadro.listas;
    await quadro.save();

    res.json({ message: 'Quadro atualizado com sucesso!' });
});

// endpoint para deletar um quadro
router.delete('/:id', async function(req, res) {

    var claims = getClaims(req, res);

    if (!getClaims(req, res)) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var db = await models.connect();
    var usuario = await db.Usuario.findOne({ email: claims.email });
    var quadro = await db.Quadro.findById(req.params.id);

    if (!quadro) {
        res.json({ message: 'Quadro não encontrado!' });
        return;
    }

    // Remove o quadro dos usuarios que estão com acesso
    for (var i = 0; i < quadro.acesso.length; i++) {
        var email = quadro.acesso[i];
        var usuario = await db.Usuario.findOne({ email: email });
        
        if (!usuario) {
            continue;
        }

        var quadroRetirar = usuario.quadros.indexOf(quadro._id);

        if (quadroRetirar > -1) {
            usuario.quadros.splice(quadroRetirar, 1);
        }
        else {
            continue;
        }

        await usuario.save();
    }
    

    await quadro.deleteOne();

    res.json({ message: 'Quadro removido com sucesso!' });
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