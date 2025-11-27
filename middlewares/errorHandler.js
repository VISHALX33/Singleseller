/**
 * Global Error Handler Middleware
 * Catches and processes all errors in the application
 * Sends appropriate error responses to the client
 */

import ApiError from '../utils/ApiError.js';

/**
 * Convert any error to ApiError format if not already
 */
export const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

/**
 * Error handler middleware
 * Logs error and sends response to client
 */
export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  // Log error for debugging
  console.error(`[${new Date().toISOString()}] Error:`, {
    statusCode,
    message,
    stack: err.stack,
  });

  // Send error response
  res.status(statusCode).send({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default {
  errorConverter,
  errorHandler,
};
