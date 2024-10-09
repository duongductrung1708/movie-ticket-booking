const express = require('express');
const router = express.Router();
const TheaterController = require('../controllers/theaterController');

router.post('/', TheaterController.create);
router.get('/', TheaterController.getAll);
router.post('/test',TheaterController.createTheater)
router.get('/:id', TheaterController.getById);
router.put('/:id', TheaterController.update);
router.delete('/:id', TheaterController.delete);
router.get('/:id/showtimes', TheaterController.getShowtimesByTheater);

module.exports = router;
