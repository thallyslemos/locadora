const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getLocacoesPorPeriodo = async (req, res) => {
    const { inicio, fim } = req.query;
    try {
        const locacoes = await prisma.locacao.findMany({
            where: {
                data_hora: {
                    gte: new Date(inicio),
                    lte: new Date(fim)
                }
            },
            include: {
                usuario: {
                    include: {
                        FuncionarioPublico: true
                    }
                },
                automovel: {
                    include: {
                        categoria: true
                    }
                }
            },
            orderBy: {
                data_hora: 'desc'
            }
        });
        res.json(locacoes);
    } catch (error) {
        console.error('Erro ao buscar locações:', error);
        res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
};

exports.getConcertosPorVeiculo = async (req, res) => {
    const { id } = req.params;
    try {
        const concertos = await prisma.concerto.findMany({
            where: {
                automovel_id: parseInt(id)
            },
            include: {
                automovel: {
                    include: {
                        categoria: true
                    }
                }
            },
            orderBy: {
                data: 'desc'
            }
        });
        res.json(concertos);
    } catch (error) {
        console.error('Erro ao buscar concertos:', error);
        res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
};

exports.getVeiculosPorCategoria = async (req, res) => {
    const { categoria } = req.query;
    try {
        const veiculos = await prisma.automovel.findMany({
            where: categoria ? {
                categoria_id: parseInt(categoria)
            } : undefined,
            include: {
                categoria: true,
                Concertos: {
                    orderBy: {
                        data: 'desc'
                    }
                }
            },
            orderBy: {
                marca: 'asc'
            }
        });
        res.json(veiculos);
    } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
};
