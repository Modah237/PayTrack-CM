import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import cron from 'node-cron';
import axios from 'axios';
import fs from 'fs';

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

// --- Production: Serving static files ---
const publicPath = path.resolve(__dirname, '../dist');
console.log(`[Server] Initializing static serving from: ${publicPath}`);

// Serve static files BEFORE API routes to ensure assets are found
app.use(express.static(publicPath));

// Main entry point logic
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PayTrack CM API is running.', env: process.env.NODE_ENV });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/webhooks', webhookRoutes);

// Catch-all route for SPA - must check if it's an API call or a file request
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  
  const filePath = path.join(publicPath, 'index.html');
  res.sendFile(filePath);
});

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
