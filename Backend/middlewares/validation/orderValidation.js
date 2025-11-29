const { body } = require('express-validator');

exports.createOrderValidation = [
  body('shippingAddress.name').notEmpty().withMessage('Name required'),
  body('shippingAddress.street').notEmpty().withMessage('Street required'),
  body('shippingAddress.city').notEmpty().withMessage('City required'),
  body('shippingAddress.state').notEmpty().withMessage('State required'),
  body('shippingAddress.pincode').notEmpty().withMessage('Pincode required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone required'),
  body('paymentMethod').isIn(['cod','razorpay']).withMessage('Invalid payment method')
];

exports.updateOrderStatusValidation = [
  body('orderStatus').isIn(['placed','confirmed','packed','shipped','delivered','cancelled']).withMessage('Invalid status')
];
