const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
  const { nome, identidade, CNH, endereco, idade, tipo } = req.body;
  try {
    const user = await prisma.usuario.create({
      data: { nome, identidade, CNH, endereco, idade, tipo },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.usuario.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};
