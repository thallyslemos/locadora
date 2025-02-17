const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUsuario = async (req, res) => {
  const { nome, identidade, CNH, endereco, idade, tipo, FuncionarioPublico } = req.body;
  try {
    const usuario = await prisma.usuario.create({
      data: {
        nome, 
        identidade, 
        CNH, 
        endereco, 
        idade, 
        tipo,
        ...(tipo === 'FUNCIONARIO' && FuncionarioPublico ? {
          FuncionarioPublico: {
            create: {
              orgao: FuncionarioPublico.orgao
            }
          }
        } : {})
      },
      include: {
        FuncionarioPublico: true
      }
    });
    res.status(201).json(usuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        FuncionarioPublico: true
      }
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

exports.getUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: {
        FuncionarioPublico: true
      }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, identidade, CNH, endereco, idade, tipo, FuncionarioPublico } = req.body;
  
  try {
    // Primeiro, verifica se existe um FuncionarioPublico relacionado
    const existingUser = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: { FuncionarioPublico: true }
    });

    // Prepara a atualização do usuário
    const updateData = {
      nome,
      identidade,
      CNH,
      endereco,
      idade,
      tipo
    };

    // Se o usuário está sendo alterado para funcionário público
    if (tipo === 'FUNCIONARIO' && FuncionarioPublico) {
      if (existingUser.FuncionarioPublico) {
        // Atualiza o registro existente de funcionário público
        updateData.FuncionarioPublico = {
          update: {
            orgao: FuncionarioPublico.orgao
          }
        };
      } else {
        // Cria um novo registro de funcionário público
        updateData.FuncionarioPublico = {
          create: {
            orgao: FuncionarioPublico.orgao
          }
        };
      }
    } else if (tipo !== 'FUNCIONARIO' && existingUser.FuncionarioPublico) {
      // Se o usuário deixou de ser funcionário público, remove o registro
      updateData.FuncionarioPublico = {
        delete: true
      };
    }

    // Atualiza o usuário
    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        FuncionarioPublico: true
      }
    });

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    // Primeiro deleta o FuncionarioPublico relacionado (se existir)
    await prisma.funcionarioPublico.deleteMany({
      where: { usuario_id: parseInt(id) }
    });
    
    // Depois deleta o usuário
    await prisma.usuario.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).end();
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};