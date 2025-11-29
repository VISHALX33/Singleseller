// Express application configuration.
// Sets up middleware, static assets, JSON parsing, routes and error handling.
const path = require('path');
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const ApiError = require('./utils/ApiError');

// Routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// CORS configuration (adjust origin whitelist as needed)
app.use(cors({ origin: '*', credentials: true }));

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static public assets
app.use('/public', express.static(path.join(__dirname, 'public')));
// Serve uploaded files securely (consider auth for protected assets)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler for unmatched routes
app.all('*', (req, res, next) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
});

// Central error handler
app.use(errorHandler);

module.exports = app;
