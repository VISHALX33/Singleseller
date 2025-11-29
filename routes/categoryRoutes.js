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
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validateCategoryCreate, validateCategoryUpdate } from '../middlewares/validation/categoryValidation.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', verifyToken, isAdmin, validateCategoryCreate, createCategory);
router.put('/:id', verifyToken, isAdmin, validateCategoryUpdate, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

// Admin stats
router.get('/stats/count', verifyToken, isAdmin, getCategoriesWithCount);
router.put('/bulk/status', verifyToken, isAdmin, bulkUpdateCategoryStatus);

export default router;
