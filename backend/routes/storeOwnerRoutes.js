const express = require('express');
const { getSalesData } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Protected Routes
router.get('/sales_data', protect, getSalesData);

module.exports = router;
