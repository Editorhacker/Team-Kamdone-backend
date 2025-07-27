const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const { identifier, password, role } = req.body;

  try {
    // ✅ 1. Build query based on role
    let query = { role };

    // Vendor uses phone, supplier can use email or phone
    if (role === 'vendor') {
      query.phone = identifier;
    } else {
      query.$or = [{ email: identifier }, { phone: identifier }];
    }

    // ✅ 2. Find user
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    // ✅ 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    // ✅ 4. Return success
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        role: user.role,
        name: user.name || user.business_name,
        phone: user.phone,
        email: user.email,
        pincode: user.pincode
      },
      access_token: "dummy-token"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error during login" });
  }
});

module.exports = router;
