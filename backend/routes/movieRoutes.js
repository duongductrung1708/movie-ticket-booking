const express = require("express");
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  createMovies,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

// Movie Routes
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.post("/import", createMovies);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;
