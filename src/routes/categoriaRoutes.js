const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/categorias', categoriaController.getCategorias);
router.post('/categorias', categoriaController.createCategoria);
router.put('/categorias/:id', categoriaController.updateCategoria);
router.delete('/categorias/:id', categoriaController.deleteCategoria);

module.exports = router;