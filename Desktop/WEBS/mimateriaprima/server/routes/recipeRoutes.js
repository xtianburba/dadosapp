// recipeRoutes.js

const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App Routes
 */

router.get('/', (req, res) => {
  recipeController.homepage(req, res);
});

module.exports = router;