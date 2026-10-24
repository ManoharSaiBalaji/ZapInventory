const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const orderSchema = new mongoose.Schema(
  {
    // Human-readable order identifier
    orderId: {
      type: String,
      unique: true,
      default: () => 'ORD-' + nanoid(8).toUpperCase(),
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Snapshots keep the order understandable even if the product is later edited
    productNameSnapshot: { type: String, required: true },
    skuSnapshot: { type: String, required: true },
    costPriceSnapshot: { type: Number, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
    },
    orderStatus: {
      type: String,
      enum: ['Confirmed', 'Processing', 'Completed', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

