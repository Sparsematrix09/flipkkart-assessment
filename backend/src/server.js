const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { QueryTypes } = require('sequelize');
const sequelize = require('./db/index.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow all origins for testing (temporary)
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: 'Database connected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Categories Route - Add error logging
app.get('/api/categories', async (req, res) => {
  try {
    console.log('Fetching categories...');
    const categories = await sequelize.query(`
      SELECT * FROM categories ORDER BY id
    `, {
      type: QueryTypes.SELECT,
    });
    console.log(`Found ${categories.length} categories`);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Products Route
app.get('/api/products', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = `
      SELECT p.*, c.name as category_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const replacements = {};
    
    if (search) {
      query += ` AND p.name ILIKE :search`;
      replacements.search = `%${search}%`;
    }
    
    if (category) {
      query += ` AND p.category_id = :category`;
      replacements.category = category;
    }
    
    const products = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Single Product Route
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await sequelize.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = :id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT,
    });
    
    if (!product.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const images = await sequelize.query(`
      SELECT image_url FROM product_images WHERE product_id = :id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT,
    });
    
    const specs = await sequelize.query(`
      SELECT spec_key, spec_value FROM product_specs WHERE product_id = :id
    `, {
      replacements: { id: req.params.id },
      type: QueryTypes.SELECT,
    });
    
    res.json({
      ...product[0],
      images: images.map(img => img.image_url),
      specifications: specs,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cart Routes (add your existing cart routes here)
const DEFAULT_USER_ID = '11111111-1111-1111-1111-111111111111';

app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await sequelize.query(`
      SELECT ci.id, ci.quantity, 
             p.id as product_id, p.name, p.price, p.stock,
             (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      JOIN cart c ON ci.cart_id = c.id
      WHERE c.user_id = :userId
    `, {
      replacements: { userId: DEFAULT_USER_ID },
      type: QueryTypes.SELECT,
    });
    
    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    
    res.json({
      items: cartItems,
      subtotal: subtotal,
      total: subtotal,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add to cart route
app.post('/api/cart/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const cart = await sequelize.query(`
      SELECT id FROM cart WHERE user_id = :userId
    `, {
      replacements: { userId: DEFAULT_USER_ID },
      type: QueryTypes.SELECT,
    });
    
    const cartId = cart[0].id;
    
    const existing = await sequelize.query(`
      SELECT id, quantity FROM cart_items 
      WHERE cart_id = :cartId AND product_id = :productId
    `, {
      replacements: { cartId, productId },
      type: QueryTypes.SELECT,
    });
    
    if (existing.length > 0) {
      await sequelize.query(`
        UPDATE cart_items SET quantity = quantity + :quantity
        WHERE cart_id = :cartId AND product_id = :productId
      `, {
        replacements: { quantity, cartId, productId },
        type: QueryTypes.UPDATE,
      });
    } else {
      await sequelize.query(`
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES (:cartId, :productId, :quantity)
      `, {
        replacements: { cartId, productId, quantity },
        type: QueryTypes.INSERT,
      });
    }
    
    res.json({ message: 'Added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update cart quantity
app.put('/api/cart/update/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    await sequelize.query(`
      UPDATE cart_items SET quantity = :quantity WHERE id = :itemId
    `, {
      replacements: { quantity, itemId: req.params.itemId },
      type: QueryTypes.UPDATE,
    });
    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
app.delete('/api/cart/remove/:itemId', async (req, res) => {
  try {
    await sequelize.query(`
      DELETE FROM cart_items WHERE id = :itemId
    `, {
      replacements: { itemId: req.params.itemId },
      type: QueryTypes.DELETE,
    });
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create order
app.post('/api/orders/create', async (req, res) => {
  try {
    const { address, cartItems, totalAmount } = req.body;
    
    const addressResult = await sequelize.query(`
      INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, pincode)
      VALUES (:userId, :fullName, :phone, :address, :city, :state, :pincode)
      RETURNING id
    `, {
      replacements: {
        userId: DEFAULT_USER_ID,
        fullName: address.fullName,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      type: QueryTypes.INSERT,
    });
    
    const addressId = addressResult[0][0].id;
    
    const orderResult = await sequelize.query(`
      INSERT INTO orders (user_id, address_id, total_amount, status)
      VALUES (:userId, :addressId, :total, 'placed')
      RETURNING id
    `, {
      replacements: {
        userId: DEFAULT_USER_ID,
        addressId,
        total: totalAmount,
      },
      type: QueryTypes.INSERT,
    });
    
    const orderId = orderResult[0][0].id;
    
    for (const item of cartItems) {
      await sequelize.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (:orderId, :productId, :quantity, :price)
      `, {
        replacements: {
          orderId,
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
        },
        type: QueryTypes.INSERT,
      });
      
      await sequelize.query(`
        UPDATE products SET stock = stock - :quantity WHERE id = :productId
      `, {
        replacements: {
          quantity: item.quantity,
          productId: item.product_id,
        },
        type: QueryTypes.UPDATE,
      });
    }
    
    await sequelize.query(`
      DELETE FROM cart_items WHERE cart_id = (
        SELECT id FROM cart WHERE user_id = :userId
      )
    `, {
      replacements: { userId: DEFAULT_USER_ID },
      type: QueryTypes.DELETE,
    });
    
    res.json({ orderId, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test database connection on startup
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.log('❌ Database connection error:', err.message));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});