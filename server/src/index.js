import cors from 'cors';
import express from 'express';
import { adminRouter } from '../routes/admin.js';
import { ordersRouter } from '../routes/orders.js';
import { storeRouter } from '../routes/store.js';
import { env } from '../utils/env.js';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: false
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/store', storeRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});
