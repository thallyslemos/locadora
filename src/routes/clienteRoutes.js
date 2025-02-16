const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/clientes', clienteController.getClientes);
router.post('/clientes', clienteController.createCliente);

// Adicione mais rotas conforme necessário (update, delete, etc.)

module.exports = router;
