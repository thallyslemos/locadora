const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCategorias = async (req, res) => {
    const categorias = await prisma.categoria.findMany();
    res.json(categorias);
};

exports.createCategoria = async (req, res) => {
    const { nome, descricao, preco_diaria, exclusividade_funcionarios } = req.body;
    const categoria = await prisma.categoria.create({
        data: { nome, descricao, preco_diaria, exclusividade_funcionarios }
    });
    res.json(categoria);
};

exports.updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco_diaria, exclusividade_funcionarios } = req.body;
    const categoria = await prisma.categoria.update({
        where: { id: parseInt(id) },
        data: { nome, descricao, preco_diaria, exclusividade_funcionarios }
    });
    res.json(categoria);
};

exports.deleteCategoria = async (req, res) => {
    const { id } = req.params;
    await prisma.categoria.delete({
        where: { id: parseInt(id) }
    });
    res.status(204).end();
};