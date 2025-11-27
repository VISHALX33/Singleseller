/**
 * Authentication Routes
 * Handles user registration, login, and profile management
 */

import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} from '../middlewares/validation/authValidation.js';

const router = express.Router();

/**
 * Public Routes
 */

/**
 * Register new user
 * POST /api/auth/register
 * Body: { name, email, password, phone? }
 */
router.post('/register', validateRegister, authController.register);

/**
 * Login user
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', validateLogin, authController.login);

/**
 * Logout user
 * POST /api/auth/logout
 */
router.post('/logout', authController.logout);

/**
 * Protected Routes (require valid JWT)
 */

/**
 * Get logged-in user profile
 * GET /api/auth/profile
 * Headers: { Authorization: "Bearer <token>" }
 */
router.get('/profile', verifyToken, authController.getProfile);

/**
 * Update user profile
 * PUT /api/auth/profile
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { name?, phone?, avatar? }
 */
router.put('/profile', verifyToken, validateUpdateProfile, authController.updateProfile);

/**
 * Change user password
 * PUT /api/auth/change-password
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { oldPassword, newPassword, confirmPassword }
 */
router.put('/change-password', verifyToken, validateChangePassword, authController.changePassword);

export default router;
