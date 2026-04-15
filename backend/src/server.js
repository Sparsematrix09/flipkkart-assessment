const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Flipkart Clone API is running' });
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log(' Database connected successfully'))
  .catch(err => console.log('Database connection error:', err));

app.listen(PORT, () => {
  console.log(`server runs on http://localhost:${PORT}`);
});