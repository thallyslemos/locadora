const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');

router.get('/veiculos', veiculoController.getVeiculos);
router.post('/veiculos', veiculoController.createVeiculo);

// Adicione mais rotas conforme necessário (update, delete, etc.)

module.exports = router;
