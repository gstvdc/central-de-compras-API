// ORDERS — Desenvolvido por Gustavo da Cunha Constante

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/fileHandler.js';
import { validateBody, orderCreateSchema, orderUpdateSchema } from '../utils/validators.js';

const router = Router();
const FILE_NAME = 'order.json';
router.route('/')
  .get(async (req, res) => {
    const { q, date, store_id } = req.query;
    let data = await readData(FILE_NAME);
    if (q) {
      const qLower = q.toLowerCase();
      data = data.filter(o => (o.item || '').toLowerCase().includes(qLower));
    }
    if (date) {
      data = data.filter(o => (o.date || '').startsWith(date));
    }
    if (store_id) {
      data = data.filter(o => o.store_id === store_id);
    }
    res.json(data);
  })

  // Adiciona novo pedido
  .post(validateBody(orderCreateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    const newItem = {
      id: uuidv4(),                     // Gera um ID único
      ...req.body,                      // Copia os campos enviados no corpo
      date: new Date().toISOString(),   // Adiciona a data de criação
    };
    data.push(newItem);
    await writeData(FILE_NAME, data);
    res.status(201).json(newItem);
  });

// Busca, atualiza ou apaga pedido por ID
router.route('/:id')
  // Busca pedido por id
  .get(async (req, res) => {
    const data = await readData(FILE_NAME); // Lê
    const item = data.find(p => p.id === req.params.id); // Procura o pedido
    if (item) res.json(item);
    else res.status(404).json({ message: 'Pedido não encontrado' });
  })

  // Atualiza pedido
  .put(validateBody(orderUpdateSchema), async (req, res) => {
    const data = await readData(FILE_NAME); // Lê
    const index = data.findIndex(p => p.id === req.params.id); // Encontra o índice
    if (index !== -1) {
      //Mescla dados antigos com novos
      data[index] = { ...data[index], ...req.body };
      await writeData(FILE_NAME, data);
      res.json(data[index]); // Retorna att
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  })

  // Apaga pedido
  .delete(async (req, res) => {
    const data = await readData(FILE_NAME); // Lê
    const newData = data.filter(p => p.id !== req.params.id); // Filtra
    if (newData.length < data.length) {
      await writeData(FILE_NAME, newData);
      res.status(204).send(); // Retorna sem o conteudo
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  });

export default router;
