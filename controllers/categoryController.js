/**
 * Category Controller - Handles category CRUD operations
 */
import Category from '../models/Category.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a new category
 * @route POST /api/categories
 * @access Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, image } = req.body;

  if (!name) {
    throw new ApiError(400, 'Category name is required');
  }

  // Check if category already exists
  const existingCategory = await Category.findOne({
    name: { $regex: `^${name}$`, $options: 'i' },
  });

  if (existingCategory) {
    throw new ApiError(400, 'Category with this name already exists');
  }

  // Create slug from name
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const category = new Category({
    name,
    slug,
    description: description || '',
    icon: icon || null,
    image: image || null,
  });

  await category.save();

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

/**
 * Get all categories
 * @route GET /api/categories
 * @access Public
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const { active = false } = req.query;

  const filter = {};
  if (active === 'true') {
    filter.isActive = true;
  }

  const categories = await Category.find(filter).sort('name');

  res.json({
    success: true,
    data: categories,
  });
});

/**
 * Get category by ID
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.json({
    success: true,
    data: category,
  });
});

/**
 * Get category by slug
 * @route GET /api/categories/slug/:slug
 * @access Public
 */
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.json({
    success: true,
    data: category,
  });
});

/**
 * Update category
 * @route PUT /api/categories/:id
 * @access Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, image, isActive } = req.body;

  let category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if new name already exists (if name is being changed)
  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
      _id: { $ne: req.params.id },
    });

    if (existingCategory) {
      throw new ApiError(400, 'Category with this name already exists');
    }

    category.name = name;
    // Regenerate slug
    category.slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (description !== undefined) category.description = description;
  if (icon !== undefined) category.icon = icon;
  if (image !== undefined) category.image = image;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});

/**
 * Delete category
 * @route DELETE /api/categories/:id
 * @access Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if category has products
  const Product = require('../models/Product.js').default;
  const productsCount = await Product.countDocuments({ category: req.params.id });

  if (productsCount > 0) {
    throw new ApiError(400, `Cannot delete category with ${productsCount} products. Please delete or reassign products first.`);
  }

  await Category.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Category deleted successfully',
  });
});

/**
 * Get categories with product count
 * @route GET /api/categories/stats/count
 * @access Admin
 */
export const getCategoriesWithCount = asyncHandler(async (req, res) => {
  const Product = require('../models/Product.js').default;

  const categories = await Category.find().sort('name');

  const categoriesWithCount = await Promise.all(
    categories.map(async cat => {
      const count = await Product.countDocuments({ category: cat._id, status: 'active' });
      return {
        ...cat.toObject(),
        productCount: count,
      };
    })
  );

  res.json({
    success: true,
    data: categoriesWithCount,
  });
});

/**
 * Bulk update categories status
 * @route PUT /api/categories/bulk/status
 * @access Admin
 */
export const bulkUpdateCategoryStatus = asyncHandler(async (req, res) => {
  const { categoryIds, isActive } = req.body;

  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    throw new ApiError(400, 'Category IDs array is required');
  }

  if (isActive === undefined) {
    throw new ApiError(400, 'isActive status is required');
  }

  const result = await Category.updateMany({ _id: { $in: categoryIds } }, { isActive });

  res.json({
    success: true,
    message: `${result.modifiedCount} categories updated successfully`,
    data: result,
  });
});
