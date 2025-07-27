const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
// ✅ Create new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// ✅ Update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ✅ Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;

router.get('/supplier/:id/products', async (req, res) => {
  const supplierId = req.params.id;

  try {
    // 1. Find products with matching supplierId
    const products = await Product.find({ supplierId });

    // 2. Get supplier name (optional)
    const supplier = await User.findById(supplierId);
    const supplierName = supplier ? supplier.business_name || supplier.name : 'Unknown Supplier';

    res.json({ products, supplierName });
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    res.status(500).json({ error: 'Failed to fetch supplier products' });
  }
});