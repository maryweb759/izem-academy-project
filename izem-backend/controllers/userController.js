const User = require('../models/user.js');
const Recipe = require('../models/recipes.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// Fonction pour générer un token simple (sans JWT)
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env file");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '40d'
    });
};
// Enregistrer un nouvel utilisateur
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérification des champs obligatoires
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Veuillez remplir tous les champs obligatoires' 
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (userExists) {
            return res.status(400).json({ 
                message: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà' 
            });
        }

        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer l'utilisateur
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Générer un token simple
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de l\'enregistrement de l\'utilisateur',
            error: error.message 
        });
    }
};

// Authentifier un utilisateur
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier que l'email et le mot de passe sont fournis
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Veuillez fournir un email et un mot de passe' 
            });
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ 
                message: 'Utilisateur non trouvé' 
            });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Mot de passe incorrect' 
            });
        }

        // Générer un token 
        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la connexion',
            error: error.message 
        });
    }
};

// Obtenir le profil de l'utilisateur
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                message: 'Utilisateur non trouvé' 
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération du profil',
            error: error.message 
        });
    }
};

// Mettre à jour le profil de l'utilisateur
const updateUserProfile = async (req, res) => {
    try {
        // Pour l'instant, sans middleware d'authentification
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ 
                message: 'Utilisateur non trouvé' 
            });
        }

    
        
        // Mettre à jour l'email si fourni
        if (req.body.email) {
            // Vérifier que le nouvel email n'est pas déjà utilisé
            const emailExists = await User.findOne({ 
                email: req.body.email, 
                _id: { $ne: user._id } 
            });

            if (emailExists) {
                return res.status(400).json({ 
                    message: 'Cet email est déjà utilisé' 
                });
            }

            user.email = req.body.email;
        }

        // Mettre à jour le mot de passe 
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message 
        });
    }
};
const addFavorite = asyncHandler(async (req, res) => {
    const { id: recipeId } = req.params;

    // Vérifier si la recette existe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        res.status(404);
        throw new Error('Recette non trouvée');
    }

    // Vérifier si déjà dans les favoris
    const isAlreadyFavorite = req.user.favoriteRecipes.some(
        favId => favId.toString() === recipeId
    );
    
    if (isAlreadyFavorite) {
        res.status(400);
        throw new Error('Cette recette est déjà dans vos favoris');
    }

    // Ajouter aux favoris
    req.user.favoriteRecipes.push(recipe._id);
    await req.user.save();

    res.status(201).json({
        message: 'Recette ajoutée aux favoris',
        favoriteRecipes: req.user.favoriteRecipes
    });
});

const removeFavorite = asyncHandler(async (req, res) => {
    const { id: recipeId } = req.params;

    // Supprimer la recette des favoris
    req.user.favoriteRecipes = req.user.favoriteRecipes.filter(
        favorite => favorite.toString() !== recipeId
    );

    await req.user.save();

    res.status(200).json({
        message: 'Recette retirée des favoris',
        favoriteRecipes: req.user.favoriteRecipes
    });
});

const getFavorites = asyncHandler(async (req, res) => {
    // Populate pour obtenir les détails complets des recettes
    const userWithFavorites = await User.findById(req.user.id)
        .populate('favoriteRecipes');

    res.status(200).json(userWithFavorites.favoriteRecipes);
});

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;
exports.addFavorite = addFavorite;
exports.removeFavorite = removeFavorite;
exports.getFavorites = getFavorites;