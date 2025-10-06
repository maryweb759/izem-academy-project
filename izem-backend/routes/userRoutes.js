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
    getFavorites, 
    updateValidate,
    getAllUsers,
    deleteUser,
    addCourseToUser,
    updatePassword
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/AuthentificationHandler.js');

// Routes d'authentification (non protégées)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes de profil (protégées)
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile/:id', protect, updateUserProfile);
router.put("/:id/validate",protect, updateValidate);
router.get("/",protect, admin, getAllUsers);
router.delete("/:id",protect, admin, deleteUser);
router.post("/addCourse",protect, admin, addCourseToUser);
router.put("/:id/password",protect, admin, updatePassword);

// Routes des favoris (protégées)
router.post('/favorites/:id', protect, addFavorite);
router.delete('/favorites/:id', protect, removeFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;