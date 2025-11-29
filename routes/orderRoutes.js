/**
 * Order Routes - Order management endpoints
 */
import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * POST /api/orders
 * Create new order from cart
 * @access Protected
 */
router.post('/', verifyToken, orderController.createOrder);

/**
 * GET /api/orders
 * Get user's orders with pagination and filtering
 * @access Protected
 * @query page, limit, status, sortBy
 */
router.get('/', verifyToken, orderController.getOrders);

/**
 * GET /api/orders/:id
 * Get order details
 * @access Protected
 */
router.get('/:id', verifyToken, orderController.getOrderById);

/**
 * PUT /api/orders/:id/status
 * Update order status (Admin only)
 * @access Admin
 * @body status, comment
 */
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);

/**
 * POST /api/orders/:id/cancel
 * Cancel order
 * @access Protected (User/Admin)
 * @body reason
 */
router.post('/:id/cancel', verifyToken, orderController.cancelOrder);

export default router;
