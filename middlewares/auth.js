/**
 * Authentication Middleware
 * Verifies JWT tokens and checks user roles
 */

import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import asyncHandler from './asyncHandler.js';

/**
 * Verify JWT token and attach user to request
 * Expects Authorization header: "Bearer <token>"
 * @middleware
 */
export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'No authorization token provided. Please include "Authorization: Bearer <token>" header.');
  }

  // Extract token from header
  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token has expired. Please login again.');
    } else if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid token. Please provide a valid authorization token.');
    } else {
      throw new ApiError(401, 'Token verification failed.');
    }
  }
});

/**
 * Check if user is admin
 * Must be used after verifyToken middleware
 * @middleware
 */
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required. Please provide a valid token.');
  }

  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required. You do not have permission to access this resource.');
  }

  next();
});

export default {
  verifyToken,
  isAdmin,
};
