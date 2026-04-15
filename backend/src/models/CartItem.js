const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cart_id: DataTypes.UUID,
  product_id: DataTypes.UUID,
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'cart_items',
  timestamps: false,
  underscored: true,
});

module.exports = CartItem;