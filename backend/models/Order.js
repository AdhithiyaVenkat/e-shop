const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  // Add other fields like shipping address, payment status, etc.
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
