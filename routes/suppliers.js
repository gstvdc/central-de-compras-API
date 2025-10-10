// SUPPLIERS - Desenvolvido por Bruno Luque R Silva

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/fileHandler.js';
import { validateBody, supplierCreateSchema, supplierUpdateSchema } from '../utils/validators.js';

const router = Router();
const FILE_NAME = 'supplier.json';

router.route('/')
  .get(async (req, res) => {
    const { q } = req.query;
    let data = await readData(FILE_NAME);
    if (q) {
      const qLower = q.toLowerCase();
      data = data.filter(s => (s.supplier_name || '').toLowerCase().includes(qLower) || (s.supplier_category || '').toLowerCase().includes(qLower));
    }
    res.json(data);
  })
  .post(validateBody(supplierCreateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    const newItem = { id: uuidv4(), ...req.body };
    data.push(newItem);
    await writeData(FILE_NAME, data);
    res.status(201).json(newItem);
  });

router.route('/:id')
  .get(async (req, res) => {
    const data = await readData(FILE_NAME);
    const item = data.find(p => p.id === req.params.id);
    if (item) return res.json(item);
    res.status(404).json({ message: 'Fornecedor não encontrado' });
  })
  .put(validateBody(supplierUpdateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    const index = data.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Fornecedor não encontrado' });
    data[index] = { ...data[index], ...req.body };
    await writeData(FILE_NAME, data);
    res.json(data[index]);
  })
  .delete(async (req, res) => {
    const data = await readData(FILE_NAME);
    const newData = data.filter(p => p.id !== req.params.id);
    if (newData.length === data.length) return res.status(404).json({ message: 'Fornecedor não encontrado' });
    await writeData(FILE_NAME, newData);
    res.status(204).send();
  });

export default router;
