// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const { getSummary } = require("../controllers/dashboardController");

// If you have an auth middleware and want to protect this route, apply it here.
// Example: const { protect } = require('../middleware/authMiddleware')
// router.get('/summary', protect, getSummary)

router.get("/summary", getSummary);

module.exports = router;
