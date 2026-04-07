import { Router } from 'express';
import { listPublishedProducts } from '../utils/db.js';

export const storeRouter = Router();

storeRouter.get('/products', (_req, res) => {
  res.json({ products: listPublishedProducts() });
});
