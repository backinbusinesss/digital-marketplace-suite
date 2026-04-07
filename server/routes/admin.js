import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { env } from '../utils/env.js';
import {
  addInventory,
  createProduct,
  deleteProduct,
  getAdminStats,
  getOrders,
  getSettings,
  readDb,
  updateProduct,
  updateSettings
} from '../utils/db.js';
import { signAdminToken } from '../utils/token.js';

export const adminRouter = Router();

adminRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== env.adminEmail || password !== env.adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signAdminToken(email);
  return res.json({ token, admin: { email } });
});

adminRouter.use(requireAdmin);

adminRouter.get('/products', (_req, res) => {
  res.json({ products: readDb().products });
});

adminRouter.post('/products', (req, res) => {
  try {
    const product = createProduct(req.body);
    return res.status(201).json({ product });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


adminRouter.put('/products/:productId', (req, res) => {
  const product = updateProduct(req.params.productId, req.body);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ product });
});

adminRouter.delete('/products/:productId', (req, res) => {
  deleteProduct(req.params.productId);
  return res.json({ ok: true });
});

adminRouter.post('/products/:productId/inventory', (req, res) => {
  try {
    addInventory(req.params.productId, req.body);
    return res.status(201).json({ ok: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

adminRouter.get('/orders', (_req, res) => {
  res.json({ orders: getOrders() });
});

adminRouter.get('/stats', (_req, res) => {
  res.json({ stats: getAdminStats() });
});

adminRouter.get('/settings', (_req, res) => {
  res.json({ settings: getSettings() });
});

adminRouter.put('/settings', (req, res) => {
  const settings = updateSettings(req.body);
  res.json({ settings });
});
