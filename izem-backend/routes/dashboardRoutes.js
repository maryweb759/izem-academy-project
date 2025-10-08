const express = require("express");
const router = express.Router();
const dashboardRoutes = require("../controllers/dashboardController.js");

const { protect, admin } = require('../middleware/AuthentificationHandler.js');

// Routes
router.get("/dashboard",protect, dashboardRoutes.getDashboardData);

module.exports = router;
