import { BereicheRepository } from '../repositories/BereicheRepository';
import express, { Request, Response } from 'express';

export function buildBereichRouter(repo: BereicheRepository) {
  const router = express.Router();

  router.get('/', (req: Request, res: Response) => {
    res.json(repo.getAll());
  });

  router.post('/', (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid Bereich name' });
  }
  const newBereich = repo.add(name);
  res.status(201).json(newBereich);
});

  router.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    repo.delete(id);
    res.status(204).send();
  });

  router.put('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid Bereich name' });
    }
    repo.update({ id, name });
    res.status(200).json({ id, name });
  });

  return router;
}