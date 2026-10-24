const Product = require('../models/Product');

// GET /api/products — public; customers see only active products
const getProducts = async (req, res) => {
  try {
    const filter = {};

    // Customers can only see active products; admins see everything
    if (!req.user || req.user.role !== 'admin') {
      filter.isActive = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/products — admin only
const createProduct = async (req, res) => {
  try {
    const {
      name, sku, brand, category, description,
      sellingPrice, costPrice, stockQuantity,
      lowStockThreshold, imageUrl,
    } = req.body;

    if (!name || !sku || !brand || !category || sellingPrice == null || costPrice == null) {
      return res.status(400).json({ message: 'Name, SKU, brand, category, selling price, and cost price are required' });
    }

    const product = await Product.create({
      name, sku, brand, category, description,
      sellingPrice, costPrice,
      stockQuantity: stockQuantity ?? 0,
      lowStockThreshold: lowStockThreshold ?? 5,
      imageUrl,
    });

    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'SKU already exists. Use a unique SKU.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/products/:id — admin only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = [
      'name', 'sku', 'brand', 'category', 'description',
      'sellingPrice', 'costPrice', 'stockQuantity',
      'lowStockThreshold', 'imageUrl', 'isActive',
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });

    await product.save();
    res.json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'SKU already exists. Use a unique SKU.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/products/:id — admin only
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

