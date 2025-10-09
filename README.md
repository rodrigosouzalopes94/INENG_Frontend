👷‍♂️ Portal de Gestão de Obras - INENG
Este é o repositório do Portal de Gestão de Obras (INENG - Inova Engenharia), uma aplicação desenvolvida com arquitetura modular para controle de custos, cadastro de usuários e gestão de projetos.

🏗️ 1. Arquitetura do Projeto
O projeto é dividido em duas camadas principais, seguindo uma arquitetura moderna para máxima escalabilidade e separação de responsabilidades.

Camada	Tecnologia Principal	Finalidade
Frontend (Web)	React (Vite) + TypeScript	Interface de usuário (UI) componentizada e rápida.
Backend (API)	Node.js (Express) + TypeScript	Servidor RESTful, lógica de negócio e segurança.
Banco de Dados	MySQL + Prisma ORM	Persistência de dados segura e tipada.

Exportar para as Planilhas
📂 2. Estrutura de Pastas
A estrutura é modular, com foco na escalabilidade:

.
├── INENG_Backend/       # Servidor Node.js (API)
│   ├── prisma/          # Schemas e Migrações (Prisma)
│   └── src/             # Código-fonte do servidor (Controllers, Routes, DB)
└── INENG_Frontend/      # Aplicação Web (React/Vite)
    ├── src/
    │   ├── api/         # Configuração do Axios e Serviços de API
    │   ├── components/  # Componentes de UI Reutilizáveis (Input, Button, Card)
    │   ├── hooks/       # Lógica de Estado e API
    │   ├── models/      # Tipos de Dados (User, Cliente, etc.)
    │   └── pages/       # Telas/Rotas Principais (Login, RegisterUser)
⚙️ 3. Setup do Ambiente
Para rodar o projeto, configure o MySQL e os arquivos .env em ambas as pastas.

3.1 Setup do Banco de Dados
Garanta que o seu servidor MySQL esteja rodando (porta 3306).

Crie um esquema (database) chamado ineng_db no seu MySQL Workbench.

3.2 Configuração do Backend (INENG_Backend/)
Instalação: cd INENG_Backend e npm install.

Variáveis (.env): Crie o arquivo .env com suas credenciais:

Snippet de código

# .env (BACKEND)
DATABASE_URL="mysql://root:root@localhost:3306/ineng_db" 
PORT=3000
JWT_SECRET="SUA_CHAVE_SECRETA_MUITO_LONGA_AQUI"
Executar Migração (Criação de Tabelas):

Bash

npx prisma migrate dev --name init_schema
3.3 Configuração do Frontend (INENG_Frontend/)
Instalação: cd INENG_Frontend, npm install, e npm install react-icons.

Variáveis (.env): Crie o arquivo .env para apontar para a API:

Snippet de código

# .env (FRONTEND - VITE)
VITE_API_BASE_URL=http://SEU_IP_LOCAL:3000/api/v1 
▶️ 4. Como Rodar o Sistema
Para testar o fluxo de Login e Cadastro de Gestores:

Iniciar Backend (API):

Bash

cd INENG_Backend
npm run dev
Iniciar Frontend (Web):

Bash

cd INENG_Frontend
npm run dev
