import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import vehiclesRoutes from './routes/vehicles.routes.js';
import chargersRoutes from './routes/chargers.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import ownerRoutes from './routes/owner.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import savedChargersRoutes from './routes/savedChargers.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & utility middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mount API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/chargers', chargersRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/saved-chargers', savedChargersRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'EVCharge REST API', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`⚡ EVCharge Backend Server running on http://localhost:${PORT}`);
});
