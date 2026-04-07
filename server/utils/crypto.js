import crypto from 'crypto';
import { env } from './env.js';

const key = Buffer.from(env.encryptionKeyHex, 'hex');

if (key.length !== 32) {
  throw new Error('DATA_ENCRYPTION_KEY must be exactly 32 bytes encoded as 64 hex characters.');
}

export function encryptPayload(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decryptPayload(encoded) {
  const buffer = Buffer.from(encoded, 'base64');
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const data = buffer.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  return JSON.parse(decrypted);
}
