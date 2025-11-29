// Centralized Express error handling middleware.
// Ensures consistent JSON error responses.
// Must be defined with four params to be recognized by Express.
const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  // If error not an ApiError, wrap it to avoid leaking internals
  let error = err instanceof ApiError ? err : new ApiError(err.message || 'Internal Server Error', err.statusCode || 500, false);

  // Basic payload; could be extended with request id / trace id
  const response = {
    success: false,
    message: error.message,
    statusCode: error.statusCode
  };

  // In non-production, include stack for easier debugging
  if (process.env.NODE_ENV !== 'production') {
    response.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
}

module.exports = errorHandler;
