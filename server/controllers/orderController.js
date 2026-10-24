const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

// POST /api/orders — authenticated customers create a purchase
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'productId and quantity are required' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Lock the product document during the transaction to prevent overselling
    const product = await Product.findById(productId).session(session);
    if (!product || !product.isActive) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }

    if (product.stockQuantity < qty) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Insufficient stock. Only ${product.stockQuantity} unit(s) available.`,
      });
    }

    const previousQuantity = product.stockQuantity;
    product.stockQuantity -= qty;
    await product.save({ session });

    // Calculate total on the backend using the stored selling price
    const totalAmount = product.sellingPrice * qty;

    const [order] = await Order.create(
      [
        {
          customerId: req.user._id,
          productId: product._id,
          productNameSnapshot: product.name,
          skuSnapshot: product.sku,
          costPriceSnapshot: product.costPrice,
          quantity: qty,
          unitPrice: product.sellingPrice,
          totalAmount,
          paymentMethod: 'Cash on Delivery',
          orderStatus: 'Confirmed',
        },
      ],
      { session }
    );

    // Record the stock movement caused by this purchase
    await StockMovement.create(
      [
        {
          productId: product._id,
          productName: product.name,
          adjustmentType: 'Decrease',
          previousQuantity,
          quantityChanged: qty,
          newQuantity: product.stockQuantity,
          reason: 'Customer Purchase',
          performedBy: req.user._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/orders/my-orders — the logged-in customer's own orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('productId', 'name imageUrl category');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/orders — admin sees all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('customerId', 'name email')
      .populate('productId', 'name imageUrl');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders };

