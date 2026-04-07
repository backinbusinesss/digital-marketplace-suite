import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import { decryptPayload, encryptPayload } from './crypto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runtimePath = path.join(__dirname, '..', 'data', 'runtime-db.json');
const seedPath = path.join(__dirname, '..', 'data', 'seed-db.json');

function seedInventoryRecords(seed) {
  const defaults = {
    inv_1: {
      accessId: 'aurora-access-01',
      secret: 'Aurora!Secure!01',
      email: 'aurora01@nova.local',
      emailSecret: 'Mail!Aurora!01',
      note: 'Primary release record.'
    },
    inv_2: {
      accessId: 'aurora-access-02',
      secret: 'Aurora!Secure!02',
      email: 'aurora02@nova.local',
      emailSecret: 'Mail!Aurora!02',
      note: 'Backup premium release record.'
    },
    inv_3: {
      accessId: 'bacio-release-01',
      secret: 'Bacio!Secure!01',
      email: 'bacio01@nova.local',
      emailSecret: 'Mail!Bacio!01',
      note: 'Italian premium package record.'
    },
    inv_4: {
      accessId: 'stellar-release-01',
      secret: 'Stellar!Link!01',
      email: 'stellar01@nova.local',
      emailSecret: 'Mail!Stellar!01',
      note: 'Messaging vanity release.'
    },
    inv_5: {
      accessId: 'stellar-release-02',
      secret: 'Stellar!Link!02',
      email: 'stellar02@nova.local',
      emailSecret: 'Mail!Stellar!02',
      note: 'Messaging vanity reserve.'
    },
    inv_6: {
      accessId: 'stellar-release-03',
      secret: 'Stellar!Link!03',
      email: 'stellar03@nova.local',
      emailSecret: 'Mail!Stellar!03',
      note: 'Messaging vanity reserve.'
    }
  };

  seed.inventory = seed.inventory.map((record) => ({
    ...record,
    encryptedPayload: encryptPayload(defaults[record.id])
  }));

  return seed;
}

function ensureRuntimeDb() {
  if (!fs.existsSync(runtimePath)) {
    const seeded = seedInventoryRecords(JSON.parse(fs.readFileSync(seedPath, 'utf8')));
    fs.writeFileSync(runtimePath, JSON.stringify(seeded, null, 2));
  }
}

export function readDb() {
  ensureRuntimeDb();
  return JSON.parse(fs.readFileSync(runtimePath, 'utf8'));
}

export function writeDb(data) {
  fs.writeFileSync(runtimePath, JSON.stringify(data, null, 2));
}

export function listPublishedProducts() {
  const db = readDb();
  return db.products.filter((product) => product.status === 'published');
}

export function getAdminStats() {
  const db = readDb();
  const totalRevenueUsd = db.orders
    .filter((order) => order.status === 'paid' || order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalUsd, 0);

  return {
    totalRevenueUsd,
    totalOrders: db.orders.length,
    paidOrders: db.orders.filter((order) => order.status === 'paid' || order.status === 'delivered').length,
    lowStockProducts: db.products.filter((product) => product.stockAvailable <= 2).length
  };
}

export function createProduct(payload) {
  const db = readDb();
  const product = {
    id: nanoid(12),
    title: payload.title,
    platform: payload.platform,
    category: payload.category,
    rarity: payload.rarity,
    meaningLanguage: payload.meaningLanguage,
    priceUsd: Number(payload.priceUsd || 0),
    featured: Boolean(payload.featured),
    status: payload.status || 'draft',
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    shortDescription: payload.shortDescription || '',
    deliveryDescription: payload.deliveryDescription || '',
    previewDetails: Array.isArray(payload.previewDetails) ? payload.previewDetails : [],
    stockAvailable: 0,
    createdAt: new Date().toISOString()
  };

  db.products.unshift(product);
  writeDb(db);
  return product;
}

export function updateProduct(productId, payload) {
  const db = readDb();
  const product = db.products.find((item) => item.id === productId);
  if (!product) return null;

  Object.assign(product, payload);
  writeDb(db);
  return product;
}

export function deleteProduct(productId) {
  const db = readDb();
  db.products = db.products.filter((product) => product.id !== productId);
  db.inventory = db.inventory.filter((record) => record.productId !== productId || record.used);
  writeDb(db);
  return true;
}

export function addInventory(productId, payload) {
  const db = readDb();
  const product = db.products.find((item) => item.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }

  db.inventory.push({
    id: nanoid(12),
    productId,
    encryptedPayload: encryptPayload(payload),
    used: false,
    createdAt: new Date().toISOString()
  });

  product.stockAvailable += 1;
  writeDb(db);
  return true;
}

export function createOrder({ customerEmail, productId, paymentMethod }) {
  const db = readDb();
  const product = db.products.find((item) => item.id === productId && item.status === 'published');
  if (!product) {
    throw new Error('Product not found');
  }

  if (product.stockAvailable <= 0) {
    throw new Error('This product is out of stock');
  }

  const order = {
    id: nanoid(12),
    publicId: nanoid(8).toUpperCase(),
    customerEmail,
    productId,
    productTitle: product.title,
    paymentMethod,
    totalUsd: product.priceUsd,
    status: 'awaiting_payment',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(order);
  writeDb(db);
  return order;
}

export function confirmPayment(orderId) {
  const db = readDb();
  const order = db.orders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status === 'delivered') {
    return order;
  }

  const product = db.products.find((item) => item.id === order.productId);
  if (!product) {
    throw new Error('Product missing');
  }

  const record = db.inventory.find((item) => item.productId === order.productId && !item.used);
  if (!record) {
    throw new Error('No inventory available for delivery');
  }

  record.used = true;
  product.stockAvailable = Math.max(0, product.stockAvailable - 1);
  order.status = 'delivered';
  order.deliveredAt = new Date().toISOString();
  order.delivery = decryptPayload(record.encryptedPayload);
  writeDb(db);
  return order;
}

export function getOrders() {
  return readDb().orders;
}

export function getSettings() {
  return readDb().settings;
}

export function updateSettings(nextSettings) {
  const db = readDb();
  db.settings = nextSettings;
  writeDb(db);
  return db.settings;
}
