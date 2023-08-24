const pool = require('../conexao');
const bcrypt = require('bcrypt');

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

const intermediarioLogin = async (req, res, next) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos' })
    };

    try {
        const consultaBD = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);

        if (consultaBD.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Email ou senha inválida' })
        };

        const senhaBd = consultaBD.rows[0].senha;

        const verificaSenha = await bcrypt.compare(senha, senhaBd);

        if (!verificaSenha) {
            return res.status(404).json({ mensagem: 'Email ou senha inválida' })
        };

        req.usuarioRetorno = consultaBD.rows[0];

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: error.messge })
    }
};

const intermediarioDetalharUsuario = async (req, res, next) => {
    const { id } = req.params;
    const id_usuario = req.usuario.id;

    try {
        const consultaBD = await pool.query(`SELECT * FROM usuarios WHERE id = $1`, [id_usuario]);
        console.log(consultaBD.rows[0].id)
        if (consultaBD.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não localizado' });
        };

        if (consultaBD.rows[0].id !== Number(id)) {
            return res.status(401).json({ mensagem: 'Usuário não autorizado' });
        };

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    };
};

module.exports = { verificaUsuario, intermediarioLogin, intermediarioDetalharUsuario }