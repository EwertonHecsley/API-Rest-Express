const bcrypt = require('bcrypt');
const pool = require('../conexao');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

const listarUsuarios = async (_req, res) => {
    try {
        const consultaBD = await pool.query(`SELECT id,nome,email FROM usuarios`);
        return res.status(200).json(consultaBD.rows)
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
};

const login = (req, res) => {
    const { id, nome } = req.usuarioRetorno;

    const senha_key = process.env.senha_key;

    const token = jwt.sign({ id }, senha_key, { expiresIn: '10 m' });

    const resposta = {
        mensagem: 'Usuario logado com sucesso',
        usuario: {
            id,
            nome
        },
        token
    };

    return res.status(200).json(resposta);
};

const detalharUsuario = (req, res) => {
    return res.status(200).json(req.usuario);
};

module.exports = { cadastrarUsuario, listarUsuarios, login, detalharUsuario }