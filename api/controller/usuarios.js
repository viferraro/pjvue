var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sg = require('@sendgrid/mail');
const crypto = require('crypto')

const mongoose = require('mongoose');
const config = require('../config/config.js');
const models = require('../model/models.js');
const auth = require("../auth/auth.js");

// endpoint para retornar uma lista de usuários paginada	
router.get('/', async function (req, res) {

    var db = await models.connect();
    var queryCount = db.Usuario.find({});
    var totalItems = await queryCount.count();

    var queryList = db.Usuario.find({});
    var items = await queryList.exec();

    res.json({ items, totalItems });
});

// endpoint para retornar um usuário específico
router.get('/:email', async function (req, res) {
    var db = await models.connect();
    var usuario = await db.Usuario.find({ email: req.params.email });
    res.json(usuario);
});


// endpoint para criar um novo usuário
router.post('/', async function (req, res) {
    var db = await models.connect();
    var nome = req.body.nome;
    var email = req.body.email;
    var senha = req.body.senha;
    var senhaConfirmacao = req.body.senhaConfirmacao;

    var usuarioEmail = await db.Usuario.findOne({ email: email }).exec();

    if (usuarioEmail) {
        res.status(400).json({ message: "Usuário já cadastrado." });
        return;
    }

    if (nome.length == 0) {
        res.status(400).json({ message: "O nome do usuário não pode ser vazio." });
        return;
    }

    if (!validaEmail(email)) {
        res.status(400).json({ message: "O e-mail do usuário não está em um formato adequado." });
        return;
    }

    if (!validaSenha(senha)) {
        res.status(400).json({ message: "A senha do usuário não é válida." });
        return;
    }

    if (senha != senhaConfirmacao) {
        res.status(400).json({ message: "A confirmação de senha está diferente da senha." });
        return;
    }

    var senhaHash = await bcrypt.hash(senha, 10);

    var usuario = await db.Usuario.create({
        dataRegistro: new Date(),
        dataAtualizacao: new Date(),
        nome,
        email,
        senha: senhaHash
    });

    await usuario.save();
    res.json({ message: "O novo usuário foi criado." })

});

// endpoint para atualizar um usuário
router.put('/:email', async function (req, res) {
    var db = await models.connect();
    var email = req.params.email;
    var nome = req.body.nome;
    var senhaAtual = req.body.senhaAtual;
    var senhaNova = req.body.senhaNova;
    var senhaConfirmacao = req.body.senhaConfirmacao;

    if (!nome || !email || !senhaAtual || !senhaNova || !senhaConfirmacao) {
        res.status(400).json({ erro: 'Dados incompletos' });
        return;
    }

    if (senhaNova != senhaConfirmacao) {
        res.status(400).json({ erro: 'Dados não conferem' });
        return;
    }

    var usuario = await db.Usuario.findOne({ email: email }).exec();

    if (!usuario) {
        res.status(400).json({ erro: 'Usuário não encontrado' });
        return;
    }

    if (!validaSenha(senhaNova)) {
        res.status(400).json({ erro: 'Senha deve ter no mínimo 8 caracteres (número e letras maiúsculas e minúsculas)' });
        return;
    }

    usuario.nome = nome !== "" ? nome : usuario.nome;
    usuario.senha = senhaNova !== "" ? bcrypt.hashSync(senhaNova, 10) : usuario.senha;
    usuario.dataAtualizacao = new Date();

    await usuario.save();
    return res.json({ message: 'Usuário atualizado com sucesso' });
});

// endpoint para adicionar um quadro compartilhado à lista de quadros
router.put('/quadros/:email', async function (req, res) {
    var db = await models.connect();
    var email = req.params.email;
    var quadro = req.body.quadro;

    if (!quadro) {
        res.status(400).json({ erro: 'Dados incompletos' });
        return;
    }

    usuario = await db.Usuario.findOne({ email: email }).exec();

    if (!usuario) {
        res.status(404).json({ erro: 'Usuário não encontrado' });
        return;
    }

    if (usuario.quadros.some(q => q._id == quadro._id)) {
        res.status(400).json({ erro: 'Quadro já adicionado' });
        return;
    }

    usuario.quadros.push(quadro);

    await usuario.save();
    return res.status(200).json({ message: 'Quadro adicionado com sucesso' });
});


// endpoint para remover um usuário
router.delete('/:email', async function (req, res) {
    var db = await models.connect();
    var email = req.params.email;

    var usuario = await db.Usuario.findOne({ email: email }).exec();

    if (!usuario) {
        res.status(400).json({ erro: 'Usuário não encontrado' });
        return;
    }

    await usuario.deleteOne();
    return res.json({ message: 'Usuário removido com sucesso' });
});


