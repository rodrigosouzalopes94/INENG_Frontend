# 🏗️ INENG – Portal de Gestão de Obras

O **INENG – Portal de Gestão de Obras** é um **micro ERP/CRM voltado para o setor de engenharia**, desenvolvido para centralizar o controle operacional de obras, clientes, usuários, equipamentos e funcionários.

A aplicação foi construída com foco em **organização, segurança e escalabilidade**, atendendo às necessidades de gestão técnica e administrativa de projetos de engenharia.

🌐 **Sistema em produção:**
[https://ineng-sistemas.vercel.app/](https://ineng-sistemas.vercel.app/)

---

## 🎯 Objetivo do Sistema

O INENG tem como objetivo oferecer uma solução única para:

* Gestão de obras e projetos
* Controle de clientes
* Administração de usuários do sistema
* Organização de recursos (equipamentos e funcionários)
* Visualização de dados através de dashboards

---

## 🧠 Arquitetura do Projeto

O sistema adota uma **arquitetura modular**, separando responsabilidades e facilitando a manutenção e evolução da aplicação.

| Camada         | Tecnologia                     | Finalidade                                          |
| -------------- | ------------------------------ | --------------------------------------------------- |
| Frontend (Web) | React (Vite) + TypeScript      | Interface de usuário rápida e componentizada        |
| Backend (API)  | Node.js (Express) + TypeScript | Lógica de negócio, autenticação e regras do sistema |
| Banco de Dados | PostgreSQL + Prisma ORM        | Persistência de dados tipada e segura               |

---

## ⚙️ Funcionalidades Principais

### 👥 Gestão de Usuários

* Cadastro de usuários do sistema
* Controle de perfis e permissões (roles)
* Autenticação segura com **JWT**

---

### 🏢 Clientes e Obras

* Cadastro de clientes
* Cadastro de obras
* Associação de obras a clientes
* Organização por status e responsáveis

---

### 🧑‍🔧 Recursos de Engenharia

* Cadastro de funcionários
* Cadastro de equipamentos
* Vínculo de recursos às obras

---

### 📊 Dashboards

* Visão geral dos dados do sistema
* Indicadores operacionais
* Apoio à tomada de decisão

---

## 📂 Estrutura de Pastas

```
.
├── INENG_Backend/       # API Node.js
│   ├── prisma/          # Schema e migrações (Prisma)
│   └── src/             # Controllers, Routes, Middlewares e DB
└── INENG_Frontend/      # Aplicação Web (React)
    ├── src/
    │   ├── api/         # Configuração do Axios e serviços
    │   ├── components/  # Componentes reutilizáveis de UI
    │   ├── hooks/       # Hooks customizados e estado
    │   ├── models/      # Tipagens e modelos de dados
    │   └── pages/       # Telas principais (Login, Dashboards, Cadastros)
```

---

## 🚀 Como Rodar Localmente

### ✅ Pré-requisitos

* Node.js 16+
* PostgreSQL ativo

---

### 🔧 Configuração do Backend

```bash
cd INENG_Backend
npm install
```

Crie o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ineng_db"
PORT=3000
JWT_SECRET="SUA_CHAVE_SECRETA_MUITO_LONGA"
```

Execute as migrações:

```bash
npx prisma migrate dev --name init_schema
```

Inicie a API:

```bash
npm run dev
```

---

### 🎨 Configuração do Frontend

```bash
cd INENG_Frontend
npm install
```

Crie o `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Inicie a aplicação:

```bash
npm run dev
```

Acesse:

```
http://localhost:5173
```

---

## 🔐 Segurança

* Autenticação baseada em **JWT**
* Controle de acesso por perfil de usuário
* Rotas protegidas no backend
* Comunicação segura entre frontend e backend

---

## 📦 Deploy

* Frontend publicado na **Vercel**
* Backend preparado para ambientes de produção
* Banco de dados PostgreSQL

---

## 📜 Licença

Projeto de uso interno da **INENG – Inova Engenharia**.

Distribuição ou uso comercial sem autorização prévia não é permitida.

---

## ✅ Considerações Finais

O **INENG** se posiciona como uma solução robusta e moderna para **gestão de obras e recursos de engenharia**, unindo boas práticas de desenvolvimento, segurança e clareza nas regras de negócio.
