/**
 * Example Route
 * Demonstrates basic route structure with controllers
 */

const express = require('express');
const router = express.Router();
const { getExample } = require('../controllers/exampleController');

/**
 * GET /api/example
 * Example endpoint
 */
router.get('/', getExample);

module.exports = router;
