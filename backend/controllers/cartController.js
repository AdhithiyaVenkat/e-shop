const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Product not available in desired quantity' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: [] });
    }

    const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Update quantity
      let newQuantity = cart.cartItems[itemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        newQuantity = product.stock;
      }
      cart.cartItems[itemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.cartItems.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Product not available in desired quantity' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.cartItems[itemIndex].quantity = quantity;
      } else {
        // Remove item if quantity is 0
        cart.cartItems.splice(itemIndex, 1);
      }
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { cartItems: [] });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, clearCart };
