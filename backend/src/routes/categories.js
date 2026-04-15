const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/index.js');

router.get('/', async (req, res) => {
  try {
    const categories = await sequelize.query(`
      SELECT * FROM categories ORDER BY id
    `, {
      type: QueryTypes.SELECT,
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;