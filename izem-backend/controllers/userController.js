const User = require('../models/user.js');
const Recipe = require('../models/recipes.js');
const Course = require("../models/Course");
const { registerValidation } = require("../utils/validators.js");
const { successResponse, errorResponse } = require("../utils/response");

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

const registerUser = async (req, res) => {
  try {
    // 📌 Validation avec Joi
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message
      });
    }

    const { fullName, phone, password, city, courses, role } = req.body;

    // 📌 Vérification des champs obligatoires
    if (!fullName || !phone || !password || !city || !courses) {
      return res.status(400).json({
        status: "error",
        message: "Veuillez remplir tous les champs obligatoires"
      });
    }

    // 📌 Vérification des cours (doivent exister dans la table Course)
    if (courses && courses.length > 0) {
      const validCourses = await Course.find({ _id: { $in: courses } });

      if (validCourses.length !== courses.length) {
        return res.status(400).json({
          status: "error",
          message: "Un ou plusieurs cours n'existent pas"
        });
      }
    }

    // 📌 Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "Le numéro de téléphone existe déjà"
      });
    }

    // 📌 Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 📌 Création de l’utilisateur
    let user = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      city,
      courses,
      role: role || "student",
       isValidated: false
    });

    // 📌 Peupler les cours avec leurs objets complets
    user = await user.populate("courses");

    // 📌 Générer un token JWT
    const token = generateToken(user._id);

    res.status(201).json({
      status: "success",
      message: "Utilisateur créé avec succès",
      user: {
        _id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        city: user.city,
        courses: user.courses, // objets complets
        role: user.role,
        isValidated: user.isValidated
      },
      token
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur interne du serveur"
    });
  }
};

// controllers/userController.js
const updateValidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValidated } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isValidated },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Utilisateur introuvable"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Attribut 'validate' mis à jour avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du validate :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur interne du serveur"
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("courses");
    res.status(200).json({
      status: "success",
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ status: "error", message: "Erreur interne du serveur" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "Utilisateur introuvable" });
    }

    // Delete courses owned by this user
    await Course.deleteMany({ _id: { $in: user.courses } });

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Utilisateur et ses cours supprimés avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).json({ status: "error", message: "Erreur interne du serveur" });
  }
};

// Authentifier un utilisateur
const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Vérifier que le téléphone et le mot de passe sont fournis
        if (!phone || !password) {
            return res.status(400).json({
                status: "error",
                message: "Le numéro de téléphone et le mot de passe sont obligatoires"
            });
        }

        // Vérifier si l'utilisateur existe + peupler les cours
        const user = await User.findOne({ phone }).populate("courses");

        if (!user) {
            return res.status(401).json({
                status: "error", 
                message: 'Utilisateur non trouvé' 
            });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                status: "error",
                message: 'Mot de passe incorrect' 
            });
        }

        // Générer un token 
        const token = generateToken(user._id);

        return res.json({
            status: "success",
            _id: user._id,
            fullName: user.fullName,
            phone: user.phone,
            city: user.city,
            courses: user.courses, // 👉 ici tu auras les objets complets des cours
            role: user.role,
            token: token,
            isValidated: user.isValidated
        });
    } catch (error) {
        return res.status(500).json({ 
            status: "error",
            message: 'Erreur lors de la connexion',
            error: error.message 
        });
    }
};
const addCourseToUser = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({
                status: "error",
                message: "userId et courseId sont obligatoires"
            });
        }

        // Vérifier si le user existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Utilisateur non trouvé"
            });
        }

        // Vérifier si le cours existe
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                status: "error",
                message: "Cours non trouvé"
            });
        }

        // Vérifier si le cours est déjà ajouté
        if (user.courses.includes(courseId)) {
            return res.status(400).json({
                status: "error",
                message: "Ce cours est déjà dans la liste de l'utilisateur"
            });
        }

        // Ajouter le cours
        user.courses.push(courseId);
        await user.save();

        // Récupérer uniquement les cours peuplés
        const populatedCourses = await User.findById(userId)
            .populate("courses", "-__v") // populate sans __v
            .select("courses"); // ne renvoyer que courses

        return res.status(200).json({
            status: "success",
            message: "Cours ajouté avec succès",
            courses: populatedCourses.courses
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Erreur lors de l'ajout du cours",
            error: error.message
        });
    }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return errorResponse(res, 400, "Password must be at least 6 characters long");
    }

// 📌 Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, "Password updated successfully");
  } catch (err) {
    return errorResponse(res, 500, err.message);
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
exports.updateValidate = updateValidate;
exports.getAllUsers = getAllUsers;
exports.deleteUser = deleteUser;
exports.addCourseToUser = addCourseToUser;
exports.updatePassword = updatePassword;