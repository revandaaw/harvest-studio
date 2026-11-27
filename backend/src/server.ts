import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import settingRoutes from './routes/setting.routes.js';
import categoryRoutes from './routes/category.routes.js';
import packageRoutes from './routes/package.routes.js';
import addonRoutes from './routes/addon.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import editPrintRoutes from './routes/edit-print.routes.js';
import quotationRoutes from './routes/quotation.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/addons', addonRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/edit-print', editPrintRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Harvest Studio API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[HARVEST STUDIO SERVER] Running on http://localhost:${PORT}`);
});
