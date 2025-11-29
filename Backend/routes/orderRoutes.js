const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { createOrderValidation, updateOrderStatusValidation } = require('../middlewares/validation/orderValidation');
const { validationResult } = require('express-validator');
const orderController = require('../controllers/orderController');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

router.use(verifyToken);

router.post('/', createOrderValidation, handleValidation, orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', updateOrderStatusValidation, handleValidation, orderController.updateOrderStatus);
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
