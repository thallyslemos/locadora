const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');

router.get('/relatorios/locacoes', relatorioController.getLocacoesPorPeriodo);
router.get('/relatorios/concertos/:id', relatorioController.getConcertosPorVeiculo);
router.get('/relatorios/veiculos', relatorioController.getVeiculosPorCategoria);

module.exports = router;
