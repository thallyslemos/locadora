const express = require('express');
const router = express.Router();
const aluguelController = require('../controllers/aluguelController');

router.get('/alugueis', aluguelController.getAlugueis);
router.post('/alugueis', aluguelController.createAluguel);

// Adicione mais rotas conforme necessário (update, delete, etc.)

module.exports = router;
