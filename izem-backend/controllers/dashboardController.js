const User = require("../models/user.js");
const CourseEnrollment = require("../models/courseEnrollementSchema.js");
const Course = require("../models/Course");


exports.getDashboardData = async (req, res) => {
  try {
    // Run all main metrics in parallel
    const [
      totalCourses,
      totalEnrollmentRequests,
      totalStudents,
      enrolledStudentsAgg,
      totalIncomeAgg,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    ] = await Promise.all([
      // 1. Total number of courses
      Course.countDocuments(),

      // 2. Total number of enrollment requests (all statuses)
      CourseEnrollment.countDocuments(),

      // 3. ✅ Total number of students
      User.countDocuments({ role: "student" }),

      // 4. ✅ Distinct students with approved enrollments
      CourseEnrollment.distinct("user", { status: "approved" }),

      // 5. ✅ Total income from approved enrollments
      CourseEnrollment.aggregate([
        { $match: { status: "approved" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),

      // 6. Breakdown counts by status
      CourseEnrollment.countDocuments({ status: "pending" }),
      CourseEnrollment.countDocuments({ status: "approved" }),
      CourseEnrollment.countDocuments({ status: "rejected" }),
    ]);

    // ✅ Fixes
    const totalIncome =
      totalIncomeAgg.length > 0 ? totalIncomeAgg[0].total : 0;

    // ✅ Enrolled students = number of unique users with approved enrollments
    const enrolledStudents = enrolledStudentsAgg.length;

    // ✅ Return final data
    return res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalEnrollmentRequests,
        totalStudents,
        enrolledStudents,
        totalIncome,
        enrollmentBreakdown: {
          pending: pendingRequests,
          approved: approvedRequests,
          rejected: rejectedRequests,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
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