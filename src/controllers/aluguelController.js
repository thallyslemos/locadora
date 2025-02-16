const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAlugueis = async (req, res) => {
  const alugueis = await prisma.locacao.findMany();
  res.json(alugueis);
};

exports.createAluguel = async (req, res) => {
  const { usuario_id, automovel_id, data_hora } = req.body;
  const aluguel = await prisma.locacao.create({
    data: { usuario_id, automovel_id, data_hora }
  });
  res.json(aluguel);
};