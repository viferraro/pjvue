const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    database: {
        connectionString: 'mongodb://127.0.0.1/pjvue'
    },
    
    auth: {
        tokenKey: 'VR5iUVl4mj-tE!Pw2*Pw'
    },

    frontend: {
        hostname: 'http://localhost:8080/'
    },

    sendGrid: {
        apiKey: '',
        email: 'ericleal26@yahoo.com.br'
    }

}