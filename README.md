# Digital Marketplace Suite

A premium full-stack marketplace starter for lawful digital products you control, with:

- premium storefront UI
- English as default language
- Italian storefront translation toggle
- admin login and dashboard
- product builder
- encrypted inventory storage
- simulated crypto checkout flow
- auto-delivery after payment confirmation
- help center inside the dashboard

## Important scope

This starter is designed for lawful digital goods, access packages, internal handles, redeemables, licenses, and credentials for services you own or are authorized to distribute.

## Stack

- React + TypeScript + Vite
- Express.js backend
- JSON file persistence for quick setup
- AES-256-GCM encrypted inventory fields

## Quick start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure the server

Copy the example env file:

```bash
cp server/.env.example server/.env
```

Edit these values:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `DATA_ENCRYPTION_KEY`
- `CLIENT_ORIGIN`

`DATA_ENCRYPTION_KEY` must be a 64-character hex string.

You can generate one with Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3) Run in development

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

### 4) Demo admin login

Default credentials are controlled by `server/.env`.

Example defaults from `.env.example`:

- email: `admin@marketplace.local`
- password: `ChangeThisNow!123`

## Dashboard sections

- **Overview**: revenue, orders, low stock, quick status
- **Products**: create, edit, publish, feature, hide
- **Inventory**: add encrypted delivery records tied to products
- **Orders**: inspect orders and delivery states
- **Settings**: brand text, support contact, payment methods
- **Help**: operational guide for anyone you authorize

## How auto-delivery works

1. Create a product.
2. Add one or more inventory records.
3. Customer places an order and chooses a crypto method.
4. Payment is confirmed through the demo confirmation flow.
5. One encrypted inventory record is assigned and delivered to the order.
6. The assigned record is marked as delivered and removed from available stock.

## What you still need to add

For production use, replace the demo flow with:

- real crypto gateway or wallet monitoring
- production database such as PostgreSQL
- HTTPS reverse proxy
- email delivery provider
- stronger secrets management
- optional 2FA for admin access
- audit log persistence

## Production notes

Before going live, you should:

- move secrets out of local files into a secret manager
- use a production database instead of JSON storage
- put the admin on a separate subdomain
- enable rate limiting behind a reverse proxy
- add 2FA to admin login
- add backups and alerting

