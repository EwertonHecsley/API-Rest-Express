const { Router } = require('express');
const { cadastrarUsuario } = require('../controladores/controlador_usuarios');
const { verificaUsuario } = require('../controladores/intermediario_usuarios');

const rota = Router();

rota.post('/usuario', verificaUsuario, cadastrarUsuario);

module.exports = rota;