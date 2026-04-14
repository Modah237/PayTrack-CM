import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

/**
 * GET /api/dashboard/stats
 * Aggregate stats for the dashboard overview cards.
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT
        -- Total receivable: sum of unpaid portion across all non-paid invoices
        COALESCE(SUM(CASE WHEN status != 'paid' THEN (amount - paid_amount) ELSE 0 END), 0) AS total_receivable,

        -- Recovery rate: (total paid_amount / total amount) * 100
        CASE
          WHEN SUM(amount) > 0
          THEN ROUND((SUM(paid_amount) / SUM(amount)) * 100, 1)
          ELSE 0
        END AS recovery_rate,

        -- Average delay in days for overdue invoices
        COALESCE(
          ROUND(AVG(
            CASE WHEN status = 'overdue'
            THEN EXTRACT(DAY FROM (NOW() - due_date))
            ELSE NULL END
          )::NUMERIC, 0),
          0
        ) AS avg_delay,

        -- Count of overdue invoices
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) AS overdue_count,

        -- Total invoices
        COUNT(*) AS total_invoices,

        -- Total clients (separate sub-query would be cleaner but this avoids extra round-trip)
        0 AS total_clients

      FROM invoices
    `);

    // Fetch client count separately
    const { rows: clientRows } = await db.query(`SELECT COUNT(*) AS total_clients FROM clients`);

    res.json({
      totalReceivable: parseFloat(rows[0].total_receivable),
      recoveryRate: parseFloat(rows[0].recovery_rate),
      avgDelay: parseInt(rows[0].avg_delay, 10),
      overdueCount: parseInt(rows[0].overdue_count, 10),
      totalInvoices: parseInt(rows[0].total_invoices, 10),
      totalClients: parseInt(clientRows[0].total_clients, 10),
    });
  } catch (err: any) {
    console.error('[Dashboard] Stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
