/**
 * Authentication Validation Rules
 * Uses express-validator for input validation
 */

import { body, validationResult } from 'express-validator';

/**
 * Password strength validation regex
 * At least 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Phone number validation regex
 * Indian phone format (10 digits, starts with 6-9)
 */
const phoneRegex = /^[6-9]\d{9}$/;

/**
 * Validation rules for user registration
 */
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must not exceed 100 characters'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .isLength({ max: 50 })
    .withMessage('Password must not exceed 50 characters')
    .matches(passwordRegex)
    .withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(phoneRegex)
    .withMessage('Please provide a valid 10-digit Indian phone number (starting with 6-9)'),
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * Validation rules for updating user profile
 */
export const validateUpdateProfile = [
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(phoneRegex)
    .withMessage('Please provide a valid 10-digit Indian phone number (starting with 6-9)'),

  body('avatar')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
];

/**
 * Validation rules for changing password
 */
export const validateChangePassword = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isLength({ min: 6 })
    .withMessage('Current password is invalid'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .isLength({ max: 50 })
    .withMessage('New password must not exceed 50 characters')
    .matches(passwordRegex)
    .withMessage('New password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
    .withMessage('New password and confirm password must match'),
];

export default {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
};
