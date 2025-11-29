const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { getStats } = require('../controllers/adminController');

router.use(verifyToken, isAdmin);

router.get('/stats', getStats);

module.exports = router;
