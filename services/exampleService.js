/**
 * Example Service
 * Reusable business logic for common operations
 */

/**
 * Example service function
 * Can be used as a template for other services
 */
const exampleService = async (data) => {
  try {
    // Business logic here
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
};

module.exports = {
  exampleService,
};
