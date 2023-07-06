const mongoose = require('mongoose');
const config = require('../config/config.js');
require('dotenv').config();

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
// Variavel global que mantém o modelo dos cards
//
var Lista = null;

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
            token: String,
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
            listas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lista' }]
        }

        var listaSchema = {
            titulo: String,
            cards: [{ 
                conteudo: String,
                dtCriacao: Date,
                dtUltimaEdicao: Date,
            }]
        }

        Usuario = mongoose.model('usuarios', usuarioSchema);
        Quadro = mongoose.model('Quadro', quadroSchema, 'quadros');
        Lista = mongoose.model('Lista', listaSchema, 'listas');
    }

    return { connection, Usuario, Quadro, Lista }    
}

module.exports = { connect }
