const express = require('express');
const router = express.Router();
const concertoController = require('../controllers/concertoController');

router.get('/api/concertos', concertoController.getConcertos);
router.post('/api/concertos', concertoController.createConcerto);
router.put('/api/concertos/:id', concertoController.updateConcerto);
router.delete('/api/concertos/:id', concertoController.deleteConcerto);

module.exports = router;
