// Health check route to verify server is running.
const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/healthController');

router.get('/', getHealth);

module.exports = router;
