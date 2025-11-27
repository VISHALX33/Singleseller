/**
 * Product Validation Middleware - Validates product data
 */
import asyncHandler from '../asyncHandler.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Validate product creation data
 */
export const validateProductCreate = asyncHandler(async (req, res, next) => {
  const { title, description, price, category, stock, sku } = req.body;

  // Title validation
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    throw new ApiError(400, 'Title is required and must be at least 3 characters');
  }

  if (title.length > 200) {
    throw new ApiError(400, 'Title cannot exceed 200 characters');
  }

  // Description validation
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    throw new ApiError(400, 'Description is required and must be at least 10 characters');
  }

  // Price validation
  if (price === undefined || price === null) {
    throw new ApiError(400, 'Price is required');
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum < 0) {
    throw new ApiError(400, 'Price must be a valid positive number');
  }

  // Category validation
  if (!category || category.trim().length === 0) {
    throw new ApiError(400, 'Category is required');
  }

  // Stock validation
  if (stock === undefined || stock === null) {
    throw new ApiError(400, 'Stock quantity is required');
  }

  const stockNum = parseInt(stock);
  if (isNaN(stockNum) || stockNum < 0) {
    throw new ApiError(400, 'Stock must be a valid non-negative number');
  }

  // SKU validation
  if (!sku || typeof sku !== 'string' || sku.trim().length === 0) {
    throw new ApiError(400, 'SKU is required');
  }

  if (sku.length > 50) {
    throw new ApiError(400, 'SKU cannot exceed 50 characters');
  }

  next();
});

/**
 * Validate product update data (all fields optional)
 */
export const validateProductUpdate = asyncHandler(async (req, res, next) => {
  const { title, description, price, stock } = req.body;

  // Title validation (if provided)
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 3) {
      throw new ApiError(400, 'Title must be at least 3 characters');
    }
    if (title.length > 200) {
      throw new ApiError(400, 'Title cannot exceed 200 characters');
    }
  }

  // Description validation (if provided)
  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length < 10) {
      throw new ApiError(400, 'Description must be at least 10 characters');
    }
  }

  // Price validation (if provided)
  if (price !== undefined && price !== null) {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      throw new ApiError(400, 'Price must be a valid positive number');
    }
  }

  // Stock validation (if provided)
  if (stock !== undefined && stock !== null) {
    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      throw new ApiError(400, 'Stock must be a valid non-negative number');
    }
  }

  next();
});

/**
 * Validate product search query
 */
export const validateProductSearch = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (q && typeof q === 'string') {
    if (q.length < 2) {
      throw new ApiError(400, 'Search query must be at least 2 characters');
    }
    if (q.length > 100) {
      throw new ApiError(400, 'Search query cannot exceed 100 characters');
    }
  }

  next();
});

/**
 * Validate pagination parameters
 */
export const validatePagination = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;

  if (page) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      throw new ApiError(400, 'Page must be a positive number');
    }
  }

  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new ApiError(400, 'Limit must be between 1 and 100');
    }
  }

  next();
});
