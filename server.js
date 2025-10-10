import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

// Importando todos os roteadores
import productsRouter from './routes/products.js';
import storeRouter from './routes/store.js';
import campaignsRouter from './routes/campaigns.js';
import ordersRouter from './routes/orders.js';
import supplierRouter from './routes/suppliers.js';
import usersRouter from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Carregar Swagger JSON externo ---
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Montando todas as rotas
app.use('/products', productsRouter);
app.use('/store', storeRouter);
app.use('/campaigns', campaignsRouter);
app.use('/orders', ordersRouter);
app.use('/suppliers', supplierRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('🚀 API Central de Compras no ar! Acesse /api-docs para a documentação.');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
});
