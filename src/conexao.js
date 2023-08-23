const { Pool } = require('pg');
require('dotenv').config()

const conexao = new Pool({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

module.exports = conexao
