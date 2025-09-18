const Course = require("../models/Course");
const { successResponse, errorResponse } = require("../utils/response");

// 1 - Create course
exports.createCourse = async (req, res) => {
  try {
    const { code, title, price } = req.body;

    if (!code || !title || !price) {
      return errorResponse(res, 400, "All fields are required");
    }

    const newCourse = new Course({ code, title, price });
    await newCourse.save();

    const allCourses = await Course.find();
    return successResponse(res, 201, "Course created successfully", allCourses);
  } catch (err) {
          return errorResponse(res, 500, err.message);

  }
};

// 2 - Update course
exports.updateCourse = async (req, res) => {
  try {
    const { code, title, price } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { code, title, price },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return errorResponse(res, 404, "Course not found");
    }

    return successResponse(res, 200, "Course updated successfully", updatedCourse);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// 3 - Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return errorResponse(res, 404, "Course not found");
    }

    return successResponse(res, 200, "Course deleted successfully");
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// 4 - Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return successResponse(res, 200, "Courses fetched successfully", courses);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};
