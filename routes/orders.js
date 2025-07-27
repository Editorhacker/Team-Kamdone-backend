// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Place a new order
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, supplierId, paymentMode } = req.body;

    if (!productId || !quantity || !supplierId || !paymentMode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validPaymentModes = ['Cash on Delivery', 'UPI Payment'];
    if (!validPaymentModes.includes(paymentMode)) {
      return res.status(400).json({ error: 'Invalid payment mode' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const order = new Order({ productId, quantity, supplierId, paymentMode });
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get orders by supplier
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const orders = await Order.find({ supplierId: req.params.supplierId })
      .populate('productId', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
