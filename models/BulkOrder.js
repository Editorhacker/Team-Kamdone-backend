// backend/models/BulkOrder.js
const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [50, 'Minimum quantity is 50 kg']
  },
  price: {
    type: Number,
    required: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Supplier'
    required: true
  },
  supplierName: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
