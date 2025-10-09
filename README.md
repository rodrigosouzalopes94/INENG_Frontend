# 👷‍♂️ Portal de Gestão de Obras - INENG

Este é o repositório do **Portal de Gestão de Obras (INENG - Inova Engenharia)**, uma aplicação desenvolvida com **arquitetura modular** para **controle de custos, cadastro de usuários e gestão de projetos**.

---

## 🏗️ 1. Arquitetura do Projeto

O projeto é dividido em duas camadas principais, seguindo uma arquitetura moderna para **máxima escalabilidade** e **separação de responsabilidades**:

| Camada | Tecnologia Principal | Finalidade |
|--------|----------------------|-------------|
| **Frontend (Web)** | React (Vite) + TypeScript | Interface de usuário (UI) componentizada e rápida. |
| **Backend (API)** | Node.js (Express) + TypeScript | Servidor RESTful, lógica de negócio e segurança. |
| **Banco de Dados** | MySQL + Prisma ORM | Persistência de dados segura e tipada. |

---

## 📂 2. Estrutura de Pastas

A estrutura do projeto segue um modelo modular, garantindo organização e fácil escalabilidade:

```
.
├── INENG_Backend/       # Servidor Node.js (API)
│   ├── prisma/          # Schemas e Migrações (Prisma)
│   └── src/             # Código-fonte do servidor (Controllers, Routes, DB)
└── INENG_Frontend/      # Aplicação Web (React/Vite)
    ├── src/
    │   ├── api/         # Configuração do Axios e Serviços de API
    │   ├── components/  # Componentes de UI Reutilizáveis (Input, Button, Card)
    │   ├── hooks/       # Lógica de Estado e Integrações de API
    │   ├── models/      # Tipos de Dados (User, Cliente, etc.)
    │   └── pages/       # Telas/Rotas Principais (Login, RegisterUser)
```

---

## ⚙️ 3. Setup do Ambiente

### 3.1 Banco de Dados

1. Garanta que o servidor MySQL esteja rodando (porta `3306`).
2. Crie um banco de dados chamado `ineng_db` no **MySQL Workbench**.

---

### 3.2 Configuração do Backend (`INENG_Backend/`)

**Instalação**

```bash
cd INENG_Backend
npm install
```

**Variáveis de ambiente**

Crie um arquivo `.env` na raiz com o seguinte conteúdo:

```env
# .env (BACKEND)
DATABASE_URL="mysql://root:root@localhost:3306/ineng_db"
PORT=3000
JWT_SECRET="SUA_CHAVE_SECRETA_MUITO_LONGA_AQUI"
```

**Executar Migrações**

```bash
npx prisma migrate dev --name init_schema
```

---

### 3.3 Configuração do Frontend (`INENG_Frontend/`)

**Instalação**

```bash
cd INENG_Frontend
npm install
npm install react-icons
```

**Variáveis de ambiente**

Crie o arquivo `.env` com o seguinte conteúdo:

```env
# .env (FRONTEND - VITE)
VITE_API_BASE_URL=http://SEU_IP_LOCAL:3000/api/v1
```

---

## ▶️ 4. Como Rodar o Sistema

### Iniciar o Backend (API)

```bash
cd INENG_Backend
npm run dev
```

### Iniciar o Frontend (Web)

```bash
cd INENG_Frontend
npm run dev
```

Após isso, acesse o navegador e teste o **fluxo de Login e Cadastro de Gestores**.

---

## 📜 Licença

Este projeto é de uso interno da **INENG - Inova Engenharia**.  
Distribuição ou uso comercial sem autorização prévia não é permitida.

---

**Desenvolvido por Inova Engenharia**
