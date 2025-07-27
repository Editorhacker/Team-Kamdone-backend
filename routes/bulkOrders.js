const express = require('express');
const router = express.Router();
const BulkOrder = require('../models/BulkOrder');
const User = require('../models/User'); // ✅ ADD THIS LINE

router.post('/', async (req, res) => {
  try {
    const { supplierId, productName, quantity, price } = req.body;

    if (!supplierId || !productName || !quantity || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (quantity < 50) {
      return res.status(400).json({ message: 'Minimum quantity is 50 kg' });
    }

    const supplier = await User.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    console.log('Supplier:', supplier); // 👈 log this to double-check field names

    const newOrder = new BulkOrder({
  supplierId,
  supplierName: supplier.business_name, // ✅ fixed
  pincode: supplier.pincode,
  productName,
  quantity,
  price
});


    await newOrder.save();

    res.status(201).json({ message: 'Bulk order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating bulk order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Fetch all bulk orders
// GET: Fetch all bulk orders
router.get('/', async (req, res) => {
  try {
    const orders = await BulkOrder.find().sort({ createdAt: -1 }); // optional: latest first
    const enrichedOrders = orders.map(order => ({
      _id: order._id,
      productName: order.productName,
      quantity: order.quantity,
      price: order.price,
      supplierName: order.supplierName,
      pincode: order.pincode,
      createdAt: order.createdAt
    }));
    res.json(enrichedOrders);
  } catch (err) {
    console.error('Error fetching bulk orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// (Optional) GET: Fetch bulk orders for a supplier
router.get('/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;
    const orders = await BulkOrder.find({ supplierId });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching bulk orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await BulkOrder.findByIdAndUpdate(
      req.params.id,
      {
        productName: req.body.productName,
        quantity: req.body.quantity,
        price: req.body.price,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Bulk order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating bulk order' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await BulkOrder.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Bulk order not found' });
    }
    res.status(200).json({ message: 'Bulk order deleted' });
  } catch (err) {
    console.error('Error deleting bulk order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


