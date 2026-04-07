import jwt from 'jsonwebtoken';
import { env } from './env.js';

export function signAdminToken(email) {
  return jwt.sign({ role: 'admin', email }, env.jwtSecret, { expiresIn: '12h' });
}

export function verifyAdminToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
