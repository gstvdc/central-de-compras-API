// CAMPAIGNS - Desenvolvido por João Marcos Vieira dos Santos

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/fileHandler.js';
import { validateBody, campaignCreateSchema, campaignUpdateSchema } from '../utils/validators.js';

const router = Router();
const FILE_NAME = 'campaigns.json';

//Busca campanha
router.route('/')
  .get(async (req, res) => {
    const { q } = req.query;
    let data = await readData(FILE_NAME);
    if (q) {
      const qLower = q.toLowerCase();
      data = data.filter(c => (c.name || '').toLowerCase().includes(qLower));
    }
    res.json(data);
  })

  //Add campanha
  .post(validateBody(campaignCreateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    const newItem = { id: uuidv4(), ...req.body };
    data.push(newItem);
    await writeData(FILE_NAME, data);
    res.status(201).json(newItem);
  });

//Busca campanha por id
router.route('/:id')
  .get(async (req, res) => {
    const data = await readData(FILE_NAME);
    const item = data.find(p => p.id === req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: 'Campanha não encontrada' });
  })

  //Atualiza campanha
  .put(validateBody(campaignUpdateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    const index = data.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      data[index] = { ...data[index], ...req.body };
      await writeData(FILE_NAME, data);
      res.json(data[index]);
    } else {
      res.status(404).json({ message: 'Campanha não encontrada' });
    }
  })

  //Apaga campanha
  .delete(async (req, res) => {
    const data = await readData(FILE_NAME);
    const newData = data.filter(p => p.id !== req.params.id);
    if (newData.length < data.length) {
      await writeData(FILE_NAME, newData);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Campanha não encontrada' });
    }
  });

export default router;