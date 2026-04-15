const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../db');

router.get('/', async (req, res) => {
  try {
    const categories = await sequelize.query(`
      SELECT * FROM categories WHERE parent_id IS NULL
    `, {
      type: QueryTypes.SELECT,
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;