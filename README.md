# Vickie Ecom – Production-Ready E-Commerce Platform

> React + Express + Supabase + Stripe + SendGrid – optimized for waist trainers, joggers, gymwear and any future categories.

## ✅ Production Checklist

| Item | Status |
|------|--------|
| ✅ Secure auth (JWT, Argon2, email verify, reset) | Done |
| ✅ Flexible catalog (JSONB attributes, categories) | Done |
| ✅ Inventory tracking (stock per variant) | Done |
| ✅ Cart + Stripe checkout (Elements, webhooks) | Done |
| ✅ Order lifecycle emails (confirmation, processing, shipped, delivered) | Done |
| ✅ Admin CRUD (products, variants, orders, statuses) | Done |
| ✅ Customer dashboard (orders, tracking, notifications) | Done |
| ✅ SEO (dynamic meta, Helmet) | Done |
| ✅ Rate limits, Helmet, parameterized SQL | Done |
| ✅ OpenAPI + Swagger UI | Done |
| ✅ Unit tests (auth, products, webhooks) | Done |
| ✅ Deployment configs (Render, Railway, Vercel) | Done |
| ✅ CI workflow (GitHub Actions) | Done |
| ✅ Inventory sync on checkout (stock decrement) | Done |

## 🚀 Quick Start (Local)

1. **Supabase** – create project, enable pooler, copy `DATABASE_URL`.
2. **Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # fill DATABASE_URL, JWT secrets, Stripe, SendGrid
   npm install
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   # set VITE_API_BASE_URL=http://localhost:4000/api
   npm install
   npm run dev
   ```
4. **Database** – run `supabase/schema.sql` in Supabase SQL editor.
5. **Stripe** – set webhook endpoint to `https://your-host/api/webhooks/stripe` and copy `STRIPE_WEBHOOK_SECRET`.

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind + Zustand (cart) + React Query + Stripe.js
- **Backend**: Node.js + Express + PostgreSQL (Supabase) + JWT + Argon2 + SendGrid
- **Payments**: Stripe PaymentIntent + webhooks
- **Emails**: Handlebars templates (order confirmation, processing, shipped, delivered)
- **Inventory**: stock per variant, decremented on successful checkout inside transaction

## 📦 Database Schema

```sql
users(id, email, password_hash, is_verified, name, verify_token, reset_token, created_at)
products(id, name, description, category, price, attributes JSONB, created_at)
product_variants(id, product_id, size, color, stock, images JSONB)
orders(id, user_id, stripe_payment_id, total_amount, status, tracking_code, created_at)
order_items(id, order_id, variant_id, qty, price)
notifications(id, user_id, order_id, type, message, sent_at)
```

> JSONB fields allow new product types without migrations.

## 🔐 Security

- Argon2 password hashing
- JWT access (short) + refresh (httpOnly cookie)
- Helmet headers, CORS, rate limits on auth/checkout
- Stripe webhook signature verification
- Parameterized SQL (no injection)
- SSL via Supabase pooler

## 📋 API Summary

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Email registration |
| `POST /api/auth/login` | Login (returns access token) |
| `POST /api/auth/verify` | Email verification |
| `POST /api/auth/refresh` | Refresh access token |
| `POST /api/auth/forgot` | Password reset email |
| `POST /api/auth/reset` | Reset password |
| `GET /api/products` | List with filters, sort, pagination |
| `GET /api/products/:id` | Product detail with variants |
| `POST /api/checkout/create-payment-intent` | Create Stripe PaymentIntent |
| `POST /api/checkout/finalize` | Create order + decrement stock |
| `GET /api/orders/mine` | User orders |
| `GET /api/orders/:id` | Order detail + items |
| `PATCH /api/admin/orders/:id/status` | Update status + email + log |
| `POST /api/admin/products` | Create product |
| `POST /api/admin/products/:id/variants` | Add variant |
| `POST /api/webhooks/stripe` | Stripe events |
| `GET /api/notifications/order/:id` | Order notification history |

OpenAPI spec at `/api/openapi` – Swagger UI at `/api/docs`

## 📬 Email Templates

Located in `backend/emails/templates/`:
- `order_confirmation.hbs` – after payment
- `order_processing.hbs` – warehouse confirmed
- `order_shipped.hbs` – with tracking link
- `order_delivered.hbs` – final confirmation

## 🛠️ Deployment

### Render (backend)
- Connect repo, pick `render.yaml`, set env vars from dashboard.

### Railway
- Connect repo, pick `railway.yaml`, add secrets.

### Vercel (frontend + API)
- Push repo, Vercel auto-detects `vercel.json`.
- Add env vars in dashboard.

### Supabase Functions (backend)
- Deploy `backend` folder as Node.js function; set env vars.

## 🧪 Testing

```bash
cd backend
npm run test
```

Tests cover auth health, products filtering, webhook signature rejection.

## 📈 Extending

- **New category**: insert product with new `category` and keys in `attributes` JSONB.
- **Coupons**: add `coupons` table, apply during checkout.
- **Reviews**: add `reviews` table, UI on product page.
- **Analytics**: aggregate orders, users, revenue.
- **Courier API**: populate `tracking_code`, update status via webhook.

## 📄 License

Private – built for Vickie Ecom under \$10k budget.

## ✋ Support

For issues, check logs, webhook events, and notification logs in DB.