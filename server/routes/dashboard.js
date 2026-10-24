const express = require('express');
const router = express.Router();
const { getStats, getRecentOrders, getLowStock } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getStats);
router.get('/recent-orders', protect, adminOnly, getRecentOrders);
router.get('/low-stock', protect, adminOnly, getLowStock);

module.exports = router;

