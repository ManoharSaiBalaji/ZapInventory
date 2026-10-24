const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify that the request carries a valid JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user record (without the password hash) to the request
    req.user = await User.findById(decoded.id).select('-passwordHash');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized — user not found' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized — invalid token' });
  }
};

// Allow only admin users through
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden — admin access required' });
};

module.exports = { protect, adminOnly };

