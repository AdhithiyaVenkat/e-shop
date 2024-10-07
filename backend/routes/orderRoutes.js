const express = require('express');
const { placeOrder, getOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Protected Routes
router.post('/', protect, placeOrder);
router.get('/', protect, getOrders);

module.exports = router;
