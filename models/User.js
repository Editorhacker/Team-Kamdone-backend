const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['vendor', 'supplier'], required: true },
  name: String,
  business_name: String,
  email: String,
  phone: String,
  password: String,
  pincode: String
});

module.exports = mongoose.model('User', userSchema);
