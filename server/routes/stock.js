const express = require('express');
const router = express.Router();
const { adjustStock, getStockMovements } = require('../controllers/stockController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/adjust', protect, adminOnly, adjustStock);
router.get('/movements', protect, adminOnly, getStockMovements);

module.exports = router;

