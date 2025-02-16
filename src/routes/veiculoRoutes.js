const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');

router.get('/veiculos', veiculoController.getVeiculos);
router.post('/veiculos', veiculoController.createVeiculo);
router.put('/veiculos/:id', veiculoController.updateVeiculo);
router.delete('/veiculos/:id', veiculoController.deleteVeiculo);

module.exports = router;
