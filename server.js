const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const supplierRoutes = require('./routes/supplier');
const orderRoutes = require('./routes/orders');
const bulkOrdersRoute = require('./routes/bulkOrders');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.use('/api/auth/vendor', require('./routes/vendor'));
app.use('/api/vendor', require('./routes/vendor'));
app.use('/api/auth/supplier', require('./routes/supplier'));
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bulk-orders', bulkOrdersRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
