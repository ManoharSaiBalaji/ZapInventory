const mongoose = require('mongoose');

// Records every stock change for audit purposes
const stockMovementSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: { type: String, required: true },
    adjustmentType: {
      type: String,
      enum: ['Increase', 'Decrease'],
      required: true,
    },
    previousQuantity: { type: Number, required: true },
    quantityChanged: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    reason: {
      type: String,
      enum: [
        'New Stock Received',
        'Stock Correction',
        'Damaged Items',
        'Returned Items',
        'Customer Purchase',
        'Other',
      ],
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockMovement', stockMovementSchema);

