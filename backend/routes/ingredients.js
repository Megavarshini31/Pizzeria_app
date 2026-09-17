const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

// GET all ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create ingredient (admin/seed use)
router.post('/', async (req, res) => {
  const ingredient = new Ingredient(req.body);
  try {
    const newIngredient = await ingredient.save();
    res.status(201).json(newIngredient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
