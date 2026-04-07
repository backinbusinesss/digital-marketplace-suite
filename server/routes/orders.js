import { Router } from 'express';
import { confirmPayment, createOrder } from '../utils/db.js';

export const ordersRouter = Router();

ordersRouter.post('/create', (req, res) => {
  try {
    const { customerEmail, productId, paymentMethod } = req.body;
    if (!customerEmail || !productId || !paymentMethod) {
      return res.status(400).json({ error: 'customerEmail, productId, and paymentMethod are required' });
    }

    const order = createOrder({ customerEmail, productId, paymentMethod });
    return res.status(201).json({ order });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

ordersRouter.post('/:orderId/simulate-payment', (req, res) => {
  try {
    const order = confirmPayment(req.params.orderId);
    return res.json({ order });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
