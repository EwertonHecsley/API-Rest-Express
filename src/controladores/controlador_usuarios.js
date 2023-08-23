const bcrypt = require('bcrypt');
const pool = require('../conexao');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    try {
        const usuario = await pool.query(`
        INSERT INTO usuarios(nome,email,senha)
        VALUES($1,$2,$3) RETURNING id,nome,email
        `, [nome, email, senhaCriptografada])

        return res.status(201).json(usuario.rows);

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
};


module.exports = { cadastrarUsuario }