const express = require('express');
const router = express.Router();
const {
  requestCourseEnrollment,
  getPendingEnrollments,
  processEnrollment,
  getUserEnrollments,
  getUserApprovedCourses,
  getApprovedCoursesWithPendingStatus
} = require('../controllers/courseEnrollementController'); // adjust path as needed
const { protect, admin } = require('../middleware/AuthentificationHandler.js');

// Middleware for admin authentication (you'll need to implement this)
const requireAdmin = (req, res, next) => {
  // Check if user is admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      status: "error",
      message: "Accès refusé - Admin requis"
    });
  }
  next();
};

// Middleware for user authentication (you'll need to implement this)
const requireAuth = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Authentication requise"
    });
  }
  next();
};

// USER ROUTES
// Request course enrollment (replaces your old addCourseToUser)
router.post('/enrollment/request', requestCourseEnrollment);

// Get user's enrollment history
router.get('/enrollment/user/:userId/history', protect, getUserEnrollments);

// getApprovedCoursesWithPendingStatus
router.get("/user/:userId/approved-courses",protect,admin, getApprovedCoursesWithPendingStatus);

// Get user's approved courses
router.get('/users/:userId/courses', protect, getUserApprovedCourses);

// ADMIN ROUTES
// Get pending enrollments for admin dashboard
router.get('/admin/enrollments/pending', protect,admin, getPendingEnrollments);

// Process enrollment (approve/reject)
router.patch('/admin/enrollment/:enrollmentId/process', protect,admin, processEnrollment);


// Get all enrollments (with optional status filter)
router.get('/admin/enrollments', requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const enrollments = await CourseEnrollment.find(query)
      .populate("user", "fullName phone city")
      .populate("courses", "title code price")
      .populate("processedBy", "fullName")
      .sort({ requestedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CourseEnrollment.countDocuments(query);

    return res.status(200).json({
      status: "success",
      data: enrollments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des demandes",
      error: error.message
    });
  }
});

module.exports = router;