const e = require('express');
const pool = require('../conexao');

const verificaUsuario = async (req, res, next) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos' })
    };

    try {
        const consultaBD = await pool.query(`SELECT * FROM usuarios`);

        if (consultaBD.rows.some((elemento) => elemento.email === email)) {
            return res.status(400).json({ mensagem: 'Email já cadastrado para outro usuario' })
        };

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

    next()
};

module.exports = { verificaUsuario }