// endpoint para logar um usuário
router.post('/login', async function (req, res) {

    var email = req.body.email;
    var senha = req.body.senha;

    if (!email || !senha) {
        res.status(400).json({ erro: 'Dados incompletos' });
        return;
    }

    var db = await models.connect();
    var usuarioEmail = await db.Usuario.findOne({ email: email }).exec();

    if (!usuarioEmail) {
        res.status(400).json({ erro: 'Dados inválidos' });
        return;
    }

    if (usuarioEmail.falhasLogin >= 3) {
        res.status(400).json({ erro: 'Usuário bloqueado' });
        return;
    }

    var senhaValida = await bcrypt.compareSync(senha, usuarioEmail.senha);

    if (!senhaValida) {
        usuarioEmail.falhasLogin++;
        await usuarioEmail.save();
        res.status(400).json({ erro: 'Dados inválidos' });
        return;
    }

    if (usuarioEmail.falhasLogin != 0) {
        usuarioEmail.falhasLogin = 0;
        await usuarioEmail.save();
    }

    var token = jwt.sign({ id: usuarioEmail._id, email }, config.auth.tokenKey, { expiresIn: '2h' });

    var usuario = {
        nome: usuarioEmail.nome,
        email: usuarioEmail.email,
        token: token
    };

    res.json({ message: 'Usuário logado com sucesso', usuario });

});


// endpoint para enviar token por esquecimento de senha
router.post('/esqueci', async function (req, res) {
    var email = req.body.email;
    sg.setApiKey(config.sendGrid.apiKey);

    if (!email) {
        res.status(400).json({ erro: 'Dados incompletos' });
        return;
    }

    if (!validaEmail(email)) {
        res.status(400).json({ erro: 'Dados inválidos' });
        return;
    }

    var db = await models.connect();
    var usuario = await db.Usuario.findOne({ email: email }).exec();

    if (!usuario) {
        res.status(400).json({ erro: 'Usuário não encontrado' });
        return;
    }

    usuario.dataAtualizacao = new Date();
    usuario.token = geraToken(32);
    usuario.dataTokenSenha = new Date();
    await usuario.save();

    let transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: config.sendGrid.email,
            pass: config.sendGrid.apiKey
        }
    })

    var link = config.frontend.hostname + "login/reset?token=" + usuario.token + "&email=" + usuario.email;
    // var contents = "Se você solicitou uma recuperação de senha, clique <a href='" + link + "'>aqui</a>.<br>";
    // contents += "Se não tiver pedido a recuperação de senha, relaxa. Só tentaram te dar um golpe!";
    // contents += "<br><br>Atenciosamente,<br>Equipe TaskVerse</br><br";

    var email = {
        from: {
            name: "Equipe TaskVerse",
            email: config.sendGrid.fromEmail
        },
        to: usuario.email,
        subject: "Recuperação de senha",
        templateId: "d-a8bcdf6a9dbc442da41907b53b5b7216",
        dynamicTemplateData: {
            button_link: link
        }
        // html: contents
    };

    sg.send(email, function (err, json) {
        if (err) {
            res.json(err);
        } else {
            res.json({ message: "OK" });
        }
    }
    );
});

// endpoint para recuperação de senha
router.post('/reset', async function (req, res) {
    var email = req.body.email;
    var token = req.body.token;
    var senha = req.body.senha;
    var senhaConfirmacao = req.body.senhaConfirmacao;

    if (!email || !token || !senha || !senhaConfirmacao) {
        res.status(400).json({ erro: 'Dados incompletos' });
        return;
    }

    if (senha != senhaConfirmacao) {
        res.status(400).json({ erro: 'Dados não conferem' });
        return;
    }

    if (!validaSenha(senha)) {
        res.status(400).json({ erro: 'Dados inválidos' });
        return;
    }

    if (!validaEmail(email)) {
        res.status(400).json({ erro: 'Dados inválidos' });
        return;
    }

    if (token.length != 32) {
        res.status(400).json({ erro: 'Token inválido' });
        return;
    }

    var db = await models.connect();
    var usuario = await db.Usuario.findOne({ email: email }).exec();

    if (!usuario) {
        res.status(400).json({ erro: 'Usuário não encontrado' });
        return;
    }

    if (!verificaValidadeTokenLogin(usuario.dataTokenSenha, 72)) {
        res.status(400).json({ erro: 'Token inválido' });
        return;
    }

    var senhaHash = await bcrypt.hashSync(senha, 10);
    usuario.senha = senhaHash;
    usuario.dataAtualizacao = new Date();
    await usuario.save();

    res.json({ message: 'Nova senha registrada' });

})


