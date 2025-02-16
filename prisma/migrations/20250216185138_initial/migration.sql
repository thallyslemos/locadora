-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "identidade" TEXT NOT NULL,
    "CNH" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuncionarioPublico" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "orgao" TEXT NOT NULL,

    CONSTRAINT "FuncionarioPublico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Automovel" (
    "id" SERIAL NOT NULL,
    "chassi" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "categoria_id" INTEGER NOT NULL,

    CONSTRAINT "Automovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco_diaria" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "exclusividade_funcionarios" BOOLEAN NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locacao" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "automovel_id" INTEGER NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concerto" (
    "id" SERIAL NOT NULL,
    "automovel_id" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "oficina" TEXT NOT NULL,

    CONSTRAINT "Concerto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FuncionarioPublico_usuario_id_key" ON "FuncionarioPublico"("usuario_id");

-- AddForeignKey
ALTER TABLE "FuncionarioPublico" ADD CONSTRAINT "FuncionarioPublico_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automovel" ADD CONSTRAINT "Automovel_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_automovel_id_fkey" FOREIGN KEY ("automovel_id") REFERENCES "Automovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concerto" ADD CONSTRAINT "Concerto_automovel_id_fkey" FOREIGN KEY ("automovel_id") REFERENCES "Automovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
