### ConquistaCar

## Configuração do Ambiente

1. Instale Node.js e Docker.
2. Clone o repositório do projeto.
3. Crie um arquivo `.env` com as variáveis de ambiente necessárias.
4. Execute `docker-compose up` para iniciar o banco de dados PostgreSQL.
5. Execute `npm install` para instalar as dependências.
6. Execute `npx prisma migrate dev` para rodar as migrações do banco de dados.
7. Execute `npm run dev` para iniciar a aplicação.

## Tecnologias Utilizadas

- Node.js com Express.js
- PostgreSQL com Prisma ORM
- HTML, CSS e JavaScript

## Dependências Necessárias

- express
- @prisma/client
- prisma
- dotenvnpm 