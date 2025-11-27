/**
 * Category Routes - All category-related API endpoints
 */
import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoriesWithCount,
  bulkUpdateCategoryStatus,
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateCategoryCreate, validateCategoryUpdate } from '../middlewares/validation/categoryValidation.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', authenticate, authorize('admin'), validateCategoryCreate, createCategory);
router.put('/:id', authenticate, authorize('admin'), validateCategoryUpdate, updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

// Admin stats
router.get('/stats/count', authenticate, authorize('admin'), getCategoriesWithCount);
router.put('/bulk/status', authenticate, authorize('admin'), bulkUpdateCategoryStatus);

export default router;
