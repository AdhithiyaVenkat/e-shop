const Product = require('../models/Product');

// @desc    Get all products with optional category and filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category, search, minPrice, maxPrice } = req.query;
  
  let query = { stock: { $gt: 0 } }; // Only active products

  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  try {
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products by category
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('category', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new product (Store Owner only)
// @route   POST /api/products
// @access  Private (Store Owner)
const createProduct = async (req, res) => {
  const { name, category, description, price, stock } = req.body;
  const storeOwnerId = req.user.id;

  try {
    const product = new Product({
      name,
      category,
      description,
      price,
      stock,
      storeOwnerId
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product (Store Owner only)
// @route   PUT /api/products/:id
// @access  Private (Store Owner)
const updateProduct = async (req, res) => {
  const { name, category, description, price, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      product.name = name || product.name;
      product.category = category || product.category;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product (Store Owner only)
// @route   DELETE /api/products/:id
// @access  Private (Store Owner)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
};
