const { body, query } = require('express-validator');

exports.createProductRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('mrp').isFloat({ gt: 0 }).withMessage('MRP must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be >= 0'),
  body('category').optional().isMongoId().withMessage('Invalid category id')
];

exports.updateProductRules = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be positive'),
  body('mrp').optional().isFloat({ gt: 0 }).withMessage('MRP must be positive'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be >= 0'),
  body('status').optional().isIn(['active', 'inactive', 'out_of_stock']).withMessage('Invalid status')
];

exports.searchQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be >= 0'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be >= 0')
];
