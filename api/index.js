var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({ origin: '*' }));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var usuarios = require('./controller/usuarios.js');
var quadros = require('./controller/quadros.js');
var listas = require('./controller/listas.js');
var cards = require('./controller/cards.js');

app.use('/usuarios', usuarios);
app.use('/quadros', quadros);
app.use('/listas', listas);
app.use('/cards', cards);

var porta = 3000;

app.listen(porta);
console.log('Servidor rodando em http://localhost:' + porta);