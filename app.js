/**
 * Express App Configuration
 * Sets up middleware, routes, and error handling
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorConverter, errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// CORS - Enable cross-origin requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static files serving
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// API ROUTES
// ============================================

/**
 * Health check endpoint
 * Returns basic API information and status
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API documentation endpoint
 * Lists all available API endpoints
 */
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Single Seller Ecommerce API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      documentation: '/api',
      auth: '/api/auth',
    },
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Single Seller Ecommerce Platform',
    api: '/api',
  });
});

// ============================================
// AUTH ROUTES
// ============================================

/**
 * Authentication endpoints
 * POST   /api/auth/register - Register new user
 * POST   /api/auth/login - Login user
 * POST   /api/auth/logout - Logout user
 * GET    /api/auth/profile - Get user profile (protected)
 * PUT    /api/auth/profile - Update user profile (protected)
 * PUT    /api/auth/change-password - Change password (protected)
 */
app.use('/api/auth', authRoutes);

// ============================================
// PRODUCT ROUTES
// ============================================

/**
 * Product endpoints
 * GET    /api/products - Get all products (public, with pagination & filters)
 * GET    /api/products/:id - Get product by ID (public)
 * GET    /api/products/slug/:slug - Get product by slug (public)
 * POST   /api/products - Create product (admin only, with image upload)
 * PUT    /api/products/:id - Update product (admin only)
 * DELETE /api/products/:id - Delete product (admin only, soft delete)
 * POST   /api/products/:id/images - Upload multiple images (admin only)
 * DELETE /api/products/:id/images/:imageIndex - Delete specific image (admin only)
 * GET    /api/products/search/query - Search products (public)
 * GET    /api/products/featured - Get featured products (public)
 * GET    /api/products/category/:categoryId - Get products by category (public)
 * GET    /api/products/stats/dashboard - Get product stats (admin only)
 */
app.use('/api/products', productRoutes);

// ============================================
// CATEGORY ROUTES
// ============================================

/**
 * Category endpoints
 * GET    /api/categories - Get all categories (public)
 * GET    /api/categories/:id - Get category by ID (public)
 * GET    /api/categories/slug/:slug - Get category by slug (public)
 * POST   /api/categories - Create category (admin only)
 * PUT    /api/categories/:id - Update category (admin only)
 * DELETE /api/categories/:id - Delete category (admin only)
 * GET    /api/categories/stats/count - Get categories with product count (admin only)
 * PUT    /api/categories/bulk/status - Bulk update category status (admin only)
 */
app.use('/api/categories', categoryRoutes);

// ============================================
// CART ROUTES
// ============================================

/**
 * Shopping cart endpoints (Protected)
 * GET    /api/cart - Get user's shopping cart
 * POST   /api/cart - Add item to cart
 * PUT    /api/cart/:itemId - Update item quantity
 * DELETE /api/cart/:itemId - Remove item from cart
 * DELETE /api/cart - Clear entire cart
 */
app.use('/api/cart', cartRoutes);

// ============================================
// ORDER ROUTES
// ============================================

/**
 * Order management endpoints (Protected)
 * POST   /api/orders - Create order from cart
 * GET    /api/orders - Get user's orders (with pagination & filtering)
 * GET    /api/orders/:id - Get order details
 * PUT    /api/orders/:id/status - Update order status (admin only)
 * POST   /api/orders/:id/cancel - Cancel order
 */
app.use('/api/orders', orderRoutes);

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// Convert errors to ApiError format
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

export default app;
