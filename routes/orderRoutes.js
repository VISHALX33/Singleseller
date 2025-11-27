/**
 * Order Routes - Order management endpoints
 */
import express from 'express';
import * as orderController from '../controllers/orderController.js';
import auth from '../middlewares/auth.js';
import { validateOrder } from '../middlewares/validation.js';

const router = express.Router();

/**
 * POST /api/orders
 * Create new order from cart
 * @access Protected
 */
router.post('/', auth, validateOrder, orderController.createOrder);

/**
 * GET /api/orders
 * Get user's orders with pagination and filtering
 * @access Protected
 * @query page, limit, status, sortBy
 */
router.get('/', auth, orderController.getOrders);

/**
 * GET /api/orders/:id
 * Get order details
 * @access Protected
 */
router.get('/:id', auth, orderController.getOrderById);

/**
 * PUT /api/orders/:id/status
 * Update order status (Admin only)
 * @access Admin
 * @body status, comment
 */
router.put('/:id/status', auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can update order status',
    });
  }
  next();
}, orderController.updateOrderStatus);

/**
 * POST /api/orders/:id/cancel
 * Cancel order
 * @access Protected (User/Admin)
 * @body reason
 */
router.post('/:id/cancel', auth, orderController.cancelOrder);

export default router;
