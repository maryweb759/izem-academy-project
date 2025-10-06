const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { protect, admin } = require('../middleware/AuthentificationHandler.js');

// Routes
router.post("/", protect,admin,courseController.createCourse);
router.put("/:id", protect,admin, courseController.updateCourse);
router.delete("/:id",protect,admin, courseController.deleteCourse);
router.get("/", courseController.getAllCourses);

module.exports = router;
