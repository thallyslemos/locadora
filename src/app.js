require('dotenv').config();
const express = require('express');
const app = express();
const clienteRoutes = require('./routes/clienteRoutes');
const veiculoRoutes = require('./routes/veiculoRoutes');
const aluguelRoutes = require('./routes/aluguelRoutes');
const userRoutes = require('./routes/userRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', clienteRoutes);
app.use('/api', veiculoRoutes);
app.use('/api', aluguelRoutes);
app.use('/api', userRoutes);
app.use('/api', categoriaRoutes);
app.use('/views', express.static('src/views'));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
});

module.exports = app;
