var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({ origin: '*' }));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var usuarios = require('./controller/usuarios.js');
app.use('/usuarios', usuarios);

console.log('Servidor rodando em http://localhost:3000');
app.listen(3000);