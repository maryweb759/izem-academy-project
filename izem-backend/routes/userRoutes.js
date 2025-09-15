const express = require('express');
const User = require('../models/user.js');
const userController = require('../controllers/userController.js');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile,
    addFavorite,
    removeFavorite,
    getFavorites
} = require('../controllers/userController');
const { protect } = require('../middleware/AuthentificationHandler');

// Routes d'authentification (non protégées)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes de profil (protégées)
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile/:id', protect, updateUserProfile);

// Routes des favoris (protégées)
router.post('/favorites/:id', protect, addFavorite);
router.delete('/favorites/:id', protect, removeFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;