// endpoint para troca de senha
router.post('/troca', async function (req, res) {

    var claims = auth.verifyToken(req, res);

    if (!claims) {
        res.status(401).json({ message: "Usuário não encontrado" });
        return;
    }

    var idUsuario = claims.user_id;
    var senhaAtual = req.body.senhaAtual;
    var senhaNova = req.body.senhaNova;
    var senhaNovaConfirmacao = req.body.senhaNovaConfirmacao;

    var db = await models.connect();
    var usuario = await db.Usuario.findOnde({ id: idUsuario }).exec();

    if (!usuario) {
        res.status(401).json({ message: "Usuário não encontrado" });
        return;
    }

    var senhaValida = await bcrypt.compareSync(senhaAtual, usuario.senha);

    if (!senhaValida) {
        res.status(401).json({ message: "Dados inválidos" });
        return;
    }

    if (senhaNova != senhaNovaConfirmacao) {
        res.status(400).json({ erro: 'Dados não conferem' });
        return;
    }

    if (!validaSenha(senhaNova)) {
        res.status(400).json({ erro: 'Dados inválidos' });
        return;
    }

    var senhaHash = await bcrypt.hashSync(senhaNova, 10);
    usuario.senha = senhaHash;
    usuario.dataAtualizacao = new Date();
    await usuario.save();

    res.json({ message: 'Nova senha registrada' });
});

// endpoint para compartilhar um determinado quadro com uma lista de usuários
router.post('/compartilhar/:idQuadro', async function (req, res) {

    var claims = auth.verifyToken(req, res);

    if (!claims) {
        res.status(404).json({ erro: "Usuário não encontrado" });
        return;
    }

    var idQuadro = req.params.idQuadro;
    console.log("🚀 ~ file: usuarios.js:402 ~ idQuadro:", idQuadro)
    var emails = req.body.emails;
    console.log("🚀 ~ file: usuarios.js:404 ~ emails:", emails)

    if (!idQuadro) {
        res.status(400).json({ erro: 'Dados incompletos' });
        return;
    }

    if (!emails || emails.length == 0) {
        res.status(400).json({ erro: 'Dados incompletos' });
        return;
    }

    var db = await models.connect();
    var quadro = await db.Quadro.findOne({ _id: idQuadro }).exec();
    var usuario = await db.Usuario.findOne({ email: claims.email }).exec();
    var destinatarios = await getDestinatarios(emails);

    if (!quadro) {
        res.status(400).json({ erro: 'Quadro não encontrado' });
        return;
    }

    console.log("🚀 ~ file: usuarios.js:431 ~ quadro:", quadro)


    emails.forEach(email => {
        quadro.acesso.push(email);
    });

    console.log("🚀 ~ file: usuarios.js:431 ~ quadro:", quadro)

    await quadro.save();
    console.log("🚀 ~ file: usuarios.js:431 ~ quadro:", quadro)

    sg.setApiKey(config.sendGrid.apiKey);

    // Adicionando o link epsecífico do quadro para cada destinatário
    destinatarios.forEach(destinatario => {
        var email = destinatario.email;
        destinatario.link = config.frontend.hostname + "quadros/compartilhar?email=" + email + "&idQuadro=" + idQuadro;
    });

    // Enviar os e-mails em lote
    Promise.all(
        destinatarios.map(destinatario => {
            const { email, link } = destinatario;

            const msg = {
                from: {
                    name: "Equipe TaskVerse",
                    email: config.sendGrid.fromEmail
                },
                to: email,
                subject: "Compartilhamento de quadro",
                templateId: "d-a03af7299e224fea9334ae6f401a811e",
                dynamicTemplateData: {
                    buttonCpt: link,
                    destinatario: destinatario.nome,
                    remetente: usuario.nome,
                }
            };

            return sg.send(msg);
        })
    )
    .then(() => {
        res.status(200).json({ erro: 'E-mails enviados com sucesso' });
    })
    .catch(error => {
        res.status(500).json({ erro: 'Erro ao enviar e-mails ' + error });
    });
});




//
// Funções auxiliares
//

// função para verificar se o email é válido
function validaEmail(email) {
    if (!email) return false;

    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// função para verificar se a senha é válida
function validaSenha(senha) {
    if (!senha) return false;

    if (senha.length < 8) return false;

    return /.*[a-zA-Z].*$/.test(senha) && /.*[0-9].*$/.test(senha);
}

// função para gerar um token aleatório
function geraToken(size) {
    return crypto.randomBytes(size).toString('base64').slice(0, size);
}

//
// Verifica se um token de recuperacao de senha e valido
//
function verificaValidadeTokenLogin(dateToken, maximoHoras) {
    var dateNow = new Date();
    var hours = Math.abs(dateNow - dateToken) / (60.0 * 60.0 * 1000.0);
    return hours < maximoHoras;
}


//
// Função para retornar os dados dos destinatários
//
async function getDestinatarios(emails) {
    var db = await models.connect();
    var usuarios = await db.Usuario.find({ email: { $in: emails } }).exec();

    return usuarios;
}

module.exports = router;