const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple } = require('../middlewares/uploadMiddleware');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { createProduct, getAllProducts, getProductById, getProductBySlug, updateProduct, deleteProduct, uploadProductImages } = require('../controllers/productController');
const { createProductRules, updateProductRules, searchQueryRules } = require('../middlewares/validation/productValidation');
const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array().map(e => e.msg).join(', '), 400));
  }
  next();
}

// Public listing
router.get('/', searchQueryRules, handleValidation, getAllProducts);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);

// Admin create/update/delete
router.post('/', verifyToken, isAdmin, (req, res, next) => {
  uploadSingle(req, res, function(err) {
    if (err) return next(err);
    next();
  });
}, createProductRules, handleValidation, createProduct);

router.put('/:id', verifyToken, isAdmin, (req, res, next) => {
  uploadSingle(req, res, function(err) {
    if (err) return next(err);
    next();
  });
}, updateProductRules, handleValidation, updateProduct);

router.delete('/:id', verifyToken, isAdmin, deleteProduct);

router.post('/:id/images', verifyToken, isAdmin, (req, res, next) => {
  uploadMultiple(req, res, function(err) {
    if (err) return next(err);
    next();
  });
}, uploadProductImages);

module.exports = router;
