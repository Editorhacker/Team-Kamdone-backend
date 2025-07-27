const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs'); // ✅ Import bcrypt

router.post('/signup', async (req, res) => {
  const { business_name, email, phone, password, pincode } = req.body;
  try {
    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // ✅ Save the hashed password
    const user = new User({
      role: 'supplier',
      business_name,
      email,
      phone,
      password: hashedPassword,
      pincode
    });

    await user.save();

    res.status(201).json({
      user,
      access_token: "dummy-token"
    });
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res.status(500).json({ detail: "Error creating supplier account" });
  }
});

module.exports = router;


router.get('/search', async (req, res) => {
  const { pincode } = req.query;

  try {
    if (!pincode) {
      return res.status(400).json({ message: 'Pincode is required' });
    }

    const suppliers = await User.find({ role: 'supplier', pincode });

    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers by pincode:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;