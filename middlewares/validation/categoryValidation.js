/**
 * Category Validation Middleware - Validates category data
 */
import asyncHandler from '../asyncHandler.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Validate category creation data
 */
export const validateCategoryCreate = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new ApiError(400, 'Category name is required');
  }

  if (name.length < 2) {
    throw new ApiError(400, 'Category name must be at least 2 characters');
  }

  if (name.length > 100) {
    throw new ApiError(400, 'Category name cannot exceed 100 characters');
  }

  // Check for invalid characters (only allow alphanumeric, spaces, hyphens)
  if (!/^[a-zA-Z0-9\s\-&]+$/.test(name)) {
    throw new ApiError(400, 'Category name contains invalid characters');
  }

  next();
});

/**
 * Validate category update data (all fields optional)
 */
export const validateCategoryUpdate = asyncHandler(async (req, res, next) => {
  const { name, description, isActive } = req.body;

  // Name validation (if provided)
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new ApiError(400, 'Category name cannot be empty');
    }

    if (name.length < 2) {
      throw new ApiError(400, 'Category name must be at least 2 characters');
    }

    if (name.length > 100) {
      throw new ApiError(400, 'Category name cannot exceed 100 characters');
    }

    if (!/^[a-zA-Z0-9\s\-&]+$/.test(name)) {
      throw new ApiError(400, 'Category name contains invalid characters');
    }
  }

  // Description validation (if provided)
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      throw new ApiError(400, 'Description must be a string');
    }

    if (description.length > 500) {
      throw new ApiError(400, 'Description cannot exceed 500 characters');
    }
  }

  // isActive validation (if provided)
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive must be a boolean');
  }

  next();
});
