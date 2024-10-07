const express = require('express');
const { getCart, addToCart, updateCartItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Protected Routes
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateCartItem);
router.delete('/', protect, clearCart);

module.exports = router;
