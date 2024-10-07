const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Check for storeowner
const isStoreOwner = (req, res, next) => {
    if (req.user && req.user.role === 'store_owner') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  };

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductsByCategory);

// Protected Routes (Store Owner)
router.post('/', protect, isStoreOwner, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
