/**
 * Auth Controller
 * Handles user authentication, registration, login, profile management
 */

import { validationResult } from 'express-validator';
import { User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middlewares/asyncHandler.js';

/**
 * Register new user
 * POST /api/auth/register
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const register = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered. Please login or use a different email.');
  }

  // Create new user
  const user = new User({
    name,
    email: email.toLowerCase(),
    password, // Will be hashed by pre-save hook
    phone: phone || null,
    role: 'customer',
  });

  await user.save();

  // Generate authentication token
  const token = user.generateAuthToken();

  // Prepare response (exclude password)
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };

  return res.status(201).json({
    success: true,
    message: 'Registration successful. Welcome to SingleSeller!',
    data: {
      user: userResponse,
      token,
    },
  });
});

/**
 * Login user
 * POST /api/auth/login
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const login = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password. Please check and try again.');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password. Please check and try again.');
  }

  // Generate authentication token
  const token = user.generateAuthToken();

  // Prepare response (exclude password)
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };

  return res.status(200).json({
    success: true,
    message: 'Login successful. Welcome back!',
    data: {
      user: userResponse,
      token,
    },
  });
});

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const logout = asyncHandler(async (req, res) => {
  // Token is managed on client-side (remove from localStorage)
  // This endpoint can be used to:
  // 1. Notify backend for logging purposes
  // 2. Add token to blacklist if implementing token revocation

  return res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove token from client storage.',
  });
});

/**
 * Get logged-in user profile
 * GET /api/auth/profile
 * Protected route - requires valid JWT
 * @param {Object} req - Express request (req.user attached by auth middleware)
 * @param {Object} res - Express response
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    addresses: user.addresses,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully.',
    data: {
      user: userResponse,
    },
  });
});

/**
 * Update user profile
 * PUT /api/auth/profile
 * Protected route - requires valid JWT
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const updateProfile = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { name, phone, avatar } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Update only allowed fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;

  await user.save();

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    addresses: user.addresses,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: {
      user: userResponse,
    },
  });
});

/**
 * Change user password
 * PUT /api/auth/change-password
 * Protected route - requires valid JWT
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const changePassword = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Verify old password
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Current password is incorrect.');
  }

  // Verify new password is different from old
  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) {
    throw new ApiError(400, 'New password must be different from current password.');
  }

  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please login with your new password.',
  });
});

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};
