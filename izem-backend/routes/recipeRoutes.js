const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Route pour rechercher des recettes
router.get('/search', recipeController.searchRecipes);

// Route pour filtrer par origine
router.get('/origin/:origin', recipeController.getRecipesByOrigin);
const { protect } = require('../middleware/AuthentificationHandler.js');
// Routes CRUD principales
router.get('/', protect, recipeController.getAllRecipes);
router.get('/:id', protect, recipeController.getRecipeById);
router.post('/', protect,  recipeController.createRecipe);
router.put('/:id', protect, recipeController.updateRecipe);
router.delete('/:id', protect, recipeController.deleteRecipe);
router.get('/origin/:origin', protect, recipeController.getRecipesByOrigin);

module.exports = router;