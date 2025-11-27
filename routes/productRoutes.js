/**
 * Product Routes - All product-related API endpoints
 */
import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getProductStats,
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { uploadProductMiddleware } from '../middlewares/uploadMiddleware.js';
import { validateProductCreate, validateProductUpdate } from '../middlewares/validation/productValidation.js';

const router = express.Router();

// Public routes
router.get('/search/query', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Admin routes - require authentication and admin role
router.post('/', authenticate, authorize('admin'), uploadProductMiddleware.array('images', 5), validateProductCreate, createProduct);
router.put('/:id', authenticate, authorize('admin'), uploadProductMiddleware.array('images', 5), validateProductUpdate, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

// Image management routes
router.post('/:id/images', authenticate, authorize('admin'), uploadProductMiddleware.array('images', 5), uploadProductImages);
router.delete('/:id/images/:imageIndex', authenticate, authorize('admin'), deleteProductImage);

// Admin stats
router.get('/stats/dashboard', authenticate, authorize('admin'), getProductStats);

export default router;
