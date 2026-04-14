import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT r.*, i.invoice_number, i.dueDate as due_date, c.name as client_name, c.phone as client_phone
      FROM reminders r
      JOIN invoices i ON r.invoice_id = i.id
      JOIN clients c ON i.client_id = c.id
      ORDER BY r.sent_at DESC
    `);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
