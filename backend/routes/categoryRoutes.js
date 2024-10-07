const express = require('express');
const { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all categories
router.get('/', getCategories);

// GET a single category by ID
router.get('/:id', getCategoryById);

// POST create a new category
router.post('/', protect, createCategory);

// PUT update a category by ID
router.put('/:id', protect, updateCategory);

// DELETE a category by ID
router.delete('/:id', protect, deleteCategory);

module.exports = router;
