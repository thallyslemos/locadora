const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getVeiculos = async (req, res) => {
  const veiculos = await prisma.automovel.findMany();
  res.json(veiculos);
};

exports.createVeiculo = async (req, res) => {
  const { chassi, placa, marca, modelo, ano, cor, categoria_id } = req.body;
  const veiculo = await prisma.automovel.create({
    data: { chassi, placa, marca, modelo, ano, cor, categoria_id }
  });
  res.json(veiculo);
};

exports.updateVeiculo = async (req, res) => {
  const { id } = req.params;
  const { chassi, placa, marca, modelo, ano, cor, categoria_id } = req.body;
  const veiculo = await prisma.automovel.update({
    where: { id: parseInt(id) },
    data: { chassi, placa, marca, modelo, ano, cor, categoria_id }
  });
  res.json(veiculo);
};

exports.deleteVeiculo = async (req, res) => {
  const { id } = req.params;
  await prisma.automovel.delete({
    where: { id: parseInt(id) }
  });
  res.status(204).end();
};