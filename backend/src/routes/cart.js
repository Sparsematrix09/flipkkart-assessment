const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/index.js');

const DEFAULT_USER_ID = '11111111-1111-1111-1111-111111111111';

//get cart
router.get('/', async (req, res) => {
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
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//add to cart
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    //check stock
    const product = await sequelize.query(`
      SELECT stock FROM products WHERE id = :productId
    `, {
      replacements: { productId },
      type: QueryTypes.SELECT,
    });
    
    if (!product.length || product[0].stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    //get cart
    const cart = await sequelize.query(`
      SELECT id FROM cart WHERE user_id = :userId
    `, {
      replacements: { userId: DEFAULT_USER_ID },
      type: QueryTypes.SELECT,
    });
    
    const cartId = cart[0].id;
    
    //item exists?
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
    
    res.json({ message: 'Added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//update quantity
router.put('/update/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity < 1 || quantity > 10) {
      return res.status(400).json({ error: 'Quantity must be between 1 and 10' });
    }
    
    await sequelize.query(`
      UPDATE cart_items SET quantity = :quantity WHERE id = :itemId
    `, {
      replacements: { quantity, itemId: req.params.itemId },
      type: QueryTypes.UPDATE,
    });
    
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//remove from cart
router.delete('/remove/:itemId', async (req, res) => {
  try {
    await sequelize.query(`
      DELETE FROM cart_items WHERE id = :itemId
    `, {
      replacements: { itemId: req.params.itemId },
      type: QueryTypes.DELETE,
    });
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;