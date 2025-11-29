const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const { validationResult } = require('express-validator');

exports.createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(errors.array().map(e => e.msg).join(', '), 400));
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ level: 1, name: 1 });
    res.json({ success: true, categories });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ApiError('Category not found', 404));
    Object.assign(category, req.body);
    await category.save();
    res.json({ success: true, category });
  } catch (err) { next(new ApiError(err.message, 500)); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ApiError('Category not found', 404));
    category.isActive = false;
    await category.save();
    res.json({ success: true, message: 'Category deactivated' });
  } catch (err) { next(new ApiError(err.message, 500)); }
};
