# Central de Compras - API 🛍️

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![REST API](https://img.shields.io/badge/REST%20API-005571?style=for-the-badge&logo=swagger&logoColor=white)]()

> API RESTful completa para gerenciamento de uma Central de Compras, com documentação Swagger e foco em operações de pedidos.

## 🎯 Status do Projeto

- ✅ Autenticação de usuários
- ✅ CRUD completo de produtos
- ✅ Gerenciamento de fornecedores
- ✅ Sistema de pedidos
- ✅ Documentação Swagger
- ✅ Validação de dados com Joi

## 🚀 Exemplo de Uso

```bash
# Criar um novo pedido
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": "123",
    "items": [{
      "product_id": "456",
      "quantity": 2
    }],
    "total_amount": 100
  }'
```

## 📋 Funcionalidades

- **Produtos**: Cadastro e gerenciamento de produtos
- **Fornecedores**: Gestão de fornecedores
- **Lojas**: Controle de lojas
- **Pedidos**: Gerenciamento de pedidos
- **Campanhas**: Controle de campanhas promocionais
- **Usuários**: Gestão de usuários do sistema

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- Joi (validação)
- Swagger UI Express (documentação)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/gstvdc/central-de-compras-API.git
```

2. Instale as dependências:
```bash
cd central-de-compras-API
npm install
```

3. Inicie o servidor:
```bash
npm start
```

O servidor iniciará na porta 3000: [http://localhost:3000](http://localhost:3000)

## 📖 Documentação

A documentação completa da API está disponível através do Swagger UI:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🔄 Endpoints

- `/products` - Gestão de produtos
- `/suppliers` - Gestão de fornecedores
- `/store` - Gestão de lojas
- `/orders` - Gestão de pedidos
- `/campaigns` - Gestão de campanhas
- `/users` - Gestão de usuários

## 👥 Equipe

Desenvolvido por Gustavo da Cunha Constante

## � Exemplo de Resposta

```json
{
  "id": "789",
  "store_id": "123",
  "items": [
    {
      "product_id": "456",
      "quantity": 2,
      "unit_price": 50
    }
  ],
  "total_amount": 100,
  "status": "Pending",
  "date": "2025-10-10T10:00:00Z"
}
```

## 🛠️ Stack Tecnológica

- **Backend:** Node.js, Express.js
- **Validação:** Joi
- **Documentação:** Swagger/OpenAPI 3.0
- **Formato:** REST API, JSON
- **Persistência:** JSON File System
- **Padrões:** MVC, Middlewares, Error Handling

## 📊 Estrutura do Projeto

```
central-de-compras-api/
├── routes/           # Rotas da API
├── db/              # Arquivos JSON para persistência
├── utils/           # Utilitários e helpers
├── server.js        # Entrada da aplicação
└── swagger.json     # Documentação OpenAPI
```
