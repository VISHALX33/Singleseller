const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array().map(e => e.msg).join(', '), 400));
  }
  next();
}

router.get('/', getCategories);
router.post('/', verifyToken, isAdmin, [body('name').notEmpty().withMessage('Name is required')], handleValidation, createCategory);
router.put('/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

module.exports = router;
