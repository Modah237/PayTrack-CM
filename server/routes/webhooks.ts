import { Router, Request, Response } from 'express';
import { db } from '../db';
import { getReminderMessage, sendWhatsAppTemplate } from '../services/whatsapp';

const router = Router();

// Campay Webhook for MoMo payments
router.post('/campay', async (req: Request, res: Response) => {
  const payload = req.body;
  
  // NOTE: In production, verify Campay webhook signature here!
  console.log('[Webhook] Campay payment received:', payload);

  try {
    const { reference, status, amount, operator } = payload;

    if (status === 'SUCCESSFUL') {
      // Find the invoice via external_reference
      const { rows } = await db.query('SELECT * FROM invoices WHERE id = $1', [reference]);
      const invoice = rows[0];

      if (invoice) {
        // Record the payment
        await db.query(
          `INSERT INTO payments (invoice_id, amount, method, transaction_ref, reconciled)
           VALUES ($1, $2, $3, $4, $5)`,
          [invoice.id, amount, operator, payload.transaction_id || `campay_${Date.now()}`, true]
        );

        // Update invoice status
        const totalPaid = parseFloat(invoice.paid_amount) + parseFloat(amount);
        let newStatus = 'partially_paid';
        if (totalPaid >= parseFloat(invoice.amount)) {
          newStatus = 'paid';
        }

        await db.query(
          `UPDATE invoices SET paid_amount = $1, status = $2 WHERE id = $3`,
          [totalPaid, newStatus, invoice.id]
        );

        console.log(`[Webhook] Invoice ${invoice.id} marked as ${newStatus}`);
      }
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('[Webhook] Campay Processing Error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// n8n RPA Webhook Trigger (Moteur de relance)
router.post('/n8n-trigger', async (req: Request, res: Response) => {
  const secret = req.headers['x-n8n-secret'];
  const isInternal = req.body.internal_cron === true;
  
  console.log('[Automation Debug] Received secret:', secret);
  console.log('[Automation Debug] Expected secret:', process.env.N8N_WEBHOOK_SECRET);

  if (!isInternal && secret !== process.env.N8N_WEBHOOK_SECRET) {
    console.warn('[Automation Debug] Secret mismatch!');
    return res.status(403).send('Forbidden');
  }

  try {
    console.log('[Automation] Starting daily reminder sweep');
    
    // 1. Select invoices needing reminders (status != paid)
    const { rows: overdueInvoices } = await db.query(`
      SELECT i.*, c.name as client_name, c.phone as client_phone 
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.status IN ('pending', 'overdue', 'partially_paid')
    `);

    const results = [];

    for (const inv of overdueInvoices) {
      const dueDate = new Date(inv.due_date);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));

      // Check if already reminded today to avoid spamming
      const { rows: todayReminders } = await db.query(
        `SELECT id FROM reminders WHERE invoice_id = $1 AND sent_at::date = CURRENT_DATE`,
        [inv.id]
      );
      if (todayReminders.length > 0) continue;

      let tone: 'cordial' | 'firm' | 'urgent' | 'legal' | null = null;
      let templateName = '';

      if (diffDays >= 1 && diffDays <= 3) {
        tone = 'cordial';
        templateName = 'remind_p1_cordial';
      } else if (diffDays >= 7 && diffDays < 14) {
        tone = 'firm';
        templateName = 'remind_p2_firm';
      } else if (diffDays >= 14 && diffDays < 30) {
        tone = 'urgent';
        templateName = 'remind_p3_urgent';
      } else if (diffDays >= 30) {
        tone = 'legal';
        templateName = 'remind_p4_legal';
      }

      if (tone) {
        const message = getReminderMessage(inv.client_name, inv.invoice_number, tone, inv.momo_link);
        
        try {
          // send via WhatsApp (Real or Mock)
          await sendWhatsAppTemplate(inv.client_phone, templateName, 'fr', [
            { type: 'text', text: inv.client_name },
            { type: 'text', text: inv.invoice_number },
            { type: 'text', text: inv.momo_link || 'Lien indisponible' }
          ]);

          // Save to reminders table
          await db.query(`
            INSERT INTO reminders (invoice_id, channel, tone, message, status, sent_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
          `, [inv.id, 'whatsapp', tone, message, 'sent']);

          // Update invoice status to 'overdue' if it was just 'pending'
          if (inv.status === 'pending') {
            await db.query(`UPDATE invoices SET status = 'overdue' WHERE id = $1`, [inv.id]);
          }

          results.push({ invoice: inv.invoice_number, client: inv.client_name, tone });
        } catch (waError) {
          console.error(`[Automation] Failed to remind ${inv.invoice_number}:`, waError);
        }
      }
    }

    res.status(200).json({ 
      success: true, 
      remindersSent: results.length,
      details: results
    });
  } catch (error) {
    console.error('[Automation] Batch Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
