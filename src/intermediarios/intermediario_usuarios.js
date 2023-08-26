const pool = require('../conexao');
const bcrypt = require('bcrypt');
const axios = require('axios');

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

const intermediarioAtualizarUsuario = async (req, res, next) => {
    const { nome, email, senha } = req.body;
    const { id } = req.params;
    const emailbd = req.usuario.email

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos devem serm preenchidos' });
    };

    try {
        const consultaBD = await pool.query(`SELECT * FROM usuarios WHERE id = $1 AND email = $2`, [id, emailbd]);

        if (consultaBD.rows.length === 0) {
            return res.status(401).json({ mensagem: 'Identificador de usuario inválido' })
        };

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    };
};

const intermediarioConsultaEmpresa = async (req, res, next) => {
    const { dominio } = req.query

    if (!dominio) {
        return res.status(400).json({ mensagem: 'Dominio inválido ou ausente' })
    };

    const senha_api = process.env.senha_api

    const url = `https://companyenrichment.abstractapi.com/v1/?api_key=${senha_api}&domain=${dominio}`;

    try {
        const resposta = await axios.get(url);

        const { data } = resposta;

        const { name } = data;

        if (name === null) {
            return res.status(404).json({ mensagem: 'Empresa não encontrada' })
        };

        req.consulta = data;

        next()

    } catch (error) {
        return res.status(500).json({ mensgem: error.message });
    };
};

const intermediarioDeletarEmpresa = async (req, res, next) => {
    const usuario_id = req.usuario.id;
    const { id } = req.params;

    try {
        const usuarioBd = await pool.query(`SELECT * FROM empresas WHERE usuario_id = $1`, [usuario_id]);

        if (usuarioBd.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Usuario não tem empresa cadastrada com esse ID' })
        };

        if (!usuarioBd.rows.some((empresa) => empresa.id === Number(id))) {
            return res.status(404).json({ mensagem: 'Usuario não tem empresa cadastrada com esse ID' })
        };

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    };
};

module.exports = { verificaUsuario, intermediarioLogin, intermediarioDetalharUsuario, intermediarioAtualizarUsuario, intermediarioConsultaEmpresa, intermediarioDeletarEmpresa }