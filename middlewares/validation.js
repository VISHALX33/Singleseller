/**
 * Validation Middleware
 * Input validation using express-validator
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Validators for common fields
 */
const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email');

const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

const validateName = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required');

/**
 * Cart item validation
 */
const validateCartItem = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 999 })
    .withMessage('Quantity must be between 1 and 999'),
  handleValidationErrors,
];

/**
 * Order validation
 */
const validateOrder = [
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.fullName')
    .notEmpty()
    .withMessage('Full name is required'),
  body('shippingAddress.phone')
    .notEmpty()
    .matches(/^[0-9]{10}$/)
    .withMessage('Valid 10-digit phone number is required'),
  body('shippingAddress.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('shippingAddress.addressLine1')
    .notEmpty()
    .withMessage('Address is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.postalCode')
    .notEmpty()
    .matches(/^[0-9]{6}$/)
    .withMessage('Valid 6-digit postal code is required'),
  body('paymentMethod')
    .notEmpty()
    .isIn(['card', 'upi', 'netbanking', 'wallet', 'cod'])
    .withMessage('Valid payment method is required'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateEmail,
  validatePassword,
  validateName,
  validateCartItem,
  validateOrder,
};
