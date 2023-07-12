var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
// const { Dropbox } = require('dropbox');
const Dropbox = require('dropbox-v2-api');

const config = require('../config/config.js');
const models = require('../model/models.js');

// var dbx = new Dropbox({ accessToken: config.dropbox.accessToken });
const dropbox = new Dropbox.authenticate({ token: config.dropbox.accessToken });
  
var upload = multer({ dest: 'uploads/' });


// endpoint para recuperar as listas paginadas 
router.get('/', async function(req, res) {
    var idQuadro = req.query.idQuadro;

    var db = await models.connect();

    var quadro = await db.Quadro.findById(idQuadro);

    var queryCount = db.Lista.find({ _id: { $in: quadro.listas } });
    var totalItems = await queryCount.count();

    var queryList = db.Lista
        .find({ _id: { $in: quadro.listas }});   
    
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

    if (!quadro) {
        res.status(404).json({ message: 'Quadro não encontrado!' });
        return;
    }

    var lista = new db.Lista({
        titulo: titulo,
        cards: []
    });

    try {
        quadro.listas.push(lista);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar lista!' +  error });
        return;
    }

    await quadro.save();

    await lista.save();

    return res.status(200).json({ message: 'Lista criada com sucesso com o id ' + lista._id + ' !' });
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
    console.log("🚀 ~ file: listas.js:96 ~ router.put ~ req.body:", req.body)
    var db = await models.connect();
    var lista = await db.Lista.findById(req.params.id);    
    var indexCardNovo = findCardIndexById(lista, req.body._id);
    var conteudoNovo = req.body.conteudo;
    console.log("🚀 ~ file: listas.js:103 ~ router.put ~ lista:", lista)
    console.log("🚀 ~ file: listas.js:111 ~ router.put ~ req.body:", req.body)

    if (!lista) {
        res.status(404).json({ message: 'Lista não encontrada!' });
        return;
    }
    
    if (indexCardNovo == -1) {
        lista.cards.push({
            conteudo: conteudoNovo,
            dtCriacao: req.body.dtCriacao === "" ? Date.now() : req.body.dtCriacao,
            dtUltimaEdicao: Date.now(),
            arquivoSalvo: req.body.arquivoSalvo || ''
        });
    }
    else if (req.body.arquivoSalvo !== ""){
        lista.cards[indexCardNovo].arquivoSalvo = req.body.arquivoSalvo         
    }
    else {
        lista.cards[indexCardNovo].conteudo = conteudoNovo !== "" ? conteudoNovo : lista.cards[indexCardNovo].conteudo;
        lista.cards[indexCardNovo].dtUltimaEdicao = Date.now();
    }

    lista.save();

    return res.status(200).json({ message: 'Lista atualizada com sucesso!' });
});

// endpoint para salvar um arquivo pdf de um card no dropbox
router.post('/:id/card/:idCard/pdf', upload.single('arquivo'), async function(req, res) {
    var db = await models.connect();
    var lista = await db.Lista.findById(req.params.id);
    var idCard = req.params.idCard;
    var indexCardNovo = findCardIndexById(lista, idCard);
    var arquivo = req.file;

    if (!lista) {
        res.status(404).json({ erro: 'Lista não encontrada!' });
        return;
    }

    var card = lista.cards.find(card => {
        return card._id == idCard;
    });

    if (!card) {
        res.status(404).json({ erro: 'Card não encontrado!' });
        return;
    }

    if (!arquivo) {
        res.status(404).json({ erro: 'Arquivo não encontrado!' });
        return;
    }

    if (arquivo.mimetype !== 'application/pdf') {
        res.status(404).json({ erro: 'Arquivo não é um PDF!' });
        return;
    }
    
    // Nome do arquivo no Dropbox
    const nomeArquivoDropbox = idCard + '_' + arquivo.originalname ;

    // Caminho do arquivo no Dropbox
    const caminhoArquivoDropbox = '/' + nomeArquivoDropbox;

    dropbox(
        {
          resource: 'files/upload',
          parameters: {
            path: caminhoArquivoDropbox
          },
          readStream: fs.createReadStream(arquivo.path)
        },
        (err, result) => {
          if (err) {
            return res.status(500).json({ erro: 'Erro ao enviar o arquivo para o Dropbox!' });
          }
          return res.status(200).json({ message: 'Arquivo enviado com sucesso!', caminhoArquivoDropbox: caminhoArquivoDropbox }) });
          
        }
      );

// endpoint para abrir um arquivo pdf de um card no dropbox
router.get('/:id/card/:idCard/pdf', async function(req, res) {
    var db = await models.connect();
    var lista = await db.Lista.findById(req.params.id);
    var idCard = req.params.idCard;
    var indexCardNovo = findCardIndexById(lista, idCard);
    
    if (!lista) {
        res.status(404).json({ erro: 'Lista não encontrada!' });
        return;
    }
    
    var card = lista.cards.find(card => {
        return card._id == idCard;
    });
    
    if (!card) {
        res.status(404).json({ erro: 'Card não encontrado!' });
        return;
    }
    
    var caminhoArquivoDropbox = lista.cards[indexCardNovo].arquivoSalvo;
    
    if (!caminhoArquivoDropbox) {
        res.status(404).json({ erro: 'Arquivo não encontrado!' });
        return;
    }

    dropbox({
        resource: 'sharing/create_shared_link_with_settings',
        parameters: {
          path: caminhoArquivoDropbox
        }
      },
      (err, result) => {
        if (err) {
          console.error('Erro ao obter o link compartilhado:', err);
          
          return res.status(404).json({ erro: 'Erro ao obter o link compartilhado!' });
        }
    
        const linkCompartilhado = result.url;
        console.log("🚀 ~ file: listas.js:236 ~ router.get ~ linkCompartilhado:", linkCompartilhado)
    
        return res.status(200).json({ linkCompartilhado: linkCompartilhado });
      }
    );

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

// função para enviar um arquivo para o dropbox
function uploadFileToDropbox(arquivo, caminhoArquivoDropbox) {
    dropbox(
        {
          resource: 'files/upload',
          parameters: {
            path: caminhoArquivoDropbox
          },
          readStream: fs.createReadStream(arquivo.path)
        },
        (err, result) => {
          if (err) {
            console.error('Erro ao enviar o arquivo para o Dropbox:', err);
            return null;
          }

          console.log("🚀 ~ file: listas.js:217 ~ uploadFileToDropbox ~ result", result)
          return result;
          
        }
      );
}

module.exports = router;