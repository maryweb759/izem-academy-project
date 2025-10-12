const User = require('../models/user.js');
const Recipe = require('../models/recipes.js');
const Course = require("../models/Course");
const { registerValidation } = require("../utils/validators.js");
const { successResponse, errorResponse } = require("../utils/response");
const { paginate, getPaginationMeta } = require('../utils/pagination');

const CourseEnrollment = require("../models/courseEnrollementSchema.js");
const mongoose = require('mongoose'); // if not already required

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
    // 📌 Validate request body with Joi
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { fullName, phone, password, city, courses = [], role } = req.body;

    // 📌 Check required fields
    if (!fullName || !phone || !password || !city) {
      return res.status(400).json({
        status: "error",
        message: "Veuillez remplir tous les champs obligatoires",
      });
    }

    // 📌 Check if user already exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "Le numéro de téléphone existe déjà",
      });
    }

    // 📌 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 📌 Create new user
    const user = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      city,
      role: role || "student",
      isValidated: false,
    });

    // 📌 If there are courses, create a pending enrollment request
    if (Array.isArray(courses) && courses.length > 0) {
      const validCourses = await Course.find({ _id: { $in: courses } });

      if (validCourses.length !== courses.length) {
        return res.status(400).json({
          status: "error",
          message: "Un ou plusieurs cours n'existent pas",
        });
      }

      const enrollmentRequest = new CourseEnrollment({
        user: user._id,
        courses: validCourses.map((c) => c._id),
        totalAmount: validCourses.reduce((sum, c) => sum + c.price, 0),
        status: "pending",
      });

      await enrollmentRequest.save();
    }

    // 📌 Generate token
    const token = generateToken(user._id);

    // 📌 Final response (without courses)
    res.status(201).json({
      status: "success",
      message:
        "Utilisateur créé avec succès. Demande d'inscription en attente si des cours ont été sélectionnés.",
      _id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      city: user.city,
      role: user.role,
      token,
      isValidated: user.isValidated,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({
      status: "error",
      message: "Erreur interne du serveur",
      error: error.message,
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


// GET /api/users?page=1&limit=10&search=
const getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const search = req.query.search || "";

    // Base filter: only students
    const baseFilter = {
      role: { $nin: ["teacher", "admin"] },
    };

    // Add search conditions if provided
    const filter = search
      ? {
          ...baseFilter,
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
          ],
        }
      : baseFilter;

    const totalUsers = await User.countDocuments(filter);

    // Fetch paginated users
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdOn: -1 })
      .lean();

    // Get user IDs
    const userIds = users.map(u => u._id);

    // ✅ Fetch ONLY approved enrollments for these users
    const approvedEnrollments = await CourseEnrollment.find({
      user: { $in: userIds },
      status: "approved" // ✅ Filter only approved enrollments
    })
      .populate("courses") // Populate full course details to match old format
      .lean();

    // ✅ Create a map of userId to their approved courses
    const userCoursesMap = {};
    approvedEnrollments.forEach(enrollment => {
      const userId = enrollment.user.toString();
      if (!userCoursesMap[userId]) {
        userCoursesMap[userId] = [];
      }
      // Add all courses from this enrollment
      userCoursesMap[userId].push(...enrollment.courses);
    });

    // ✅ Attach courses to users in the SAME format as old API
    const usersWithCourses = users.map(user => ({
      ...user,
      courses: userCoursesMap[user._id.toString()] || [] // Empty array if no approved courses
    }));

    res.status(200).json({
      status: "success",
      count: usersWithCourses.length,
      totalUsers,
      pagination: getPaginationMeta(page, limit, totalUsers),
      users: usersWithCourses, // Same structure as old API
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ 
      status: "error", 
      message: "Erreur interne du serveur" 
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Utilisateur introuvable",
      });
    }

    // ✅ Delete all enrollments linked to this user (any status)
    await CourseEnrollment.deleteMany({ user: id });

    // ✅ If this user is a teacher and owns courses, delete those courses too
    // (optional — only needed if teachers can own courses)
    await Course.deleteMany({ teacher: id });

    // ✅ Finally, delete the user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Utilisateur et toutes ses inscriptions supprimés avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    return res.status(500).json({
      status: "error",
      message: "Erreur interne du serveur",
      error: error.message,
    });
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
        message: "Le numéro de téléphone et le mot de passe sont obligatoires",
      });
    }

    // Vérifier si l'utilisateur existe (sans peupler les cours)
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "لم يتم العثور على المستخدم",
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "كلمة المرور غير صحيحة",
      });
    }

    // Générer un token
    const token = generateToken(user._id);

    // ✅ Retourner uniquement les champs nécessaires (sans courses)
    return res.json({
      status: "success",
      _id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      city: user.city,
      role: user.role,
      token,
      isValidated: user.isValidated,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
};

const addCourseToUser = async (req, res) => {
  try {
    const { userId, courseIds } = req.body;

    // basic presence checks
    if (!userId || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "userId et courseIds (array) sont obligatoires"
      });
    }

    // validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "userId invalide"
      });
    }

    // Validate each courseId: must be non-null string and valid ObjectId
    const invalidCourseEntries = courseIds
      .map((id, idx) => ({ id, idx }))
      .filter(item => !item.id || typeof item.id !== "string" || !mongoose.Types.ObjectId.isValid(item.id));

    if (invalidCourseEntries.length > 0) {
      // build a readable list of invalid entries to help the client debug
      const invalidCourseIds = invalidCourseEntries.map(e =>
        e.id === null ? `null at index ${e.idx}` : `${String(e.id)} at index ${e.idx}`
      );

      return res.status(400).json({
        status: "error",
        message: "courseIds must be an array of valid course id strings",
        invalidCourseIds
      });
    }

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Utilisateur non trouvé"
      });
    }

    // dedupe courseIds (client might accidentally send duplicates)
    const uniqueCourseIds = [...new Set(courseIds)];

    // load existing course docs (only titles needed)
    const courses = await Course.find({ _id: { $in: uniqueCourseIds } }).select("title");
    const courseMap = new Map(courses.map(c => [c._id.toString(), c.title]));

    const existingUserCourseIds = new Set(user.courses.map(c => c.toString()));

    const newCourses = [];
    const skippedCourses = [];

    for (const cid of uniqueCourseIds) {
      const title = courseMap.get(cid);
      if (!title) {
        // course not found in DB -> ignore (keeps previous behaviour of skipping non-existing courses)
        continue;
      }

      if (existingUserCourseIds.has(cid)) {
        skippedCourses.push(title);
        continue;
      }

      // add course id to user (store as ObjectId)
      user.courses.push(new mongoose.Types.ObjectId(cid));
      newCourses.push(title);
      existingUserCourseIds.add(cid);
    }

    // Save only if we added something
    if (newCourses.length > 0) {
      await user.save();
    }

    return res.status(200).json({
      status: "completed successfully",
      message: "Cours ajouté avec succès",
      newCourses,
      skippedCourses
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Erreur lors de l'ajout des cours",
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