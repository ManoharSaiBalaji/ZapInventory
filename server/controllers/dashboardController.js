const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const activeProducts = await Product.find({ isActive: true });

    const totalProducts = activeProducts.length;
    const totalStock = activeProducts.reduce((sum, p) => sum + p.stockQuantity, 0);
    const outOfStock = activeProducts.filter((p) => p.stockQuantity === 0).length;
    const lowStock = activeProducts.filter(
      (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
    ).length;

    res.json({ totalProducts, totalStock, lowStock, outOfStock });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/dashboard/recent-orders
const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customerId', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/dashboard/low-stock
const getLowStock = async (req, res) => {
  try {
    // Find products where stock is at or below their threshold (including 0)
    const products = await Product.find({
      isActive: true,
      $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] },
    }).sort({ stockQuantity: 1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getStats, getRecentOrders, getLowStock };

