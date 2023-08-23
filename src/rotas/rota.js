const { Router } = require('express');
const { cadastrarUsuario } = require('../controladores/controlador_usuarios');

const rota = Router();

rota.post('/usuario', cadastrarUsuario);

module.exports = rota;