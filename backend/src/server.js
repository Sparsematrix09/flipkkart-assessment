const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./db/index.js');

//import route files
const categoriesRoutes = require('./routes/categories.js');
const productsRoutes = require('./routes/products.js');
const cartRoutes = require('./routes/cart.js');
const ordersRoutes = require('./routes/orders.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// health
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

//use modular routes
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

// db connection test on startup
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.log('❌ Database connection error:', err.message));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});