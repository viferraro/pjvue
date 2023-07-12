const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    database: {
        connectionString: process.env.CONNECTION_STRING_ATLAS
    },
    
    auth: {
        tokenKey: process.env.TOKEN_KEY
    },

    frontend: {
        hostname: 'http://localhost:8080/'
    },

    sendGrid: {
        apiKey: process.env.SENDGRID_API_KEY_ERIC,
        email: process.env.SENDGRID_USER_ERIC,
        fromEmail: process.env.SENDGRID_FROM_EMAIL
    },

    dropbox: {
        accessToken: process.env.DROPBOX_API_KEY
    }
}