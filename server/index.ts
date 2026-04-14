import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import cron from 'node-cron';
import axios from 'axios';

import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import invoiceRoutes from './routes/invoices';
import paymentRoutes from './routes/payments';
import reminderRoutes from './routes/reminders';
import webhookRoutes from './routes/webhooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Need raw body for webhooks signatures if required
app.use(express.json());

// Main entry point logic
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PayTrack CM API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/webhooks', webhookRoutes);

// --- Production: Serving static files ---
if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
  const publicPath = path.resolve(__dirname, '../dist');
  console.log(`[Server] Serving static files from: ${publicPath}`);
  
  app.use(express.static(publicPath));

  app.get('*', (req, res) => {
    // Only serve index.html if it's not an API call
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(publicPath, 'index.html'));
    }
  });
}

// General Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Error]:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Daily Automation Cron (Every day at 08:00)
cron.schedule('0 8 * * *', async () => {
  try {
    console.log('[Cron] Triggering daily reminders...');
    // In production, we use 127.0.0.1 to avoid DNS issues with local calls
    const targetUrl = `http://127.0.0.1:${PORT}/api/webhooks/n8n-trigger`;
    await axios.post(targetUrl, { internal_cron: true }, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[Cron] Failed to trigger reminders:', err);
  }
});

app.listen(PORT, () => {
  console.log(`[Server] PayTrack CM Backend running on port ${PORT}`);
  console.log(`[Cron] Reminders scheduled daily at 08:00`);
});
