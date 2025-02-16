const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/categorias', categoriaController.getCategorias);
router.post('/categorias', categoriaController.createCategoria);

module.exports = router;