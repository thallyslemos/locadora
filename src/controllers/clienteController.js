const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getClientes = async (req, res) => {
  const clientes = await prisma.usuario.findMany();
  res.json(clientes);
};

exports.createCliente = async (req, res) => {
  const { nome, identidade, CNH, endereco, idade, tipo } = req.body;
  const cliente = await prisma.usuario.create({
    data: { nome, identidade, CNH, endereco, idade, tipo }
  });
  res.json(cliente);
};

// Adicione mais métodos conforme necessário (update, delete, etc.)
