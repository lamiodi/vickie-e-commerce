import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import checkoutRoutes from './routes/checkout.js';
import webhookRoutes from './routes/webhooks.js';
import notificationsRoutes from './routes/notifications.js';
import mediaRoutes from './routes/media.js';
import exchangeRoutes from './routes/exchange.js';
import newsletterRoutes from './routes/newsletter.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import indexRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimit.js';

const app = express();

app.use(globalLimiter); // Apply global rate limiter
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api', indexRoutes);
const openapi = fs.readFileSync(path.join(process.cwd(), 'openapi.yaml'), 'utf8');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/api/openapi' }));
app.get('/api/openapi', (_, res) => res.type('text/yaml').send(openapi));
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/uptime', (_, res) => res.status(200).send('OK'));

// Global Error Handler
app.use(errorHandler);

export default app;
