const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/index.js');

// getting filtered prod
router.get('/', async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// get one prod with details
router.get('/:id', async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;