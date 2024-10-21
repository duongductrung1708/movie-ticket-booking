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
const multer = require("multer");
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
});

// Sửa lại đoạn upload fields thành mảng
router.post("/", upload.single('image'), createMovie);
router.put("/:id", upload.single('image'), updateMovie);

// Movie Routes
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.post("/import", createMovies);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;
