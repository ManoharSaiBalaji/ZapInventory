const mongoose = require('mongoose');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

// POST /api/stock/adjust — admin only
const adjustStock = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, adjustmentType, quantity, reason } = req.body;

    if (!productId || !adjustmentType || !quantity || !reason) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'productId, adjustmentType, quantity, and reason are required' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Product not found' });
    }

    const previousQuantity = product.stockQuantity;
    let newQuantity;

    if (adjustmentType === 'Increase') {
      newQuantity = previousQuantity + qty;
    } else if (adjustmentType === 'Decrease') {
      newQuantity = previousQuantity - qty;
      if (newQuantity < 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Cannot decrease by ${qty}. Only ${previousQuantity} units available.`,
        });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'adjustmentType must be Increase or Decrease' });
    }

    product.stockQuantity = newQuantity;
    await product.save({ session });

    // Record the movement
    await StockMovement.create(
      [
        {
          productId: product._id,
          productName: product.name,
          adjustmentType,
          previousQuantity,
          quantityChanged: qty,
          newQuantity,
          reason,
          performedBy: req.user._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Stock updated successfully', product });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/stock/movements — admin only
const getStockMovements = async (req, res) => {
  try {
    const movements = await StockMovement.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('performedBy', 'name email');
    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { adjustStock, getStockMovements };

