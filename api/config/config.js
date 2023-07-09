const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    database: {
        connectionString: 'mongodb://localhost:27017/pjvue'
    },
    
    auth: {
        tokenKey: process.env.TOKEN_KEY
    },

    frontend: {
        hostname: 'http://localhost:8080/'
    },

    sendGrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        email: process.env.SENDGRID_USER,
        fromEmail: process.env.SENDGRID_FROM_EMAIL
    }
}