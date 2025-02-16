const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCategorias = async (req, res) => {
  const categorias = await prisma.categoria.findMany();
  console.log(categorias);
};

exports.createCategoria = async (req, res) => {
    const { nome, descricao, preco_diaria, exclusividade_funcionarios } = req.body;
    const categoria = await prisma.categoria.create({
        data: { nome, descricao, preco_diaria, exclusividade_funcionarios }
    });
    res.json(categoria);
};