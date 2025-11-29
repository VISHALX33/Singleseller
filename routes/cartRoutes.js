/**
 * Cart Routes - Shopping cart endpoints
 * All routes are protected (require authentication)
 */
import express from 'express';
import * as cartController from '../controllers/cartController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Protect all cart routes
router.use(verifyToken);

/**
 * GET /api/cart
 * Get user's shopping cart
 */
router.get('/', cartController.getCart);

/**
 * POST /api/cart
 * Add item to cart
 * Body: { productId, quantity }
 */
router.post('/', cartController.addToCart);

/**
 * PUT /api/cart/:itemId
 * Update item quantity in cart
 * Body: { quantity }
 */
router.put('/:itemId', cartController.updateCartItem);

/**
 * DELETE /api/cart/:itemId
 * Remove item from cart
 */
router.delete('/:itemId', cartController.removeFromCart);

/**
 * DELETE /api/cart
 * Clear entire cart
 */
router.delete('/', cartController.clearCart);

export default router;
