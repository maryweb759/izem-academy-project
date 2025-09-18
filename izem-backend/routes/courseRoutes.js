const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// Routes
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);
router.get("/", courseController.getAllCourses);

module.exports = router;
