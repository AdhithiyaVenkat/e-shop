const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');

// Assuming each order contains products and total sales
const getSalesData = async (req, res) => {
  const storeOwnerId = req.user.id; // Assuming store owner ID is available from authentication

  try {
    // Get products owned by the store owner
    const products = await Product.find({ storeOwnerId });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this store owner' });
    }

    const productIds = products.map((product) => product._id);

    // Aggregate total products sold and total sales amount from the orders collection
    const salesData = await Order.aggregate([
      { $unwind: '$orderItems' }, // Unwind the orderItems array
      { $match: { 'orderItems.product': { $in: productIds } } }, // Match products in the store owner's catalog
      {
        $group: {
          _id: null,
          totalProductsSold: { $sum: '$orderItems.quantity' }, // Sum quantities sold
          totalSalesAmount: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } }, // Multiply price * quantity for sales amount
        },
      },
    ]);

    const totalProductsSold = salesData[0]?.totalProductsSold || 0;
    const totalSalesAmount = salesData[0]?.totalSalesAmount || 0;

    res.json({
      totalProductsSold,
      totalSalesAmount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Place an order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  const { orderItems, totalPrice } = req.body; // Assuming order details are sent in the request body
  const user = req.user.id;
  try {
    // Create a new order
    const newOrder = await Order.create({
      user,
      orderItems,
      totalPrice,
      orderId: `ORD-${Date.now()}`, // Example of generating a unique order ID
    });

    // Iterate over each order item and reduce the stock of the corresponding product
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        // Ensure there is enough stock
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
        }
      } else {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { placeOrder, getOrders, getSalesData };
