import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { name, email, phone, sector, nif } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO clients (name, email, phone, sector, nif)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, phone, sector, nif]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
