const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../db');

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

module.exports = router;