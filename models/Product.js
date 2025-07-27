const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
   supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming suppliers are stored in the 'User' model
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
