const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getLocacoes = async (req, res) => {
    try {
        const locacoes = await prisma.locacao.findMany({
            include: {
                usuario: true,
                automovel: {
                    include: {
                        categoria: true
                    }
                }
            }
        });
        res.json(locacoes);
    } catch (error) {
        console.error('Erro ao buscar locações:', error);
        res.status(500).json({ error: 'Erro ao buscar locações' });
    }
};

exports.createLocacao = async (req, res) => {
    const { usuario_id, automovel_id, data_hora } = req.body;
    try {
        // Verificar se o usuário pode alugar este veículo
        const automovel = await prisma.automovel.findUnique({
            where: { id: automovel_id },
            include: { categoria: true }
        });

        const usuario = await prisma.usuario.findUnique({
            where: { id: usuario_id },
            include: { FuncionarioPublico: true }
        });

        if (automovel.categoria.exclusividade_funcionarios && usuario.tipo !== 'FUNCIONARIO') {
            return res.status(400).json({ 
                error: 'Este veículo só pode ser alugado por funcionários públicos' 
            });
        }

        const locacao = await prisma.locacao.create({
            data: {
                usuario_id: parseInt(usuario_id),
                automovel_id: parseInt(automovel_id),
                data_hora: new Date(data_hora)
            },
            include: {
                usuario: true,
                automovel: {
                    include: {
                        categoria: true
                    }
                }
            }
        });
        res.status(201).json(locacao);
    } catch (error) {
        console.error('Erro ao criar locação:', error);
        res.status(500).json({ error: 'Erro ao criar locação' });
    }
};

exports.deleteLocacao = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.locacao.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    } catch (error) {
        console.error('Erro ao deletar locação:', error);
        res.status(500).json({ error: 'Erro ao deletar locação' });
    }
};
