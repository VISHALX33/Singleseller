// Auth middleware: verifies JWT and attaches user; provides admin guard.
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError('Authorization token missing', 401));
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new ApiError('User not found', 401));
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError('Token expired', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new ApiError('Invalid token', 401));
    }
    next(new ApiError(err.message, 500));
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user) return next(new ApiError('Not authenticated', 401));
  if (req.user.role !== 'admin') return next(new ApiError('Forbidden: Admins only', 403));
  next();
};
