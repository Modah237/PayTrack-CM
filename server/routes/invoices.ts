import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth } from '../middleware/auth';
import { generatePaymentLink } from '../services/campay';

const router = Router();

router.use(requireAuth);

router.get('/', async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { invoice_number, client_id, amount, due_date, description } = req.body;
  try {
    // 1. Save initial invoice to DB to get ID
    const { rows } = await db.query(
      `INSERT INTO invoices (invoice_number, client_id, amount, due_date, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [invoice_number, client_id, amount, due_date, description]
    );
    
    const invoice = rows[0];

    // 2. Generate Campay link
    const momoLink = await generatePaymentLink(
      parseFloat(amount),
      `Facture PayTrack ${invoice_number}`,
      invoice.id
    );

    // 3. Update invoice with Momo Link
    const { rows: updatedRows } = await db.query(
      `UPDATE invoices SET momo_link = $1 WHERE id = $2 RETURNING *`,
      [momoLink, invoice.id]
    );

    res.status(201).json(updatedRows[0]);
  } catch (err: any) {
    console.error('Invoice Creation Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
