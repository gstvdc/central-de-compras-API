// USERS - Desenvolvido por Brayan Miguel Favarin

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/fileHandler.js';
import { validateBody, userCreateSchema, userUpdateSchema } from '../utils/validators.js';

const router = Router();
const FILE_NAME = 'users.json';

router.route('/')
  .get(async (req, res) => {
    const { q } = req.query;
    let data = await readData(FILE_NAME);
    if (q) {
      const qLower = q.toLowerCase();
      data = data.filter(u => (u.name || '').toLowerCase().includes(qLower) || (u.user || '').toLowerCase().includes(qLower) || (u.contact_email || '').toLowerCase().includes(qLower));
    }
    const usersWithoutPwd = data.map(u => {
        const { pwd, ...user } = u;
        return user;
    });
    res.json(usersWithoutPwd);
  })
  .post(validateBody(userCreateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    if (data.some(u => u.user === req.body.user)) {
        return res.status(400).json({ message: 'Nome de usuário já existe.' });
    }
    const newItem = { id: uuidv4(), ...req.body };
    data.push(newItem);
    await writeData(FILE_NAME, data);
    
    const { pwd, ...userWithoutPwd } = newItem;
    res.status(201).json(userWithoutPwd);
  });

router.route('/:id')
  .get(async (req, res) => {
    const data = await readData(FILE_NAME);
    const item = data.find(p => p.id === req.params.id);
    if (item) {
        const { pwd, ...user } = item;
        res.json(user);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
  })
  .put(validateBody(userUpdateSchema), async (req, res) => {
    const data = await readData(FILE_NAME);
    const index = data.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        await writeData(FILE_NAME, data);
        const { pwd, ...user } = data[index];
        res.json(user);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
  })
  .delete(async (req, res) => {
    const data = await readData(FILE_NAME);
    const newData = data.filter(p => p.id !== req.params.id);
    if (newData.length < data.length) {
        await writeData(FILE_NAME, newData);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
  });

export default router;