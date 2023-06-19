const mongoose = require('mongoose');
const config = require('../config/config.js');

//
// Variavel global que mantém a conexao com o banco de dados
//
var connection = null;

//
// Variavel global que mantém o modelo dos usuarios
//
var Usuario = null;

//
// Variavel global que mantém o modelo dos quadros
//
var Quadro = null;
//
// Variavel global que mantém o modelo das listas
//
var Lista = null;
//
// Variavel global que mantém o modelo dos cards
//
var Card = null;

//
// Conecta com o banco de dados e carrega os modelos
//
async function connect() {
    if(!connection){
        await mongoose.connect(config.database.connectionString);
        connection = mongoose.connection;
        connection.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));

        var usuarioSchema = {
            nome: String,
            email: String,
            senha: String,
            dataCriacao: Date,
            dataAtualizacao: Date,
            tokenSenha: String,
            dataTokenSenha: Date,
            falhasLogin: { type: Number, default: 0 },
            quadros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quadro' }]
        }

        var quadroSchema = {
            titulo: String,
            corFundo: String,
            corTexto: String,
            editavel: Boolean,
            favorito: Boolean,
            listas: [{ 
                titulo: String, 
                cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }]
            }]
        }

        var cardSchema = {
            conteudo: String,
            dtCriacao: Date,
            dtUltimaEdicao: Date
        }

        Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');
        Quadro = mongoose.model('Quadro', quadroSchema, 'quadros');
        Card = mongoose.model('Card', cardSchema, 'cards');
    }

    return { connection, Usuario, Quadro, Card }    
}

module.exports = { connect }
