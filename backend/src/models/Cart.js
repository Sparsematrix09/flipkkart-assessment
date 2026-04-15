const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: DataTypes.UUID,
}, {
  tableName: 'cart',
  timestamps: false,
  underscored: true,
});

module.exports = Cart;