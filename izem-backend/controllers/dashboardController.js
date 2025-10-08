const User = require("../models/Course.js");
const CourseEnrollment = require("../models/courseEnrollementSchema.js");
const Course = require("../models/Course");


exports.getDashboardData = async (req, res) => {
  try {
    // Get all metrics in parallel for better performance
    const [
      totalCourses,
      totalEnrollmentRequests,
      studentsCount,
      totalIncome
    ] = await Promise.all([
      // 1. Total Courses
      Course.countDocuments(),

      // 2. Total Enrollment Requests (all statuses)
      CourseEnrollment.countDocuments(),

      // 3. Total Users (excluding admin and teacher roles)
      User.countDocuments({
        role: { $nin: ["admin", "teacher"] }
      }),

      // 4. Total Income (sum of approved enrollment amounts)
      CourseEnrollment.aggregate([
        {
          $match: { status: "approved" }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" }
          }
        }
      ])
    ]);

    // Extract total income from aggregation result
    const income = totalIncome.length > 0 ? totalIncome[0].total : 0;

    // Additional useful metrics (optional)
    const [pendingRequests, approvedRequests, rejectedRequests] = 
      await Promise.all([
        CourseEnrollment.countDocuments({ status: "pending" }),
        CourseEnrollment.countDocuments({ status: "approved" }),
        CourseEnrollment.countDocuments({ status: "rejected" })
      ]);

    return res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalEnrollmentRequests,
        totalStudents: studentsCount,
        totalIncome: income,
        // Breakdown of enrollment requests
        enrollmentBreakdown: {
          pending: pendingRequests,
          approved: approvedRequests,
          rejected: rejectedRequests
        }
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message
    });
  }
};

/**
 * @route   GET /api/dashboard/detailed
 * @desc    Get detailed dashboard with recent activities
 * @access  Admin only
 */
exports.getDetailedDashboard = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const [
      basicStats,
      recentEnrollments,
      topCourses,
      recentStudents
    ] = await Promise.all([
      // Get basic stats
      getDashboardStats(),

      // Recent enrollment requests
      CourseEnrollment.find()
        .populate("user", "fullName phone")
        .populate("courses", "title code price")
        .sort({ requestedAt: -1 })
        .limit(parseInt(limit)),

      // Top courses by enrollment
      CourseEnrollment.aggregate([
        { $match: { status: "approved" } },
        { $unwind: "$courses" },
        { 
          $group: {
            _id: "$courses",
            enrollmentCount: { $sum: 1 }
          }
        },
        { $sort: { enrollmentCount: -1 } },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "courseDetails"
          }
        },
        { $unwind: "$courseDetails" }
      ]),

      // Recently registered students
      User.find({ 
        role: { $nin: ["admin", "teacher"] } 
      })
        .select("fullName phone city createdOn isValidated")
        .sort({ createdOn: -1 })
        .limit(parseInt(limit))
    ]);

    return res.status(200).json({
      success: true,
      data: {
        ...basicStats,
        recentEnrollments,
        topCourses,
        recentStudents
      }
    });

  } catch (error) {
    console.error("Detailed Dashboard API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch detailed dashboard data",
      error: error.message
    });
  }
};

// Helper function to get basic stats
async function getDashboardStats() {
  const [totalCourses, totalEnrollmentRequests, studentsCount, totalIncome] = 
    await Promise.all([
      Course.countDocuments(),
      CourseEnrollment.countDocuments(),
      User.countDocuments({ role: { $nin: ["admin", "teacher"] } }),
      CourseEnrollment.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

  return {
    totalCourses,
    totalEnrollmentRequests,
    totalStudents: studentsCount,
    totalIncome: totalIncome.length > 0 ? totalIncome[0].total : 0
  };
}