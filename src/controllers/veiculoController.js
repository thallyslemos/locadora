const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getVeiculos = async (req, res) => {
  const veiculos = await prisma.automovel.findMany();
  console.log(veiculos);
  res.json(veiculos);
};

exports.createVeiculo = async (req, res) => {
  const { chassi, placa, marca, modelo, ano, cor, categoria_id } = req.body;
  const veiculo = await prisma.automovel.create({
    data: { chassi, placa, marca, modelo, ano, cor, categoria_id }
  });
  res.json(veiculo);
};