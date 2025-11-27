/**
 * Helper Utilities
 * Common utility functions used throughout the application
 */

/**
 * Generate random string of specified length
 */
const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Format price to 2 decimal places
 */
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

/**
 * Check if email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Get pagination values
 */
const getPagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

module.exports = {
  generateRandomString,
  formatPrice,
  isValidEmail,
  getPagination,
};
