const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getConcertos = async (req, res) => {
    try {
        const concertos = await prisma.concerto.findMany({
            include: {
                automovel: true
            }
        });
        res.json(concertos);
    } catch (error) {
        console.error('Erro ao buscar concertos:', error);
        res.status(500).json({ error: 'Erro ao buscar concertos' });
    }
};

exports.createConcerto = async (req, res) => {
    const { automovel_id, data, descricao, valor, oficina } = req.body;
    try {
        const concerto = await prisma.concerto.create({
            data: {
                automovel_id: parseInt(automovel_id),
                data: new Date(data),
                descricao,
                valor: parseFloat(valor),
                oficina
            },
            include: {
                automovel: true
            }
        });
        res.status(201).json(concerto);
    } catch (error) {
        console.error('Erro ao criar concerto:', error);
        res.status(500).json({ error: 'Erro ao criar concerto' });
    }
};

exports.updateConcerto = async (req, res) => {
    const { id } = req.params;
    const { automovel_id, data, descricao, valor, oficina } = req.body;
    try {
        const concerto = await prisma.concerto.update({
            where: { id: parseInt(id) },
            data: {
                automovel_id: parseInt(automovel_id),
                data: new Date(data),
                descricao,
                valor: parseFloat(valor),
                oficina
            },
            include: {
                automovel: true
            }
        });
        res.json(concerto);
    } catch (error) {
        console.error('Erro ao atualizar concerto:', error);
        res.status(500).json({ error: 'Erro ao atualizar concerto' });
    }
};

exports.deleteConcerto = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.concerto.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    } catch (error) {
        console.error('Erro ao deletar concerto:', error);
        res.status(500).json({ error: 'Erro ao deletar concerto' });
    }
};
