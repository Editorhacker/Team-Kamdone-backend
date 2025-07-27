const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // ✅ Import bcrypt

router.post('/signup', async (req, res) => {
  const { name, phone, password, pincode } = req.body;

  try {
    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // ✅ Create new user with hashed password
    const user = new User({
      role: 'vendor',
      name,
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
    console.error(error); // Optional: Debugging
    res.status(500).json({ detail: "Error creating vendor account" });
  }
});

module.exports = router;
