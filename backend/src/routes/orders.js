const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/index.js');

const DEFAULT_USER_ID = '11111111-1111-1111-1111-111111111111';

//create orders
router.post('/create', async (req, res) => {
  try {
    const { address, cartItems, totalAmount } = req.body;
    
    //saving address
    const addressResult = await sequelize.query(`
      INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, pincode)
      VALUES (:userId, :fullName, :phone, :address, :city, :state, :pincode)
      RETURNING id
    `, {
      replacements: {
        userId: DEFAULT_USER_ID,
        ...address,
      },
      type: QueryTypes.INSERT,
    });
    
    const addressId = addressResult[0][0].id;
    
    //creating order
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
    
    // creating order items & updating stock
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
      
      //update stocks
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
    
    // clear d cart
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
    res.status(500).json({ error: error.message });
  }
});

//get order history for the default user
router.get('/history', async (req, res) => {
  try {
    const orders = await sequelize.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        a.full_name,
        a.address_line,
        a.city,
        a.state,
        a.pincode,
        a.phone,
        (
          SELECT json_agg(
            json_build_object(
              'product_id', oi.product_id,
              'product_name', p.name,
              'quantity', oi.quantity,
              'price', oi.price,
              'subtotal', (oi.quantity * oi.price),
              'image', (
                SELECT image_url FROM product_images 
                WHERE product_id = oi.product_id 
                LIMIT 1
              )
            )
            ORDER BY oi.id
          )
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ) as items
      FROM orders o
      JOIN addresses a ON o.address_id = a.id
      WHERE o.user_id = :userId
      ORDER BY o.created_at DESC
    `, {
      replacements: { userId: DEFAULT_USER_ID },
      type: QueryTypes.SELECT,
    });
    
    // parse the JSON items for each order
    const parsedOrders = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
      created_at: new Date(order.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
    
    res.json(parsedOrders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: error.message });
  }
});

//get single order details by ID
router.get('/history/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await sequelize.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        a.full_name,
        a.address_line,
        a.city,
        a.state,
        a.pincode,
        a.phone,
        (
          SELECT json_agg(
            json_build_object(
              'product_id', oi.product_id,
              'product_name', p.name,
              'quantity', oi.quantity,
              'price', oi.price,
              'subtotal', (oi.quantity * oi.price),
              'image', (
                SELECT image_url FROM product_images 
                WHERE product_id = oi.product_id 
                LIMIT 1
              )
            )
          )
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ) as items
      FROM orders o
      JOIN addresses a ON o.address_id = a.id
      WHERE o.user_id = :userId AND o.id = :orderId
    `, {
      replacements: { userId: DEFAULT_USER_ID, orderId },
      type: QueryTypes.SELECT,
    });
    
    if (!order.length) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const parsedOrder = {
      ...order[0],
      items: typeof order[0].items === 'string' ? JSON.parse(order[0].items) : order[0].items,
      created_at: new Date(order[0].created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    res.json(parsedOrder);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;