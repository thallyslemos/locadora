const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function main() {
  //limpa o banco de dados
  await prisma.locacao.deleteMany()
  await prisma.concerto.deleteMany()
  await prisma.automovel.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.funcionarioPublico.deleteMany()
  await prisma.usuario.deleteMany()

  // Cria categorias
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: {
        nome: 'Econômico',
        preco_diaria: 100.00,
        descricao: 'Carros compactos e econômicos',
        exclusividade_funcionarios: false
      }
    }),
    prisma.categoria.create({
      data: {
        nome: 'Executivo',
        preco_diaria: 250.00,
        descricao: 'Carros de luxo para executivos',
        exclusividade_funcionarios: true
      }
    }),
  ])

  // Cria usuários
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        nome: 'João Silva',
        identidade: '123456789',
        CNH: 'AB123456',
        endereco: 'Rua A, 123',
        idade: 30,
        tipo: 'COMUM'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Maria Santos',
        identidade: '987654321',
        CNH: 'CD987654',
        endereco: 'Rua B, 456',
        idade: 35,
        tipo: 'FUNCIONARIO',
        FuncionarioPublico: {
          create: {
            orgao: 'Prefeitura Municipal'
          }
        }
      }
    })
  ])

  // Cria veículos
  const automoveis = await Promise.all([
    prisma.automovel.create({
      data: {
        chassi: 'ABC123456789',
        placa: 'ABC1234',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2022,
        cor: 'Prata',
        categoria_id: categorias[1].id
      }
    }),
    prisma.automovel.create({
      data: {
        chassi: 'DEF987654321',
        placa: 'DEF5678',
        marca: 'Volkswagen',
        modelo: 'Gol',
        ano: 2021,
        cor: 'Branco',
        categoria_id: categorias[0].id
      }
    })
  ])

  // cria locações
  await prisma.locacao.create({
    data: {
      usuario_id: usuarios[0].id,
      automovel_id: automoveis[1].id,
      data_hora: new Date()
    }
  })

  // Create concertos
  await prisma.concerto.create({
    data: {
      automovel_id: automoveis[0].id,
      data: new Date(),
      descricao: 'Troca de óleo e filtros',
      valor: 350.00,
      oficina: 'Oficina do João'
    }
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
