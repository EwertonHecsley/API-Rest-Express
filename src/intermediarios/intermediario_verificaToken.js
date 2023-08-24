const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../conexao');

const verificaToken = async (req, res, next) => {
    const { authorization } = req.headers;

    const senha_key = process.env.senha_key;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado' })
    };

    try {
        const token = authorization.split(' ')[1];

        const { id } = jwt.verify(token, senha_key);

        const usuarioConsulta = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id]);

        if (usuarioConsulta.rows.length === 0) {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado' });
        };

        const { nome, email } = usuarioConsulta.rows[0];

        req.usuario = { id, nome, email };

        next();

    } catch (error) {
        if (error.message === 'invalid signature') {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado' });
        };

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensagem: 'Tempo excedido, faça login novamente' });
        };
    }
};

module.exports = {
    verificaToken
}