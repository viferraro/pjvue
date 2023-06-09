const mongoose = require('mongoose');

function connection() {
    require('dotenv').config()
    let senha = process.env.NODE_PASSWORD
    
    const url = `mongodb+srv://Eric:${senha}@cluster0.qxwlshw.mongodb.net/`

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

    const db = mongoose.connection;

    db.on('error', () => {
        console.log('Erro ao conectar no banco de dados')
    });

    db.on('open', () => {
        console.log('Conexão realizada com sucesso')
    });
}

connection();
