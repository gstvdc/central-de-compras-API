// PRODUCTS — Desenvolvido por Eduardo da Silva Assis

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/fileHandler.js';
import { validateBody, productCreateSchema, productUpdateSchema } from '../utils/validators.js';

const router = Router();
const FILE_NAME = 'product.json';

// Lista todos os produtos (suporta ?q=name ?supplier_id=id)
router.route('/')
  .get(async (req, res) => {
    const { q, supplier_id } = req.query;
    let data = await readData(FILE_NAME);
    if (q) {
      const qLower = q.toLowerCase();
      data = data.filter(p => (p.name || '').toLowerCase().includes(qLower) || (p.description || '').toLowerCase().includes(qLower));
    }
    if (supplier_id) {
      data = data.filter(p => p.supplier_id === supplier_id);
    }
    res.json(data);
  })

  // Adiciona novo produto
  .post(validateBody(productCreateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    const newItem = { id: uuidv4(), ...req.body };
    data.push(newItem);
    await writeData(FILE_NAME, data);
    res.status(201).json(newItem);
  });

// Busca, atualiza ou apaga produto por ID
router.route('/:id')
  // Busca produto por id
  .get(async (req, res) => {
    const data = await readData(FILE_NAME);
    const item = data.find(p => p.id === req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: 'Produto n\u00e3o encontrado' });
  })

  // Atualiza produto
  .put(validateBody(productUpdateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    const index = data.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      data[index] = { ...data[index], ...req.body };
      await writeData(FILE_NAME, data);
      res.json(data[index]);
    } else {
      res.status(404).json({ message: 'Produto n\u00e3o encontrado' });
    }
  })

  // Apaga produto
  .delete(async (req, res) => {
    const data = await readData(FILE_NAME);
    const newData = data.filter(p => p.id !== req.params.id);
    if (newData.length < data.length) {
      await writeData(FILE_NAME, newData);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Produto n\u00e3o encontrado' });
    }
  });

export default router;
