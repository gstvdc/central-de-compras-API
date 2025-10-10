// STORE — Desenvolvido por Henrique Matiola

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/fileHandler.js';
import { validateBody, storeCreateSchema, storeUpdateSchema } from '../utils/validators.js';

const router = Router();
const FILE_NAME = 'store.json';

router.route('/')
  .get(async (req, res) => {
    const { q } = req.query;
    let data = await readData(FILE_NAME);
    if (q) {
      const qLower = q.toLowerCase();
      data = data.filter(s => (s.store_name || '').toLowerCase().includes(qLower) || (s.address || '').toLowerCase().includes(qLower));
    }
    res.json(data);
  })
  .post(validateBody(storeCreateSchema), async (req, res) => {
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
    if (item) res.json(item);
    else res.status(404).json({ message: 'Loja não encontrada' });
  })
  .put(validateBody(storeUpdateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    const index = data.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      data[index] = { ...data[index], ...req.body };
      await writeData(FILE_NAME, data);
      res.json(data[index]);
    } else {
      res.status(404).json({ message: 'Loja não encontrada' });
    }
  })
  .delete(async (req, res) => {
    const data = await readData(FILE_NAME);
    const newData = data.filter(p => p.id !== req.params.id);
    if (newData.length < data.length) {
      await writeData(FILE_NAME, newData);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Loja não encontrada' });
    }
  });

export default router;