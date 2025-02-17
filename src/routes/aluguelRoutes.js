const express = require('express');
const router = express.Router();
const aluguelController = require('../controllers/aluguelController');

router.get('/alugueis', aluguelController.getAlugueis);
router.post('/alugueis', aluguelController.createAluguel);

module.exports = router;
