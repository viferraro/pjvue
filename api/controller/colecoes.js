var express = require('express');
var router = express.Router();

const config = require('../config/config.js');
const models = require('../model/models.js');
const auth = require('../auth/auth.js');

// endpoint para recuperar as colecoes paginadas
router.get('/', async function (req, res) {

    var claims = getClaims(req, res);
    console.log("🚀 ~ file: colecoes.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var db = await models.connect();

    var usuario = await db.Usuario.findOne({ email: claims.email });

    var queryList = db.Colecao
        .find({ _id: { $in: usuario.colecoes } })

    var colecoes = await queryList.exec();
    res.json({ colecoes });
});


// endpoint para recuperar uma colecao
router.get('/:id', async function (req, res) {

    var claims = getClaims(req, res);
    console.log("🚀 ~ file: quadros.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }  

    var db = await models.connect();
    var colecao = await db.Colecao.findById(req.params.id);
    res.json(colecao);
});

// endpoint para criar uma colecao
router.post('/', async function (req, res) {

    var claims = getClaims(req, res);
    console.log("🚀 ~ file: colecoes.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    if (!req.body.titulo) {
        return res.status(400).json({ message: 'O título da coleção é obrigatório!' });
    }

    var db = await models.connect();
    var titulo = req.body.titulo !== undefined ? req.body.titulo : 'Coleção sem título';
    var corFundo = req.body.corFundo || "#4071ad";
    var corTexto = req.body.corTexto || "#000000";

    var colecao = new db.Colecao({
        nome: titulo,
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
router.put('/:id', async function (req, res) {

    var claims = getClaims(req, res);
    console.log("🚀 ~ file: quadros.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
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

// endpoint para inserir quadros na coleção
router.put('/:id/quadros', async function (req, res) {
    var claims = getClaims(req, res);
    console.log("🚀 ~ file: quadros.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
        return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    var db = await models.connect();
    var colecao = await db.Colecao.findById(req.params.id);
    
    if (!colecao) {
        res.json({ message: 'Colecao não encontrada!' });
        return;
    }

    var quadros = req.body.quadros;
    try {
        quadros.forEach((quadro) => {
            
            if (!colecao.quadros.includes(quadro)) {
                colecao.quadros.push(quadro);                
            }
        });
    } catch (err) {
        res.status(400).json({ message: 'Não foi possível adicionar os quadros!' });
        return;
    }

    await colecao.save();

    res.status(200).json({ message: 'Quadros adicionados com sucesso!' });
});




// endpoint para deletar uma colecao
router.delete('/:id', async function (req, res) {

    var claims = getClaims(req, res);
    console.log("🚀 ~ file: quadros.js:12 ~ router.get ~ claims:", claims)

    if (claims === null) {
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