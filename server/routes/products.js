const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// Public read; optional auth to let admin see inactive products
router.get('/', (req, res, next) => {
  // Attach user if a token is provided, but don't block unauthenticated requests
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err && decoded) {
        req.user = await User.findById(decoded.id).select('-passwordHash');
      }
      next();
    });
  } else {
    next();
  }
}, getProducts);

router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;

