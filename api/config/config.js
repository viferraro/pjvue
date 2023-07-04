const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    database: {
        connectionString: process.env.CONNECTION_STRING_ATLAS
    },
    
    auth: {
        tokenKey: 'VR5iUVl4mj-tE!Pw2*Pw'
    },

    frontend: {
        hostname: 'http://localhost:8080/'
    },

    sendGrid: {
        apiKey: '',
        email: 'dswequipetaskverse@gmail.com'
    }

}