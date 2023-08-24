const { Router } = require('express');
const { cadastrarUsuario, listarUsuarios, login, detalharUsuario } = require('../controladores/controlador_usuarios');
const { verificaUsuario, intermediarioLogin, intermediarioDetalharUsuario } = require('../intermediarios/intermediario_usuarios');
const { verificaToken } = require('../intermediarios/intermediario_verificaToken');

const rota = Router();

rota.post('/login', intermediarioLogin, login)//Login de Usuário

rota.post('/usuario', verificaUsuario, cadastrarUsuario);//Cadastrar novo Usuário

rota.use(verificaToken)

rota.get('/usuario', listarUsuarios)//Listar todos os Usuários
rota.get('/usuario/:id', intermediarioDetalharUsuario, detalharUsuario)//Detalhar usuario por ID

module.exports = rota;