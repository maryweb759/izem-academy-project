const Course = require("../models/Course.js");
const { successResponse, errorResponse } = require("../utils/response.js");
const User = require('../models/user.js');
const mongoose = require('mongoose'); // if not already required
const CourseEnrollment = require("../models/courseEnrollementSchema.js");

// 2. User requests to purchase courses (replaces addCourseToUser)
const requestCourseEnrollment = async (req, res) => {
  try {
    const { userId, courseIds } = req.body;

    // Basic validation
    if (!userId || !Array.isArray(courseIds) || courseIds.length === 0) {
      return errorResponse(res, 400, "userId et courseIds (array) sont obligatoires");
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse(res, 400, "userId invalide");
    }

    // Validate courseIds
    const invalidCourseEntries = courseIds
      .map((id, idx) => ({ id, idx }))
      .filter(item => !item.id || typeof item.id !== "string" || !mongoose.Types.ObjectId.isValid(item.id));

    if (invalidCourseEntries.length > 0) {
      const invalidCourseIds = invalidCourseEntries.map(e =>
        e.id === null ? `null at index ${e.idx}` : `${String(e.id)} at index ${e.idx}`
      );

      return errorResponse(
        res,
        400,
        "courseIds must be an array of valid course id strings",
        { invalidCourseIds }
      );
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, "Utilisateur non trouvé");
    }

    // Dedupe courseIds
    const uniqueCourseIds = [...new Set(courseIds)];

    // Find courses and calculate total amount
    const courses = await Course.find({ _id: { $in: uniqueCourseIds } });
    
    if (courses.length !== uniqueCourseIds.length) {
      return errorResponse(res, 404, "Un ou plusieurs cours n'existent pas");
    }

    // Separate already enrolled courses from new courses
    const existingUserCourseIds = new Set(user.courses.map(c => c.toString()));
    
    const skippedCourses = [];
    const newCoursesToRequest = [];

    courses.forEach(course => {
      if (existingUserCourseIds.has(course._id.toString())) {
        skippedCourses.push(course.title);
      } else {
        newCoursesToRequest.push(course);
      }
    });

    // If no new courses to request
    if (newCoursesToRequest.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Tous les cours demandés sont déjà dans votre liste",
        skippedCourses: skippedCourses
      });
    }

    // Check for pending requests for the new courses only
    const newCourseIds = newCoursesToRequest.map(c => c._id.toString());
    const existingPendingRequest = await CourseEnrollment.findOne({
      user: userId,
      status: "pending",
      courses: { $in: newCourseIds }
    });

    if (existingPendingRequest) {
      return errorResponse(res, 400, "Une demande d'inscription est déjà en attente pour certains de ces cours");
    }

    // Calculate total amount for new courses only
    const totalAmount = newCoursesToRequest.reduce((sum, course) => sum + course.price, 0);

    // Create enrollment request for new courses only
    const enrollmentRequest = new CourseEnrollment({
      user: userId,
      courses: newCourseIds.map(id => new mongoose.Types.ObjectId(id)),
      totalAmount: totalAmount
    });

    await enrollmentRequest.save();

    // Always return this format with both arrays (even if empty)
    return res.status(201).json({
      status: "success",
      message: "Demande soumise pour les nouveaux cours. Certains cours sont déjà dans votre liste.",
      requestedCourses: newCoursesToRequest.map(c => c.title),
      totalAmount: totalAmount,
      skippedCourses: skippedCourses
    });

  } catch (error) {
        console.error("Error in requestCourseEnrollment:", error); // Add logging for debugging

     return errorResponse(res, 500, "Erreur lors de la soumission de la demande", {
      error: error.message
    });
   
  }
};



// 3. Admin API to get pending enrollment requests
const getPendingEnrollments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pendingEnrollments = await CourseEnrollment.find({ status: "pending" })
      .populate("user", "fullName phone city")
      .populate("courses", "title code price")
      .sort({ requestedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CourseEnrollment.countDocuments({ status: "pending" });

    return successResponse(res, 200, "Demandes en attente récupérées avec succès", {
      data: pendingEnrollments,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit, 10)
      }
    });

  } catch (error) {
    return errorResponse(res, 500, "Erreur lors de la récupération des demandes", {
      error: error.message
    });
  }
};


