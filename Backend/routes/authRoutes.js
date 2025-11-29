// Auth routes: registration, login, profile management.
const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const { validateRegister, validateLogin, validateUpdateProfile, validateChangePassword } = require('../middlewares/validation/authValidation');
const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Common validation handler
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array().map(e => e.msg).join(', '), 400));
  }
  next();
}

router.post('/register', validateRegister, handleValidation, register);
router.post('/login', validateLogin, handleValidation, login);
router.post('/logout', verifyToken, logout);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, validateUpdateProfile, handleValidation, updateProfile);
router.put('/change-password', verifyToken, validateChangePassword, handleValidation, changePassword);

module.exports = router;
