// Express-validator rules for auth endpoints.
const { body } = require('express-validator');

const passwordRule = body('password')
  .isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
  .matches(/[A-Z]/).withMessage('Password must include an uppercase letter')
  .matches(/[a-z]/).withMessage('Password must include a lowercase letter')
  .matches(/[0-9]/).withMessage('Password must include a number');

exports.validateRegister = [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  passwordRule
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.validateUpdateProfile = [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isLength({ min: 7 }).withMessage('Phone must be at least 7 digits')
];

exports.validateChangePassword = [
  body('oldPassword').notEmpty().withMessage('Old password required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 chars')
    .matches(/[A-Z]/).withMessage('New password must include an uppercase letter')
    .matches(/[a-z]/).withMessage('New password must include a lowercase letter')
    .matches(/[0-9]/).withMessage('New password must include a number')
];
