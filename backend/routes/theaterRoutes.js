const express = require('express');
const router = express.Router();
const TheaterController = require('../controllers/theaterController');
const multer = require('multer');
const path = require('path');


// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/'); // Directory where images will be saved
  },
  filename: function (req, file, cb) {
    // Use the original name or generate a unique name
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
});

// Middleware for handling multiple file fields
const uploadFields = upload.fields([
  { name: 'theaterImage', maxCount: 1 }, // One file for the theater image
  { name: 'roomImages' } // Multiple files for room images
]);

const updateFields = upload.any();

router.post('/', TheaterController.create);
router.get('/', TheaterController.getAll);
router.post('/rooms', uploadFields, TheaterController.createTheater)
router.get('/rooms', TheaterController.getTheater)
router.get('/:id', TheaterController.getById);
router.put('/:id', updateFields, TheaterController.update);
router.delete('/:id', TheaterController.delete);
router.get('/:id/showtimes', TheaterController.getShowtimesByTheater);

module.exports = router;
