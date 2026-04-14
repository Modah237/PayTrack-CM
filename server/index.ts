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
import dashboardRoutes from './routes/dashboard';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env (Railway injects vars directly, this is a no-op in production — safe)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000', 'http://localhost:4000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
// Need raw body for webhooks signatures if required
app.use(express.json());

const DIST_PATH = path.resolve(__dirname, '../dist');
console.log(`[Server] Production diagnostics:`);
console.log(`- Base directory: ${__dirname}`);
console.log(`- Dist directory: ${DIST_PATH}`);

if (fs.existsSync(DIST_PATH)) {
  console.log('[Server] Dist folder validated.');
  const files = fs.readdirSync(DIST_PATH);
  console.log(`[Server] Found files: ${files.join(', ')}`);
} else {
  console.error('[Server] CRITICAL: Dist folder missing at launch!');
}

// 1. Explicitly serve static assets first
app.use('/assets', express.static(path.join(DIST_PATH, 'assets'), {
  immutable: true,
  maxAge: '1y'
}));

// 2. Serve other static files (favicon, etc)
app.use(express.static(DIST_PATH));

// 3. API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'PayTrack CM API is running (Diagnostic Mode).', 
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

app.get('/api/debug-files', (req, res) => {
  try {
    const list = fs.readdirSync(DIST_PATH);
    res.json({ path: DIST_PATH, files: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 4. Catch-all for SPA (MUST be at the very end)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint non trouvé' });
  }
  res.sendFile(path.join(DIST_PATH, 'index.html'));
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

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Server] PayTrack CM Backend running on 0.0.0.0:${PORT}`);
  console.log(`[Cron] Reminders scheduled daily at 08:00`);
});
