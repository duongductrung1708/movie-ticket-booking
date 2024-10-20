const express = require("express");
const middleware = require("../middleware/auth");
const router = express.Router();
const {
  getTotalValues,
  getRevenueByYear,
  getListTopBookingMoviesByMonth,
} = require("../controllers/dashboardController");

// Movie Routes
router.get("/top-movies", middleware.verifyToken, getListTopBookingMoviesByMonth);
router.get("/total-values", middleware.verifyToken, getTotalValues);
router.get("/revenue", middleware.verifyToken, getRevenueByYear);

module.exports = router;
