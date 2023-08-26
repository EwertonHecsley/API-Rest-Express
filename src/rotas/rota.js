const { Router } = require('express');
const { cadastrarUsuario, listarUsuarios, login, detalharUsuario, atualizarUsuario, consultarEmprsa, deletarEmpresa } = require('../controladores/controlador_usuarios');
const { verificaUsuario, intermediarioLogin, intermediarioDetalharUsuario, intermediarioAtualizarUsuario, intermediarioConsultaEmpresa, intermediarioDeletarEmpresa } = require('../intermediarios/intermediario_usuarios');
const { verificaToken } = require('../intermediarios/intermediario_verificaToken');

const rota = Router();

rota.post('/login', intermediarioLogin, login)//Login de Usuário

rota.post('/usuario', verificaUsuario, cadastrarUsuario);//Cadastrar novo Usuário

rota.use(verificaToken)

rota.get('/usuario', listarUsuarios)//Listar todos os Usuários
rota.get('/usuario/:id', intermediarioDetalharUsuario, detalharUsuario)//Detalhar usuario por ID

rota.put('/usuario/:id', intermediarioAtualizarUsuario, atualizarUsuario);//Atualizar usuário logado

rota.get('/consultar', intermediarioConsultaEmpresa, consultarEmprsa);//Consultar dados empresas

rota.delete('/empresa/:id', intermediarioDeletarEmpresa, deletarEmpresa);//Deletar empresa associada ao usuario logado

module.exports = rota;