require('dotenv').config();
const express = require('express');
const app = express();
const veiculoRoutes = require('./routes/veiculoRoutes');
const aluguelRoutes = require('./routes/aluguelRoutes');
const userRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const concertosRoutes = require('./routes/concertoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', veiculoRoutes);
app.use('/api', aluguelRoutes);
app.use('/api', userRoutes);
app.use('/api', categoriaRoutes);
app.use('/api', concertosRoutes);
app.use('/api', relatorioRoutes);
app.use('/views', express.static('src/views'));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
});

module.exports = app;
