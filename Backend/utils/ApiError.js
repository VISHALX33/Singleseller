// Custom API Error class to standardize error handling across the app.
// Includes HTTP status code and optional operational flag.
class ApiError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Distinguish expected vs programming errors
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
