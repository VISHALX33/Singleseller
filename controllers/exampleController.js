/**
 * Example Controller
 * Demonstrates basic controller structure with error handling
 */

const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * Example endpoint controller
 * Can be used as a template for creating other controllers
 */
const getExample = asyncHandler(async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Example endpoint response',
      data: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    throw new ApiError(500, 'Error processing request');
  }
});

module.exports = {
  getExample,
};
