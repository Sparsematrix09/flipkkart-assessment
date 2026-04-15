const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: DataTypes.UUID,
  address_id: DataTypes.UUID,
  total_amount: DataTypes.DECIMAL(10, 2),
  status: DataTypes.STRING,
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  underscored: true,
});

module.exports = Order;