// 4. Admin API to approve/reject enrollment
const processEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { action, rejectionReason } = req.body; // action: "approve" or "reject"
    const adminId = req.user.id; // Assuming you have admin auth middleware

    // Validate input
    if (!["approve", "reject"].includes(action)) {
      return errorResponse(res, 400, "Action doit être 'approve' ou 'reject'");
    }

    if (action === "reject" && !rejectionReason) {
      return errorResponse(res, 400, "Raison de rejet requise");
    }

    // Find enrollment request
    const enrollment = await CourseEnrollment.findById(enrollmentId)
      .populate("user", "fullName courses")
      .populate("courses", "title code");

    if (!enrollment) {
      return errorResponse(res, 404, "Demande d'inscription non trouvée");
    }

    if (enrollment.status !== "pending") {
      return errorResponse(res, 400, "Cette demande a déjà été traitée");
    }

    if (action === "approve") {
      // Add courses to user's courses array
      const user = await User.findById(enrollment.user._id);
      const existingCourseIds = new Set(user.courses.map(c => c.toString()));
      
      const newCourseIds = enrollment.courses
        .filter(course => !existingCourseIds.has(course._id.toString()))
        .map(course => course._id);

      if (newCourseIds.length > 0) {
        user.courses.push(...newCourseIds);
        await user.save();
      }

      // Update enrollment status
      enrollment.status = "approved";
      enrollment.processedAt = new Date();
      enrollment.processedBy = adminId;
      await enrollment.save();

      return successResponse(res, 200, "Inscription approuvée avec succès", {
        approvedCourses: enrollment.courses.map(c => c.title)
      });

    } else { // reject
      enrollment.status = "rejected";
      enrollment.processedAt = new Date();
      enrollment.processedBy = adminId;
      enrollment.rejectionReason = rejectionReason;
      await enrollment.save();

      return successResponse(res, 200, "Inscription rejetée", {
        rejectionReason
      });
    }

  } catch (error) {
    return errorResponse(res, 500, "Erreur lors du traitement de la demande", {
      error: error.message
    });
  }
};


// 5. Get user's enrollment history (for user dashboard)
const getUserEnrollments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query; // optional filter by status

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const enrollments = await CourseEnrollment.find(query)
      .populate("courses", "title code price")
      .populate("processedBy", "fullName")
      .sort({ requestedAt: -1 });

    return successResponse(res, 200, "Historique des inscriptions récupéré avec succès", {
      data: enrollments
    });

  } catch (error) {
    return errorResponse(res, 500, "Erreur lors de la récupération de l'historique", {
      error: error.message
    });
  }
};

// Get only approved courses + check if user has pending enrollments
const getApprovedCoursesWithPendingStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch approved enrollments and populate courses with all fields needed
    const approvedEnrollments = await CourseEnrollment.find({
      user: userId,
      status: "approved",
    })
      .populate("courses", "title code subtitle price __v") // ✅ added subtitle and __v
      .sort({ requestedAt: -1 });

    // Check if user has any pending enrollments
    const hasPendingCourses = await CourseEnrollment.exists({
      user: userId,
      status: "pending",
    });

    // Extract approved courses from enrollments
    const approvedCourses = approvedEnrollments.flatMap(
      (enrollment) => enrollment.courses
    );

    return successResponse(
      res,
      200,
      "Approved courses retrieved successfully",
      {
        approvedCourses,
        hasPendingCourses: Boolean(hasPendingCourses),
      }
    );
  } catch (error) {
    return errorResponse(res, 500, "Error while fetching approved courses", {
      error: error.message,
    });
  }
};



// 6. Get user's approved courses (replaces direct access to user.courses)
const getUserApprovedCourses = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "courses",
      "title code price subtitle"
    );

    if (!user) {
      return errorResponse(res, 404, "Utilisateur non trouvé");
    }

    return successResponse(
      res,
      200,
      "Cours approuvés récupérés avec succès",
      { data: user.courses }
    );

  } catch (error) {
    return errorResponse(res, 500, "Erreur lors de la récupération des cours", {
      error: error.message
    });
  }
};


// Export all functions
module.exports = {
  requestCourseEnrollment,
  getPendingEnrollments,
  processEnrollment,
  getUserEnrollments,
  getUserApprovedCourses,
  getApprovedCoursesWithPendingStatus
};