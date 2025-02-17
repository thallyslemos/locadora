const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();

exports.createUsuario = async (req, res) => {
  const { nome, identidade, CNH, endereco, idade, tipo } = req.body;
  try {
    const usuario = await prisma.usuario.create({
      data: { nome, identidade, CNH, endereco, idade, tipo },
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, identidade, CNH, endereco, idade, tipo } = req.body;
  try {
    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { nome, identidade, CNH, endereco, idade, tipo },
    });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};