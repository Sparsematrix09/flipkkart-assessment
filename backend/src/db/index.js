const { Sequelize } = require('sequelize');
require('dotenv').config();

// Make sure DATABASE_URL is being read
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log, // Temporarily enable logging to see errors
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false  // Important for Neon
    }
  }
});

module.exports = sequelize;